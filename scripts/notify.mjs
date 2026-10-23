// Sends Telegram messages that go to many chats at once.
//   node scripts/notify.mjs changes    → change alerts (uses .out/changes.json from update.mjs)
//   node scripts/notify.mjs weekly     → the weekly timetable post (force-send now)
//   node scripts/notify.mjs tomorrow   → short evening reminder of tomorrow's first class (force-send now)
//   node scripts/notify.mjs auto       → checks Tashkent time and sends weekly/tomorrow to every chat that is due
//                                        and has not been served today. Safe to call every few minutes: before messaging a
//                                        chat it CLAIMS it in the bot's database (one atomic UPDATE per chat per day), so
//                                        even two runs overlapping in time can never send the same message twice.
//   node scripts/notify.mjs lessons    → reminders before classes + the end-of-day message, and deletes the expired ones (lessons.yml)
//   node scripts/notify.mjs broadcast  → sends the announcement queued from the Mini App's "E'lon" screen (also part of 'auto')
//   node scripts/notify.mjs announce   → broadcasts env.ANNOUNCE_TEXT to every chat (admin only, via the "Run workflow"
//                                        announce field) — also chats that never picked a group. Use "[uz] … [ru] … [en] …"
//                                        to send each chat its own language; every message gets an "Invite friends" button
//
// Env: BOT_TOKEN, WORKER_URL, ADMIN_KEY, SITE_URL, ANNOUNCE_TEXT (for 'announce'). DRY_RUN=1 prints instead of sending.

import fs from 'node:fs/promises';
import path from 'node:path';
import { daySlots, continuesPrevious, staysInRoom, pickReminderJoke, pickDayEndJoke, fmtLessonReminder, fmtDayEnd, ephemeralKeyboard, jokeText, LR_BEFORE, LR_DELETE_AFTER_START, DE_DELETE_AFTER } from '../src/lessons.mjs';
import { fmtChanges, fmtWeek, fmtWeekCaption, fmtTomorrow, fmtTomorrowFull, setSubjects, tr, tashkentNow, addDays, mondayOf, weekday, ymd, weekImgPath, noTimetable, bcMessage, parseSubject } from '../src/shared.mjs';

const { BOT_TOKEN, WORKER_URL, ADMIN_KEY } = process.env;
const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '');
const DRY = !!process.env.DRY_RUN;
const TG = process.env.TG_API || 'https://api.telegram.org';
const DATA = path.resolve('docs/data');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// FAKE_NOW (ms since epoch) is for the tests only: it pretends the run happens at that moment
const nowTk = () => tashkentNow(process.env.FAKE_NOW ? Number(process.env.FAKE_NOW) : Date.now());
const LOOKBACK_MIN = 240; // how far back a daily reminder is still sent when earlier runs missed it

/** Network blips (ECONNRESET, timeouts, 5xx) are normal on a long send — retry a few times instead of crashing the run. */
async function retrying(label, fn, tries = 5) {
  for (let i = 1; ; i++) {
    try { return await fn(); }
    catch (e) {
      if (i >= tries) throw e;
      console.warn(`${label}: ${e.cause?.code || e.message} — retry ${i}/${tries - 1}`);
      await sleep(1500 * i);
    }
  }
}

