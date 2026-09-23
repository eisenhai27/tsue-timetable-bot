// TDIU Jadval (@tdiujadval_bot) — Cloudflare Worker (free plan).
// Handles Telegram updates (webhook) and a few internal endpoints used by the GitHub Action.
//
// Settings (Cloudflare → Worker → Settings → Variables):
//   BOT_TOKEN  (secret)  token from @BotFather
//   ADMIN_KEY  (secret)  any long random password; the same value goes into GitHub secrets
//   SITE_URL   (text)    your GitHub Pages address, e.g. https://yourname.github.io/tsue-timetable-bot
//   DB         (D1 binding) a D1 database (tables are created automatically)

import {
  LANGS, T as TEXTS, tr, esc, langFromCode, tashkentNow, addDays, weekday, mondayOf,
  fmtDay, fmtWeek, fmtWeekCaption,
} from '../src/shared.mjs';

const PAGE = 30; // groups per page in the picker

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (request.method === 'POST' && url.pathname === '/tg') return await onWebhook(request, env);
      if (url.pathname === '/setup') return await onSetup(url, env);
      if (url.pathname.startsWith('/internal/')) return await onInternal(request, url, env);
      return new Response('TDIU Jadval bot is running ✅', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
    } catch (e) {
      console.error(e.stack || e);
      // Always answer 200 to Telegram so it doesn't retry the same broken update forever
      if (url.pathname === '/tg') return new Response('ok');
      return new Response('Error: ' + e.message, { status: 500 });
    }
  },
};

// ---------------------------------------------------------------- helpers

async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const webhookSecret = async (env) => (await sha256hex('tg:' + env.ADMIN_KEY)).slice(0, 48);
const siteUrl = (env) => String(env.SITE_URL || '').replace(/\/+$/, '');

async function tg(env, method, body) {
  const res = await fetch(`${env.TG_API || 'https://api.telegram.org'}/bot${env.BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await res.json().catch(() => ({ ok: false }));
  if (!j.ok && !/message is not modified/.test(j.description || '')) console.warn(method, j.description);
  return j;
}

const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

// Small in-memory cache (lives as long as the Worker instance, usually minutes)
const cache = new Map();
async function getData(env, file, ttlSec = 300) {
  const hit = cache.get(file);
  if (hit && hit.until > Date.now()) return hit.value;
  const res = await fetch(`${siteUrl(env)}/data/${file}`, { cf: { cacheTtl: ttlSec, cacheEverything: true } });
  if (!res.ok) {
    if (hit) return hit.value;
    if (res.status === 404) return null;
    throw new Error(`data ${file}: HTTP ${res.status}`);
  }
  const value = await res.json();
  cache.set(file, { value, until: Date.now() + ttlSec * 1000 });
  return value;
}
const getIndex = (env) => getData(env, 'index.json');
const getGroup = (env, id) => getData(env, `g/${id}.json`);

// ---------------------------------------------------------------- database

let schemaReady = false;
async function db(env) {
  if (!schemaReady) {
    await env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS chats (
        chat_id INTEGER PRIMARY KEY,
        kind TEXT NOT NULL,
        group_id TEXT,
        group_name TEXT,
        lang TEXT NOT NULL DEFAULT 'uz',
        alerts INTEGER NOT NULL DEFAULT 1,
        weekly INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER)`),
      env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_chats_group ON chats(group_id)'),
    ]);
    schemaReady = true;
  }
  return env.DB;
}

async function getChat(env, chatId) {
  return (await db(env)).prepare('SELECT * FROM chats WHERE chat_id = ?').bind(chatId).first();
}

async function ensureChat(env, chat, langCode) {
  let row = await getChat(env, chat.id);
  if (row) return { row, isNew: false };
  const kind = chat.type === 'private' ? 'private' : 'group';
  row = {
    chat_id: chat.id, kind, group_id: null, group_name: null,
    lang: 'uz', alerts: 1, weekly: kind === 'group' ? 1 : 0, // Uzbek is the default for everyone; changeable in the menu / settings
  };
  const now = Date.now();
  await (await db(env))
    .prepare('INSERT OR IGNORE INTO chats (chat_id, kind, lang, alerts, weekly, created_at, updated_at) VALUES (?,?,?,?,?,?,?)')
    .bind(row.chat_id, kind, row.lang, row.alerts, row.weekly, now, now)
    .run();
  return { row, isNew: true };
}

