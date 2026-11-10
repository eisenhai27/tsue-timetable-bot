// 📝 Group tasks: the pure rules, then the whole thing in-process (Worker module + in-memory database + stubbed Telegram/site):
// writing, 👍 confirms, 🚩 hides, half the group flagging one person bans them, reminders go out once and only to the right people.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { fakeD1 } from './d1-shim.mjs';
import { approveAt, hideAt, banAt, cleanTaskText, validDay, nextLessons, subjectsOf, taskState, TASK_MAX_LEN } from '../src/tasks.mjs';
import { tashkentNow, ymd, addDays } from '../src/shared.mjs';

let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? '✅' : '❌') + ' ' + name); if (!cond) { fails++; if (extra !== undefined) console.log(JSON.stringify(extra, null, 1).slice(0, 1500)); } };

// ---- pure rules
check('👍 needed: 2 in a tiny group, 3 from 5 people up', approveAt(1) === 2 && approveAt(3) === 2 && approveAt(4) === 2 && approveAt(5) === 3 && approveAt(60) === 3 && hideAt(60) === 3);
check('ban: half the group, never fewer than 3', banAt(2) === 3 && banAt(6) === 3 && banAt(7) === 4 && banAt(30) === 15 && banAt(101) === 51);
check('state: hidden beats confirmed; 👍 enough confirms', taskState(3, 0, 20) === 1 && taskState(2, 0, 20) === 0 && taskState(5, 3, 20) === 2 && taskState(0, 3, 20) === 2);
check('text is tidied: control characters, long spaces, and the length', cleanTaskText('  5-mashq \u0007  ‮ 6-mashq  ') === '5-mashq 6-mashq' && cleanTaskText('x'.repeat(500)).length === TASK_MAX_LEN && cleanTaskText(null) === '');
check('dates: only real calendar days', validDay('2026-11-12') === '2026-11-12' && validDay('2026-02-30') === null && validDay('12.11.2026') === null && validDay(5) === null);
const idx = { weekA: null };
const grp = { lessons: [{ d: 1, p: 1, s: 'Falsafa (Ma)' }, { d: 1, p: 2, s: 'Falsafa (Sem)' }, { d: 3, p: 1, s: "Iqtisodiyot nazariyasi 1 (Ma)" }, { d: 6, p: 1, s: 'Yakshanba fani' }] };
check('subjects: each once, the lesson type cut off, sorted', JSON.stringify(subjectsOf(grp)) === JSON.stringify(['Falsafa', 'Iqtisodiyot nazariyasi 1', 'Yakshanba fani']), subjectsOf(grp));
const nl = nextLessons(grp, idx, new Date(Date.UTC(2026, 10, 10))); // Tuesday 10 Nov 2026
check('next lesson: strictly after today (Tue → next Tuesday for a Tuesday-only subject), Thursday one in 2 days, Sunday never', nl.falsafa === '2026-11-17' && nl.iqtisodiyotnazariyasi1 === '2026-11-12' && !nl.yakshanbafani, nl);

// ---- the whole thing
const TOKEN = '123456:TESTTOKEN', ADMIN = 999;
const indexText = fs.readFileSync(new URL('../docs/data/index.json', import.meta.url), 'utf8');
const idxJ = JSON.parse(indexText);
let G = null, Gdata = null;
for (const f of idxJ.faculties) for (const c of f.courses) for (const g of c.groups) {
  if (G) break;
  const d = JSON.parse(fs.readFileSync(new URL(`../docs/data/g/${g[0]}.json`, import.meta.url), 'utf8'));
  if ((d.lessons || []).length > 5 && subjectsOf(d).length > 2) { G = g[0]; Gdata = d; }
}
const sent = [];
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (url.includes('api.telegram.org')) { const m = /\/bot[^/]+\/(\w+)$/.exec(url)[1]; sent.push({ method: m, ...JSON.parse(init.body || '{}') }); return new Response('{"ok":true,"result":{"message_id":1}}'); }
  const m = /^https:\/\/site\.example\/data\/(.+)$/.exec(url);
  if (m) { const f = new URL(`../docs/data/${m[1]}`, import.meta.url); return fs.existsSync(f) ? new Response(fs.readFileSync(f), { headers: { 'content-type': 'application/json' } }) : new Response('', { status: 404 }); }
  return new Response('{}', { status: 404 });
};
const { default: worker } = await import('../worker/worker.mjs');
const DB = fakeD1();
const env = { DB, BOT_TOKEN: TOKEN, SITE_URL: 'https://site.example', ADMIN_CHAT_ID: String(ADMIN), TASK_BRAKE_MS: '0' };
const initData = (u) => {
  const p = { auth_date: String(Math.floor(Date.now() / 1000)), query_id: 'AAH', user: JSON.stringify(u) };
  const chk = Object.keys(p).sort().map((k) => `${k}=${p[k]}`).join('\n');
  const sec = crypto.createHmac('sha256', 'WebAppData').update(TOKEN).digest();
  return new URLSearchParams({ ...p, hash: crypto.createHmac('sha256', sec).update(chk).digest('hex') }).toString();
};
const api = async (uid, body, name = 'U' + uid) => {
  const r = await worker.fetch(new Request('https://w.example/api/tasks', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: initData({ id: uid, first_name: name }), ...body }) }), env, { waitUntil() {} });
  return { status: r.status, ...(await r.json()) };
};
await api(1, { op: 'list' }); // sets the tables up
const addChat = (id, o = {}) => DB._db.prepare("INSERT OR REPLACE INTO chats (chat_id, kind, group_id, group_name, role, remind_at, lang, created_at) VALUES (?, 'private', ?, ?, ?, ?, ?, 0)").run(id, o.gid === undefined ? G : o.gid, 'TEST-1', o.role || 'student', o.remind ?? 1260, o.lang || 'uz');
const U = [101, 102, 103, 104, 105, 106]; // a group of 6 → 3 👍 confirm, 3 different people flagging ban
for (const u of U) addChat(u);
addChat(201, { gid: null }); // no group yet
addChat(202, { role: 'teacher' });
addChat(301, { gid: 'otherg' }); // another group
const subs = subjectsOf(Gdata), S0 = subs[0];

