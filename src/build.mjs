// Turns raw EduPage timetable data into small per-group files.
// Pure functions only (no Node APIs) so the same code runs in Node and in a browser.

/** Stable short id for a group, based on its name (EduPage internal ids change between timetable versions). */
export function groupId(name) {
  const s = normName(name);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

export function normName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').toUpperCase();
}

const clean = (s) => String(s || '').trim().replace(/\s+/g, ' ');

/** "MENEJMENT FAKULTETI" -> "Menejment fakulteti" (leave mixed-case names alone) */
function prettyFaculty(s) {
  s = clean(s);
  if (s !== s.toUpperCase()) return s;
  const low = s.toLowerCase();
  return low.charAt(0).toUpperCase() + low.slice(1);
}

/** Pick the timetable version that is valid on `dateStr` (YYYY-MM-DD). */
export function pickTimetable(viewer, dateStr) {
  const list = (viewer?.r?.regular?.timetables || []).filter((t) => !t.hidden);
  if (!list.length) return null;
  const sorted = [...list].sort((a, b) => a.datefrom.localeCompare(b.datefrom));
  let chosen = sorted[0];
  for (const t of sorted) if (t.datefrom <= dateStr) chosen = t;
  return { num: String(chosen.tt_num), label: clean(chosen.text), from: chosen.datefrom };
}

function tablesOf(raw) {
  const T = {};
  for (const t of raw?.r?.dbiAccessorRes?.tables || []) T[t.id] = t.data_rows || [];
  return T;
}

/**
 * Build everything.
 * @returns {{ index: object, groups: Record<string, object> }}
 */