async function updateChat(env, chatId, fields) {
  const keys = Object.keys(fields);
  const sql = `UPDATE chats SET ${keys.map((k) => `${k} = ?`).join(', ')}, updated_at = ? WHERE chat_id = ?`;
  await (await db(env)).prepare(sql).bind(...keys.map((k) => fields[k]), Date.now(), chatId).run();
}

async function deleteChat(env, chatId) {
  await (await db(env)).prepare('DELETE FROM chats WHERE chat_id = ?').bind(chatId).run();
}

// ---------------------------------------------------------------- setup & internal API

async function onSetup(url, env) {
  if (url.searchParams.get('key') !== env.ADMIN_KEY) return new Response('Wrong key', { status: 403 });
  const out = {};
  out.webhook = await tg(env, 'setWebhook', {
    url: `${url.origin}/tg`,
    secret_token: await webhookSecret(env),
    allowed_updates: ['message', 'callback_query', 'my_chat_member'],
    drop_pending_updates: true,
  });
  const cmds = {
    uz: [['today', 'Bugungi darslar'], ['tomorrow', 'Ertangi darslar'], ['week', 'Haftalik jadval'], ['group', 'Guruhni tanlash'], ['settings', 'Sozlamalar'], ['app', 'Ilovani ochish'], ['help', 'Yordam']],
    ru: [['today', 'Пары на сегодня'], ['tomorrow', 'Пары на завтра'], ['week', 'Расписание на неделю'], ['group', 'Выбрать группу'], ['settings', 'Настройки'], ['app', 'Открыть приложение'], ['help', 'Помощь']],
    en: [['today', "Today's classes"], ['tomorrow', "Tomorrow's classes"], ['week', 'Weekly timetable'], ['group', 'Choose group'], ['settings', 'Settings'], ['app', 'Open the app'], ['help', 'Help']],
  };
  const groupCmds = {
    uz: [['today', 'Bugungi darslar'], ['tomorrow', 'Ertangi darslar'], ['week', 'Haftalik jadval'], ['setgroup', 'Chatni guruhga ulash (admin)'], ['unset', 'Uzish (admin)']],
    ru: [['today', 'Пары на сегодня'], ['tomorrow', 'Пары на завтра'], ['week', 'Расписание на неделю'], ['setgroup', 'Привязать чат к группе (админ)'], ['unset', 'Отвязать (админ)']],
    en: [['today', "Today's classes"], ['tomorrow', "Tomorrow's classes"], ['week', 'Weekly timetable'], ['setgroup', 'Link chat to a group (admin)'], ['unset', 'Unlink (admin)']],
  };
  const toCmd = (l) => l.map(([command, description]) => ({ command, description }));
  for (const lang of LANGS) {
    const language_code = lang === 'uz' ? undefined : lang;
    out['cmd_private_' + lang] = await tg(env, 'setMyCommands', { commands: toCmd(cmds[lang]), scope: { type: 'all_private_chats' }, language_code });
    out['cmd_group_' + lang] = await tg(env, 'setMyCommands', { commands: toCmd(groupCmds[lang]), scope: { type: 'all_group_chats' }, language_code });
  }
  if (siteUrl(env)) {
    out.menu = await tg(env, 'setChatMenuButton', { menu_button: { type: 'web_app', text: '📅 Jadval', web_app: { url: siteUrl(env) + '/' } } });
  }
  out.description = await tg(env, 'setMyShortDescription', { short_description: "Jadvalingiz, bo'sh xonalar va o'zgarishlar — hammasi bir joyda. Jadval o'zgarsa, birinchi siz bilasiz." });
  const ok = Object.values(out).every((r) => r.ok);
  return json({ ok, hint: ok ? 'All set! Open your bot in Telegram and press Start.' : 'Some steps failed — see details.', ...out });
}