async function tg(method, body) {
  const res = await fetch(`${TG}/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function worker(pathAndQuery, body) {
  return retrying(`worker ${pathAndQuery.split('?')[0]}`, async () => {
    const res = await fetch(`${WORKER_URL.replace(/\/+$/, '')}${pathAndQuery}`, {
      method: body ? 'POST' : 'GET',
      headers: { 'X-Admin-Key': ADMIN_KEY, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`Worker ${pathAndQuery}: HTTP ${res.status} ${await res.text()}`);
    return res.json();
  });
}

/** Pages of subscribers (arrays of rows). Group chats have NEGATIVE ids (-100…), so paging must start far below zero. */
async function* subscriberPages(mode, extraQuery = '') {
  let after = -1e15;
  for (;;) {
    const page = await worker(`/internal/subs?mode=${mode}&after=${after}&limit=2000${extraQuery}`);
    if (page.rows.length) yield page.rows;
    if (!page.rows.length || page.next == null) break;
    after = page.next;
  }
}
async function* subscribers(mode, extraQuery = '') {
  for await (const rows of subscriberPages(mode, extraQuery)) for (const s of rows) yield s;
}

/**
 * Claim chats for today's message of this kind ('tmr' = daily reminder, 'wk' = weekly post). Returns the Set of chat ids
 * THIS run may message: the database hands each chat out once per day, so a second run (or a re-run) gets none of them.
 * If the claim itself fails we throw — better to skip a round than to risk sending twice.
 */
async function claim(kind, day, ids) {
  if (DRY || !ids.length) return new Set(ids);
  const r = await worker('/internal/claim', { kind, day, ids });
  return new Set(r.claimed);
}
/** Give claims back after a send that failed for a reason worth retrying (the next run picks those chats up again). */
async function unclaim(kind, day, ids) {
  if (DRY || !ids.length) return;
  try { await worker('/internal/unclaim', { kind, day, ids }); } catch (e) { console.warn('unclaim failed:', e.message); }
}

const removed = [];
const migrated = [];
let sent = 0;

/**
 * Send one message, respecting Telegram limits (~30 messages/second overall).
 * Returns true when the chat is settled (delivered, or gone for good) and false when it still needs a retry later.
 * Never throws on a network error: one dropped connection must not abort a long send half-way.
 */
let lastMessageId = null; // message id of the last successful send (lesson reminders are deleted later by it)
async function send(chatId, text, replyMarkup, photo, copy, opts = {}) {
  lastMessageId = null;
  if (DRY) {
    lastMessageId = 1;
    if (opts.out) opts.out.id = 1;
    console.log(`\n--- to ${chatId} ---\n${copy ? `[copy of message ${copy.message_id}]` : photo ? '[photo] ' + photo.photo + '\n' + photo.caption : text}`);
    sent++;
    return true;
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    let r;
    try {
      r = copy
        // an announcement made from a message the admin sent or forwarded to the admin bot: a copy of the sample in the admin's
        // chat with this bot (any kind — text, photo, video, file — and without a "forwarded from" line)
        ? await tg('copyMessage', { chat_id: chatId, from_chat_id: copy.from_chat_id, message_id: copy.message_id, reply_markup: replyMarkup })
        : photo
        ? await tg('sendPhoto', { chat_id: chatId, photo: photo.photo, caption: photo.caption, parse_mode: 'HTML', reply_markup: replyMarkup })
        : await tg('sendMessage', { chat_id: chatId, text, ...(opts.plain ? {} : { parse_mode: 'HTML' }), disable_web_page_preview: true, disable_notification: !!opts.silent, reply_markup: replyMarkup });
    } catch (e) {
      console.warn(`send ${chatId}: ${e.cause?.code || e.message} — retry ${attempt + 1}/5`);
      await sleep(2000 * (attempt + 1));
      continue;
    }
    // picture couldn't be fetched → fall back to the text version once
    if (!r.ok && photo && r.error_code === 400 && /photo|file|url|image/i.test(r.description || '')) { photo = null; attempt--; continue; }
    if (r.ok) { sent++; lastMessageId = r.result?.message_id ?? null; if (opts.out) opts.out.id = lastMessageId; await sleep(opts.pace ? 0 : 40); return true; }
    const code = r.error_code;
    const desc = r.description || '';
    if (code === 429) { await sleep(((r.parameters?.retry_after || 3) + 1) * 1000); continue; }
    if (r.parameters?.migrate_to_chat_id) {
      migrated.push([chatId, r.parameters.migrate_to_chat_id]);
      chatId = r.parameters.migrate_to_chat_id;
      continue;
    }
    if (code === 403 || /chat not found|bot was kicked|user is deactivated|have no rights/i.test(desc)) {
      removed.push(chatId);
      return true;
    }
    console.warn(`send ${chatId} failed: ${code} ${desc}`);
    return false;
  }
  return false;
}

// A subscriber follows either a student group or a teacher (chats.role); the id lives in group_id either way.
const kindOf = (sub) => (sub.role === 'teacher' ? 't' : 'g');

let botUsername = null;
async function keyboard(sub, groupId) {
  const L = tr(sub.lang);
  if (sub.kind === 'private' && SITE_URL) {
    return { inline_keyboard: [[{ text: L.btnOpenInApp, web_app: { url: `${SITE_URL}/#${kindOf(sub)}=${groupId}&l=${sub.lang}` } }]] };
  }
  // web_app buttons are not allowed in group chats → deep link into the bot instead
  if (!botUsername && !DRY) { try { botUsername = (await retrying('getMe', () => tg('getMe', {}))).result?.username; } catch {} }
  if (!botUsername) return undefined;
  return { inline_keyboard: [[{ text: L.btnOpenInApp, url: `https://t.me/${botUsername}?start=g_${groupId}` }]] };
}

