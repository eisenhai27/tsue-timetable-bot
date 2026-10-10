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
    welcome: "Assalomu alaykum! \u{1F44B}\nMen <b>TDIU Jadval</b> botiman.\n\n\u2022 Talaba va o'qituvchilar jadvalini ko'rsataman\n\u2022 Jadval o'zgarsa darhol xabar beraman\n\u2022 Bo'sh xonalarni qidiraman\n\nBoshlash uchun kim ekaningizni tanlang \u{1F447}",
    chooseFaculty: "\u{1F3DB} Fakultetni tanlang:",
    chooseCourse: "\u{1F393} Kursni tanlang:",
    chooseGroup: "\u{1F465} Guruhni tanlang:",
    course: (n) => n ? `${n}-kurs` : "Boshqa",
    searchHint: "\u{1F4A1} Yoki guruh nomini yozing, masalan: <code>MO-901</code>",
    groupSet: (g) => `\u2705 Guruh saqlandi: <b>${g}</b>`,
    groupSetChat: (g, m = 1260) => `\u2705 Bu chat <b>${g}</b> guruhiga ulandi.

\u{1F319} Har kuni soat <b>${hhmm(m)}</b> da ertangi darslar yuboriladi (vaqtni admin /time bilan o'zgartiradi).
\u{1F5D3} Har yakshanba kechqurun haftalik jadval, jadval o'zgarsa darhol xabar beriladi.`,
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
    weekA: "Yuqori hafta",
    weekB: "Quyi hafta",
    onlyAdmins: "Faqat chat adminlari buni o'zgartira oladi.",
    notYourMenu: "Bu menyu sizga tegishli emas.",
    addedToGroup: "Salom! \u{1F44B} Men dars jadvali botiman.\n\nChat admini /setgroup yuborib guruhni tanlasin \u2014 shundan so'ng har kuni kechqurun ertangi darslar, haftalik jadval va o'zgarishlar shu yerga yuboriladi.",
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
    help: "<b>Buyruqlar</b>\n/today \u2014 bugungi darslar\n/tomorrow \u2014 ertangi darslar\n/week \u2014 haftalik jadval\n/group \u2014 guruhni tanlash (talaba)\n/teacher \u2014 o'qituvchi sifatida kirish\n/settings \u2014 sozlamalar\n/time \u2014 ertangi dars eslatmasi vaqti\n/app \u2014 ilovani ochish\n/feedback \u2014 taklif yoki xato yuborish\n\n<b>Guruh chatida</b>\n/setgroup \u2014 chatni guruhga ulash (admin)\n/unset \u2014 uzish (admin)\n/time \u2014 ertangi dars eslatmasi vaqti (admin)",
    dataError: "Jadvalni yuklab bo'lmadi, birozdan so'ng qayta urinib ko'ring.",
    now: "Hozir",
    btnInvite: "\u{1F4E4} Do'stlarni taklif qilish",
    inviteCaption: (g, n) => n > 0 ? `\u{1F389} <b>${g}</b> guruhidan yana ${n} kishi botdan foydalanmoqda!

Guruhdoshlaringizni ham taklif qiling \u{1F447}` : "\u{1F44B} Guruhdoshlaringizni ham taklif qiling \u2014 ularga ham qulay bo'ladi!",
    inviteShareText: (g) => `TDIU Jadval \u2014 ${g} guruhi jadvalini ko'rsatadi va o'zgarsa darhol xabar beradi. Sinab ko'ring:`,
    groupChatTip: "\u{1F4A1} <b>Maslahat:</b> botni guruh chatingizga ham qo'shing \u2014 u yerda /setgroup yuborsangiz, butun guruhga avtomatik xabar boradi.",
    feedbackPrompt: "\u270D\uFE0F Taklif yoki xatoni yozing:\n<code>/feedback Xona nomi noto'g'ri ko'rsatilyapti</code>",
    feedbackThanks: "\u2705 Rahmat! Xabaringiz qabul qilindi.",
    adminReply: (t) => `\u{1F4AC} <b>TDIU Jadval jamoasidan javob:</b>

${t}`,
    setRemind: (m) => `\u{1F319} Ertangi darslar eslatmasi: ${m < 0 ? "o'chirilgan" : "har kuni " + hhmm(m)}`,
    remindTitle: "\u{1F319} <b>Ertangi darslar eslatmasi</b>\nQaysi vaqtda yuborilsin? (Toshkent vaqti)\n\nBoshqa vaqt uchun yozing: <code>/time 20:30</code>",
    remindSet: (m) => m < 0 ? "\u{1F515} Ertangi darslar eslatmasi o'chirildi. Qayta yoqish: /time" : `\u2705 Har kuni soat <b>${hhmm(m)}</b> da ertangi darslar yuboriladi.`,
    remindBad: "\u2753 Vaqtni shunday yozing: <code>/time 21:00</code> (o'chirish: <code>/time off</code>)",
    btnRemindOff: "\u{1F515} O'chirish",
    btnFeedback: "\u270D\uFE0F Taklif yoki xato yuborish",
    askRole: "\u{1F464} Siz kimsiz?",
    btnStudent: "\u{1F393} Talaba",
    btnTeacher: "\u{1F468}\u200D\u{1F3EB} O'qituvchi",
    chooseTeacher: "\u{1F468}\u200D\u{1F3EB} O'qituvchini tanlang: familiyasining birinchi harfini bosing.",
    teacherSearchHint: "\u{1F4A1} Yoki familiyangizni yozing, masalan: <code>Karimov</code>",
    teacherSet: (n) => `\u2705 O'qituvchi saqlandi: <b>${n}</b>`,
    noTeacher: "Siz hali o'qituvchi sifatida tanlanmagansiz. /teacher buyrug'ini yuboring.",
    teacherNotFound: "O'qituvchi topilmadi. Familiyani tekshiring, masalan: Karimov",
    setTeacher: (n) => `\u{1F468}\u200D\u{1F3EB} O'qituvchi: ${n || "\u2014"}`,
    btnRole: "\u{1F504} Talaba / O'qituvchi",
    teacherTip: "\u{1F514} Jadvalingiz o'zgarsa, shu yerga darhol yozaman. Xabarlarni Sozlamalarda boshqarishingiz mumkin.",
    btnCalendar: "\u{1F4C5} Kalendar",
    calendarInfo: (url) => `\u{1F4C5} <b>Kalendarga obuna bo'ling</b>

Quyidagi havolani telefon yoki kompyuteringizdagi kalendar ilovasiga qo'shsangiz, jadval u yerda avtomatik yangilanib turadi.

<b>iPhone (Apple Calendar):</b> havolani oching \u2192 "Obuna bo'lish" tugmasini bosing.
<b>Google Calendar:</b> Sozlamalar \u2192 "Boshqa kalendarlar qo'shish" \u2192 "URL orqali" \u2192 havolani joylashtiring.

<code>${esc(url)}</code>`
  },
  ru: {
    days: ["\u041F\u043E\u043D\u0435\u0434\u0435\u043B\u044C\u043D\u0438\u043A", "\u0412\u0442\u043E\u0440\u043D\u0438\u043A", "\u0421\u0440\u0435\u0434\u0430", "\u0427\u0435\u0442\u0432\u0435\u0440\u0433", "\u041F\u044F\u0442\u043D\u0438\u0446\u0430", "\u0421\u0443\u0431\u0431\u043E\u0442\u0430", "\u0412\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435"],
    daysShort: ["\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431", "\u0412\u0441"],
    months: ["\u044F\u043D\u0432\u0430\u0440\u044F", "\u0444\u0435\u0432\u0440\u0430\u043B\u044F", "\u043C\u0430\u0440\u0442\u0430", "\u0430\u043F\u0440\u0435\u043B\u044F", "\u043C\u0430\u044F", "\u0438\u044E\u043D\u044F", "\u0438\u044E\u043B\u044F", "\u0430\u0432\u0433\u0443\u0441\u0442\u0430", "\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044F", "\u043E\u043A\u0442\u044F\u0431\u0440\u044F", "\u043D\u043E\u044F\u0431\u0440\u044F", "\u0434\u0435\u043A\u0430\u0431\u0440\u044F"],
    langName: "\u{1F1F7}\u{1F1FA} \u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    chooseLang: "Tilni tanlang / \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u044F\u0437\u044B\u043A / Choose language",
    welcome: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u{1F44B}\n\u042F <b>TDIU Jadval</b> \u2014 \u0431\u043E\u0442 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u0422\u0413\u042D\u0423.\n\n\u2022 \u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u043E\u0432 \u0438 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0435\u0439\n\u2022 \u0421\u0440\u0430\u0437\u0443 \u0441\u043E\u043E\u0431\u0449\u0430\u044E \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445\n\u2022 \u0418\u0449\u0443 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438\n\n\u0414\u043B\u044F \u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u043A\u0442\u043E \u0432\u044B \u{1F447}",
    chooseFaculty: "\u{1F3DB} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442:",
    chooseCourse: "\u{1F393} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0443\u0440\u0441:",
    chooseGroup: "\u{1F465} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443:",
    course: (n) => n ? `${n} \u043A\u0443\u0440\u0441` : "\u0414\u0440\u0443\u0433\u043E\u0435",
    searchHint: "\u{1F4A1} \u0418\u043B\u0438 \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: <code>MO-901</code>",
    groupSet: (g) => `\u2705 \u0413\u0440\u0443\u043F\u043F\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430: <b>${g}</b>`,
    groupSetChat: (g, m = 1260) => `\u2705 \u042D\u0442\u043E\u0442 \u0447\u0430\u0442 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0433\u0440\u0443\u043F\u043F\u0435 <b>${g}</b>.

\u{1F319} \u041A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C \u0432 <b>${hhmm(m)}</b> \u044F \u0431\u0443\u0434\u0443 \u043F\u0440\u0438\u0441\u044B\u043B\u0430\u0442\u044C \u043F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430 (\u0432\u0440\u0435\u043C\u044F \u043C\u0435\u043D\u044F\u0435\u0442 \u0430\u0434\u043C\u0438\u043D \u043A\u043E\u043C\u0430\u043D\u0434\u043E\u0439 /time).
\u{1F5D3} \u041A\u0430\u0436\u0434\u043E\u0435 \u0432\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435 \u0432\u0435\u0447\u0435\u0440\u043E\u043C \u2014 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E, \u0430 \u043F\u0440\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445 \u2014 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435.`,
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
    weekA: "\u0412\u0435\u0440\u0445\u043D\u044F\u044F \u043D\u0435\u0434\u0435\u043B\u044F",
    weekB: "\u041D\u0438\u0436\u043D\u044F\u044F \u043D\u0435\u0434\u0435\u043B\u044F",
    onlyAdmins: "\u042D\u0442\u043E \u043C\u043E\u0433\u0443\u0442 \u043C\u0435\u043D\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0430\u0434\u043C\u0438\u043D\u044B \u0447\u0430\u0442\u0430.",
    notYourMenu: "\u042D\u0442\u043E \u043C\u0435\u043D\u044E \u043D\u0435 \u0434\u043B\u044F \u0432\u0430\u0441.",
    addedToGroup: "\u041F\u0440\u0438\u0432\u0435\u0442! \u{1F44B} \u042F \u0431\u043E\u0442 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F.\n\n\u0410\u0434\u043C\u0438\u043D \u0447\u0430\u0442\u0430, \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 /setgroup \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443 \u2014 \u043F\u043E\u0441\u043B\u0435 \u044D\u0442\u043E\u0433\u043E \u0441\u044E\u0434\u0430 \u0431\u0443\u0434\u0443\u0442 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u044C \u043F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430 (\u043A\u0430\u0436\u0434\u044B\u0439 \u0432\u0435\u0447\u0435\u0440), \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E \u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F.",
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
    help: "<b>\u041A\u043E\u043C\u0430\u043D\u0434\u044B</b>\n/today \u2014 \u043F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F\n/tomorrow \u2014 \u043F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430\n/week \u2014 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E\n/group \u2014 \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443 (\u0441\u0442\u0443\u0434\u0435\u043D\u0442)\n/teacher \u2014 \u0432\u043E\u0439\u0442\u0438 \u043A\u0430\u043A \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C\n/settings \u2014 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438\n/time \u2014 \u0432\u0440\u0435\u043C\u044F \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F \u043E \u043F\u0430\u0440\u0430\u0445 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430\n/app \u2014 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435\n/feedback \u2014 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432 \u0438\u043B\u0438 \u0441\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435\n\n<b>\u0412 \u0447\u0430\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u044B</b>\n/setgroup \u2014 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u0447\u0430\u0442 \u043A \u0433\u0440\u0443\u043F\u043F\u0435 (\u0430\u0434\u043C\u0438\u043D)\n/unset \u2014 \u043E\u0442\u0432\u044F\u0437\u0430\u0442\u044C (\u0430\u0434\u043C\u0438\u043D)\n/time \u2014 \u0432\u0440\u0435\u043C\u044F \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F \u043E \u043F\u0430\u0440\u0430\u0445 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430 (\u0430\u0434\u043C\u0438\u043D)",
    dataError: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435.",
    now: "\u0421\u0435\u0439\u0447\u0430\u0441",
    btnInvite: "\u{1F4E4} \u041F\u0440\u0438\u0433\u043B\u0430\u0441\u0438\u0442\u044C \u0434\u0440\u0443\u0437\u0435\u0439",
    inviteCaption: (g, n) => n > 0 ? `\u{1F389} \u0415\u0449\u0451 ${n} \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u0438\u0437 \u0433\u0440\u0443\u043F\u043F\u044B <b>${g}</b> \u0443\u0436\u0435 \u043F\u043E\u043B\u044C\u0437\u0443\u044E\u0442\u0441\u044F \u0431\u043E\u0442\u043E\u043C!

\u041F\u0440\u0438\u0433\u043B\u0430\u0441\u0438\u0442\u0435 \u0438 \u0441\u0432\u043E\u0438\u0445 \u043E\u0434\u043D\u043E\u0433\u0440\u0443\u043F\u043F\u043D\u0438\u043A\u043E\u0432 \u{1F447}` : "\u041F\u0440\u0438\u0433\u043B\u0430\u0441\u0438\u0442\u0435 \u0441\u0432\u043E\u0438\u0445 \u043E\u0434\u043D\u043E\u0433\u0440\u0443\u043F\u043F\u043D\u0438\u043A\u043E\u0432 \u2014 \u0438\u043C \u0442\u043E\u0436\u0435 \u0431\u0443\u0434\u0435\u0442 \u0443\u0434\u043E\u0431\u043D\u043E!",
    inviteShareText: (g) => `TDIU Jadval \u2014 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B ${g} \u0438 \u0441\u0440\u0430\u0437\u0443 \u0441\u043E\u043E\u0431\u0449\u0430\u0435\u0442 \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435:`,
    groupChatTip: "\u{1F4A1} <b>\u0421\u043E\u0432\u0435\u0442:</b> \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0431\u043E\u0442\u0430 \u0438 \u0432 \u0447\u0430\u0442 \u0432\u0430\u0448\u0435\u0439 \u0433\u0440\u0443\u043F\u043F\u044B \u2014 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0442\u0430\u043C /setgroup, \u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0431\u0443\u0434\u0443\u0442 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u044C \u0432\u0441\u0435\u0439 \u0433\u0440\u0443\u043F\u043F\u0435 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.",
    feedbackPrompt: "\u270D\uFE0F \u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043E\u0442\u0437\u044B\u0432 \u0438\u043B\u0438 \u043E\u043F\u0438\u0448\u0438\u0442\u0435 \u043E\u0448\u0438\u0431\u043A\u0443:\n<code>/feedback \u041D\u0435\u0432\u0435\u0440\u043D\u043E \u0443\u043A\u0430\u0437\u0430\u043D\u0430 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F</code>",
    feedbackThanks: "\u2705 \u0421\u043F\u0430\u0441\u0438\u0431\u043E! \u0412\u0430\u0448\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E.",
    adminReply: (t) => `\u{1F4AC} <b>\u041E\u0442\u0432\u0435\u0442 \u043A\u043E\u043C\u0430\u043D\u0434\u044B TDIU Jadval:</b>

${t}`,
    setRemind: (m) => `\u{1F319} \u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435 \u043E \u043F\u0430\u0440\u0430\u0445 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430: ${m < 0 ? "\u0432\u044B\u043A\u043B" : "\u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C \u0432 " + hhmm(m)}`,
    remindTitle: "\u{1F319} <b>\u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435 \u043E \u043F\u0430\u0440\u0430\u0445 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430</b>\n\u0412\u043E \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u0438\u0441\u044B\u043B\u0430\u0442\u044C? (\u0432\u0440\u0435\u043C\u044F \u0422\u0430\u0448\u043A\u0435\u043D\u0442\u0430)\n\n\u0414\u0440\u0443\u0433\u043E\u0435 \u0432\u0440\u0435\u043C\u044F: <code>/time 20:30</code>",
    remindSet: (m) => m < 0 ? "\u{1F515} \u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435 \u043E \u043F\u0430\u0440\u0430\u0445 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u043D\u043E\u0432\u0430: /time" : `\u2705 \u041A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C \u0432 <b>${hhmm(m)}</b> \u0431\u0443\u0434\u0443 \u043F\u0440\u0438\u0441\u044B\u043B\u0430\u0442\u044C \u043F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430.`,
    remindBad: "\u2753 \u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0432\u0440\u0435\u043C\u044F \u0442\u0430\u043A: <code>/time 21:00</code> (\u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C: <code>/time off</code>)",
    btnRemindOff: "\u{1F515} \u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
    btnFeedback: "\u270D\uFE0F \u041E\u0442\u0437\u044B\u0432 \u0438\u043B\u0438 \u043E\u0448\u0438\u0431\u043A\u0430",
    askRole: "\u{1F464} \u041A\u0442\u043E \u0432\u044B?",
    btnStudent: "\u{1F393} \u0421\u0442\u0443\u0434\u0435\u043D\u0442",
    btnTeacher: "\u{1F468}\u200D\u{1F3EB} \u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C",
    chooseTeacher: "\u{1F468}\u200D\u{1F3EB} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044F: \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u0431\u0443\u043A\u0432\u0443 \u0444\u0430\u043C\u0438\u043B\u0438\u0438.",
    teacherSearchHint: "\u{1F4A1} \u0418\u043B\u0438 \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0444\u0430\u043C\u0438\u043B\u0438\u044E, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: <code>Karimov</code>",
    teacherSet: (n) => `\u2705 \u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D: <b>${n}</b>`,
    noTeacher: "\u0412\u044B \u0435\u0449\u0451 \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u0441\u0435\u0431\u044F \u043A\u0430\u043A \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044F. \u041E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 /teacher.",
    teacherNotFound: "\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0444\u0430\u043C\u0438\u043B\u0438\u044E, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: Karimov",
    setTeacher: (n) => `\u{1F468}\u200D\u{1F3EB} \u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C: ${n || "\u2014"}`,
    btnRole: "\u{1F504} \u0421\u0442\u0443\u0434\u0435\u043D\u0442 / \u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C",
    teacherTip: "\u{1F514} \u0415\u0441\u043B\u0438 \u0432\u0430\u0448\u0435 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u0441\u044F, \u044F \u0441\u0440\u0430\u0437\u0443 \u043D\u0430\u043F\u0438\u0448\u0443 \u0441\u044E\u0434\u0430. \u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F\u043C\u0438 \u043C\u043E\u0436\u043D\u043E \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445.",
    btnCalendar: "\u{1F4C5} \u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C",
    calendarInfo: (url) => `\u{1F4C5} <b>\u041F\u043E\u0434\u043F\u0438\u0448\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C</b>

\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u044D\u0442\u0443 \u0441\u0441\u044B\u043B\u043A\u0443 \u0432 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C \u043D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435 \u0438\u043B\u0438 \u043A\u043E\u043C\u043F\u044C\u044E\u0442\u0435\u0440\u0435 \u2014 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0431\u0443\u0434\u0435\u0442 \u043E\u0431\u043D\u043E\u0432\u043B\u044F\u0442\u044C\u0441\u044F \u0442\u0430\u043C \u0441\u0430\u043C\u043E.

<b>iPhone (Apple Calendar):</b> \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u2192 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F\xBB.
<b>Google Calendar:</b> \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u2192 \xAB\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C\xBB \u2192 \xAB\u041F\u043E URL\xBB \u2192 \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443.

<code>${esc(url)}</code>`
  },
  en: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    daysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    langName: "\u{1F1EC}\u{1F1E7} English",
    chooseLang: "Tilni tanlang / \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u044F\u0437\u044B\u043A / Choose language",
    welcome: "Hi! \u{1F44B}\nI'm <b>TDIU Jadval</b>, the TSUE timetable bot.\n\n\u2022 I show student and teacher timetables\n\u2022 I tell you right away when it changes\n\u2022 I can find free rooms\n\nTo start, tell me who you are \u{1F447}",
    chooseFaculty: "\u{1F3DB} Choose your faculty:",
    chooseCourse: "\u{1F393} Choose your year:",
    chooseGroup: "\u{1F465} Choose your group:",
    course: (n) => n ? `Year ${n}` : "Other",
    searchHint: "\u{1F4A1} Or type your group name, e.g. <code>MO-901</code>",
    groupSet: (g) => `\u2705 Group saved: <b>${g}</b>`,
    groupSetChat: (g, m = 1260) => `\u2705 This chat is now linked to <b>${g}</b>.

\u{1F319} Every day at <b>${hhmm(m)}</b> I'll post tomorrow's classes (an admin can change the time with /time).
\u{1F5D3} Every Sunday evening the week's timetable, and an alert whenever it changes.`,
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
    weekA: "Upper week",
    weekB: "Lower week",
    onlyAdmins: "Only chat admins can change this.",
    notYourMenu: "This menu is not for you.",
    addedToGroup: "Hi! \u{1F44B} I'm the timetable bot.\n\nA chat admin should send /setgroup and pick the group. After that I'll post tomorrow's classes every evening, plus the weekly timetable and changes.",
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
    help: "<b>Commands</b>\n/today \u2014 today's classes\n/tomorrow \u2014 tomorrow's classes\n/week \u2014 weekly timetable\n/group \u2014 choose group (student)\n/teacher \u2014 sign in as a teacher\n/settings \u2014 settings\n/time \u2014 reminder time for tomorrow's classes\n/app \u2014 open the app\n/feedback \u2014 send feedback or report a bug\n\n<b>In a group chat</b>\n/setgroup \u2014 link chat to a group (admin)\n/unset \u2014 unlink (admin)\n/time \u2014 reminder time for tomorrow's classes (admin)",
    dataError: "Couldn't load the timetable, please try again in a moment.",
    now: "Now",
    btnInvite: "\u{1F4E4} Invite friends",
    inviteCaption: (g, n) => n > 0 ? `\u{1F389} ${n} more people from <b>${g}</b> already use the bot!

Invite your groupmates too \u{1F447}` : "Invite your groupmates too \u2014 it'll be handy for them as well!",
    inviteShareText: (g) => `TDIU Jadval \u2014 shows ${g}'s timetable and tells you right away when it changes. Try it:`,
    groupChatTip: "\u{1F4A1} <b>Tip:</b> add the bot to your group chat too \u2014 send /setgroup there and the whole group gets updates automatically.",
    feedbackPrompt: "\u270D\uFE0F Write your feedback or describe the bug:\n<code>/feedback The room number is shown wrong</code>",
    feedbackThanks: "\u2705 Thanks! Your message has been received.",
    adminReply: (t) => `\u{1F4AC} <b>Reply from the TDIU Jadval team:</b>

${t}`,
    setRemind: (m) => `\u{1F319} Tomorrow's-classes reminder: ${m < 0 ? "off" : "every day at " + hhmm(m)}`,
    remindTitle: "\u{1F319} <b>Tomorrow's-classes reminder</b>\nWhat time should I send it? (Tashkent time)\n\nOther time: <code>/time 20:30</code>",
    remindSet: (m) => m < 0 ? "\u{1F515} Tomorrow's-classes reminder turned off. Turn it on again: /time" : `\u2705 I'll send tomorrow's classes every day at <b>${hhmm(m)}</b>.`,
    remindBad: "\u2753 Write the time like this: <code>/time 21:00</code> (turn off: <code>/time off</code>)",
    btnRemindOff: "\u{1F515} Turn off",
    btnFeedback: "\u270D\uFE0F Send feedback",
    askRole: "\u{1F464} Who are you?",
    btnStudent: "\u{1F393} Student",
    btnTeacher: "\u{1F468}\u200D\u{1F3EB} Teacher",
    chooseTeacher: "\u{1F468}\u200D\u{1F3EB} Choose the teacher: tap the first letter of the surname.",
    teacherSearchHint: "\u{1F4A1} Or type the surname, e.g. <code>Karimov</code>",
    teacherSet: (n) => `\u2705 Teacher saved: <b>${n}</b>`,
    noTeacher: "You haven't picked yourself as a teacher yet. Send /teacher.",
    teacherNotFound: "Teacher not found. Check the surname, e.g. Karimov",
    setTeacher: (n) => `\u{1F468}\u200D\u{1F3EB} Teacher: ${n || "\u2014"}`,
    btnRole: "\u{1F504} Student / Teacher",
    teacherTip: "\u{1F514} If your timetable changes, I'll message you here right away. You can manage alerts in Settings.",
    btnCalendar: "\u{1F4C5} Calendar",
    calendarInfo: (url) => `\u{1F4C5} <b>Subscribe to your calendar</b>

Add this link to your phone or computer's calendar app, and the timetable will keep itself up to date there.

<b>iPhone (Apple Calendar):</b> open the link \u2192 tap "Subscribe".
<b>Google Calendar:</b> Settings \u2192 "Add calendar" \u2192 "From URL" \u2192 paste the link.

<code>${esc(url)}</code>`
  }
};
var tr = (lang) => T[lang] || T.uz;
function hhmm(m) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
function parseClock(s) {
  const t = String(s || "").trim().toLowerCase();
  if (/^(off|0ff|o'chir|ochir|выкл|нет|no)$/.test(t)) return -1;
  const m = /^(\d{1,2})(?:\s*[:.\-]\s*(\d{2}))?$/.exec(t);
  if (!m) return null;
  const h = Number(m[1]);
  const mi = m[2] == null ? 0 : Number(m[2]);
  return h > 23 || mi > 59 ? null : h * 60 + mi;
}
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
    groupCh: "\u{1F465} Guruhlar o\u2018zgardi",
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
    groupCh: "\u{1F465} \u0418\u0437\u043C\u0435\u043D\u0438\u043B\u0438\u0441\u044C \u0433\u0440\u0443\u043F\u043F\u044B",
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
    groupCh: "\u{1F465} Groups changed",
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
var SUBJECTS = /* @__PURE__ */ new Map();
var subjKey = (s) => String(s || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
function setSubjects(obj) {
  SUBJECTS = new Map(Object.entries(obj || {}).map(([k, v]) => [subjKey(k), v]));
}
function subjectName(name, lang) {
  if (lang !== "ru" && lang !== "en") return name;
  const hit = SUBJECTS.get(subjKey(name));
  return hit && hit[lang === "ru" ? 0 : 1] || name;
}
function parseSubject(s, lang) {
  const r = parseSubjectRaw(s);
  if (!lang) return r;
  const name = subjectName(r.name, lang);
  return { name, orig: subjKey(name) === subjKey(r.name) ? null : r.name, type: r.type };
}
var subjHtml = (sub, bold) => (bold ? `<b>${esc(sub.name)}</b>` : esc(sub.name)) + (sub.orig ? ` / <i>${esc(sub.orig)}</i>` : "");
function parseSubjectRaw(s) {
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
var whoIcon = (g) => g?.kind === "t" ? "\u{1F464}" : "\u{1F465}";
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
  const sub = parseSubject(l.s, lang);
  const head = `${state ? state + "\n" : ""}<b>${t.a} \u2013 ${t.b}</b>  \xB7  <i>${w.pair(l.p)}</i>${weekTag(l, lang, parity)}`;
  const lines = [head, `\u{1F4D8} ${subjHtml(sub, true)}${sub.type ? ` \u2014 ${typeLabel(sub.type, lang)}` : ""}${l.g ? ` <i>(${esc(l.g)})</i>` : ""}`];
  if (l.r) lines.push(`\u{1F4CD} ${esc(roomLabel(l.r, lang))}`);
  if (l.t) lines.push(`\u{1F464} ${esc(l.t)}`);
  if (l.gr) lines.push(`\u{1F465} ${esc(l.gr)}`);
  return lines.join("\n");
}
function fmtLessonShort(l, periods, lang, parity) {
  const t = times(periods, l);
  const sub = parseSubject(l.s, lang);
  let s = `<b>${t.a}</b> ${subjHtml(sub)}`;
  if (sub.type) s += ` <i>(${typeLabel(sub.type, lang).toLowerCase()})</i>`;
  if (l.g) s += ` <i>[${esc(l.g)}]</i>`;
  if (l.gr) s += ` <i>[${esc(l.gr)}]</i>`;
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
    `${whoIcon(group)} ${esc(group.name)}${ls.length ? ` \xB7 ${w.count(ls.length)}` : ""}`
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
var TPAGE = 16;
var CALENDAR_ENABLED = false;
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
var getTeacher = (env, id) => getData(env, `t/${id}.json`);
var getPeople = (env) => getData(env, "people.json", 600);
var subjectsAt = 0;
async function loadSubjects(env) {
  if (Date.now() - subjectsAt < 36e5) return;
  try {
    const j = await getData(env, "subjects.json", 3600);
    if (j) setSubjects(j);
    subjectsAt = Date.now();
  } catch {
    subjectsAt = Date.now() - 33e5;
  }
}
var isTeacher = (row) => row?.role === "teacher";
async function getEntity(env, row) {
  if (!row.group_id) return null;
  if (!isTeacher(row)) return getGroup(env, row.group_id);
  const t = await getTeacher(env, row.group_id);
  return t ? { ...t, kind: "t" } : null;
}
var schemaReady = false;
async function db(env) {
  if (!schemaReady) {
    await env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS chats (
        chat_id INTEGER PRIMARY KEY,
        kind TEXT NOT NULL,
        group_id TEXT,
        group_name TEXT,
        role TEXT NOT NULL DEFAULT 'student',
        remind_at INTEGER NOT NULL DEFAULT 1260,
        lang TEXT NOT NULL DEFAULT 'uz',
        alerts INTEGER NOT NULL DEFAULT 1,
        weekly INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER)`),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_chats_group ON chats(group_id)"),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER,
        name TEXT,
        text TEXT NOT NULL,
        created_at INTEGER)`),
      // which forwarded DM (in the admin's chat) belongs to which user — so a Reply can be routed back
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS feedback_replies (
        admin_msg_id INTEGER PRIMARY KEY,
        chat_id INTEGER NOT NULL,
        created_at INTEGER)`),
      // the admin's /stats: how often each action was used, per day (Tashkent date)
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS usage (
        day TEXT NOT NULL,
        k TEXT NOT NULL,
        n INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (day, k))`)
    ]);
    const cols = (await env.DB.prepare("PRAGMA table_info(chats)").all()).results || [];
    const addColumn = async (sql, after) => {
      try {
        await env.DB.prepare(sql).run();
        if (after) await env.DB.prepare(after).run();
      } catch (e) {
        if (!/duplicate column/i.test(String(e?.message))) throw e;
      }
    };
    if (!cols.some((c) => c.name === "role")) {
      await addColumn("ALTER TABLE chats ADD COLUMN role TEXT NOT NULL DEFAULT 'student'");
    }
    if (!cols.some((c) => c.name === "remind_at")) {
      await addColumn("ALTER TABLE chats ADD COLUMN remind_at INTEGER NOT NULL DEFAULT 1260", "UPDATE chats SET remind_at = -1 WHERE alerts = 0");
    }
    if (!cols.some((c) => c.name === "last_seen")) {
      await addColumn("ALTER TABLE chats ADD COLUMN last_seen INTEGER");
    }
    await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_chats_remind ON chats(remind_at)").run();
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
    role: "student",
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
  if (chatId > 0 && siteUrl(env) && ("lang" in fields || "group_id" in fields || "role" in fields)) await syncMenu(env, chatId);
}
async function syncMenu(env, chatId) {
  try {
    const row = await getChat(env, chatId);
    if (!row) return;
    const text = { uz: "\u{1F4C5} Jadval", ru: "\u{1F4C5} \u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435", en: "\u{1F4C5} Timetable" }[row.lang] || "\u{1F4C5} Jadval";
    await tg(env, "setChatMenuButton", { chat_id: chatId, menu_button: { type: "web_app", text, web_app: { url: appUrl(env, row.group_id, row.lang, row.role) } } });
  } catch {
  }
}
async function setRole(env, chatId, row, role) {
  if ((row.role || "student") === role) return row;
  await updateChat(env, chatId, { role, group_id: null, group_name: null });
  return { ...row, role, group_id: null, group_name: null };
}
async function deleteChat(env, chatId) {
  await (await db(env)).prepare("DELETE FROM chats WHERE chat_id = ?").bind(chatId).run();
}
async function countGroupmates(env, groupId, excludeChatId) {
  const r = await (await db(env)).prepare("SELECT COUNT(*) AS n FROM chats WHERE group_id = ? AND kind = 'private' AND chat_id != ?").bind(groupId, excludeChatId).first();
  return r?.n || 0;
}
async function addFeedback(env, chatId, name, text) {
  await (await db(env)).prepare("INSERT INTO feedback (chat_id, name, text, created_at) VALUES (?,?,?,?)").bind(chatId, name || null, text, Date.now()).run();
  if (env.ADMIN_CHAT_ID) {
    const r = await tg(env, "sendMessage", {
      chat_id: env.ADMIN_CHAT_ID,
      text: `\u270D\uFE0F <b>Yangi fikr-mulohaza</b>
${esc(name || "Anonim")} (id: ${chatId}):

${esc(text)}

\u21A9\uFE0F Javob berish uchun shu xabarga <b>Reply</b> qiling.`,
      parse_mode: "HTML"
    });
    if (r.ok && r.result?.message_id) {
      await (await db(env)).prepare("INSERT OR REPLACE INTO feedback_replies (admin_msg_id, chat_id, created_at) VALUES (?,?,?)").bind(r.result.message_id, chatId, Date.now()).run();
    }
  }
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
    uz: [["today", "Bugungi darslar"], ["tomorrow", "Ertangi darslar"], ["week", "Haftalik jadval"], ["group", "Guruhni tanlash (talaba)"], ["teacher", "O'qituvchi sifatida kirish"], ["settings", "Sozlamalar"], ["time", "Ertangi dars eslatmasi vaqti"], ["app", "Ilovani ochish"], ["calendar", "Kalendarga obuna bo'lish"], ["feedback", "Taklif yoki xato yuborish"], ["help", "Yordam"]].filter(([c]) => CALENDAR_ENABLED || c !== "calendar"),
    ru: [["today", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F"], ["tomorrow", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430"], ["week", "\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E"], ["group", "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443 (\u0441\u0442\u0443\u0434\u0435\u043D\u0442)"], ["teacher", "\u0412\u043E\u0439\u0442\u0438 \u043A\u0430\u043A \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C"], ["settings", "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"], ["time", "\u0412\u0440\u0435\u043C\u044F \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F \u043E \u043F\u0430\u0440\u0430\u0445"], ["app", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435"], ["calendar", "\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u043D\u0430 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C"], ["feedback", "\u041E\u0442\u0437\u044B\u0432 \u0438\u043B\u0438 \u043E\u0448\u0438\u0431\u043A\u0430"], ["help", "\u041F\u043E\u043C\u043E\u0449\u044C"]].filter(([c]) => CALENDAR_ENABLED || c !== "calendar"),
    en: [["today", "Today's classes"], ["tomorrow", "Tomorrow's classes"], ["week", "Weekly timetable"], ["group", "Choose group (student)"], ["teacher", "Sign in as a teacher"], ["settings", "Settings"], ["time", "Reminder time"], ["app", "Open the app"], ["calendar", "Subscribe to calendar"], ["feedback", "Send feedback"], ["help", "Help"]].filter(([c]) => CALENDAR_ENABLED || c !== "calendar")
  };
  const groupCmds = {
    uz: [["today", "Bugungi darslar"], ["tomorrow", "Ertangi darslar"], ["week", "Haftalik jadval"], ["setgroup", "Chatni guruhga ulash (admin)"], ["unset", "Uzish (admin)"], ["time", "Eslatma vaqti (admin)"]],
    ru: [["today", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F"], ["tomorrow", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430"], ["week", "\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E"], ["setgroup", "\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u0447\u0430\u0442 \u043A \u0433\u0440\u0443\u043F\u043F\u0435 (\u0430\u0434\u043C\u0438\u043D)"], ["unset", "\u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C (\u0430\u0434\u043C\u0438\u043D)"], ["time", "\u0412\u0440\u0435\u043C\u044F \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F (\u0430\u0434\u043C\u0438\u043D)"]],
    en: [["today", "Today's classes"], ["tomorrow", "Tomorrow's classes"], ["week", "Weekly timetable"], ["setgroup", "Link chat to a group (admin)"], ["unset", "Unlink (admin)"], ["time", "Reminder time (admin)"]]
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
  out.description = await tg(env, "setMyShortDescription", { short_description: "Talaba va o'qituvchilar uchun jadval, bo'sh xonalar va o'zgarishlar \u2014 hammasi bir joyda. Jadval o'zgarsa, birinchi siz bilasiz." });
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
    let filter = mode === "all" ? "" : `AND ${mode === "weekly" ? "weekly" : "alerts"} = 1`;
    const binds = [];
    if (mode === "tomorrow") {
      filter = "AND remind_at >= 0";
      if (url.searchParams.has("to")) {
        filter = "AND remind_at > ? AND remind_at <= ?";
        binds.push(Number(url.searchParams.get("from") || -1), Number(url.searchParams.get("to")));
      }
    }
    const { results } = await D.prepare(`SELECT chat_id, kind, role, group_id, lang FROM chats WHERE group_id IS NOT NULL ${filter} AND chat_id > ? ORDER BY chat_id LIMIT ?`).bind(...binds, after, limit).all();
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
    const r = await D.prepare(`SELECT kind, role, COUNT(*) AS n, SUM(group_id IS NOT NULL) AS with_group FROM chats GROUP BY kind, role`).all();
    const fb = await D.prepare("SELECT chat_id, name, text, created_at FROM feedback ORDER BY id DESC LIMIT 20").all();
    return json({ stats: r.results, feedback: fb.results });
  }
  return new Response("Not found", { status: 404 });
}
async function onWebhook(request, env) {
  if (!await safeEqual(request.headers.get("x-telegram-bot-api-secret-token"), await webhookSecret(env))) {
    return new Response("Forbidden", { status: 403 });
  }
  const update = await request.json();
  await loadSubjects(env);
  if (update.message) await onMessage(env, update.message);
  else if (update.callback_query) await onCallback(env, update.callback_query);
  else if (update.my_chat_member) await onMyChatMember(env, update.my_chat_member);
  await track(env, update);
  return new Response("ok");
}
async function track(env, update) {
  try {
    const m = update.message, c = update.callback_query;
    const chat = m?.chat || c?.message?.chat;
    if (!chat) return;
    let k = null;
    if (c) k = "cb:" + String(c.data || "").split(":")[0];
    else if (m.text) {
      const cmd = parseCommand(m.text);
      k = cmd ? cmd.cmd : BUTTONS[m.text.trim()] || (chat.type === "private" ? "text" : null);
    }
    if (!k) return;
    const now = Date.now();
    const D = await db(env);
    await D.batch([
      D.prepare("UPDATE chats SET last_seen = ? WHERE chat_id = ? AND (last_seen IS NULL OR last_seen < ?)").bind(now, chat.id, now - 6e5),
      D.prepare("INSERT INTO usage (day, k, n) VALUES (?, ?, 1) ON CONFLICT(day, k) DO UPDATE SET n = n + 1").bind(ymd(tashkentNow(now)), k)
    ]);
  } catch (e) {
    console.warn("track", e?.message);
  }
}
var USAGE_NAMES = {
  today: "\u{1F4C5} Bugungi darslar",
  tomorrow: "\u27A1\uFE0F Ertangi darslar",
  week: "\u{1F5D3} Haftalik jadval",
  settings: "\u2699\uFE0F Sozlamalar",
  start: "\u25B6\uFE0F /start",
  help: "\u2753 Yordam",
  app: "\u{1F4F1} /app",
  group: "\u{1F465} Guruh tanlash",
  teacher: "\u{1F468}\u200D\u{1F3EB} O'qituvchi bo'limi",
  text: "\u{1F50E} Nom yozib qidirish",
  feedback: "\u270D\uFE0F Fikr yuborish",
  time: "\u23F0 Eslatma vaqti",
  lang: "\u{1F310} Til",
  setgroup: "\u{1F517} /setgroup (guruhda)"
};
async function sendStats(env, chatId, editId) {
  const D = await db(env);
  const now = Date.now();
  const tn = tashkentNow(now);
  const tz = tn.getTime() - now;
  const today0 = Date.UTC(tn.getUTCFullYear(), tn.getUTCMonth(), tn.getUTCDate()) - tz;
  const yday0 = today0 - 864e5, week0 = today0 - 6 * 864e5;
  const day = ymd(tn), dayW = ymd(tashkentNow(week0));
  const [a, top, use1, use7, fb, perDay, first] = await D.batch([
    D.prepare(`SELECT COUNT(*) total, SUM(kind = 'private') priv, SUM(kind != 'private') grp,
      SUM(kind = 'private' AND role = 'teacher') teachers, SUM(group_id IS NOT NULL) picked,
      SUM(created_at >= ?) new0, SUM(created_at >= ? AND created_at < ?) new1, SUM(created_at >= ?) new7,
      SUM(kind = 'private' AND last_seen >= ?) act0, SUM(kind = 'private' AND last_seen >= ?) act7, SUM(kind != 'private' AND last_seen >= ?) gact7,
      SUM(lang = 'uz') uz, SUM(lang = 'ru') ru, SUM(lang = 'en') en,
      SUM(alerts = 1) alerts, SUM(remind_at >= 0) remind, SUM(weekly = 1) weekly FROM chats`).bind(today0, yday0, today0, week0, today0, week0, week0),
    D.prepare("SELECT group_name, COUNT(*) n FROM chats WHERE group_id IS NOT NULL AND kind = 'private' AND role != 'teacher' GROUP BY group_id ORDER BY n DESC LIMIT 5"),
    D.prepare("SELECT k, n FROM usage WHERE day = ? ORDER BY n DESC").bind(day),
    D.prepare("SELECT k, SUM(n) n FROM usage WHERE day >= ? GROUP BY k ORDER BY n DESC").bind(dayW),
    D.prepare("SELECT COUNT(*) total, SUM(created_at >= ?) today FROM feedback").bind(today0),
    D.prepare("SELECT date((created_at + ?) / 1000, 'unixepoch') d, COUNT(*) n FROM chats WHERE created_at >= ? GROUP BY d ORDER BY d").bind(tz, week0),
    D.prepare("SELECT MIN(day) d FROM usage")
  ]);
  const r = a.results[0] || {};
  const n = (v) => v || 0;
  const dm2 = (s) => `${s.slice(8, 10)}.${s.slice(5, 7)}`;
  const feat = (rows) => {
    const list = rows.filter((x) => !x.k.startsWith("cb:") && x.k !== "stats" && x.k !== "reply").slice(0, 6);
    return list.length ? list.map((x, i) => `${i + 1}. ${USAGE_NAMES[x.k] || "/" + esc(x.k)} \u2014 <b>${x.n}</b>`).join("\n") : "\u2014";
  };
  const taps = (rows) => rows.filter((x) => x.k.startsWith("cb:")).reduce((s, x) => s + x.n, 0);
  const since = first.results[0]?.d;
  const lines = [
    "\u{1F4CA} <b>TDIU Jadval \u2014 statistika</b>",
    `\u{1F558} ${dm2(day)}.${day.slice(0, 4)}, ${hhmm(tn.getUTCHours() * 60 + tn.getUTCMinutes())} (Toshkent)`,
    "",
    `\u{1F465} <b>Jami: ${n(r.total)}</b>`,
    `   \u{1F464} Shaxsiy: ${n(r.priv)} \u2014 \u{1F393} ${n(r.priv) - n(r.teachers)} talaba, \u{1F468}\u200D\u{1F3EB} ${n(r.teachers)} o'qituvchi`,
    `   \u{1F4AC} Guruh chatlari: ${n(r.grp)}`,
    `   \u2705 Guruh/o'qituvchi tanlagan: ${n(r.picked)}`,
    "",
    `\u{1F195} <b>Yangi:</b> bugun ${n(r.new0)} \xB7 kecha ${n(r.new1)} \xB7 7 kunda ${n(r.new7)}`,
    perDay.results.length ? `\u{1F4C8} ${perDay.results.map((x) => `${dm2(x.d)}: ${x.n}`).join(" \xB7 ")}` : null,
    `\u{1F525} <b>Faol:</b> bugun ${n(r.act0)} \xB7 7 kunda ${n(r.act7)} kishi` + (n(r.gact7) ? ` (+${n(r.gact7)} guruh chati)` : ""),
    since && since > dayW ? `<i>(faollik ${dm2(since)} dan beri hisoblanmoqda)</i>` : null,
    "",
    "\u2B50 <b>Eng ko'p ishlatilgan \u2014 bugun</b>",
    feat(use1.results),
    taps(use1.results) ? `\u{1F446} Tugmalar bosildi: ${taps(use1.results)} marta` : null,
    "",
    "\u2B50 <b>Eng ko'p ishlatilgan \u2014 7 kun</b>",
    feat(use7.results),
    "",
    "\u{1F3C6} <b>Eng ko'p a'zoli guruhlar</b>",
    top.results.map((x, i) => `${i + 1}. ${esc(x.group_name || "?")} \u2014 ${x.n}`).join("\n") || "\u2014",
    "",
    `\u{1F310} Til: \u{1F1FA}\u{1F1FF} ${n(r.uz)} \xB7 \u{1F1F7}\u{1F1FA} ${n(r.ru)} \xB7 \u{1F1EC}\u{1F1E7} ${n(r.en)}`,
    `\u{1F514} O'zgarish xabari: ${n(r.alerts)} \xB7 \u{1F319} Kechki eslatma: ${n(r.remind)} \xB7 \u{1F5D3} Haftalik: ${n(r.weekly)}`,
    `\u270D\uFE0F Fikr-mulohaza: jami ${n(fb.results[0]?.total)} \xB7 bugun ${n(fb.results[0]?.today)}`,
    "",
    "<i>Mini App ochilishlari bu yerda hisoblanmaydi (u alohida sayt).</i>"
  ].filter((x) => x !== null);
  const text = lines.join("\n");
  const reply_markup = { inline_keyboard: [[{ text: "\u{1F504} Yangilash", callback_data: "adm:stats" }]] };
  if (editId) return tg(env, "editMessageText", { chat_id: chatId, message_id: editId, text, parse_mode: "HTML", reply_markup });
  return send(env, chatId, text, { reply_markup });
}
async function adminMenu(env) {
  try {
    const cur = await tg(env, "getMyCommands", { scope: { type: "all_private_chats" } });
    const list = (Array.isArray(cur.result) ? cur.result : []).filter((c) => c.command !== "stats");
    await tg(env, "setMyCommands", { scope: { type: "chat", chat_id: Number(env.ADMIN_CHAT_ID) }, commands: [{ command: "stats", description: "\u{1F4CA} Statistika (faqat siz uchun)" }, ...list] });
  } catch {
  }
}
function mainKeyboard(env, lang, groupId, role) {
  const L = tr(lang);
  const rows = [
    [{ text: L.btnToday }, { text: L.btnTomorrow }],
    [{ text: L.btnWeek }, { text: L.btnSettings }]
  ];
  if (siteUrl(env)) rows.push([
    { text: L.btnApp, web_app: { url: appUrl(env, groupId, lang, role) } },
    { text: L.btnFree, web_app: { url: `${siteUrl(env)}/#tab=free&l=${lang}` } }
  ]);
  return { keyboard: rows, resize_keyboard: true, is_persistent: true };
}
function appUrl(env, groupId, lang, role) {
  return `${siteUrl(env)}/#${groupId ? `${role === "teacher" ? "t" : "g"}=${groupId}&` : ""}l=${lang}`;
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
var isAdminChat = (env, chatId) => !!env.ADMIN_CHAT_ID && String(chatId) === String(env.ADMIN_CHAT_ID);
async function onAdminReply(env, msg, command) {
  let target;
  let text;
  if (command?.cmd === "stats") {
    await sendStats(env, msg.chat.id);
    await adminMenu(env);
    return true;
  }
  if (command?.cmd === "reply") {
    const m = /^(-?\d+)\s+([\s\S]+)$/.exec(command.arg || "");
    if (!m) {
      await send(env, msg.chat.id, "\u21A9\uFE0F Format: <code>/reply 123456789 javob matni</code>\nyoki feedback xabariga Reply qiling.");
      return true;
    }
    target = Number(m[1]);
    text = m[2];
  } else if (!command && msg.reply_to_message?.message_id && msg.text) {
    const rp = msg.reply_to_message;
    const r = await (await db(env)).prepare("SELECT chat_id FROM feedback_replies WHERE admin_msg_id = ?").bind(rp.message_id).first();
    target = r?.chat_id;
    if (target == null && /fikr-mulohaza/i.test(rp.text || "")) {
      const m = /\(id:\s*(-?\d+)\)/.exec(rp.text);
      if (m) target = Number(m[1]);
    }
    if (target == null) return false;
    text = msg.text;
  } else {
    return false;
  }
  const trow = await getChat(env, target);
  const res = await send(env, target, tr(trow?.lang || "uz").adminReply(esc(String(text).slice(0, 3500))));
  await send(env, msg.chat.id, res.ok ? "\u2705 Javob yuborildi." : "\u274C Yuborilmadi (foydalanuvchi botni bloklagan bo'lishi mumkin).", { reply_to_message_id: msg.message_id });
  return true;
}
async function onPrivate(env, msg, command) {
  if (isAdminChat(env, msg.chat.id) && await onAdminReply(env, msg, command)) return;
  const { row, isNew } = await ensureChat(env, msg.chat, msg.from?.language_code);
  const lang = row.lang;
  const L = tr(lang);
  const uid = msg.from.id;
  const action = command ? command.cmd : BUTTONS[msg.text.trim()];
  if (action === "start") {
    const m = /^g_([a-z0-9]+)$/.exec(command.arg);
    if (m) return chooseGroup(env, msg.chat, uid, m[1], null, lang);
    const mt = /^t_([a-z0-9]+)$/.exec(command.arg);
    if (mt) return chooseTeacher(env, msg.chat, uid, mt[1], null, lang);
    if (siteUrl(env)) await syncMenu(env, msg.chat.id);
    await send(env, msg.chat.id, L.welcome, { reply_markup: mainKeyboard(env, lang, row.group_id, row.role) });
    if (!row.group_id) return askRole(env, msg.chat.id, uid, lang, null, row.role);
    return;
  }
  if (action === "help") return send(env, msg.chat.id, L.help, { reply_markup: mainKeyboard(env, lang, row.group_id, row.role) });
  if (action === "group" || action === "setgroup") {
    await setRole(env, msg.chat.id, row, "student");
    return showFaculties(env, msg.chat.id, uid, lang, null);
  }
  if (action === "teacher") {
    if (command?.arg) return searchTeachers(env, msg.chat.id, uid, lang, command.arg);
    await setRole(env, msg.chat.id, row, "teacher");
    return showTeacherLetters(env, msg.chat.id, uid, lang, null);
  }
  if (action === "lang" || action === "language") return askLanguage(env, msg.chat.id, "settings");
  if (action === "time" || action === "remind") return setRemindTime(env, msg.chat.id, row, command?.arg);
  if (action === "settings") return showSettings(env, msg.chat.id, row, null);
  if (action === "app") {
    return send(env, msg.chat.id, "\u{1F4F1}", { reply_markup: { inline_keyboard: [[{ text: L.btnApp, web_app: { url: appUrl(env, row.group_id, lang, row.role) } }]] } });
  }
  if (action === "today" || action === "tomorrow" || action === "week") {
    if (!row.group_id) {
      if (isTeacher(row)) {
        await send(env, msg.chat.id, L.noTeacher);
        return showTeacherLetters(env, msg.chat.id, uid, lang, null);
      }
      await send(env, msg.chat.id, L.noGroup);
      return showFaculties(env, msg.chat.id, uid, lang, null);
    }
    return sendSchedule(env, msg.chat.id, row, action);
  }
  if (action === "feedback") {
    const text = command.arg;
    if (!text) return send(env, msg.chat.id, L.feedbackPrompt);
    await addFeedback(env, msg.chat.id, msg.from?.username ? "@" + msg.from.username : msg.from?.first_name, text.slice(0, 2e3));
    return send(env, msg.chat.id, L.feedbackThanks);
  }
  if (action === "calendar" && CALENDAR_ENABLED) {
    if (!row.group_id) {
      await send(env, msg.chat.id, L.noGroup);
      return showFaculties(env, msg.chat.id, uid, lang, null);
    }
    const url = `${siteUrl(env)}/data/ics/${row.group_id}.ics`;
    return send(env, msg.chat.id, L.calendarInfo(url), { reply_markup: { inline_keyboard: [[{ text: L.btnCalendar, url }]] } });
  }
  if (command) return send(env, msg.chat.id, L.help);
  if (isTeacher(row)) return searchTeachers(env, msg.chat.id, uid, lang, msg.text);
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
  if (cmd === "time" || cmd === "remind") {
    if (!await isAdmin(env, msg.chat.id, msg)) return send(env, msg.chat.id, L.onlyAdmins, { reply_to_message_id: msg.message_id });
    return setRemindTime(env, msg.chat.id, row, command.arg);
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
    [index, group] = await Promise.all([getIndex(env), getEntity(env, row)]);
  } catch {
    return send(env, chatId, L.dataError);
  }
  if (!group) return send(env, chatId, row.kind !== "private" ? L.noGroupChat : isTeacher(row) ? L.noTeacher : L.noGroup);
  const now = tashkentNow();
  const extra = {};
  const kb = await appButton(env, row);
  if (kb) extra.reply_markup = kb;
  if (what === "week") {
    const monday = mondayOf(weekday(now) === 6 ? addDays(now, 1) : now);
    if (row.lang !== "uz") return send(env, chatId, fmtWeek(group, index, monday, row.lang), extra);
    const photo = `${siteUrl(env)}/img/${isTeacher(row) ? "t" : "g"}/${group.id}.png?v=${group.v || index.tt?.num || ""}`;
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
  const [index, group] = await Promise.all([getIndex(env), getEntity(env, row)]);
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
async function getBotName(env) {
  if (!botName) botName = (await tg(env, "getMe", {})).result?.username || null;
  return botName;
}
async function appButton(env, row) {
  const L = tr(row.lang);
  if (!siteUrl(env)) return null;
  if (row.kind === "private") return { inline_keyboard: [[{ text: L.btnOpenInApp, web_app: { url: appUrl(env, row.group_id, row.lang, row.role) } }]] };
  const name = await getBotName(env);
  return name ? { inline_keyboard: [[{ text: L.btnOpenInApp, url: `https://t.me/${name}?start=g_${row.group_id}` }]] } : null;
}
async function inviteKeyboard(env, lang, groupId, groupName) {
  const L = tr(lang);
  const name = await getBotName(env);
  if (!name) return void 0;
  const link = `https://t.me/${name}?start=g_${groupId}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(L.inviteShareText(groupName))}`;
  return { inline_keyboard: [[{ text: L.btnInvite, url: shareUrl }]] };
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
var CYR = { \u0430: "a", \u0431: "b", \u0432: "v", \u0433: "g", \u0434: "d", \u0435: "e", \u0451: "yo", \u0436: "j", \u0437: "z", \u0438: "i", \u0439: "y", \u043A: "k", \u043B: "l", \u043C: "m", \u043D: "n", \u043E: "o", \u043F: "p", \u0440: "r", \u0441: "s", \u0442: "t", \u0443: "u", \u0444: "f", \u0445: "x", \u0446: "ts", \u0447: "ch", \u0448: "sh", \u0449: "sh", \u044A: "", \u044B: "i", \u044C: "", \u044D: "e", \u044E: "yu", \u044F: "ya", \u045E: "o", \u049B: "q", \u0493: "g", \u04B3: "h" };
var normT = (s) => String(s || "").toLowerCase().replace(/[а-яёўқғҳ]/g, (c) => CYR[c] ?? c).toUpperCase().replace(/[^A-Z0-9]/g, "");
async function askRole(env, chatId, uid, lang, messageId, current) {
  const L = tr(lang);
  const mark = (r) => current === r ? " \u2713" : "";
  const kb = { inline_keyboard: [
    [{ text: L.btnStudent + mark("student"), callback_data: `R:${uid}:s` }, { text: L.btnTeacher + mark("teacher"), callback_data: `R:${uid}:t` }],
    langRow(lang, `role:${uid}`)
  ] };
  if (messageId) return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text: L.askRole, parse_mode: "HTML", reply_markup: kb });
  return send(env, chatId, L.askRole, { reply_markup: kb });
}
async function showTeacherLetters(env, chatId, uid, lang, messageId) {
  const L = tr(lang);
  let people;
  try {
    people = await getPeople(env);
  } catch {
    return send(env, chatId, L.dataError);
  }
  if (!people) return send(env, chatId, L.dataError);
  const letters = [...new Set(people.teachers.map(([, n]) => normT(n).charAt(0)).filter(Boolean))].sort();
  const kb = [];
  for (let i = 0; i < letters.length; i += 6) kb.push(letters.slice(i, i + 6).map((l) => ({ text: l, callback_data: `tl:${uid}:${l}:0` })));
  kb.push([{ text: L.back, callback_data: `RM:${uid}` }]);
  kb.push(langRow(lang, `tpick:${uid}`));
  const text = `${L.chooseTeacher}

${L.teacherSearchHint}`;
  if (messageId) return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
  return send(env, chatId, text, { reply_markup: { inline_keyboard: kb } });
}
async function showTeachers(env, chatId, uid, lang, letter, page, messageId) {
  const L = tr(lang);
  let people;
  try {
    people = await getPeople(env);
  } catch {
    return send(env, chatId, L.dataError);
  }
  const list = (people?.teachers || []).filter(([, n]) => normT(n).charAt(0) === letter);
  if (!list.length) return showTeacherLetters(env, chatId, uid, lang, messageId);
  const slice = list.slice(page * TPAGE, page * TPAGE + TPAGE);
  const kb = [];
  for (let i = 0; i < slice.length; i += 2) kb.push(slice.slice(i, i + 2).map(([id, name]) => ({ text: name, callback_data: `tp:${uid}:${id}` })));
  const nav = [{ text: L.back, callback_data: `tL:${uid}` }];
  if (page > 0) nav.push({ text: "\u2B05\uFE0F", callback_data: `tl:${uid}:${letter}:${page - 1}` });
  if ((page + 1) * TPAGE < list.length) nav.push({ text: L.more, callback_data: `tl:${uid}:${letter}:${page + 1}` });
  kb.push(nav);
  return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text: `\u{1F468}\u200D\u{1F3EB} <b>${esc(letter)}</b> \xB7 ${list.length}
${L.chooseTeacher}`, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
}
async function searchTeachers(env, chatId, uid, lang, query, notFoundText) {
  const L = tr(lang);
  const q = normT(query);
  const miss = () => send(env, chatId, notFoundText || L.teacherNotFound);
  if (q.length < 2) return miss();
  let people;
  try {
    people = await getPeople(env);
  } catch {
    return send(env, chatId, L.dataError);
  }
  const hits = [];
  for (const [id, name] of people?.teachers || []) {
    const n = normT(name);
    if (n.includes(q)) hits.push([id, name, n.startsWith(q) ? 0 : 1]);
  }
  if (!hits.length) return miss();
  hits.sort((a, b) => a[2] - b[2] || a[1].localeCompare(b[1]));
  const top = hits.slice(0, 20);
  const kb = [];
  for (let i = 0; i < top.length; i += 2) kb.push(top.slice(i, i + 2).map(([id, name]) => ({ text: "\u{1F468}\u200D\u{1F3EB} " + name, callback_data: `tp:${uid}:${id}` })));
  return send(env, chatId, `\u{1F50E} ${L.found}`, { reply_markup: { inline_keyboard: kb } });
}
async function chooseTeacher(env, chat, uid, teacherId, messageId, langHint) {
  if (chat.type !== "private") return;
  const { row } = await ensureChat(env, chat, null);
  const lang = row.lang || langHint;
  const L = tr(lang);
  let people;
  try {
    people = await getPeople(env);
  } catch {
    return send(env, chat.id, L.dataError);
  }
  const hit = (people?.teachers || []).find(([id]) => id === teacherId);
  if (!hit) return send(env, chat.id, L.teacherNotFound);
  const name = hit[1];
  const firstTime = !(isTeacher(row) && row.group_id);
  await updateChat(env, chat.id, { role: "teacher", group_id: teacherId, group_name: name });
  const text = L.teacherSet(esc(name));
  if (messageId) await tg(env, "editMessageText", { chat_id: chat.id, message_id: messageId, text, parse_mode: "HTML" });
  else await send(env, chat.id, text);
  const [index, t] = await Promise.all([getIndex(env), getTeacher(env, teacherId)]);
  const now = tashkentNow();
  if (t) await send(env, chat.id, fmtDay({ ...t, kind: "t" }, index, now, lang, now), { reply_markup: mainKeyboard(env, lang, teacherId, "teacher") });
  else await send(env, chat.id, L.dataError, { reply_markup: mainKeyboard(env, lang, teacherId, "teacher") });
  if (firstTime) await send(env, chat.id, L.teacherTip);
}
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
  if (!hits.length) return searchTeachers(env, chatId, uid, lang, query, L.notFound);
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
  const firstTimeSetup = chat.type === "private" && !row.group_id;
  await updateChat(env, chat.id, { group_id: groupId, group_name: name, role: "student" });
  const isPrivate = chat.type === "private";
  const text = isPrivate ? L.groupSet(esc(name)) : L.groupSetChat(esc(name), remindOf(row));
  const markup = isPrivate ? void 0 : { inline_keyboard: [langRow(lang, "chat")] };
  if (messageId) await tg(env, "editMessageText", { chat_id: chat.id, message_id: messageId, text, parse_mode: "HTML", reply_markup: markup });
  else await send(env, chat.id, text, markup ? { reply_markup: markup } : {});
  const updated = { ...row, group_id: groupId, group_name: name, role: "student" };
  if (isPrivate) {
    const [index, group] = await Promise.all([getIndex(env), getGroup(env, groupId)]);
    if (group) await send(env, chat.id, fmtDay(group, index, tashkentNow(), lang, tashkentNow()), { reply_markup: mainKeyboard(env, lang, groupId) });
    const n = await countGroupmates(env, groupId, chat.id);
    await send(env, chat.id, L.inviteCaption(esc(name), n), { reply_markup: await inviteKeyboard(env, lang, groupId, name) });
    if (firstTimeSetup) await send(env, chat.id, L.groupChatTip);
  } else {
    await sendSchedule(env, chat.id, updated, "week");
  }
}
var remindOf = (row) => row.remind_at ?? 1260;
async function setRemindTime(env, chatId, row, arg) {
  const L = tr(row.lang);
  if (!arg) return showRemindPicker(env, chatId, row, null);
  const m = parseClock(arg);
  if (m == null) return send(env, chatId, L.remindBad);
  await updateChat(env, chatId, { remind_at: m });
  return send(env, chatId, L.remindSet(m));
}
async function showRemindPicker(env, chatId, row, messageId) {
  const L = tr(row.lang);
  const cur = remindOf(row);
  const btn = (h) => ({ text: (cur === h * 60 ? "\u2713 " : "") + hhmm(h * 60), callback_data: `rt:${h * 60}` });
  const kb = { inline_keyboard: [[8, 12, 18, 19].map(btn), [20, 21, 22, 23].map(btn), [{ text: (cur < 0 ? "\u2713 " : "") + L.btnRemindOff, callback_data: "rt:-1" }]] };
  const text = `${L.remindTitle}

${L.setRemind(cur)}`;
  if (messageId) return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", reply_markup: kb });
  return send(env, chatId, text, { reply_markup: kb });
}
async function showSettings(env, chatId, row, messageId) {
  const L = tr(row.lang);
  const teacher = isTeacher(row);
  const pickedLine = teacher ? L.setTeacher(esc(row.group_name)) : L.setGroup(esc(row.group_name));
  const text = [L.settings, "", pickedLine, L.setAlerts(!!row.alerts), L.setWeekly(!!row.weekly), L.setRemind(remindOf(row))].join("\n");
  const kb = {
    inline_keyboard: [
      [{ text: L.setAlerts(!!row.alerts), callback_data: "s:alerts" }],
      [{ text: L.setWeekly(!!row.weekly), callback_data: "s:weekly" }],
      [{ text: L.setRemind(remindOf(row)), callback_data: "s:time" }],
      [{ text: L.setLang, callback_data: "s:lang" }, { text: (teacher ? "\u{1F468}\u200D\u{1F3EB} " : "\u{1F465} ") + (row.group_name || "\u2014"), callback_data: "s:group" }]
    ]
  };
  if (row.kind === "private") {
    kb.inline_keyboard.push([{ text: L.btnRole, callback_data: "s:role" }]);
    kb.inline_keyboard.push([{ text: L.btnFeedback, callback_data: "s:feedback" }]);
  }
  if (row.kind === "private" && row.group_id && !teacher) {
    const invite = await inviteKeyboard(env, row.lang, row.group_id, row.group_name || "");
    if (invite) kb.inline_keyboard.push(invite.inline_keyboard[0]);
    if (CALENDAR_ENABLED && siteUrl(env)) kb.inline_keyboard.push([{ text: L.btnCalendar, callback_data: "s:calendar" }]);
  }
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
  if (["f", "c", "F", "g", "R", "RM", "tL", "tl", "tp"].includes(kind)) {
    const uid = Number(parts[1]);
    if (uid === 0 ? !await isAdmin(env, chatId, cb) : uid !== cb.from.id) {
      return tg(env, "answerCallbackQuery", { callback_query_id: cb.id, text: uid === 0 ? L.onlyAdmins : L.notYourMenu, show_alert: true });
    }
  }
  if (isGroupChat && (kind === "s" || kind === "lang" || kind === "rt") && !await isAdmin(env, chatId, cb)) {
    return tg(env, "answerCallbackQuery", { callback_query_id: cb.id, text: L.onlyAdmins, show_alert: true });
  }
  tg(env, "answerCallbackQuery", { callback_query_id: cb.id });
  if (kind === "adm") {
    if (isAdminChat(env, chatId)) await sendStats(env, chatId, msg.message_id);
    return;
  }
  if (kind === "lang") {
    const newLang = LANGS.includes(parts[1]) ? parts[1] : "uz";
    await updateChat(env, chatId, { lang: newLang });
    const L2 = tr(newLang);
    if (parts[2] === "pick") return showFaculties(env, chatId, parts[3], newLang, msg.message_id);
    if (parts[2] === "tpick") return showTeacherLetters(env, chatId, parts[3], newLang, msg.message_id);
    if (parts[2] === "role") return askRole(env, chatId, parts[3], newLang, msg.message_id, row.role);
    if (parts[2] === "chat") {
      return tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: L2.groupSetChat(esc(row.group_name || ""), remindOf(row)), parse_mode: "HTML", reply_markup: { inline_keyboard: [langRow(newLang, "chat")] } });
    }
    if (parts[2] === "start") {
      await tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: L2.langName });
      await send(env, chatId, L2.welcome, { reply_markup: mainKeyboard(env, newLang, row.group_id, row.role) });
      if (!row.group_id) return askRole(env, chatId, cb.from.id, newLang, null, row.role);
      return;
    }
    await tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: "\u2705 " + L2.langName });
    if (!isGroupChat) await send(env, chatId, "\u{1F44C}", { reply_markup: mainKeyboard(env, newLang, row.group_id, row.role) });
    return;
  }
  if (kind === "rt") {
    const m = Math.max(-1, Math.min(1439, Number(parts[1]) || 0));
    await updateChat(env, chatId, { remind_at: m });
    return tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: L.remindSet(m), parse_mode: "HTML" });
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
  if (["R", "RM", "tL", "tl", "tp"].includes(kind)) {
    if (isGroupChat) return;
    if (kind === "R") {
      const role = parts[2] === "t" ? "teacher" : "student";
      await setRole(env, chatId, row, role);
      return role === "teacher" ? showTeacherLetters(env, chatId, parts[1], lang, msg.message_id) : showFaculties(env, chatId, parts[1], lang, msg.message_id);
    }
    if (kind === "RM") return askRole(env, chatId, parts[1], lang, msg.message_id, row.role);
    if (kind === "tL") return showTeacherLetters(env, chatId, parts[1], lang, msg.message_id);
    if (kind === "tl") return showTeachers(env, chatId, parts[1], lang, parts[2], Number(parts[3]) || 0, msg.message_id);
    return chooseTeacher(env, chat, Number(parts[1]), parts[2], msg.message_id, lang);
  }
  if (kind === "s") {
    const what = parts[1];
    if (what === "alerts" || what === "weekly") {
      const val = row[what] ? 0 : 1;
      await updateChat(env, chatId, { [what]: val });
      return showSettings(env, chatId, { ...row, [what]: val }, msg.message_id);
    }
    if (what === "lang") return askLanguage(env, chatId, "settings", msg.message_id);
    if (what === "time") return showRemindPicker(env, chatId, row, msg.message_id);
    if (what === "group") return isTeacher(row) && !isGroupChat ? showTeacherLetters(env, chatId, cb.from.id, lang, msg.message_id) : showFaculties(env, chatId, cb.from.id, lang, msg.message_id);
    if (what === "role") return isGroupChat ? void 0 : askRole(env, chatId, cb.from.id, lang, msg.message_id, row.role);
    if (what === "feedback") return send(env, chatId, L.feedbackPrompt);
    if (what === "calendar" && CALENDAR_ENABLED) {
      if (!row.group_id) return;
      const url = `${siteUrl(env)}/data/ics/${row.group_id}.ics`;
      return send(env, chatId, L.calendarInfo(url), { reply_markup: { inline_keyboard: [[{ text: L.btnCalendar, url }]] } });
    }
  }
}
export {
  worker_default as default
};
