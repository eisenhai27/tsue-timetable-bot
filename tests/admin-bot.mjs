// The separate admin bot (ADMIN_BOT_TOKEN): only the owner gets in, statistics / feedback / E'lon live there, answers to feedback
// and announcements still reach students through the STUDENT bot, and the student bot loses its admin features.
// Run by tests/run-bot-flow.sh against a Worker started with --var ADMIN_BOT_TOKEN:<test token>.
import crypto from 'node:crypto';
import fs from 'node:fs';

const W = process.env.W || 'http://localhost:8787', M = 'http://localhost:8790';
const vars = fs.readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8');
const TOKEN = vars.match(/^BOT_TOKEN=(.*)$/m)[1].trim();
const ADMIN = Number(vars.match(/^ADMIN_CHAT_ID=(.*)$/m)[1].trim());
const ATOKEN = process.env.ATOKEN || 'admintoken123';
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 48);
let uid = Math.floor(Date.now() / 1000) + 9_000_000;
const postTo = (path, secret, update) => fetch(W + path, { method: 'POST', headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': secret }, body: JSON.stringify({ update_id: uid++, ...update }) });
const student = (u) => postTo('/tg', sha('tg:secretkey'), u);
const adminBot = (u) => postTo('/tga', sha('tga:secretkey'), u);
const log = async () => (await fetch(M + '/__log')).json();
const reset = () => fetch(M + '/__reset');
const msg = (text, chat, from, extra = {}) => ({ message: { message_id: 1, date: 0, chat, from, text, ...extra } });
let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? '✅' : '❌') + ' ' + name); if (!cond) { fails++; if (extra !== undefined) console.log(JSON.stringify(extra, null, 1).slice(0, 1500)); } };
const viaAdmin = (l) => l.filter((c) => c.bot === ATOKEN), viaStudent = (l) => l.filter((c) => c.bot === TOKEN);
const me = { id: ADMIN, type: 'private' }, meU = { id: ADMIN, first_name: 'Owner' };
const other = { id: 515151, type: 'private' }, otherU = { id: 515151, first_name: 'Stranger' };

