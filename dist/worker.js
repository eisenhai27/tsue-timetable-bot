// TDIU Jadval bot — ONE-FILE version for pasting into the Cloudflare dashboard.

// src/shared.mjs
var LANGS = ["uz", "ru", "en"];
var T = {
  uz: {
    days: ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"],
    daysShort: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
    months: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
    langName: "\u{1F1FA}\u{1F1FF} O'zbekcha",
    chooseLang: "Tilni tanlang / \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u044F\u0437\u044B\u043A / Choose language",
    welcome: "Assalomu alaykum! \u{1F44B}\nMen <b>TDIU Jadval</b> botiman.\n\n\u2022 Guruhingiz jadvalini ko'rsataman\n\u2022 Jadval o'zgarsa darhol xabar beraman\n\u2022 O'qituvchi va xonalarni qidiraman\n\nAvval guruhingizni tanlang \u{1F447}",
    chooseFaculty: "\u{1F3DB} Fakultetni tanlang:",
    chooseCourse: "\u{1F393} Kursni tanlang:",
    chooseGroup: "\u{1F465} Guruhni tanlang:",
    course: (n) => n ? `${n}-kurs` : "Boshqa",
    searchHint: "\u{1F4A1} Yoki guruh nomini yozing, masalan: <code>MO-901</code>",
    groupSet: (g) => `\u2705 Guruh saqlandi: <b>${g}</b>`,
    groupSetChat: (g) => `\u2705 Bu chat <b>${g}</b> guruhiga ulandi.

Har yakshanba kechqurun haftalik jadval yuboriladi va jadval o'zgarsa darhol xabar beriladi.`,
    noGroup: "Siz hali guruh tanlamagansiz. /group buyrug'ini yuboring.",
    noGroupChat: "Bu chat hali guruhga ulanmagan. Chat admini /setgroup yuborsin.",
    noLessons: "Dars yo'q \u{1F389}",
    freeDay: "Bugun dars yo'q \u{1F389}",
    today: "Bugun",
    tomorrow: "Ertaga",
    btnToday: "\u{1F4C5} Bugun",
    btnTomorrow: "\u27A1\uFE0F Ertaga",
    btnWeek: "\u{1F5D3} Hafta",
    btnSettings: "\u2699\uFE0F Sozlamalar",
    btnApp: "\u{1F4F1} Ilovani ochish",
    btnFree: "\u{1F7E2} Bo'sh xonalar",
    thisWeekShort: "Shu hafta",
    nextWeekShort: "Keyingi hafta",
    btnOpenInApp: "\u{1F4F1} Ilovada ochish",
    weekTitle: (g, range) => `\u{1F5D3} <b>Haftalik jadval</b> \u2014 ${g}
<i>${range}</i>`,
    changedTitle: (g) => `\u26A0\uFE0F <b>Jadval o'zgardi</b> \u2014 ${g}`,
    newTTTitle: (g) => `\u{1F195} <b>Yangi jadval e'lon qilindi</b> \u2014 ${g}`,
    weekA: "A hafta",
    weekB: "B hafta",
    onlyAdmins: "Faqat chat adminlari guruhni tanlashi mumkin.",
    notYourMenu: "Bu menyu sizga tegishli emas.",
    addedToGroup: "Salom! \u{1F44B} Men dars jadvali botiman.\n\nChat admini /setgroup yuborib guruhni tanlasin \u2014 shundan so'ng haftalik jadval va o'zgarishlar shu yerga yuboriladi.",
    settings: "\u2699\uFE0F <b>Sozlamalar</b>",
    setGroup: (g) => `\u{1F465} Guruh: ${g || "\u2014"}`,
    setAlerts: (on) => `\u{1F514} O'zgarish xabarlari: ${on ? "yoqilgan" : "o'chirilgan"}`,
    setWeekly: (on) => `\u{1F5D3} Haftalik jadval: ${on ? "yoqilgan" : "o'chirilgan"}`,
    setLang: "\u{1F310} Til",
    notFound: "Hech narsa topilmadi. Guruh nomini tekshiring, masalan: MO-901",
    found: "Topildi:",
    back: "\u2B05\uFE0F Orqaga",
    more: "Yana \u27A1\uFE0F",
    unset: "\u2705 Bu chat guruhdan uzildi.",
    help: "<b>Buyruqlar</b>\n/today \u2014 bugungi darslar\n/tomorrow \u2014 ertangi darslar\n/week \u2014 haftalik jadval\n/group \u2014 guruhni tanlash\n/settings \u2014 sozlamalar\n/app \u2014 ilovani ochish\n\n<b>Guruh chatida</b>\n/setgroup \u2014 chatni guruhga ulash (admin)\n/unset \u2014 uzish (admin)",
    dataError: "Jadvalni yuklab bo'lmadi, birozdan so'ng qayta urinib ko'ring.",
    now: "Hozir"
  },
  ru: {
    days: ["\u041F\u043E\u043D\u0435\u0434\u0435\u043B\u044C\u043D\u0438\u043A", "\u0412\u0442\u043E\u0440\u043D\u0438\u043A", "\u0421\u0440\u0435\u0434\u0430", "\u0427\u0435\u0442\u0432\u0435\u0440\u0433", "\u041F\u044F\u0442\u043D\u0438\u0446\u0430", "\u0421\u0443\u0431\u0431\u043E\u0442\u0430", "\u0412\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435"],
    daysShort: ["\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431", "\u0412\u0441"],
    months: ["\u044F\u043D\u0432\u0430\u0440\u044F", "\u0444\u0435\u0432\u0440\u0430\u043B\u044F", "\u043C\u0430\u0440\u0442\u0430", "\u0430\u043F\u0440\u0435\u043B\u044F", "\u043C\u0430\u044F", "\u0438\u044E\u043D\u044F", "\u0438\u044E\u043B\u044F", "\u0430\u0432\u0433\u0443\u0441\u0442\u0430", "\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044F", "\u043E\u043A\u0442\u044F\u0431\u0440\u044F", "\u043D\u043E\u044F\u0431\u0440\u044F", "\u0434\u0435\u043A\u0430\u0431\u0440\u044F"],
    langName: "\u{1F1F7}\u{1F1FA} \u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    chooseLang: "Tilni tanlang / \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u044F\u0437\u044B\u043A / Choose language",
    welcome: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u{1F44B}\n\u042F <b>TDIU Jadval</b> \u2014 \u0431\u043E\u0442 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u0422\u0413\u042D\u0423.\n\n\u2022 \u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0432\u0430\u0448\u0435\u0439 \u0433\u0440\u0443\u043F\u043F\u044B\n\u2022 \u0421\u0440\u0430\u0437\u0443 \u0441\u043E\u043E\u0431\u0449\u0430\u044E \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445\n\u2022 \u0418\u0449\u0443 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \u0438 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438\n\n\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443 \u{1F447}",
    chooseFaculty: "\u{1F3DB} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442:",
    chooseCourse: "\u{1F393} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0443\u0440\u0441:",
    chooseGroup: "\u{1F465} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443:",
    course: (n) => n ? `${n} \u043A\u0443\u0440\u0441` : "\u0414\u0440\u0443\u0433\u043E\u0435",
    searchHint: "\u{1F4A1} \u0418\u043B\u0438 \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: <code>MO-901</code>",
    groupSet: (g) => `\u2705 \u0413\u0440\u0443\u043F\u043F\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430: <b>${g}</b>`,
    groupSetChat: (g) => `\u2705 \u042D\u0442\u043E\u0442 \u0447\u0430\u0442 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0433\u0440\u0443\u043F\u043F\u0435 <b>${g}</b>.

\u041A\u0430\u0436\u0434\u043E\u0435 \u0432\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435 \u0432\u0435\u0447\u0435\u0440\u043E\u043C \u0431\u0443\u0434\u0435\u0442 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u044C \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E, \u0430 \u043F\u0440\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445 \u2014 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435.`,
    noGroup: "\u0412\u044B \u0435\u0449\u0451 \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u0433\u0440\u0443\u043F\u043F\u0443. \u041E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 /group.",
    noGroupChat: "\u0427\u0430\u0442 \u0435\u0449\u0451 \u043D\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0433\u0440\u0443\u043F\u043F\u0435. \u0410\u0434\u043C\u0438\u043D \u0447\u0430\u0442\u0430 \u0434\u043E\u043B\u0436\u0435\u043D \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C /setgroup.",
    noLessons: "\u041F\u0430\u0440 \u043D\u0435\u0442 \u{1F389}",
    freeDay: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u0430\u0440 \u043D\u0435\u0442 \u{1F389}",
    today: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F",
    tomorrow: "\u0417\u0430\u0432\u0442\u0440\u0430",
    btnToday: "\u{1F4C5} \u0421\u0435\u0433\u043E\u0434\u043D\u044F",
    btnTomorrow: "\u27A1\uFE0F \u0417\u0430\u0432\u0442\u0440\u0430",
    btnWeek: "\u{1F5D3} \u041D\u0435\u0434\u0435\u043B\u044F",
    btnSettings: "\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
    btnApp: "\u{1F4F1} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
    btnFree: "\u{1F7E2} \u0421\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435",
    thisWeekShort: "\u042D\u0442\u0430 \u043D\u0435\u0434\u0435\u043B\u044F",
    nextWeekShort: "\u0421\u043B\u0435\u0434. \u043D\u0435\u0434\u0435\u043B\u044F",
    btnOpenInApp: "\u{1F4F1} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438",
    weekTitle: (g, range) => `\u{1F5D3} <b>\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E</b> \u2014 ${g}
<i>${range}</i>`,
    changedTitle: (g) => `\u26A0\uFE0F <b>\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u043E\u0441\u044C</b> \u2014 ${g}`,
    newTTTitle: (g) => `\u{1F195} <b>\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435</b> \u2014 ${g}`,
    weekA: "\u041D\u0435\u0434\u0435\u043B\u044F A",
    weekB: "\u041D\u0435\u0434\u0435\u043B\u044F B",
    onlyAdmins: "\u0422\u043E\u043B\u044C\u043A\u043E \u0430\u0434\u043C\u0438\u043D\u044B \u0447\u0430\u0442\u0430 \u043C\u043E\u0433\u0443\u0442 \u0432\u044B\u0431\u0438\u0440\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443.",
    notYourMenu: "\u042D\u0442\u043E \u043C\u0435\u043D\u044E \u043D\u0435 \u0434\u043B\u044F \u0432\u0430\u0441.",
    addedToGroup: "\u041F\u0440\u0438\u0432\u0435\u0442! \u{1F44B} \u042F \u0431\u043E\u0442 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F.\n\n\u0410\u0434\u043C\u0438\u043D \u0447\u0430\u0442\u0430, \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 /setgroup \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443 \u2014 \u043F\u043E\u0441\u043B\u0435 \u044D\u0442\u043E\u0433\u043E \u0441\u044E\u0434\u0430 \u0431\u0443\u0434\u0443\u0442 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u044C \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E \u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F.",
    settings: "\u2699\uFE0F <b>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</b>",
    setGroup: (g) => `\u{1F465} \u0413\u0440\u0443\u043F\u043F\u0430: ${g || "\u2014"}`,
    setAlerts: (on) => `\u{1F514} \u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445: ${on ? "\u0432\u043A\u043B" : "\u0432\u044B\u043A\u043B"}`,
    setWeekly: (on) => `\u{1F5D3} \u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E: ${on ? "\u0432\u043A\u043B" : "\u0432\u044B\u043A\u043B"}`,
    setLang: "\u{1F310} \u042F\u0437\u044B\u043A",
    notFound: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: MO-901",
    found: "\u041D\u0430\u0439\u0434\u0435\u043D\u043E:",
    back: "\u2B05\uFE0F \u041D\u0430\u0437\u0430\u0434",
    more: "\u0415\u0449\u0451 \u27A1\uFE0F",
    unset: "\u2705 \u0427\u0430\u0442 \u043E\u0442\u0432\u044F\u0437\u0430\u043D \u043E\u0442 \u0433\u0440\u0443\u043F\u043F\u044B.",
    help: "<b>\u041A\u043E\u043C\u0430\u043D\u0434\u044B</b>\n/today \u2014 \u043F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F\n/tomorrow \u2014 \u043F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430\n/week \u2014 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E\n/group \u2014 \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443\n/settings \u2014 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438\n/app \u2014 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435\n\n<b>\u0412 \u0447\u0430\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u044B</b>\n/setgroup \u2014 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u0447\u0430\u0442 \u043A \u0433\u0440\u0443\u043F\u043F\u0435 (\u0430\u0434\u043C\u0438\u043D)\n/unset \u2014 \u043E\u0442\u0432\u044F\u0437\u0430\u0442\u044C (\u0430\u0434\u043C\u0438\u043D)",
    dataError: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435.",
    now: "\u0421\u0435\u0439\u0447\u0430\u0441"
  },
  en: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    daysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    langName: "\u{1F1EC}\u{1F1E7} English",
    chooseLang: "Tilni tanlang / \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u044F\u0437\u044B\u043A / Choose language",
    welcome: "Hi! \u{1F44B}\nI'm <b>TDIU Jadval</b>, the TSUE timetable bot.\n\n\u2022 I show your group's timetable\n\u2022 I tell you right away when it changes\n\u2022 I can find teachers and rooms\n\nFirst, pick your group \u{1F447}",
    chooseFaculty: "\u{1F3DB} Choose your faculty:",
    chooseCourse: "\u{1F393} Choose your year:",
    chooseGroup: "\u{1F465} Choose your group:",
    course: (n) => n ? `Year ${n}` : "Other",
    searchHint: "\u{1F4A1} Or type your group name, e.g. <code>MO-901</code>",
    groupSet: (g) => `\u2705 Group saved: <b>${g}</b>`,
    groupSetChat: (g) => `\u2705 This chat is now linked to <b>${g}</b>.

Every Sunday evening I'll post the week's timetable, and I'll post an alert whenever it changes.`,
    noGroup: "You haven't picked a group yet. Send /group.",
    noGroupChat: "This chat isn't linked to a group yet. A chat admin should send /setgroup.",
    noLessons: "No classes \u{1F389}",
    freeDay: "No classes today \u{1F389}",
    today: "Today",
    tomorrow: "Tomorrow",
    btnToday: "\u{1F4C5} Today",
    btnTomorrow: "\u27A1\uFE0F Tomorrow",
    btnWeek: "\u{1F5D3} Week",
    btnSettings: "\u2699\uFE0F Settings",
    btnApp: "\u{1F4F1} Open app",
    btnFree: "\u{1F7E2} Free rooms",
    thisWeekShort: "This week",
    nextWeekShort: "Next week",
    btnOpenInApp: "\u{1F4F1} Open in app",
    weekTitle: (g, range) => `\u{1F5D3} <b>Weekly timetable</b> \u2014 ${g}
<i>${range}</i>`,
    changedTitle: (g) => `\u26A0\uFE0F <b>Timetable changed</b> \u2014 ${g}`,
    newTTTitle: (g) => `\u{1F195} <b>New timetable published</b> \u2014 ${g}`,
    weekA: "Week A",
    weekB: "Week B",
    onlyAdmins: "Only chat admins can choose the group.",
    notYourMenu: "This menu is not for you.",
    addedToGroup: "Hi! \u{1F44B} I'm the timetable bot.\n\nA chat admin should send /setgroup and pick the group. After that I'll post the weekly timetable and changes here.",
    settings: "\u2699\uFE0F <b>Settings</b>",
    setGroup: (g) => `\u{1F465} Group: ${g || "\u2014"}`,
    setAlerts: (on) => `\u{1F514} Change alerts: ${on ? "on" : "off"}`,
    setWeekly: (on) => `\u{1F5D3} Weekly timetable: ${on ? "on" : "off"}`,
    setLang: "\u{1F310} Language",
    notFound: "Nothing found. Check the group name, e.g. MO-901",
    found: "Found:",
    back: "\u2B05\uFE0F Back",
    more: "More \u27A1\uFE0F",
    unset: "\u2705 This chat is no longer linked to a group.",
    help: "<b>Commands</b>\n/today \u2014 today's classes\n/tomorrow \u2014 tomorrow's classes\n/week \u2014 weekly timetable\n/group \u2014 choose group\n/settings \u2014 settings\n/app \u2014 open the app\n\n<b>In a group chat</b>\n/setgroup \u2014 link chat to a group (admin)\n/unset \u2014 unlink (admin)",
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
    now: "\u{1F7E2} Hozir",
    next: "\u23ED Keyingi",
    brk: (m) => `\u2615 ${m} daqiqa tanaffus`,
    finish: (t) => `\u{1F3C1} Darslar ${t} da tugaydi`,
    moved: "\u{1F501} Vaqti o\u2018zgardi",
    roomCh: "\u{1F6AA} Xona o\u2018zgardi",
    teachCh: "\u{1F464} O\u2018qituvchi o\u2018zgardi",
    removed: "\u274C Bekor qilindi",
    added: "\u2795 Yangi dars",
    wkCap: (g, r, n) => `\u{1F5D3} <b>${g}</b> \u2014 haftalik jadval
${r} \xB7 ${n} ta dars`,
    lessonsWeek: "Haftalik jadval",
    freeWeek: "Bu hafta dars yo'q \u{1F389}",
    seeApp: "\u{1F4F1} Batafsil \u2014 ilovada"
  },
  ru: {
    lecture: "\u041B\u0435\u043A\u0446\u0438\u044F",
    seminar: "\u0421\u0435\u043C\u0438\u043D\u0430\u0440",
    lab: "\u041B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u043D\u0430\u044F",
    practice: "\u041F\u0440\u0430\u043A\u0442\u0438\u043A\u0430",
    bld: (b) => `\u043A\u043E\u0440\u043F\u0443\u0441 ${b}`,
    room: (r) => `\u0430\u0443\u0434. ${r}`,
    count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "\u043F\u0430\u0440\u0430" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "\u043F\u0430\u0440\u044B" : "\u043F\u0430\u0440"}`,
    pair: (n) => `${n} \u043F\u0430\u0440\u0430`,
    now: "\u{1F7E2} \u0421\u0435\u0439\u0447\u0430\u0441",
    next: "\u23ED \u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F",
    brk: (m) => `\u2615 \u043F\u0435\u0440\u0435\u0440\u044B\u0432 ${m} \u043C\u0438\u043D`,
    finish: (t) => `\u{1F3C1} \u041F\u0430\u0440\u044B \u0437\u0430\u043A\u043E\u043D\u0447\u0430\u0442\u0441\u044F \u0432 ${t}`,
    moved: "\u{1F501} \u0418\u0437\u043C\u0435\u043D\u0438\u043B\u043E\u0441\u044C \u0432\u0440\u0435\u043C\u044F",
    roomCh: "\u{1F6AA} \u0418\u0437\u043C\u0435\u043D\u0438\u043B\u0430\u0441\u044C \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F",
    teachCh: "\u{1F464} \u0418\u0437\u043C\u0435\u043D\u0438\u043B\u0441\u044F \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C",
    removed: "\u274C \u041E\u0442\u043C\u0435\u043D\u0435\u043D\u043E",
    added: "\u2795 \u041D\u043E\u0432\u0430\u044F \u043F\u0430\u0440\u0430",
    wkCap: (g, r, n) => `\u{1F5D3} <b>${g}</b> \u2014 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E
