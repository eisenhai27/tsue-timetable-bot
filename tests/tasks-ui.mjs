// Mini App tasks: phone-sized Chromium + a stubbed Telegram WebApp + a stubbed /api/tasks (the server rules are tested in tasks.mjs).
// The clock is fixed (Thursday 12 Nov 2026, Tashkent) so "has the lesson begun?" is the same on every run.   SHOTS=/dir saves screenshots
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
const subjName = (s) => s.replace(/\s*\([^()]+\)\s*$/, '').trim();
let gid = null, gname = null, gdata = null;
for (const f of idx.faculties) for (const c of f.courses) for (const g of c.groups) {
  if (gid) break;
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, `data/g/${g[0]}.json`), 'utf8'));
  const th = (d.lessons || []).filter((l) => l.d === 3);
  const fr = (d.lessons || []).filter((l) => l.d === 4);
  const mid = (d.lessons || []).filter((l) => l.d === 2);
  const starts = new Set(th.map((l) => l.p));
  if (th.length >= 2 && starts.size === th.length && fr.length >= 1 && ![...th, ...fr, ...mid].some((l) => l.w)) { gid = g[0]; gname = g[1]; gdata = d; }
}
if (!gid) { console.log('tasks-ui: no suitable group in the data — skipped'); process.exit(0); }
const thu = gdata.lessons.filter((l) => l.d === 3).sort((a, b) => a.p - b.p);
const startOf = (l) => idx.periods.find((p) => p.p === l.p).start;
const subjects = [...new Set(gdata.lessons.map((l) => subjName(l.s)))].sort();
const S1 = subjName(thu[0].s), S2 = subjects.find((s) => s !== S1);
const TODAY = '2026-11-12';
const plus = (n) => new Date(Date.parse(TODAY + 'T00:00:00Z') + n * 864e5).toISOString().slice(0, 10);
const [lh, lm] = startOf(thu[thu.length - 1]).split(':').map(Number);
const AT = { night: `2026-11-12T${String(lh).padStart(2, '0')}:${String(lm + 1).padStart(2, '0')}:00+05:00`, early: '2026-11-12T06:00:00+05:00' }; // one minute into today's LAST lesson (all have begun), and 06:00

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  FAIL:', m); } };
const SHOTS = process.env.SHOTS;

const makeApi = () => {
  const st = { calls: [], banned: false, left: 5, tasks: [
    { id: 1, subj: S1, body: "5-mashq, 12-betdan.\nhttps://example.com/x?a=1&b=2 ham qarang", due: TODAY, by: 'Aziza K.', mine: false, st: 1, up: 3, down: 0, my: 0, sub: false, at: 1 },
    { id: 2, subj: S2, body: '<b>Referat</b> yozish', due: plus(5), by: 'Bobur', mine: false, st: 0, up: 1, down: 0, my: 0, sub: false, at: 2 },
    { id: 3, subj: S1, body: 'Mening vazifam', due: TODAY, by: 'Men', mine: true, st: 0, up: 0, down: 0, my: 0, sub: true, at: 3 },
    { id: 4, subj: S2, body: 'Kutubxonadan kitob olish', due: plus(20), by: 'Sardor', mine: false, st: 0, up: 0, down: 1, my: -1, sub: false, at: 4 },
    { id: 5, subj: S1, body: 'Uchinchi vazifa', due: TODAY, by: 'Dilnoza', mine: false, st: 0, up: 0, down: 0, my: 0, sub: false, at: 5 },
  ] };
  const handler = async (route) => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST' } });
    const b = JSON.parse(route.request().postData() || '{}');
    st.calls.push(b);
    const json = (o) => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(o) });
    if (b.op === 'list') return json({ ok: true, gid, gname, members: 24, banned: st.banned, left: st.left, admin: false, today: TODAY, need: { up: 3, down: 3 }, subjects: subjects.map((n) => ({ n, next: plus(7), dates: [plus(7), plus(14), plus(21)] })), tasks: st.tasks });
    if (b.op === 'add') { st.left--; st.tasks.push({ id: 9, subj: b.subj, body: b.text, due: b.due, by: 'Men', mine: true, st: 0, up: 0, down: 0, my: 0, sub: true, at: 9 }); return json({ ok: true, id: 9 }); }
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
    BackButton: { show: rec('bs'), hide: rec('bh'), onClick: (f) => { window.__tg.backCb = f; }, offClick: rec('bo') },
    CloudStorage: { getItems: (k, cb) => cb(null, {}), setItem: (k, v, cb) => cb && cb(null, true) } } };
})();`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined) });
async function open({ lang = 'uz', dark = false, data = true, hash = '', api, at = AT.night, ctx } = {}) {
  const c = ctx || await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'en-US' });
  await c.route(/telegram\.org|fonts\.g(oogleapis|static)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  if (api) await c.route(/\/api\/tasks$/, api.handler);
  const page = await c.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  await page.clock.setFixedTime(new Date(at));
  await page.addInitScript(`window.__dark=${dark}; try{localStorage.setItem('tt_lang', JSON.stringify('${lang}')); localStorage.setItem('tt_mine', JSON.stringify({type:'g',id:'${gid}',name:'${gname}'}));}catch(e){}`);
  await page.addInitScript(stub(data));
  await page.goto(BASE + `#g=${gid}&l=${lang}` + hash);
  await page.waitForSelector('.hero', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(700);
  return { c, page, errs };
}
const shot = async (page, name) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, name + '.png') }); } };
const txt = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].map((e) => e.innerText).join(' | '), sel);