async function onInternal(request, url, env) {
  if (request.headers.get('x-admin-key') !== env.ADMIN_KEY) return new Response('Forbidden', { status: 403 });
  const D = await db(env);
  if (url.pathname === '/internal/subs') {
    const mode = url.searchParams.get('mode');
    const after = Number(url.searchParams.get('after') || '-9999999999999');
    const limit = Math.min(5000, Number(url.searchParams.get('limit') || 2000));
    const col = mode === 'weekly' ? 'weekly' : 'alerts';
    const { results } = await D
      .prepare(`SELECT chat_id, kind, group_id, lang FROM chats WHERE ${col} = 1 AND group_id IS NOT NULL AND chat_id > ? ORDER BY chat_id LIMIT ?`)
      .bind(after, limit)
      .all();
    return json({ rows: results, next: results.length === limit ? results[results.length - 1].chat_id : null });
  }
  if (url.pathname === '/internal/cleanup' && request.method === 'POST') {
    const body = await request.json();
    const stmts = [];
    for (const id of body.remove || []) stmts.push(D.prepare('DELETE FROM chats WHERE chat_id = ?').bind(id));
    for (const [from, to] of body.migrate || []) stmts.push(D.prepare('UPDATE OR REPLACE chats SET chat_id = ? WHERE chat_id = ?').bind(to, from));
    if (stmts.length) await D.batch(stmts);
    return json({ ok: true, removed: (body.remove || []).length, migrated: (body.migrate || []).length });
  }
  if (url.pathname === '/internal/edupage' && request.method === 'POST') {
    // Relay for the GitHub Action: EduPage sometimes refuses GitHub's servers, so the Action
    // can fetch the timetable through Cloudflare instead. The body is streamed through untouched.
    const file = url.searchParams.get('file');
    const func = url.searchParams.get('func');
    if (!/^[a-z]+\.js$/.test(file || '') || !/^[A-Za-z]+$/.test(func || '')) return new Response('Bad request', { status: 400 });
    const res = await fetch(`${env.EDUPAGE_URL || 'https://tsue.edupage.org'}/timetable/server/${file}?__func=${func}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8', Referer: 'https://tsue.edupage.org/timetable/', 'User-Agent': 'Mozilla/5.0 (TDIU Jadval bot)' },
      body: await request.text(),
    });
    return new Response(res.body, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
  }
  if (url.pathname === '/internal/stats') {
    const r = await D.prepare(`SELECT kind, COUNT(*) AS n, SUM(group_id IS NOT NULL) AS with_group FROM chats GROUP BY kind`).all();
    return json({ stats: r.results });
  }
  return new Response('Not found', { status: 404 });
}

// ---------------------------------------------------------------- Telegram updates

async function onWebhook(request, env) {
  if (request.headers.get('x-telegram-bot-api-secret-token') !== (await webhookSecret(env))) {
    return new Response('Forbidden', { status: 403 });
  }
  const update = await request.json();
  if (update.message) await onMessage(env, update.message);
  else if (update.callback_query) await onCallback(env, update.callback_query);
  else if (update.my_chat_member) await onMyChatMember(env, update.my_chat_member);
  return new Response('ok');
}

function mainKeyboard(env, lang, groupId) {
  const L = tr(lang);
  const rows = [
    [{ text: L.btnToday }, { text: L.btnTomorrow }],
    [{ text: L.btnWeek }, { text: L.btnSettings }],
  ];
  if (siteUrl(env)) rows.push([
    { text: L.btnApp, web_app: { url: appUrl(env, groupId, lang) } },
    { text: L.btnFree, web_app: { url: `${siteUrl(env)}/#tab=free&l=${lang}` } },
  ]);
  return { keyboard: rows, resize_keyboard: true, is_persistent: true };
}

function appUrl(env, groupId, lang) {
  return `${siteUrl(env)}/#${groupId ? `g=${groupId}&` : ''}l=${lang}`;
}

// Button texts in every language → action
const BUTTONS = {};
for (const l of LANGS) {
  BUTTONS[TEXTS[l].btnToday] = 'today';
  BUTTONS[TEXTS[l].btnTomorrow] = 'tomorrow';
  BUTTONS[TEXTS[l].btnWeek] = 'week';
  BUTTONS[TEXTS[l].btnSettings] = 'settings';
}

