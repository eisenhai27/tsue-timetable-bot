// Texts, dates and message formatting. Used by the Telegram bot (Cloudflare Worker)
// and by the GitHub Action that sends weekly posts / change alerts.

export const LANGS = ['uz', 'ru', 'en'];

export const T = {
  uz: {
    days: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'],
    daysShort: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
    months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    langName: "🇺🇿 O'zbekcha",
    chooseLang: 'Tilni tanlang / Выберите язык / Choose language',
    welcome: "Assalomu alaykum! 👋\nMen <b>TDIU Jadval</b> botiman.\n\n• Guruhingiz jadvalini ko'rsataman\n• Jadval o'zgarsa darhol xabar beraman\n• O'qituvchi va xonalarni qidiraman\n\nAvval guruhingizni tanlang 👇",
    chooseFaculty: '🏛 Fakultetni tanlang:',
    chooseCourse: '🎓 Kursni tanlang:',
    chooseGroup: '👥 Guruhni tanlang:',
    course: (n) => (n ? `${n}-kurs` : 'Boshqa'),
    searchHint: '💡 Yoki guruh nomini yozing, masalan: <code>MO-901</code>',
    groupSet: (g) => `✅ Guruh saqlandi: <b>${g}</b>`,
    groupSetChat: (g) => `✅ Bu chat <b>${g}</b> guruhiga ulandi.\n\nHar yakshanba kechqurun haftalik jadval yuboriladi va jadval o'zgarsa darhol xabar beriladi.`,
    noGroup: "Siz hali guruh tanlamagansiz. /group buyrug'ini yuboring.",
    noGroupChat: "Bu chat hali guruhga ulanmagan. Chat admini /setgroup yuborsin.",
    noLessons: "Dars yo'q 🎉",
    freeDay: "Bugun dars yo'q 🎉",
    today: 'Bugun',
    tomorrow: 'Ertaga',
    btnToday: '📅 Bugun',
    btnTomorrow: '➡️ Ertaga',
    btnWeek: '🗓 Hafta',
    btnSettings: '⚙️ Sozlamalar',
    btnApp: '📱 Ilovani ochish',
    btnFree: "🟢 Bo'sh xonalar",
    thisWeekShort: 'Shu hafta',
    nextWeekShort: 'Keyingi hafta',
    btnOpenInApp: '📱 Ilovada ochish',
    weekTitle: (g, range) => `🗓 <b>Haftalik jadval</b> — ${g}\n<i>${range}</i>`,
    changedTitle: (g) => `⚠️ <b>Jadval o'zgardi</b> — ${g}`,
    newTTTitle: (g) => `🆕 <b>Yangi jadval e'lon qilindi</b> — ${g}`,
    weekA: 'A hafta',
    weekB: 'B hafta',
    onlyAdmins: 'Faqat chat adminlari guruhni tanlashi mumkin.',
    notYourMenu: "Bu menyu sizga tegishli emas.",
    addedToGroup: "Salom! 👋 Men dars jadvali botiman.\n\nChat admini /setgroup yuborib guruhni tanlasin — shundan so'ng haftalik jadval va o'zgarishlar shu yerga yuboriladi.",
    settings: '⚙️ <b>Sozlamalar</b>',
    setGroup: (g) => `👥 Guruh: ${g || '—'}`,
    setAlerts: (on) => `🔔 O'zgarish xabarlari: ${on ? 'yoqilgan' : "o'chirilgan"}`,
    setWeekly: (on) => `🗓 Haftalik jadval: ${on ? 'yoqilgan' : "o'chirilgan"}`,
    setLang: '🌐 Til',
    notFound: 'Hech narsa topilmadi. Guruh nomini tekshiring, masalan: MO-901',
    found: 'Topildi:',
    back: '⬅️ Orqaga',
    more: 'Yana ➡️',
    unset: "✅ Bu chat guruhdan uzildi.",
    help: "<b>Buyruqlar</b>\n/today — bugungi darslar\n/tomorrow — ertangi darslar\n/week — haftalik jadval\n/group — guruhni tanlash\n/settings — sozlamalar\n/app — ilovani ochish\n\n<b>Guruh chatida</b>\n/setgroup — chatni guruhga ulash (admin)\n/unset — uzish (admin)",
    dataError: "Jadvalni yuklab bo'lmadi, birozdan so'ng qayta urinib ko'ring.",
    now: 'Hozir',
  },
  ru: {
    days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    daysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    langName: '🇷🇺 Русский',
    chooseLang: 'Tilni tanlang / Выберите язык / Choose language',
    welcome: 'Здравствуйте! 👋\nЯ <b>TDIU Jadval</b> — бот расписания ТГЭУ.\n\n• Показываю расписание вашей группы\n• Сразу сообщаю об изменениях\n• Ищу преподавателей и аудитории\n\nСначала выберите группу 👇',
    chooseFaculty: '🏛 Выберите факультет:',
    chooseCourse: '🎓 Выберите курс:',
    chooseGroup: '👥 Выберите группу:',
    course: (n) => (n ? `${n} курс` : 'Другое'),
    searchHint: '💡 Или напишите название группы, например: <code>MO-901</code>',
    groupSet: (g) => `✅ Группа сохранена: <b>${g}</b>`,
    groupSetChat: (g) => `✅ Этот чат привязан к группе <b>${g}</b>.\n\nКаждое воскресенье вечером будет приходить расписание на неделю, а при изменениях — уведомление.`,
    noGroup: 'Вы ещё не выбрали группу. Отправьте /group.',
    noGroupChat: 'Чат ещё не привязан к группе. Админ чата должен отправить /setgroup.',
    noLessons: 'Пар нет 🎉',
    freeDay: 'Сегодня пар нет 🎉',
    today: 'Сегодня',
    tomorrow: 'Завтра',
    btnToday: '📅 Сегодня',
    btnTomorrow: '➡️ Завтра',
    btnWeek: '🗓 Неделя',
    btnSettings: '⚙️ Настройки',
    btnApp: '📱 Открыть приложение',
    btnFree: '🟢 Свободные',
    thisWeekShort: 'Эта неделя',
    nextWeekShort: 'След. неделя',
    btnOpenInApp: '📱 Открыть в приложении',
    weekTitle: (g, range) => `🗓 <b>Расписание на неделю</b> — ${g}\n<i>${range}</i>`,
    changedTitle: (g) => `⚠️ <b>Расписание изменилось</b> — ${g}`,
    newTTTitle: (g) => `🆕 <b>Опубликовано новое расписание</b> — ${g}`,
    weekA: 'Неделя A',
    weekB: 'Неделя B',
    onlyAdmins: 'Только админы чата могут выбирать группу.',
    notYourMenu: 'Это меню не для вас.',
    addedToGroup: 'Привет! 👋 Я бот расписания.\n\nАдмин чата, отправьте /setgroup и выберите группу — после этого сюда будут приходить расписание на неделю и изменения.',
    settings: '⚙️ <b>Настройки</b>',
    setGroup: (g) => `👥 Группа: ${g || '—'}`,
    setAlerts: (on) => `🔔 Уведомления об изменениях: ${on ? 'вкл' : 'выкл'}`,
    setWeekly: (on) => `🗓 Расписание на неделю: ${on ? 'вкл' : 'выкл'}`,
    setLang: '🌐 Язык',
    notFound: 'Ничего не найдено. Проверьте название группы, например: MO-901',
    found: 'Найдено:',
    back: '⬅️ Назад',
    more: 'Ещё ➡️',
    unset: '✅ Чат отвязан от группы.',
    help: '<b>Команды</b>\n/today — пары на сегодня\n/tomorrow — пары на завтра\n/week — расписание на неделю\n/group — выбрать группу\n/settings — настройки\n/app — открыть приложение\n\n<b>В чате группы</b>\n/setgroup — привязать чат к группе (админ)\n/unset — отвязать (админ)',
    dataError: 'Не удалось загрузить расписание, попробуйте чуть позже.',
    now: 'Сейчас',
  },
  en: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    langName: '🇬🇧 English',
    chooseLang: 'Tilni tanlang / Выберите язык / Choose language',
    welcome: "Hi! 👋\nI'm <b>TDIU Jadval</b>, the TSUE timetable bot.\n\n• I show your group's timetable\n• I tell you right away when it changes\n• I can find teachers and rooms\n\nFirst, pick your group 👇",
    chooseFaculty: '🏛 Choose your faculty:',
    chooseCourse: '🎓 Choose your year:',
    chooseGroup: '👥 Choose your group:',
    course: (n) => (n ? `Year ${n}` : 'Other'),
    searchHint: '💡 Or type your group name, e.g. <code>MO-901</code>',
    groupSet: (g) => `✅ Group saved: <b>${g}</b>`,
    groupSetChat: (g) => `✅ This chat is now linked to <b>${g}</b>.\n\nEvery Sunday evening I'll post the week's timetable, and I'll post an alert whenever it changes.`,
    noGroup: "You haven't picked a group yet. Send /group.",
    noGroupChat: "This chat isn't linked to a group yet. A chat admin should send /setgroup.",
    noLessons: 'No classes 🎉',
    freeDay: 'No classes today 🎉',
    today: 'Today',
    tomorrow: 'Tomorrow',
    btnToday: '📅 Today',
    btnTomorrow: '➡️ Tomorrow',
    btnWeek: '🗓 Week',
    btnSettings: '⚙️ Settings',
    btnApp: '📱 Open app',
    btnFree: '🟢 Free rooms',
    thisWeekShort: 'This week',
    nextWeekShort: 'Next week',
    btnOpenInApp: '📱 Open in app',
    weekTitle: (g, range) => `🗓 <b>Weekly timetable</b> — ${g}\n<i>${range}</i>`,
    changedTitle: (g) => `⚠️ <b>Timetable changed</b> — ${g}`,
    newTTTitle: (g) => `🆕 <b>New timetable published</b> — ${g}`,
    weekA: 'Week A',
    weekB: 'Week B',
    onlyAdmins: 'Only chat admins can choose the group.',
    notYourMenu: 'This menu is not for you.',
    addedToGroup: "Hi! 👋 I'm the timetable bot.\n\nA chat admin should send /setgroup and pick the group. After that I'll post the weekly timetable and changes here.",
    settings: '⚙️ <b>Settings</b>',
    setGroup: (g) => `👥 Group: ${g || '—'}`,
    setAlerts: (on) => `🔔 Change alerts: ${on ? 'on' : 'off'}`,
    setWeekly: (on) => `🗓 Weekly timetable: ${on ? 'on' : 'off'}`,
    setLang: '🌐 Language',
    notFound: 'Nothing found. Check the group name, e.g. MO-901',
    found: 'Found:',
    back: '⬅️ Back',
    more: 'More ➡️',
    unset: '✅ This chat is no longer linked to a group.',
    help: '<b>Commands</b>\n/today — today\'s classes\n/tomorrow — tomorrow\'s classes\n/week — weekly timetable\n/group — choose group\n/settings — settings\n/app — open the app\n\n<b>In a group chat</b>\n/setgroup — link chat to a group (admin)\n/unset — unlink (admin)',
    dataError: "Couldn't load the timetable, please try again in a moment.",
    now: 'Now',
  },
};

