// Security checks. Two parts:
//   1) the Worker module run IN-PROCESS with stubbed bindings (fail-closed keys, brute-force brake, response headers) — needs no server;
//   2) the live local Worker + fake Telegram started by tests/run-bot-flow.sh (forged Mini App signatures, CORS, junk input, spam limits).
//   node tests/security.mjs        (part 2 is skipped when the local Worker is not running)
import crypto from 'node:crypto';
import fs from 'node:fs';
import worker from '../worker/worker.mjs';

let fails = 0;
const check = (name, cond, extra) => {
  console.log((cond ? '✅' : '❌') + ' ' + name);
  if (!cond) { fails++; if (extra !== undefined) console.log('   ', typeof extra === 'string' ? extra : JSON.stringify(extra).slice(0, 600)); }
};

// ====================================================================== 1) in-process
const call = (path, { method = 'GET', headers = {}, body, env = {} } = {}) =>
  worker.fetch(new Request('https://bot.example' + path, { method, headers, body }), env, {});

{
  const r = await call('/', { env: { ADMIN_KEY: 'k' } });
  const h = (n) => r.headers.get(n);
  check('every response carries nosniff / no-frame / no-referrer / no-store headers',
    h('x-content-type-options') === 'nosniff' && h('x-frame-options') === 'DENY' && h('referrer-policy') === 'no-referrer' && h('cache-control') === 'no-store' && /frame-ancestors 'none'/.test(h('content-security-policy') || ''),
    [...r.headers]);
  const bad = await call('/internal/stats', { env: { ADMIN_KEY: 'k' } });
  check('error responses carry them too', bad.status === 403 && bad.headers.get('x-content-type-options') === 'nosniff', bad.status);
}

// a key that was never configured must NOT be matched by "no key sent" (that used to compare '' with '')
for (const [name, path, opts] of [
  ['/internal/stats', '/internal/stats', {}],
  ['/internal/subs', '/internal/subs?mode=all', {}],
  ['/internal/cleanup', '/internal/cleanup', { method: 'POST', body: '{}' }],
  ['/setup', '/setup', {}],
  ['/setup?key=', '/setup?key=', {}],
]) {
  const r = await call(path, { ...opts, env: { ADMIN_KEY: undefined, BOT_TOKEN: 't' } });
  check(`ADMIN_KEY not configured + no key sent → ${name} stays closed (403)`, r.status === 403, r.status);
}
{
  const r = await call('/internal/stats', { headers: { 'x-admin-key': '' }, env: { ADMIN_KEY: '' } });
  check('empty ADMIN_KEY + empty header → closed', r.status === 403, r.status);
  const w = await call('/tg', { method: 'POST', body: '{}', env: { ADMIN_KEY: undefined } });
  check('webhook without the secret header is refused even when ADMIN_KEY is missing', w.status === 403, w.status);
}

// brute-force brake: a run of wrong keys from one address gets 429, other addresses are untouched
{
  const env = { ADMIN_KEY: 'a-long-random-key-for-the-test' };
  const hit = (ip, key) => call('/internal/stats', { headers: { 'cf-connecting-ip': ip, 'x-admin-key': key }, env }).then((r) => r.status);
  const codes = [];
  for (let i = 0; i < 20; i++) codes.push(await hit('203.0.113.7', 'guess' + i));
  check('wrong keys → 403 first, then 429 once the limit is reached', codes[0] === 403 && codes.slice(-1)[0] === 429 && codes.filter((c) => c === 403).length === 15, codes);
  check('while blocked even the CORRECT key from that address gets 429', (await hit('203.0.113.7', env.ADMIN_KEY)) === 429);
  check('a different address is not affected', (await hit('203.0.113.8', 'guess')) === 403);
  const s = await call('/setup?key=nope', { headers: { 'cf-connecting-ip': '203.0.113.7' }, env });
  check('the same brake covers /setup', s.status === 429, s.status);
}

// flooding: one person sending far more than a human can is ignored — checked with stubbed bindings, so it does not depend on the
// local test Worker (which runs with the limit raised, because the scripted tests are much faster than any person)
{
  const calls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url) => { calls.push(String(url)); return new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), { headers: { 'content-type': 'application/json' } }); };
  const stmt = { bind() { return this; }, all: async () => ({ results: [] }), first: async () => null, run: async () => ({ meta: { changes: 1 } }) };
  const env = { ADMIN_KEY: 'flood-test-key', BOT_TOKEN: '1:test', SITE_URL: 'https://site.example', TG_API: 'http://localhost:1', DB: { prepare: () => stmt, batch: async () => [] } };
  const secret = crypto.createHash('sha256').update('tg:' + env.ADMIN_KEY).digest('hex').slice(0, 48);
  const send = (id, from, text) => worker.fetch(new Request('https://bot.example/tg', { method: 'POST', headers: { 'x-telegram-bot-api-secret-token': secret, 'content-type': 'application/json' },
    body: JSON.stringify({ update_id: id, message: { message_id: 1, date: 0, chat: { id: from, type: 'private' }, from: { id: from, first_name: 'F' }, text } }) }), env, {});
  for (let i = 0; i < 60; i++) await send(1000 + i, 8888, '/help');
  const answered = calls.filter((u) => u.endsWith('/sendMessage')).length;
  check('flooding: 60 messages in a burst from one person → at most 30 handled, the rest ignored', answered > 0 && answered <= 30, answered);
  calls.length = 0;
  await send(2000, 8889, '/help');
  check('…while another person is answered normally', calls.some((u) => u.endsWith('/sendMessage')), calls);
  globalThis.fetch = realFetch;
}

