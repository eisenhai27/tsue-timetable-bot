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
check('✍️ Fikrlar → recent feedback, each answerable', viaAdmin(l).some((c) => /Xona 305/.test(c.data.text || '') && /Reply/.test(c.data.text)));
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

console.log(fails ? `\n${fails} admin-bot check(s) failed` : '\nAll admin-bot checks passed ✅');
process.exit(fails ? 1 : 0);
