// Lesson reminders ("⏰ in 10 minutes: …", sent before every class and deleted 10 minutes after it starts) and the
// end-of-day message ("today's classes are over", deleted after an hour). Text building and joke picking live here so the
// GitHub Action (scripts/notify.mjs, which sends them) and the Worker (the buttons under them) share one copy.
import { JOKES, SUBJECT_JOKES } from './jokes.mjs';
import { LANGS, parseSubject, typeLabel, roomLabel, lessonsForDay, weekParity, weekday } from './shared.mjs';

export const LR_BEFORE = 10; // minutes before a class
export const LR_DELETE_AFTER_START = 10; // the reminder disappears this long after the class started
export const DE_DELETE_AFTER = 60; // the end-of-day message disappears after an hour

const W = {
  uz: {
    inMin: (m) => (m <= 1 ? '⏰ Hozir dars boshlanadi' : `⏰ ${m} daqiqadan keyin dars`),
    stay: "🪑 Shu xonada qolasiz",
    intro: "🆕 Endi har dars oldidan eslatib turaman. Bu xabar dars boshlangach o'zi o'chib ketadi.",
    endS: '✅ Bugungi darslar tugadi!', endT: '✅ Bugungi darslaringiz tugadi!',
    off: '🔕 Eslatmani o\'chirish', more: '😄 Yana bittasi', back: '↩️ Qayta yoqish',
    offLr: "🔕 Dars oldidan eslatmalar o'chirildi. Qayta yoqish: shu tugma yoki ⚙️ Sozlamalar.",
    offDe: "🔕 Kun yakuni xabarlari o'chirildi. Qayta yoqish: shu tugma yoki ⚙️ Sozlamalar.",
    onLr: '🔔 Dars oldidan eslatmalar yoqildi.', onDe: '🔔 Kun yakuni xabarlari yoqildi.',
    setLr: (on) => `⏰ Dars oldidan eslatma: ${on ? '✅' : '❌'}`, setDe: (on) => `🏠 Kun yakuni xabari: ${on ? '✅' : '❌'}`,
  },
  ru: {
    inMin: (m) => (m <= 1 ? '⏰ Пара начинается' : `⏰ Через ${m} мин. пара`),
    stay: '🪑 Остаётесь в этой аудитории',
    intro: '🆕 Теперь я напоминаю перед каждой парой. Это сообщение само исчезнет после начала пары.',
    endS: '✅ Пары на сегодня закончились!', endT: '✅ Ваши пары на сегодня закончились!',
    off: '🔕 Отключить', more: '😄 Ещё одну', back: '↩️ Включить снова',
    offLr: '🔕 Напоминания перед парами отключены. Включить снова: эта кнопка или ⚙️ Настройки.',
    offDe: '🔕 Сообщения в конце дня отключены. Включить снова: эта кнопка или ⚙️ Настройки.',
    onLr: '🔔 Напоминания перед парами включены.', onDe: '🔔 Сообщения в конце дня включены.',
    setLr: (on) => `⏰ Напоминание перед парой: ${on ? '✅' : '❌'}`, setDe: (on) => `🏠 Сообщение в конце дня: ${on ? '✅' : '❌'}`,
  },
  en: {
    inMin: (m) => (m <= 1 ? '⏰ Class is starting' : `⏰ Class in ${m} minutes`),
    stay: '🪑 You stay in this room',
    intro: '🆕 I now remind you before every class. This message disappears by itself once the class starts.',
    endS: "✅ That's all your classes for today!", endT: "✅ That's all your classes for today!",
    off: '🔕 Turn off', more: '😄 Another one', back: '↩️ Turn back on',
    offLr: '🔕 Class reminders are off. Turn them back on with this button or in ⚙️ Settings.',
    offDe: '🔕 End-of-day messages are off. Turn them back on with this button or in ⚙️ Settings.',
    onLr: '🔔 Class reminders are on.', onDe: '🔔 End-of-day messages are on.',
    setLr: (on) => `⏰ Class reminders: ${on ? '✅' : '❌'}`, setDe: (on) => `🏠 End-of-day message: ${on ? '✅' : '❌'}`,
  },
};
export const lw = (lang) => W[lang] || W.uz;

const toMin = (t) => { const [h, m] = String(t).split(':').map(Number); return h * 60 + m; };
const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/**
 * The day's classes of a group / teacher as slots: lessons sharing a start time (subgroups) are one slot.
 * → [{ start, end, lessons: [...] }] in time order. `date` is a Tashkent "local date".
 */
export function daySlots(g, index, date) {
  const periods = index.periods || [];
  const ls = lessonsForDay(g, weekday(date), weekParity(index.weekA, date));
  const by = new Map();
  for (const l of ls) {
    const a = periods.find((p) => p.p === l.p);
    const b = periods.find((p) => p.p === l.p + (l.n || 1) - 1) || a;
    if (!a) continue;
    const start = toMin(a.start), end = toMin(b.end);
    const s = by.get(start) || { start, end, lessons: [] };
    s.end = Math.max(s.end, end);
    s.lessons.push(l);
    by.set(start, s);
  }
  return [...by.values()].sort((x, y) => x.start - y.start);
}

const roomsOf = (slot) => slot.lessons.map((l) => l.r || '').sort().join('|');
/** The next class continues the previous one: same subject(s), same teacher(s), same room, right after it → no new reminder. */
export function continuesPrevious(prev, slot) {
  if (!prev || slot.start - prev.end > 15) return false;
  const key = (s) => s.lessons.map((l) => `${l.s}|${l.t || l.gr || ''}|${l.r || ''}`).sort().join('#');
  return key(prev) === key(slot);
}
/** Same room as the class right before (back to back) → "you stay here". */
export const staysInRoom = (prev, slot) => !!prev && slot.start - prev.end <= 15 && roomsOf(prev) !== '' && roomsOf(prev) === roomsOf(slot);

