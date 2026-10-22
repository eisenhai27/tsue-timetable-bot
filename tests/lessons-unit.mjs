// Lesson reminders: slots, "continues the previous class", "stays in the room", joke picking rules and the joke list itself.
import fs from 'node:fs';
import { JOKES, SUBJECT_JOKES } from '../src/jokes.mjs';
import { daySlots, continuesPrevious, staysInRoom, pickReminderJoke, pickDayEndJoke, fmtLessonReminder, fmtDayEnd, nextJoke, jokeList, jokeText, isTeacherKey, jokeHtml, entitiesToHtml, paragraphs, lessonRunPlan, clock, jokePool } from '../src/lessons.mjs';
import { LANGS } from '../src/shared.mjs';

let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? '✅' : '❌') + ' ' + name); if (!cond) { fails++; if (extra !== undefined) console.log(JSON.stringify(extra, null, 1).slice(0, 1200)); } };

// ---- the joke list
const all = [...Object.values(JOKES).flat(), ...SUBJECT_JOKES.flatMap((s) => s.list)];
check(`every joke exists in all three languages (${all.length} jokes)`, all.every((e) => LANGS.every((l) => typeof e[l] === 'string' && e[l].trim().length > 5)));
check('no "juftlik" — the word is "para" / "dars"', all.every((e) => !/juftlik/i.test(e.uz)));
check('nothing longer than a few lines', all.every((e) => LANGS.every((l) => e[l].length < 200)));
check('the window lines are marked (lecture halls often have none)', JOKES.stay.filter((e) => /deraza/i.test(e.uz)).every((e) => e.win));

// ---- slots
const index = JSON.parse(fs.readFileSync(new URL('../docs/data/index.json', import.meta.url)));
const P = (p) => index.periods.find((x) => x.p === p);
const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const g = { lessons: [
  { d: 0, p: 1, n: 1, s: 'Statistika (Ma)', t: 'Karimov A', r: '8-214-60' },
  { d: 0, p: 2, n: 1, s: 'Statistika (Ma)', t: 'Karimov A', r: '8-214-60' },
  { d: 0, p: 3, n: 1, s: 'Moliya (Sem)', t: 'Aliyeva B', r: '8-214-60', g: '1' },
  { d: 0, p: 3, n: 1, s: 'Moliya (Sem)', t: 'Aliyeva B', r: '8-215-30', g: '2' },
  { d: 0, p: 5, n: 1, s: 'Marketing (Lab)', t: 'Toshev C', r: '3-101' },
] };
const monday = new Date('2026-10-19T00:00:00Z'); // a Monday
const slots = daySlots(g, { ...index, weekA: null }, monday);
check('lessons become time slots; two subgroups at the same time are one slot', slots.length === 4 && slots[2].lessons.length === 2 && slots[0].start === toMin(P(1).start), slots.map((s) => [s.start, s.lessons.length]));
check('the same subject, teacher and room right after → continues (no second reminder)', continuesPrevious(slots[0], slots[1]));
check('…a different subject does not', !continuesPrevious(slots[1], slots[2]));
check('same room back to back → stays', staysInRoom(slots[0], slots[1]));
check('different rooms → does not stay', !staysInRoom(slots[1], slots[2]));
check('a class after a long gap never "stays"', !staysInRoom(slots[2], slots[3]));

