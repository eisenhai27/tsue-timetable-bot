// Quick checks for the data builder and message formatting (node tests/unit.mjs)
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { buildAll, pickTimetable, diffLessons, groupId } from '../src/build.mjs';
import { fmtDay, fmtWeek, fmtChanges, weekParity, mondayOf } from '../src/shared.mjs';

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
assert.equal(mondayOf(new Date('2026-09-27T10:00:00Z')).toISOString().slice(0, 10), '2026-09-21');

console.log('All unit tests passed ✅');