export const tr = (lang) => T[lang] || T.uz;

export function langFromCode(code) {
  const c = String(code || '').slice(0, 2).toLowerCase();
  if (c === 'ru') return 'ru';
  if (c === 'en') return 'en';
  return 'uz';
}

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- Dates (Tashkent = UTC+5, no daylight saving) ----------
const TZ_MS = 5 * 3600 * 1000;
const DAY_MS = 86400000;

/** A "local date" is a Date whose UTC fields show Tashkent wall time. */
export function tashkentNow(ms = Date.now()) {
  return new Date(ms + TZ_MS);
}
export const ymd = (d) => d.toISOString().slice(0, 10);
export const addDays = (d, n) => new Date(d.getTime() + n * DAY_MS);
/** 0 = Monday … 6 = Sunday */
export const weekday = (d) => (d.getUTCDay() + 6) % 7;
export const mondayOf = (d) => {
  const m = addDays(d, -weekday(d));
  return new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth(), m.getUTCDate()));
};

/** 'A' | 'B' | null  (null = unknown → show both kinds of weeks, labelled) */
export function weekParity(weekA, date) {
  if (!weekA) return null;
  const base = mondayOf(new Date(weekA + 'T00:00:00Z'));
  const diff = Math.round((mondayOf(date) - base) / (7 * DAY_MS));
  return ((diff % 2) + 2) % 2 === 0 ? 'A' : 'B';
}

