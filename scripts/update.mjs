// Downloads the TSUE timetable from EduPage, rebuilds the data files in docs/data,
// and writes .out/changes.json with every group / teacher whose timetable changed.
//
//   node scripts/update.mjs                 (normal run)
//   node scripts/update.mjs --raw file.json  (use a saved regulartt response instead of downloading)

import fs from 'node:fs/promises';
import path from 'node:path';
import { buildAll, diffLessons, pickTimetable, groupId } from '../src/build.mjs';
import { tashkentNow, addDays, ymd, parseSubject, setSubjects, hasSubject } from '../src/shared.mjs';

const BASE = process.env.EDUPAGE_URL || 'https://tsue.edupage.org';
const DATA = path.resolve('docs/data');
const OUT = path.resolve('.out');
// Upper/lower ("Yuqori"/"Quyi") weeks = EduPage weeks "10"/"01" = Week A/B. The university's 2026/2027
// calendar ("O'quv yilida haftalar taqsimoti") alternates strictly every week, starting with the UPPER week
// of 31 Aug 2026 (the first study week), so every Monday an even number of weeks away from it is Week A.
// WEEK_A_MONDAY (a GitHub variable) overrides this, e.g. for the next academic year.
const DEFAULT_WEEK_A = '2026-08-31';
const DEFAULT_WEEK_A_UNTIL = '2027-08-30'; // after the 2026/27 calendar ends we no longer guess
const KEEP_CHANGES = 10;

async function post(func, file, args) {
  const body = JSON.stringify({ __args: args, __gsh: '00000000' });
  // 1) straight to EduPage; 2) if EduPage refuses GitHub's servers, go through our Cloudflare Worker
  const routes = [{ name: 'direct', url: `${BASE}/timetable/server/${file}?__func=${func}`, headers: {} }];
  if (process.env.WORKER_URL && process.env.ADMIN_KEY) {
    routes.push({ name: 'cloudflare', url: `${process.env.WORKER_URL.replace(/\/+$/, '')}/internal/edupage?file=${file}&func=${func}`, headers: { 'X-Admin-Key': process.env.ADMIN_KEY } });
  }
  let lastErr;
  for (let i = 0; i < 6; i++) {
    const route = routes[i % routes.length];
    try {
      const res = await fetch(route.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (TDIU Jadval bot)',
          Referer: `${BASE}/timetable/`,
          ...route.headers,
        },
        body,
        signal: AbortSignal.timeout(route.name === 'direct' ? 25_000 : 90_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      if (!j.r) throw new Error('No data in response');
      console.log(`${func}: ok via ${route.name}`);
      return j;
    } catch (e) {
      lastErr = e;
      console.warn(`${func} via ${route.name} failed: ${e.message}`);
      await new Promise((r) => setTimeout(r, 3000 * (i + 1)));
    }
  }
  throw lastErr;
}

async function readJson(file) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return null; }
}