function parseCommand(text) {
  const m = /^\/([a-zA-Z_]+)(?:@(\w+))?(?:\s+(.*))?$/s.exec(text || '');
  if (!m) return null;
  return { cmd: m[1].toLowerCase(), mention: m[2] || null, arg: (m[3] || '').trim() };
}

async function isAdmin(env, chatId, msgOrCb) {
  const msg = msgOrCb.message && msgOrCb.data !== undefined ? null : msgOrCb;
  if (msg?.sender_chat && msg.sender_chat.id === chatId) return true; // anonymous admin
  const userId = msgOrCb.from?.id;
  if (!userId) return false;
  const r = await tg(env, 'getChatMember', { chat_id: chatId, user_id: userId });
  return r.ok && ['creator', 'administrator'].includes(r.result.status);
}

async function send(env, chatId, text, extra = {}) {
  return tg(env, 'sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true, ...extra });
}

async function onMessage(env, msg) {
  const chat = msg.chat;
  if (msg.migrate_to_chat_id) {
    await (await db(env)).prepare('UPDATE OR REPLACE chats SET chat_id = ? WHERE chat_id = ?').bind(msg.migrate_to_chat_id, chat.id).run();
    return;
  }
  if (!msg.text) return;
  const command = parseCommand(msg.text);
  if (chat.type === 'private') return onPrivate(env, msg, command);
  if (chat.type === 'group' || chat.type === 'supergroup') return onGroupChat(env, msg, command);
}

async function onPrivate(env, msg, command) {
  const { row, isNew } = await ensureChat(env, msg.chat, msg.from?.language_code);
  const lang = row.lang;
  const L = tr(lang);
  const uid = msg.from.id;
  const action = command ? command.cmd : BUTTONS[msg.text.trim()];

  if (action === 'start') {
    // Deep link from a group chat post: /start g_<groupId>
    const m = /^g_([a-z0-9]+)$/.exec(command.arg);
    if (m) return chooseGroup(env, msg.chat, uid, m[1], null, lang);
    await send(env, msg.chat.id, L.welcome, { reply_markup: mainKeyboard(env, lang, row.group_id) });
    if (!row.group_id) return showFaculties(env, msg.chat.id, uid, lang, null);
    return;
  }
  if (action === 'help') return send(env, msg.chat.id, L.help, { reply_markup: mainKeyboard(env, lang, row.group_id) });
  if (action === 'group' || action === 'setgroup') return showFaculties(env, msg.chat.id, uid, lang, null);
  if (action === 'lang' || action === 'language') return askLanguage(env, msg.chat.id, 'settings');
  if (action === 'settings') return showSettings(env, msg.chat.id, row, null);
  if (action === 'app') {
    return send(env, msg.chat.id, '📱', { reply_markup: { inline_keyboard: [[{ text: L.btnApp, web_app: { url: appUrl(env, row.group_id, lang) } }]] } });
  }
  if (action === 'today' || action === 'tomorrow' || action === 'week') {
    if (!row.group_id) {
      await send(env, msg.chat.id, L.noGroup);
      return showFaculties(env, msg.chat.id, uid, lang, null);
    }
    return sendSchedule(env, msg.chat.id, row, action);
  }
  if (command) return send(env, msg.chat.id, L.help);
  // Free text → search groups by name
  return searchGroups(env, msg.chat.id, uid, lang, msg.text);
}

async function onGroupChat(env, msg, command) {
  if (!command) return;
  const { row } = await ensureChat(env, msg.chat, msg.from?.language_code);
  const lang = row.lang;
  const L = tr(lang);
  const { cmd } = command;
  if (cmd === 'setgroup' || cmd === 'group') {
    if (!(await isAdmin(env, msg.chat.id, msg))) return send(env, msg.chat.id, L.onlyAdmins, { reply_to_message_id: msg.message_id });
    const uid = msg.sender_chat?.id === msg.chat.id ? 0 : msg.from.id; // 0 = anonymous admin → re-check on every tap
    return showFaculties(env, msg.chat.id, uid, lang, null);
  }
  if (cmd === 'unset') {
    if (!(await isAdmin(env, msg.chat.id, msg))) return send(env, msg.chat.id, L.onlyAdmins, { reply_to_message_id: msg.message_id });
    await updateChat(env, msg.chat.id, { group_id: null, group_name: null });
    return send(env, msg.chat.id, L.unset);
  }
  if (cmd === 'lang' || cmd === 'language') {
    if (!(await isAdmin(env, msg.chat.id, msg))) return send(env, msg.chat.id, L.onlyAdmins, { reply_to_message_id: msg.message_id });
    return askLanguage(env, msg.chat.id, 'settings');
  }
  if (cmd === 'today' || cmd === 'tomorrow' || cmd === 'week') {
    if (!row.group_id) return send(env, msg.chat.id, L.noGroupChat);
    return sendSchedule(env, msg.chat.id, row, cmd);
  }
  if (cmd === 'start' || cmd === 'help') return send(env, msg.chat.id, row.group_id ? L.help : L.addedToGroup);
}

async function onMyChatMember(env, upd) {
  const chat = upd.chat;
  const status = upd.new_chat_member?.status;
  if (status === 'left' || status === 'kicked') return deleteChat(env, chat.id);
  if (chat.type !== 'private' && (status === 'member' || status === 'administrator')) {
    const old = upd.old_chat_member?.status;
    const { row } = await ensureChat(env, chat, upd.from?.language_code);
    if (old === 'left' || old === 'kicked' || !old) await send(env, chat.id, tr(row.lang).addedToGroup);
  }
}

// ---------------------------------------------------------------- schedule output

async function sendSchedule(env, chatId, row, what) {
  const L = tr(row.lang);
  let index, group;
  try {
    [index, group] = await Promise.all([getIndex(env), getGroup(env, row.group_id)]);
  } catch {
    return send(env, chatId, L.dataError);
  }
  if (!group) return send(env, chatId, row.kind === 'private' ? L.noGroup : L.noGroupChat);
  const now = tashkentNow();
  const extra = {};
  const kb = await appButton(env, row);
  if (kb) extra.reply_markup = kb;
  if (what === 'week') {
    // On Sunday show the coming week
    const monday = mondayOf(weekday(now) === 6 ? addDays(now, 1) : now);
    // The weekly picture (drawn by the GitHub Action) — easier to read than text, like the EduPage grid
    const photo = `${siteUrl(env)}/img/g/${group.id}.png?v=${group.v || index.tt?.num || ''}`;
    const r = await tg(env, 'sendPhoto', { chat_id: chatId, photo, caption: fmtWeekCaption(group, index, monday, row.lang), parse_mode: 'HTML', ...extra });
    if (r.ok) return r;
    return send(env, chatId, fmtWeek(group, index, monday, row.lang), extra); // fallback: text
  }
  const date = what === 'tomorrow' ? addDays(now, 1) : now;
  return send(env, chatId, fmtDay(group, index, date, row.lang, now), { reply_markup: dayKeyboard(row.lang, date, now, kb) });
}

/**
 * Inline day tabs under a day message: [Du][Se][Ch][Pa][Ju][Sh] + [◀ week] [week ▶].
 * Tapping edits the same message, so the chat doesn't fill up with timetables.
 */
function dayKeyboard(lang, date, now, extraKb) {
  const L = tr(lang);
  const baseMon = mondayOf(weekday(now) === 6 ? addDays(now, 1) : now);
  const off = Math.round((mondayOf(date) - baseMon) / (7 * 86400000));
  const sel = weekday(date);
  const days = [0, 1, 2, 3, 4, 5].map((d) => ({ text: d === sel ? `• ${L.daysShort[d]} •` : L.daysShort[d], callback_data: `day:${d}:${off}` }));
  const nav = [];
  if (off > 0) nav.push({ text: `◀ ${L.thisWeekShort}`, callback_data: `day:${sel}:${off - 1}` });
  if (off < 1) nav.push({ text: `${L.nextWeekShort} ▶`, callback_data: `day:0:${off + 1}` });
  nav.push({ text: L.btnWeek, callback_data: `wk:${off}` });
  const rows = [days.slice(0, 6), nav];
  if (extraKb?.inline_keyboard) rows.push(...extraKb.inline_keyboard);
  return { inline_keyboard: rows };
}

async function onDayTab(env, row, msg, d, off) {
  const [index, group] = await Promise.all([getIndex(env), getGroup(env, row.group_id)]);
  if (!group) return;
  const now = tashkentNow();
  const baseMon = mondayOf(weekday(now) === 6 ? addDays(now, 1) : now);
  const date = addDays(baseMon, Math.max(0, Math.min(1, off)) * 7 + Math.max(0, Math.min(5, d)));
  return tg(env, 'editMessageText', {
    chat_id: msg.chat.id, message_id: msg.message_id, text: fmtDay(group, index, date, row.lang, now), parse_mode: 'HTML',
    disable_web_page_preview: true, reply_markup: dayKeyboard(row.lang, date, now, await appButton(env, row)),
  });
}

let botName = null;
async function appButton(env, row) {
  const L = tr(row.lang);
  if (!siteUrl(env)) return null;
  if (row.kind === 'private') return { inline_keyboard: [[{ text: L.btnOpenInApp, web_app: { url: appUrl(env, row.group_id, row.lang) } }]] };
  // web_app buttons are not allowed in groups → deep link into a private chat with the bot
  if (!botName) botName = (await tg(env, 'getMe', {})).result?.username || null;
  return botName ? { inline_keyboard: [[{ text: L.btnOpenInApp, url: `https://t.me/${botName}?start=g_${row.group_id}` }]] } : null;
}

// ---------------------------------------------------------------- pickers

async function askLanguage(env, chatId, next, messageId) {
  const kb = { inline_keyboard: LANGS.map((l) => [{ text: TEXTS[l].langName, callback_data: `lang:${l}:${next}` }]) };
  if (messageId) return tg(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text: TEXTS.uz.chooseLang, reply_markup: kb });
  return send(env, chatId, TEXTS.uz.chooseLang, { reply_markup: kb });
}

