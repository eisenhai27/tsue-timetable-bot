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
export function lessonsForDay(group, dayIdx, parity) {
  return (group?.lessons || []).filter((l) => l.d === dayIdx && (!parity || !l.w || l.w === parity));
}

function periodTime(periods, l) {
  const a = periods.find((p) => p.p === l.p);
  const b = periods.find((p) => p.p === l.p + (l.n || 1) - 1) || a;
  return a ? `${a.start}–${b.end}` : `${l.p}`;
}

const NUM = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

function weekTag(l, lang, parity) {
  if (!l.w || parity) return '';
  return ` · <i>${l.w === 'A' ? tr(lang).weekA : tr(lang).weekB}</i>`;
}

export function fmtLesson(l, periods, lang, parity) {
  const lines = [`${NUM[l.p] || l.p} <b>${periodTime(periods, l)}</b>${weekTag(l, lang, parity)}`];
  lines.push(`📘 ${esc(l.s)}${l.g ? ` <i>(${esc(l.g)})</i>` : ''}`);
  const extra = [];
  if (l.r) extra.push(`🚪 ${esc(l.r)}`);
  if (l.t) extra.push(`👤 ${esc(l.t)}`);
  if (extra.length) lines.push(extra.join('  '));
  return lines.join('\n');
}

/** One-line version used in weekly posts and change alerts. */
export function fmtLessonShort(l, periods, lang, parity) {
  const a = periods.find((p) => p.p === l.p);
  const time = a ? a.start : `${l.p}`;
  let s = `<b>${time}</b> ${esc(l.s)}`;
  if (l.g) s += ` <i>(${esc(l.g)})</i>`;
  if (l.r) s += ` · 🚪${esc(l.r)}`;
  if (l.w && !parity) s += ` · <i>${l.w}</i>`;
  return s;
}

export function fmtDay(group, index, date, lang) {
  const L = tr(lang);
  const d = weekday(date);
  const parity = weekParity(index.weekA, date);
  const head = `📅 <b>${L.days[d]}, ${fmtDate(date, lang)}</b> — ${esc(group.name)}` +
    (parity ? ` · ${parity === 'A' ? L.weekA : L.weekB}` : '');
  const ls = d === 6 ? [] : lessonsForDay(group, d, parity);
  if (!ls.length) return `${head}\n\n${L.noLessons}`;
  return `${head}\n\n${ls.map((l) => fmtLesson(l, index.periods, lang, parity)).join('\n\n')}`;
}

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
  if (parts.length === 1) parts.push(L.noLessons);
  return clip(parts.join('\n\n'));
}

export function fmtChanges(group, index, dayDiffs, lang, isNewTT) {
  const L = tr(lang);
  const parts = [isNewTT ? L.newTTTitle(esc(group.name)) : L.changedTitle(esc(group.name))];
  for (const dd of dayDiffs) {
    const lines = [];
    for (const l of dd.removed) lines.push(`➖ <s>${fmtLessonShort(l, index.periods, lang, null)}</s>`);
    for (const l of dd.added) lines.push(`➕ ${fmtLessonShort(l, index.periods, lang, null)}`);
    parts.push(`<b>${L.days[dd.d]}</b>\n${lines.join('\n')}`);
  }
  return clip(parts.join('\n\n'));
}

function clip(s) {
  if (s.length <= 4000) return s;
  // cut at a line break so no HTML tag is left open (every line closes its own tags)
  const cut = s.lastIndexOf('\n', 3950);
  return s.slice(0, cut > 0 ? cut : 3950) + '\n…';
}
