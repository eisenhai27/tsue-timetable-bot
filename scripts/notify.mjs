// Sends Telegram messages that go to many chats at once.
//   node scripts/notify.mjs changes    → change alerts (uses .out/changes.json from update.mjs)
//   node scripts/notify.mjs weekly     → the weekly timetable post (force-send now)
//   node scripts/notify.mjs tomorrow   → short evening reminder of tomorrow's first class (force-send now)
//   node scripts/notify.mjs auto       → checks Tashkent time + docs/data/state.json and sends
//                                        weekly/tomorrow the first time each run reaches their
//                                        window that day — safe to call every few minutes, since
//                                        GitHub's own `schedule:` trigger can silently miss its
//                                        exact minute on a quiet repo (state.json prevents resending).
//   node scripts/notify.mjs announce   → broadcasts env.ANNOUNCE_TEXT to every active chat (admin only,
//                                        via the "Run workflow" announce field — reaches everyone with
//                                        a group set, not just alert-subscribers)
//
// Env: BOT_TOKEN, WORKER_URL, ADMIN_KEY, SITE_URL, ANNOUNCE_TEXT (for 'announce'). DRY_RUN=1 prints instead of sending.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fmtChanges, fmtWeek, fmtWeekCaption, fmtTomorrow, fmtTomorrowFull, setSubjects, tr, tashkentNow, addDays, mondayOf, weekday, ymd } from '../src/shared.mjs';

