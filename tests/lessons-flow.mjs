// Lesson reminders end to end: the Action (notify.mjs lessons) at different moments of a day, against the local Worker + fake Telegram.
// Needs the local setup of tests/run-bot-flow.sh (Worker :8787, fake Telegram :8790, site :1236).
import crypto from 'node:crypto';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { daySlots } from '../src/lessons.mjs';
import { addDays, ymd } from '../src/shared.mjs';

const W = process.env.W || 'http://localhost:8787', M = 'http://localhost:8790';
const secret = crypto.createHash('sha256').update('tg:secretkey').digest('hex').slice(0, 48);
let uid = Math.floor(Date.now() / 1000) + 11_000_000;
const post = (update) => fetch(W + '/tg', { method: 'POST', headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': secret }, body: JSON.stringify({ update_id: uid++, ...update }) });
const log = async () => (await fetch(M + '/__log')).json();
const reset = () => fetch(M + '/__reset');
const msg = (text, chat, from) => ({ message: { message_id: 1, date: 0, chat, from, text } });
const cb = (data, chat, from, message = {}) => ({ callback_query: { id: 'c' + uid, from, data, message: { message_id: 60, chat, ...message } } });
let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? '✅' : '❌') + ' ' + name); if (!cond) { fails++; if (extra !== undefined) console.log(JSON.stringify(extra, null, 1).slice(0, 1500)); } };
const run = (fakeMs) => new Promise((resolve) => {
  const p = spawn('node', ['scripts/notify.mjs', 'lessons'], { env: { ...process.env, BOT_TOKEN: 'x', ADMIN_KEY: 'secretkey', WORKER_URL: W, SITE_URL: 'http://localhost:1236', TG_API: M, FAKE_NOW: String(fakeMs) }, stdio: ['ignore', 'pipe', 'pipe'] });
  let o = ''; p.stdout.on('data', (d) => (o += d)); p.stderr.on('data', (d) => (o += d));
  p.on('close', (code) => resolve({ code, o }));
});
// what Telegram hands back for a message we sent as HTML: plain text + entities (bold / italic / blockquote… with UTF-16 offsets)
function asTelegram(html) {
  let text = '', ents = [];
  const open = [];
  const map = { b: 'bold', i: 'italic', u: 'underline', code: 'code', blockquote: 'blockquote', s: 'strikethrough' };
  const re = /<(\/?)(b|i|u|code|blockquote|s)>|&lt;|&gt;|&amp;|[\s\S]/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[2]) {
      if (!m[1]) open.push({ type: map[m[2]], offset: text.length });
      else { const e = open.pop(); ents.push({ ...e, length: text.length - e.offset }); }
    } else text += m[0] === '&lt;' ? '<' : m[0] === '&gt;' ? '>' : m[0] === '&amp;' ? '&' : m[0];
  }
  return { text, entities: ents };
}
const to = (l, id) => l.filter((c) => c.method === 'sendMessage' && c.data.chat_id === id);

const index = JSON.parse(fs.readFileSync(new URL('../docs/data/index.json', import.meta.url)));
const GID = '1thm8e1', TID = 'thf5rej';
const group = JSON.parse(fs.readFileSync(new URL(`../docs/data/g/${GID}.json`, import.meta.url)));
const teacherTT = JSON.parse(fs.readFileSync(new URL(`../docs/data/t/${TID}.json`, import.meta.url)));
// a weekday on which the group has at least two separate classes
let day = new Date('2026-10-26T00:00:00Z'), slots = [];
for (let i = 0; i < 21; i++, day = addDays(day, 1)) { slots = daySlots(group, index, day); if (slots.length >= 2 && day.getUTCDay() !== 0) break; }
const real = (d, min) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - 5 * 3600e3 + min * 60e3; // Tashkent minute → real time
check(`test day ${ymd(day)}: the group has ${slots.length} slots`, slots.length >= 2);

const S = { id: 8801, type: 'private' }, SU = { id: 8801, first_name: 'Talaba', language_code: 'uz' };
const OFF = { id: 8803, type: 'private' }, OFFU = { id: 8803, first_name: 'Jim', language_code: 'uz' };
const T = { id: 8802, type: 'private' }, TU = { id: 8802, first_name: 'Ustoz', language_code: 'uz' };
for (const [c, u] of [[S, SU], [OFF, OFFU]]) { await post(msg('/start', c, u)); await post(cb(`g:${u.id}:${GID}`, c, u)); }
await post(msg('/start', T, TU)); await post(cb('R:8802:t', T, TU)); await post(cb(`tp:8802:${TID}`, T, TU));
// 8803 switches the reminders off in Settings
await reset(); await post(cb('s:lr', OFF, OFFU));
let l = await log();
check('Settings has the "⏰ reminder before class" switch, and it turns off', l.some((c) => c.method === 'editMessageText' && /Dars oldidan eslatma: ❌/.test(JSON.stringify(c.data.reply_markup))), l.map((c) => c.method));