// ---- joke picking: random, but only from the right lists
const ctx = (o) => ({ teacher: false, type: 'seminar', first: false, last: false, start: 11 * 60, wd: 1, stay: false, lecture: false, subject: 'Moliya', ...o });
const N = 3000;
let windowLeak = false, stayAlways = true, winSeen = false;
for (let i = 0; i < N; i++) {
  const p = pickReminderJoke(ctx({ stay: true, lecture: true, type: 'lecture' }));
  if (p.key !== 'stay') stayAlways = false;
  if (p.entry.win) windowLeak = true;
  if (pickReminderJoke(ctx({ stay: true })).entry.win) winSeen = true;
}
check('staying in the room → a "stay" line', stayAlways);
check('…never a window line in a lecture', !windowLeak);
check('…but window lines do appear in seminars', winSeen);
// every combination of situations: a teacher only ever gets teacher lines, a student never does
let mixT = [], mixS = [];
for (let i = 0; i < N; i++) {
  const c = { type: ['lecture', 'seminar', 'lab', 'practice', null][i % 5], first: i % 2 === 0, last: i % 3 === 0, start: [480, 570, 660, 780, 870][i % 5], wd: i % 6, stay: i % 4 === 0, lecture: i % 5 === 0, subject: ['Statistika', 'Moliya', 'Marketing', 'X'][i % 4] };
  const t = pickReminderJoke(ctx({ ...c, teacher: true })), s = pickReminderJoke(ctx({ ...c, teacher: false }));
  const te = pickDayEndJoke({ teacher: true, wd: c.wd }), se = pickDayEndJoke({ teacher: false, wd: c.wd });
  if (!isTeacherKey(t.key) || !isTeacherKey(te.key)) mixT.push(t.key, te.key);
  if (isTeacherKey(s.key) || isTeacherKey(se.key)) mixS.push(s.key, se.key);
  if (!t.entry || !s.entry || !te.entry || !se.entry) mixT.push('EMPTY');
}
check('a teacher never gets a student line (before class or at the end of the day)', !mixT.length, [...new Set(mixT)]);
check('a student never gets a teacher line', !mixS.length, [...new Set(mixS)]);
check('there is always a line (no empty pick in any situation)', !mixT.includes('EMPTY'));
const tLines = new Set(Object.entries(JOKES).filter(([k]) => isTeacherKey(k)).flatMap(([, v]) => v.map((e) => e.uz)));
const sLines = new Set([...Object.entries(JOKES).filter(([k]) => !isTeacherKey(k)).flatMap(([, v]) => v.map((e) => e.uz)), ...SUBJECT_JOKES.flatMap((x) => x.list.map((e) => e.uz))]);
check('no line sits in both a teacher list and a student list', [...tLines].every((t) => !sLines.has(t)));
let thanks = 0;
for (let i = 0; i < N; i++) if (pickDayEndJoke({ teacher: true, wd: 1 }).key.startsWith('t_thanks')) thanks++;
check(`teachers: about 60% of end-of-day messages are thank-yous (${Math.round(thanks / N * 100)}%)`, thanks / N > 0.55 && thanks / N < 0.65);
let subj = 0;
for (let i = 0; i < N; i++) if (/^sub/.test(pickReminderJoke(ctx({ subject: 'Statistika 1' })).key)) subj++;
check(`a subject joke comes now and then (about every third time: ${Math.round(subj / N * 100)}%)`, subj / N > 0.28 && subj / N < 0.39);
const seen = new Set();
for (let i = 0; i < 40; i++) seen.add(jokeText(pickReminderJoke(ctx({ type: null, subject: 'X' })).entry, 'uz'));
check(`random: 40 reminders in a row bring many different lines (${seen.size})`, seen.size >= 15);
check('"another one" never repeats the line shown', (() => { const cur = jokeText(JOKES.s_any[0], 'ru'); for (let i = 0; i < 50; i++) if (nextJoke('s_any', cur, 'ru') === cur) return false; return true; })());
check('"another one" stays in the same list (teacher thanks → teacher thanks)', (() => { const cur = jokeText(JOKES.t_thanks[0], 'uz'); for (let i = 0; i < 50; i++) { const n = nextJoke('t_thanks', cur, 'uz'); if (!JOKES.t_thanks.some((e) => e.uz === n)) return false; } return true; })());
check('"another one" on a one-line list (Monday) still brings a different line, from the student lists', (() => { const cur = jokeText(JOKES.s_mon[0], 'uz'); for (let i = 0; i < 30; i++) { const n = nextJoke('s_mon', cur, 'uz'); if (n === cur || !jokePool('s_mon').some((e) => e.uz === n)) return false; } return jokePool('s_mon').every((e) => !JOKES.t_start.includes(e)); })());
check('…and a short teacher list widens only into teacher lines', ['t_fri', 't_sat', 't_wish', 't_thanks_fri'].every((k) => jokePool(k).every((e) => Object.entries(JOKES).some(([kk, v]) => isTeacherKey(kk) && v.includes(e)))));
check('joke keys resolve (categories and subjects)', jokeList('s_any') && jokeList('sub0') && !jokeList('nope') && !jokeList('constructor'));