export function fmtDate(d, lang) {
  const L = tr(lang);
  const day = d.getUTCDate();
  const m = L.months[d.getUTCMonth()];
  return lang === 'en' ? `${m} ${day}` : lang === 'ru' ? `${day} ${m}` : `${day}-${m}`;
}
const dm = (d) => `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

// ---------- Lessons ----------
// Extra words used by the message formatters
const W = {
  uz: { lecture: "Ma'ruza", seminar: 'Seminar', lab: 'Laboratoriya', practice: 'Amaliy', bld: (b) => `${b}-bino`, room: (r) => `${r}-xona`,
    count: (n) => `${n} ta dars`, pair: (n) => `${n}-para`, now: '🟢 Hozir', next: '⏭ Keyingi', brk: (m) => `☕ ${m} daqiqa tanaffus`,
    finish: (t) => `🏁 Darslar ${t} da tugaydi`, moved: '🔁 Vaqti o‘zgardi', roomCh: '🚪 Xona o‘zgardi', teachCh: '👤 O‘qituvchi o‘zgardi',
    removed: '❌ Bekor qilindi', added: '➕ Yangi dars', wkCap: (g, r, n) => `🗓 <b>${g}</b> — haftalik jadval\n${r} · ${n} ta dars`,
    lessonsWeek: 'Haftalik jadval', freeWeek: "Bu hafta dars yo'q 🎉", seeApp: '📱 Batafsil — ilovada' },
  ru: { lecture: 'Лекция', seminar: 'Семинар', lab: 'Лабораторная', practice: 'Практика', bld: (b) => `корпус ${b}`, room: (r) => `ауд. ${r}`,
    count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'пара' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'пары' : 'пар'}`, pair: (n) => `${n} пара`,
    now: '🟢 Сейчас', next: '⏭ Следующая', brk: (m) => `☕ перерыв ${m} мин`, finish: (t) => `🏁 Пары закончатся в ${t}`,
    moved: '🔁 Изменилось время', roomCh: '🚪 Изменилась аудитория', teachCh: '👤 Изменился преподаватель', removed: '❌ Отменено', added: '➕ Новая пара',
    wkCap: (g, r, n) => `🗓 <b>${g}</b> — расписание на неделю\n${r} · ${n} пар`, lessonsWeek: 'Расписание на неделю', freeWeek: 'На этой неделе пар нет 🎉', seeApp: '📱 Подробнее — в приложении' },
  en: { lecture: 'Lecture', seminar: 'Seminar', lab: 'Lab', practice: 'Practice', bld: (b) => `Building ${b}`, room: (r) => `Room ${r}`,
    count: (n) => `${n} class${n === 1 ? '' : 'es'}`, pair: (n) => `Period ${n}`, now: '🟢 Now', next: '⏭ Next', brk: (m) => `☕ ${m} min break`,
    finish: (t) => `🏁 Classes end at ${t}`, moved: '🔁 Time changed', roomCh: '🚪 Room changed', teachCh: '👤 Teacher changed', removed: '❌ Cancelled',
    added: '➕ New class', wkCap: (g, r, n) => `🗓 <b>${g}</b> — weekly timetable\n${r} · ${n} classes`, lessonsWeek: 'Weekly timetable', freeWeek: 'No classes this week 🎉', seeApp: '📱 More in the app' },
};
export const words = (lang) => W[lang] || W.uz;