const { BOT_TOKEN, WORKER_URL, ADMIN_KEY } = process.env;
const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '');
const DRY = !!process.env.DRY_RUN;
const TG = process.env.TG_API || 'https://api.telegram.org';
const DATA = path.resolve('docs/data');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tg(method, body) {
  const res = await fetch(`${TG}/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function worker(pathAndQuery, body) {
  const res = await fetch(`${WORKER_URL.replace(/\/+$/, '')}${pathAndQuery}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'X-Admin-Key': ADMIN_KEY, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Worker ${pathAndQuery}: HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

async function* subscribers(mode, extraQuery = '') {
  // Group chats have NEGATIVE ids (-100…), so paging must start far below zero — starting at 0 skipped every group chat.
  let after = -1e15;
  for (;;) {
    const page = await worker(`/internal/subs?mode=${mode}&after=${after}&limit=2000${extraQuery}`);
    for (const s of page.rows) yield s;
    if (!page.rows.length || page.next == null) break;
    after = page.next;
  }
}

const removed = [];
const migrated = [];
let sent = 0;

/** Send one message, respecting Telegram limits (~30 messages/second overall). */
async function send(chatId, text, replyMarkup, photo) {
  if (DRY) {
    console.log(`\n--- to ${chatId} ---\n${photo ? '[photo] ' + photo.photo + '\n' + photo.caption : text}`);
    sent++;
    return;
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    let r = photo
      ? await tg('sendPhoto', { chat_id: chatId, photo: photo.photo, caption: photo.caption, parse_mode: 'HTML', reply_markup: replyMarkup })
      : await tg('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: replyMarkup });
    // picture couldn't be fetched → fall back to the text version once
    if (!r.ok && photo && r.error_code === 400 && /photo|file|url|image/i.test(r.description || '')) { photo = null; attempt--; continue; }
    if (r.ok) { sent++; await sleep(40); return; }
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
      return;
    }
    console.warn(`send ${chatId} failed: ${code} ${desc}`);
    return;
  }
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
  if (!botUsername && !DRY) botUsername = (await tg('getMe', {})).result?.username;
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
const photoUrl = (sub, g, index) => (SITE_URL ? `${SITE_URL}/img/${kindOf(sub)}/${g.id}.png?v=${g.v || index.tt?.num || ''}` : null);

const STATE_FILE = path.join(DATA, 'state.json');
async function readState() {
  try { return JSON.parse(await fs.readFile(STATE_FILE, 'utf8')); }
  catch { return {}; }
}
async function writeState(state) {
  if (DRY) return;
  await fs.writeFile(STATE_FILE, JSON.stringify(state));
}

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

async function sendWeekly(index) {
  // Run on Sunday evening → next Monday. Any other day (a manual force-send) → this week's Monday.
  const now = tashkentNow();
  const monday = mondayOf(addDays(now, 1));
  for await (const sub of subscribers('weekly')) {
    const g = await loadGroup(sub);
    if (!g) continue;
    // the picture is drawn in Uzbek → Russian / English readers get the text version with translated subjects
    const photo = sub.lang === 'uz' ? photoUrl(sub, g, index) : null;
    await send(sub.chat_id, fmtWeek(g, index, monday, sub.lang), await keyboard(sub, g.id), photo ? { photo, caption: fmtWeekCaption(g, index, monday, sub.lang) } : null);
  }
}

/**
 * The daily "tomorrow's classes" message. Every chat has its own time (chats.remind_at, default 21:00,
 * changed with /time); `window` = [from, to] in minutes after midnight limits it to the chats whose time
 * fell inside that window since the last run (no window = everyone who has it on, for a manual send).
 * Group chats get the full list of tomorrow's classes — but only when their timetable changed in the last 24 h;
 * private chats a short "first class" ping every day. Free days stay silent.
 */
async function sendTomorrow(index, window) {
  const now = tashkentNow();
  const tomorrow = addDays(now, 1);
  const q = window ? `&from=${window[0]}&to=${window[1]}` : '';
  // Sunday evening: groups that get the weekly timetable post (it already shows Monday) skip this list,
  // so a group still gets one message that day, not two.
  const skip = new Set();
  if (window && weekday(now) === 6) for await (const s of subscribers('weekly')) if (s.kind !== 'private') skip.add(s.chat_id);
  let n = 0;
  for await (const sub of subscribers('tomorrow', q)) {
    if (skip.has(sub.chat_id)) continue;
    const g = await loadGroup(sub);
    if (!g) continue;
    // Group chats only hear from the bot when something changed: the evening list goes to a group only if its
    // timetable was edited in the last 24 h (a follow-up to the instant alert: "so tomorrow looks like this").
    // No change → no message. A manual force-send (no window) still goes to everyone who has it on.
    if (window && sub.kind !== 'private' && !(g.changes || []).some((c) => Date.parse(c.at) > Date.now() - 24 * 3600e3)) continue;
    const text = sub.kind === 'private' ? fmtTomorrow(g, index, tomorrow, sub.lang) : fmtTomorrowFull(g, index, tomorrow, sub.lang);
    if (!text) continue;
    await send(sub.chat_id, text, await keyboard(sub, g.id));
    n++;
  }
  return n;
}

async function sendAnnounce() {
  const text = (process.env.ANNOUNCE_TEXT || '').trim();
  if (!text) { console.log('No announcement text set, nothing to send.'); return; }
  for await (const sub of subscribers('all')) {
    const g = await loadGroup(sub);
    if (!g) continue;
    await send(sub.chat_id, `📢 ${text}`, await keyboard(sub, g.id));
  }
}

async function main() {
  const mode = process.argv[2];
  if (!BOT_TOKEN || !WORKER_URL || !ADMIN_KEY) throw new Error('BOT_TOKEN, WORKER_URL and ADMIN_KEY must be set');
  const index = JSON.parse(await fs.readFile(path.join(DATA, 'index.json'), 'utf8'));
  // translated subject names for Russian / English readers
  try { setSubjects(JSON.parse(await fs.readFile(path.join(DATA, 'subjects.json'), 'utf8'))); } catch { console.warn('subjects.json not found — subject names stay in Uzbek'); }
  const today = ymd(tashkentNow());

  if (mode === 'changes') {
    await sendChanges(index);
  } else if (mode === 'weekly') {
    // Explicit/manual force-send (e.g. the admin's "send now" checkbox). Still marks state so
    // `auto` doesn't send a second copy later the same day.
    await sendWeekly(index);
    const state = await readState();
    if (state.weeklySent !== today) { state.weeklySent = today; await writeState(state); }
  } else if (mode === 'tomorrow') {
    await sendTomorrow(index); // manual force-send: everyone who has the reminder on, whatever their own time
    // (does not touch state.tmr — chats still get their regular reminder at their own time)
  } else if (mode === 'auto') {
    // Self-gating: run this on every trigger (every ~10 min via Cloudflare, plus GitHub's own
    // best-effort schedule). It decides for itself whether it's time, and docs/data/state.json
    // (committed to the repo) remembers what's already been sent today so nothing doubles up —
    // this closes the gap left by GitHub's `schedule:` event sometimes missing its exact minute.
    const state = await readState();
    let changed = false;
    const now = tashkentNow();
    // Daily reminder: each chat has its own time. `tmr.min` = how far today's run has already got
    // (minutes after midnight), so every chat is served once — even if a run or two were skipped.
    const nowMin = now.getUTCHours() * 60 + now.getUTCMinutes();
    const from = state.tmr?.date === today ? state.tmr.min : -1;
    if (nowMin > from) {
      const n = await sendTomorrow(index, [from, nowMin]);
      if (n > 0) {
        console.log(`auto: sent tomorrow's reminder to ${n} chats`);
        state.tmr = { date: today, min: nowMin }; // only saved when something went out (keeps the repo quiet)
        changed = true;
      }
    }
    if (weekday(now) === 6 && now.getUTCHours() >= 20 && state.weeklySent !== today) {
      console.log('auto: sending weekly timetable');
      await sendWeekly(index);
      state.weeklySent = today;
      changed = true;
    }
    if (changed) await writeState(state);
    else console.log('auto: nothing due yet today');
  } else if (mode === 'announce') {
    await sendAnnounce();
  } else {
    throw new Error('Usage: node scripts/notify.mjs changes|weekly|tomorrow|auto|announce');
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