const groupCache = new Map();
/** The group's (or teacher's) timetable file for this subscriber. Teachers are tagged kind:'t' for the formatters. */
async function loadGroup(sub) {
  const k = kindOf(sub);
  const key = `${k}:${sub.group_id}`;
  if (!groupCache.has(key)) {
    try {
      const obj = JSON.parse(await fs.readFile(path.join(DATA, k, `${sub.group_id}.json`), 'utf8'));
      groupCache.set(key, k === 't' ? { ...obj, kind: 't' } : obj);
    } catch { groupCache.set(key, null); }
  }
  return groupCache.get(key);
}
// The picture is drawn (in the chat's language) for the week that is on — index.imgMonday — so it is only used for that week;
// otherwise the text version goes out. Same rule as the Worker's "Week" button.
const photoUrl = (sub, g, index, monday) => (SITE_URL && (!index.weekA || index.imgMonday === ymd(monday))
  ? `${SITE_URL}/${weekImgPath(kindOf(sub), g.id, sub.lang)}?v=${g.v || index.tt?.num || ''}&w=${ymd(monday)}` : null);

async function sendChanges(index) {
  let changes = [];
  try { changes = JSON.parse(await fs.readFile('.out/changes.json', 'utf8')); } catch {}
  if (!changes.length) { console.log('No changes, nothing to send.'); return; }
  const byKey = new Map(changes.map((c) => [`${c.kind || 'g'}:${c.id}`, c]));
  for await (const sub of subscribers('alerts')) {
    const c = byKey.get(`${kindOf(sub)}:${sub.group_id}`);
    if (!c) continue;
    const g = await loadGroup(sub);
    if (!g) continue;
    await send(sub.chat_id, fmtChanges(g, index, c.days, sub.lang, c.newTT), await keyboard(sub, g.id));
  }
}

/**
 * The weekly timetable post. `day` (YYYY-MM-DD) = a scheduled run: only chats that have not had it today, each claimed
 * before sending. No `day` = a manual force-send to everyone with the weekly post on (they are then marked as served,
 * so the scheduled run does not send a second copy). Returns how many chats still need a retry.
 */
async function sendWeekly(index, day, force) {
  // Run on Sunday evening → next Monday. Any other day (a manual force-send) → this week's Monday.
  const now = nowTk();
  const monday = mondayOf(addDays(now, 1));
  let failed = 0;
  for await (const page of subscriberPages('weekly', day && !force ? `&day=${day}` : '')) {
    const todo = [];
    for (const sub of page) {
      const g = await loadGroup(sub);
      if (g && !noTimetable(g)) todo.push({ sub, g }); // a group whose timetable is not on EduPage yet gets no weekly post
    }
    const mine = force || !day ? null : await claim('wk', day, todo.map((x) => x.sub.chat_id));
    const retry = [];
    const done = [];
    for (const { sub, g } of todo) {
      if (mine && !mine.has(sub.chat_id)) continue; // another run already took this chat today
      const photo = g.lessons?.length ? photoUrl(sub, g, index, monday) : null;
      if (await send(sub.chat_id, fmtWeek(g, index, monday, sub.lang), await keyboard(sub, g.id), photo ? { photo, caption: fmtWeekCaption(g, index, monday, sub.lang) } : null)) done.push(sub.chat_id);
      else { failed++; retry.push(sub.chat_id); }
    }
    if (force && day) await claim('wk', day, done); // mark as served
    if (mine) await unclaim('wk', day, retry);
  }
  return failed;
}