/** "Ekonometrika (Ma)" -> { name: "Ekonometrika", type: "lecture" } */
export function parseSubject(s) {
  const m = /^(.*?)\s*\(([^()]+)\)\s*$/.exec(String(s || '').trim());
  if (!m) return { name: String(s || '').trim(), type: null };
  const t = m[2].toLowerCase().replace(/[^a-zа-я]/g, '');
  let type = null;
  if (/^(ma|maruza|lek|лек|lec)/.test(t)) type = 'lecture';
  else if (/^(sem|сем)/.test(t)) type = 'seminar';
  else if (/^(lab|лаб)/.test(t)) type = 'lab';
  else if (/^(amal|пр|prac)/.test(t)) type = 'practice';
  return type ? { name: m[1].trim(), type } : { name: String(s).trim(), type: null };
}
export const typeLabel = (type, lang) => (type ? words(lang)[type] : '');

/** "8-310-30" -> "8-bino, 310-xona". Falls back to the raw name when the pattern is unclear. */
export function roomLabel(r, lang) {
  const w = words(lang);
  return String(r || '').split(', ').filter(Boolean).map((one) => {
    const m = /^(\d{1,2})\s*[-/]+\s*(\d{2,4}[A-Za-zА-Яа-я]?)(?:\s*-\s*\d+)?$/.exec(one.trim());
    return m ? `${w.bld(m[1])}, ${w.room(m[2])}` : one;
  }).join(' / ');
}

