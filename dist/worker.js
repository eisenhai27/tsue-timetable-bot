// TDIU Jadval bot — ONE-FILE version for pasting into the Cloudflare dashboard.
// Generated from worker/worker.mjs + src/shared.mjs with `npm run build`. Edit those files, not this one.
// src/shared.mjs
var LANGS = ["uz", "ru", "en"];
var T = {
  uz: {
    days: ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"],
    daysShort: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
    months: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
    langName: "🇺🇿 O'zbekcha",
    chooseLang: "Tilni tanlang / Выберите язык / Choose language",
    welcome: "Assalomu alaykum! 👋\nMen <b>TDIU Jadval</b> botiman.\n\n• Guruhingiz jadvalini ko'rsataman\n• Jadval o'zgarsa darhol xabar beraman\n• O'qituvchi va xonalarni qidiraman\n\nAvval guruhingizni tanlang 👇",
    chooseFaculty: "🏛 Fakultetni tanlang:",
    chooseCourse: "🎓 Kursni tanlang:",
    chooseGroup: "👥 Guruhni tanlang:",
    course: (n) => n ? `${n}-kurs` : "Boshqa",
    searchHint: "💡 Yoki guruh nomini yozing, masalan: <code>MO-901</code>",
    groupSet: (g) => `✅ Guruh saqlandi: <b>${g}</b>`,
    groupSetChat: (g) => `✅ Bu chat <b>${g}</b> guruhiga ulandi.

Har yakshanba kechqurun haftalik jadval yuboriladi va jadval o'zgarsa darhol xabar beriladi.`,
    noGroup: "Siz hali guruh tanlamagansiz. /group buyrug'ini yuboring.",
    noGroupChat: "Bu chat hali guruhga ulanmagan. Chat admini /setgroup yuborsin.",
    noLessons: "Dars yo'q 🎉",
    freeDay: "Bugun dars yo'q 🎉",
    today: "Bugun",
    tomorrow: "Ertaga",
    btnToday: "📅 Bugun",
    btnTomorrow: "➡️ Ertaga",
    btnWeek: "🗓 Hafta",
    btnSettings: "⚙️ Sozlamalar",
    btnApp: "📱 Ilovani ochish",
    btnFree: "🟢 Bo'sh xonalar",
    thisWeekShort: "Shu hafta",
    nextWeekShort: "Keyingi hafta",
    btnOpenInApp: "📱 Ilovada ochish",
    weekTitle: (g, range) => `🗓 <b>Haftalik jadval</b> — ${g}
<i>${range}</i>`,
    changedTitle: (g) => `⚠️ <b>Jadval o'zgardi</b> — ${g}`,
    newTTTitle: (g) => `🆕 <b>Yangi jadval e'lon qilindi</b> — ${g}`,
    weekA: "A hafta",
    weekB: "B hafta",
    onlyAdmins: "Faqat chat adminlari guruhni tanlashi mumkin.",
    notYourMenu: "Bu menyu sizga tegishli emas.",
    addedToGroup: "Salom! 👋 Men dars jadvali botiman.\n\nChat admini /setgroup yuborib guruhni tanlasin — shundan so'ng haftalik jadval va o'zgarishlar shu yerga yuboriladi.",
    settings: "⚙️ <b>Sozlamalar</b>",
    setGroup: (g) => `👥 Guruh: ${g || "—"}`,
    setAlerts: (on) => `🔔 O'zgarish xabarlari: ${on ? "yoqilgan" : "o'chirilgan"}`,
    setWeekly: (on) => `🗓 Haftalik jadval: ${on ? "yoqilgan" : "o'chirilgan"}`,
    setLang: "🌐 Til",
    notFound: "Hech narsa topilmadi. Guruh nomini tekshiring, masalan: MO-901",
    found: "Topildi:",
    back: "⬅️ Orqaga",
    more: "Yana ➡️",
    unset: "✅ Bu chat guruhdan uzildi.",
    help: "<b>Buyruqlar</b>\n/today — bugungi darslar\n/tomorrow — ertangi darslar\n/week — haftalik jadval\n/group — guruhni tanlash\n/settings — sozlamalar\n/app — ilovani ochish\n\n<b>Guruh chatida</b>\n/setgroup — chatni guruhga ulash (admin)\n/unset — uzish (admin)",
    dataError: "Jadvalni yuklab bo'lmadi, birozdan so'ng qayta urinib ko'ring.",
    now: "Hozir"
  },
  ru: {
    days: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
    daysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    langName: "🇷🇺 Русский",
    chooseLang: "Tilni tanlang / Выберите язык / Choose language",
    welcome: "Здравствуйте! 👋\nЯ <b>TDIU Jadval</b> — бот расписания ТГЭУ.\n\n• Показываю расписание вашей группы\n• Сразу сообщаю об изменениях\n• Ищу преподавателей и аудитории\n\nСначала выберите группу 👇",
    chooseFaculty: "🏛 Выберите факультет:",
    chooseCourse: "🎓 Выберите курс:",
    chooseGroup: "👥 Выберите группу:",
    course: (n) => n ? `${n} курс` : "Другое",
    searchHint: "💡 Или напишите название группы, например: <code>MO-901</code>",
    groupSet: (g) => `✅ Группа сохранена: <b>${g}</b>`,
    groupSetChat: (g) => `✅ Этот чат привязан к группе <b>${g}</b>.

Каждое воскресенье вечером будет приходить расписание на неделю, а при изменениях — уведомление.`,
    noGroup: "Вы ещё не выбрали группу. Отправьте /group.",
    noGroupChat: "Чат ещё не привязан к группе. Админ чата должен отправить /setgroup.",
    noLessons: "Пар нет 🎉",
    freeDay: "Сегодня пар нет 🎉",
    today: "Сегодня",
    tomorrow: "Завтра",
    btnToday: "📅 Сегодня",
    btnTomorrow: "➡️ Завтра",
    btnWeek: "🗓 Неделя",
    btnSettings: "⚙️ Настройки",
    btnApp: "📱 Открыть приложение",
    btnFree: "🟢 Свободные",
    thisWeekShort: "Эта неделя",
    nextWeekShort: "След. неделя",
    btnOpenInApp: "📱 Открыть в приложении",
    weekTitle: (g, range) => `🗓 <b>Расписание на неделю</b> — ${g}
<i>${range}</i>`,
    changedTitle: (g) => `⚠️ <b>Расписание изменилось</b> — ${g}`,
    newTTTitle: (g) => `🆕 <b>Опубликовано новое расписание</b> — ${g}`,
    weekA: "Неделя A",
    weekB: "Неделя B",
    onlyAdmins: "Только админы чата могут выбирать группу.",
    notYourMenu: "Это меню не для вас.",
    addedToGroup: "Привет! 👋 Я бот расписания.\n\nАдмин чата, отправьте /setgroup и выберите группу — после этого сюда будут приходить расписание на неделю и изменения.",
    settings: "⚙️ <b>Настройки</b>",
    setGroup: (g) => `👥 Группа: ${g || "—"}`,
    setAlerts: (on) => `🔔 Уведомления об изменениях: ${on ? "вкл" : "выкл"}`,
    setWeekly: (on) => `🗓 Расписание на неделю: ${on ? "вкл" : "выкл"}`,
    setLang: "🌐 Язык",
    notFound: "Ничего не найдено. Проверьте название группы, например: MO-901",
    found: "Найдено:",
    back: "⬅️ Назад",
    more: "Ещё ➡️",
    unset: "✅ Чат отвязан от группы.",
    help: "<b>Команды</b>\n/today — пары на сегодня\n/tomorrow — пары на завтра\n/week — расписание на неделю\n/group — выбрать группу\n/settings — настройки\n/app — открыть приложение\n\n<b>В чате группы</b>\n/setgroup — привязать чат к группе (админ)\n/unset — отвязать (админ)",
    dataError: "Не удалось загрузить расписание, попробуйте чуть позже.",
    now: "Сейчас"
  },
  en: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    daysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    langName: "🇬🇧 English",
    chooseLang: "Tilni tanlang / Выберите язык / Choose language",
    welcome: "Hi! 👋\nI'm <b>TDIU Jadval</b>, the TSUE timetable bot.\n\n• I show your group's timetable\n• I tell you right away when it changes\n• I can find teachers and rooms\n\nFirst, pick your group 👇",
    chooseFaculty: "🏛 Choose your faculty:",
    chooseCourse: "🎓 Choose your year:",
    chooseGroup: "👥 Choose your group:",
    course: (n) => n ? `Year ${n}` : "Other",
    searchHint: "💡 Or type your group name, e.g. <code>MO-901</code>",
    groupSet: (g) => `✅ Group saved: <b>${g}</b>`,
    groupSetChat: (g) => `✅ This chat is now linked to <b>${g}</b>.

Every Sunday evening I'll post the week's timetable, and I'll post an alert whenever it changes.`,
    noGroup: "You haven't picked a group yet. Send /group.",
    noGroupChat: "This chat isn't linked to a group yet. A chat admin should send /setgroup.",
    noLessons: "No classes 🎉",
    freeDay: "No classes today 🎉",
    today: "Today",
    tomorrow: "Tomorrow",
    btnToday: "📅 Today",
    btnTomorrow: "➡️ Tomorrow",
    btnWeek: "🗓 Week",
    btnSettings: "⚙️ Settings",
    btnApp: "📱 Open app",
    btnFree: "🟢 Free rooms",
    thisWeekShort: "This week",
    nextWeekShort: "Next week",
    btnOpenInApp: "📱 Open in app",
    weekTitle: (g, range) => `🗓 <b>Weekly timetable</b> — ${g}
<i>${range}</i>`,
    changedTitle: (g) => `⚠️ <b>Timetable changed</b> — ${g}`,
    newTTTitle: (g) => `🆕 <b>New timetable published</b> — ${g}`,
    weekA: "Week A",
    weekB: "Week B",
    onlyAdmins: "Only chat admins can choose the group.",
    notYourMenu: "This menu is not for you.",
    addedToGroup: "Hi! 👋 I'm the timetable bot.\n\nA chat admin should send /setgroup and pick the group. After that I'll post the weekly timetable and changes here.",
    settings: "⚙️ <b>Settings</b>",
    setGroup: (g) => `👥 Group: ${g || "—"}`,
    setAlerts: (on) => `🔔 Change alerts: ${on ? "on" : "off"}`,
    setWeekly: (on) => `🗓 Weekly timetable: ${on ? "on" : "off"}`,
    setLang: "🌐 Language",
    notFound: "Nothing found. Check the group name, e.g. MO-901",
    found: "Found:",
    back: "⬅️ Back",
    more: "More ➡️",
    unset: "✅ This chat is no longer linked to a group.",
    help: "<b>Commands</b>\n/today — today's classes\n/tomorrow — tomorrow's classes\n/week — weekly timetable\n/group — choose group\n/settings — settings\n/app — open the app\n\n<b>In a group chat</b>\n/setgroup — link chat to a group (admin)\n/unset — unlink (admin)",
    dataError: "Couldn't load the timetable, please try again in a moment.",
    now: "Now"
  }
};
var tr = (lang) => T[lang] || T.uz;
var esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var TZ_MS = 5 * 3600 * 1e3;
var DAY_MS = 864e5;
function tashkentNow(ms = Date.now()) {
  return new Date(ms + TZ_MS);
}
var ymd = (d) => d.toISOString().slice(0, 10);
var addDays = (d, n) => new Date(d.getTime() + n * DAY_MS);
var weekday = (d) => (d.getUTCDay() + 6) % 7;
var mondayOf = (d) => {
  const m = addDays(d, -weekday(d));
  return new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth(), m.getUTCDate()));
};
function weekParity(weekA, date) {
  if (!weekA) return null;
  const base = mondayOf(/* @__PURE__ */ new Date(weekA + "T00:00:00Z"));
  const diff = Math.round((mondayOf(date) - base) / (7 * DAY_MS));
  return (diff % 2 + 2) % 2 === 0 ? "A" : "B";
}
function fmtDate(d, lang) {
  const L = tr(lang);
  const day = d.getUTCDate();
  const m = L.months[d.getUTCMonth()];
  return lang === "en" ? `${m} ${day}` : lang === "ru" ? `${day} ${m}` : `${day}-${m}`;
}
var dm = (d) => `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
var W = {
  uz: {
    lecture: "Ma'ruza",
    seminar: "Seminar",
    lab: "Laboratoriya",
    practice: "Amaliy",
    bld: (b) => `${b}-bino`,
    room: (r) => `${r}-xona`,
    count: (n) => `${n} ta dars`,
    pair: (n) => `${n}-para`,
    now: "🟢 Hozir",
    next: "⏭ Keyingi",
    brk: (m) => `☕ ${m} daqiqa tanaffus`,
    finish: (t) => `🏁 Darslar ${t} da tugaydi`,
    moved: "🔁 Vaqti o‘zgardi",
    roomCh: "🚪 Xona o‘zgardi",
    teachCh: "👤 O‘qituvchi o‘zgardi",
    removed: "❌ Bekor qilindi",
    added: "➕ Yangi dars",
    wkCap: (g, r, n) => `🗓 <b>${g}</b> — haftalik jadval