async function showFaculties(env, chatId, uid, lang, messageId) {
  const L = tr(lang);
  let index;
  try { index = await getIndex(env); } catch { return send(env, chatId, L.dataError); }
  const kb = index.faculties.map((f, i) => [{ text: `🏛 ${f.name}`, callback_data: `f:${uid}:${i}` }]);
  kb.push(langRow(lang, `pick:${uid}`)); // language can be switched right here
  const text = `${L.chooseFaculty}\n\n${L.searchHint}`;
  if (messageId) return tg(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML', reply_markup: { inline_keyboard: kb } });
  return send(env, chatId, text, { reply_markup: { inline_keyboard: kb } });
}

/** [🇺🇿 O'zbekcha ✓] [🇷🇺 Русский] [🇬🇧 English] — Uzbek always first */
function langRow(current, suffix) {
  return LANGS.map((l) => ({ text: TEXTS[l].langName.replace(/^(\S+)\s.*$/, '$1') + ' ' + ({ uz: "O'zbek", ru: 'Рус', en: 'Eng' })[l] + (l === current ? ' ✓' : ''), callback_data: `lang:${l}:${suffix}` }));
}

async function showCourses(env, chatId, uid, lang, fi, messageId) {
  const L = tr(lang);
  const index = await getIndex(env);
  const fac = index.faculties[fi];
  if (!fac) return showFaculties(env, chatId, uid, lang, messageId);
  if (fac.courses.length === 1) return showGroups(env, chatId, uid, lang, fi, 0, 0, messageId);
  const kb = [];
  for (let i = 0; i < fac.courses.length; i += 2) {
    kb.push(fac.courses.slice(i, i + 2).map((c, j) => ({ text: `🎓 ${L.course(c.name)}`, callback_data: `c:${uid}:${fi}:${i + j}:0` })));
  }
  kb.push([{ text: L.back, callback_data: `F:${uid}` }]);
  return tg(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text: `🏛 <b>${esc(fac.name)}</b>\n${L.chooseCourse}`, parse_mode: 'HTML', reply_markup: { inline_keyboard: kb } });
}

