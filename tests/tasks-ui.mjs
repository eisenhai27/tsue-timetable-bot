// Mini App «Vazifalar» tab: phone-sized Chromium + a stubbed Telegram WebApp + a stubbed /api/tasks (the server rules are tested in tasks.mjs).
//   node tests/tasks-ui.mjs        (SHOTS=/dir saves screenshots)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.log('tasks-ui: playwright not installed — skipped'); process.exit(0); }

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const MIME = { '.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/index.html`;
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/index.json'), 'utf8'));
let gid = null, gname = null, gdata = null;
for (const f of idx.faculties) for (const c of f.courses) for (const g of c.groups) {
  if (gid) break;
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, `data/g/${g[0]}.json`), 'utf8'));
  if ((d.lessons || []).length > 8) { gid = g[0]; gname = g[1]; gdata = d; }
}
const subjName = (s) => s.replace(/\s*\([^()]+\)\s*$/, '').trim();
const subjects = [...new Set(gdata.lessons.map((l) => subjName(l.s)))].sort();
const S1 = subjects[0], S2 = subjects[1];
const today = new Date(Date.now() + 5 * 3600e3).toISOString().slice(0, 10);
const plus = (n) => new Date(Date.parse(today + 'T00:00:00Z') + n * 864e5).toISOString().slice(0, 10);

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  FAIL:', m); } };
const SHOTS = process.env.SHOTS;

// a tiny stand-in for the server
const makeApi = () => {
  const st = { calls: [], banned: false, left: 5, tasks: [
    { id: 1, subj: S1, body: "5-mashq, 12-betdan.\nhttps://example.com/x?a=1&b=2 ham qarang", due: plus(1), by: 'Aziza K.', mine: false, st: 1, up: 3, down: 0, my: 0, sub: false, at: 1 },
    { id: 2, subj: S2, body: '<b>Referat</b> yozish', due: plus(5), by: 'Bobur', mine: false, st: 0, up: 1, down: 0, my: 0, sub: false, at: 2 },
    { id: 3, subj: S1, body: 'Mening vazifam', due: plus(0), by: 'Men', mine: true, st: 0, up: 0, down: 0, my: 0, sub: true, at: 3 },
    { id: 4, subj: S2, body: "Kutubxonadan kitob olish", due: plus(20), by: 'Sardor', mine: false, st: 0, up: 0, down: 1, my: -1, sub: false, at: 4 },
  ] };
  const handler = async (route) => {
    const b = JSON.parse(route.request().postData() || '{}');
    st.calls.push(b);
    const json = (o) => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(o) });
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST' } });
    if (b.op === 'list') return json({ ok: true, gid, gname, members: 24, banned: st.banned, left: st.left, admin: false, today, need: { up: 3, down: 3 }, subjects: subjects.map((n, i) => ({ n, next: i % 4 === 3 ? null : plus(2 + i) })), tasks: st.tasks });
    if (b.op === 'add') { st.left--; st.tasks.push({ id: 9, subj: b.subj, body: b.text, due: b.due === 'next' ? plus(2) : b.due, by: 'Men', mine: true, st: 0, up: 0, down: 0, my: 0, sub: true, at: 9 }); return json({ ok: true, id: 9 }); }
    if (b.op === 'vote') { const t = st.tasks.find((x) => x.id === b.id); t.my = b.v; t.up = (t.up || 0) + (b.v === 1 ? 1 : 0); return json({ ok: true, up: t.up, down: t.down, st: t.st, my: b.v }); }
    if (b.op === 'sub') return json({ ok: true, sub: !!b.on });
    if (b.op === 'del') { st.tasks = st.tasks.filter((x) => x.id !== b.id); return json({ ok: true }); }
    return json({ ok: false });
  };
  return { st, handler };
};