${r} · ${n} ta dars`,
    lessonsWeek: "Haftalik jadval",
    freeWeek: "Bu hafta dars yo'q 🎉",
    seeApp: "📱 Batafsil — ilovada"
  },
  ru: {
    lecture: "Лекция",
    seminar: "Семинар",
    lab: "Лабораторная",
    practice: "Практика",
    bld: (b) => `корпус ${b}`,
    room: (r) => `ауд. ${r}`,
    count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "пара" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "пары" : "пар"}`,
    pair: (n) => `${n} пара`,
    now: "🟢 Сейчас",
    next: "⏭ Следующая",
    brk: (m) => `☕ перерыв ${m} мин`,
    finish: (t) => `🏁 Пары закончатся в ${t}`,
    moved: "🔁 Изменилось время",
    roomCh: "🚪 Изменилась аудитория",
    teachCh: "👤 Изменился преподаватель",
    removed: "❌ Отменено",
    added: "➕ Новая пара",
    wkCap: (g, r, n) => `🗓 <b>${g}</b> — расписание на неделю
${r} · ${n} пар`,
    lessonsWeek: "Расписание на неделю",
    freeWeek: "На этой неделе пар нет 🎉",
    seeApp: "📱 Подробнее — в приложении"
  },
  en: {
    lecture: "Lecture",
    seminar: "Seminar",
    lab: "Lab",
    practice: "Practice",
    bld: (b) => `Building ${b}`,
    room: (r) => `Room ${r}`,
    count: (n) => `${n} class${n === 1 ? "" : "es"}`,
    pair: (n) => `Period ${n}`,
    now: "🟢 Now",
    next: "⏭ Next",
    brk: (m) => `☕ ${m} min break`,
    finish: (t) => `🏁 Classes end at ${t}`,
    moved: "🔁 Time changed",
    roomCh: "🚪 Room changed",
    teachCh: "👤 Teacher changed",
    removed: "❌ Cancelled",
    added: "➕ New class",
    wkCap: (g, r, n) => `🗓 <b>${g}</b> — weekly timetable
${r} · ${n} classes`,
    lessonsWeek: "Weekly timetable",
    freeWeek: "No classes this week 🎉",
    seeApp: "📱 More in the app"
  }
};
var words = (lang) => W[lang] || W.uz;
function parseSubject(s) {
  const m = /^(.*?)\s*\(([^()]+)\)\s*$/.exec(String(s || "").trim());
  if (!m) return { name: String(s || "").trim(), type: null };
  const t = m[2].toLowerCase().replace(/[^a-zа-я]/g, "");
  let type = null;
  if (/^(ma|maruza|lek|лек|lec)/.test(t)) type = "lecture";
  else if (/^(sem|сем)/.test(t)) type = "seminar";
  else if (/^(lab|лаб)/.test(t)) type = "lab";
  else if (/^(amal|пр|prac)/.test(t)) type = "practice";
  return type ? { name: m[1].trim(), type } : { name: String(s).trim(), type: null };
}
var typeLabel = (type, lang) => type ? words(lang)[type] : "";
function roomLabel(r, lang) {
  const w = words(lang);
  return String(r || "").split(", ").filter(Boolean).map((one) => {
    const m = /^(\d{1,2})\s*[-/]+\s*(\d{2,4}[A-Za-zА-Яа-я]?)(?:\s*-\s*\d+)?$/.exec(one.trim());
    return m ? `${w.bld(m[1])}, ${w.room(m[2])}` : one;
  }).join(" / ");
}
function lessonsForDay(group, dayIdx, parity) {
  return (group?.lessons || []).filter((l) => l.d === dayIdx && (!parity || !l.w || l.w === parity));
}
function times(periods, l) {
  const a = periods.find((p) => p.p === l.p);
  const b = periods.find((p) => p.p === l.p + (l.n || 1) - 1) || a;
  return { a: a ? a.start : "", b: b ? b.end : "" };
}
var mins = (t) => {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
};
function weekTag(l, lang, parity) {
  if (!l.w || parity) return "";
  return ` · <i>${l.w === "A" ? tr(lang).weekA : tr(lang).weekB}</i>`;
}
function fmtLesson(l, periods, lang, parity, state) {
  const w = words(lang);
  const t = times(periods, l);
  const sub = parseSubject(l.s);
  const head = `${state ? state + "\n" : ""}<b>${t.a} – ${t.b}</b>  ·  <i>${w.pair(l.p)}</i>${weekTag(l, lang, parity)}`;
  const lines = [head, `📘 <b>${esc(sub.name)}</b>${sub.type ? ` — ${typeLabel(sub.type, lang)}` : ""}${l.g ? ` <i>(${esc(l.g)})</i>` : ""}`];
  if (l.r) lines.push(`📍 ${esc(roomLabel(l.r, lang))}`);
  if (l.t) lines.push(`👤 ${esc(l.t)}`);
  return lines.join("\n");
}
function fmtLessonShort(l, periods, lang, parity) {
  const t = times(periods, l);
  const sub = parseSubject(l.s);
  let s = `<b>${t.a}</b> ${esc(sub.name)}`;
  if (sub.type) s += ` <i>(${typeLabel(sub.type, lang).toLowerCase()})</i>`;
  if (l.g) s += ` <i>[${esc(l.g)}]</i>`;
  if (l.r) s += ` · 📍${esc(l.r)}`;
  if (l.w && !parity) s += ` · <i>${l.w}</i>`;
  return s;
}
function fmtDay(group, index, date, lang, nowDate) {
  const L = tr(lang);
  const w = words(lang);
  const d = weekday(date);
  const parity = weekParity(index.weekA, date);
  const ls = d === 6 ? [] : lessonsForDay(group, d, parity);
  const head = [
    `📅 <b>${L.days[d]}, ${fmtDate(date, lang)}</b>` + (parity ? ` · ${parity === "A" ? L.weekA : L.weekB}` : ""),
    `👥 ${esc(group.name)}${ls.length ? ` · ${w.count(ls.length)}` : ""}`
  ].join("\n");
  if (!ls.length) return `${head}

${L.noLessons}`;
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
    let state = "";
    if (sameDay) {
      if (nowM >= mins(t.a) && nowM < mins(t.b)) state = w.now;
      else if (nowM < mins(t.a) && !nextMarked) {
        state = w.next;
        nextMarked = true;
      }
    }
    blocks.push(fmtLesson(l, index.periods, lang, parity, state));
  }
  const last = times(index.periods, ls[ls.length - 1]).b;
  return clip(`${head}
━━━━━━━━━━━━━━

${blocks.join("\n\n")}

${w.finish(last)}`);
}
function fmtWeek(group, index, monday, lang) {
  const L = tr(lang);
  const parity = weekParity(index.weekA, monday);
  const range = `${dm(monday)} – ${dm(addDays(monday, 5))}` + (parity ? ` · ${parity === "A" ? L.weekA : L.weekB}` : "");
  const parts = [L.weekTitle(esc(group.name), range)];
  for (let d = 0; d < 6; d++) {
    const ls = lessonsForDay(group, d, parity);
    if (!ls.length) continue;
    parts.push(`<b>${L.days[d]}</b>
${ls.map((l) => fmtLessonShort(l, index.periods, lang, parity)).join("\n")}`);
  }
  if (parts.length === 1) parts.push(words(lang).freeWeek);
  return clip(parts.join("\n\n"));
}
function fmtWeekCaption(group, index, monday, lang) {
  const w = words(lang);
  const L = tr(lang);
  const parity = weekParity(index.weekA, monday);
  const n = [0, 1, 2, 3, 4, 5].reduce((s, d) => s + lessonsForDay(group, d, parity).length, 0);
  const range = `${fmtDate(monday, lang)} – ${fmtDate(addDays(monday, 5), lang)}` + (parity ? ` · ${parity === "A" ? L.weekA : L.weekB}` : "");
  return w.wkCap(esc(group.name), range, n);
}
function clip(s) {
  if (s.length <= 4e3) return s;
  const cut = s.lastIndexOf("\n", 3950);
  return s.slice(0, cut > 0 ? cut : 3950) + "\n…";
}

