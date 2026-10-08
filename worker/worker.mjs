// TDIU Jadval (@tdiujadval_bot) — Cloudflare Worker (free plan).
// Handles Telegram updates (webhook) and a few internal endpoints used by the GitHub Action.
//
// Two kinds of users in private chats (chats.role): 'student' follows a group, 'teacher' follows
// one teacher from the EduPage list. Either way the chosen id is kept in chats.group_id /
// group_name, so alerts, weekly posts and reminders work the same for both.
//
// Settings (Cloudflare → Worker → Settings → Variables):
//   BOT_TOKEN   (secret)  token from @BotFather
//   ADMIN_KEY   (secret)  any long random password; the same value goes into GitHub secrets
//   SITE_URL    (text)    your GitHub Pages address, e.g. https://yourname.github.io/tsue-timetable-bot
//   DB          (D1 binding) a D1 database (tables are created automatically)
//   GITHUB_PAT  (secret, optional) fine-grained token, "Actions: read and write" on this repo only —
//               lets a Cloudflare Cron Trigger wake up the GitHub Action reliably (see `scheduled` below)
//   GITHUB_REPO (text, optional) "yourname/tsue-timetable-bot" — required together with GITHUB_PAT
//   ADMIN_CHAT_ID (text, optional) your own numeric Telegram id — when set, every /feedback message is
//               forwarded to you instantly as a DM (in addition to being stored, for the stats workflow).
//               Message @userinfobot on Telegram to get your numeric id, then start this bot yourself first.

import {
  LANGS, T as TEXTS, tr, esc, langFromCode, tashkentNow, addDays, weekday, mondayOf,
  fmtDay, fmtWeek, fmtWeekCaption, hhmm, parseClock, setSubjects,
} from '../src/shared.mjs';

const PAGE = 30; // groups per page in the picker
const TPAGE = 16; // teachers per page in the picker
const CALENDAR_ENABLED = false; // the /calendar command + button are hidden for now; flip to true to bring them back

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
      // Don't leak internal details (D1/Telegram error text, stack info) to whoever sent the request —
      // the real message is in the Cloudflare dashboard's Logs tab for us to debug.
      return new Response('Something went wrong. Try again shortly.', { status: 500 });
    }
  },

  // GitHub's own `schedule:` trigger is "best effort" and can silently go quiet for hours on a
  // low-traffic public repo (a known GitHub Actions limitation, not a bug in our workflow) — so
  // instead of trusting it alone, Cloudflare's own Cron Trigger (reliable, free, up to once a
  // minute) calls this on its schedule and nudges the GitHub Action awake via the API. Configure
  // a Cron Trigger for this Worker in the dashboard and set GITHUB_PAT + GITHUB_REPO to turn it
  // on; without them this quietly does nothing, so it's safe to leave unconfigured.
  async scheduled(event, env, ctx) {
    if (!env.GITHUB_PAT || !env.GITHUB_REPO) return;
    const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/timetable.yml/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_PAT}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'tdiu-jadval-cron',
      },
      body: JSON.stringify({ ref: 'main' }),
    });
    if (!res.ok) console.error('GitHub dispatch failed:', res.status, await res.text().catch(() => ''));
  },
};

// ---------------------------------------------------------------- helpers

