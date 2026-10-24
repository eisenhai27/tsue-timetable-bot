// 👥 Friends end to end against the local Worker + fake Telegram (tests/run-bot-flow.sh), plus the pure "where / both free" logic.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { commonFree, fmtCommon, friendStatus, fmtFriends, FR_PAGE } from '../src/friends.mjs';

const W = process.env.W || 'http://localhost:8787', M = 'http://localhost:8790';
const secret = crypto.createHash('sha256').update('tg:secretkey').digest('hex').slice(0, 48);
const TOKEN = fs.readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8').match(/^BOT_TOKEN=(.*)$/m)[1].trim();
let uid = Math.floor(Date.now() / 1000) + 21_000_000;
const post = (update) => fetch(W + '/tg', { method: 'POST', headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': secret }, body: JSON.stringify({ update_id: uid++, ...update }) });
const log = async () => (await fetch(M + '/__log')).json();
const reset = () => fetch(M + '/__reset');
const msg = (text, chat, from) => ({ message: { message_id: 1, date: 0, chat, from, text } });
const cb = (data, chat, from, mid = 70) => ({ callback_query: { id: 'c' + uid, from, data, message: { message_id: mid, chat } } });
let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? '✅' : '❌') + ' ' + name); if (!cond) { fails++; if (extra !== undefined) console.log(JSON.stringify(extra, null, 1).slice(0, 1500)); } };
const to = (l, id) => l.filter((c) => (c.method === 'sendMessage' || c.method === 'editMessageText') && c.data.chat_id === id);
const btns = (c) => c?.data.reply_markup?.inline_keyboard?.flat() || [];
// how many friends someone has, read from their own 👥 list in the bot
const listOf = async (chat, user) => { await reset(); await post(msg("👥 Do'stlar", chat, user)); return to(await log(), chat.id)[0]; };
const nFriends = async (chat, user) => { const m = await listOf(chat, user); return /Hali do'stingiz yo'q/.test(m?.data.text || '') ? 0 : (m?.data.text.match(/^<b>/gm) || []).length; };
void TOKEN;