// worker/worker.mjs
var PAGE = 30;
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (request.method === "POST" && url.pathname === "/tg") return await onWebhook(request, env);
      if (url.pathname === "/setup") return await onSetup(url, env);
      if (url.pathname.startsWith("/internal/")) return await onInternal(request, url, env);
      return new Response("TDIU Jadval bot is running ✅", { headers: { "content-type": "text/plain; charset=utf-8" } });
    } catch (e) {
      console.error(e.stack || e);
      if (url.pathname === "/tg") return new Response("ok");
      return new Response("Error: " + e.message, { status: 500 });
    }
  }
};
async function sha256hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
var webhookSecret = async (env) => (await sha256hex("tg:" + env.ADMIN_KEY)).slice(0, 48);
var siteUrl = (env) => String(env.SITE_URL || "").replace(/\/+$/, "");
async function tg(env, method, body) {
  const res = await fetch(`${env.TG_API || "https://api.telegram.org"}/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const j = await res.json().catch(() => ({ ok: false }));
  if (!j.ok && !/message is not modified/.test(j.description || "")) console.warn(method, j.description);
  return j;
}
var json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });
var cache = /* @__PURE__ */ new Map();
async function getData(env, file, ttlSec = 300) {
  const hit = cache.get(file);
  if (hit && hit.until > Date.now()) return hit.value;
  const res = await fetch(`${siteUrl(env)}/data/${file}`, { cf: { cacheTtl: ttlSec, cacheEverything: true } });
  if (!res.ok) {
    if (hit) return hit.value;
    if (res.status === 404) return null;
    throw new Error(`data ${file}: HTTP ${res.status}`);
  }
  const value = await res.json();
  cache.set(file, { value, until: Date.now() + ttlSec * 1e3 });
  return value;
}
var getIndex = (env) => getData(env, "index.json");
var getGroup = (env, id) => getData(env, `g/${id}.json`);
var schemaReady = false;
async function db(env) {
  if (!schemaReady) {
    await env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS chats (
        chat_id INTEGER PRIMARY KEY,
        kind TEXT NOT NULL,
        group_id TEXT,
        group_name TEXT,
        lang TEXT NOT NULL DEFAULT 'uz',
        alerts INTEGER NOT NULL DEFAULT 1,
        weekly INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER)`),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_chats_group ON chats(group_id)")
    ]);
    schemaReady = true;
  }
  return env.DB;
}
async function getChat(env, chatId) {
  return (await db(env)).prepare("SELECT * FROM chats WHERE chat_id = ?").bind(chatId).first();
}
async function ensureChat(env, chat, langCode) {
  let row = await getChat(env, chat.id);
  if (row) return { row, isNew: false };
  const kind = chat.type === "private" ? "private" : "group";
  row = {
    chat_id: chat.id,
    kind,
    group_id: null,
    group_name: null,
    lang: "uz",
    alerts: 1,
    weekly: kind === "group" ? 1 : 0
    // Uzbek is the default for everyone; changeable in the menu / settings
  };
  const now = Date.now();
  await (await db(env)).prepare("INSERT OR IGNORE INTO chats (chat_id, kind, lang, alerts, weekly, created_at, updated_at) VALUES (?,?,?,?,?,?,?)").bind(row.chat_id, kind, row.lang, row.alerts, row.weekly, now, now).run();
  return { row, isNew: true };
}
async function updateChat(env, chatId, fields) {
  const keys = Object.keys(fields);
  const sql = `UPDATE chats SET ${keys.map((k) => `${k} = ?`).join(", ")}, updated_at = ? WHERE chat_id = ?`;
  await (await db(env)).prepare(sql).bind(...keys.map((k) => fields[k]), Date.now(), chatId).run();
}
async function deleteChat(env, chatId) {
  await (await db(env)).prepare("DELETE FROM chats WHERE chat_id = ?").bind(chatId).run();
}
async function onSetup(url, env) {
  if (url.searchParams.get("key") !== env.ADMIN_KEY) return new Response("Wrong key", { status: 403 });
  const out = {};
  out.webhook = await tg(env, "setWebhook", {
    url: `${url.origin}/tg`,
    secret_token: await webhookSecret(env),
    allowed_updates: ["message", "callback_query", "my_chat_member"],
    drop_pending_updates: true
  });
  const cmds = {
    uz: [["today", "Bugungi darslar"], ["tomorrow", "Ertangi darslar"], ["week", "Haftalik jadval"], ["group", "Guruhni tanlash"], ["settings", "Sozlamalar"], ["app", "Ilovani ochish"], ["help", "Yordam"]],
    ru: [["today", "Пары на сегодня"], ["tomorrow", "Пары на завтра"], ["week", "Расписание на неделю"], ["group", "Выбрать группу"], ["settings", "Настройки"], ["app", "Открыть приложение"], ["help", "Помощь"]],
    en: [["today", "Today's classes"], ["tomorrow", "Tomorrow's classes"], ["week", "Weekly timetable"], ["group", "Choose group"], ["settings", "Settings"], ["app", "Open the app"], ["help", "Help"]]
  };
  const groupCmds = {
    uz: [["today", "Bugungi darslar"], ["tomorrow", "Ertangi darslar"], ["week", "Haftalik jadval"], ["setgroup", "Chatni guruhga ulash (admin)"], ["unset", "Uzish (admin)"]],
    ru: [["today", "Пары на сегодня"], ["tomorrow", "Пары на завтра"], ["week", "Расписание на неделю"], ["setgroup", "Привязать чат к группе (админ)"], ["unset", "Отвязать (админ)"]],
    en: [["today", "Today's classes"], ["tomorrow", "Tomorrow's classes"], ["week", "Weekly timetable"], ["setgroup", "Link chat to a group (admin)"], ["unset", "Unlink (admin)"]]
  };
  const toCmd = (l) => l.map(([command, description]) => ({ command, description }));
  for (const lang of LANGS) {
    const language_code = lang === "uz" ? void 0 : lang;
    out["cmd_private_" + lang] = await tg(env, "setMyCommands", { commands: toCmd(cmds[lang]), scope: { type: "all_private_chats" }, language_code });
    out["cmd_group_" + lang] = await tg(env, "setMyCommands", { commands: toCmd(groupCmds[lang]), scope: { type: "all_group_chats" }, language_code });
  }
  if (siteUrl(env)) {
    out.menu = await tg(env, "setChatMenuButton", { menu_button: { type: "web_app", text: "📅 Jadval", web_app: { url: siteUrl(env) + "/" } } });
  }
  out.description = await tg(env, "setMyShortDescription", { short_description: "Jadvalingiz, bo'sh xonalar va o'zgarishlar — hammasi bir joyda. Jadval o'zgarsa, birinchi siz bilasiz." });
  const ok = Object.values(out).every((r) => r.ok);
  return json({ ok, hint: ok ? "All set! Open your bot in Telegram and press Start." : "Some steps failed — see details.", ...out });
}
async function onInternal(request, url, env) {
  if (request.headers.get("x-admin-key") !== env.ADMIN_KEY) return new Response("Forbidden", { status: 403 });
  const D = await db(env);
  if (url.pathname === "/internal/subs") {
    const mode = url.searchParams.get("mode");
    const after = Number(url.searchParams.get("after") || "-9999999999999");
    const limit = Math.min(5e3, Number(url.searchParams.get("limit") || 2e3));
    const col = mode === "weekly" ? "weekly" : "alerts";
    const { results } = await D.prepare(`SELECT chat_id, kind, group_id, lang FROM chats WHERE ${col} = 1 AND group_id IS NOT NULL AND chat_id > ? ORDER BY chat_id LIMIT ?`).bind(after, limit).all();
    return json({ rows: results, next: results.length === limit ? results[results.length - 1].chat_id : null });
  }
  if (url.pathname === "/internal/cleanup" && request.method === "POST") {
    const body = await request.json();
    const stmts = [];
    for (const id of body.remove || []) stmts.push(D.prepare("DELETE FROM chats WHERE chat_id = ?").bind(id));
    for (const [from, to] of body.migrate || []) stmts.push(D.prepare("UPDATE OR REPLACE chats SET chat_id = ? WHERE chat_id = ?").bind(to, from));
    if (stmts.length) await D.batch(stmts);
    return json({ ok: true, removed: (body.remove || []).length, migrated: (body.migrate || []).length });
  }
  if (url.pathname === "/internal/stats") {
    const r = await D.prepare(`SELECT kind, COUNT(*) AS n, SUM(group_id IS NOT NULL) AS with_group FROM chats GROUP BY kind`).all();
    return json({ stats: r.results });
  }
  return new Response("Not found", { status: 404 });
}
async function onWebhook(request, env) {
  if (request.headers.get("x-telegram-bot-api-secret-token") !== await webhookSecret(env)) {
    return new Response("Forbidden", { status: 403 });
  }
  const update = await request.json();
  if (update.message) await onMessage(env, update.message);
  else if (update.callback_query) await onCallback(env, update.callback_query);
  else if (update.my_chat_member) await onMyChatMember(env, update.my_chat_member);
  return new Response("ok");
}
function mainKeyboard(env, lang, groupId) {
  const L = tr(lang);
  const rows = [
    [{ text: L.btnToday }, { text: L.btnTomorrow }],
    [{ text: L.btnWeek }, { text: L.btnSettings }]
  ];
  if (siteUrl(env)) rows.push([
    { text: L.btnApp, web_app: { url: appUrl(env, groupId, lang) } },
    { text: L.btnFree, web_app: { url: `${siteUrl(env)}/#tab=free&l=${lang}` } }
  ]);
  return { keyboard: rows, resize_keyboard: true, is_persistent: true };
}
function appUrl(env, groupId, lang) {
  return `${siteUrl(env)}/#${groupId ? `g=${groupId}&` : ""}l=${lang}`;
}
var BUTTONS = {};
for (const l of LANGS) {
  BUTTONS[T[l].btnToday] = "today";
  BUTTONS[T[l].btnTomorrow] = "tomorrow";
  BUTTONS[T[l].btnWeek] = "week";
  BUTTONS[T[l].btnSettings] = "settings";
}
function parseCommand(text) {
  const m = /^\/([a-zA-Z_]+)(?:@(\w+))?(?:\s+(.*))?$/s.exec(text || "");
  if (!m) return null;
  return { cmd: m[1].toLowerCase(), mention: m[2] || null, arg: (m[3] || "").trim() };
}
async function isAdmin(env, chatId, msgOrCb) {
  const msg = msgOrCb.message && msgOrCb.data !== void 0 ? null : msgOrCb;
  if (msg?.sender_chat && msg.sender_chat.id === chatId) return true;
  const userId = msgOrCb.from?.id;
  if (!userId) return false;
  const r = await tg(env, "getChatMember", { chat_id: chatId, user_id: userId });
  return r.ok && ["creator", "administrator"].includes(r.result.status);
}
async function send(env, chatId, text, extra = {}) {
  return tg(env, "sendMessage", { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra });
}
async function onMessage(env, msg) {
  const chat = msg.chat;
  if (msg.migrate_to_chat_id) {
    await (await db(env)).prepare("UPDATE OR REPLACE chats SET chat_id = ? WHERE chat_id = ?").bind(msg.migrate_to_chat_id, chat.id).run();
    return;
  }
  if (!msg.text) return;
  const command = parseCommand(msg.text);
  if (chat.type === "private") return onPrivate(env, msg, command);
  if (chat.type === "group" || chat.type === "supergroup") return onGroupChat(env, msg, command);
}
async function onPrivate(env, msg, command) {
  const { row, isNew } = await ensureChat(env, msg.chat, msg.from?.language_code);
  const lang = row.lang;
  const L = tr(lang);
  const uid = msg.from.id;
  const action = command ? command.cmd : BUTTONS[msg.text.trim()];
  if (action === "start") {
    const m = /^g_([a-z0-9]+)$/.exec(command.arg);
    if (m) return chooseGroup(env, msg.chat, uid, m[1], null, lang);
    await send(env, msg.chat.id, L.welcome, { reply_markup: mainKeyboard(env, lang, row.group_id) });
    if (!row.group_id) return showFaculties(env, msg.chat.id, uid, lang, null);
    return;
  }
  if (action === "help") return send(env, msg.chat.id, L.help, { reply_markup: mainKeyboard(env, lang, row.group_id) });
  if (action === "group" || action === "setgroup") return showFaculties(env, msg.chat.id, uid, lang, null);
  if (action === "lang" || action === "language") return askLanguage(env, msg.chat.id, "settings");
  if (action === "settings") return showSettings(env, msg.chat.id, row, null);
  if (action === "app") {
    return send(env, msg.chat.id, "📱", { reply_markup: { inline_keyboard: [[{ text: L.btnApp, web_app: { url: appUrl(env, row.group_id, lang) } }]] } });
  }
  if (action === "today" || action === "tomorrow" || action === "week") {
    if (!row.group_id) {
      await send(env, msg.chat.id, L.noGroup);
      return showFaculties(env, msg.chat.id, uid, lang, null);
    }
    return sendSchedule(env, msg.chat.id, row, action);
  }
  if (command) return send(env, msg.chat.id, L.help);
  return searchGroups(env, msg.chat.id, uid, lang, msg.text);
}
async function onGroupChat(env, msg, command) {
  if (!command) return;
  const { row } = await ensureChat(env, msg.chat, msg.from?.language_code);
  const lang = row.lang;
  const L = tr(lang);
  const { cmd } = command;
  if (cmd === "setgroup" || cmd === "group") {
    if (!await isAdmin(env, msg.chat.id, msg)) return send(env, msg.chat.id, L.onlyAdmins, { reply_to_message_id: msg.message_id });
    const uid = msg.sender_chat?.id === msg.chat.id ? 0 : msg.from.id;
    return showFaculties(env, msg.chat.id, uid, lang, null);
  }
  if (cmd === "unset") {
    if (!await isAdmin(env, msg.chat.id, msg)) return send(env, msg.chat.id, L.onlyAdmins, { reply_to_message_id: msg.message_id });
    await updateChat(env, msg.chat.id, { group_id: null, group_name: null });
    return send(env, msg.chat.id, L.unset);
  }
  if (cmd === "lang" || cmd === "language") {
    if (!await isAdmin(env, msg.chat.id, msg)) return send(env, msg.chat.id, L.onlyAdmins, { reply_to_message_id: msg.message_id });
    return askLanguage(env, msg.chat.id, "settings");
  }
  if (cmd === "today" || cmd === "tomorrow" || cmd === "week") {
    if (!row.group_id) return send(env, msg.chat.id, L.noGroupChat);
    return sendSchedule(env, msg.chat.id, row, cmd);
  }
  if (cmd === "start" || cmd === "help") return send(env, msg.chat.id, row.group_id ? L.help : L.addedToGroup);
}
async function onMyChatMember(env, upd) {
  const chat = upd.chat;
  const status = upd.new_chat_member?.status;
  if (status === "left" || status === "kicked") return deleteChat(env, chat.id);
  if (chat.type !== "private" && (status === "member" || status === "administrator")) {
    const old = upd.old_chat_member?.status;
    const { row } = await ensureChat(env, chat, upd.from?.language_code);
    if (old === "left" || old === "kicked" || !old) await send(env, chat.id, tr(row.lang).addedToGroup);
  }
}
async function sendSchedule(env, chatId, row, what) {
  const L = tr(row.lang);
  let index, group;
  try {
    [index, group] = await Promise.all([getIndex(env), getGroup(env, row.group_id)]);
  } catch {
    return send(env, chatId, L.dataError);
  }
  if (!group) return send(env, chatId, row.kind === "private" ? L.noGroup : L.noGroupChat);
  const now = tashkentNow();
  const extra = {};
  const kb = await appButton(env, row);
  if (kb) extra.reply_markup = kb;
  if (what === "week") {
    const monday = mondayOf(weekday(now) === 6 ? addDays(now, 1) : now);
    const photo = `${siteUrl(env)}/img/g/${group.id}.png?v=${group.v || index.tt?.num || ""}`;
    const r = await tg(env, "sendPhoto", { chat_id: chatId, photo, caption: fmtWeekCaption(group, index, monday, row.lang), parse_mode: "HTML", ...extra });
    if (r.ok) return r;
    return send(env, chatId, fmtWeek(group, index, monday, row.lang), extra);
  }
  const date = what === "tomorrow" ? addDays(now, 1) : now;
  return send(env, chatId, fmtDay(group, index, date, row.lang, now), { reply_markup: dayKeyboard(row.lang, date, now, kb) });
}
function dayKeyboard(lang, date, now, extraKb) {
  const L = tr(lang);
  const baseMon = mondayOf(weekday(now) === 6 ? addDays(now, 1) : now);
  const off = Math.round((mondayOf(date) - baseMon) / (7 * 864e5));
  const sel = weekday(date);
  const days = [0, 1, 2, 3, 4, 5].map((d) => ({ text: d === sel ? `• ${L.daysShort[d]} •` : L.daysShort[d], callback_data: `day:${d}:${off}` }));
  const nav = [];
  if (off > 0) nav.push({ text: `◀ ${L.thisWeekShort}`, callback_data: `day:${sel}:${off - 1}` });
  if (off < 1) nav.push({ text: `${L.nextWeekShort} ▶`, callback_data: `day:0:${off + 1}` });
  nav.push({ text: L.btnWeek, callback_data: `wk:${off}` });
  const rows = [days.slice(0, 6), nav];
  if (extraKb?.inline_keyboard) rows.push(...extraKb.inline_keyboard);
  return { inline_keyboard: rows };
}
async function onDayTab(env, row, msg, d, off) {
  const [index, group] = await Promise.all([getIndex(env), getGroup(env, row.group_id)]);
  if (!group) return;
  const now = tashkentNow();
  const baseMon = mondayOf(weekday(now) === 6 ? addDays(now, 1) : now);
  const date = addDays(baseMon, Math.max(0, Math.min(1, off)) * 7 + Math.max(0, Math.min(5, d)));
  return tg(env, "editMessageText", {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    text: fmtDay(group, index, date, row.lang, now),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: dayKeyboard(row.lang, date, now, await appButton(env, row))
  });
}
var botName = null;
async function appButton(env, row) {
  const L = tr(row.lang);
  if (!siteUrl(env)) return null;
  if (row.kind === "private") return { inline_keyboard: [[{ text: L.btnOpenInApp, web_app: { url: appUrl(env, row.group_id, row.lang) } }]] };
  if (!botName) botName = (await tg(env, "getMe", {})).result?.username || null;
  return botName ? { inline_keyboard: [[{ text: L.btnOpenInApp, url: `https://t.me/${botName}?start=g_${row.group_id}` }]] } : null;
}
async function askLanguage(env, chatId, next, messageId) {
  const kb = { inline_keyboard: LANGS.map((l) => [{ text: T[l].langName, callback_data: `lang:${l}:${next}` }]) };
  if (messageId) return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text: T.uz.chooseLang, reply_markup: kb });
  return send(env, chatId, T.uz.chooseLang, { reply_markup: kb });
}
async function showFaculties(env, chatId, uid, lang, messageId) {
  const L = tr(lang);
  let index;
  try {
    index = await getIndex(env);
  } catch {
    return send(env, chatId, L.dataError);
  }
  const kb = index.faculties.map((f, i) => [{ text: `🏛 ${f.name}`, callback_data: `f:${uid}:${i}` }]);
  kb.push(langRow(lang, `pick:${uid}`));
  const text = `${L.chooseFaculty}

${L.searchHint}`;
  if (messageId) return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
  return send(env, chatId, text, { reply_markup: { inline_keyboard: kb } });
}
function langRow(current, suffix) {
  return LANGS.map((l) => ({ text: T[l].langName.replace(/^(\S+)\s.*$/, "$1") + " " + { uz: "O'zbek", ru: "Рус", en: "Eng" }[l] + (l === current ? " ✓" : ""), callback_data: `lang:${l}:${suffix}` }));
}
async function showCourses(env, chatId, uid, lang, fi, messageId) {
  const L = tr(lang);
  const index = await getIndex(env);
  const fac = index.faculties[fi];
  if (!fac) return showFaculties(env, chatId, uid, lang, messageId);
  if (fac.courses.length === 1) return showGroups(env, chatId, uid, lang, fi, 0, 0, messageId);
  const kb = [];
  for (let i = 0; i < fac.courses.length; i += 2) {
    kb.push(fac.courses.slice(i, i + 2).map((c, j) => ({ text: `🎓 ${L.course(c.name)}`, callback_data: `c:${uid}:${fi}:${i + j}:0` })));
  }
  kb.push([{ text: L.back, callback_data: `F:${uid}` }]);
  return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text: `🏛 <b>${esc(fac.name)}</b>
${L.chooseCourse}`, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
}
async function showGroups(env, chatId, uid, lang, fi, ci, page, messageId) {
  const L = tr(lang);
  const index = await getIndex(env);
  const fac = index.faculties[fi];
  const course = fac?.courses[ci];
  if (!course) return showFaculties(env, chatId, uid, lang, messageId);
  const slice = course.groups.slice(page * PAGE, page * PAGE + PAGE);
  const kb = [];
  for (let i = 0; i < slice.length; i += 3) {
    kb.push(slice.slice(i, i + 3).map(([id, name]) => ({ text: name, callback_data: `g:${uid}:${id}` })));
  }
  const nav = [];
  nav.push({ text: L.back, callback_data: fac.courses.length > 1 ? `f:${uid}:${fi}` : `F:${uid}` });
  if (page > 0) nav.push({ text: "⬅️", callback_data: `c:${uid}:${fi}:${ci}:${page - 1}` });
  if ((page + 1) * PAGE < course.groups.length) nav.push({ text: L.more, callback_data: `c:${uid}:${fi}:${ci}:${page + 1}` });
  kb.push(nav);
  const title = `🏛 <b>${esc(fac.name)}</b>${course.name ? ` · ${L.course(course.name)}` : ""}
${L.chooseGroup}`;
  return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text: title, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
}
var norm = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9А-ЯЁ]/g, "");
async function searchGroups(env, chatId, uid, lang, query) {
  const L = tr(lang);
  const q = norm(query);
  if (q.length < 2) return send(env, chatId, L.notFound);
  let index;
  try {
    index = await getIndex(env);
  } catch {
    return send(env, chatId, L.dataError);
  }
  const hits = [];
  for (const f of index.faculties) for (const c of f.courses) for (const [id, name] of c.groups) {
    const n = norm(name);
    if (n.includes(q)) hits.push([id, name, n.startsWith(q) ? 0 : 1]);
  }
  if (!hits.length) return send(env, chatId, L.notFound);
  hits.sort((a, b) => a[2] - b[2] || a[1].localeCompare(b[1], void 0, { numeric: true }));
  const top = hits.slice(0, 24);
  const kb = [];
  for (let i = 0; i < top.length; i += 3) kb.push(top.slice(i, i + 3).map(([id, name]) => ({ text: name, callback_data: `g:${uid}:${id}` })));
  return send(env, chatId, `🔎 ${L.found}`, { reply_markup: { inline_keyboard: kb } });
}
async function findGroupName(env, id) {
  const index = await getIndex(env);
  for (const f of index.faculties) for (const c of f.courses) for (const [gid, name] of c.groups) if (gid === id) return name;
  return null;
}
async function chooseGroup(env, chat, uid, groupId, messageId, langHint) {
  const { row } = await ensureChat(env, chat, null);
  const lang = row.lang || langHint;
  const L = tr(lang);
  const name = await findGroupName(env, groupId);
  if (!name) return send(env, chat.id, L.notFound);
  await updateChat(env, chat.id, { group_id: groupId, group_name: name });
  const isPrivate = chat.type === "private";
  const text = isPrivate ? L.groupSet(esc(name)) : L.groupSetChat(esc(name));
  const markup = isPrivate ? void 0 : { inline_keyboard: [langRow(lang, "chat")] };
  if (messageId) await tg(env, "editMessageText", { chat_id: chat.id, message_id: messageId, text, parse_mode: "HTML", reply_markup: markup });
  else await send(env, chat.id, text, markup ? { reply_markup: markup } : {});
  const updated = { ...row, group_id: groupId, group_name: name };
  if (isPrivate) {
    const [index, group] = await Promise.all([getIndex(env), getGroup(env, groupId)]);
    if (group) await send(env, chat.id, fmtDay(group, index, tashkentNow(), lang, tashkentNow()), { reply_markup: mainKeyboard(env, lang, groupId) });
  } else {
    await sendSchedule(env, chat.id, updated, "week");
  }
}
async function showSettings(env, chatId, row, messageId) {
  const L = tr(row.lang);
  const text = [L.settings, "", L.setGroup(esc(row.group_name)), L.setAlerts(!!row.alerts), L.setWeekly(!!row.weekly)].join("\n");
  const kb = {
    inline_keyboard: [
      [{ text: L.setAlerts(!!row.alerts), callback_data: "s:alerts" }],
      [{ text: L.setWeekly(!!row.weekly), callback_data: "s:weekly" }],
      [{ text: L.setLang, callback_data: "s:lang" }, { text: "👥 " + (row.group_name || "—"), callback_data: "s:group" }]
    ]
  };
  if (messageId) return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", reply_markup: kb });
  return send(env, chatId, text, { reply_markup: kb });
}
async function onCallback(env, cb) {
  const msg = cb.message;
  if (!msg) return tg(env, "answerCallbackQuery", { callback_query_id: cb.id });
  const chat = msg.chat;
  const chatId = chat.id;
  const parts = String(cb.data || "").split(":");
  const kind = parts[0];
  const { row } = await ensureChat(env, chat, cb.from?.language_code);
  const lang = row.lang;
  const L = tr(lang);
  const isGroupChat = chat.type !== "private";
  if (["f", "c", "F", "g"].includes(kind)) {
    const uid = Number(parts[1]);
    if (uid === 0 ? !await isAdmin(env, chatId, cb) : uid !== cb.from.id) {
      return tg(env, "answerCallbackQuery", { callback_query_id: cb.id, text: uid === 0 ? L.onlyAdmins : L.notYourMenu, show_alert: true });
    }
  }
  if (isGroupChat && (kind === "s" || kind === "lang") && !await isAdmin(env, chatId, cb)) {
    return tg(env, "answerCallbackQuery", { callback_query_id: cb.id, text: L.onlyAdmins, show_alert: true });
  }
  tg(env, "answerCallbackQuery", { callback_query_id: cb.id });
  if (kind === "lang") {
    const newLang = LANGS.includes(parts[1]) ? parts[1] : "uz";
    await updateChat(env, chatId, { lang: newLang });
    const L2 = tr(newLang);
    if (parts[2] === "pick") return showFaculties(env, chatId, parts[3], newLang, msg.message_id);
    if (parts[2] === "chat") {
      return tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: L2.groupSetChat(esc(row.group_name || "")), parse_mode: "HTML", reply_markup: { inline_keyboard: [langRow(newLang, "chat")] } });
    }
    if (parts[2] === "start") {
      await tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: L2.langName });
      await send(env, chatId, L2.welcome, { reply_markup: mainKeyboard(env, newLang, row.group_id) });
      if (!row.group_id) return showFaculties(env, chatId, cb.from.id, newLang, null);
      return;
    }
    await tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: "✅ " + L2.langName });
    if (!isGroupChat) await send(env, chatId, "👌", { reply_markup: mainKeyboard(env, newLang, row.group_id) });
    return;
  }
  if (kind === "day") {
    if (!row.group_id) return;
    return onDayTab(env, row, msg, Number(parts[1]), Number(parts[2]));
  }
  if (kind === "wk") {
    if (!row.group_id) return;
    return sendSchedule(env, chatId, row, "week");
  }
  if (kind === "F") return showFaculties(env, chatId, parts[1], lang, msg.message_id);
  if (kind === "f") return showCourses(env, chatId, parts[1], lang, Number(parts[2]), msg.message_id);
  if (kind === "c") return showGroups(env, chatId, parts[1], lang, Number(parts[2]), Number(parts[3]), Number(parts[4]), msg.message_id);
  if (kind === "g") return chooseGroup(env, chat, Number(parts[1]), parts[2], msg.message_id, lang);
  if (kind === "s") {
    const what = parts[1];
    if (what === "alerts" || what === "weekly") {
      const val = row[what] ? 0 : 1;
      await updateChat(env, chatId, { [what]: val });
      return showSettings(env, chatId, { ...row, [what]: val }, msg.message_id);
    }
    if (what === "lang") return askLanguage(env, chatId, "settings", msg.message_id);
    if (what === "group") return showFaculties(env, chatId, isGroupChat ? cb.from.id : cb.from.id, lang, msg.message_id);
  }
}
export {
  worker_default as default
};
