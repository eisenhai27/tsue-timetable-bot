// The admin announcement ("E'lon") feature: only the owner may use it, only private chats are reached, the test-then-confirm
// safety flow, the queue + the Action's sender (scripts/notify.mjs broadcast), cancelling and "never twice".
// Needs the local setup of tests/run-bot-flow.sh (Worker :8787, fake Telegram :8790, site :1236).
import crypto from 'node:crypto';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const W = process.env.W || 'http://localhost:8787', M = 'http://localhost:8790';
const TOKEN = fs.readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8').match(/^BOT_TOKEN=(.*)$/m)[1].trim();
const ADMIN = Number(fs.readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8').match(/^ADMIN_CHAT_ID=(.*)$/m)[1].trim());
const secret = crypto.createHash('sha256').update('tg:secretkey').digest('hex').slice(0, 48);
let uid = Math.floor(Date.now() / 1000) + 7_000_000;
const post = (update) => fetch(W + '/tg', { method: 'POST', headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': secret }, body: JSON.stringify({ update_id: uid++, ...update }) });
const log = async () => (await fetch(M + '/__log')).json();
const reset = () => fetch(M + '/__reset');
const msg = (text, chat, from) => ({ message: { message_id: 1, date: 0, chat, from, text } });
const cb = (data, chat, from, mid = 60) => ({ callback_query: { id: 'c' + uid, from, data, message: { message_id: mid, chat } } });
let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? '✅' : '❌') + ' ' + name); if (!cond) { fails++; if (extra !== undefined) console.log(JSON.stringify(extra, null, 1).slice(0, 1500)); } };