async function showGroups(env, chatId, uid, lang, fi, ci, page, messageId) {
  const L = tr(lang);
  const index = await getIndex(env);
  const fac = index.faculties[fi];
  const course = fac?.courses[ci];
  if (!course) return showFaculties(env, chatId, uid, lang, messageId);
  const slice = course.groups.slice(page * PAGE, page * PAGE + PAGE);
  const kb = [];
  for (let i = 0; i < slice.length; i += 3) {
    kb.push(slice.slice(i, i + 3).map(([id, name]) => ({ text: name, callback_data: `g:${uid}:${id}` })));
  }
  const nav = [];
  nav.push({ text: L.back, callback_data: fac.courses.length > 1 ? `f:${uid}:${fi}` : `F:${uid}` });
  if (page > 0) nav.push({ text: '⬅️', callback_data: `c:${uid}:${fi}:${ci}:${page - 1}` });
  if ((page + 1) * PAGE < course.groups.length) nav.push({ text: L.more, callback_data: `c:${uid}:${fi}:${ci}:${page + 1}` });
  kb.push(nav);
  const title = `🏛 <b>${esc(fac.name)}</b>${course.name ? ` · ${L.course(course.name)}` : ''}\n${L.chooseGroup}`;
  return tg(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text: title, parse_mode: 'HTML', reply_markup: { inline_keyboard: kb } });
}

