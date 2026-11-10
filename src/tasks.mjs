// Group tasks ("Vazifalar"): the rules that need no database — easy to test on their own.
import { addDays, lessonsForDay, parseSubject, weekParity, weekday, ymd } from './shared.mjs';

export const TASK_MAX_LEN = 300;
export const TASKS_PER_DAY = 5; // one person, one day
export const TASK_KEEP_DAYS = 30; // a task is deleted this long after its due date
export const TASK_HORIZON = 90; // the furthest due date that can be chosen (days from today)

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
/** 👍 needed to mark a task "tasdiqlangan": 3, but never more than half of a small group (at least 2). */
export const approveAt = (members) => clamp(Math.ceil(members / 2), 2, 3);
/** 🚩 needed to hide a task from the group — the same rule. */
export const hideAt = (members) => approveAt(members);
/** Different people complaining about one author that stop them writing: half the group, but never fewer than 3. */
export const banAt = (members) => Math.max(3, Math.ceil(members / 2));

/** The task text as it is stored: one line of normal words, no control characters, at most TASK_MAX_LEN characters. */
export function cleanTaskText(s) {
  const t = String(s ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f​-‏‪-‮⁦-⁩]/g, '').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return t.length > TASK_MAX_LEN ? t.slice(0, TASK_MAX_LEN).trim() : t;
}

const subjKey = (name) => name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/** The subjects a group has, by their Uzbek names (the lesson type like "(Ma)" is cut off), each once. */
export function subjectsOf(group) {
  const seen = new Map();
  for (const l of group?.lessons || []) {
    const name = parseSubject(l.s).name;
    const key = subjKey(name);
    if (key && !seen.has(key)) seen.set(key, name);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, 'uz'));
}

/** "2026-11-12" if it is a real calendar date, else null. */
export function validDay(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s))) return null;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && ymd(d) === s ? s : null;
}

/**
 * For every subject of the group: the next day AFTER `today` (a Tashkent "local date") that has a lesson of it, as { subjectKey: 'YYYY-MM-DD' }.
 * Looks 21 days ahead, honours week A/B timetables (weekParity). One pass over the days — cheap enough for a Worker request.
 */
export function nextLessons(group, index, today) {
  const out = {};
  for (let i = 1; i <= 21; i++) {
    const date = addDays(today, i);
    const d = weekday(date);
    if (d === 6) continue;
    for (const l of lessonsForDay(group, d, weekParity(index?.weekA, date))) {
      const k = subjKey(parseSubject(l.s).name);
      if (k && !out[k]) out[k] = ymd(date);
    }
  }
  return out;
}
/** For every subject: its next lesson days after `today` (up to `max`, within `days` days) — the dates offered when a task is written. */
export function lessonDates(group, index, today, { days = 28, max = 6 } = {}) {
  const out = {};
  for (let i = 1; i <= days; i++) {
    const date = addDays(today, i);
    const d = weekday(date);
    if (d === 6) continue;
    const seen = new Set();
    for (const l of lessonsForDay(group, d, weekParity(index?.weekA, date))) {
      const k = subjKey(parseSubject(l.s).name);
      if (!k || seen.has(k)) continue;
      seen.add(k);
      (out[k] ||= []);
      if (out[k].length < max) out[k].push(ymd(date));
    }
  }
  return out;
}
export const subjectKey = (name) => subjKey(parseSubject(name).name);

/**
 * The state of a task after somebody voted: 2 = hidden (enough 🚩), 1 = confirmed (enough 👍), 0 = not confirmed yet.
 * Hiding wins — a task people call wrong is not "confirmed" even if it also has friends.
 */
export function taskState(up, down, members) {
  if (down >= hideAt(members)) return 2;
  return up >= approveAt(members) ? 1 : 0;
}

/** Days from `today` to `due` (both 'YYYY-MM-DD'): 0 = today, 1 = tomorrow, negative = already past. */
export const daysTo = (due, today) => Math.round((Date.parse(due + 'T00:00:00Z') - Date.parse(today + 'T00:00:00Z')) / 864e5);

// ---- texts (messages the bot sends; the Mini App has its own)
const TX = {
  uz: { needGroup: "📝 Vazifalar uchun avval guruhingizni tanlang: /group", intro: "📝 Guruh vazifalari — yozish, 👍 bilan tasdiqlash va 🔔 eslatma:", rel: ['bugun', 'ertaga'], due: 'Muddat', by: 'Yozdi', open: '📝 Vazifalar', approved: '✅ Guruhingiz tasdiqladi', tomorrow: '⏰ <b>Ertaga muddat</b>', today: '⏰ <b>Bugun muddat</b>', fresh: '🆕 <b>Yangi vazifa</b>', banned: "🚫 Guruhingizdagi ko'pchilik vazifalaringizga shikoyat qildi, shuning uchun bu guruhda vazifa yoza olmaysiz." },
  ru: { needGroup: '📝 Для заданий сначала выберите группу: /group', intro: '📝 Задания группы — писать, подтверждать 👍 и включать 🔔 напоминание:', rel: ['сегодня', 'завтра'], due: 'Срок', by: 'Написал(а)', open: '📝 Задания', approved: '✅ Подтверждено группой', tomorrow: '⏰ <b>Срок — завтра</b>', today: '⏰ <b>Срок — сегодня</b>', fresh: '🆕 <b>Новое задание</b>', banned: '🚫 Большинство вашей группы пожаловалось на ваши задания, поэтому писать задания в этой группе вы больше не можете.' },
  en: { needGroup: '📝 To use tasks, choose your group first: /group', intro: '📝 Group tasks — post, confirm with 👍 and turn on a 🔔 reminder:', rel: ['today', 'tomorrow'], due: 'Due', by: 'Posted by', open: '📝 Tasks', approved: '✅ Confirmed by your group', tomorrow: '⏰ <b>Due tomorrow</b>', today: '⏰ <b>Due today</b>', fresh: '🆕 <b>New task</b>', banned: '🚫 Most of your group flagged your tasks, so you can no longer post tasks in this group.' },
};
export const taskTx = (lang) => TX[lang] || TX.uz;