let r = await api(201, { op: 'list' });
check('no group chosen → "nogroup", not an error page', r.status === 200 && r.ok === false && r.error === 'nogroup', r);
check('a teacher gets no tasks either', (await api(202, { op: 'list' })).error === 'nogroup');
const bad = await worker.fetch(new Request('https://w.example/api/tasks', { method: 'POST', body: JSON.stringify({ initData: 'user=%7B%22id%22%3A101%7D&hash=bad', op: 'list' }) }), env, {});
check('unsigned / forged initData → 401', bad.status === 401);
r = await api(101, { op: 'list' });
check('list: own group, its subjects with the next lesson day, the thresholds', r.ok && r.gid === G && r.members === 6 && r.subjects.length === subs.length && r.subjects.every((s) => /^\d{4}-\d\d-\d\d$/.test(s.next || '2026-01-01')) && r.need.up === 3 && r.need.down === 3 && r.left === 5, { ...r, subjects: r.subjects.length });

check('list: every subject carries its coming lesson days (up to 6, ascending, the first = "next")', r.subjects.every((x) => Array.isArray(x.dates) && x.dates.length <= 6 && x.dates.every((d, i, a) => i === 0 || a[i - 1] < d) && x.dates[0] === x.next), r.subjects.slice(0, 3));
r = await api(101, { op: 'add', subj: 'Yo\'q fan', text: 'Matn bor', due: 'next' });
check('a subject the group does not have → refused', r.ok === false && r.error === 'subject', r);
check('too short text → refused', (await api(101, { op: 'add', subj: S0, text: 'a', due: 'next' })).error === 'text');
check('a due date in the past / far away / nonsense → refused', (await api(101, { op: 'add', subj: S0, text: 'Matn bor', due: '2020-01-01' })).error === 'due' && (await api(101, { op: 'add', subj: S0, text: 'Matn bor', due: '2099-01-01' })).error === 'due' && (await api(101, { op: 'add', subj: S0, text: 'Matn bor', due: 'x' })).error === 'due');
r = await api(101, { op: 'add', subj: S0, text: '5-mashq <b>test</b>', due: 'next' });
check('add (due = next lesson) works', r.ok && r.id > 0 && /^\d{4}-\d\d-\d\d$/.test(r.due), r);
const T1 = r.id;
check('the same text again → duplicate', (await api(101, { op: 'add', subj: S0, text: '5-mashq <b>test</b>', due: 'next' })).error === 'dup');
r = await api(102, { op: 'list' });
const seen = r.tasks.find((t) => t.id === T1);
check('a classmate sees it, with the author\'s name, not confirmed, not mine', seen && seen.by === 'U101' && seen.st === 0 && !seen.mine && seen.up === 0, r.tasks);
check('another group sees nothing of it', (await api(301, { op: 'list' })).tasks.length === 0);
check('own task: voting on it is refused', (await api(101, { op: 'vote', id: T1, v: 1 })).status === 400);
check('another group cannot vote on it', (await api(301, { op: 'vote', id: T1, v: 1 })).status === 400);
r = await api(102, { op: 'vote', id: T1, v: 1 });
check('1 👍 → counted, not yet confirmed', r.ok && r.up === 1 && r.st === 0 && r.my === 1, r);
r = await api(102, { op: 'vote', id: T1, v: 1 });
check('the same person again → still 1', r.up === 1);
await api(103, { op: 'vote', id: T1, v: 1 });
r = await api(104, { op: 'vote', id: T1, v: 1 });
check('3 👍 → confirmed (st 1)', r.up === 3 && r.st === 1, r);
r = await api(104, { op: 'vote', id: T1, v: 0 });
check('taking a 👍 back → not confirmed again', r.up === 2 && r.st === 0, r);
await api(104, { op: 'vote', id: T1, v: 1 });
check('the author\'s HTML is stored as plain text (escaped only when shown)', (await api(105, { op: 'list' })).tasks.find((t) => t.id === T1).body === '5-mashq <b>test</b>');