const stub = (withData) => `(() => {
  window.__tg = { calls: [], store: {} };
  const rec = (n) => (...a) => window.__tg.calls.push([n, ...a.map(x => typeof x === 'function' ? 'fn' : x)]);
  window.Telegram = { WebApp: { initData: ${withData ? "'query_id=AAA&user=%7B%22id%22%3A1%7D&hash=abc'" : "''"}, initDataUnsafe: { user: { id: 1, language_code: 'uz' } },
    platform: 'android', version: '8.0', colorScheme: window.__dark ? 'dark' : 'light', themeParams: {}, isVersionAtLeast: () => true,
    ready: rec('ready'), expand: rec('expand'), setHeaderColor: rec('h'), setBackgroundColor: rec('b'), disableVerticalSwipes: rec('s'), onEvent: rec('on'), offEvent: rec('off'),
    openTelegramLink: rec('openTelegramLink'), openLink: rec('openLink'),
    HapticFeedback: { impactOccurred: rec('haptic'), selectionChanged: rec('haptic'), notificationOccurred: rec('haptic') },
    BackButton: { show: rec('bs'), hide: rec('bh'), onClick: rec('bc'), offClick: rec('bo') },
    CloudStorage: { getItems: (k, cb) => cb(null, {}), setItem: (k, v, cb) => cb && cb(null, true) } } };
})();`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined) });
async function open({ lang = 'uz', dark = false, data = true, hash = '', api } = {}) {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'en-US' });
  await c.route(/telegram\.org|fonts\.g(oogleapis|static)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  if (api) await c.route(/\/api\/tasks$/, api.handler);
  const page = await c.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  await page.addInitScript(`window.__dark=${dark}; try{localStorage.setItem('tt_lang', JSON.stringify('${lang}')); localStorage.setItem('tt_mine', JSON.stringify({type:'g',id:'${gid}',name:'${gname}'}));}catch(e){}`);
  await page.addInitScript(stub(data));
  await page.goto(BASE + `#g=${gid}&l=${lang}` + hash);
  await page.waitForSelector('.hero', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);
  return { c, page, errs };
}
const shot = async (page, name) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, name + '.png') }); } };
const txt = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].map((e) => e.innerText).join(' | '), sel);