const initData = (u) => {
  const p = { auth_date: String(Math.floor(Date.now() / 1000)), query_id: 'AAH', user: JSON.stringify(u) };
  const c = Object.keys(p).sort().map((k) => `${k}=${p[k]}`).join('\n');
  const sec = crypto.createHmac('sha256', 'WebAppData').update(TOKEN).digest();
  return new URLSearchParams({ ...p, hash: crypto.createHmac('sha256', sec).update(c).digest('hex') }).toString();
};
const api = async (user, body) => { const r = await fetch(W + '/api/admin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: initData(user), ...body }) }); return { status: r.status, ...(await r.json().catch(() => ({}))) }; };
const me = { id: ADMIN, first_name: 'Owner' }, stranger = { id: 424242, first_name: 'Not owner' };
const hdr = { 'x-admin-key': 'secretkey', 'content-type': 'application/json' };
const internal = async (path, body) => (await fetch(W + path, { method: body ? 'POST' : 'GET', headers: hdr, body: body ? JSON.stringify(body) : undefined })).json();

// the audience: three private students (uz / ru / en) of ONE group, and a group chat of the same group (must never be reached)
const G2 = JSON.parse(fs.readFileSync(new URL('../docs/data/index.json', import.meta.url))).faculties[0].courses[0].groups[7][0];
const mk = (id, lang) => [{ id, type: 'private' }, { id, first_name: 'U' + id, language_code: lang }];
const [c1, u1] = mk(6001, 'uz'), [c2, u2] = mk(6002, 'ru'), [c3, u3] = mk(6003, 'en');
for (const [c, u] of [[c1, u1], [c2, u2], [c3, u3]]) {
  await post(msg('/start', c, u)); await post(cb(`g:${u.id}:${G2}`, c, u));
  if (u.language_code !== 'uz') await post(cb(`lang:${u.language_code}:pick:${u.id}`, c, u)); // the bot starts in Uzbek for everyone; the person switches
}
const grp = { id: -100555, type: 'supergroup', title: 'Some group' };
await post(msg('/setgroup', grp, { id: 111, first_name: 'Admin' })); await post(cb(`g:111:${G2}`, grp, { id: 111, first_name: 'Admin' }, 61));

const filter = { group: G2 };
const payload = { texts: { uz: 'Salom <b>do‘stlar</b>', ru: 'Привет, друзья', en: 'Hello friends' }, btn: { url: 'https://example.com/club', text: { uz: 'Batafsil', ru: 'Подробнее' } }, app: true, invite: true };

// ---- the owner opens the screen with /elon (a keyboard-launched Mini App gets no signed initData, an inline button does)
await reset();
await post(msg('/elon', { id: ADMIN, type: 'private' }, { id: ADMIN, first_name: 'Owner' }));
await post(msg('/elon', { id: 424242, type: 'private' }, { id: 424242, first_name: 'Not owner' }));
{
  const l = await log();
  const btns = (id) => l.filter((c) => c.data.chat_id === id).flatMap((c) => c.data.reply_markup?.inline_keyboard?.flat() || []);
  check('/elon gives the owner an inline button that opens the E\'lon screen', btns(ADMIN).some((b) => /#tab=admin$/.test(b.web_app?.url || '')), btns(ADMIN));
  check('/elon from anyone else opens nothing', !btns(424242).some((b) => /tab=admin/.test(b.web_app?.url || '')), btns(424242));
}

// ---- who may use it
let r = await api(me, { op: 'me' });
check('the owner is recognised', r.ok && r.admin === true, r);
r = await api(stranger, { op: 'me' });
check('anyone else is told "not admin"', r.ok && r.admin === false, r);
for (const op of ['count', 'photo', 'test', 'send', 'status', 'cancel', 'delete']) {
  r = await api(stranger, { op, payload, filter, id: 1, confirm: 1, image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==' });
  check(`stranger: op "${op}" → 403`, r.status === 403, r);
}
let raw = await fetch(W + '/api/admin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ op: 'count', initData: 'hash=bad&user={"id":' + ADMIN + '}' }) });
check('forged initData (the owner’s id, wrong signature) → 401', raw.status === 401);
raw = await fetch(W + '/api/admin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ op: 'count' }) });
check('no initData → 401', raw.status === 401);
raw = await fetch(W + '/api/admin');
check('GET → 405', raw.status === 405);
raw = await fetch(W + '/api/admin', { method: 'OPTIONS' });
check('CORS preflight allows only the Mini App origin', raw.status === 204 && raw.headers.get('access-control-allow-origin') === 'http://localhost:1236');

// ---- audience: private chats only
r = await api(me, { op: 'count', filter });
check('count: the 3 private chats of the group, NOT the group chat', r.ok && r.n === 3, r);
r = await api(me, { op: 'count', filter: { ...filter, lang: 'ru' } });
check('count: language filter works', r.ok && r.n === 1, r);
r = await api(me, { op: 'count', filter: { ...filter, role: 'teacher' } });
check('count: role filter works', r.ok && r.n === 0, r);
r = await api(me, { op: 'count', filter: { group: "x'; DROP TABLE chats;--" } });
check('count: a hostile group value is ignored, not executed', r.ok && r.n > 3, r);

// ---- safety flow
r = await api(me, { op: 'send', payload, filter, confirm: 3 });
check('send without a test first → 409', r.status === 409 && r.error === 'test first', r);
r = await api(me, { op: 'test', payload: { texts: {} }, filter });
check('empty text → 400', r.status === 400, r);
r = await api(me, { op: 'test', payload: { ...payload, btn: { url: 'http://insecure.example', text: { uz: 'x' } } }, filter });
check('button link must be https → 400', r.status === 400, r);
r = await api(me, { op: 'test', payload: { ...payload, btn: { url: 'javascript:alert(1)', text: { uz: 'x' } } }, filter });
check('javascript: link → 400', r.status === 400, r);
r = await api(me, { op: 'test', payload: { ...payload, btn: { url: 'https://example.com', text: {} } }, filter });
check('button without text → 400', r.status === 400, r);

// photo
r = await api(me, { op: 'photo', image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==' });
check('photo upload → a file id', r.ok && r.photo === 'UPLOADED_FILE_ID_0001', r);
r = await api(me, { op: 'photo', image: 'data:image/jpeg;base64,AAAAAAAA' });
check('photo that is not an image (bad magic bytes) → 400', r.status === 400, r);
r = await api(me, { op: 'photo', image: 'data:text/html;base64,PGI+' });
check('photo with another mime type → 400', r.status === 400, r);
const withPhoto = { ...payload, photo: 'UPLOADED_FILE_ID_0001' };
r = await api(me, { op: 'test', payload: { ...withPhoto, texts: { uz: 'x'.repeat(1100) } }, filter });
check('photo + caption over 1000 characters → 400', r.status === 400 && r.error === 'caption too long', r);

await reset();
r = await api(me, { op: 'test', payload: withPhoto, filter });
let l = await log();
const prev = l.filter((c) => c.method === 'sendPhoto' && c.data.chat_id === ADMIN);
check('test: one preview per language, to the OWNER only', r.ok && prev.length === 3 && l.every((c) => c.data.chat_id === ADMIN || c.method === 'getMe'), l.map((c) => [c.method, c.data.chat_id]));
check('test: the text is shown as plain text (no HTML injection)', prev[0]?.data.caption.includes('&lt;b&gt;do‘stlar&lt;/b&gt;') && !prev[0].data.caption.includes('<b>'), prev[0]?.data);
const kb = (prev[1]?.data.reply_markup?.inline_keyboard || []).flat();
check('test: Russian preview has the custom button (RU text), the app button and the invite button', kb[0]?.url === 'https://example.com/club' && kb[0].text === 'Подробнее' && kb.some((b) => b.web_app) && kb.some((b) => /share\/url/.test(b.url || '')), kb);
check('test: English preview falls back to the Uzbek button text', (prev[2]?.data.reply_markup.inline_keyboard.flat()[0] || {}).text === 'Batafsil', prev[2]?.data.reply_markup);

r = await api(me, { op: 'send', payload: { ...withPhoto, texts: { ...withPhoto.texts, uz: 'Changed after the test' } }, filter, confirm: 3 });
check('changing the text after the test → must test again (409)', r.status === 409 && r.error === 'test first', r);
r = await api(me, { op: 'send', payload: withPhoto, filter, confirm: 2 });
check('wrong recipient count typed → 409, nothing queued', r.status === 409 && r.error === 'count changed' && r.n === 3, r);
check('nothing queued so far', (await api(me, { op: 'status' })).list.length === 0);

await reset();
r = await api(me, { op: 'send', payload: withPhoto, filter, confirm: 3 });
check('send with the tested content and the right count → queued', r.ok && r.total === 3 && r.id > 0, r);
const job1 = r.id;
l = await log();
check('queuing sends no message by itself', !l.some((c) => c.method === 'sendPhoto' || c.method === 'sendMessage'), l.length);
r = await api(me, { op: 'send', payload: withPhoto, filter, confirm: 3 });
check('a second send reuses nothing: needs a new test (409)', r.status === 409, r);
await api(me, { op: 'test', payload: withPhoto, filter });
r = await api(me, { op: 'send', payload: withPhoto, filter, confirm: 3 });
check('another send while one is waiting → 409 busy', r.status === 409 && r.error === 'busy', r);

// ---- the Action's endpoints are closed to everyone without the key
for (const p of ['/internal/broadcast/next', '/internal/broadcast/chats?id=1', '/internal/broadcast/progress', '/internal/broadcast/finish']) {
  const x = await fetch(W + p, { method: p.endsWith('progress') || p.endsWith('finish') ? 'POST' : 'GET', body: p.endsWith('progress') || p.endsWith('finish') ? '{}' : undefined });
  check(`${p.split('?')[0]} without the key → 403`, x.status === 403);
}

// ---- the sender
const send = () => new Promise((resolve) => {
  const p = spawn('node', ['scripts/notify.mjs', 'broadcast'], { env: { ...process.env, BOT_TOKEN: 'x', ADMIN_KEY: 'secretkey', WORKER_URL: W, SITE_URL: 'http://localhost:1236', TG_API: M }, stdio: ['ignore', 'pipe', 'pipe'] });
  let out = ''; p.stdout.on('data', (d) => (out += d)); p.stderr.on('data', (d) => (out += d));
  p.on('close', (code) => resolve({ code, out }));
});
await reset();
let s = await send();
l = await log();
const got = (id) => l.filter((c) => (c.method === 'sendPhoto' || c.method === 'sendMessage') && c.data.chat_id === id);
check('sender exits cleanly', s.code === 0, s.out);
check('each of the 3 private chats got exactly one photo announcement', [6001, 6002, 6003].every((id) => got(id).length === 1 && got(id)[0].method === 'sendPhoto' && got(id)[0].data.photo === 'UPLOADED_FILE_ID_0001'), l.map((c) => [c.method, c.data.chat_id]));
check('everyone got their own language', /Salom/.test(got(6001)[0].data.caption) && /Привет/.test(got(6002)[0].data.caption) && /Hello/.test(got(6003)[0].data.caption));
check('the app button opens the student’s own group', JSON.stringify(got(6002)[0].data.reply_markup).includes(`g=${G2}&l=ru`), got(6002)[0].data.reply_markup);
check('the GROUP chat got nothing', got(-100555).length === 0);
let st = (await api(me, { op: 'status' })).list[0];
check('status: done, 3 sent, 0 failed', st.id === job1 && st.status === 'done' && st.sent === 3 && st.failed === 0, st);
await reset();
s = await send();
l = await log();
check('running the sender again sends nothing (no repeats)', !l.some((c) => c.method === 'sendPhoto' || c.method === 'sendMessage'), l.length);

// ---- cancel before it is sent
await api(me, { op: 'test', payload: { texts: { uz: 'Second' } }, filter });
r = await api(me, { op: 'send', payload: { texts: { uz: 'Second' } }, filter, confirm: 3 });
const job2 = r.id;
r = await api(me, { op: 'cancel', id: job2 });
check('cancel a queued announcement', r.ok && r.cancelled, r);
await reset();
await send();
l = await log();
check('a cancelled announcement is never sent', !l.some((c) => c.method === 'sendMessage' && c.data.chat_id >= 6001 && c.data.chat_id <= 6003), l.length);

// ---- a re-run continues where it stopped (chat 6001 was already served by an earlier, interrupted run)
await api(me, { op: 'test', payload: { texts: { uz: 'Third', ru: 'Третье' } }, filter });
r = await api(me, { op: 'send', payload: { texts: { uz: 'Third', ru: 'Третье' } }, filter, confirm: 3 });
const job3 = r.id;
await internal('/internal/broadcast/progress', { id: job3, done: [6001], failed: [] });
await reset();
await send();
l = await log();
check('already-served chats are skipped on a re-run', got(6001).length === 0 && got(6002).length === 1 && got(6003).length === 1, l.map((c) => [c.method, c.data.chat_id]));
check('plain-text announcement without a photo goes as a message with the open-app/invite buttons', got(6002)[0].method === 'sendMessage' && /Третье/.test(got(6002)[0].data.text) && got(6002)[0].data.reply_markup.inline_keyboard.flat().length === 2, got(6002)[0]);
st = (await api(me, { op: 'status' })).list[0];
check('status after the resumed run: done, 3 in total', st.id === job3 && st.status === 'done' && st.sent === 3, st);

// ---- 🗑 deleting a sent announcement: every copy that was noted goes to the deleter now; the one sent before (no id) is skipped
const dueNow = async () => (await internal(`/internal/eph/due?now=${Date.now() + 60e3}`)).rows;
check('the sender noted the copies it delivered (status: deletable, 2 known copies)', st.deletable === true && st.ids === 2, st);
r = await api(me, { op: 'delete', id: job3 });
let rows = await dueNow();
check('🗑 delete → both known copies are due for deletion right away', r.ok && r.n === 2 && rows.filter((x) => [6002, 6003].includes(x.chat_id)).length === 2, { r, rows });
st = (await api(me, { op: 'status' })).list[0];
check('…the list shows it as deleted, no 🗑 any more', st.deleted_at && !st.deletable, st);
r = await api(me, { op: 'delete', id: job3 });
check('…deleting twice is refused', !r.ok && r.error === 'already', r);
await internal('/internal/eph/done', { items: rows.map((x) => [x.chat_id, x.msg_id]) });
// ⏳ chosen in the Mini App: each copy is set to go after that many hours
await api(me, { op: 'test', payload: { texts: { uz: 'Vaqtinchalik' }, ttl: 6 }, filter });
r = await api(me, { op: 'send', payload: { texts: { uz: 'Vaqtinchalik' }, ttl: 6 }, filter, confirm: 3 });
await send();
const at = async (h) => (await internal(`/internal/eph/due?now=${Date.now() + h * 3600e3}`)).rows.length;
check('⏳ 6 hours (Mini App): the copies go after 6 hours, not before', (await at(5.9)) === 0 && (await at(6.1)) === 3, { early: await at(5.9), late: await at(6.1) });
st = (await api(me, { op: 'status' })).list[0];
check('…and the list says so', st.ttl === 6, st);

console.log(fails ? `\n${fails} broadcast check(s) failed` : '\nAll broadcast checks passed ✅');
process.exit(fails ? 1 : 0);