// the daily limit: 5 a day
let lastOk = 0;
for (let i = 0; i < 5; i++) { const x = await api(106, { op: 'add', subj: subs[i % subs.length], text: `Vazifa ${i} uchun`, due: 'next' }); if (x.ok) lastOk++; }
r = await api(106, { op: 'add', subj: S0, text: 'Oltinchi vazifa', due: 'next' });
check('5 tasks a day, the 6th is refused', lastOk === 5 && r.error === 'limit', { lastOk, r });
check('…and "left" says 0', (await api(106, { op: 'list' })).left === 0);

// 🚩: 3 different people flag 3 different tasks of 106 → banned from the group (no single task needed 3 flags)
const mine106 = (await api(106, { op: 'list' })).tasks.filter((t) => t.mine);
check('106 has 5 tasks', mine106.length === 5, mine106.length);
sent.length = 0;
r = await api(101, { op: 'vote', id: mine106[0].id, v: -1 });
check('1 🚩 → still allowed', r.ok && r.st === 0 && (await api(106, { op: 'add', subj: S0, text: 'Yana bitta', due: 'next' })).error === 'limit');
await api(102, { op: 'vote', id: mine106[1].id, v: -1 });
check('2 🚩 from different people → not banned yet', !DB._db.prepare('SELECT 1 FROM task_ban WHERE uid = 106').get());
await api(103, { op: 'vote', id: mine106[2].id, v: -1 });
check('3 different people (half of 6) flagged → banned in this group', !!DB._db.prepare('SELECT 1 FROM task_ban WHERE uid = 106 AND gid = ?').get(G));
check('…the person is told, and all their tasks are hidden from the group', sent.some((m) => m.method === 'sendMessage' && m.chat_id === 106 && /shikoyat/.test(m.text)) && (await api(102, { op: 'list' })).tasks.every((t) => t.by !== 'U106'));
r = await api(106, { op: 'list' });
check('…they still see their own (hidden) tasks and know they are banned', r.banned === true && r.tasks.filter((t) => t.mine).length === 5 && r.tasks.filter((t) => t.mine).every((t) => t.st === 2));
r = await api(106, { op: 'add', subj: S0, text: 'Men qaytdim', due: 'next' });
check('a banned person cannot post', r.ok === false && r.error === 'banned', r);
check('flags from outside the group do not count towards a ban', (await api(301, { op: 'vote', id: mine106[3].id, v: -1 })).status === 400);
// the admin lifts it
sent.length = 0;
DB._db.exec('DELETE FROM task_ban WHERE uid = 106');
check('after the ban is lifted they can post again (after a new day)', (await api(106, { op: 'add', subj: S0, text: 'Men qaytdim', due: 'next' })).error === 'limit');

// delete: author or admin only
const T2 = (await api(102, { op: 'add', subj: S0, text: 'O\'chiriladigan vazifa', due: 'next' })).id;
check('a classmate cannot delete it', (await api(103, { op: 'del', id: T2 })).status === 400);
addChat(ADMIN);
check('admin (in the group) deletes anyone\'s task', (await api(ADMIN, { op: 'del', id: T2 })).ok === true);
DB._db.exec('DELETE FROM chats WHERE chat_id = 999');
const T3 = (await api(102, { op: 'add', subj: S0, text: 'Yana bitta vazifa', due: 'next' })).id;
check('the author deletes their own; votes and 🔔 go with it', (await api(102, { op: 'del', id: T3 })).ok && !DB._db.prepare('SELECT 1 FROM task_subs WHERE tid = ?').get(T3));

