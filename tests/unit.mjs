// Quick checks for the data builder and message formatting (node tests/unit.mjs)
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { buildAll, pickTimetable, diffLessons, groupId } from '../src/build.mjs';
import { fmtDay, fmtWeek, fmtChanges, weekParity, mondayOf, parseClock, hhmm, fmtTomorrowFull, setSubjects, hasSubject, parseSubject, subjectName, subjHtml } from '../src/shared.mjs';

const raw = JSON.parse(fs.readFileSync(new URL('./fixtures/regulartt-small.json', import.meta.url)));
const viewer = JSON.parse(fs.readFileSync(new URL('./fixtures/ttviewer.json', import.meta.url)));

const tt = pickTimetable(viewer, '2026-09-24');
assert.equal(tt.num, '94');
const out = buildAll(raw, tt);
const mo = Object.values(out.groups).find((g) => g.name === 'MO-901/26');
assert.ok(mo, 'MO-901/26 exists');
assert.equal(mo.fac, 'Menejment fakulteti');
assert.equal(mo.course, '1');
assert.equal(mo.id, groupId('MO-901/26'), 'id is stable and based on the name');
assert.ok(mo.lessons.some((l) => l.w === 'A') && mo.lessons.some((l) => l.w === 'B'), 'A/B weeks parsed');
assert.ok(Object.keys(out.teachers).length > 0 && Object.keys(out.rooms).length > 0);

// diff
const changed = mo.lessons.map((l, i) => (i === 0 ? { ...l, p: l.p + 1 } : l));
const d = diffLessons(mo.lessons, changed);
assert.equal(d.length, 1);
assert.equal(d[0].added.length, 1);
assert.equal(d[0].removed.length, 1);
assert.deepEqual(diffLessons(mo.lessons, mo.lessons), []);

// formatting
const monday = new Date('2026-09-21T00:00:00Z');
const day = fmtDay(mo, out.index, monday, 'uz');
assert.match(day, /Dushanba/);
assert.match(day, /MO-901\/26/);
const week = fmtWeek(mo, out.index, monday, 'en');
assert.match(week, /Weekly timetable/);
assert.ok(week.length < 4096);
assert.match(fmtChanges(mo, out.index, d, 'ru', false), /Расписание изменилось/);

// week parity
assert.equal(weekParity('2026-09-07', new Date('2026-09-09T00:00:00Z')), 'A');
assert.equal(weekParity('2026-09-07', new Date('2026-09-16T00:00:00Z')), 'B');
assert.equal(weekParity(null, monday), null);
// 2026/27 calendar (O'quv yilida haftalar taqsimoti): strictly alternating, upper (Yuqori) week = A starting 31 Aug 2026
{
  const UPPER = ['2026-08-31', '2026-09-14', '2026-09-28', '2026-10-12', '2026-11-09', '2026-12-07', '2027-01-04', '2027-03-29', '2027-06-21', '2027-08-16'];
  const LOWER = ['2026-09-07', '2026-09-21', '2026-10-05', '2026-10-19', '2026-12-28', '2027-01-11', '2027-05-31', '2027-08-23'];
  for (const m of UPPER) for (const off of [0, 3, 5]) assert.equal(weekParity('2026-08-31', new Date(Date.parse(m + 'T00:00:00Z') + off * 864e5)), 'A', m);
  for (const m of LOWER) for (const off of [0, 3, 5]) assert.equal(weekParity('2026-08-31', new Date(Date.parse(m + 'T00:00:00Z') + off * 864e5)), 'B', m);
  // a group that has Yuqori-only and Quyi-only lessons: each week shows just its own, with the upper/lower label
  const idx = { periods: [{ p: 1, start: '08:00', end: '09:20' }, { p: 2, start: '09:30', end: '10:50' }], weekA: '2026-08-31' };
  const g = { id: 'x', name: 'XX-1', kind: 'g', lessons: [
    { d: 0, p: 1, n: 1, s: 'Math (lecture)', t: 'T1', r: '1-101', w: 'A' },
    { d: 0, p: 2, n: 1, s: 'Physics (seminar)', t: 'T2', r: '1-102', w: 'B' },
    { d: 0, p: 1, n: 1, s: 'Always', t: 'T3', r: '1-103', w: '' }] };
  const upper = fmtDay(g, idx, new Date('2026-10-12T00:00:00Z'), 'uz');
  assert.match(upper, /Yuqori hafta/); assert.match(upper, /Math/); assert.doesNotMatch(upper, /Physics/);
  const lower = fmtDay(g, idx, new Date('2026-10-19T00:00:00Z'), 'ru');
  assert.match(lower, /Нижняя неделя/); assert.match(lower, /Physics/); assert.doesNotMatch(lower, /Math/);
  assert.match(fmtWeek(g, idx, new Date('2026-10-12T00:00:00Z'), 'en'), /Upper week/);
}
assert.equal(mondayOf(new Date('2026-09-27T10:00:00Z')).toISOString().slice(0, 10), '2026-09-21');