try {
  // 1) not inside Telegram's signed launch → an explanation, no request
  let api = makeApi();
  let s = await open({ data: false, api, hash: '&tab=tasks' });
  ok((await s.page.locator('.nav [data-tab="tasks"]').count()) === 1, 'the Vazifalar tab is in the bottom bar');
  ok(/Telegram/.test(await txt(s.page, '.bccard')) && api.st.calls.length === 0, 'without initData: an explanation and no API call: ' + await txt(s.page, '.bccard'));
  await shot(s.page, 'tk-1-needtg');
  ok(s.errs.length === 0, 'no errors: ' + s.errs.join(';'));
  await s.c.close();

  // 2) the list
  api = makeApi();
  s = await open({ api, hash: '&tab=tasks' });
  await s.page.waitForSelector('.tkcard');
  ok((await s.page.locator('.tkcard').count()) === 4, '4 task cards');
  ok(/bugun/i.test(await txt(s.page, '.tksec')) && /ertaga/i.test(await txt(s.page, '.tksec')) && /shu hafta/i.test(await txt(s.page, '.tksec')) && /keyinroq/i.test(await txt(s.page, '.tksec')), 'sections: ' + await txt(s.page, '.tksec'));
  const order = await s.page.evaluate(() => [...document.querySelectorAll('.tkcard')].map((e) => e.dataset.id).join());
  ok(order === '3,1,2,4', 'sorted by due date: ' + order);
  ok((await s.page.locator('.tkbody a').count()) === 1 && (await s.page.locator('.tkbody b').count()) === 0, 'a link becomes a link, HTML in a task stays text');
  ok(/✅/.test(await txt(s.page, '.tkcard[data-id="1"] .tkmeta')) && /1\/3/.test(await txt(s.page, '.tkcard[data-id="2"] .tkmeta')), 'confirmed / counting badges: ' + await txt(s.page, '.tkmeta'));
  ok((await s.page.locator('.tkcard[data-id="3"] [data-v]').count()) === 0 && (await s.page.locator('.tkcard[data-id="3"] [data-del]').count()) === 1, 'own task: no 👍/🚩, but delete');
  ok((await s.page.locator('.tkcard[data-id="1"] [data-del]').count()) === 0, "someone else's task: no delete");
  ok(/Aziza/.test(await txt(s.page, '.tkcard[data-id="1"] .tkmeta')), 'author shown');
  await shot(s.page, 'tk-2-list');

  // 3) vote, remind, delete (two steps)
  await s.page.click('.tkcard[data-id="2"] [data-v="1"]');
  await s.page.waitForTimeout(300);
  ok(api.st.calls.some((c) => c.op === 'vote' && c.id === 2 && c.v === 1), 'vote sent');
  ok(/2/.test(await txt(s.page, '.tkcard[data-id="2"] [data-v="1"]')) && (await s.page.locator('.tkcard[data-id="2"] [data-v="1"].on').count()) === 1, '👍 counted and highlighted');
  await s.page.click('.tkcard[data-id="2"] [data-v="1"]');
  await s.page.waitForTimeout(300);
  ok(api.st.calls.some((c) => c.op === 'vote' && c.id === 2 && c.v === 0), 'pressing it again takes the vote back');
  await s.page.click('.tkcard[data-id="1"] [data-sub]');
  await s.page.waitForTimeout(250);
  ok(api.st.calls.some((c) => c.op === 'sub' && c.id === 1 && c.on === true), '🔔 on');
  await s.page.click('.tkcard[data-id="3"] [data-del]');
  await s.page.waitForTimeout(200);
  ok((await s.page.locator('.tkcard').count()) === 4 && /O'chirasizmi/.test(await txt(s.page, '.tkcard[data-id="3"] .tkdel')), 'first tap on 🗑 only asks');
  await s.page.click('.tkcard[data-id="3"] [data-del]');
  await s.page.waitForTimeout(300);
  ok((await s.page.locator('.tkcard').count()) === 3 && api.st.calls.some((c) => c.op === 'del' && c.id === 3), 'second tap deletes');

  // 4) write a task
  await s.page.click('#tkNew');
  await s.page.waitForSelector('#tkText');
  ok(/Keyingi dars/.test(await txt(s.page, '[data-due="next"]')), 'the form offers "next lesson" with its date: ' + await txt(s.page, '.bcpills'));
  await shot(s.page, 'tk-3-form');
  await s.page.click('#tkPost');
  ok(/qisqa/i.test(await txt(s.page, '#tkMsg')) && !api.st.calls.some((c) => c.op === 'add'), 'empty text → message, nothing sent');
  await s.page.selectOption('#tkSubj', S2);
  await s.page.fill('#tkText', 'Yangi vazifa matni');
  await s.page.click('#tkPost');
  await s.page.waitForTimeout(500);
  const add = api.st.calls.find((c) => c.op === 'add');
  ok(add && add.subj === S2 && add.text === 'Yangi vazifa matni' && add.due === 'next', 'add sent: ' + JSON.stringify(add));
  ok((await s.page.locator('.tkcard').count()) === 4 && (await s.page.locator('#tkText').count()) === 0, 'form closed, list refreshed');
  // a date instead of "next lesson"
  await s.page.click('#tkNew');
  await s.page.click('[data-due="date"]');
  await s.page.fill('#tkDate', plus(10));
  await s.page.fill('#tkText', 'Sana bilan');
  await s.page.click('#tkPost');
  await s.page.waitForTimeout(400);
  ok(api.st.calls.filter((c) => c.op === 'add').pop().due === plus(10), 'a chosen date is sent');
  ok(s.errs.length === 0, 'no errors: ' + s.errs.join(';'));
  await s.c.close();

  // 5) the 📝 count on the timetable
  api = makeApi();
  s = await open({ api });
  await s.page.waitForSelector('.lesson, .noday, .empty', { timeout: 6000 }).catch(() => {});
  await s.page.waitForTimeout(1600);
  const chips = await s.page.locator('.tkchip').count();
  const cardsHtml = await s.page.evaluate(() => document.querySelector('#app').innerText.slice(0, 120));
  ok(api.st.calls.some((c) => c.op === 'list'), 'the timetable quietly asks for the tasks');
  await shot(s.page, 'tk-7-timetable');
  console.log(`  (info) chips on today's cards: ${chips}; first text: ${cardsHtml.replace(/\n/g, ' ')}`);
  await s.c.close();

  // 6) banned / limit
  api = makeApi(); api.st.banned = true;
  s = await open({ api, hash: '&tab=tasks' });
  await s.page.waitForSelector('.tkcard');
  ok(/shikoyat/.test(await txt(s.page, '.tkwarn')) && (await s.page.locator('#tkNew').count()) === 0, 'banned: a notice instead of the write button');
  await shot(s.page, 'tk-4-banned');
  await s.c.close();

  // 7) languages and dark mode
  for (const [lang, dark] of [['ru', false], ['en', true], ['uz', true]]) {
    api = makeApi();
    s = await open({ api, lang, dark, hash: '&tab=tasks' });
    await s.page.waitForSelector('.tkcard');
    const nav = await txt(s.page, '.nav [data-tab="tasks"]');
    ok(lang === 'ru' ? /Задания/.test(nav) : lang === 'en' ? /Tasks/.test(nav) : /Vazifalar/.test(nav), `${lang}: tab name "${nav}"`);
    if (lang !== 'uz') ok(!/Bugun|Ertaga|Shu hafta|Hammasi|Yozdi/.test(await txt(s.page, '#app')), `${lang}: no Uzbek words left in the tasks screen`);
    await shot(s.page, `tk-5-${lang}${dark ? '-dark' : ''}`);
    await s.page.click('#tkNew');
    await shot(s.page, `tk-6-form-${lang}${dark ? '-dark' : ''}`);
    ok(s.errs.length === 0, `${lang}: no errors: ` + s.errs.join(';'));
    await s.c.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`tasks-ui: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