async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
// Constant-time-ish comparison for secrets: hashing both sides first means the result is always
// a same-length compare, so a caller can't learn anything about ADMIN_KEY from response timing.
async function safeEqual(a, b) {
  const [ha, hb] = await Promise.all([sha256hex(String(a ?? '')), sha256hex(String(b ?? ''))]);
  return ha === hb;
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
const getTeacher = (env, id) => getData(env, `t/${id}.json`);
const getPeople = (env) => getData(env, 'people.json', 600);

// Russian / English readers get translated subject names (docs/data/subjects.json). Loaded lazily and kept for
// an hour; if it can't be fetched the names simply stay in Uzbek and we try again in five minutes.
let subjectsAt = 0;
async function loadSubjects(env) {
  if (Date.now() - subjectsAt < 3600e3) return;
  try {
    const j = await getData(env, 'subjects.json', 3600);
    if (j) setSubjects(j);
    subjectsAt = Date.now();
  } catch {
    subjectsAt = Date.now() - 3300e3;
  }
}

const isTeacher = (row) => row?.role === 'teacher';
/** The timetable this chat follows: a group's file, or a teacher's (tagged kind:'t' for the formatters). */
async function getEntity(env, row) {
  if (!row.group_id) return null;
  if (!isTeacher(row)) return getGroup(env, row.group_id);
  const t = await getTeacher(env, row.group_id);
  return t ? { ...t, kind: 't' } : null;
}

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
        role TEXT NOT NULL DEFAULT 'student',
        remind_at INTEGER NOT NULL DEFAULT 1260,
        lang TEXT NOT NULL DEFAULT 'uz',
        alerts INTEGER NOT NULL DEFAULT 1,
        weekly INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER)`),
      env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_chats_group ON chats(group_id)'),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER,
        name TEXT,
        text TEXT NOT NULL,
        created_at INTEGER)`),
      // which forwarded DM (in the admin's chat) belongs to which user — so a Reply can be routed back
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS feedback_replies (
        admin_msg_id INTEGER PRIMARY KEY,
        chat_id INTEGER NOT NULL,
        created_at INTEGER)`),
    ]);
    // Existing databases predate teachers / reminder times: add the columns once.
    const cols = (await env.DB.prepare('PRAGMA table_info(chats)').all()).results || [];
    // (two Worker instances may start at the same moment: the loser's ALTER fails with "duplicate column" — harmless)
    const addColumn = async (sql, after) => {
      try {
        await env.DB.prepare(sql).run();
        if (after) await env.DB.prepare(after).run();
      } catch (e) {
        if (!/duplicate column/i.test(String(e?.message))) throw e;
      }
    };
    if (!cols.some((c) => c.name === 'role')) {
      await addColumn("ALTER TABLE chats ADD COLUMN role TEXT NOT NULL DEFAULT 'student'");
    }
    if (!cols.some((c) => c.name === 'remind_at')) {
      // remind_at = minutes after midnight (Tashkent) of the daily "tomorrow's classes" message; -1 = off.
      // Chats that had alerts switched off keep getting nothing.
      await addColumn('ALTER TABLE chats ADD COLUMN remind_at INTEGER NOT NULL DEFAULT 1260', 'UPDATE chats SET remind_at = -1 WHERE alerts = 0');
    }
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_chats_remind ON chats(remind_at)').run();
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
    chat_id: chat.id, kind, role: 'student', group_id: null, group_name: null,
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
  // the Mini App behind the menu button follows the chat's language / group / role
  if (chatId > 0 && siteUrl(env) && ('lang' in fields || 'group_id' in fields || 'role' in fields)) await syncMenu(env, chatId);
}

/** Per-chat menu button: its link carries the chat's language and timetable (#l=…&g=…/t=…), so the app opens as the bot is set. */
async function syncMenu(env, chatId) {
  try {
    const row = await getChat(env, chatId);
    if (!row) return;
    const text = { uz: '📅 Jadval', ru: '📅 Расписание', en: '📅 Timetable' }[row.lang] || '📅 Jadval';
    await tg(env, 'setChatMenuButton', { chat_id: chatId, menu_button: { type: 'web_app', text, web_app: { url: appUrl(env, row.group_id, row.lang, row.role) } } });
  } catch {}
}

/** Switch a chat between 'student' and 'teacher'. The old pick (a group / a teacher) no longer fits, so it is cleared. */
async function setRole(env, chatId, row, role) {
  if ((row.role || 'student') === role) return row;
  await updateChat(env, chatId, { role, group_id: null, group_name: null });
  return { ...row, role, group_id: null, group_name: null };
}

async function deleteChat(env, chatId) {
  await (await db(env)).prepare('DELETE FROM chats WHERE chat_id = ?').bind(chatId).run();
}

/** How many OTHER private chats already have this group set — used for the invite-friends nudge. */
async function countGroupmates(env, groupId, excludeChatId) {
  const r = await (await db(env))
    .prepare("SELECT COUNT(*) AS n FROM chats WHERE group_id = ? AND kind = 'private' AND chat_id != ?")
    .bind(groupId, excludeChatId)
    .first();
  return r?.n || 0;
}

async function addFeedback(env, chatId, name, text) {
  await (await db(env))
    .prepare('INSERT INTO feedback (chat_id, name, text, created_at) VALUES (?,?,?,?)')
    .bind(chatId, name || null, text, Date.now())
    .run();
  // Also forward it straight to the admin's own Telegram DMs, if configured, so feedback doesn't
  // need to wait for someone to go check the stats workflow.
  if (env.ADMIN_CHAT_ID) {
    const r = await tg(env, 'sendMessage', {
      chat_id: env.ADMIN_CHAT_ID,
      text: `✍️ <b>Yangi fikr-mulohaza</b>\n${esc(name || 'Anonim')} (id: ${chatId}):\n\n${esc(text)}\n\n↩️ Javob berish uchun shu xabarga <b>Reply</b> qiling.`,
      parse_mode: 'HTML',
    });
    if (r.ok && r.result?.message_id) {
      await (await db(env))
        .prepare('INSERT OR REPLACE INTO feedback_replies (admin_msg_id, chat_id, created_at) VALUES (?,?,?)')
        .bind(r.result.message_id, chatId, Date.now())
        .run();
    }
  }
}

// ---------------------------------------------------------------- setup & internal API

async function onSetup(url, env) {
  if (!(await safeEqual(url.searchParams.get('key'), env.ADMIN_KEY))) return new Response('Wrong key', { status: 403 });
  const out = {};
  out.webhook = await tg(env, 'setWebhook', {
    url: `${url.origin}/tg`,
    secret_token: await webhookSecret(env),
    allowed_updates: ['message', 'callback_query', 'my_chat_member'],
    drop_pending_updates: true,
  });
  const cmds = {
    uz: [['today', 'Bugungi darslar'], ['tomorrow', 'Ertangi darslar'], ['week', 'Haftalik jadval'], ['group', 'Guruhni tanlash (talaba)'], ['teacher', "O'qituvchi sifatida kirish"], ['settings', 'Sozlamalar'], ['time', 'Ertangi dars eslatmasi vaqti'], ['app', 'Ilovani ochish'], ['calendar', "Kalendarga obuna bo'lish"], ['feedback', 'Taklif yoki xato yuborish'], ['help', 'Yordam']].filter(([c]) => CALENDAR_ENABLED || c !== 'calendar'),
    ru: [['today', 'Пары на сегодня'], ['tomorrow', 'Пары на завтра'], ['week', 'Расписание на неделю'], ['group', 'Выбрать группу (студент)'], ['teacher', 'Войти как преподаватель'], ['settings', 'Настройки'], ['time', 'Время напоминания о парах'], ['app', 'Открыть приложение'], ['calendar', 'Подписка на календарь'], ['feedback', 'Отзыв или ошибка'], ['help', 'Помощь']].filter(([c]) => CALENDAR_ENABLED || c !== 'calendar'),
    en: [['today', "Today's classes"], ['tomorrow', "Tomorrow's classes"], ['week', 'Weekly timetable'], ['group', 'Choose group (student)'], ['teacher', 'Sign in as a teacher'], ['settings', 'Settings'], ['time', 'Reminder time'], ['app', 'Open the app'], ['calendar', 'Subscribe to calendar'], ['feedback', 'Send feedback'], ['help', 'Help']].filter(([c]) => CALENDAR_ENABLED || c !== 'calendar'),
  };
  const groupCmds = {
    uz: [['today', 'Bugungi darslar'], ['tomorrow', 'Ertangi darslar'], ['week', 'Haftalik jadval'], ['setgroup', 'Chatni guruhga ulash (admin)'], ['unset', 'Uzish (admin)'], ['time', 'Eslatma vaqti (admin)']],
    ru: [['today', 'Пары на сегодня'], ['tomorrow', 'Пары на завтра'], ['week', 'Расписание на неделю'], ['setgroup', 'Привязать чат к группе (админ)'], ['unset', 'Отвязать (админ)'], ['time', 'Время напоминания (админ)']],
    en: [['today', "Today's classes"], ['tomorrow', "Tomorrow's classes"], ['week', 'Weekly timetable'], ['setgroup', 'Link chat to a group (admin)'], ['unset', 'Unlink (admin)'], ['time', 'Reminder time (admin)']],
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
  out.description = await tg(env, 'setMyShortDescription', { short_description: "Talaba va o'qituvchilar uchun jadval, bo'sh xonalar va o'zgarishlar — hammasi bir joyda. Jadval o'zgarsa, birinchi siz bilasiz." });
  const ok = Object.values(out).every((r) => r.ok);
  return json({ ok, hint: ok ? 'All set! Open your bot in Telegram and press Start.' : 'Some steps failed — see details.', ...out });
}

async function onInternal(request, url, env) {
  if (!(await safeEqual(request.headers.get('x-admin-key'), env.ADMIN_KEY))) return new Response('Forbidden', { status: 403 });
  const D = await db(env);
  if (url.pathname === '/internal/subs') {
    const mode = url.searchParams.get('mode');
    const after = Number(url.searchParams.get('after') || '-9999999999999');
    const limit = Math.min(5000, Number(url.searchParams.get('limit') || 2000));
    // 'all' = every chat with a group set, regardless of the alerts/weekly toggles (used for admin broadcasts)
    // 'tomorrow' = the daily reminder: chats whose own time (remind_at) lies in (from, to] — or everyone who has it on when no window is given
    let filter = mode === 'all' ? '' : `AND ${mode === 'weekly' ? 'weekly' : 'alerts'} = 1`;
    const binds = [];
    if (mode === 'tomorrow') {
      filter = 'AND remind_at >= 0';
      if (url.searchParams.has('to')) {
        filter = 'AND remind_at > ? AND remind_at <= ?';
        binds.push(Number(url.searchParams.get('from') || -1), Number(url.searchParams.get('to')));
      }
    }
    const { results } = await D
      .prepare(`SELECT chat_id, kind, role, group_id, lang FROM chats WHERE group_id IS NOT NULL ${filter} AND chat_id > ? ORDER BY chat_id LIMIT ?`)
      .bind(...binds, after, limit)
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
    const r = await D.prepare(`SELECT kind, role, COUNT(*) AS n, SUM(group_id IS NOT NULL) AS with_group FROM chats GROUP BY kind, role`).all();
    const fb = await D.prepare('SELECT chat_id, name, text, created_at FROM feedback ORDER BY id DESC LIMIT 20').all();
    return json({ stats: r.results, feedback: fb.results });
  }
  return new Response('Not found', { status: 404 });
}

// ---------------------------------------------------------------- Telegram updates

async function onWebhook(request, env) {
  if (!(await safeEqual(request.headers.get('x-telegram-bot-api-secret-token'), await webhookSecret(env)))) {
    return new Response('Forbidden', { status: 403 });
  }
  const update = await request.json();
  await loadSubjects(env);
  if (update.message) await onMessage(env, update.message);
  else if (update.callback_query) await onCallback(env, update.callback_query);
  else if (update.my_chat_member) await onMyChatMember(env, update.my_chat_member);
  return new Response('ok');
}

function mainKeyboard(env, lang, groupId, role) {
  const L = tr(lang);
  const rows = [
    [{ text: L.btnToday }, { text: L.btnTomorrow }],
    [{ text: L.btnWeek }, { text: L.btnSettings }],
  ];
  if (siteUrl(env)) rows.push([
    { text: L.btnApp, web_app: { url: appUrl(env, groupId, lang, role) } },
    { text: L.btnFree, web_app: { url: `${siteUrl(env)}/#tab=free&l=${lang}` } },
  ]);
  return { keyboard: rows, resize_keyboard: true, is_persistent: true };
}