${r} \xB7 ${n} \u043F\u0430\u0440`,
    lessonsWeek: "\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E",
    freeWeek: "\u041D\u0430 \u044D\u0442\u043E\u0439 \u043D\u0435\u0434\u0435\u043B\u0435 \u043F\u0430\u0440 \u043D\u0435\u0442 \u{1F389}",
    seeApp: "\u{1F4F1} \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u2014 \u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438"
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
    now: "\u{1F7E2} Now",
    next: "\u23ED Next",
    brk: (m) => `\u2615 ${m} min break`,
    finish: (t) => `\u{1F3C1} Classes end at ${t}`,
    moved: "\u{1F501} Time changed",
    roomCh: "\u{1F6AA} Room changed",
    teachCh: "\u{1F464} Teacher changed",
    removed: "\u274C Cancelled",
    added: "\u2795 New class",
    wkCap: (g, r, n) => `\u{1F5D3} <b>${g}</b> \u2014 weekly timetable
${r} \xB7 ${n} classes`,
    lessonsWeek: "Weekly timetable",
    freeWeek: "No classes this week \u{1F389}",
    seeApp: "\u{1F4F1} More in the app"
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
  return ` \xB7 <i>${l.w === "A" ? tr(lang).weekA : tr(lang).weekB}</i>`;
}
function fmtLesson(l, periods, lang, parity, state) {
  const w = words(lang);
  const t = times(periods, l);
  const sub = parseSubject(l.s);
  const head = `${state ? state + "\n" : ""}<b>${t.a} \u2013 ${t.b}</b>  \xB7  <i>${w.pair(l.p)}</i>${weekTag(l, lang, parity)}`;
  const lines = [head, `\u{1F4D8} <b>${esc(sub.name)}</b>${sub.type ? ` \u2014 ${typeLabel(sub.type, lang)}` : ""}${l.g ? ` <i>(${esc(l.g)})</i>` : ""}`];
  if (l.r) lines.push(`\u{1F4CD} ${esc(roomLabel(l.r, lang))}`);
  if (l.t) lines.push(`\u{1F464} ${esc(l.t)}`);
  return lines.join("\n");
}
function fmtLessonShort(l, periods, lang, parity) {
  const t = times(periods, l);
  const sub = parseSubject(l.s);
  let s = `<b>${t.a}</b> ${esc(sub.name)}`;
  if (sub.type) s += ` <i>(${typeLabel(sub.type, lang).toLowerCase()})</i>`;
  if (l.g) s += ` <i>[${esc(l.g)}]</i>`;
  if (l.r) s += ` \xB7 \u{1F4CD}${esc(l.r)}`;
  if (l.w && !parity) s += ` \xB7 <i>${l.w}</i>`;
  return s;
}
function fmtDay(group, index, date, lang, nowDate) {
  const L = tr(lang);
  const w = words(lang);
  const d = weekday(date);
  const parity = weekParity(index.weekA, date);
  const ls = d === 6 ? [] : lessonsForDay(group, d, parity);
  const head = [
    `\u{1F4C5} <b>${L.days[d]}, ${fmtDate(date, lang)}</b>` + (parity ? ` \xB7 ${parity === "A" ? L.weekA : L.weekB}` : ""),
    `\u{1F465} ${esc(group.name)}${ls.length ? ` \xB7 ${w.count(ls.length)}` : ""}`
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
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

${blocks.join("\n\n")}

${w.finish(last)}`);
}
function fmtWeek(group, index, monday, lang) {
  const L = tr(lang);
  const parity = weekParity(index.weekA, monday);
  const range = `${dm(monday)} \u2013 ${dm(addDays(monday, 5))}` + (parity ? ` \xB7 ${parity === "A" ? L.weekA : L.weekB}` : "");
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
  const range = `${fmtDate(monday, lang)} \u2013 ${fmtDate(addDays(monday, 5), lang)}` + (parity ? ` \xB7 ${parity === "A" ? L.weekA : L.weekB}` : "");
  return w.wkCap(esc(group.name), range, n);
}
function clip(s) {
  if (s.length <= 4e3) return s;
  const cut = s.lastIndexOf("\n", 3950);
  return s.slice(0, cut > 0 ? cut : 3950) + "\n\u2026";
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
      return new Response("TDIU Jadval bot is running \u2705", { headers: { "content-type": "text/plain; charset=utf-8" } });
    } catch (e) {
      console.error(e.stack || e);
      if (url.pathname === "/tg") return new Response("ok");
      return new Response("Something went wrong. Try again shortly.", { status: 500 });
    }
  },
  // GitHub's own `schedule:` trigger is "best effort" and can silently go quiet for hours on a
  // low-traffic public repo (a known GitHub Actions limitation, not a bug in our workflow) — so
  // instead of trusting it alone, Cloudflare's own Cron Trigger (reliable, free, up to once a
  // minute) calls this on its schedule and nudges the GitHub Action awake via the API. Configure
  // a Cron Trigger for this Worker in the dashboard and set GITHUB_PAT + GITHUB_REPO to turn it
  // on; without them this quietly does nothing, so it's safe to leave unconfigured.
  async scheduled(event, env, ctx) {
    if (!env.GITHUB_PAT || !env.GITHUB_REPO) return;
    const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/timetable.yml/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_PAT}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "tdiu-jadval-cron"
      },
      body: JSON.stringify({ ref: "main" })
    });
    if (!res.ok) console.error("GitHub dispatch failed:", res.status, await res.text().catch(() => ""));
  }
};
async function sha256hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function safeEqual(a, b) {
  const [ha, hb] = await Promise.all([sha256hex(String(a ?? "")), sha256hex(String(b ?? ""))]);
  return ha === hb;
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
  if (!await safeEqual(url.searchParams.get("key"), env.ADMIN_KEY)) return new Response("Wrong key", { status: 403 });
  const out = {};
  out.webhook = await tg(env, "setWebhook", {
    url: `${url.origin}/tg`,
    secret_token: await webhookSecret(env),
    allowed_updates: ["message", "callback_query", "my_chat_member"],
    drop_pending_updates: true
  });
  const cmds = {
    uz: [["today", "Bugungi darslar"], ["tomorrow", "Ertangi darslar"], ["week", "Haftalik jadval"], ["group", "Guruhni tanlash"], ["settings", "Sozlamalar"], ["app", "Ilovani ochish"], ["help", "Yordam"]],
    ru: [["today", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F"], ["tomorrow", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430"], ["week", "\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E"], ["group", "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443"], ["settings", "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"], ["app", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435"], ["help", "\u041F\u043E\u043C\u043E\u0449\u044C"]],
    en: [["today", "Today's classes"], ["tomorrow", "Tomorrow's classes"], ["week", "Weekly timetable"], ["group", "Choose group"], ["settings", "Settings"], ["app", "Open the app"], ["help", "Help"]]
  };
  const groupCmds = {
    uz: [["today", "Bugungi darslar"], ["tomorrow", "Ertangi darslar"], ["week", "Haftalik jadval"], ["setgroup", "Chatni guruhga ulash (admin)"], ["unset", "Uzish (admin)"]],
    ru: [["today", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F"], ["tomorrow", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430"], ["week", "\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E"], ["setgroup", "\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u0447\u0430\u0442 \u043A \u0433\u0440\u0443\u043F\u043F\u0435 (\u0430\u0434\u043C\u0438\u043D)"], ["unset", "\u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C (\u0430\u0434\u043C\u0438\u043D)"]],
    en: [["today", "Today's classes"], ["tomorrow", "Tomorrow's classes"], ["week", "Weekly timetable"], ["setgroup", "Link chat to a group (admin)"], ["unset", "Unlink (admin)"]]
  };
  const toCmd = (l) => l.map(([command, description]) => ({ command, description }));
  for (const lang of LANGS) {
    const language_code = lang === "uz" ? void 0 : lang;
    out["cmd_private_" + lang] = await tg(env, "setMyCommands", { commands: toCmd(cmds[lang]), scope: { type: "all_private_chats" }, language_code });
    out["cmd_group_" + lang] = await tg(env, "setMyCommands", { commands: toCmd(groupCmds[lang]), scope: { type: "all_group_chats" }, language_code });
  }
  if (siteUrl(env)) {
    out.menu = await tg(env, "setChatMenuButton", { menu_button: { type: "web_app", text: "\u{1F4C5} Jadval", web_app: { url: siteUrl(env) + "/" } } });
  }
  out.description = await tg(env, "setMyShortDescription", { short_description: "Jadvalingiz, bo'sh xonalar va o'zgarishlar \u2014 hammasi bir joyda. Jadval o'zgarsa, birinchi siz bilasiz." });
  const ok = Object.values(out).every((r) => r.ok);
  return json({ ok, hint: ok ? "All set! Open your bot in Telegram and press Start." : "Some steps failed \u2014 see details.", ...out });
}
async function onInternal(request, url, env) {
  if (!await safeEqual(request.headers.get("x-admin-key"), env.ADMIN_KEY)) return new Response("Forbidden", { status: 403 });
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
  if (url.pathname === "/internal/edupage" && request.method === "POST") {
    const file = url.searchParams.get("file");
    const func = url.searchParams.get("func");
    if (!/^[a-z]+\.js$/.test(file || "") || !/^[A-Za-z]+$/.test(func || "")) return new Response("Bad request", { status: 400 });
    const res = await fetch(`${env.EDUPAGE_URL || "https://tsue.edupage.org"}/timetable/server/${file}?__func=${func}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8", Referer: "https://tsue.edupage.org/timetable/", "User-Agent": "Mozilla/5.0 (TDIU Jadval bot)" },
      body: await request.text()
    });
    return new Response(res.body, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
  }
  if (url.pathname === "/internal/stats") {
    const r = await D.prepare(`SELECT kind, COUNT(*) AS n, SUM(group_id IS NOT NULL) AS with_group FROM chats GROUP BY kind`).all();
    return json({ stats: r.results });
  }
  return new Response("Not found", { status: 404 });
}
async function onWebhook(request, env) {
  if (!await safeEqual(request.headers.get("x-telegram-bot-api-secret-token"), await webhookSecret(env))) {
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
    return send(env, msg.chat.id, "\u{1F4F1}", { reply_markup: { inline_keyboard: [[{ text: L.btnApp, web_app: { url: appUrl(env, row.group_id, lang) } }]] } });
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
  const days = [0, 1, 2, 3, 4, 5].map((d) => ({ text: d === sel ? `\u2022 ${L.daysShort[d]} \u2022` : L.daysShort[d], callback_data: `day:${d}:${off}` }));
  const nav = [];
  if (off > 0) nav.push({ text: `\u25C0 ${L.thisWeekShort}`, callback_data: `day:${sel}:${off - 1}` });
  if (off < 1) nav.push({ text: `${L.nextWeekShort} \u25B6`, callback_data: `day:0:${off + 1}` });
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
  const kb = index.faculties.map((f, i) => [{ text: `\u{1F3DB} ${f.name}`, callback_data: `f:${uid}:${i}` }]);
  kb.push(langRow(lang, `pick:${uid}`));
  const text = `${L.chooseFaculty}

${L.searchHint}`;
  if (messageId) return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
  return send(env, chatId, text, { reply_markup: { inline_keyboard: kb } });
}
function langRow(current, suffix) {
  return LANGS.map((l) => ({ text: T[l].langName.replace(/^(\S+)\s.*$/, "$1") + " " + { uz: "O'zbek", ru: "\u0420\u0443\u0441", en: "Eng" }[l] + (l === current ? " \u2713" : ""), callback_data: `lang:${l}:${suffix}` }));
}
async function showCourses(env, chatId, uid, lang, fi, messageId) {
  const L = tr(lang);
  const index = await getIndex(env);
  const fac = index.faculties[fi];
  if (!fac) return showFaculties(env, chatId, uid, lang, messageId);
  if (fac.courses.length === 1) return showGroups(env, chatId, uid, lang, fi, 0, 0, messageId);
  const kb = [];
  for (let i = 0; i < fac.courses.length; i += 2) {
    kb.push(fac.courses.slice(i, i + 2).map((c, j) => ({ text: `\u{1F393} ${L.course(c.name)}`, callback_data: `c:${uid}:${fi}:${i + j}:0` })));
  }
  kb.push([{ text: L.back, callback_data: `F:${uid}` }]);
  return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text: `\u{1F3DB} <b>${esc(fac.name)}</b>
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
  if (page > 0) nav.push({ text: "\u2B05\uFE0F", callback_data: `c:${uid}:${fi}:${ci}:${page - 1}` });
  if ((page + 1) * PAGE < course.groups.length) nav.push({ text: L.more, callback_data: `c:${uid}:${fi}:${ci}:${page + 1}` });
  kb.push(nav);
  const title = `\u{1F3DB} <b>${esc(fac.name)}</b>${course.name ? ` \xB7 ${L.course(course.name)}` : ""}
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
  return send(env, chatId, `\u{1F50E} ${L.found}`, { reply_markup: { inline_keyboard: kb } });
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
      [{ text: L.setLang, callback_data: "s:lang" }, { text: "\u{1F465} " + (row.group_name || "\u2014"), callback_data: "s:group" }]
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
    await tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: "\u2705 " + L2.langName });
    if (!isGroupChat) await send(env, chatId, "\u{1F44C}", { reply_markup: mainKeyboard(env, newLang, row.group_id) });
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