// reminder time parsing
assert.equal(parseClock('21'), 1260);
assert.equal(parseClock('21:00'), 1260);
assert.equal(parseClock('9.30'), 570);
assert.equal(parseClock(' 20:05 '), 1205);
assert.equal(parseClock('off'), -1);
assert.equal(parseClock('выкл'), -1);
assert.equal(parseClock('24:00'), null);
assert.equal(parseClock('12:75'), null);
assert.equal(parseClock('abc'), null);
assert.equal(hhmm(1260), '21:00');
assert.equal(hhmm(485), '08:05');

// tomorrow's full list: silent on a free day (Sunday), a list otherwise
const sunday = new Date('2026-09-27T00:00:00Z');
assert.equal(fmtTomorrowFull(mo, out.index, sunday, 'uz'), null);
const full = fmtTomorrowFull(mo, out.index, monday, 'ru');
assert.match(full, /Пары на завтра/);
assert.match(full, /MO-901\/26/);

// teachers: lessons list the groups (gr), and the formatters show them
const someT = Object.values(out.teachers).find((t) => t.lessons.some((l) => l.gr));
assert.ok(someT, 'teacher timetables carry the groups (gr)');
const tDay = fmtDay({ ...someT, kind: 't' }, out.index, new Date('2026-09-21T00:00:00Z'), 'uz');
assert.match(tDay, /👤 /);
const tChanged = someT.lessons.map((l, i) => (i === 0 ? { ...l, gr: 'XX-1/26' } : l));
const td = diffLessons(someT.lessons, tChanged);
assert.equal(td.length, 1, 'a changed group list is a change for the teacher');
assert.match(fmtChanges({ ...someT, kind: 't' }, out.index, td, 'uz', false), /Guruhlar o‘zgardi|Guruhlar o'zgardi|👥/);

// subject translations: complete for the whole data set, normalized matching, graceful fallback
const subjects = JSON.parse(fs.readFileSync(new URL('../docs/data/subjects.json', import.meta.url)));
setSubjects(subjects);
assert.equal(subjectName('Audit', 'ru'), 'Аудит');
assert.equal(subjectName('Audit', 'en'), 'Auditing');
assert.equal(subjectName('Audit', 'uz'), 'Audit');
assert.equal(subjectName('AUDIT-2', 'en'), 'Auditing 2', 'matching ignores case, spaces and punctuation');
assert.equal(subjectName('Yangi noma\'lum fan', 'ru'), 'Yangi noma\'lum fan', 'unknown names stay as they are');
assert.deepEqual(parseSubject('Audit (Ma)', 'ru'), { name: 'Аудит', orig: 'Audit', type: 'lecture' });
assert.deepEqual(parseSubject('Audit (Ma)', 'uz'), { name: 'Audit', orig: null, type: 'lecture' });
assert.deepEqual(parseSubject('Yangi noma\'lum fan (Ma)', 'en'), { name: 'Yangi noma\'lum fan', orig: null, type: 'lecture' }, 'no translation -> no duplicate original');
assert.equal(subjHtml(parseSubject('Audit (Ma)', 'en'), true), '<b>Auditing</b> / <i>Audit</i>');
assert.equal(subjHtml(parseSubject('Audit (Ma)', 'uz'), true), '<b>Audit</b>');
const dataDir = new URL('../docs/data/', import.meta.url);
const missing = new Set();
for (const dir of ['g', 't']) {
  for (const f of fs.readdirSync(new URL(dir + '/', dataDir))) {
    for (const l of JSON.parse(fs.readFileSync(new URL(`${dir}/${f}`, dataDir))).lessons) {
      const n = parseSubject(l.s).name;
      if (n && !hasSubject(n)) missing.add(n);
    }
  }
}
assert.equal(missing.size, 0, 'subjects without ru/en translation: ' + [...missing].join(' | '));
for (const [k, v] of Object.entries(subjects)) assert.ok(Array.isArray(v) && v.length === 2 && v[0] && v[1], 'bad entry ' + k);
setSubjects({});

console.log('All unit tests passed ✅');