// ---- the pure part: a made-up day (Monday) with two timetables
const index = { weekA: null, periods: [{ p: 1, start: '08:00', end: '09:20' }, { p: 2, start: '09:30', end: '10:50' }, { p: 3, start: '11:00', end: '12:20' }, { p: 4, start: '13:00', end: '14:20' }, { p: 5, start: '14:30', end: '15:50' }] };
const A = { lessons: [{ d: 0, p: 1, s: 'Matematika', r: '11-204-48' }, { d: 0, p: 2, s: 'Fizika', r: '11-305-30' }, { d: 0, p: 4, s: 'Tarix', r: '8-101-20' }] };
const B = { lessons: [{ d: 0, p: 2, s: 'Ingliz tili', r: '2-410-25' }, { d: 0, p: 5, s: 'Iqtisod', r: '12-301-30' }] };
const mon = (h, m) => new Date(Date.UTC(2026, 9, 26, h, m)); // Monday 26 Oct 2026, Tashkent wall time
let c = commonFree(A, B, index, mon(8, 30));
check('both free: the gaps in which neither has a class (10:50–13:00; 14:20–14:30 is too short) and after 15:50', c && c.gaps.length === 1 && c.gaps[0].from === 650 && c.gaps[0].to === 780 && c.after === 950, c);
check('…as text', fmtCommon(c, 'uz') === "🤝 Ikkalangiz bo'sh: 10:50–13:00, 15:50 dan keyin", fmtCommon(c, 'uz'));
c = commonFree(A, B, index, mon(12, 0));
check('…from now on: at 12:00 the gap starts now', c.gaps[0].from === 720 && c.gaps[0].to === 780, c);
check('…after both are done: "both free now"', fmtCommon(commonFree(A, B, index, mon(16, 30)), 'uz') === "🤝 Hozir ikkalangiz ham bo'shsiz");
check('…one of them has no classes that day → nothing', commonFree(A, { lessons: [] }, index, mon(9, 0)) === null);
check('status: in class, with the room and until when', friendStatus(A, index, mon(8, 15), 'uz') === '📘 Darsda: 11-bino, 204-xona · 09:20 gacha', friendStatus(A, index, mon(8, 15), 'uz'));
check('status: free, with the next class', friendStatus(A, index, mon(11, 30), 'uz') === "🟢 Hozir bo'sh · keyingi dars 13:00, 8-bino, 101-xona", friendStatus(A, index, mon(11, 30), 'uz'));
check('status: done / no classes / no group', friendStatus(A, index, mon(15, 0), 'uz') === '✅ Bugungi darslari tugadi' && friendStatus({ lessons: [] }, index, mon(9, 0), 'uz') === "🏠 Bugun darsi yo'q" && friendStatus(null, index, mon(9, 0), 'uz') === '❔ Guruh tanlamagan');
check('names are escaped in the message', /&lt;b&gt;Ali/.test(fmtFriends([{ name: '<b>Ali', gname: 'MO-1', ent: A }], B, index, mon(9, 0), 'uz').text));
// many friends: free ones first, a summary line, pages, a "free only" filter
{
  const many = Array.from({ length: 20 }, (_, i) => ({ name: `F${String(i).padStart(2, '0')}`, gname: 'G', ent: i % 3 === 0 ? B : i % 3 === 1 ? A : { lessons: [] } }));
  const t = mon(8, 15); // A in class (p1), B not started yet (free until 09:30), the empty one: no classes
  const v = fmtFriends(many, A, index, t, 'uz');
  const names = [...v.text.matchAll(/<b>(F\d\d)<\/b>/g)].map((m) => m[1]);
  check(`many friends: ${FR_PAGE} per page (${v.pages} pages), a summary line on top`, names.length === FR_PAGE && v.pages === 3 && /20 ta do'st · 🟢 7 bo'sh · 📘 7 darsda/.test(v.text), v.text.slice(0, 200));
  check('…the 7 free now come first, then the ones in class', names.slice(0, 7).every((n) => Number(n.slice(1)) % 3 === 0) && Number(names[7].slice(1)) % 3 === 1, names);
  const last = fmtFriends(many, A, index, t, 'uz', { page: 2 });
  check('…the last page has the rest (no classes today last)', last.page === 2 && (last.text.match(/^<b>/gm) || []).length === 4 && /darsi yo'q/.test(last.text));
  const free = fmtFriends(many, A, index, t, 'uz', { onlyFree: true });
  check('…"free only" shows just the 7 free ones', free.pages === 1 && (free.text.match(/^<b>/gm) || []).length === 7 && !/Darsda/.test(free.text));
  check('…a page past the end is clamped', fmtFriends(many, A, index, t, 'uz', { page: 99 }).page === 2);
}

// ---- end to end
const G = JSON.parse(fs.readFileSync(new URL('../docs/data/index.json', import.meta.url))).faculties[0].courses[0].groups[0][0];
const [ca, ua] = [{ id: 8101, type: 'private' }, { id: 8101, first_name: 'Aziza', last_name: 'Karimova', language_code: 'uz' }];
const [cbB, ub] = [{ id: 8102, type: 'private' }, { id: 8102, first_name: 'Bobur', language_code: 'uz' }];
const [cc, uc] = [{ id: 8103, type: 'private' }, { id: 8103, first_name: 'Sardor', language_code: 'ru' }];
await post(msg(`/start g_${G}`, ca, ua)); // A has a group
await reset(); await post(msg("👥 Do'stlar", ca, ua));
let l = await log();
const empty = to(l, 8101)[0];
const share = btns(empty).find((b) => /t\.me\/share\/url/.test(b.url || ''));
const link = decodeURIComponent(/url=([^&]+)/.exec(share?.url || '')?.[1] || '');
check('👥 Do\'stlar (no friends yet) → what it is + an "add a friend" share button with my invite link', /Hali do'stingiz yo'q/.test(empty?.data.text || '') && /GPS/.test(empty.data.text) && /\?start=f[0-9a-z]+_[A-Za-z0-9_-]{10}$/.test(link), { text: empty?.data.text, link });
const code = /start=f(.+)$/.exec(link)?.[1];
await reset(); await post(msg(`/start f${code}`, ca, ua));
check('my own link → "this is your own link"', to(await log(), 8101).some((m) => /o'z havolangiz/.test(m.data.text)));
await reset(); await post(msg(`/start f${code.slice(0, -1)}${code.endsWith('A') ? 'B' : 'A'}`, { id: 8104, type: 'private' }, { id: 8104, first_name: 'X' }));
l = await log();
check('a forged link (wrong signature) → refused, no invite card', to(l, 8104).some((m) => /eskirgan yoki noto'g'ri/.test(m.data.text)) && !to(l, 8104).some((m) => btns(m).some((b) => /^fr:a:/.test(b.callback_data))), to(l, 8104).map((m) => m.data.text));
await reset(); await post(msg(`/start f${code}`, cbB, ub)); // B is new: welcome + the invite card
l = await log();
const card = to(l, 8102).find((m) => /do'st qilib qo'shmoqchi/.test(m.data.text));
check('a new person opening the link → welcome (with the keyboard) + "Aziza K. wants to be your friend" with ✅ / ❌', to(l, 8102).some((m) => m.data.reply_markup?.keyboard) && card && /Aziza K\./.test(card.data.text) && btns(card).some((b) => b.callback_data === `fr:a:${code}`), to(l, 8102).map((m) => m.data.text.slice(0, 60)));
check('nothing is made before the "yes"', (await nFriends(ca, ua)) === 0);
await reset(); await post(cb(`fr:a:${code}`, cbB, ub));
l = await log();
check('✅ → "you are friends now", the inviter is told', to(l, 8102).some((m) => /Endi siz va <b>Aziza K\.<\/b> do'stsiz/.test(m.data.text)) && to(l, 8101).some((m) => /<b>Bobur<\/b> do'stlik taklifingizni qabul qildi/.test(m.data.text)), l.map((c2) => [c2.method, c2.data.chat_id, (c2.data.text || '').slice(0, 50)]));
check('…B has no group yet → asked to pick one (so A can see B)', to(l, 8102).some((m) => /guruhingizni tanlang/.test(m.data.text)));
await reset(); await post(cb(`fr:a:${code}`, cbB, ub));
check('…a second tap does not tell the inviter again', !to(await log(), 8101).length);
await post(msg(`/start g_${G}`, cbB, ub)); // B picks the same group
await reset(); await post(msg("👥 Do'stlar", ca, ua));
const list = to(await log(), 8101)[0];
check('A\'s list: Bobur, his group, where he is now (one of the status lines) and the buttons (no app button: the bot is enough)', /<b>Bobur<\/b>/.test(list?.data.text || '') && /(Darsda|Hozir bo'sh|tugadi|darsi yo'q)/.test(list.data.text) && btns(list).some((b) => /^fr:l:0:0$/.test(b.callback_data)) && !btns(list).some((b) => b.web_app) && btns(list).some((b) => b.callback_data === 'fr:m:0'), list?.data.text);
check('…few friends: no pages, no filter', !btns(list).some((b) => /^fr:l:1:/.test(b.callback_data) || /:0:1$/.test(b.callback_data)));
// C accepts the same link (links can be forwarded — the owner is told, and can remove)
await post(msg('/start', cc, uc));
await reset(); await post(msg(`/start f${code}`, cc, uc));
await post(cb(`fr:a:${code}`, cc, uc));
l = await log();
check('a third person with the same link → their own card; the owner is told (and can remove them)', to(l, 8103).some((m) => /do'st qilib qo'shmoqchi/.test(m.data.text)) && to(l, 8101).some((m) => /<b>Sardor<\/b> do'stlik/.test(m.data.text)));
// manage → remove
await reset(); await post(cb('fr:m', ca, ua, 90));
const mg = to(await log(), 8101)[0];
const rm = btns(mg).find((b) => /^fr:d:8103(:\d+)?$/.test(b.callback_data));
check('⚙️ manage → a ✖️ button per friend', mg && btns(mg).filter((b) => /^fr:d:/.test(b.callback_data)).length === 2 && rm);
await reset(); await post(cb('fr:d:8103', ca, ua, 90));
check('✖️ → removed from both sides', /Sardor ro'yxatdan olib tashlandi/.test(to(await log(), 8101)[0]?.data.text || '') && (await nFriends(cc, uc)) === 0 && (await nFriends(ca, ua)) === 1);
// many friends in the bot: pages and the "free only" filter
for (let i = 0; i < 12; i++) { const c2 = { id: 8200 + i, type: 'private' }, u2 = { id: 8200 + i, first_name: 'Do\'st' + i }; await post(msg(`/start f${code}`, c2, u2)); await post(cb(`fr:a:${code}`, c2, u2)); }
const big = await listOf(ca, ua);
check('13 friends → a summary line, 8 on the first page, ◀️ 1/2 ▶️ and "🟢 Faqat bo\'shlar"', /13 ta do'st/.test(big?.data.text || '') && (big.data.text.match(/^<b>/gm) || []).length === 8 && btns(big).some((b) => b.text === '1/2') && btns(big).some((b) => b.callback_data === 'fr:l:1:0') && btns(big).some((b) => b.callback_data === 'fr:l:0:1'), btns(big));
await reset(); await post(cb('fr:l:1:0', ca, ua, 91));
const p2 = to(await log(), 8101)[0];
check('▶️ → page 2 in place with the other 5', p2?.method === 'editMessageText' && (p2.data.text.match(/^<b>/gm) || []).length === 5 && btns(p2).some((b) => b.text === '2/2'), p2?.data.text);
await reset(); await post(cb('fr:l:0:1', ca, ua, 91));
const fr = to(await log(), 8101)[0];
check('"free only" → only the ones free now (or "none is free"), with a way back to all', fr && !/📘 Darsda/.test(fr.data.text) && btns(fr).some((b) => b.callback_data === 'fr:l:0:0'), fr?.data.text);
await reset(); await post(cb('fr:m:0', ca, ua, 92));
const m2 = to(await log(), 8101)[0];
check('⚙️ manage with many friends → 12 per page, with pages', btns(m2).filter((b) => /^fr:d:/.test(b.callback_data)).length === 12 && btns(m2).some((b) => b.callback_data === 'fr:m:1'), btns(m2).length);
await reset(); await post(cb(`fr:a:${code}`, cc, uc)); // an old card can make it again (the inviter's link still stands)
check('the old card still works (the link is the inviter\'s standing invitation)', (await nFriends(cc, uc)) === 1);

console.log(fails ? `\n${fails} friends check(s) failed` : '\nAll friends checks passed ✅');
process.exit(fails ? 1 : 0);