/** Write only when the content really changed (keeps git history small). */
async function writeIfChanged(file, obj) {
  const text = JSON.stringify(obj);
  let old = null;
  try { old = await fs.readFile(file, 'utf8'); } catch {}
  if (old === text) return false;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, text);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const now = tashkentNow();
  // Use the timetable valid tomorrow (so Sunday evening already sees next week's version)
  const refDate = ymd(addDays(now, 1));

  let viewer, raw;
  const rawIdx = args.indexOf('--raw');
  if (rawIdx >= 0) {
    raw = JSON.parse(await fs.readFile(args[rawIdx + 1], 'utf8'));
    const vIdx = args.indexOf('--viewer');
    viewer = JSON.parse(await fs.readFile(args[vIdx + 1], 'utf8'));
  } else {
    const year = now.getUTCMonth() >= 7 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
    viewer = await post('getTTViewerData', 'ttviewer.js', [null, year]);
    if (!viewer.r?.regular?.timetables?.length) viewer = await post('getTTViewerData', 'ttviewer.js', [null, year + 1]);
  }
  const tt = pickTimetable(viewer, refDate);
  if (!tt) throw new Error('No timetable published on EduPage');
  if (!raw) raw = await post('regularttGetData', 'regulartt.js', [null, tt.num]);

  const weekA = process.env.WEEK_A_MONDAY || (ymd(now) < DEFAULT_WEEK_A_UNTIL ? DEFAULT_WEEK_A : null);
  const built = buildAll(raw, tt, { weekA });
  const ids = Object.keys(built.groups);
  console.log(`Timetable ${tt.num} (${tt.label}): ${ids.length} groups, ${Object.keys(built.teachers).length} teachers, ${Object.keys(built.rooms).length} rooms`);

  // Safety: if EduPage returned a broken/partial file, do nothing instead of spamming alerts.
  const oldIndex = await readJson(path.join(DATA, 'index.json'));
  const oldCount = oldIndex ? oldIndex.faculties.reduce((n, f) => n + f.courses.reduce((m, c) => m + c.groups.length, 0), 0) : 0;
  if (ids.length < Number(process.env.MIN_GROUPS ?? 50) || (oldCount && ids.length < oldCount * 0.5)) {
    throw new Error(`Suspicious data: ${ids.length} groups now vs ${oldCount} before. Skipping this run.`);
  }
  const firstRun = !oldIndex;

  // Subject names without a Russian / English translation are shown in Uzbek until they are added to
  // docs/data/subjects.json — say so in the log so a new subject doesn't go unnoticed.
  const subjects = await readJson(path.join(DATA, 'subjects.json'));
  if (subjects) {
    setSubjects(subjects);
    const missing = new Set();
    for (const e of [...Object.values(built.groups), ...Object.values(built.teachers)]) {
      for (const l of e.lessons) {
        const n = parseSubject(l.s).name;
        if (n && !hasSubject(n)) missing.add(n);
      }
    }
    if (missing.size) console.log(`::warning::${missing.size} subject name(s) have no ru/en translation yet (add them to docs/data/subjects.json): ${[...missing].slice(0, 15).join(' | ')}`);
  }

  const changes = [];
  const nowIso = new Date().toISOString();
  let written = 0;
  for (const id of ids) {
    const g = built.groups[id];
    const file = path.join(DATA, 'g', `${id}.json`);
    const old = await readJson(file);
    let history = old?.changes || [];
    if (old && !firstRun) {
      const days = diffLessons(old.lessons, g.lessons);
      if (days.length) {
        const newTT = old.tt?.num !== tt.num;
        changes.push({ kind: 'g', id, newTT, days });
        history = [{ at: nowIso, newTT, days }, ...history].slice(0, KEEP_CHANGES);
      }
    }
    // keep ~2 weeks of history only
    const cutoff = Date.now() - 14 * 86400000;
    history = history.filter((c) => Date.parse(c.at) > cutoff);
    // v = version of the lessons; changes the weekly picture URL so Telegram doesn't show a cached old one
    const v = groupId(JSON.stringify(g.lessons) + g.tt.num);
    if (await writeIfChanged(file, { ...g, v, changes: history })) written++;
  }
  // Teachers get the same treatment as groups: diff against the previous file so teachers who use the
  // bot are told when their own timetable changes. (No history list in the file — only the alert.)
  for (const [id, t] of Object.entries(built.teachers)) {
    const file = path.join(DATA, 't', `${id}.json`);
    const old = await readJson(file);
    if (old && !firstRun) {
      const days = diffLessons(old.lessons, t.lessons);
      if (days.length) changes.push({ kind: 't', id, newTT: old.tt?.num !== tt.num, days });
    }
    const v = groupId(JSON.stringify(t.lessons) + t.tt.num); // changes the weekly picture URL (Telegram caches by URL)
    if (await writeIfChanged(file, { ...t, v })) written++;
  }
  for (const [id, r] of Object.entries(built.rooms)) if (await writeIfChanged(path.join(DATA, 'r', `${id}.json`), r)) written++;
  await writeIfChanged(path.join(DATA, 'people.json'), built.people);
  await writeIfChanged(path.join(DATA, 'busy.json'), built.busy);
  const indexOut = { ...built.index, changedAt: changes.length || firstRun ? nowIso : oldIndex?.changedAt || nowIso };
  if (await writeIfChanged(path.join(DATA, 'index.json'), indexOut)) written++;

  await fs.mkdir(OUT, { recursive: true });
  await fs.writeFile(path.join(OUT, 'changes.json'), JSON.stringify(changes));
  const nG = changes.filter((c) => c.kind === 'g').length;
  console.log(`${written} files updated, ${nG} groups and ${changes.length - nG} teachers changed${firstRun ? ' (first run: no alerts)' : ''}.`);
  if (process.env.GITHUB_OUTPUT) {
    await fs.appendFile(process.env.GITHUB_OUTPUT, `written=${written}\nchanged=${changes.length}\n`);
  }
}

main().catch(async (e) => {
  console.error(e);
  // EduPage being temporarily unreachable is normal (night maintenance, network blips).
  // Don't mark the run as failed (GitHub would e-mail you every 15 minutes) — just skip this round.
  if (/fetch failed|timeout|ETIMEDOUT|ECONNRESET|HTTP 5\d\d|No data/i.test(String(e?.message) + String(e?.cause?.code))) {
    console.log('::warning::EduPage is not reachable right now — skipped this check, will try again next time.');
    if (process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT, 'written=0\nchanged=0\n');
    process.exit(0);
  }
  process.exit(1);
});