// ====================================================================== 2) live local Worker
const W = process.env.W || 'http://localhost:8787', M = 'http://localhost:8790', SITE = 'http://localhost:1236';
let live = false;
try { live = (await fetch(W + '/', { signal: AbortSignal.timeout(3000) })).ok; } catch {}
if (!live) {
  console.log('(local Worker not running — live checks skipped; run tests/run-bot-flow.sh)');
} else {
  const vars = Object.fromEntries(fs.readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8').split('\n').filter(Boolean).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
  const secret = crypto.createHash('sha256').update('tg:' + vars.ADMIN_KEY).digest('hex').slice(0, 48);
  let uid = Math.floor(Date.now() / 1000) * 10;
  const post = (update) => fetch(W + '/tg', { method: 'POST', headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': secret }, body: JSON.stringify({ update_id: uid++, ...update }) }).then((r) => r.status);
  const log = async () => (await fetch(M + '/__log')).json();
  const reset = () => fetch(M + '/__reset');
  const msg = (text, from, chat) => ({ message: { message_id: 1, date: 0, chat: chat || { id: from.id, type: 'private' }, from, text } });
  const cb = (data, from, mid = 50) => ({ callback_query: { id: 'c' + uid, from, data, message: { message_id: mid, chat: { id: from.id, type: 'private' } } } });
  const texts = (l) => l.map((c) => `${c.method}: ${(c.data.text || '').slice(0, 80).replace(/\n/g, ' ⏎ ')}`);
  const admin = { id: 999999, first_name: 'Admin', language_code: 'uz' };

  // ---------- Mini App signature (initData)
  const sign = (fields, token = vars.BOT_TOKEN) => {
    const p = new URLSearchParams(fields);
    const check = [...p.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join('\n');
    const key = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
    p.set('hash', crypto.createHmac('sha256', key).update(check).digest('hex'));
    return p.toString();
  };
  const idx = JSON.parse(fs.readFileSync(new URL('../docs/data/index.json', import.meta.url), 'utf8'));
  const gid = idx.faculties[0].courses[0].groups[0][0];
  const weekPic = (initData, extra = {}) => fetch(W + '/api/week-pic', { method: 'POST', headers: { 'content-type': 'application/json', origin: SITE }, body: JSON.stringify({ initData, type: 'g', id: gid, lang: 'uz', ...extra }) });
  const now = () => Math.floor(Date.now() / 1000);
  const user = (id) => JSON.stringify({ id, first_name: 'T' });

  check('week-pic: no initData → 401', (await weekPic(undefined)).status === 401);
  check('week-pic: forged hash → 401', (await weekPic(`user=${encodeURIComponent(user(4101))}&auth_date=${now()}&hash=${'0'.repeat(64)}`)).status === 401);
  check('week-pic: signed with another bot\'s token → 401', (await weekPic(sign({ user: user(4102), auth_date: String(now()) }, '1:other-token'))).status === 401);
  check('week-pic: genuine signature but older than a day → 401', (await weekPic(sign({ user: user(4103), auth_date: String(now() - 90000) }))).status === 401);
  check('week-pic: signature with a changed field → 401', (await weekPic(sign({ user: user(4104), auth_date: String(now()) }).replace('4104', '1'))).status === 401);
  check('week-pic: bad id (path traversal) → 400', (await weekPic(sign({ user: user(4105), auth_date: String(now()) }), { id: '../../etc/passwd' })).status === 400);
  await reset();
  const okRes = await weekPic(sign({ user: user(4106), auth_date: String(now()) }));
  const sent = await log();
  check('week-pic: a genuine signature works, and the picture goes to THAT user\'s own chat', okRes.status === 200 && sent.some((c) => /^send(Photo|Message)$/.test(c.method) && c.data.chat_id === 4106), [okRes.status, texts(sent)]);
  check('week-pic: a second request within seconds is slowed down (429)', (await weekPic(sign({ user: user(4106), auth_date: String(now()) }))).status === 429);
  {
    const pre = await fetch(W + '/api/week-pic', { method: 'OPTIONS', headers: { origin: 'https://evil.example', 'access-control-request-method': 'POST' } });
    const allow = pre.headers.get('access-control-allow-origin');
    check('CORS: only the Mini App\'s own address is allowed — never "*" or the asking site', allow === SITE && allow !== 'https://evil.example', allow);
  }

  // ---------- admin endpoints
  const admin_ = (path, init = {}) => fetch(W + path, { ...init, headers: { 'x-admin-key': vars.ADMIN_KEY, 'content-type': 'application/json', ...(init.headers || {}) } });
  check('/internal/stats without the key → 403', (await fetch(W + '/internal/stats')).status === 403);
  check('/internal/stats with the key → 200', (await admin_('/internal/stats')).status === 200);
  check('/internal/cleanup: a body that is not JSON → 400, not a crash', (await admin_('/internal/cleanup', { method: 'POST', body: 'not json' })).status === 400);
  {
    const r = await admin_('/internal/cleanup', { method: 'POST', body: JSON.stringify({ remove: ['x', 1e30, null, { a: 1 }], migrate: [['a', 'b'], [1], 'zz'] }) });
    const j = await r.json();
    check('/internal/cleanup: only whole numbers are acted on', r.status === 200 && j.removed === 0 && j.migrated === 0, j);
  }
  check('/setup via the X-Admin-Key header works (key stays out of the URL)', (await fetch(W + '/setup', { headers: { 'x-admin-key': vars.ADMIN_KEY } })).status === 200);
  check('/setup with a wrong key → 403', (await fetch(W + '/setup?key=wrong')).status === 403);

  // ---------- junk input from Telegram users
  const u1 = { id: 5001, first_name: 'Junk', language_code: 'uz' };
  await post(msg('/start', u1));
  for (const t of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
    await reset();
    const s = await post(msg(t, u1));
    const l = await log();
    check(`text "${t}" is just a search, not a hidden command (no crash, answered)`, s === 200 && l.length > 0 && l.every((c) => c.method !== 'setMyCommands'), texts(l));
  }
  await reset();
  await post(cb('wh:../../../../etc/passwd', u1));
  let l = await log();
  check('callback with a path-traversal teacher id is ignored (nothing sent)', l.filter((c) => c.method === 'sendMessage' || c.method === 'editMessageText').length === 0, texts(l));
  await reset();
  await post(cb('lang:ru:pick:not-a-number', u1));
  l = await log();
  const kb = l.find((c) => c.method === 'editMessageText')?.data.reply_markup?.inline_keyboard?.flat() || [];
  check('a garbage user id in callback data never ends up in the next buttons', kb.length > 0 && kb.every((b) => !/not-a-number/.test(b.callback_data)), kb.slice(0, 3));

  // ---------- usage table: unknown commands are all "other"
  for (const c of ['/' + 'z'.repeat(300), '/qwertyuiop', '/' + 'a'.repeat(50) + 'b']) await post(msg(c, u1));
  await post(cb('x'.repeat(40) + ':1', u1));
  await reset();
  await post(msg('/stats', admin));
  l = await log();
  const st = l.find((c) => c.method === 'sendMessage' && /statistika/.test(c.data.text || ''));
  check('/stats does not list raw junk command names (no "zzzz", no "qwerty")', !!st && !/zzzz|qwerty|aaaa/.test(st.data.text), st?.data.text?.slice(0, 400));
  check('/stats stays under Telegram\'s size limit', !!st && st.data.text.length < 3500, st?.data.text.length);

  // ---------- feedback: 5 per hour per chat
  const u2 = { id: 5002, first_name: 'Spammer', language_code: 'uz' };
  await post(msg('/start', u2));
  await reset();
  for (let i = 0; i < 8; i++) await post(msg('/feedback test feedback ' + i, u2));
  l = await log();
  const toAdmin = l.filter((c) => c.method === 'sendMessage' && String(c.data.chat_id) === '999999').length;
  const thanks = l.filter((c) => c.method === 'sendMessage' && c.data.chat_id === 5002 && /Rahmat! Xabaringiz/.test(c.data.text)).length;
  const limited = l.filter((c) => c.method === 'sendMessage' && c.data.chat_id === 5002 && /juda ko'p xabar/.test(c.data.text)).length;
  check('feedback: 5 accepted, the rest answered with a "too many" notice', thanks === 5 && limited === 3, { thanks, limited });
  check('feedback: the admin gets 5 DMs, not 8', toAdmin === 5, toAdmin);

  // ---------- group chatter must not reach the database; commands still work
  const g = { id: -100777, type: 'supergroup', title: 'Test group' };
  const gu = { id: 5003, first_name: 'Member', language_code: 'uz' };
  await reset();
  const codes = [];
  for (const t of ['salom', 'qalaysizlar', 'kim bor?', '😀']) codes.push(await post(msg(t, gu, g)));
  l = await log();
  check('ordinary group messages: answered 200 with no reply and no Telegram call', codes.every((c) => c === 200) && l.length === 0, texts(l));
  await post(msg('/help', gu, g));
  l = await log();
  check('…but a command in the same group is still answered', l.some((c) => c.method === 'sendMessage' && c.data.chat_id === g.id), texts(l));
}

console.log(fails ? `\n${fails} security check(s) FAILED ❌` : '\nAll security checks passed ✅');
process.exit(fails ? 1 : 0);