/**
 * The daily "tomorrow's classes" message — once a day, at each chat's own time (chats.remind_at, default 21:00,
 * changed with /time). `window` = [from, to] in minutes after midnight limits it to the chats whose time lies in
 * (from, to] (no window = everyone who has it on, for a manual send); `day` = the date of a scheduled run: chats are
 * claimed in the bot's database before they are messaged, so nobody is served twice that day, whatever else is running.
 * Group chats get the full list of tomorrow's classes, private chats a short "first class" ping. Free days stay silent.
 * Returns { n: sent now, failed: chats that still need a retry }.
 */
async function sendTomorrow(index, window, day) {
  const now = nowTk();
  const tomorrow = addDays(now, 1);
  const q = (window ? `&from=${window[0]}&to=${window[1]}` : '') + (day ? `&day=${day}` : '');
  // Sunday evening: chats that get the weekly timetable post (it already shows Monday) skip this message,
  // so a chat still gets one message that evening, not two. Looked up only when someone is actually due.
  let skip = null;
  const mustSkip = async (chatId) => {
    if (!(window && weekday(now) === 6)) return false;
    if (!skip) { skip = new Set(); for await (const s of subscribers('weekly')) skip.add(s.chat_id); }
    return skip.has(chatId);
  };
  let n = 0, failed = 0;
  for await (const page of subscriberPages('tomorrow', q)) {
    const todo = [];
    for (const sub of page) {
      if (await mustSkip(sub.chat_id)) continue;
      const g = await loadGroup(sub);
      if (!g) continue;
      const text = sub.kind === 'private' ? fmtTomorrow(g, index, tomorrow, sub.lang) : fmtTomorrowFull(g, index, tomorrow, sub.lang);
      if (text) todo.push({ sub, g, text });
    }
    const mine = day ? await claim('tmr', day, todo.map((x) => x.sub.chat_id)) : null;
    const retry = [];
    for (const { sub, g, text } of todo) {
      if (mine && !mine.has(sub.chat_id)) continue; // another run already took this chat today
      if (await send(sub.chat_id, text, await keyboard(sub, g.id))) n++;
      else { failed++; retry.push(sub.chat_id); }
    }
    if (mine) await unclaim('tmr', day, retry);
  }
  return { n, failed };
}

/** "[uz] … [ru] … [en] …" → { uz, ru, en } (a literal \n becomes a line break). Text without markers is sent to everyone as it is. */
function announceTexts(raw) {
  const marks = [...raw.matchAll(/\[(uz|ru|en)\]/gi)];
  const clean = (t) => t.replace(/\\n/g, '\n').trim();
  if (!marks.length) return { any: clean(raw) };
  const out = {};
  marks.forEach((m, i) => { out[m[1].toLowerCase()] = clean(raw.slice(m.index + m[0].length, marks[i + 1]?.index ?? raw.length)); });
  return out;
}

async function botName() {
  if (!botUsername && !DRY) { try { botUsername = (await retrying('getMe', () => tg('getMe', {}))).result?.username; } catch {} }
  return botUsername;
}

/**
 * Admin broadcast to EVERY chat — also the private chats that never picked a group (the people who could not find theirs).
 * The text goes out in the chat's own language (see announceTexts); each message carries an "open the app" and an
 * "Invite friends" button (Telegram's share sheet with a link to the bot — to the student's group when there is one).
 */