export function lessonsForDay(group, dayIdx, parity) {
  return (group?.lessons || []).filter((l) => l.d === dayIdx && (!parity || !l.w || l.w === parity));
}

function times(periods, l) {
  const a = periods.find((p) => p.p === l.p);
  const b = periods.find((p) => p.p === l.p + (l.n || 1) - 1) || a;
  return { a: a ? a.start : '', b: b ? b.end : '' };
}
const mins = (t) => { const [h, m] = String(t).split(':').map(Number); return h * 60 + m; };

function weekTag(l, lang, parity) {
  if (!l.w || parity) return '';
  return ` · <i>${l.w === 'A' ? tr(lang).weekA : tr(lang).weekB}</i>`;
}

/** Full lesson block for "today / tomorrow" messages. */
export function fmtLesson(l, periods, lang, parity, state) {
  const w = words(lang);
  const t = times(periods, l);
  const sub = parseSubject(l.s);
  const head = `${state ? state + '\n' : ''}<b>${t.a} – ${t.b}</b>  ·  <i>${w.pair(l.p)}</i>${weekTag(l, lang, parity)}`;
  const lines = [head, `📘 <b>${esc(sub.name)}</b>${sub.type ? ` — ${typeLabel(sub.type, lang)}` : ''}${l.g ? ` <i>(${esc(l.g)})</i>` : ''}`];
  if (l.r) lines.push(`📍 ${esc(roomLabel(l.r, lang))}`);
  if (l.t) lines.push(`👤 ${esc(l.t)}`);
  return lines.join('\n');
}

/** One-line version used in weekly captions and change alerts. */
export function fmtLessonShort(l, periods, lang, parity) {
  const t = times(periods, l);
  const sub = parseSubject(l.s);
  let s = `<b>${t.a}</b> ${esc(sub.name)}`;
  if (sub.type) s += ` <i>(${typeLabel(sub.type, lang).toLowerCase()})</i>`;
  if (l.g) s += ` <i>[${esc(l.g)}]</i>`;
  if (l.r) s += ` · 📍${esc(l.r)}`;
  if (l.w && !parity) s += ` · <i>${l.w}</i>`;
  return s;
}

/**
 * "Today" / "Tomorrow" message. When `nowDate` is the same day, the current and next
 * lessons are marked and past ones are dimmed.
 */
export function fmtDay(group, index, date, lang, nowDate) {
  const L = tr(lang);
  const w = words(lang);
  const d = weekday(date);
  const parity = weekParity(index.weekA, date);
  const ls = d === 6 ? [] : lessonsForDay(group, d, parity);
  const head = [`📅 <b>${L.days[d]}, ${fmtDate(date, lang)}</b>` + (parity ? ` · ${parity === 'A' ? L.weekA : L.weekB}` : ''),
    `👥 ${esc(group.name)}${ls.length ? ` · ${w.count(ls.length)}` : ''}`].join('\n');
  if (!ls.length) return `${head}\n\n${L.noLessons}`;
  const sameDay = nowDate && ymd(nowDate) === ymd(date);
  const nowM = sameDay ? nowDate.getUTCHours() * 60 + nowDate.getUTCMinutes() : -1;
  let nextMarked = false;
  const blocks = [];
  let prevEnd = null;
  for (const l of ls) {
    const t = times(index.periods, l);
    if (prevEnd != null) {
      const gap = mins(t.a) - prevEnd;
      if (gap >= 30) blocks.push(w.brk(gap));
    }
    prevEnd = Math.max(prevEnd ?? 0, mins(t.b));
    let state = '';
    if (sameDay) {
      if (nowM >= mins(t.a) && nowM < mins(t.b)) state = w.now;
      else if (nowM < mins(t.a) && !nextMarked) { state = w.next; nextMarked = true; }
    }
    blocks.push(fmtLesson(l, index.periods, lang, parity, state));
  }
  const last = times(index.periods, ls[ls.length - 1]).b;
  return clip(`${head}\n━━━━━━━━━━━━━━\n\n${blocks.join('\n\n')}\n\n${w.finish(last)}`);
}