export function buildAll(raw, tt, opts = {}) {
  const T = tablesOf(raw);
  const byId = (rows) => Object.fromEntries((rows || []).map((r) => [r.id, r]));
  const subjects = byId(T.subjects);
  const teachers = byId(T.teachers);
  const rooms = byId(T.classrooms);
  const sgroups = byId(T.groups);
  const lessonsById = byId(T.lessons);

  const periods = (T.periods || [])
    .map((p) => ({ p: Number(p.period), start: p.starttime, end: p.endtime }))
    .filter((p) => p.p > 0)
    .sort((a, b) => a.p - b.p);
  const periodNums = new Set(periods.map((p) => p.p));

  // 1) Walk the class list in order: headers (faculty / "N KURS" / "-") structure the real groups.
  const faculties = [];
  const facByKey = {};
  const openFaculty = (rawName) => {
    const name = prettyFaculty(rawName);
    const key = name.toLowerCase();
    if (!facByKey[key]) { facByKey[key] = { name, courses: [] }; faculties.push(facByKey[key]); }
    return facByKey[key];
  };
  const classInfo = {}; // edupage class id -> { id, name, fac, course }
  const usedIds = new Set();
  const yy = Number(String(tt?.from || '').slice(2, 4)) || null; // "2026-09-07" -> 26 (this year's first-year intake)
  const classes = (T.classes || []).map((c) => ({ id: c.id, name: clean(c.name) })).filter((c) => c.name && !/^-+$/.test(c.name));
  const KURS = /^(.*?)\s*(\d)\s*[-.]?\s*(KURS|КУРС)\s*$/i;
  let fac = null;
  let course = null;
  for (let i = 0; i < classes.length; i++) {
    const { name } = classes[i];
    const kurs = name.match(KURS);
    if (kurs) {
      // "2 KURS", "1-kurs", or with a prefix like "KECHKI 1 KURS" / "SIRTQI 4-KURS" (prefix = new section)
      if (kurs[1] && !/\d/.test(kurs[1])) fac = openFaculty(kurs[1]);
      if (!fac) fac = openFaculty('Boshqa');
      course = { name: kurs[2], groups: [] };
      fac.courses.push(course);
      continue;
    }
    if (!/\d/.test(name)) {
      // Header without digits = faculty. Exception: a label such as "KREMS" that sits inside a
      // faculty and is followed by "2 KURS" (not "1 KURS") — keep the current faculty then.
      const next = classes[i + 1]?.name.match(KURS);
      if (fac && next && !next[1] && next[2] !== '1') continue;
      fac = openFaculty(name);
      course = null;
      continue;
    }
    if (!fac) fac = openFaculty('Boshqa');
    if (!course) {
      // No "N KURS" header yet: guess the year from the intake suffix (…/26 → 1st year when the timetable is from 2026)
      const m = name.match(/[\/-]\s*(\d{2})\D*$/);
      const guess = m && yy ? yy - Number(m[1]) + 1 : null;
      course = { name: guess >= 1 && guess <= 5 ? String(guess) : '', groups: [] };
      fac.courses.push(course);
    }
    let id = groupId(name);
    while (usedIds.has(id)) id = id + 'x';
    usedIds.add(id);
    const info = { id, name, fac: fac.name, course: course.name };
    classInfo[classes[i].id] = info;
    course.groups.push(info);
  }

  // 2) Lessons per group, per teacher and per room
  const perGroup = {};
  const perTeacher = {}; // teacher name -> lessons
  const perRoom = {}; // room name -> lessons
  for (const card of T.cards || []) {
    const lesson = lessonsById[card.lessonid];
    if (!lesson) continue;
    const p = Number(card.period);
    if (!periodNums.has(p)) continue;
    const days = [];
    for (let i = 0; i < (card.days || '').length; i++) if (card.days[i] === '1') days.push(i);
    if (!days.length) continue;
    const w = card.weeks === '10' ? 'A' : card.weeks === '01' ? 'B' : '';
    const subj = subjects[lesson.subjectid];
    const s = clean(subj?.name || subj?.short || '?');
    const t = (lesson.teacherids || [])
      .map((id) => clean(teachers[id]?.name || teachers[id]?.short))
      .filter((x) => x && !/^[-\s]+$/.test(x))
      .join(', ');
    const r = (card.classroomids || [])
      .map((id) => clean(rooms[id]?.name || rooms[id]?.short))
      .filter((x) => x && !/^[-\s]+$/.test(x))
      .join(', ');
    const n = Math.max(1, Number(lesson.durationperiods) || 1);
    const gnames = (lesson.classids || []).map((cid) => classInfo[cid]?.name).filter(Boolean).join(', ');
    if (gnames) {
      const teacherList = t ? t.split(', ') : [];
      const roomList = r ? r.split(', ') : [];
      for (const d of days) {
        for (const tn of teacherList) {
          const rec = { d, p, n, s, r, gr: gnames };
          if (w) rec.w = w;
          (perTeacher[tn] ||= []).push(rec);
        }
        for (const rn of roomList) {
          const rec = { d, p, n, s, t, gr: gnames };
          if (w) rec.w = w;
          (perRoom[rn] ||= []).push(rec);
        }
      }
    }
    for (const cid of lesson.classids || []) {
      const info = classInfo[cid];
      if (!info) continue;
      const sub = (lesson.groupids || [])
        .map((gid) => sgroups[gid])
        .filter((g) => g && g.classid === cid && !g.entireclass)
        .map((g) => clean(g.name))
        .join(', ');
      const list = (perGroup[info.id] ||= []);
      for (const d of days) {
        const rec = { d, p, n, s, t, r };
        if (sub) rec.g = sub;
        if (w) rec.w = w;
        list.push(rec);
      }
    }
  }

  // 3) Output
  const groups = {};
  const outFaculties = [];
  for (const f of faculties) {
    const courses = [];
    for (const c of f.courses) {
      const gs = [];
      for (const g of c.groups) {
        const lessons = dedupe(perGroup[g.id] || []);
        if (!lessons.length && !opts.keepEmpty) continue;
        groups[g.id] = { id: g.id, name: g.name, fac: g.fac, course: g.course, tt, lessons };
        gs.push([g.id, g.name]);
      }
      if (gs.length) courses.push({ name: c.name, groups: gs });
    }
    if (courses.length) {
      // merge courses with the same name inside one faculty
      const merged = [];
      for (const c of courses) {
        const m = merged.find((x) => x.name === c.name);
        if (m) m.groups.push(...c.groups); else merged.push(c);
      }
      merged.sort((a, b) => (a.name || '9').localeCompare(b.name || '9'));
      outFaculties.push({ name: f.name, courses: merged });
    }
  }

  // Teachers and rooms: one file each, plus a list for search
  const teachersOut = {};
  const teacherList = [];
  for (const [name, list] of Object.entries(perTeacher)) {
    const id = 't' + groupId(name);
    teachersOut[id] = { id, name, tt, lessons: dedupe(list) };
    teacherList.push([id, name]);
  }
  const roomsOut = {};
  const roomList = [];
  const roomNames = Object.keys(perRoom);
  // include rooms that never have lessons (they are always free)
  for (const rr of T.classrooms || []) {
    const nm = clean(rr.name || rr.short);
    if (nm && !/^[-\s]+$/.test(nm) && !perRoom[nm]) roomNames.push(nm);
  }
  for (const name of roomNames) {
    const id = 'r' + groupId(name);
    if (roomsOut[id]) continue;
    roomsOut[id] = { id, name, tt, lessons: dedupe(perRoom[name] || []) };
    roomList.push([id, name]);
  }
  teacherList.sort((a, b) => a[1].localeCompare(b[1]));
  roomList.sort((a, b) => a[1].localeCompare(b[1], undefined, { numeric: true }));

  // Busy map for the "free rooms" finder: roomId -> ["d.p.w", ...]
  const busy = {};
  for (const [id, room] of Object.entries(roomsOut)) {
    const slots = new Set();
    for (const l of room.lessons) for (let k = 0; k < l.n; k++) slots.add(`${l.d}.${l.p + k}${l.w || ''}`);
    busy[id] = [...slots];
  }

  const index = {
    v: 1,
    tt,
    periods,
    weekA: opts.weekA || null,
    faculties: outFaculties,
  };
  const people = { tt, teachers: teacherList, rooms: roomList };
  return { index, groups, teachers: teachersOut, rooms: roomsOut, people, busy: { tt, rooms: busy } };
}

export function lessonKey(l) {
  return [l.d, l.p, l.w || '', l.g || '', l.s, l.t, l.r, l.n].join('|');
}

function dedupe(list) {
  const seen = new Set();
  const out = [];
  for (const l of list) {
    const k = lessonKey(l);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(l);
  }
  return out.sort((a, b) => a.d - b.d || a.p - b.p || (a.w || '').localeCompare(b.w || '') || (a.g || '').localeCompare(b.g || ''));
}

/** Compare old vs new lessons of one group. Returns [] if nothing changed. */
export function diffLessons(oldList, newList) {
  const oldK = new Map((oldList || []).map((l) => [lessonKey(l), l]));
  const newK = new Map((newList || []).map((l) => [lessonKey(l), l]));
  const byDay = {};
  for (const [k, l] of oldK) if (!newK.has(k)) (byDay[l.d] ||= { d: l.d, added: [], removed: [] }).removed.push(l);
  for (const [k, l] of newK) if (!oldK.has(k)) (byDay[l.d] ||= { d: l.d, added: [], removed: [] }).added.push(l);
  return Object.values(byDay).sort((a, b) => a.d - b.d);
}