async function sendAnnounce() {
  const raw = (process.env.ANNOUNCE_TEXT || '').trim();
  if (!raw) { console.log('No announcement text set, nothing to send.'); return; }
  const texts = announceTexts(raw);
  const bot = await botName();
  const seen = new Set();
  let n = 0;
  for await (const sub of subscribers('everyone')) {
    if (seen.has(sub.chat_id)) continue; // never twice, even if paging overlaps
    seen.add(sub.chat_id);
    const L = tr(sub.lang);
    const text = texts[sub.lang] || texts.uz || texts.any || Object.values(texts)[0];
    const g = sub.group_id ? await loadGroup(sub) : null;
    const rows = [];
    if (g) rows.push(...((await keyboard(sub, g.id))?.inline_keyboard || []));
    else if (sub.kind === 'private' && SITE_URL) rows.push([{ text: L.btnOpenInApp, web_app: { url: `${SITE_URL}/#l=${sub.lang}` } }]);
    else if (bot) rows.push([{ text: L.btnOpenInApp, url: `https://t.me/${bot}` }]);
    if (bot) {
      const link = g && kindOf(sub) === 'g' ? `https://t.me/${bot}?start=g_${g.id}` : `https://t.me/${bot}`;
      const shareText = g && kindOf(sub) === 'g' ? L.inviteShareText(g.name) : L.inviteShareGeneric;
      rows.push([{ text: L.btnInvite, url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}` }]);
    }
    if (await send(sub.chat_id, `📢 ${text}`, rows.length ? { inline_keyboard: rows } : undefined)) n++;
  }
  console.log(`announce: ${n} chats reached`);
}

/**
 * Announcements queued from the Mini App's "E'lon" screen (admin only, private chats only — see the Worker's /api/admin).
 * Takes the queued job (a lease in the database keeps two runs off the same one), sends it chat by chat in pages and reports
 * progress after every page; a chat already served is never listed again, so a re-run continues instead of repeating.
 * Cancelling in the Mini App stops it at the next page.
 */
async function sendQueuedBroadcast() {
  const { job } = await worker('/internal/broadcast/next');
  if (!job) return false;
  const bot = await botName();
  console.log(`broadcast #${job.id}: sending`);
  let after = -1e15, cancelled = false, ok = 0, bad = 0;
  while (!cancelled) {
    const msgs = []; // [chat, message id] of each copy: kept by the Worker, so "⏳ N hours" / 🗑 can delete them later
    const page = await worker(`/internal/broadcast/chats?id=${job.id}&after=${after}&limit=200`);
    if (!page.rows.length) break;
    const done = [], failed = [];
    await paced(page.rows, async (chat) => { // several at once, at Telegram's pace (one by one a big list took ~4× longer)
      const m = bcMessage(job.payload, chat, { site: SITE_URL, bot });
      const out = {};
      if (await send(chat.chat_id, m.text, m.markup, job.payload.copy ? null : m.photo, job.payload.copy, { out, pace: true })) {
        done.push(chat.chat_id);
        if (!removed.includes(chat.chat_id)) { ok++; if (out.id) msgs.push([chat.chat_id, out.id]); } else bad++;
      } else { failed.push(chat.chat_id); bad++; }
    });
    // chats that blocked the bot count as "not delivered" (failed) but are settled — they are also removed from the bot's list at the end
    const dead = new Set(removed);
    const r = await worker('/internal/broadcast/progress', { id: job.id, msgs, done: done.filter((c) => !dead.has(c)), failed: [...failed, ...done.filter((c) => dead.has(c))] });
    if (r.status === 'cancelled') { cancelled = true; console.log(`broadcast #${job.id}: cancelled by the admin`); }
    if (page.next == null) break;
    after = page.next;
  }
  if (!cancelled) await worker('/internal/broadcast/finish', { id: job.id });
  console.log(`broadcast #${job.id}: delivered ${ok}, not delivered ${bad}`);
  return true;
}

/**
 * Lesson reminders + end-of-day messages (lessons.yml, woken by the Worker at the right minutes). Each run:
 *  1. deletes the messages whose time is up (a reminder 10 min after its class started, the end-of-day message after an hour);
 *  2. sends every reminder due now — a class starting in 2…14 minutes — to private chats that have them on (chats.lr), and the
 *     end-of-day message to chats whose last class ended up to 45 minutes ago (chats.de). Each is CLAIMED first ("L:<day>:<start>",
 *     "E:<day>"), so overlapping or repeated runs never send one twice.
 * A class that simply continues the previous one (same subject, teacher and room, right after it) gets no second reminder.
 */
/**
 * Deletes the bot's messages whose time is up: lesson reminders and end-of-day messages (lists kept by the lessons runs),
 * announcements whose "⏳ N hours" are up or that the admin deleted with 🗑, and any old-style row (eph) still left.
 * Deleting is paced like sending (Telegram limits both), several at once.
 */
async function deleteDue(realNow = Date.now()) {
  let deleted = 0;
  const del = async (list) => {
    if (DRY) { deleted += list.length; return; }
    await paced(list, async ([chat_id, message_id]) => { try { await tg('deleteMessage', { chat_id, message_id }); } catch {} deleted++; });
  };
  // 1. lesson messages
  for (let round = 0; round < 20; round++) {
    const { rows } = await worker(`/internal/pend/due?now=${realNow + 60e3}`);
    if (!rows.length) break;
    const due = [], back = [];
    for (const r of rows) {
      const keep = r.items.filter((x) => x[2] > realNow + 60e3);
      due.push(...r.items.filter((x) => x[2] <= realNow + 60e3));
      back.push({ k: r.k, keep });
    }
    await del(due);
    await worker('/internal/pend/done', { rows: back });
    if (rows.length < 50) break;
  }
  // 2. announcements
  for (let round = 0; round < 10; round++) {
    let { bid, rows, next } = await worker(`/internal/bcdel/due?now=${realNow}`);
    if (!bid) break;
    for (;;) {
      await del(rows.map((r) => [r.chat_id, r.msg_id]));
      if (next == null) break;
      ({ rows, next } = await worker(`/internal/bcdel/due?now=${realNow}&after=${next}`));
    }
    await worker('/internal/bcdel/done', { bid });
  }
  // 3. rows written by an older version of this script
  for (let round = 0; round < 20; round++) {
    const { rows } = await worker(`/internal/eph/due?now=${realNow + 60e3}`);
    if (!rows.length) break;
    await del(rows.map((r) => [r.chat_id, r.msg_id]));
    await worker('/internal/eph/done', { items: rows.map((r) => [r.chat_id, r.msg_id]) });
    if (rows.length < 500) break;
  }
  return deleted;
}

/**
 * Runs `fn` over `list` at Telegram's pace for messages to many chats (~25 a second, under its 30/s limit), several requests
 * in flight at once — one after another, each request waits for the network, so a big batch would take minutes longer.
 */
const RATE = 25;
async function paced(list, fn) {
  let i = 0, nextAt = Date.now();
  const lane = async () => {
    while (i < list.length) {
      const item = list[i++];
      const wait = nextAt - Date.now();
      nextAt = Math.max(nextAt, Date.now()) + 1000 / RATE;
      if (wait > 0) await sleep(wait);
      await fn(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(8, list.length) }, lane));
}

async function sendLessons(index) {
  // LESSON_AT = the planned minute (HH:MM, Tashkent) the Worker woke this run for. The run starts a few minutes early: it works
  // out everything to send by then, and starts sending just early enough that the middle of the batch goes exactly on time.
  const at0 = /^(\d\d):(\d\d)$/.exec(process.env.LESSON_AT || '');
  const fake = process.env.FAKE_NOW ? Number(process.env.FAKE_NOW) : null;
  const t0 = fake ?? Date.now();
  const tn0 = nowTk(t0);
  const midnight = Date.UTC(tn0.getUTCFullYear(), tn0.getUTCMonth(), tn0.getUTCDate()) - (tn0.getTime() - t0); // Tashkent midnight, real ms
  const at = (min) => midnight + min * 60e3;
  const nowMin0 = tn0.getUTCHours() * 60 + tn0.getUTCMinutes();
  const planMin = at0 && !fake ? Number(at0[1]) * 60 + Number(at0[2]) : nowMin0;
  const planMs = at0 && !fake ? Math.max(t0, at(planMin)) : t0;
  const now = nowTk(planMs);
  const wd = weekday(now);
  const day = ymd(now);
  const dayNum = Math.floor(now.getTime() / 864e5);
  const nowMin = planMin; // who is due is decided by the planned minute
  const todo = [];
  if (wd !== 6) {
    for await (const page of subscriberPages('lessons')) {
      for (const sub of page) {
        if (sub.kind !== 'private' || !sub.group_id) continue;
        const g = await loadGroup(sub);
        if (!g || noTimetable(g)) continue;
        const slots = daySlots(g, index, now);
        if (!slots.length) continue;
        const teacher = sub.role === 'teacher';
        slots.forEach((slot, i) => {
          const prev = slots[i - 1];
          // never early: from exactly LR_BEFORE minutes before the class (a late run still sends until 2 minutes before it)
          if (!sub.lr || nowMin < slot.start - LR_BEFORE || nowMin > slot.start - 2 || continuesPrevious(prev, slot)) return;
          const stay = staysInRoom(prev, slot);
          const type = parseSubject(slot.lessons[0].s).type;
          const joke = pickReminderJoke({ teacher, type, first: i === 0, last: i === slots.length - 1, start: slot.start, wd, stay, lecture: type === 'lecture', subject: slot.lessons[0].s, seed: sub.chat_id, day: dayNum });
          todo.push({ sub, kind: 'lr', tag: `${day}:${slot.start}`, slot, stay, joke, intro: !sub.lri, delAt: at(slot.start + LR_DELETE_AFTER_START) });
        });
        const last = slots[slots.length - 1];
        if (sub.de && nowMin >= last.end - 1 && nowMin <= last.end + 45) { // (from a minute before the bell: that run is the next class's reminder)
          todo.push({ sub, kind: 'de', tag: day, joke: pickDayEndJoke({ teacher, wd, seed: sub.chat_id, day: dayNum }), delAt: at(last.end + DE_DELETE_AFTER) });
        }
      }
    }
  }
  // reminders first (they are the time-critical ones); start early by half the time the batch takes, at most 3 minutes
  todo.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'lr' ? -1 : 1));
  const nLr = todo.filter((x) => x.kind === 'lr').length;
  if (at0 && !fake) {
    const lead = Math.min(180e3, (nLr / RATE / 2) * 1000);
    const wait = planMs - lead - Date.now();
    if (wait > 0 && wait < 40 * 60e3) { console.log(`lessons: ${todo.length} to send, waiting ${Math.round(wait / 1000)} s (for ${process.env.LESSON_AT}, ${Math.round(lead / 1000)} s early)`); await sleep(wait + 1000); }
  }
  let reminders = 0, ends = 0;
  const pend = [];
  for (let i = 0; i < todo.length; i += 500) {
    const part = todo.slice(i, i + 500);
    // claim each in the chat's own row first (one write each): a second run at the same minute sends nothing again
    let claimed = null;
    if (!DRY) {
      claimed = new Set();
      const groups = new Map();
      for (const x of part) { const key = `${x.kind}|${x.tag}`; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(x.sub.chat_id); }
      for (const [key, ids] of groups) {
        const [kind, tag] = key.split('|');
        for (const c of (await worker('/internal/lclaim2', { kind, tag, ids })).claimed) claimed.add(`${kind}|${tag}|${c}`);
      }
    }
    await paced(part, async (x) => {
      if (claimed && !claimed.has(`${x.kind}|${x.tag}|${x.sub.chat_id}`)) return; // another run already sent this one
      const lang = x.sub.lang, teacher = x.sub.role === 'teacher';
      const jt = x.joke ? jokeText(x.joke.entry, lang) : '';
      const sendMs = fake ?? Date.now();
      const text = x.kind === 'lr'
        ? fmtLessonReminder(x.slot, lang, { teacher, stay: x.stay, minutes: Math.max(1, Math.round((at(x.slot.start) - sendMs) / 60e3)), joke: jt, intro: x.intro })
        : fmtDayEnd(lang, teacher, jt);
      const out = {};
      const ok = await send(x.sub.chat_id, text, ephemeralKeyboard(lang, x.kind, x.joke?.key || 's_any'), null, null, { silent: x.kind === 'de', out, pace: true });
      if (ok && out.id) { pend.push([x.sub.chat_id, out.id, x.delAt]); if (x.kind === 'lr') reminders++; else ends++; }
    });
  }
  if (!DRY && pend.length) await worker('/internal/pend/add', { items: pend }); // deleted later by a run (a few rows, not one each)
  const deleted = await deleteDue(fake ?? Date.now());
  console.log(`lessons: ${reminders} reminders, ${ends} end-of-day messages, ${deleted} deleted`);
}

async function main() {
  const mode = process.argv[2];
  if (!BOT_TOKEN || !WORKER_URL || !ADMIN_KEY) throw new Error('BOT_TOKEN, WORKER_URL and ADMIN_KEY must be set');
  const index = JSON.parse(await fs.readFile(path.join(DATA, 'index.json'), 'utf8'));
  // translated subject names for Russian / English readers
  try { setSubjects(JSON.parse(await fs.readFile(path.join(DATA, 'subjects.json'), 'utf8'))); } catch { console.warn('subjects.json not found — subject names stay in Uzbek'); }
  const today = ymd(nowTk());

  if (mode === 'changes') {
    await sendChanges(index);
  } else if (mode === 'weekly') {
    // Explicit/manual force-send (e.g. the admin's "send now" checkbox) to everyone with the weekly post on. They are marked
    // as served for today, so the scheduled run does not send a second copy later the same day.
    await sendWeekly(index, today, true);
  } else if (mode === 'tomorrow') {
    await sendTomorrow(index); // manual force-send: everyone who has the reminder on, whatever their own time
    // (does not mark anyone — chats still get their regular reminder at their own time)
  } else if (mode === 'auto') {
    // Self-gating: run this on every trigger (every ~10 min via Cloudflare, plus GitHub's own best-effort schedule).
    // It decides for itself what is due, and the bot's database remembers who has been served today (see claim()), so
    // runs may overlap, repeat or be skipped without anybody getting a message twice or missing it.
    const now = nowTk();
    // Daily reminder: each chat has its own time. A chat is due once its time has passed — but only looking back a few
    // hours, so a chat that just moved its time to the early morning is not woken up with yesterday's news.
    const nowMin = now.getUTCHours() * 60 + now.getUTCMinutes();
    const from = Math.max(-1, nowMin - LOOKBACK_MIN);
    const { n, failed } = await sendTomorrow(index, [from, nowMin], today);
    if (n > 0 || failed > 0) console.log(`auto: sent tomorrow's reminder to ${n} chats${failed ? `, ${failed} to retry` : ''}`);
    if (weekday(now) === 6 && now.getUTCHours() >= 20) {
      const failedWeekly = await sendWeekly(index, today);
      if (failedWeekly) console.log(`auto: weekly timetable — ${failedWeekly} chats to retry`);
    }
    await sendQueuedBroadcast(); // an announcement the admin queued in the Mini App (if any)
    const gone = await deleteDue(); // announcements whose "⏳ N hours" are up (and any lesson message a lessons run missed)
    if (gone) console.log(`auto: deleted ${gone} expired messages`);
  } else if (mode === 'lessons') {
    await sendLessons(index);
  } else if (mode === 'broadcast') {
    await sendQueuedBroadcast();
  } else if (mode === 'announce') {
    await sendAnnounce();
  } else {
    throw new Error('Usage: node scripts/notify.mjs changes|weekly|tomorrow|auto|announce|broadcast|lessons');
  }

  if (!DRY && (removed.length || migrated.length)) {
    await worker('/internal/cleanup', { remove: removed, migrate: migrated });
  }
  console.log(`Sent ${sent} messages. Removed ${removed.length} dead chats, migrated ${migrated.length}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