const norm = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9А-ЯЁ]/g, '');

async function searchGroups(env, chatId, uid, lang, query) {
  const L = tr(lang);
  const q = norm(query);
  if (q.length < 2) return send(env, chatId, L.notFound);
  let index;
  try { index = await getIndex(env); } catch { return send(env, chatId, L.dataError); }
  const hits = [];
  for (const f of index.faculties) for (const c of f.courses) for (const [id, name] of c.groups) {
    const n = norm(name);
    if (n.includes(q)) hits.push([id, name, n.startsWith(q) ? 0 : 1]);
  }
  if (!hits.length) return send(env, chatId, L.notFound);
  hits.sort((a, b) => a[2] - b[2] || a[1].localeCompare(b[1], undefined, { numeric: true }));
  const top = hits.slice(0, 24);
  const kb = [];
  for (let i = 0; i < top.length; i += 3) kb.push(top.slice(i, i + 3).map(([id, name]) => ({ text: name, callback_data: `g:${uid}:${id}` })));
  return send(env, chatId, `🔎 ${L.found}`, { reply_markup: { inline_keyboard: kb } });
}

async function findGroupName(env, id) {
  const index = await getIndex(env);
  for (const f of index.faculties) for (const c of f.courses) for (const [gid, name] of c.groups) if (gid === id) return name;
  return null;
}

async function chooseGroup(env, chat, uid, groupId, messageId, langHint) {
  const { row } = await ensureChat(env, chat, null);
  const lang = row.lang || langHint;
  const L = tr(lang);
  const name = await findGroupName(env, groupId);
  if (!name) return send(env, chat.id, L.notFound);
  await updateChat(env, chat.id, { group_id: groupId, group_name: name });
  const isPrivate = chat.type === 'private';
  const text = isPrivate ? L.groupSet(esc(name)) : L.groupSetChat(esc(name));
  // In group chats the admin can pick the chat's language right under the confirmation
  const markup = isPrivate ? undefined : { inline_keyboard: [langRow(lang, 'chat')] };
  if (messageId) await tg(env, 'editMessageText', { chat_id: chat.id, message_id: messageId, text, parse_mode: 'HTML', reply_markup: markup });
  else await send(env, chat.id, text, markup ? { reply_markup: markup } : {});
  const updated = { ...row, group_id: groupId, group_name: name };
  if (isPrivate) {
    // Show today's classes right away, together with the main buttons
    const [index, group] = await Promise.all([getIndex(env), getGroup(env, groupId)]);
    if (group) await send(env, chat.id, fmtDay(group, index, tashkentNow(), lang, tashkentNow()), { reply_markup: mainKeyboard(env, lang, groupId) });
  } else {
    await sendSchedule(env, chat.id, updated, 'week');
  }
}