/** Text version of the week (fallback when the picture can't be sent). */
export function fmtWeek(group, index, monday, lang) {
  const L = tr(lang);
  const parity = weekParity(index.weekA, monday);
  const range = `${dm(monday)} – ${dm(addDays(monday, 5))}` + (parity ? ` · ${parity === 'A' ? L.weekA : L.weekB}` : '');
  const parts = [L.weekTitle(esc(group.name), range)];
  for (let d = 0; d < 6; d++) {
    const ls = lessonsForDay(group, d, parity);
    if (!ls.length) continue;
    parts.push(`<b>${L.days[d]}</b>\n${ls.map((l) => fmtLessonShort(l, index.periods, lang, parity)).join('\n')}`);
  }
  if (parts.length === 1) parts.push(words(lang).freeWeek);
  return clip(parts.join('\n\n'));
}

/** Short caption that goes under the weekly picture. */
export function fmtWeekCaption(group, index, monday, lang) {
  const w = words(lang);
  const L = tr(lang);
  const parity = weekParity(index.weekA, monday);
  const n = [0, 1, 2, 3, 4, 5].reduce((s, d) => s + lessonsForDay(group, d, parity).length, 0);
  const range = `${fmtDate(monday, lang)} – ${fmtDate(addDays(monday, 5), lang)}` + (parity ? ` · ${parity === 'A' ? L.weekA : L.weekB}` : '');
  return w.wkCap(esc(group.name), range, n);
}

/** Date of the next occurrence of weekday `d` (today counts). */
function nextDateOf(d, from) {
  const diff = (d - weekday(from) + 7) % 7;
  return addDays(from, diff);
}

/**
 * Change alert. Pairs removed/added lessons so students read
 * "time changed 16:00 → 13:00" instead of two unrelated lines.
 */
export function fmtChanges(group, index, dayDiffs, lang, isNewTT, now = tashkentNow()) {
  const L = tr(lang);
  const w = words(lang);
  const P = index.periods;
  const parts = [isNewTT ? L.newTTTitle(esc(group.name)) : L.changedTitle(esc(group.name))];
  for (const dd of dayDiffs) {
    const removed = [...dd.removed];
    const added = [...dd.added];
    const lines = [];
    const sameSubj = (a, b) => parseSubject(a.s).name === parseSubject(b.s).name && (a.g || '') === (b.g || '') && (a.w || '') === (b.w || '');
    for (let i = 0; i < removed.length; i++) {
      const o = removed[i];
      const j = added.findIndex((n) => sameSubj(o, n));
      if (j < 0) continue;
      const n = added[j];
      const name = `<b>${esc(parseSubject(n.s).name)}</b>`;
      if (o.p !== n.p || o.n !== n.n) lines.push(`${w.moved}: ${name}\n     ${times(P, o).a} → <b>${times(P, n).a}</b>${n.r ? ` · 📍${esc(n.r)}` : ''}`);
      else if (o.r !== n.r) lines.push(`${w.roomCh}: ${name} (${times(P, n).a})\n     ${esc(o.r || '—')} → <b>${esc(n.r || '—')}</b>`);
      else if (o.t !== n.t) lines.push(`${w.teachCh}: ${name} (${times(P, n).a})\n     ${esc(o.t || '—')} → <b>${esc(n.t || '—')}</b>`);
      else lines.push(`${w.added}: ${fmtLessonShort(n, P, lang, null)}`);
      removed.splice(i--, 1);
      added.splice(j, 1);
    }
    for (const l of removed) lines.push(`${w.removed}: <s>${fmtLessonShort(l, P, lang, null)}</s>`);
    for (const l of added) lines.push(`${w.added}: ${fmtLessonShort(l, P, lang, null)}`);
    const date = nextDateOf(dd.d, now);
    parts.push(`📅 <b>${L.days[dd.d]}, ${fmtDate(date, lang)}</b>\n${lines.join('\n')}`);
  }
  return clip(parts.join('\n\n'));
}

function clip(s) {
  if (s.length <= 4000) return s;
  // cut at a line break so no HTML tag is left open (every line closes its own tags)
  const cut = s.lastIndexOf('\n', 3950);
  return s.slice(0, cut > 0 ? cut : 3950) + '\n…';
}