// ---- texts (HTML)
const t1 = fmtLessonReminder(slots[1], 'uz', { teacher: false, stay: true, minutes: 10, joke: 'J <x>', intro: true });
check('student reminder: minutes, subject + type, teacher, room in BOLD (+ "stays"), time', /10 daqiqadan keyin/.test(t1) && /Statistika · ma'ruza/i.test(t1) && /👨‍🏫 Karimov A/.test(t1) && /🚪 <b>8-bino, 214-xona<\/b> · Shu xonada qolasiz/.test(t1) && /🕘 09:30–10:50/.test(t1), t1);
check('…the joke as a quote (escaped), then the first-time intro', /\n\n<blockquote>(<[biuc][a-z]*>)*J &lt;x&gt;(<\/[biuc][a-z]*>)*<\/blockquote>\n\n🆕/.test(t1), t1);
const styles = new Set();
for (let i = 0; i < 200; i++) styles.add(jokeHtml('J').replace('J', ''));
check(`the joke's type style changes from time to time (${styles.size} styles)`, styles.size >= 5, [...styles]);
const t2 = fmtLessonReminder(slots[2], 'en', { teacher: false, minutes: 9, joke: 'J' });
check('two subgroups in one reminder, each with its room in bold', (t2.match(/📘/g) || []).length === 2 && /\(1\)/.test(t2) && /\(2\)/.test(t2) && (t2.match(/🚪 <b>/g) || []).length === 2, t2);
const t3 = fmtLessonReminder({ start: 600, end: 680, lessons: [{ s: 'Moliya (Ma)', r: '8-311-30', gr: 'KBIA-80/25' }] }, 'ru', { teacher: true, minutes: 10, joke: 'J' });
check('teacher reminder shows the group, not a teacher', /👥 KBIA-80\/25/.test(t3) && !/👨‍🏫/.test(t3) && /Через 10 мин/.test(t3), t3);
check('end-of-day text: header + the line as a quote', /^✅ Bugungi darslar tugadi!\n\n<blockquote>/.test(fmtDayEnd('uz', false, 'J')) && /darslaringiz/.test(fmtDayEnd('uz', true, 'J')));

// ---- editing in place: Telegram's text + entities back to HTML
const plain = '⏰ 10 daqiqadan keyin dars\n\n🚪 8-bino, 214-xona\n\nKulgili <gap> & bir'; // what Telegram returns as text
const roomAt = plain.indexOf('8-bino'), jokeAt = plain.indexOf('Kulgili');
const ents = [{ type: 'bold', offset: roomAt, length: '8-bino, 214-xona'.length }, { type: 'blockquote', offset: jokeAt, length: plain.length - jokeAt }, { type: 'italic', offset: jokeAt, length: plain.length - jokeAt }];
const back = entitiesToHtml(plain, ents);
check('text + entities → the same HTML (bold room, quoted italic joke, escaping)', back === '⏰ 10 daqiqadan keyin dars\n\n🚪 <b>8-bino, 214-xona</b>\n\n<blockquote><i>Kulgili &lt;gap&gt; &amp; bir</i></blockquote>', back);
const ps = paragraphs(plain, ents);
check('…split into paragraphs, each keeping its own formatting', ps.length === 3 && ps[1].html === '🚪 <b>8-bino, 214-xona</b>' && ps[2].text === 'Kulgili <gap> & bir' && /^<blockquote><i>/.test(ps[2].html), ps);
const emo = '🎉 A\n\n🎉 B';
check('offsets count like Telegram (UTF-16): emoji before formatted text', paragraphs(emo, [{ type: 'bold', offset: emo.indexOf('B'), length: 1 }])[1].html === '🎉 <b>B</b>');

// ---- when the lessons workflow runs
const plan = lessonRunPlan(index.periods);
const at = plan.map(clock);
check(`a fixed plan of moments, not every minute (${plan.length} a day): ${at.join(' ')}`, plan.length >= 12 && plan.length <= 26);
const starts = index.periods.map((p) => toMin(p.start)), endsM = index.periods.map((p) => toMin(p.end));
check('every class has a moment 9–13 minutes before it (the reminder)', starts.every((a) => plan.some((m) => a - m >= 9 && a - m <= 13)), at);
check('…one 10–14 minutes after it starts (its reminder disappears)', starts.every((a) => plan.some((m) => m - a >= 10 && m - a <= 14)));
check('…one right after it ends (end-of-day messages)', endsM.every((b) => plan.some((m) => m - b >= 0 && m - b <= 4)));
check('…and one an hour after the last class', plan.some((m) => m - Math.max(...endsM) >= 60 && m - Math.max(...endsM) <= 65));
check('no two moments closer than 4 minutes', plan.every((m, i) => i === 0 || m - plan[i - 1] >= 4));

console.log(fails ? `\n${fails} lessons check(s) failed` : '\nAll lessons unit checks passed ✅');
process.exit(fails ? 1 : 0);