async function showSettings(env, chatId, row, messageId) {
  const L = tr(row.lang);
  const text = [L.settings, '', L.setGroup(esc(row.group_name)), L.setAlerts(!!row.alerts), L.setWeekly(!!row.weekly)].join('\n');
  const kb = {
    inline_keyboard: [
      [{ text: L.setAlerts(!!row.alerts), callback_data: 's:alerts' }],
      [{ text: L.setWeekly(!!row.weekly), callback_data: 's:weekly' }],
      [{ text: L.setLang, callback_data: 's:lang' }, { text: '👥 ' + (row.group_name || '—'), callback_data: 's:group' }],
    ],
  };
  if (messageId) return tg(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML', reply_markup: kb });
  return send(env, chatId, text, { reply_markup: kb });
}

async function onCallback(env, cb) {
  const msg = cb.message;
  if (!msg) return tg(env, 'answerCallbackQuery', { callback_query_id: cb.id });
  const chat = msg.chat;
  const chatId = chat.id;
  const parts = String(cb.data || '').split(':');
  const kind = parts[0];
  const { row } = await ensureChat(env, chat, cb.from?.language_code);
  const lang = row.lang;
  const L = tr(lang);
  const isGroupChat = chat.type !== 'private';

  // Picker menus carry the id of the person who opened them
  if (['f', 'c', 'F', 'g'].includes(kind)) {
    const uid = Number(parts[1]);
    if (uid === 0 ? !(await isAdmin(env, chatId, cb)) : uid !== cb.from.id) {
      return tg(env, 'answerCallbackQuery', { callback_query_id: cb.id, text: uid === 0 ? L.onlyAdmins : L.notYourMenu, show_alert: true });
    }
  }
  if (isGroupChat && (kind === 's' || kind === 'lang') && !(await isAdmin(env, chatId, cb))) {
    return tg(env, 'answerCallbackQuery', { callback_query_id: cb.id, text: L.onlyAdmins, show_alert: true });
  }
  tg(env, 'answerCallbackQuery', { callback_query_id: cb.id }); // stop the loading spinner (no need to wait)

  if (kind === 'lang') {
    const newLang = LANGS.includes(parts[1]) ? parts[1] : 'uz';
    await updateChat(env, chatId, { lang: newLang });
    const L2 = tr(newLang);
    if (parts[2] === 'pick') return showFaculties(env, chatId, parts[3], newLang, msg.message_id);
    if (parts[2] === 'chat') {
      return tg(env, 'editMessageText', { chat_id: chatId, message_id: msg.message_id, text: L2.groupSetChat(esc(row.group_name || '')), parse_mode: 'HTML', reply_markup: { inline_keyboard: [langRow(newLang, 'chat')] } });
    }
    if (parts[2] === 'start') {
      await tg(env, 'editMessageText', { chat_id: chatId, message_id: msg.message_id, text: L2.langName });
      await send(env, chatId, L2.welcome, { reply_markup: mainKeyboard(env, newLang, row.group_id) });
      if (!row.group_id) return showFaculties(env, chatId, cb.from.id, newLang, null);
      return;
    }
    await tg(env, 'editMessageText', { chat_id: chatId, message_id: msg.message_id, text: '✅ ' + L2.langName });
    if (!isGroupChat) await send(env, chatId, '👌', { reply_markup: mainKeyboard(env, newLang, row.group_id) });
    return;
  }
  if (kind === 'day') { if (!row.group_id) return; return onDayTab(env, row, msg, Number(parts[1]), Number(parts[2])); }
  if (kind === 'wk') { if (!row.group_id) return; return sendSchedule(env, chatId, row, 'week'); }
  if (kind === 'F') return showFaculties(env, chatId, parts[1], lang, msg.message_id);
  if (kind === 'f') return showCourses(env, chatId, parts[1], lang, Number(parts[2]), msg.message_id);
  if (kind === 'c') return showGroups(env, chatId, parts[1], lang, Number(parts[2]), Number(parts[3]), Number(parts[4]), msg.message_id);
  if (kind === 'g') return chooseGroup(env, chat, Number(parts[1]), parts[2], msg.message_id, lang);
  if (kind === 's') {
    const what = parts[1];
    if (what === 'alerts' || what === 'weekly') {
      const val = row[what] ? 0 : 1;
      await updateChat(env, chatId, { [what]: val });
      return showSettings(env, chatId, { ...row, [what]: val }, msg.message_id);
    }
    if (what === 'lang') return askLanguage(env, chatId, 'settings', msg.message_id);
    if (what === 'group') return showFaculties(env, chatId, isGroupChat ? cb.from.id : cb.from.id, lang, msg.message_id);
  }
}
