// The "bot sends everything twice" regression test: several runs of `notify.mjs auto` — one after another AND at the same
// time, like a GitHub cron run and a Cloudflare nudge landing in the same minute — must message every chat exactly once.
// Needs the local setup of tests/run-bot-flow.sh (Worker :8787, fake Telegram :8790, site :1236).
import crypto from 'node:crypto';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { lessonsForDay, weekParity, weekday, addDays, ymd } from '../src/shared.mjs';

const W = process.env.W || 'http://localhost:8787', M = 'http://localhost:8790';
const secret = crypto.createHash('sha256').update('tg:secretkey').digest('hex').slice(0, 48);
let uid = Math.floor(Date.now() / 1000) + 5_000_000;
const post = (update) => fetch(W + '/tg', { method: 'POST', headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': secret }, body: JSON.stringify({ update_id: uid++, ...update }) });
const log = async () => (await fetch(M + '/__log')).json();
const reset = () => fetch(M + '/__reset');
const msg = (text, chat, from) => ({ message: { message_id: 1, date: 0, chat, from, text } });
const cb = (data, chat, from, mid = 60) => ({ callback_query: { id: 'c' + uid, from, data, message: { message_id: mid, chat } } });
let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? '✅' : '❌') + ' ' + name); if (!cond) { fails++; if (extra !== undefined) console.log(JSON.stringify(extra, null, 1).slice(0, 1200)); } };

// a group that has classes on the day after "today", wherever the test data's week parity falls
const GID = '1thm8e1';
const group = JSON.parse(fs.readFileSync(new URL(`../docs/data/g/${GID}.json`, import.meta.url)));
const index = JSON.parse(fs.readFileSync(new URL('../docs/data/index.json', import.meta.url)));
let tomorrow = new Date('2026-10-13T00:00:00Z');
while (!lessonsForDay(group, weekday(tomorrow), weekParity(index.weekA, tomorrow)).length || weekday(tomorrow) === 6) tomorrow = addDays(tomorrow, 1);
const today = addDays(tomorrow, -1);
const weekdayFake = Date.parse(`${ymd(today)}T16:05:00Z`); // 21:05 in Tashkent, the evening before a day with classes
let sunday = new Date('2026-10-18T00:00:00Z');
while (weekday(sunday) !== 6) sunday = addDays(sunday, 1);
const sundayFake = Date.parse(`${ymd(sunday)}T16:30:00Z`); // Sunday 21:30 in Tashkent

// chats: two students, one student with the weekly post on, a group chat, and one chat where sending fails
const admin = { id: 111, first_name: 'Admin', language_code: 'uz' }; // 111 is "administrator" in the fake Telegram
const mk = (id) => [{ id, type: 'private' }, { id, first_name: 'U' + id, language_code: 'uz' }];
const [c1, u1] = mk(4001), [c2, u2] = mk(4002), [c3, u3] = mk(4003), [c4, u4] = mk(998);
const grp = { id: -100777, type: 'supergroup', title: 'Test group' };
for (const [c, u] of [[c1, u1], [c2, u2], [c3, u3], [c4, u4]]) {
  await post(msg('/start', c, u));
  await post(cb(`g:${u.id}:${GID}`, c, u));
}
await post(cb('s:weekly', c3, u3)); // 4003: weekly post on
await post(msg('/setgroup', grp, admin)); await post(cb(`g:111:${GID}`, grp, admin, 61));
check('the test chats are set up', true);

const env = (fake) => ({ ...process.env, BOT_TOKEN: 'x', ADMIN_KEY: 'secretkey', WORKER_URL: W, SITE_URL: 'http://localhost:1236', TG_API: M, FAKE_NOW: String(fake) });
const run = (fake) => new Promise((resolve) => {
  const p = spawn('node', ['scripts/notify.mjs', 'auto'], { env: env(fake), stdio: ['ignore', 'pipe', 'pipe'] });
  let out = '';
  p.stdout.on('data', (d) => (out += d)); p.stderr.on('data', (d) => (out += d));
  p.on('close', (code) => resolve({ code, out }));
});
const to = (l, id) => l.filter((c) => (c.method === 'sendMessage' || c.method === 'sendPhoto') && c.data.chat_id === id);
const adminHeaders = { 'x-admin-key': 'secretkey', 'content-type': 'application/json' };

// ---- weekday evening: reminder time 21:00 has passed (it is 21:05)
await reset();
const r1 = await run(weekdayFake);
let l = await log();
check('run 1 exits cleanly', r1.code === 0, r1.out);
check('run 1: each due chat got exactly one reminder (students, the group chat)', [4001, 4002, 4003, -100777].every((id) => to(l, id).length === 1), l.map((c) => c.data.chat_id));
check('the reminder is tomorrow\'s timetable of the right group', /MO-901\/26/.test(to(l, 4001)[0]?.data.text || ''), to(l, 4001)[0]?.data.text);
check('the failing chat (Telegram 500) was tried once', to(l, 998).length === 1);
await reset();
const r2 = await run(weekdayFake);
l = await log();
check('run 2 (a minute later): nobody who was served gets a second copy', [4001, 4002, 4003, -100777].every((id) => to(l, id).length === 0), l.map((c) => c.data.chat_id));
check('run 2: the chat whose send failed is retried (claim handed back)', to(l, 998).length === 1);
await reset();
const [r3, r4, r5] = await Promise.all([run(weekdayFake), run(weekdayFake), run(weekdayFake)]);
l = await log();
check('three runs at the same moment: still nobody gets a message', [4001, 4002, 4003, -100777].every((id) => to(l, id).length === 0), l.map((c) => c.data.chat_id));
check('…and all three finish without errors', [r3, r4, r5].every((r) => r.code === 0), [r3.out, r4.out]);