function appUrl(env, groupId, lang, role) {
  return `${siteUrl(env)}/#${groupId ? `${role === 'teacher' ? 't' : 'g'}=${groupId}&` : ''}l=${lang}`;
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

const isAdminChat = (env, chatId) => !!env.ADMIN_CHAT_ID && String(chatId) === String(env.ADMIN_CHAT_ID);

/**
 * The admin answers a feedback message: Reply to the forwarded DM (or `/reply <chat_id> text`) and the
 * answer goes to that user, in their language. Returns true when the message was handled here.
 */
async function onAdminReply(env, msg, command) {
  let target;
  let text;
  if (command?.cmd === 'reply') {
    const m = /^(-?\d+)\s+([\s\S]+)$/.exec(command.arg || '');
    if (!m) {
      await send(env, msg.chat.id, '↩️ Format: <code>/reply 123456789 javob matni</code>\nyoki feedback xabariga Reply qiling.');
      return true;
    }
    target = Number(m[1]);
    text = m[2];
  } else if (!command && msg.reply_to_message?.message_id) {
    const r = await (await db(env)).prepare('SELECT chat_id FROM feedback_replies WHERE admin_msg_id = ?').bind(msg.reply_to_message.message_id).first();
    if (!r) return false; // a reply to something else → normal handling
    target = r.chat_id;
    text = msg.text;
  } else {
    return false;
  }
  const trow = await getChat(env, target);
  const res = await send(env, target, tr(trow?.lang || 'uz').adminReply(esc(String(text).slice(0, 3500))));
  await send(env, msg.chat.id, res.ok ? '✅ Javob yuborildi.' : "❌ Yuborilmadi (foydalanuvchi botni bloklagan bo'lishi mumkin).", { reply_to_message_id: msg.message_id });
  return true;
}

async function onPrivate(env, msg, command) {
  if (isAdminChat(env, msg.chat.id) && (await onAdminReply(env, msg, command))) return;
  const { row, isNew } = await ensureChat(env, msg.chat, msg.from?.language_code);
  const lang = row.lang;
  const L = tr(lang);
  const uid = msg.from.id;
  const action = command ? command.cmd : BUTTONS[msg.text.trim()];

  if (action === 'start') {
    // Deep link from a group chat post: /start g_<groupId>
    const m = /^g_([a-z0-9]+)$/.exec(command.arg);
    if (m) return chooseGroup(env, msg.chat, uid, m[1], null, lang);
    const mt = /^t_([a-z0-9]+)$/.exec(command.arg); // a teacher's shared link: /start t_<teacherId>
    if (mt) return chooseTeacher(env, msg.chat, uid, mt[1], null, lang);
    if (siteUrl(env)) await syncMenu(env, msg.chat.id);
    await send(env, msg.chat.id, L.welcome, { reply_markup: mainKeyboard(env, lang, row.group_id, row.role) });
    if (!row.group_id) return askRole(env, msg.chat.id, uid, lang, null, row.role); // student or teacher?
    return;
  }
  if (action === 'help') return send(env, msg.chat.id, L.help, { reply_markup: mainKeyboard(env, lang, row.group_id, row.role) });
  if (action === 'group' || action === 'setgroup') {
    await setRole(env, msg.chat.id, row, 'student');
    return showFaculties(env, msg.chat.id, uid, lang, null);
  }
  if (action === 'teacher') {
    if (command?.arg) return searchTeachers(env, msg.chat.id, uid, lang, command.arg); // /teacher Karimov
    await setRole(env, msg.chat.id, row, 'teacher');
    return showTeacherLetters(env, msg.chat.id, uid, lang, null);
  }
  if (action === 'lang' || action === 'language') return askLanguage(env, msg.chat.id, 'settings');
  if (action === 'time' || action === 'remind') return setRemindTime(env, msg.chat.id, row, command?.arg);
  if (action === 'settings') return showSettings(env, msg.chat.id, row, null);
  if (action === 'app') {
    return send(env, msg.chat.id, '📱', { reply_markup: { inline_keyboard: [[{ text: L.btnApp, web_app: { url: appUrl(env, row.group_id, lang, row.role) } }]] } });
  }
  if (action === 'today' || action === 'tomorrow' || action === 'week') {
    if (!row.group_id) {
      if (isTeacher(row)) {
        await send(env, msg.chat.id, L.noTeacher);
        return showTeacherLetters(env, msg.chat.id, uid, lang, null);
      }
      await send(env, msg.chat.id, L.noGroup);
      return showFaculties(env, msg.chat.id, uid, lang, null);
    }
    return sendSchedule(env, msg.chat.id, row, action);
  }
  if (action === 'feedback') {
    const text = command.arg;
    if (!text) return send(env, msg.chat.id, L.feedbackPrompt);
    await addFeedback(env, msg.chat.id, msg.from?.username ? '@' + msg.from.username : msg.from?.first_name, text.slice(0, 2000));
    return send(env, msg.chat.id, L.feedbackThanks);
  }
  if (action === 'calendar' && CALENDAR_ENABLED) {
    if (!row.group_id) {
      await send(env, msg.chat.id, L.noGroup);
      return showFaculties(env, msg.chat.id, uid, lang, null);
    }
    const url = `${siteUrl(env)}/data/ics/${row.group_id}.ics`;
    return send(env, msg.chat.id, L.calendarInfo(url), { reply_markup: { inline_keyboard: [[{ text: L.btnCalendar, url }]] } });
  }
  if (command) return send(env, msg.chat.id, L.help);
  // Free text → search teachers (teacher accounts) or groups (students) by name
  if (isTeacher(row)) return searchTeachers(env, msg.chat.id, uid, lang, msg.text);
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
  if (cmd === 'time' || cmd === 'remind') {
    if (!(await isAdmin(env, msg.chat.id, msg))) return send(env, msg.chat.id, L.onlyAdmins, { reply_to_message_id: msg.message_id });
    return setRemindTime(env, msg.chat.id, row, command.arg);
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
    [index, group] = await Promise.all([getIndex(env), getEntity(env, row)]);
  } catch {
    return send(env, chatId, L.dataError);
  }
  if (!group) return send(env, chatId, row.kind !== 'private' ? L.noGroupChat : isTeacher(row) ? L.noTeacher : L.noGroup);
  const now = tashkentNow();
  const extra = {};
  const kb = await appButton(env, row);
  if (kb) extra.reply_markup = kb;
  if (what === 'week') {
    // On Sunday show the coming week
    const monday = mondayOf(weekday(now) === 6 ? addDays(now, 1) : now);
    // The picture is drawn in Uzbek, so Russian / English readers get the text version (with translated subjects)
    if (row.lang !== 'uz') return send(env, chatId, fmtWeek(group, index, monday, row.lang), extra);
    // The weekly picture (drawn by the GitHub Action) — easier to read than text, like the EduPage grid
    const photo = `${siteUrl(env)}/img/${isTeacher(row) ? 't' : 'g'}/${group.id}.png?v=${group.v || index.tt?.num || ''}`;
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
  const [index, group] = await Promise.all([getIndex(env), getEntity(env, row)]);
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
async function getBotName(env) {
  if (!botName) botName = (await tg(env, 'getMe', {})).result?.username || null;
  return botName;
}
async function appButton(env, row) {
  const L = tr(row.lang);
  if (!siteUrl(env)) return null;
  if (row.kind === 'private') return { inline_keyboard: [[{ text: L.btnOpenInApp, web_app: { url: appUrl(env, row.group_id, row.lang, row.role) } }]] };
  // web_app buttons are not allowed in groups → deep link into a private chat with the bot
  const name = await getBotName(env);
  return name ? { inline_keyboard: [[{ text: L.btnOpenInApp, url: `https://t.me/${name}?start=g_${row.group_id}` }]] } : null;
}

/** 📤 Share button: opens Telegram's native share sheet with a deep link into this group. */
async function inviteKeyboard(env, lang, groupId, groupName) {
  const L = tr(lang);
  const name = await getBotName(env);
  if (!name) return undefined;
  const link = `https://t.me/${name}?start=g_${groupId}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(L.inviteShareText(groupName))}`;
  return { inline_keyboard: [[{ text: L.btnInvite, url: shareUrl }]] };
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

// Teacher names on EduPage are in Latin letters, so a Cyrillic query is transliterated first
// (Каримов → karimov). Apostrophes and spaces are ignored, like for group names.
const CYR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h' };
const normT = (s) => String(s || '').toLowerCase().replace(/[а-яёўқғҳ]/g, (c) => CYR[c] ?? c).toUpperCase().replace(/[^A-Z0-9]/g, '');

/** "Who are you?" — shown to new users and from Settings → 🔄. */
async function askRole(env, chatId, uid, lang, messageId, current) {
  const L = tr(lang);
  const mark = (r) => (current === r ? ' ✓' : '');
  const kb = { inline_keyboard: [
    [{ text: L.btnStudent + mark('student'), callback_data: `R:${uid}:s` }, { text: L.btnTeacher + mark('teacher'), callback_data: `R:${uid}:t` }],
    langRow(lang, `role:${uid}`),
  ] };
  if (messageId) return tg(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text: L.askRole, parse_mode: 'HTML', reply_markup: kb });
  return send(env, chatId, L.askRole, { reply_markup: kb });
}

/** Teacher picker, step 1: the first letters of all surnames. */
async function showTeacherLetters(env, chatId, uid, lang, messageId) {
  const L = tr(lang);
  let people;
  try { people = await getPeople(env); } catch { return send(env, chatId, L.dataError); }
  if (!people) return send(env, chatId, L.dataError);
  const letters = [...new Set(people.teachers.map(([, n]) => normT(n).charAt(0)).filter(Boolean))].sort();
  const kb = [];
  for (let i = 0; i < letters.length; i += 6) kb.push(letters.slice(i, i + 6).map((l) => ({ text: l, callback_data: `tl:${uid}:${l}:0` })));
  kb.push([{ text: L.back, callback_data: `RM:${uid}` }]);
  kb.push(langRow(lang, `tpick:${uid}`));
  const text = `${L.chooseTeacher}\n\n${L.teacherSearchHint}`;
  if (messageId) return tg(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML', reply_markup: { inline_keyboard: kb } });
  return send(env, chatId, text, { reply_markup: { inline_keyboard: kb } });
}

/** Teacher picker, step 2: teachers whose surname starts with `letter`, paged. */
async function showTeachers(env, chatId, uid, lang, letter, page, messageId) {
  const L = tr(lang);
  let people;
  try { people = await getPeople(env); } catch { return send(env, chatId, L.dataError); }
  const list = (people?.teachers || []).filter(([, n]) => normT(n).charAt(0) === letter);
  if (!list.length) return showTeacherLetters(env, chatId, uid, lang, messageId);
  const slice = list.slice(page * TPAGE, page * TPAGE + TPAGE);
  const kb = [];
  for (let i = 0; i < slice.length; i += 2) kb.push(slice.slice(i, i + 2).map(([id, name]) => ({ text: name, callback_data: `tp:${uid}:${id}` })));
  const nav = [{ text: L.back, callback_data: `tL:${uid}` }];
  if (page > 0) nav.push({ text: '⬅️', callback_data: `tl:${uid}:${letter}:${page - 1}` });
  if ((page + 1) * TPAGE < list.length) nav.push({ text: L.more, callback_data: `tl:${uid}:${letter}:${page + 1}` });
  kb.push(nav);
  return tg(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text: `👨‍🏫 <b>${esc(letter)}</b> · ${list.length}\n${L.chooseTeacher}`, parse_mode: 'HTML', reply_markup: { inline_keyboard: kb } });
}

/** Type a surname → buttons. `notFoundText` lets the group search reuse this as a fallback. */
async function searchTeachers(env, chatId, uid, lang, query, notFoundText) {
  const L = tr(lang);
  const q = normT(query);
  const miss = () => send(env, chatId, notFoundText || L.teacherNotFound);
  if (q.length < 2) return miss();
  let people;
  try { people = await getPeople(env); } catch { return send(env, chatId, L.dataError); }
  const hits = [];
  for (const [id, name] of people?.teachers || []) {
    const n = normT(name);
    if (n.includes(q)) hits.push([id, name, n.startsWith(q) ? 0 : 1]);
  }
  if (!hits.length) return miss();
  hits.sort((a, b) => a[2] - b[2] || a[1].localeCompare(b[1]));
  const top = hits.slice(0, 20);
  const kb = [];
  for (let i = 0; i < top.length; i += 2) kb.push(top.slice(i, i + 2).map(([id, name]) => ({ text: '👨‍🏫 ' + name, callback_data: `tp:${uid}:${id}` })));
  return send(env, chatId, `🔎 ${L.found}`, { reply_markup: { inline_keyboard: kb } });
}

async function chooseTeacher(env, chat, uid, teacherId, messageId, langHint) {
  if (chat.type !== 'private') return; // teachers use the bot in their own chat
  const { row } = await ensureChat(env, chat, null);
  const lang = row.lang || langHint;
  const L = tr(lang);
  let people;
  try { people = await getPeople(env); } catch { return send(env, chat.id, L.dataError); }
  const hit = (people?.teachers || []).find(([id]) => id === teacherId);
  if (!hit) return send(env, chat.id, L.teacherNotFound);
  const name = hit[1];
  const firstTime = !(isTeacher(row) && row.group_id);
  await updateChat(env, chat.id, { role: 'teacher', group_id: teacherId, group_name: name });
  const text = L.teacherSet(esc(name));
  if (messageId) await tg(env, 'editMessageText', { chat_id: chat.id, message_id: messageId, text, parse_mode: 'HTML' });
  else await send(env, chat.id, text);
  // Show today's classes right away, together with the main buttons
  const [index, t] = await Promise.all([getIndex(env), getTeacher(env, teacherId)]);
  const now = tashkentNow();
  if (t) await send(env, chat.id, fmtDay({ ...t, kind: 't' }, index, now, lang, now), { reply_markup: mainKeyboard(env, lang, teacherId, 'teacher') });
  else await send(env, chat.id, L.dataError, { reply_markup: mainKeyboard(env, lang, teacherId, 'teacher') });
  if (firstTime) await send(env, chat.id, L.teacherTip);
}

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
  if (!hits.length) return searchTeachers(env, chatId, uid, lang, query, L.notFound); // maybe a teacher's surname
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
  const firstTimeSetup = chat.type === 'private' && !row.group_id; // never had a group before → show the group-chat tip once
  await updateChat(env, chat.id, { group_id: groupId, group_name: name, role: 'student' });
  const isPrivate = chat.type === 'private';
  const text = isPrivate ? L.groupSet(esc(name)) : L.groupSetChat(esc(name), remindOf(row));
  // In group chats the admin can pick the chat's language right under the confirmation
  const markup = isPrivate ? undefined : { inline_keyboard: [langRow(lang, 'chat')] };
  if (messageId) await tg(env, 'editMessageText', { chat_id: chat.id, message_id: messageId, text, parse_mode: 'HTML', reply_markup: markup });
  else await send(env, chat.id, text, markup ? { reply_markup: markup } : {});
  const updated = { ...row, group_id: groupId, group_name: name, role: 'student' };
  if (isPrivate) {
    // Show today's classes right away, together with the main buttons
    const [index, group] = await Promise.all([getIndex(env), getGroup(env, groupId)]);
    if (group) await send(env, chat.id, fmtDay(group, index, tashkentNow(), lang, tashkentNow()), { reply_markup: mainKeyboard(env, lang, groupId) });
    // Invite friends + social proof: how many groupmates are already here
    const n = await countGroupmates(env, groupId, chat.id);
    await send(env, chat.id, L.inviteCaption(esc(name), n), { reply_markup: await inviteKeyboard(env, lang, groupId, name) });
    // One-time tip: most value comes from the whole group chat being connected, not just individuals
    if (firstTimeSetup) await send(env, chat.id, L.groupChatTip);
  } else {
    await sendSchedule(env, chat.id, updated, 'week');
  }
}

const remindOf = (row) => row.remind_at ?? 1260;

/** /time 20:30 sets the daily "tomorrow's classes" time (Tashkent); /time alone shows the picker. */
async function setRemindTime(env, chatId, row, arg) {
  const L = tr(row.lang);
  if (!arg) return showRemindPicker(env, chatId, row, null);
  const m = parseClock(arg);
  if (m == null) return send(env, chatId, L.remindBad);
  await updateChat(env, chatId, { remind_at: m });
  return send(env, chatId, L.remindSet(m));
}

async function showRemindPicker(env, chatId, row, messageId) {
  const L = tr(row.lang);
  const cur = remindOf(row);
  const btn = (h) => ({ text: (cur === h * 60 ? '✓ ' : '') + hhmm(h * 60), callback_data: `rt:${h * 60}` });
  const kb = { inline_keyboard: [[8, 12, 18, 19].map(btn), [20, 21, 22, 23].map(btn), [{ text: (cur < 0 ? '✓ ' : '') + L.btnRemindOff, callback_data: 'rt:-1' }]] };
  const text = `${L.remindTitle}\n\n${L.setRemind(cur)}`;
  if (messageId) return tg(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML', reply_markup: kb });
  return send(env, chatId, text, { reply_markup: kb });
}

async function showSettings(env, chatId, row, messageId) {
  const L = tr(row.lang);
  const teacher = isTeacher(row);
  const pickedLine = teacher ? L.setTeacher(esc(row.group_name)) : L.setGroup(esc(row.group_name));
  const text = [L.settings, '', pickedLine, L.setAlerts(!!row.alerts), L.setWeekly(!!row.weekly), L.setRemind(remindOf(row))].join('\n');
  const kb = {
    inline_keyboard: [
      [{ text: L.setAlerts(!!row.alerts), callback_data: 's:alerts' }],
      [{ text: L.setWeekly(!!row.weekly), callback_data: 's:weekly' }],
      [{ text: L.setRemind(remindOf(row)), callback_data: 's:time' }],
      [{ text: L.setLang, callback_data: 's:lang' }, { text: (teacher ? '👨‍🏫 ' : '👥 ') + (row.group_name || '—'), callback_data: 's:group' }],
    ],
  };
  if (row.kind === 'private') {
    kb.inline_keyboard.push([{ text: L.btnRole, callback_data: 's:role' }]);
    kb.inline_keyboard.push([{ text: L.btnFeedback, callback_data: 's:feedback' }]);
  }
  if (row.kind === 'private' && row.group_id && !teacher) {
    const invite = await inviteKeyboard(env, row.lang, row.group_id, row.group_name || '');
    if (invite) kb.inline_keyboard.push(invite.inline_keyboard[0]);
    if (CALENDAR_ENABLED && siteUrl(env)) kb.inline_keyboard.push([{ text: L.btnCalendar, callback_data: 's:calendar' }]);
  }
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
  if (['f', 'c', 'F', 'g', 'R', 'RM', 'tL', 'tl', 'tp'].includes(kind)) {
    const uid = Number(parts[1]);
    if (uid === 0 ? !(await isAdmin(env, chatId, cb)) : uid !== cb.from.id) {
      return tg(env, 'answerCallbackQuery', { callback_query_id: cb.id, text: uid === 0 ? L.onlyAdmins : L.notYourMenu, show_alert: true });
    }
  }
  if (isGroupChat && (kind === 's' || kind === 'lang' || kind === 'rt') && !(await isAdmin(env, chatId, cb))) {
    return tg(env, 'answerCallbackQuery', { callback_query_id: cb.id, text: L.onlyAdmins, show_alert: true });
  }
  tg(env, 'answerCallbackQuery', { callback_query_id: cb.id }); // stop the loading spinner (no need to wait)

  if (kind === 'lang') {
    const newLang = LANGS.includes(parts[1]) ? parts[1] : 'uz';
    await updateChat(env, chatId, { lang: newLang });
    const L2 = tr(newLang);
    if (parts[2] === 'pick') return showFaculties(env, chatId, parts[3], newLang, msg.message_id);
    if (parts[2] === 'tpick') return showTeacherLetters(env, chatId, parts[3], newLang, msg.message_id);
    if (parts[2] === 'role') return askRole(env, chatId, parts[3], newLang, msg.message_id, row.role);
    if (parts[2] === 'chat') {
      return tg(env, 'editMessageText', { chat_id: chatId, message_id: msg.message_id, text: L2.groupSetChat(esc(row.group_name || ''), remindOf(row)), parse_mode: 'HTML', reply_markup: { inline_keyboard: [langRow(newLang, 'chat')] } });
    }
    if (parts[2] === 'start') {
      await tg(env, 'editMessageText', { chat_id: chatId, message_id: msg.message_id, text: L2.langName });
      await send(env, chatId, L2.welcome, { reply_markup: mainKeyboard(env, newLang, row.group_id, row.role) });
      if (!row.group_id) return askRole(env, chatId, cb.from.id, newLang, null, row.role);
      return;
    }
    await tg(env, 'editMessageText', { chat_id: chatId, message_id: msg.message_id, text: '✅ ' + L2.langName });
    if (!isGroupChat) await send(env, chatId, '👌', { reply_markup: mainKeyboard(env, newLang, row.group_id, row.role) });
    return;
  }
  if (kind === 'rt') {
    const m = Math.max(-1, Math.min(1439, Number(parts[1]) || 0));
    await updateChat(env, chatId, { remind_at: m });
    return tg(env, 'editMessageText', { chat_id: chatId, message_id: msg.message_id, text: L.remindSet(m), parse_mode: 'HTML' });
  }
  if (kind === 'day') { if (!row.group_id) return; return onDayTab(env, row, msg, Number(parts[1]), Number(parts[2])); }
  if (kind === 'wk') { if (!row.group_id) return; return sendSchedule(env, chatId, row, 'week'); }
  if (kind === 'F') return showFaculties(env, chatId, parts[1], lang, msg.message_id);
  if (kind === 'f') return showCourses(env, chatId, parts[1], lang, Number(parts[2]), msg.message_id);
  if (kind === 'c') return showGroups(env, chatId, parts[1], lang, Number(parts[2]), Number(parts[3]), Number(parts[4]), msg.message_id);
  if (kind === 'g') return chooseGroup(env, chat, Number(parts[1]), parts[2], msg.message_id, lang);
  // teachers / role (private chats only)
  if (['R', 'RM', 'tL', 'tl', 'tp'].includes(kind)) {
    if (isGroupChat) return;
    if (kind === 'R') {
      const role = parts[2] === 't' ? 'teacher' : 'student';
      await setRole(env, chatId, row, role);
      return role === 'teacher' ? showTeacherLetters(env, chatId, parts[1], lang, msg.message_id) : showFaculties(env, chatId, parts[1], lang, msg.message_id);
    }
    if (kind === 'RM') return askRole(env, chatId, parts[1], lang, msg.message_id, row.role);
    if (kind === 'tL') return showTeacherLetters(env, chatId, parts[1], lang, msg.message_id);
    if (kind === 'tl') return showTeachers(env, chatId, parts[1], lang, parts[2], Number(parts[3]) || 0, msg.message_id);
    return chooseTeacher(env, chat, Number(parts[1]), parts[2], msg.message_id, lang);
  }
  if (kind === 's') {
    const what = parts[1];
    if (what === 'alerts' || what === 'weekly') {
      const val = row[what] ? 0 : 1;
      await updateChat(env, chatId, { [what]: val });
      return showSettings(env, chatId, { ...row, [what]: val }, msg.message_id);
    }
    if (what === 'lang') return askLanguage(env, chatId, 'settings', msg.message_id);
    if (what === 'time') return showRemindPicker(env, chatId, row, msg.message_id);
    if (what === 'group') return isTeacher(row) && !isGroupChat ? showTeacherLetters(env, chatId, cb.from.id, lang, msg.message_id) : showFaculties(env, chatId, cb.from.id, lang, msg.message_id);
    if (what === 'role') return isGroupChat ? undefined : askRole(env, chatId, cb.from.id, lang, msg.message_id, row.role);
    if (what === 'feedback') return send(env, chatId, L.feedbackPrompt);
    if (what === 'calendar' && CALENDAR_ENABLED) {
      if (!row.group_id) return;
      const url = `${siteUrl(env)}/data/ics/${row.group_id}.ics`;
      return send(env, chatId, L.calendarInfo(url), { reply_markup: { inline_keyboard: [[{ text: L.btnCalendar, url }]] } });
    }
  }
}
