// Quick checks for the data builder and message formatting (node tests/unit.mjs)
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { buildAll, pickTimetable, diffLessons, groupId } from '../src/build.mjs';
import { fmtDay, fmtWeek, fmtChanges, weekParity, mondayOf, parseClock, hhmm, fmtTomorrowFull, setSubjects, hasSubject, parseSubject, subjectName, subjHtml, whereIs, fmtWhere, words, displayMonday, weekImgPath, tashkentNow } from '../src/shared.mjs';
import { renderSvg } from '../scripts/render.mjs';

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

// "Where is the teacher?"
{
  const P = [[1, '08:00', '09:20'], [2, '09:30', '10:50'], [3, '11:00', '12:20'], [4, '13:00', '14:20'], [5, '14:30', '15:50'], [6, '16:00', '17:20'], [7, '17:30', '18:50'], [8, '19:00', '20:20']].map(([p, start, end]) => ({ p, start, end }));
  const idx = { periods: P, weekA: '2026-08-31' };
  const t = { id: 't1', name: 'Karimov Dilshod', kind: 't', lessons: [
    { d: 0, p: 2, n: 1, s: 'Iqtisodiyot (Ma)', r: '8-310-30', gr: 'MO-901/26, MO-902/26' },
    { d: 0, p: 5, n: 1, s: 'Statistika (Sem)', r: '4-210-30', gr: 'MO-905/26', w: 'A' },
    { d: 0, p: 5, n: 1, s: 'Statistika (Sem)', r: '5-101-30', gr: 'MO-905/26', w: 'B' },
    { d: 2, p: 1, n: 2, s: 'Audit (Lab)', r: '7/415-30', gr: 'T-25' },
  ] };
  const at = (iso) => new Date(iso + ':00Z'); // "local date": UTC fields carry Tashkent wall time
  const up = '2026-10-12', low = '2026-10-19'; // Monday of an upper (A) / a lower (B) week
  let w = whereIs(t, idx, at(`${up}T09:00`));
  assert.equal(w.state, 'before'); assert.equal(w.next.today, true); assert.equal(hhmm(w.next.items[0].from), '09:30'); assert.equal(w.inMin, 30);
  w = whereIs(t, idx, at(`${up}T10:00`));
  assert.equal(w.state, 'now'); assert.equal(w.cur[0].l.r, '8-310-30'); assert.equal(w.left, 50); assert.equal(w.until, 650);
  w = whereIs(t, idx, at(`${up}T11:30`));
  assert.equal(w.state, 'between'); assert.equal(w.next.items[0].l.r, '4-210-30'); // the upper-week seminar
  w = whereIs(t, idx, at(`${low}T11:30`));
  assert.equal(w.state, 'between'); assert.equal(w.next.items[0].l.r, '5-101-30'); // …and the lower-week one
  w = whereIs(t, idx, at(`${up}T14:40`)); assert.equal(w.state, 'now'); assert.equal(w.cur[0].l.r, '4-210-30');
  w = whereIs(t, idx, at(`${low}T14:40`)); assert.equal(w.state, 'now'); assert.equal(w.cur[0].l.r, '5-101-30');
  w = whereIs(t, idx, at(`${up}T18:00`));
  assert.equal(w.state, 'after'); assert.equal(w.next.today, false); assert.equal(weekday2(w.next.date), 2); // next: Wednesday
  w = whereIs(t, idx, at('2026-10-14T09:00'));
  assert.equal(w.state, 'now'); assert.equal(w.until, 650); assert.equal(w.left, 110); // a double period runs to the end of the second
  w = whereIs(t, idx, at('2026-10-11T12:00'));
  assert.equal(w.state, 'off'); assert.equal(w.next.today, false); assert.equal(hhmm(w.next.items[0].from), '09:30');
  assert.equal(whereIs({ lessons: [] }, idx, at(`${up}T12:00`)).next, null);
  // message: status, room card, next class, plan, in every language
  const m1 = fmtWhere(t, idx, at(`${up}T10:00`), 'uz');
  for (const re of [/Karimov Dilshod/, /Hozir darsda/, /8-bino, 310-xona/, /Iqtisodiyot/, /MO-901\/26, MO-902\/26/, /11:30 gacha|10:50 gacha/, /50 daqiqa qoldi/, /Keyingi dars/, /Bugungi tartib/]) assert.match(m1, re);
  assert.match(fmtWhere(t, idx, at(`${up}T10:00`), 'ru'), /Сейчас на паре[\s\S]*корпус 8, ауд\. 310[\s\S]*осталось 50 мин/);
  assert.match(fmtWhere(t, idx, at(`${up}T10:00`), 'en'), /In class right now[\s\S]*Building 8, Room 310[\s\S]*50 min left/);
  assert.match(fmtWhere(t, idx, at('2026-10-13T12:00'), 'uz'), /Bugun dars yo'q[\s\S]*Ertaga, 08:00/); // Tuesday: nothing today, Wednesday is "tomorrow"
  assert.match(fmtWhere(t, idx, at(`${up}T09:00`), 'uz'), /7 soatdan so'ng|30 daqiqadan so'ng/);
  assert.equal(words('uz').h(65), '1 soat 5 daqiqa'); assert.equal(words('ru').h(125), '2 ч 5 мин'); assert.equal(words('en').h(45), '45 min');
  assert.ok(fmtWhere(t, idx, at(`${up}T10:00`), 'uz').length < 4000);
  // the day message uses quote blocks and keeps its quote tags balanced
  const dm1 = fmtDay(t, idx, at(`${up}T10:00`), 'uz', at(`${up}T10:00`));
  assert.equal((dm1.match(/<blockquote>/g) || []).length, (dm1.match(/<\/blockquote>/g) || []).length);
  assert.match(dm1, /🟦 <b>09:30 – 10:50<\/b>[\s\S]*🟢 Hozir/);
}
function weekday2(d) { return (d.getUTCDay() + 6) % 7; }

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

// ---- weekly picture: language, week type, paths, the Sunday switch
{
  assert.equal(weekImgPath('g', 'abc', 'uz'), 'img/g/abc.png', 'Uzbek picture keeps its original address');
  assert.equal(weekImgPath('g', 'abc', 'ru'), 'img/ru/g/abc.png');
  assert.equal(weekImgPath('t', 'xyz', 'en'), 'img/en/t/xyz.png');
  assert.equal(weekImgPath('t', 'xyz', 'de'), 'img/t/xyz.png', 'unknown language → Uzbek');
  // Tashkent time: Saturday 23:30 still shows this week, Sunday already shows the coming one
  const at = (iso) => tashkentNow(Date.parse(iso));
  assert.equal(displayMonday(at('2026-10-10T18:30:00Z')).toISOString().slice(0, 10), '2026-10-05', 'Saturday 23:30 → this week');
  assert.equal(displayMonday(at('2026-10-10T19:30:00Z')).toISOString().slice(0, 10), '2026-10-12', 'Sunday 00:30 → coming week');
  assert.equal(displayMonday(at('2026-10-11T12:00:00Z')).toISOString().slice(0, 10), '2026-10-12', 'Sunday noon → coming week');
  assert.equal(displayMonday(at('2026-10-12T00:00:00Z')).toISOString().slice(0, 10), '2026-10-12', 'Monday → this week');

  const idx = { periods: [{ p: 1, start: '08:00', end: '09:20' }, { p: 2, start: '09:30', end: '10:50' }], weekA: '2026-08-31' };
  const L = (o) => ({ d: 0, p: 1, n: 1, s: 'Hisob (Ma)', t: 'Aliyev Vali', r: '8-101', ...o });
  const grp = { name: 'T-1', id: 'x', fac: 'Fakultet', course: '1', tt: { label: 'test' }, lessons: [L({ w: 'A' }), L({ w: 'B', s: 'Fizika (Ma)' }), L({ d: 1, p: 2, s: 'Til' })] };
  const PURPLE = '#8E24AA';
  const upper = renderSvg(grp, idx, null, { lang: 'uz', parity: 'A', monday: new Date('2026-10-12T00:00:00Z') });
  assert.ok(upper.includes(PURPLE), "this week's lessons get their own colour");
  assert.match(upper, /fill="#8E24AA"\/>\s*<path[^>]*fill="#FFFFFF"\/>\s*<text[^>]*>Yuqori hafta<\/text>/, 'week switch: the upper-week pill is the filled one');
  assert.match(upper, />Quyi hafta<\/text>/, 'week switch also shows the other (lower) week');
  assert.match(upper, /12\.10 – 17\.10/, 'date range of the week');
  assert.match(upper, /Haftalik dars jadvali/);
  assert.match(upper, /shu haftadagi darslar/, 'legend');
  assert.match(upper, />Fizika<\/text>/, "the other week's lesson is a faded strip");
  assert.match(upper, /<text[^>]*>QUYI<\/text>/, "…with a ▼ QUYI chip");
  assert.match(upper, /<text[^>]*>YUQORI<\/text>/, 'this week’s alternating lesson carries a ▲ YUQORI chip');
  assert.ok(/<g opacity="0\.55">/.test(upper), "the other week's lesson is faded");
  // lower week: the roles swap
  const lower = renderSvg(grp, idx, null, { lang: 'uz', parity: 'B' });
  assert.match(lower, /fill="#8E24AA"\/>\s*<path[^>]*fill="#FFFFFF"\/>\s*<text[^>]*>Quyi hafta<\/text>/, 'lower week: the lower-week pill is the filled one');
  assert.match(lower, />Hisob<\/text>/);
  assert.match(lower, /<text[^>]*>YUQORI<\/text>/);
  // unknown week type → no highlight, no badge, no legend (both kinds are shown with a tag)
  const none = renderSvg(grp, idx, null, { lang: 'uz', parity: null });
  assert.ok(!none.includes(PURPLE) && !/Yuqori hafta<\/text>/.test(none) && !/shu haftadagi/.test(none), 'unknown week type → plain picture');
  // Russian / English: the words of the picture are translated
  setSubjects({ 'Hisob': ['Математический анализ', 'Calculus'] });
  const ru = renderSvg(grp, idx, null, { lang: 'ru', parity: 'A' });
  assert.match(ru, />Верхняя неделя</); assert.match(ru, />Нижняя неделя</); assert.match(ru, /Расписание на неделю/); assert.match(ru, /Понедельник/); assert.match(ru, /Математический анализ/); assert.match(ru, /1 пара/);
  assert.ok(!/Dushanba|para<|YUQORI/.test(ru), 'no Uzbek chrome in the Russian picture');
  const en = renderSvg(grp, idx, null, { lang: 'en', parity: 'B' });
  assert.match(en, />Lower week</); assert.match(en, />Upper week</); assert.match(en, /Weekly timetable/); assert.match(en, /Monday/); assert.match(en, /Period 1/); assert.match(en, /this week’s classes/);
  assert.ok(!/Dushanba|para<|Quyi hafta/.test(en), 'no Uzbek chrome in the English picture');
  setSubjects({});
}

// ---- the class list structure (faculty / course / group headers as EduPage has them): every group must be reachable
{
  // [name, hasLesson] in EduPage order — modelled on the real TSUE list, including its awkward headers
  const list = [
    ['MENEJMENT FAKULTETI', 0], ['1 KURS', 0], ['MO-900/26', 1], ['MO-901/26', 0], ['-', 0], ['KREMS', 0], ['2 KURS', 0], ['MO-80/25', 1], ['4 KURS', 0], ['MO-25/23r', 1],
    ['MASOFAVIY FAKULTETI', 0], ['1 KURS', 0], ['MIQT-900/26', 1], ['4 KURS', 0], ['MIQT-75/23', 1],
    ['2-OT', 0], ['2-kurs', 0], ['I-900-2/26', 1], ['3-kurs', 0], ['I-80-2/25', 0],
    ['DAVLAT AUDITI (3+1) QO\'SHMA TA\'LIM', 0], ['DA-450/26', 0], ['Magistratura', 0], ['DAMN-15', 1], ['12', 0],
    ['KECHKI 1 KURS', 0], ['KI-900/26', 1], ['5 KURS', 0], ['KBIA-70/22', 0], ['SIRTQI 4-KURS', 0], ['SI-60/23', 1], ['инф-1', 1],
  ];
  const classes = list.map(([name], i) => ({ id: 'c' + i, name }));
  const cards = [];
  const lessons = [];
  list.forEach(([, has], i) => { if (has) { lessons.push({ id: 'l' + i, classids: ['c' + i], subjectid: 's1', teacherids: [], durationperiods: 1 }); cards.push({ lessonid: 'l' + i, period: '1', days: '10000', weeks: '11', classroomids: [] }); } });
  const synth = { r: { dbiAccessorRes: { tables: [
    { id: 'classes', data_rows: classes }, { id: 'lessons', data_rows: lessons }, { id: 'cards', data_rows: cards },
    { id: 'subjects', data_rows: [{ id: 's1', name: 'Math' }] }, { id: 'periods', data_rows: [{ period: '1', starttime: '08:00', endtime: '09:20' }] },
  ] } } };
  const b = buildAll(synth, { num: '1', from: '2026-09-07' });
  const facs = Object.fromEntries(b.index.faculties.map((f) => [f.name, f]));
  const courseNames = (f) => f.courses.map((c) => c.name || '-').join(',');
  const all = b.index.faculties.flatMap((f) => f.courses.flatMap((c) => c.groups.map((g) => g[1])));
  const groupNames = list.filter(([n, has]) => has || /^[A-Za-zА-Яа-я]+-/.test(n) && n !== '-' ).map(([n]) => n).filter((n) => !/KURS|kurs/i.test(n));
  for (const n of groupNames) assert.ok(all.includes(n), `group ${n} is listed`);
  assert.equal(all.length, groupNames.length, 'nothing but real groups is listed');
  assert.deepEqual(b.index.faculties.map((f) => f.name), ['Menejment fakulteti', 'Masofaviy fakulteti', '2-OT', "Davlat auditi (3+1) qo'shma ta'lim", 'Magistratura', 'Kechki', 'Sirtqi'].filter((n) => facs[n]), 'faculty order');
  assert.equal(courseNames(facs['Menejment fakulteti']), '1,2,4', '"KREMS" inside a faculty does not split it');
  assert.equal(facs['Menejment fakulteti'].courses[0].groups.length, 2, 'a group without lessons (MO-901/26) is still listed');
  assert.deepEqual(facs['Menejment fakulteti'].courses[0].groups[1], [groupId('MO-901/26'), 'MO-901/26', 0], 'and marked as "no lessons yet"');
  assert.ok(facs['2-OT'] && courseNames(facs['2-OT']) === '2,3', '"2-OT" followed by "2-kurs" is its own faculty (the course numbers restart), not part of the previous one');
  assert.equal(courseNames(facs['Masofaviy fakulteti']), '1,4', 'so Masofaviy keeps only its own courses');
  assert.ok(facs["Davlat auditi (3+1) qo'shma ta'lim"]?.courses[0].groups.some((g) => g[1] === 'DA-450/26'), '"DAVLAT AUDITI (3+1)…" is a header, not a group of the section before it');
  assert.ok(!facs['12'], 'a stray number is no faculty');
  assert.equal(courseNames(facs['Kechki']), '1,5', 'a course whose groups all have no lessons yet is still there (Kechki 5-kurs)');
  assert.equal(courseNames(facs['Sirtqi']), '4');
  assert.equal(b.groups[groupId('MO-901/26')].lessons.length, 0, 'the empty group has a file, with no lessons');
  assert.match(fmtDay(b.groups[groupId('MO-901/26')], b.index, new Date('2026-09-21T00:00:00Z'), 'uz'), /hali EduPage'da kiritilmagan/, 'and the day view says the timetable is not entered yet (not "no classes 🎉")');
  assert.match(fmtWeek(b.groups[groupId('MO-901/26')], b.index, new Date('2026-09-21T00:00:00Z'), 'ru'), /ещё не внесено/);
  assert.ok(facs['Sirtqi'].courses[0].groups.some((g) => g[1] === 'инф-1'), 'a Cyrillic group code is recognised as a group too');
  assert.ok(buildAll(synth, { num: '1', from: '2026-09-07' }, { keepEmpty: false }).index.faculties.flatMap((f) => f.courses.flatMap((c) => c.groups)).every((g) => g[2] !== 0), 'keepEmpty:false restores the old behaviour');
}

console.log('All unit tests passed ✅');