// ---- a fresh day: the very same chats are served again, once, even when runs overlap
await reset();
const nextDay = weekdayFake + 86400e3; // the evening of the next day (still needs classes the day after → may be a free day; only count when text exists)
// Simultaneous runs on the first evening of a new day for a chat that is due:
await fetch(W + '/internal/unclaim', { method: 'POST', headers: adminHeaders, body: JSON.stringify({ kind: 'tmr', day: ymd(today), ids: [4001, 4002, 4003, -100777] }) });
const [ra, rb] = await Promise.all([run(weekdayFake), run(weekdayFake)]);
l = await log();
check('two runs starting together on a day nobody has been served: exactly one message per chat', [4001, 4002, 4003, -100777].every((id) => to(l, id).length === 1), l.map((c) => c.data.chat_id));
check('both runs exit cleanly', ra.code === 0 && rb.code === 0, [ra.out, rb.out]);

// ---- Sunday evening: weekly post, and no extra "tomorrow" message for chats that get it
await reset();
const [s1, s2] = await Promise.all([run(sundayFake), run(sundayFake)]);
l = await log();
// (the picture is used only for the week it was drawn for — on another week the text version goes out)
check('Sunday, two overlapping runs: the group chat gets ONE message (the weekly post: picture or text), not weekly + tomorrow, not twice', to(l, -100777).length === 1 && ['sendPhoto', 'sendMessage'].includes(to(l, -100777)[0].method), to(l, -100777).map((c) => c.method));
check('Sunday: a student with the weekly post on gets one message too', to(l, 4003).length === 1, to(l, 4003).map((c) => c.method));
check('Sunday: students without the weekly post get at most their short reminder, once', to(l, 4001).length <= 1 && to(l, 4002).length <= 1);
await reset();
const s3 = await run(sundayFake);
l = await log();
check('Sunday, a later run: the weekly post is not sent again', to(l, -100777).length === 0 && to(l, 4003).length === 0, l.map((c) => c.data.chat_id));
check('state.json is no longer written (no more "Notification state" commits)', !fs.existsSync(new URL('../docs/data/state.json', import.meta.url)));

// ---- admin announcement: reaches everyone (also people who never picked a group), in their own language, with an invite button
{
  const [c5, u5] = mk(4010), [c6, u6] = mk(4011);
  await post(msg('/start', c5, u5)); // never picks a group, Uzbek
  await post(msg('/start', c6, u6)); await post(cb('lang:ru', c6, u6)); // never picks a group, Russian
  await reset();
  const ann = await new Promise((resolve) => {
    const p = spawn('node', ['scripts/notify.mjs', 'announce'], { env: { ...env(sundayFake), ANNOUNCE_TEXT: '[uz] Salom UZ\\nikkinchi qator [ru] Привет RU [en] Hello EN' }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = ''; p.stdout.on('data', (d) => (out += d)); p.stderr.on('data', (d) => (out += d));
    p.on('close', (code) => resolve({ code, out }));
  });
  l = await log();
  const sentTo = (id) => to(l, id).filter((c) => c.method === 'sendMessage');
  const buttons = (id) => (sentTo(id)[0]?.data.reply_markup?.inline_keyboard || []).flat();
  check('announce exits cleanly', ann.code === 0, ann.out);
  check('announce: every chat gets exactly one message (students, the group chat, chats without a group)', [4001, 4002, 4003, -100777, 4010, 4011].every((id) => sentTo(id).length === 1), l.map((c) => c.data.chat_id));
  check('announce: Uzbek chats get the Uzbek text, with the line break', /Salom UZ\nikkinchi qator/.test(sentTo(4001)[0]?.data.text || '') && !/Привет/.test(sentTo(4001)[0]?.data.text || ''), sentTo(4001)[0]?.data.text);
  check('announce: the Russian chat gets the Russian text', /Привет RU/.test(sentTo(4011)[0]?.data.text || ''), sentTo(4011)[0]?.data.text);
  check('announce: a student gets an "Invite friends" button that opens the share sheet with their group link', buttons(4001).some((b) => /^https:\/\/t\.me\/share\/url\?url=/.test(b.url || '') && (b.url || '').includes(encodeURIComponent('?start=g_' + GID)) && /Do'stlarni taklif/.test(b.text)), buttons(4001));
  check('announce: the chat without a group gets the invite button (generic link) and an "open the app" button', buttons(4010).some((b) => /share\/url/.test(b.url || '') && !(b.url || '').includes('start')) && buttons(4010).some((b) => b.web_app), buttons(4010));
  check('announce: the Russian chat\'s button is in Russian', buttons(4011).some((b) => /Пригласить друзей/.test(b.text)), buttons(4011));
}

console.log(fails ? `\n${fails} check(s) failed` : '\nAll notify checks passed ✅');
process.exit(fails ? 1 : 0);