// ---- reminders (the Worker's own cron)
const day = '2026-12-01'; // a Tuesday
const at = (min, d = day) => Date.parse(`${d}T00:00:00Z`) - 5 * 3600e3 + min * 60e3;
const tick = (min, d) => worker.scheduled({ scheduledTime: at(min, d), cron: '' }, env, { waitUntil() {} });
DB._db.exec('DELETE FROM tasks; DELETE FROM task_votes; DELETE FROM task_subs; DELETE FROM task_sent; DELETE FROM task_ban; DELETE FROM admin_state');
const ins = (o) => DB._db.prepare('INSERT INTO tasks (gid, subj, body, due, uid, uname, at, st, s0) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)').run(G, o.subj || S0, o.body, o.due, o.uid, 'U' + o.uid, o.st || 0, o.s0 || 0).lastInsertRowid;
const sub = (tid, uid) => DB._db.prepare('INSERT OR IGNORE INTO task_subs (tid, uid) VALUES (?, ?)').run(tid, uid);
const toMsgs = () => sent.filter((m) => m.method === 'sendMessage');
const conf = ins({ body: 'Tasdiqlangan vazifa', due: '2026-12-03', uid: 101, st: 1 });
const loose = ins({ body: 'Tasdiqlanmagan vazifa', due: '2026-12-02', uid: 102, st: 0 });
sub(loose, 102); sub(loose, 105); sub(conf, 101);
sent.length = 0;
await tick(3 * 60);
check('night: nothing is sent', toMsgs().length === 0);
await tick(10 * 60);
let m = toMsgs();
check('a confirmed task is announced once to the group, except its author', m.filter((x) => /Yangi vazifa/.test(x.text)).map((x) => x.chat_id).sort().join() === [102, 103, 104, 105, 106].join(), m.map((x) => [x.chat_id, x.text.slice(0, 30)]));
check('…with the subject, the text, the due date and an "open" button into the tasks tab', m[0].text.includes('Tasdiqlangan vazifa') && /03\.12\.2026/.test(m[0].text) && /tab=tasks/.test(m[0].reply_markup.inline_keyboard[0][0].web_app.url) && m[0].reply_markup.inline_keyboard[0][0].web_app.url.includes(G));
sent.length = 0;
await tick(10 * 60 + 10);
check('the next tick does not repeat it', toMsgs().filter((x) => /Yangi vazifa/.test(x.text)).length === 0);
sent.length = 0;
await tick(19 * 60); // the evening before 2 Dec: the loose task is due tomorrow → only the people who pressed 🔔 (and its author)
m = toMsgs().filter((x) => /Ertaga muddat/.test(x.text));
check('evening before: an unconfirmed task reminds only those who asked (🔔) + the author', m.map((x) => x.chat_id).sort().join() === [102, 105].join(), m.map((x) => x.chat_id));
sent.length = 0;
await tick(19 * 60 + 10);
check('…once', toMsgs().filter((x) => /Ertaga muddat/.test(x.text)).length === 0);
sent.length = 0;
await tick(8 * 60, '2026-12-03');
m = toMsgs().filter((x) => /Bugun muddat/.test(x.text));
check('due day morning: a confirmed task reminds the whole group (evening reminder on)', m.length === 6 && m.every((x) => x.text.includes('Tasdiqlangan vazifa')), m.map((x) => x.chat_id));
// somebody who turned the evening reminder off is not bothered by group tasks (but is by their own 🔔)
DB._db.exec('DELETE FROM task_sent; UPDATE chats SET remind_at = -1 WHERE chat_id = 103');
sent.length = 0;
await tick(8 * 60 + 10, '2026-12-03');
check('remind_at off → no group reminders', !toMsgs().some((x) => x.chat_id === 103) && toMsgs().length === 5, toMsgs().map((x) => x.chat_id));
// batches: at most 25 sends per tick, the rest next tick
for (let i = 0; i < 40; i++) addChat(1000 + i);
DB._db.exec('DELETE FROM task_sent; UPDATE tasks SET s0 = 0');
sent.length = 0;
await tick(11 * 60);
const first = toMsgs().length;
check('a big group is served in batches of at most 25 per tick', first > 0 && first <= 25, first);
await tick(11 * 60 + 10); await tick(11 * 60 + 20);
const ids = toMsgs().filter((x) => /Yangi vazifa/.test(x.text)).map((x) => x.chat_id);
check('…and everybody gets it exactly once in the end', new Set(ids).size === ids.length && ids.length === 6 - 1 - 1 + 40 /* the author and the one with reminders off */, ids.length);
// old tasks are cleaned up a month after their due date
ins({ body: 'Eski', due: '2026-10-01', uid: 101 });
DB._db.exec("DELETE FROM admin_state WHERE k = 'tasks_gc'");
await tick(12 * 60, '2026-12-03');
check('tasks 30+ days past their due date are deleted', !DB._db.prepare("SELECT 1 FROM tasks WHERE body = 'Eski'").get());

console.log(fails ? `\n${fails} tasks check(s) failed` : '\nAll tasks checks passed ✅');
process.exit(fails ? 1 : 0);
