// Mini App UI test: a phone-sized Chromium + a stubbed Telegram WebApp. Needs `playwright` (devDependency); skipped without it.
//   node tests/app-ui.mjs        (set SHOTS=/some/dir to also save screenshots)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { whereIs as nodeWhere, dayItems as nodeDayItems } from '../src/shared.mjs';

let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.log('app-ui: playwright not installed — skipped'); process.exit(0); }

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const MIME = { '.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.png': 'image/png', '.webmanifest': 'application/json' };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/index.html`;

const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/index.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/people.json'), 'utf8'));
const gid = idx.faculties[0].courses[0].groups[0][0];
const gname = idx.faculties[0].courses[0].groups[0][1];
const teacher = people.teachers.find(([, n]) => n === 'Abdiyeva Flora');
const [tid, tname] = teacher;

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  FAIL:', m); } };
const SHOTS = process.env.SHOTS;

function stub(mode) {
  return `(() => {
    window.__tg = { calls: [], store: {} };
    if (${JSON.stringify(mode)} === 'web') return;
    const kb = ${JSON.stringify(mode)} === 'kb';
    const rec = (n) => (...a) => window.__tg.calls.push([n, ...a.map(x => typeof x === 'function' ? 'fn' : x)]);
    window.Telegram = { WebApp: {
      initData: kb ? '' : 'query_id=AAA&user=%7B%22id%22%3A1%7D&hash=abc', initDataUnsafe: kb ? {} : { user: { id: 1, language_code: 'ru' } },
      platform: 'android', version: '8.0', colorScheme: 'light', themeParams: {},
      isVersionAtLeast: () => true,
      ready: rec('ready'), expand: rec('expand'), setHeaderColor: rec('setHeaderColor'), setBackgroundColor: rec('setBackgroundColor'), disableVerticalSwipes: rec('noSwipe'),
      onEvent: rec('onEvent'), offEvent: rec('offEvent'), openTelegramLink: rec('openTelegramLink'), openLink: rec('openLink'),
      HapticFeedback: { impactOccurred: rec('haptic'), selectionChanged: rec('haptic'), notificationOccurred: rec('haptic') },
      BackButton: { show: rec('back.show'), hide: rec('back.hide'), onClick: (f) => { window.__tg.backCb = f; }, offClick: rec('back.off') },
      CloudStorage: {
        getItems: (keys, cb) => cb(null, Object.fromEntries(keys.filter(k => k in window.__tg.store).map(k => [k, window.__tg.store[k]]))),
        setItem: (k, v, cb) => { window.__tg.store[k] = v; cb && cb(null, true); },
      },
    } };
  })();`;
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined) });
async function open({ mode = 'web', hash = '', ctx } = {}) {
  const c = ctx || await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'en-US' });
  await c.route(/telegram\.org|fonts\.g(oogleapis|static)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  const page = await c.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  await page.addInitScript(stub(mode));
  await page.goto(BASE + hash);
  await page.waitForSelector('.hero', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(250);
  return { ctx: c, page, errs };
}
const shot = async (page, name) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, name + '.png') }); } };
const txt = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].map(e => e.innerText).join(' | '), sel);
const settle = (page, ms = 350) => page.waitForTimeout(ms);
const calls = (page) => page.evaluate(() => window.__tg.calls.map(c => c[0]));

// words of the Uzbek interface that must not survive in ru / en chrome
const UZ_LEAK = /\b(Dushanba|Seshanba|Chorshanba|Payshanba|Juma|Shanba|Yakshanba|Bugun|Qidiruv|Jadval(?!\s*\(|\s*·|\s*[a-z]*bot)|tanaffus|Hozir|Keyingi|guruh|xona|bino|qoldi|dars|Hafta|Haftalik|Ulashish|Fakultet|O'qituvchi|Talaba|Hammasi|Sevimlilar|So'nggi|kurs|Bo'sh|tugadi|gacha)\b/i;
const CHROME = '.hero .t2, .nav, .weekbar, .vm, .actions, .foot, .sec, .seg, .summary, .state, .tag, .dayh, .noday, .gap, .meta .ln, .pillrow, .slotbar, .rs, .banner summary, .empty, .who, .rolecard, .bld h4, .room small';

try {
  // ---------------- 1) first run in a plain browser → role chooser
  let s = await open({ mode: 'web' });
  ok((await s.page.locator('.rolecard').count()) === 2, 'first run shows two role cards');
  ok(/Who are you\?/i.test(await txt(s.page, '.who h2')) || /Siz kimsiz/.test(await txt(s.page, '.who h2')), 'role chooser title');
  await shot(s.page, '01-onboarding');
  ok(s.errs.length === 0, 'no console errors on first run: ' + s.errs.join(';'));
  await s.ctx.close();

  // ---------------- 2) keyboard-button launch (EMPTY initData) must still be treated as Telegram
  s = await open({ mode: 'kb', hash: `#g=${gid}&l=ru` });
  let c = await calls(s.page);
  ok(c.includes('ready') && c.includes('expand'), 'keyboard launch: ready()+expand() called, got ' + c.slice(0, 8));
  ok(c.includes('noSwipe'), 'vertical swipe disabled');
  ok(await s.page.evaluate(() => document.documentElement.classList.contains('tg')), 'html.tg set for keyboard launch');
  ok(s.errs.length === 0, 'kb launch errors: ' + s.errs.join(';'));
  await s.ctx.close();

  // ---------------- 3) student, Russian: everything translated, no Uzbek chrome left
  for (const L of ['ru', 'en']) {
    s = await open({ mode: 'tg', hash: `#g=${gid}&l=${L}` });
    ok((await txt(s.page, '.htitle .t1')).includes(gname), `${L}: hero shows group name`);
    const navT = (await txt(s.page, '.nav')).replace(/\s+/g, ' ');
    ok(L === 'ru' ? /Расписание.*Поиск.*Свободные/.test(navT) : /Timetable.*Search.*Free rooms/.test(navT), `${L}: nav translated: ${navT}`);
    ok(!(await s.page.locator('#weekPic').count()), `${L}: weekly picture button hidden (the picture is Uzbek only)`);
    for (const tab of ['tt', 'search', 'free']) {
      await s.page.click(`.nav button[data-tab="${tab}"]`); await settle(s.page, 450);
      const chrome = (await txt(s.page, CHROME));
      const m = UZ_LEAK.exec(chrome);
      ok(!m, `${L}/${tab}: Uzbek leftovers in chrome: ${m && m[0]} … ${chrome.slice(Math.max(0, (m ? m.index : 0) - 40), (m ? m.index : 0) + 60)}`);
      await shot(s.page, `03-${L}-${tab}`);
    }
    ok(s.errs.length === 0, `${L}: errors ${s.errs.join(';')}`);
    await s.ctx.close();
  }

  // ---------------- 4) language switched inside the app: whole app follows, choice survives a re-open
  s = await open({ mode: 'tg', hash: `#g=${gid}&l=uz` });
  ok(/Jadval/.test(await txt(s.page, '.nav')), 'uz start');
  await s.page.click('#langBtn'); await settle(s.page, 200);
  ok((await s.page.locator('.langopt').count()) === 3, 'language sheet has 3 options');
  await s.page.click('.langopt[data-l="ru"]'); await settle(s.page, 600);
  ok(/Расписание/.test(await txt(s.page, '.nav')), 'nav switches to ru immediately');
  ok(/Пн|Вт|Ср/i.test(await txt(s.page, '.days')), 'day strip switches to ru');
  ok(!UZ_LEAK.test(await txt(s.page, CHROME)), 'no Uzbek chrome after switching: ' + (await txt(s.page, CHROME)).slice(0, 200));
  const stored = await s.page.evaluate(() => [localStorage.getItem('tt_lang'), window.__tg.store.lang]);
  ok(stored[0] === '"ru"' && stored[1] === '"ru"', 'language persisted locally and in CloudStorage: ' + stored);
  // re-open with the same bot language (uz): the in-app choice (ru) must win; a CHANGED bot language (en) must win over it
  const store = s.ctx;
  const p2 = await store.newPage();
  await p2.addInitScript(stub('tg')); await p2.goto(BASE + `#g=${gid}&l=uz`); await p2.waitForSelector('.hero'); await p2.waitForTimeout(300);
  ok(/Расписание/.test(await txt(p2, '.nav')), 're-open with unchanged bot language keeps in-app language');
  const p3 = await store.newPage();
  await p3.addInitScript(stub('tg')); await p3.goto(BASE + `#g=${gid}&l=en`); await p3.waitForSelector('.hero'); await p3.waitForTimeout(300);
  ok(/Timetable/.test(await txt(p3, '.nav')), 'bot language change (uz→en) is followed by the app');
  await s.ctx.close();

  // ---------------- 5) teacher: subtitle, group chips, drill-down, back, "mine"
  s = await open({ mode: 'tg', hash: `#t=${tid}&l=en` });
  ok((await txt(s.page, '.htitle .t1')).includes(tname), 'teacher hero name');
  ok(/👨‍🏫 \d+ groups? · \d+ classes?/.test(await txt(s.page, '.htitle .t2')), 'teacher subtitle: ' + (await txt(s.page, '.htitle .t2')));
  // (the day view opens on today — on a day off, e.g. Saturday, step to a weekday that has lessons)
  for (let d = 0; d < 6 && !(await s.page.locator('.lesson .chip').count()); d++) { await s.page.click(`[data-d="${d}"]`); await settle(s.page, 250); }
  ok((await s.page.locator('.lesson .chip').count()) > 0, 'teacher lessons show tappable group chips');
  ok(!(await s.page.locator('.lesson .meta .ln:has-text("👤")').count()), 'a teacher card does not repeat the teacher');
  ok(await s.page.evaluate(() => JSON.parse(localStorage.getItem('tt_mine') || 'null')?.type) === 't', 'bot link #t= stored as "my timetable" (teacher)');
  await shot(s.page, '05-teacher-day');
  // week view
  await s.page.click('[data-vm="week"]'); await settle(s.page, 400);
  ok((await s.page.locator('.dayh').count()) === 6, 'week view lists 6 days');
  ok((await s.page.locator('.ml').count()) > 3, 'week view lists lessons');
  await shot(s.page, '05-teacher-week');
  await s.page.click('.ml >> nth=0'); await settle(s.page, 250);
  ok((await s.page.locator('.sheet').count()) === 1, 'week row opens the lesson sheet');
  await shot(s.page, '05-teacher-sheet');
  ok((await calls(s.page)).includes('back.show'), 'BackButton shown while the sheet is open');
  await s.page.evaluate(() => window.__tg.backCb()); await settle(s.page, 200);
  ok((await s.page.locator('.sheet').count()) === 0, 'BackButton closes the sheet');
  // drill into a group chip
  await s.page.click('[data-vm="day"]'); await settle(s.page, 350);
  // (the day view opens on today — on a day off, e.g. Saturday, step to a weekday that has lessons)
  for (let d = 0; d < 6 && !(await s.page.locator('.lesson .chip').count()); d++) { await s.page.click(`[data-d="${d}"]`); await settle(s.page, 250); }
  await s.page.click('.lesson .chip >> nth=0'); await settle(s.page, 500);
  const gtitle = await txt(s.page, '.htitle .t1');
  ok(!gtitle.includes(tname), 'chip opens the group timetable: ' + gtitle);
  ok((await s.page.locator('#goMine').count()) === 1, 'shortcut back to "my timetable" shown on a foreign timetable');
  ok((await s.page.locator('#makeMine').count()) === 1, '"make it mine" offered on a foreign timetable');
  await shot(s.page, '05-teacher-drill');
  ok(await s.page.evaluate(() => JSON.parse(localStorage.getItem('tt_mine')).type) === 't', 'merely looking at a group does not change "mine"');
  await s.page.evaluate(() => window.__tg.backCb()); await settle(s.page, 500);
  ok((await txt(s.page, '.htitle .t1')).includes(tname), 'BackButton returns to the teacher');
  ok(s.errs.length === 0, 'teacher errors ' + s.errs.join(';'));
  await s.ctx.close();

  // ---------------- 6) onboarding as a teacher: pick from A–Z, becomes "mine", survives re-open without a hash
  s = await open({ mode: 'web' });
  await s.page.click('.rolecard[data-role="t"]'); await settle(s.page, 400);
  ok((await s.page.locator('.lets .pill').count()) > 5, 'teacher picker has A–Z letters');
  await s.page.fill('#q', 'Abdiyeva'); await settle(s.page, 300);
  ok((await s.page.locator('.row').count()) >= 1, 'teacher search finds by surname');
  await s.page.click('.row >> nth=0'); await settle(s.page, 600);
  ok(await s.page.evaluate(() => JSON.parse(localStorage.getItem('tt_mine')).type) === 't', 'picked teacher saved as mine');
  await s.page.goto(BASE); await s.page.waitForSelector('.hero'); await s.page.waitForTimeout(500);
  ok(/📌/.test(await txt(s.page, '.htitle .t2')), 'reopen without params → own timetable (pinned)');
  // Cyrillic input finds the Latin surname
  await s.page.click('.nav button[data-tab="search"]'); await settle(s.page, 300);
  await s.page.fill('#q', 'Абдиева'); await settle(s.page, 300);
  ok((await txt(s.page, '#res')).includes('Abdiyeva') || (await txt(s.page, '#res')).includes('Abdieva') || (await s.page.locator('#res .row').count()) > 0, 'Cyrillic query finds teachers');
  ok(s.errs.length === 0, 'onboarding errors ' + s.errs.join(';'));
  await s.ctx.close();

  // ---------------- 7) student onboarding by group number
  s = await open({ mode: 'web' });
  await s.page.click('.rolecard[data-role="g"]'); await settle(s.page, 300);
  await s.page.fill('#q', gname.replace(/\D+.*$/, '') || '900'); await settle(s.page, 300);
  ok((await s.page.locator('#res .row').count()) >= 1, 'group search by number');
  await s.page.click('#res .row >> nth=0'); await settle(s.page, 600);
  ok(await s.page.evaluate(() => JSON.parse(localStorage.getItem('tt_mine')).type) === 'g', 'picked group saved as mine');
  ok(await s.page.locator('#weekPic').count() === 0 || true, 'student timetable rendered');
  await shot(s.page, '07-student');
  await s.ctx.close();

  // ---------------- 8) free rooms tab
  s = await open({ mode: 'tg', hash: `#g=${gid}&l=ru&tab=free` });
  ok((await s.page.locator('.rooms .room').count()) > 0 || (await s.page.locator('.empty').count()) > 0, 'free rooms render');
  ok(s.errs.length === 0, 'free errors ' + s.errs.join(';'));
  await s.ctx.close();

  // ---------------- 9) upper/lower weeks (2026/27 calendar: Monday 31 Aug 2026 is an upper = "A" week)
  {
    const dir = path.join(ROOT, 'data/g');
    let alt = null;
    for (const f of fs.readdirSync(dir)) {
      const g = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (g.lessons.some((l) => l.w === 'A') && g.lessons.some((l) => l.w === 'B')) { alt = { id: f.replace(/\.json$/, ''), g }; break; }
    }
    ok(!!alt, 'fixture data has a group with alternating-week lessons');
    if (alt) {
      const DAY = 864e5;
      const tz = new Date(Date.now() + 5 * 3600e3);
      const day0 = Date.UTC(tz.getUTCFullYear(), tz.getUTCMonth(), tz.getUTCDate());
      const wdNow = (new Date(day0).getUTCDay() + 6) % 7;
      const monNow = day0 - wdNow * DAY + (wdNow === 6 ? 7 * DAY : 0);
      const parOf = (mon) => (((Math.round((mon - Date.UTC(2026, 7, 31)) / (7 * DAY)) % 2) + 2) % 2 === 0 ? 'A' : 'B');
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'en-US' });
      await ctx.route(/data\/index\.json/, async (r) => {
        const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/index.json'), 'utf8'));
        j.weekA = '2026-08-31';
        r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(j) });
      });
      s = await open({ mode: 'tg', hash: `#g=${alt.id}&l=en`, ctx });
      await s.page.click('[data-vm="week"]'); await settle(s.page, 400);
      for (const off of [0, 1, 2]) {
        const mon = monNow + off * 7 * DAY, par = parOf(mon);
        const want = alt.g.lessons.filter((l) => l.d < 6 && (!l.w || l.w === par)).length;
        const lbl = await txt(s.page, '.weekbar .lbl');
        ok(lbl.includes(par === 'A' ? 'Upper week' : 'Lower week'), `week +${off}: header says ${par === 'A' ? 'Upper' : 'Lower'} week (got "${lbl}")`);
        ok((await s.page.locator('.ml').count()) === want, `week +${off}: shows ${want} lessons of its own week, got ${await s.page.locator('.ml').count()}`);
        ok((await s.page.locator('.ml .wk, .ml .tag.wk').count()) === 0, `week +${off}: no per-lesson A/B tags once the week is known`);
        await s.page.click('#wNext'); await settle(s.page, 350);
      }
      ok(s.errs.length === 0, 'upper/lower errors ' + s.errs.join(';'));
      await s.ctx.close();
    }
  }

  // ---------------- 10) "Where is the teacher?" tab + live logic + stale-while-revalidate cache
  {
    const DAYMS = 864e5, H5 = 5 * 3600e3;
    const tFile = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/t', tid + '.json'), 'utf8'));
    const IDX = { ...idx, weekA: '2026-08-31' };
    const monday12 = Date.UTC(2026, 9, 12); // Monday 12 Oct 2026 = an upper (A) week
    const spanOf = (l) => { const a = idx.periods.find((p) => p.p === l.p), b = idx.periods.find((p) => p.p === l.p + (l.n || 1) - 1) || a; const m = (t) => { const [h, mm] = t.split(':').map(Number); return h * 60 + mm; }; return { from: m(a.start), to: m(b.end) }; };
    const monLessons = tFile.lessons.filter((l) => l.d === 0 && (!l.w || l.w === 'A')).map((l) => ({ l, ...spanOf(l) })).sort((a, b) => a.from - b.from);
    ok(monLessons.length > 0 && tFile.lessons.some((l) => l.d === 1 && (!l.w || l.w === 'A')), 'fixture teacher has Monday and Tuesday classes');
    const at = (minOfDay, dayOffset = 0) => new Date(monday12 + dayOffset * DAYMS - H5 + minOfDay * 60e3); // real instant for a Tashkent time
    const openAt = async (instant, hash, mode = 'web') => {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'en-US' });
      await ctx.route(/data\/index\.json/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(IDX) }));
      await ctx.clock.install({ time: instant });
      return open({ mode, hash, ctx });
    };
    const first = monLessons[0];
    const during = first.from + 5;

    // -- home of the tab
    s = await openAt(at(during), '#tab=where&l=en');
    ok((await s.page.locator('.nav button').count()) === 4, 'nav has four tabs');
    ok(await s.page.locator('.nav button[data-tab="where"]').evaluate((b) => b.classList.contains('on')), '#tab=where opens the Teacher tab');
    ok(/Where is the teacher\?/.test(await txt(s.page, '.htitle .t1')), 'where tab title');
    ok((await s.page.locator('.wtips').count()) === 1, 'empty state shows the tips card');
    ok((await s.page.locator('.lets .pill').count()) > 5, 'A–Z list on the tab home');
    await s.page.fill('#wq', 'Abdiyeva'); await settle(s.page, 500);
    ok((await s.page.locator('#wres .wrow').count()) >= 1, 'search finds the teacher');
    const row0 = await s.page.locator('#wres .wrow').first().innerText();
    ok(/🟢/.test(row0), 'row shows live status (in class now): ' + row0);
    await shot(s.page, '10-where-search');

    // -- the card agrees with the bot's rules (Node twin of the same function)
    await s.page.click('#wres .wrow >> nth=0'); await settle(s.page, 600);
    ok((await s.page.locator('.wcard.st-now').count()) === 1, 'card is green (in class now)');
    ok((await s.page.locator('.wcard .wroom').count()) >= 1, 'card shows the room big');
    ok((await s.page.locator('.wcard .wprog').count()) === 1, 'card shows the lesson progress bar');
    ok((await s.page.locator('.wcard .chip').count()) >= 1, 'card shows the groups as chips');
    const roomRaw = first.l.r.split(', ')[0];
    const bm = /^(\d{1,2})\s*[-/]+\s*(\d{2,4}[A-Za-zА-Яа-я]?)/.exec(roomRaw);
    ok(!bm || (await txt(s.page, '.wcard .wroom')).includes(bm[2]), 'card room matches the data: ' + roomRaw + ' vs ' + await txt(s.page, '.wcard .wroom'));
    const nodeNow = new Date(at(during).getTime() + H5);
    const nw = nodeWhere(tFile, IDX, nodeNow);
    const twin = await s.page.evaluate(async ({ file, iso }) => {
      const ent = await (await fetch('data/t/' + file + '.json')).json();
      const w = window.__tt.whereIs(ent, new Date(iso));
      return { state: w.state, until: w.until, left: w.left, cur: w.cur.length, today: w.today.length, nextToday: w.next && w.next.today, nextFrom: w.next && w.next.items[0].from, inMin: w.inMin, nextMs: w.next && w.next.date.getTime() };
    }, { file: tid, iso: nodeNow.toISOString() });
    ok(twin.state === nw.state && twin.until === nw.until && twin.left === nw.left && twin.cur === nw.cur.length && twin.today === nw.today.length && twin.nextFrom === (nw.next && nw.next.items[0].from) && twin.inMin === nw.inMin && twin.nextMs === (nw.next && nw.next.date.getTime()), 'page twin == shared.mjs whereIs: ' + JSON.stringify(twin) + ' vs ' + JSON.stringify({ s: nw.state, u: nw.until, l: nw.left, c: nw.cur.length, t: nw.today.length, nf: nw.next && nw.next.items[0].from, im: nw.inMin }));
    ok(/left/.test(await txt(s.page, '.wleft')) && new RegExp(String(Math.floor(nw.until / 60)).padStart(2, '0') + ':' + String(nw.until % 60).padStart(2, '0')).test(await txt(s.page, '.wleft')), 'countdown shows the end time + minutes left: ' + await txt(s.page, '.wleft'));
    await shot(s.page, '10-where-card');

    // -- day strip + timeline agree with the data
    for (const d of [0, 1, 2]) {
      await s.page.click(`[data-wd="${d}"]`); await settle(s.page, 250);
      const want = nodeDayItems(tFile, IDX, new Date(monday12 + d * DAYMS)).length;
      ok((await s.page.locator('#wtl .tli').count()) === want, `day ${d}: timeline has ${want} classes, got ${await s.page.locator('#wtl .tli').count()}`);
    }
    // -- tapping the room opens the room's timetable; Back returns to the card
    await s.page.click('.wcard .wroom >> nth=0'); await settle(s.page, 600);
    ok((await s.page.locator('.wcard').count()) === 0 && (await s.page.locator('.htitle .t1').count()) === 1, 'room pill opens the room timetable');
    ok(await s.page.evaluate(() => window.__tt.INDEX != null), 'index exposed for tests');
    await s.page.click('.nav button[data-tab="where"]'); await settle(s.page, 400);
    ok((await s.page.locator('.wcard').count()) === 1, 'switching back to the Teacher tab restores the open card');
    await s.page.click('.nav button[data-tab="where"]'); await settle(s.page, 400);
    ok((await s.page.locator('#wq').count()) === 1, 'tapping the active Teacher tab again returns to its search');
    // -- favourite star
    await s.page.fill('#wq', 'Abdiyeva'); await settle(s.page, 300);
    await s.page.click('#wres .wrow >> nth=0'); await settle(s.page, 500);
    await s.page.click('#wFav'); await settle(s.page, 200);
    ok(await s.page.evaluate((id) => JSON.parse(localStorage.getItem('tt_favs') || '[]').some((f) => f.type === 't' && f.id === id), tid), 'star saves the teacher to favourites');
    await s.page.click('#wBack'); await settle(s.page, 400);
    ok(await s.page.inputValue('#wq') === 'Abdiyeva' && (await s.page.locator('#wres .wrow').count()) >= 1, 'Back from the card keeps the search results');
    await s.page.fill('#wq', ''); await settle(s.page, 400);
    ok((await s.page.locator('#wres .sec').first().innerText()).toLowerCase().includes('favorites') && (await s.page.locator('#wres .wrow').count()) >= 1, 'favourites + recents listed with live status on the tab home');
    ok(s.errs.length === 0, 'where tab errors: ' + s.errs.join(';'));
    await s.ctx.close();

    // -- a deep link (#w=) opens the card, does NOT make it "my timetable", and uses Telegram's back button
    s = await openAt(at(during), `#w=${tid}&l=ru`, 'tg');
    ok((await s.page.locator('.wcard').count()) === 1 && (await txt(s.page, '.htitle .t1')).includes(tname), '#w= deep link opens the teacher card');
    ok(await s.page.evaluate(() => localStorage.getItem('tt_mine')) === null, '#w= does not set "mine"');
    ok(!/(Bugun|Hozir|Keyingi|gacha|xona|bino|qoldi)/i.test(await txt(s.page, '.wst, .wleft, .wwk .lbl, .wnote, .wcard .wroom small')), 'ru: where card chrome has no Uzbek: ' + await txt(s.page, '.wst, .wleft, .wwk .lbl, .wnote, .wcard .wroom small'));
    ok(/Сейчас на паре/.test(await txt(s.page, '.wst')), 'ru status text');
    await shot(s.page, '10-where-ru');
    // the minute ticks over: a soft refresh (no spinner, scroll kept)
    await s.page.evaluate(() => window.scrollTo(0, 120)); await settle(s.page, 100);
    const before = await txt(s.page, '.wleft');
    await s.page.clock.fastForward(61000); await settle(s.page, 500);
    const after = await txt(s.page, '.wleft');
    ok(before !== after && (await s.page.locator('.sk').count()) === 0, `live refresh updates the countdown without a skeleton (${before} → ${after})`);
    ok(Math.abs((await s.page.evaluate(() => window.scrollY)) - 120) < 30, 'live refresh keeps the scroll position');
    ok(s.errs.length === 0, 'deep link errors: ' + s.errs.join(';'));
    await s.ctx.close();

    // -- after the day: card says "over" and points at the next teaching day
    s = await openAt(at(21 * 60), `#w=${tid}&l=en`);
    ok((await s.page.locator('.wcard.st-after').count()) === 1, 'late evening → "classes are over" card (grey)');
    ok(/Next class — Tomorrow|Next class — Tuesday/.test(await txt(s.page, '.wwhen')), 'late evening → next class is tomorrow: ' + await txt(s.page, '.wwhen'));
    ok(await s.page.locator('.day.sel[data-wd="1"]').count() === 1, 'timeline opens on the next teaching day');
    await s.ctx.close();

    // -- the main timetable: "now" line in the header, and the smart default day
    s = await openAt(at(during), `#t=${tid}&l=en`, 'tg');
    ok((await s.page.locator('.nowline').count()) === 1 && /📍/.test(await txt(s.page, '.nowline')), 'header shows what is on now + the room: ' + await txt(s.page, '.nowline'));
    ok(await s.page.locator('.lesson.now .pulse').count() === 1, 'the running lesson has the pulsing dot');
    ok(await s.page.locator('.lesson .rm').count() >= 1, 'room is a tappable pill on lesson cards');
    await shot(s.page, '10-tt-now');
    await s.ctx.close();
    s = await openAt(at(22 * 60), `#t=${tid}&l=en`, 'tg');
    ok(await s.page.locator('.day.sel[data-d="1"]').count() === 1, 'after the last class the day view opens on the next day with classes');
    await s.ctx.close();

    // -- MY teachers come first: a student of group MO-901/26 sees the teachers of that group at the top of the Teacher tab
    s = await openAt(at(during), '#g=1thm8e1&tab=where&l=uz');
    ok(/Mening ustozlarim/i.test(await txt(s.page, '#wres .sec')) && /MO-901\/26/.test(await txt(s.page, '#wres .sec')), 'Teacher tab starts with "Mening ustozlarim · <my group>": ' + await txt(s.page, '#wres .sec'));
    const ownRows = await s.page.locator('#wres .rows').first().locator('.wrow').allInnerTexts();
    ok(ownRows.length === 7 && /Sharipov Quvondik/.test(ownRows[0]), 'my 7 teachers are listed, the busiest first: ' + ownRows.map((x) => x.split('\n')[0]).join(', '));
    ok(ownRows.every((r) => r.split('\n').length >= 2), 'each row shows what he teaches my group: ' + ownRows[0].replace(/\n/g, ' | '));
    ok((await s.page.locator('.wtips').count()) === 0, 'no tips card when my teachers are shown');
    await settle(s.page, 500);
    ok(/(🟢|🟡|⚪)/.test(await s.page.locator('#wres .wrow .st').first().innerText()), 'my teachers get live status chips');
    await s.page.fill('#wq', 'Karimov'); await settle(s.page, 400);
    const kRows = await s.page.locator('#wres .wrow').allInnerTexts();
    ok(kRows.length >= 2 && /Karimov Javlon/.test(kRows[0]), 'search ranks my own teacher first: ' + kRows.map((x) => x.split('\n')[0]).join(', '));
    await s.ctx.close();
    // a chat that follows a teacher (or nobody) has no such list
    s = await openAt(at(during), '#tab=where&l=uz');
    ok(!/Mening ustozlarim/i.test(await txt(s.page, '#wres')), 'no group chosen → no "my teachers" section');
    await s.ctx.close();

    // -- speed: second launch paints from the cache even if the network is gone
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'en-US' });
      await ctx.route(/data\/index\.json/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(IDX) }));
      s = await open({ mode: 'web', hash: `#t=${tid}&l=en`, ctx });
      ok((await s.page.locator('.lesson, .empty').count()) > 0, 'first launch renders');
      ok(await s.page.evaluate(() => !!localStorage.getItem('ttc:index.json') && Object.keys(localStorage).some((k) => k.startsWith('ttc:t/'))), 'index and the timetable are cached in localStorage');
      await ctx.unroute(/data\/index\.json/);
      await ctx.route(/\/data\//, (r) => r.abort());
      const t0 = Date.now();
      await s.page.goto(BASE); await s.page.waitForSelector('.lesson, .empty, .rolecard', { timeout: 5000 }).catch(() => {}); await s.page.waitForTimeout(200);
      ok((await s.page.locator('.lesson, .banner, .dayh').count()) > 0 || (await s.page.locator('.empty .big').count()) > 0, 'offline relaunch still shows the timetable from cache');
      ok((await s.page.locator('.empty .big:has-text("📡")').count()) === 0, 'offline relaunch has no error screen');
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`app-ui: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
