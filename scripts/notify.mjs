// Sends Telegram messages that go to many chats at once.
//   node scripts/notify.mjs changes   → change alerts (uses .out/changes.json from update.mjs)
//   node scripts/notify.mjs weekly    → the weekly timetable post (run on Sunday evening)
//
// Env: BOT_TOKEN, WORKER_URL, ADMIN_KEY, SITE_URL. DRY_RUN=1 prints instead of sending.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fmtChanges, fmtWeek, fmtWeekCaption, tr, tashkentNow, addDays, mondayOf } from '../src/shared.mjs';

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

async function* subscribers(mode) {
  let after = 0;
  for (;;) {
    const page = await worker(`/internal/subs?mode=${mode}&after=${after}&limit=2000`);
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

let botUsername = null;
async function keyboard(sub, groupId) {
  const L = tr(sub.lang);
  if (sub.kind === 'private' && SITE_URL) {
    return { inline_keyboard: [[{ text: L.btnOpenInApp, web_app: { url: `${SITE_URL}/#g=${groupId}&l=${sub.lang}` } }]] };
  }
  // web_app buttons are not allowed in group chats → deep link into the bot instead
  if (!botUsername && !DRY) botUsername = (await tg('getMe', {})).result?.username;
  if (!botUsername) return undefined;
  return { inline_keyboard: [[{ text: L.btnOpenInApp, url: `https://t.me/${botUsername}?start=g_${groupId}` }]] };
}

const groupCache = new Map();
async function loadGroup(id) {
  if (!groupCache.has(id)) {
    try { groupCache.set(id, JSON.parse(await fs.readFile(path.join(DATA, 'g', `${id}.json`), 'utf8'))); }
    catch { groupCache.set(id, null); }
  }
  return groupCache.get(id);
}

async function main() {
  const mode = process.argv[2];
  if (!BOT_TOKEN || !WORKER_URL || !ADMIN_KEY) throw new Error('BOT_TOKEN, WORKER_URL and ADMIN_KEY must be set');
  const index = JSON.parse(await fs.readFile(path.join(DATA, 'index.json'), 'utf8'));

  if (mode === 'changes') {
    let changes = [];
    try { changes = JSON.parse(await fs.readFile('.out/changes.json', 'utf8')); } catch {}
    if (!changes.length) { console.log('No changes, nothing to send.'); return; }
    const byGroup = new Map(changes.map((c) => [c.id, c]));
    for await (const sub of subscribers('alerts')) {
      const c = byGroup.get(sub.group_id);
      if (!c) continue;
      const g = await loadGroup(sub.group_id);
      if (!g) continue;
      await send(sub.chat_id, fmtChanges(g, index, c.days, sub.lang, c.newTT), await keyboard(sub, g.id));
    }
  } else if (mode === 'weekly') {
    // Run on Sunday evening → next Monday. Any other day → this week's Monday.
    const now = tashkentNow();
    const monday = mondayOf(addDays(now, 1));
    for await (const sub of subscribers('weekly')) {
      const g = await loadGroup(sub.group_id);
      if (!g) continue;
      const photo = SITE_URL ? `${SITE_URL}/img/g/${g.id}.png?v=${g.v || index.tt?.num || ''}` : null;
      await send(sub.chat_id, fmtWeek(g, index, monday, sub.lang), await keyboard(sub, g.id), photo ? { photo, caption: fmtWeekCaption(g, index, monday, sub.lang) } : null);
    }
  } else {
    throw new Error('Usage: node scripts/notify.mjs changes|weekly');
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