// ---- the admin bot sets itself up on the first student-bot update
await reset();
await student(msg('/start', { id: 616161, type: 'private' }, { id: 616161, first_name: 'S', language_code: 'uz' }));
await new Promise((r) => setTimeout(r, 800));
let l = await log();
const hook = viaAdmin(l).find((c) => c.method === 'setWebhook');
check('admin bot webhook is set automatically, to /tga with its own secret', hook && /\/tga$/.test(hook.data.url) && hook.data.secret_token === sha('tga:secretkey'), viaAdmin(l));
check('the owner gets an E\'lon menu button in the admin bot', viaAdmin(l).some((c) => c.method === 'setChatMenuButton' && String(c.data.chat_id) === String(ADMIN) && /#tab=admin$/.test(c.data.menu_button?.web_app?.url || '')));
await reset();
await student(msg('/help', { id: 616161, type: 'private' }, { id: 616161, first_name: 'S', language_code: 'uz' }));
await new Promise((r) => setTimeout(r, 500));
check('…only once (not on every update)', !viaAdmin(await log()).some((c) => c.method === 'setWebhook'));

// ---- the door
let r = await fetch(W + '/tga', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
check('/tga without the secret → 403', r.status === 403);
r = await postTo('/tga', sha('tg:secretkey'), msg('/stats', me, meU));
check('/tga with the STUDENT bot\'s secret → 403', r.status === 403);
await reset(); await adminBot(msg('/stats', other, otherU));
l = await log();
check('a stranger gets no statistics — a friendly "what this is" with a button to the student bot', viaAdmin(l).some((c) => /xizmat boti/.test(c.data.text || '') && (c.data.reply_markup?.inline_keyboard?.flat() || []).some((b) => /^https:\/\/t\.me\//.test(b.url || ''))) && !l.some((c) => /Jami: \d+/.test(c.data.text || '')), l);
await reset(); await adminBot(msg('/start', other, { ...otherU, language_code: 'ru' }));
l = await log();
check('…in their language', viaAdmin(l).some((c) => /служебный бот/.test(c.data.text || '')), l);
await reset(); await adminBot(msg('Botda xato bor: 3-kurs topilmadi', other, otherU));
l = await log();
const vfw = viaAdmin(l).find((c) => String(c.data.chat_id) === String(ADMIN) && /3-kurs topilmadi/.test(c.data.text || ''));
check('what a stranger writes reaches the owner as feedback (marked as written to the admin bot)', vfw && /admin botga yozilgan/.test(vfw.data.text), l.map((c) => [c.bot, c.data.chat_id, (c.data.text || '').slice(0, 50)]));
check('…and they get a thank-you', viaAdmin(l).some((c) => c.data.chat_id === 515151 && /Rahmat/.test(c.data.text || '')));
await reset(); await adminBot(msg('Rahmat, tekshiramiz', me, meU, { reply_to_message: { message_id: vfw?.result?.message_id, chat: me } }));
l = await log();
check('the owner\'s answer goes back through the ADMIN bot (the stranger may never have started the student bot)', viaAdmin(l).some((c) => c.data.chat_id === 515151 && /Rahmat, tekshiramiz/.test(c.data.text || '')) && !viaStudent(l).some((c) => c.data.chat_id === 515151), l.map((c) => [c.bot, c.data.chat_id]));

// ---- the owner's tools
await reset(); await adminBot(msg('/start', me, meU));
l = await log();
check('/start → admin menu with the reply keyboard', viaAdmin(l).some((c) => /boshqaruv/.test(c.data.text || '') && c.data.reply_markup?.keyboard), viaAdmin(l));
await reset(); await adminBot(msg('📊 Statistika', me, meU));
l = await log();
const st = viaAdmin(l).find((c) => /statistika/.test(c.data.text || ''));
check('📊 Statistika → the statistics, sent by the ADMIN bot', st && /Jami: \d+/.test(st.data.text), l.map((c) => [c.bot, c.method]));
await reset(); await adminBot({ callback_query: { id: 'q1', from: meU, data: 'adm:stats', message: { message_id: 77, chat: me } } });
l = await log();
check('refresh button edits the statistics in the admin bot', viaAdmin(l).some((c) => c.method === 'editMessageText' && c.data.message_id === 77));
await reset(); await adminBot(msg("📣 E'lon", me, meU));
l = await log();
check("📣 E'lon → inline button that opens the screen", viaAdmin(l).some((c) => (c.data.reply_markup?.inline_keyboard?.flat() || []).some((b) => /#tab=admin$/.test(b.web_app?.url || ''))));

// ---- feedback: arrives in the admin bot, the answer reaches the student through the STUDENT bot
const stu = { id: 626262, type: 'private' }, stuU = { id: 626262, first_name: 'Talaba', language_code: 'uz' };
await student(msg('/start', stu, stuU));
await reset(); await student(msg('/feedback Xona 305 jadvalda yoq', stu, stuU));
l = await log();
const fw = viaAdmin(l).find((c) => String(c.data.chat_id) === String(ADMIN) && /Xona 305/.test(c.data.text || ''));
check('feedback is forwarded to the owner through the ADMIN bot', !!fw, l.map((c) => [c.bot, c.method, c.data.chat_id]));
check('…and not through the student bot any more', !viaStudent(l).some((c) => String(c.data.chat_id) === String(ADMIN)));
await reset(); await adminBot(msg('Rahmat, tuzatdik!', me, meU, { reply_to_message: { message_id: fw?.result?.message_id, chat: me } }));
l = await log();
check('Reply in the admin bot → the answer goes to the student via the STUDENT bot', viaStudent(l).some((c) => c.data.chat_id === 626262 && /Rahmat, tuzatdik/.test(c.data.text || '')), l.map((c) => [c.bot, c.method, c.data.chat_id]));
check('…and the owner gets a confirmation in the admin bot', viaAdmin(l).some((c) => /Javob yuborildi/.test(c.data.text || '')));
await reset(); await adminBot(msg('✍️ Fikrlar', me, meU));
l = await log();
const fbMsgs = viaAdmin(l).filter((c) => c.method === 'sendMessage');
const fbList = fbMsgs.find((c) => /So'nggi fikrlar/.test(c.data.text || ''));
check('✍️ Fikrlar → ONE message with the last (up to 3) feedbacks, newest first', fbMsgs.length === 1 && fbList && /Xona 305/.test(fbList.data.text), fbMsgs.map((c) => (c.data.text || '').slice(0, 60)));
const fbBtn = fbList?.data.reply_markup?.inline_keyboard?.flat().find((b) => /^fb:r:\d+$/.test(b.callback_data));
check('…each with a ↩️ answer button', !!fbBtn, fbList?.data.reply_markup);
await reset(); await adminBot({ callback_query: { id: 'qfb', from: meU, data: fbBtn?.callback_data, message: { message_id: 777, chat: me } } });
l = await log();
const prompt = viaAdmin(l).find((c) => c.method === 'sendMessage' && c.data.reply_markup?.force_reply);
check('↩️ → a "write your answer" prompt (force reply) quoting the feedback', prompt && /Xona 305/.test(prompt.data.text), viaAdmin(l));
await reset(); await adminBot(msg('Tuzatildi, rahmat!', me, meU, { reply_to_message: { message_id: prompt?.result?.message_id } }));
check('…replying to the prompt delivers the answer through the STUDENT bot', viaStudent(await log()).some((c) => c.data.chat_id === 626262 && /Tuzatildi, rahmat/.test(c.data.text || '')));
// many feedbacks: still 3 per message, with paging
for (let i = 0; i < 5; i++) await student(msg(`/feedback test fikr ${i}`, { id: 700 + i, type: 'private' }, { id: 700 + i, first_name: 'T' + i }));
await reset(); await adminBot(msg('✍️ Fikrlar', me, meU));
l = await log();
const page1 = viaAdmin(l).find((c) => /So'nggi fikrlar/.test(c.data.text || ''));
check('…only the newest 3 (fikr 4, 3, 2), and an "older" button', page1 && /test fikr 4/.test(page1.data.text) && /test fikr 2/.test(page1.data.text) && !/test fikr 1/.test(page1.data.text) && /fb:p:3/.test(JSON.stringify(page1.data.reply_markup)), page1?.data.text);
await reset(); await adminBot({ callback_query: { id: 'qfp', from: meU, data: 'fb:p:3', message: { message_id: 778, chat: me } } });
const page2 = viaAdmin(await log()).find((c) => c.method === 'editMessageText');
check('…"older" shows the next 3 in the same message', page2 && /test fikr 1/.test(page2.data.text) && /\(4–6 \//.test(page2.data.text), page2?.data.text);
await reset(); await adminBot(msg('/reply 626262 Yana bir javob', me, meU));
l = await log();
check('/reply <id> text works too', viaStudent(l).some((c) => c.data.chat_id === 626262 && /Yana bir javob/.test(c.data.text || '')));

// ---- the student bot no longer does admin work
await reset(); await student(msg('/stats', me, meU));
l = await log();
check('/stats in the STUDENT bot points to the admin bot instead', viaStudent(l).some((c) => /alohida botda/.test(c.data.text || '')) && !l.some((c) => /Jami: \d+/.test(c.data.text || '')), l.map((c) => [c.bot, c.method, (c.data.text || '').slice(0, 40)]));
check('…and removes the admin commands from the student bot menu', viaStudent(l).some((c) => c.method === 'deleteMyCommands' && c.data.scope?.chat_id === ADMIN));

// ---- the E'lon screen accepts only the admin bot's signature
const initData = (u, tok) => {
  const p = { auth_date: String(Math.floor(Date.now() / 1000)), query_id: 'AAH', user: JSON.stringify(u) };
  const c = Object.keys(p).sort().map((k) => `${k}=${p[k]}`).join('\n');
  const sec = crypto.createHmac('sha256', 'WebAppData').update(tok).digest();
  return new URLSearchParams({ ...p, hash: crypto.createHmac('sha256', sec).update(c).digest('hex') }).toString();
};
const api = async (tok, body) => { const x = await fetch(W + '/api/admin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: initData(meU, tok), ...body }) }); return { status: x.status, ...(await x.json().catch(() => ({}))) }; };
r = await api(ATOKEN, { op: 'me' });
check('Mini App opened from the ADMIN bot → owner recognised', r.ok && r.admin === true, r);
r = await api(TOKEN, { op: 'me' });
check('Mini App opened from the STUDENT bot → no E\'lon tab, even for the owner', !r.admin, r);
r = await api(TOKEN, { op: 'count', filter: {} });
check('…and its signature cannot use the admin API', r.status === 401, r);
r = await api(ATOKEN, { op: 'count', filter: {} });
check('the admin bot\'s signature can', r.ok && Number.isInteger(r.n), r);

// ---- announcements made in the admin bot: send or forward ANY message → sample in the student bot → audience → confirm → queue
const cbq = (data, mid) => adminBot({ callback_query: { id: 'q' + uid, from: meU, data, message: { message_id: mid, chat: me } } });
await reset();
await adminBot({ message: { message_id: 50, date: 0, chat: me, from: meU, forward_origin: { type: 'channel' }, caption: 'Shanba kuni klub tadbiri!', caption_entities: [{ type: 'bold', offset: 0, length: 6 }], video: { file_id: 'VID1', file_size: 5000, width: 1280, height: 720, duration: 12, mime_type: 'video/mp4' } } });
l = await log();
const up = viaStudent(l).find((c) => c.method === 'sendVideo');
check('forwarded video → downloaded from the admin bot and re-uploaded by the STUDENT bot into the owner\'s chat (the sample)', viaAdmin(l).some((c) => c.method === 'getFile') && l.some((c) => c.result === 'bytes') && up && up.data.chat_id === ADMIN && up.data.fields.includes('video') && up.data.fields.includes('caption_entities') && /klub tadbiri/.test(up.data.caption || ''), l.map((c) => [c.bot, c.method, c.data.chat_id]));
check('the sample gets the same buttons students will get', viaStudent(l).some((c) => c.method === 'editMessageReplyMarkup' && c.data.message_id === up?.result?.message_id && c.data.reply_markup.inline_keyboard.length >= 1));
const panel = viaAdmin(l).find((c) => /Yangi e'lon loyihasi/.test(c.data.text || ''));
const did = /^bc:(\w+):/.exec(panel?.data.reply_markup?.inline_keyboard?.flat()[0]?.callback_data || '')?.[1];
check('the owner gets a draft panel: audience buttons, continue / cancel', panel && did && /video/.test(panel.data.text) && /\d+<\/b> ta shaxsiy chat/.test(panel.data.text), panel);
check('nothing is sent to students yet', !l.some((c) => c.method === 'copyMessage'));
await reset(); await cbq(`bc:${did}:l:ru`, 900);
l = await log();
check('picking a language updates the panel with the new count', viaAdmin(l).some((c) => c.method === 'editMessageText' && /✓ RU/.test(JSON.stringify(c.data.reply_markup))));
await cbq(`bc:${did}:l:all`, 900);
await reset(); await cbq(`bc:${did}:t:3`, 900);
l = await log();
check('⏳ auto-delete: picking "3 soat" marks it and says so', viaAdmin(l).some((c) => c.method === 'editMessageText' && /✓ 3 soat/.test(JSON.stringify(c.data.reply_markup)) && /3 soatdan keyin o'chiriladi/.test(c.data.text)));
check('…the choices: forever, 1, 3, 6, 12, 24 hours', ['♾ Doim', '1 soat', '6 soat', '12 soat', '24 soat'].every((t) => JSON.stringify(viaAdmin(l).find((c) => c.method === 'editMessageText')?.data.reply_markup || {}).includes(t)));
await reset(); await cbq(`bc:${did}:ok`, 900);
l = await log();
const conf = viaAdmin(l).find((c) => /Tasdiqlang/.test(c.data.text || ''));
const go = conf?.data.reply_markup.inline_keyboard.flat().find((b) => /:go:/.test(b.callback_data));
check('“continue” asks for confirmation with the number of recipients (never groups), and when it is deleted', conf && go && /Guruhlarga yuborilmaydi/.test(conf.data.text) && /3 soatdan keyin/.test(conf.data.text), conf);
const n = Number(go?.callback_data.split(':').pop());
await reset(); await cbq(`bc:${did}:go:${n + 5}`, 900);
check('a stale count is refused — confirm again', viaAdmin(await log()).some((c) => /soni o'zgardi/.test(c.data.text || '')));
await reset(); await cbq(`bc:${did}:go:${n}`, 900);
l = await log();
check('confirmed → queued, with the queue number', viaAdmin(l).some((c) => /Navbatga qo'yildi/.test(c.data.text || '')), viaAdmin(l));
await reset(); await cbq(`bc:${did}:go:${n}`, 900);
check('the same panel cannot queue it twice', viaAdmin(await log()).some((c) => /eskirgan/.test(c.data.text || '')));
{
  const { spawn } = await import('node:child_process');
  await reset();
  const out = await new Promise((resolve) => {
    const p = spawn('node', ['scripts/notify.mjs', 'broadcast'], { env: { ...process.env, BOT_TOKEN: TOKEN, ADMIN_KEY: 'secretkey', WORKER_URL: W, SITE_URL: 'http://localhost:1236', TG_API: M }, stdio: ['ignore', 'pipe', 'pipe'] });
    let o = ''; p.stdout.on('data', (d) => (o += d)); p.stderr.on('data', (d) => (o += d)); p.on('close', (code) => resolve({ code, o }));
  });
  l = await log();
  const copies = l.filter((c) => c.method === 'copyMessage');
  check('the sender delivers it as a COPY of the sample (video and all) to every private chat, by the student bot', out.code === 0 && copies.length === n && copies.every((c) => c.bot === TOKEN && c.data.from_chat_id === ADMIN && c.data.message_id === up?.result?.message_id && c.data.chat_id > 0), { out: out.o.slice(-400), copies: copies.length, n });
  check('…with the app / invite buttons', copies.every((c) => (c.data.reply_markup?.inline_keyboard || []).length >= 1));
  const due = async (ms) => (await (await fetch(`${W}/internal/eph/due?now=${ms}`, { headers: { 'X-Admin-Key': 'secretkey' } })).json()).rows.length;
  check('⏳ every delivered copy is set to be deleted after 3 hours (not before)', (await due(Date.now() + 2.9 * 3600e3)) === 0 && (await due(Date.now() + 3.1 * 3600e3)) === n, { early: await due(Date.now() + 2.9 * 3600e3), late: await due(Date.now() + 3.1 * 3600e3), n });
}
await reset(); await adminBot(msg('Ertaga soat 10 da uchrashuv bor', me, meU, { entities: [{ type: 'bold', offset: 0, length: 6 }] }));
l = await log();
check('plain text written to the admin bot → a text draft (sample keeps the formatting)', viaStudent(l).some((c) => c.method === 'sendMessage' && c.data.chat_id === ADMIN && /uchrashuv/.test(c.data.text) && c.data.entities?.[0]?.type === 'bold') && viaAdmin(l).some((c) => /loyihasi/.test(c.data.text || '')));
const p2 = viaAdmin(l).find((c) => /loyihasi/.test(c.data.text || ''));
const d2 = /^bc:(\w+):/.exec(p2?.data.reply_markup?.inline_keyboard?.flat()[0]?.callback_data || '')?.[1];
await reset(); await cbq(`bc:${d2}:x`, 901);
check('❌ cancels the draft — nothing queued', viaAdmin(await log()).some((c) => /Bekor qilindi/.test(c.data.text || '')));
await reset(); await adminBot({ message: { message_id: 60, date: 0, chat: me, from: meU, media_group_id: 'A1', photo: [{ file_id: 'P1', file_size: 10 }] } });
await adminBot({ message: { message_id: 61, date: 0, chat: me, from: meU, media_group_id: 'A1', photo: [{ file_id: 'P2', file_size: 10 }] } });
l = await log();
check('an album is explained once and not turned into drafts', viaAdmin(l).filter((c) => /Albom/.test(c.data.text || '')).length === 1 && !l.some((c) => c.method === 'getFile'));
await reset(); await adminBot({ message: { message_id: 62, date: 0, chat: me, from: meU, video: { file_id: 'BIG', file_size: 30 * 1024 * 1024 } } });
check('a video over 20 MB is refused politely', viaAdmin(await log()).some((c) => /juda katta/.test(c.data.text || '')));
await reset(); await adminBot({ message: { message_id: 63, date: 0, chat: other, from: otherU, video: { file_id: 'X', file_size: 10 } } });
l = await log();
check('a stranger\'s video is NOT a draft (they are asked to write text)', !l.some((c) => c.method === 'getFile') && viaAdmin(l).some((c) => c.data.chat_id === 515151));

console.log(fails ? `\n${fails} admin-bot check(s) failed` : '\nAll admin-bot checks passed ✅');
process.exit(fails ? 1 : 0);