/** All jokes under a key: a JOKES category, or "sub<i>" for SUBJECT_JOKES[i]. */
export function jokeList(key) {
  const m = /^sub(\d+)$/.exec(String(key));
  if (m) return SUBJECT_JOKES[Number(m[1])]?.list || null;
  return Object.hasOwn(JOKES, key) ? JOKES[key] : null;
}
const textOf = (entry, lang) => entry[LANGS.includes(lang) ? lang : 'uz'] || entry.uz;
/** Teacher lines are the "t_" lists; everything else is for students. A teacher never gets a student line, nor the other way round. */
export const isTeacherKey = (key) => String(key).startsWith('t_');

/**
 * Which line goes under a reminder — random every time, but only from the lists meant for this person and this moment.
 * ctx: { teacher, type, first, last, start, wd (0 = Monday), stay, lecture, subject }; rand = a 0…1 random source (tests pass one).
 */
export function pickReminderJoke(ctx, rand = Math.random) {
  const one = (list) => list[Math.floor(rand() * list.length)];
  const from = (key, filter) => {
    const all = jokeList(key) || [];
    const list = filter ? all.filter(filter) : all;
    return list.length ? { key, entry: one(list) } : null;
  };
  if (ctx.teacher) {
    const special = ctx.wd === 4 ? 't_fri' : ctx.wd === 5 ? 't_sat' : null;
    return from(special && rand() < 0.3 ? special : 't_start');
  }
  if (ctx.stay) {
    const p = from('stay', ctx.lecture ? (e) => !e.win : null); // lecture halls often have no windows
    if (p) return p;
  }
  const subj = SUBJECT_JOKES.findIndex((x) => x.re.test(ctx.subject || ''));
  if (subj >= 0 && rand() < 1 / 3) return from(`sub${subj}`);
  const specials = [];
  if (ctx.first && ctx.start <= 8 * 60 + 30) specials.push('s_morning');
  if (ctx.last && !ctx.first) specials.push('s_last');
  if (ctx.type === 'lecture') specials.push('s_lecture');
  if (ctx.type === 'seminar' || ctx.type === 'practice') specials.push('s_seminar');
  if (ctx.type === 'lab') specials.push('s_lab');
  if (ctx.wd === 4) specials.push('s_fri');
  if (ctx.wd === 5) specials.push('s_sat');
  if (ctx.wd === 0 && ctx.first) specials.push('s_mon');
  if (ctx.start >= 12 * 60 + 30 && ctx.start <= 14 * 60 + 30) specials.push('s_lunch');
  if (specials.length && rand() < 0.6) return from(one(specials));
  return from('s_any');
}

/** End of the day: students get a cheerful line; teachers mostly (≈60%) a thank-you, otherwise a warm wish. Random each time. */
export function pickDayEndJoke(ctx, rand = Math.random) {
  let key;
  if (ctx.teacher) {
    if (rand() < 0.6) key = ctx.wd === 4 && rand() < 0.5 ? 't_thanks_fri' : ctx.wd === 5 && rand() < 0.5 ? 't_thanks_sat' : 't_thanks';
    else key = 't_wish';
  } else key = ctx.wd === 4 && rand() < 0.5 ? 's_end_fri' : ctx.wd === 5 && rand() < 0.5 ? 's_end_sat' : 's_end';
  const list = jokeList(key);
  return { key, entry: list[Math.floor(rand() * list.length)] };
}

/** Another joke from the same list for the "😄 Another one" button (never the one shown). */
export function nextJoke(key, current, lang) {
  const list = jokeList(key);
  if (!list?.length) return null;
  const others = list.filter((e) => textOf(e, lang) !== current);
  const pool = others.length ? others : list;
  return textOf(pool[Math.floor(Math.random() * pool.length)], lang);
}

/** The reminder text (plain text: the buttons edit it in place). `minutes` = time left until the class. */
export function fmtLessonReminder(slot, lang, opts) {
  const w = lw(lang);
  const lines = [w.inMin(opts.minutes)];
  for (const l of slot.lessons) {
    const sub = parseSubject(l.s, lang);
    lines.push('', `📘 ${sub.name}${sub.type ? ` · ${typeLabel(sub.type, lang).toLowerCase()}` : ''}${l.g ? ` (${l.g})` : ''}`);
    const who = opts.teacher ? (l.gr ? `👥 ${l.gr}` : null) : (l.t ? `👨‍🏫 ${l.t}` : null);
    if (who) lines.push(who);
    if (l.r) lines.push(`🚪 ${roomLabel(l.r, lang)}${opts.stay ? ` · ${w.stay.replace(/^🪑 /, '')}` : ''}`);
  }
  lines.push(`🕘 ${hm(slot.start)}–${hm(slot.end)}`);
  if (opts.joke) lines.push('', opts.joke);
  if (opts.intro) lines.push('', w.intro);
  return lines.join('\n');
}

export const fmtDayEnd = (lang, teacher, joke) => `${teacher ? lw(lang).endT : lw(lang).endS}\n\n${joke}`;

/** Buttons under them: turn this kind off, or swap the joke. kind = 'lr' (reminder) | 'de' (end of day). */
export const ephemeralKeyboard = (lang, kind, jokeKey) => ({
  inline_keyboard: [[{ text: lw(lang).off, callback_data: `${kind}:off` }, { text: lw(lang).more, callback_data: `jk:${jokeKey}` }]],
});
export { textOf as jokeText, hm as clock, toMin as clockToMin };