// ---- 12 minutes before the first class
const s0 = slots[0];
await reset();
let r = await run(real(day, s0.start - 12));
l = await log();
check('the run exits cleanly', r.code === 0, r.o.slice(-600));
const m0 = to(l, 8801);
check('the student gets ONE reminder: time, subject, room, a joke', m0.length === 1 && /12 daqiqadan keyin dars/.test(m0[0].data.text) && /📘 /.test(m0[0].data.text) && /🕘 /.test(m0[0].data.text), m0.map((c) => c.data.text));
check('…the first one carries the short intro', /🆕/.test(m0[0]?.data.text || ''));
check('…HTML: the room in bold, the joke as a quote; with sound', m0[0]?.data.parse_mode === 'HTML' && /🚪 <b>/.test(m0[0].data.text) && /<blockquote>/.test(m0[0].data.text) && !m0[0].data.disable_notification);
const kb0 = m0[0]?.data.reply_markup?.inline_keyboard?.flat() || [];
check('…buttons: 🔕 turn off and 😄 another one', kb0.some((b) => b.callback_data === 'lr:off') && kb0.some((b) => /^jk:\w+$/.test(b.callback_data)), kb0);
check('the chat that switched it off gets nothing', to(l, 8803).length === 0);
check('group chats get nothing', !l.some((c) => c.method === 'sendMessage' && c.data.chat_id < 0));
await reset();
await run(real(day, s0.start - 11));
check('a second run a minute later sends nothing new (claimed)', to(await log(), 8801).length === 0);

// ---- the buttons
const sent = m0[0];
await reset();
const tgSent = asTelegram(sent.data.text);
await post(cb(kb0.find((b) => /^jk:/.test(b.callback_data)).callback_data, S, SU, { message_id: sent.result.message_id, ...tgSent, reply_markup: sent.data.reply_markup }));
l = await log();
const ed = l.find((c) => c.method === 'editMessageText');
const quote = (t) => /<blockquote>([\s\S]*?)<\/blockquote>/.exec(t)?.[1].replace(/<[^>]+>/g, '');
check('😄 another one → a different joke, still a quote; everything else (bold room, intro) stays', ed && ed.data.parse_mode === 'HTML' && quote(ed.data.text) && quote(ed.data.text) !== quote(sent.data.text) && ed.data.text.replace(/<blockquote>[\s\S]*?<\/blockquote>/, '') === sent.data.text.replace(/<blockquote>[\s\S]*?<\/blockquote>/, ''), [sent.data.text, ed?.data.text]);
await reset();
await post(cb('lr:off', S, SU, { message_id: sent.result.message_id, ...tgSent, reply_markup: sent.data.reply_markup }));
l = await log();
const off = l.find((c) => c.method === 'editMessageText');
check('🔕 → reminders off, the message says so and offers ↩️ turn back on (formatting kept)', off && /o'chirildi/.test(off.data.text) && /🚪 <b>/.test(off.data.text) && /<blockquote>/.test(off.data.text) && /^lr:on:\w+$/.test(off.data.reply_markup.inline_keyboard[0][0].callback_data), off?.data);
const s1 = slots[1];
await reset(); await run(real(day, s1.start - 12));
const l1 = await log();
check('…and the next class brings no reminder', to(l1, 8801).length === 0);
// (this run is also past "10 minutes after the first class started")
check('10 minutes after the class started, the reminder is deleted', l1.some((c) => c.method === 'deleteMessage' && c.data.chat_id === 8801 && c.data.message_id === sent.result.message_id), l1.filter((c) => c.method === 'deleteMessage'));
await reset();
await post(cb(off.data.reply_markup.inline_keyboard[0][0].callback_data, S, SU, { message_id: sent.result.message_id, ...asTelegram(off.data.text) }));
l = await log();
const on = l.find((c) => c.method === 'editMessageText');
check('↩️ → back on, with both buttons again', on && /yoqildi/.test(on.data.text) && !/o'chirildi/.test(on.data.text) && /🚪 <b>/.test(on.data.text) && on.data.reply_markup.inline_keyboard[0].length === 2, on?.data);


// ---- end of the day
const last = slots[slots.length - 1];
await reset(); await run(real(day, last.end + 1));
l = await log();
const de = to(l, 8801).find((c) => /tugadi/.test(c.data.text));
check('right after the last class: "today\'s classes are over" + a line, silent', de && de.data.disable_notification === true && de.data.reply_markup.inline_keyboard[0][0].callback_data === 'de:off', to(l, 8801).map((c) => c.data.text));
await reset(); await run(real(day, last.end + 62));
check('an hour later it is deleted', (await log()).some((c) => c.method === 'deleteMessage' && c.data.chat_id === 8801 && c.data.message_id === de?.result?.message_id));
check('the chat with reminders off still gets the end-of-day message (it is a separate switch)', to(l, 8803).some((c) => /tugadi/.test(c.data.text)));

// ---- the teacher
let tday = new Date('2026-10-26T00:00:00Z'), tslots = [];
for (let i = 0; i < 21; i++, tday = addDays(tday, 1)) { tslots = daySlots(teacherTT, index, tday); if (tslots.length && tday.getUTCDay() !== 0) break; }
await reset(); await run(real(tday, tslots[0].start - 12));
l = await log();
const tm = to(l, 8802)[0];
check('the teacher gets a reminder with the group instead of a teacher', tm && /👥 /.test(tm.data.text) && !/👨‍🏫/.test(tm.data.text), to(l, 8802).map((c) => c.data.text));
await reset(); await run(real(tday, tslots[tslots.length - 1].end + 1));
const tend = to(await log(), 8802).find((c) => /tugadi/.test(c.data.text));
check('…and a warm end-of-day line', !!tend && /darslaringiz tugadi/.test(tend.data.text), tend?.data.text);

await reset();
await post(cb('jk:s_any', T, TU, { message_id: 77, text: 'x\n\n' + 'J', reply_markup: {} }));
check('a forged "another one" with a student list does nothing for a teacher', !(await log()).some((c) => c.method === 'editMessageText'));

console.log(fails ? `\n${fails} lessons-flow check(s) failed` : '\nAll lessons-flow checks passed ✅');
process.exit(fails ? 1 : 0);