try {
  // 1) not opened by a button that carries initData → an explanation with a way into the bot, and no request
  let api = makeApi();
  let s = await open({ data: false, api, hash: '&tab=tasks' });
  ok((await s.page.locator('.nav [data-tab="tasks"]').count()) === 1, 'the Vazifalar tab is in the bottom bar');
  ok(/menyu/.test(await txt(s.page, '.bccard')) && (await s.page.locator('#tkBot').count()) === 1 && api.st.calls.length === 0, 'without initData: an explanation, a "open in the bot" button, no API call: ' + await txt(s.page, '.bccard'));
  await s.page.click('#tkBot');
  ok((await s.page.evaluate(() => window.__tg.calls.some((c) => c[0] === 'openTelegramLink' && /start=vazifa/.test(c[1])))), 'the button opens the bot with start=vazifa');
  await shot(s.page, 'tk-1-needtg');
  ok(s.errs.length === 0, 'no errors: ' + s.errs.join(';'));
  await s.c.close();

  // 2) the lessons: tasks due today are ON today's lesson cards; ✏️ on every lesson that has begun
  api = makeApi();
  s = await open({ api });
  ok((await s.page.locator('.lesson').count()) === thu.length, `today (Thursday) has ${thu.length} lesson cards`);
  ok((await s.page.locator('.tkpen').count()) === thu.length, 'one minute into the last lesson every lesson of today has begun → a ✏️ on each');
  const first = s.page.locator('.lesson').first();
  ok((await first.locator('.tkin').count()) === 1 && /5-mashq/.test(await first.locator('.tkin').innerText()), 'the first lesson shows its task right on the card: ' + await first.innerText());
  ok((await first.locator('.tkl').count()) === 3 || (await first.locator('.tkl').count()) === 3, 'two tasks + "+1 more" (3 tasks due today for this subject): ' + await first.locator('.tkin').innerText());
  ok((await first.locator('.tkl.ok').count()) === 1, 'a confirmed task is marked ✅');
  await shot(s.page, 'tk-2-timetable');
  // week view: a 📝 count only
  // tomorrow: no ✏️ (a lesson that has not happened cannot get a task)
  await s.page.click('.day[data-d="4"]');
  await s.page.waitForTimeout(400);
  ok((await s.page.locator('.lesson').count()) >= 1 && (await s.page.locator('.tkpen').count()) === 0, "tomorrow's lessons have no ✏️");
  await shot(s.page, 'tk-3-tomorrow');
  await s.page.click('.day[data-d="2"]'); // yesterday
  await s.page.waitForTimeout(400);
  ok((await s.page.locator('.lesson').count() === 0) || (await s.page.locator('.tkpen').count()) === (await s.page.locator('.lesson').count()), "yesterday's lessons have a ✏️");
  await s.page.click('.day[data-d="3"]');
  await s.page.waitForTimeout(400);

  // 3) ✏️ → the page: subject, the coming lessons' dates (first = "next lesson"), write, send, back with a thank-you
  await s.page.locator('.tkpen').first().click();
  await s.page.waitForSelector('#tkText');
  ok(/zbekiston|[A-Za-z]{4}/.test(await txt(s.page, '.hero .t1')) && /12\.11/.test(await txt(s.page, '.hero .t2')), 'the page names the subject and the lesson day: ' + await txt(s.page, '.hero'));
  ok((await s.page.locator('.dchip').count()) === 4, 'three coming lesson dates + "another date": ' + await txt(s.page, '.dchips'));
  ok(/19\.11/.test(await txt(s.page, '.dchip.on')) && /keyingi dars/.test(await txt(s.page, '.dchip.on')), 'the next lesson is preselected: ' + await txt(s.page, '.dchip.on'));
  ok((await s.page.evaluate(() => window.__tg.calls.some((c) => c[0] === 'bs'))), 'Telegram back button shown');
  await shot(s.page, 'tk-4-compose');
  await s.page.click('#tkPost');
  ok(/qisqa/i.test(await txt(s.page, '#tkMsg')) && !api.st.calls.some((c) => c.op === 'add'), 'empty text → message, nothing sent');
  await s.page.fill('#tkText', 'Yangi vazifa matni');
  await s.page.click('.dchip:nth-child(2)');
  await s.page.click('#tkPost');
  await s.page.waitForTimeout(700);
  const add = api.st.calls.find((c) => c.op === 'add');
  ok(add && add.subj === S1 && add.text === 'Yangi vazifa matni' && add.due === plus(14), 'add sent for the picked lesson date: ' + JSON.stringify(add));
  ok((await s.page.locator('.lesson').count()) === thu.length && (await s.page.locator('.toast').count()) === 1, 'back on the timetable with a thank-you toast');
  // another date
  await s.page.locator('.tkpen').first().click();
  await s.page.waitForSelector('#tkText');
  await s.page.click('.dchip:last-child');
  await s.page.fill('#tkDate', plus(10));
  await s.page.fill('#tkText', 'Sana bilan');
  await s.page.click('#tkPost');
  await s.page.waitForTimeout(500);
  ok(api.st.calls.filter((c) => c.op === 'add').pop().due === plus(10), 'a chosen date is sent');

  // 4) the list on the tasks tab
  await s.page.click('.nav [data-tab="tasks"]');
  await s.page.waitForSelector('.tkcard');
  ok(/bugun/i.test(await txt(s.page, '.tksec')) && /shu hafta/i.test(await txt(s.page, '.tksec')) && /keyinroq/i.test(await txt(s.page, '.tksec')), 'sections: ' + await txt(s.page, '.tksec'));
  ok((await s.page.locator('.tkbody a').count()) === 1 && (await s.page.locator('.tkbody b').count()) === 0, 'a link becomes a link, HTML in a task stays text');
  ok((await s.page.locator('.tkcard[data-id="3"] [data-v]').count()) === 0 && (await s.page.locator('.tkcard[data-id="3"] [data-del]').count()) === 1, 'own task: no 👍/🚩, but delete');
  ok((await s.page.locator('.tkcard[data-id="1"] [data-del]').count()) === 0, "someone else's task: no delete");
  ok(/✏️/.test(await txt(s.page, '.tkhint')), 'the hint says where tasks are added: ' + await txt(s.page, '.tkhint'));
  await shot(s.page, 'tk-5-list');
  await s.page.click('.tkcard[data-id="2"] [data-v="1"]'); await s.page.waitForTimeout(300);
  ok(api.st.calls.some((c) => c.op === 'vote' && c.id === 2 && c.v === 1) && (await s.page.locator('.tkcard[data-id="2"] [data-v="1"].on').count()) === 1, '👍 sent and highlighted');
  await s.page.click('.tkcard[data-id="2"] [data-v="1"]'); await s.page.waitForTimeout(300);
  ok(api.st.calls.some((c) => c.op === 'vote' && c.id === 2 && c.v === 0), 'pressing it again takes the vote back');
  await s.page.click('.tkcard[data-id="1"] [data-sub]'); await s.page.waitForTimeout(250);
  ok(api.st.calls.some((c) => c.op === 'sub' && c.id === 1 && c.on === true), '🔔 on');
  const nBefore = await s.page.locator('.tkcard').count();
  await s.page.click('.tkcard[data-id="3"] [data-del]'); await s.page.waitForTimeout(200);
  ok((await s.page.locator('.tkcard').count()) === nBefore && /O'chirasizmi/.test(await txt(s.page, '.tkcard[data-id="3"] .tkdel')), 'first tap on 🗑 only asks');
  await s.page.click('.tkcard[data-id="3"] [data-del]'); await s.page.waitForTimeout(300);
  ok((await s.page.locator('.tkcard').count()) === nBefore - 1 && api.st.calls.some((c) => c.op === 'del' && c.id === 3), 'second tap deletes');
  ok(s.errs.length === 0, 'no errors: ' + s.errs.join(';'));

  // 5) a task line on a card opens the list for that subject
  await s.page.click('.nav [data-tab="tt"]'); await s.page.waitForTimeout(500);
  await s.page.locator('.tkl').first().click(); await s.page.waitForTimeout(400);
  ok((await s.page.locator('.nav [data-tab="tasks"].on').count()) === 1 && /✕/.test(await txt(s.page, '[data-fs]')), 'tapping a task line opens the tasks tab filtered to the subject');
  await s.c.close();

  // 6) the last list is kept on the phone: lessons show their tasks at once, even before (or without) an answer
  api = makeApi();
  s = await open({ api });
  const ctx = s.c;
  await s.page.close();
  await ctx.unroute(/\/api\/tasks$/);
  await ctx.route(/\/api\/tasks$/, (r) => r.abort());
  const p2 = await ctx.newPage();
  await p2.clock.setFixedTime(new Date(AT.night));
  await p2.addInitScript(`window.__dark=false;`); await p2.addInitScript(stub(true));
  await p2.goto(BASE + `#g=${gid}&l=uz`);
  await p2.waitForSelector('.lesson');
  await p2.waitForTimeout(200);
  ok((await p2.locator('.lesson .tkin').count()) >= 1, 'with no answer from the server the kept list still shows tasks on the lessons');
  await ctx.close();

  // 7) early morning: today's lessons have not begun → no ✏️
  api = makeApi();
  s = await open({ api, at: AT.early });
  ok((await s.page.locator('.lesson').count()) === thu.length && (await s.page.locator('.tkpen').count()) === 0, 'at 06:00 no lesson of today has begun → no ✏️');
  await s.c.close();

  // 8) banned
  api = makeApi(); api.st.banned = true;
  s = await open({ api, hash: '&tab=tasks' });
  await s.page.waitForSelector('.tkcard');
  ok(/shikoyat/.test(await txt(s.page, '.tkwarn')), 'banned: a notice on the list');
  await s.page.click('.nav [data-tab="tt"]'); await s.page.waitForTimeout(500);
  await s.page.locator('.tkpen').first().click(); await s.page.waitForTimeout(500);
  ok(/shikoyat/.test(await txt(s.page, '.tkwarn')) && (await s.page.locator('#tkPost').count()) === 0, 'banned: the compose page shows the notice, no form');
  await s.c.close();

  // 9) languages and dark mode
  for (const [lang, dark] of [['ru', false], ['en', true], ['uz', true]]) {
    api = makeApi();
    s = await open({ api, lang, dark });
    const nav = await txt(s.page, '.nav [data-tab="tasks"]');
    ok(lang === 'ru' ? /Задания/.test(nav) : lang === 'en' ? /Tasks/.test(nav) : /Vazifalar/.test(nav), `${lang}: tab name "${nav}"`);
    await shot(s.page, `tk-6-tt-${lang}${dark ? '-dark' : ''}`);
    await s.page.locator('.tkpen').first().click(); await s.page.waitForSelector('#tkText');
    if (lang !== 'uz') ok(!/Vazifa|Qaysi|Guruhga|keyingi dars/.test(await txt(s.page, '#app')), `${lang}: no Uzbek words on the compose page: ` + await txt(s.page, '.bccard'));
    await shot(s.page, `tk-7-compose-${lang}${dark ? '-dark' : ''}`);
    await s.page.click('.nav [data-tab="tasks"]'); await s.page.waitForSelector('.tkcard');
    if (lang !== 'uz') ok(!/Bugun|Ertaga|Shu hafta|Hammasi|Yozdi|Vazifa/.test(await txt(s.page, '#app')), `${lang}: no Uzbek words on the list`);
    await shot(s.page, `tk-8-list-${lang}${dark ? '-dark' : ''}`);
    ok(s.errs.length === 0, `${lang}: no errors: ` + s.errs.join(';'));
    await s.c.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`tasks-ui: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
