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
    welcome: "Assalomu alaykum! \u{1F44B}\nMen <b>TDIU Jadval</b> botiman.\n\n\u2022 Talaba va o'qituvchilar jadvalini ko'rsataman\n\u2022 Jadval o'zgarsa darhol xabar beraman\n\u2022 Bo'sh xonalarni qidiraman\n\u2022 Ustoz hozir qaysi xonada ekanini aytaman\n\nBoshlash uchun kim ekaningizni tanlang \u{1F447}",
    chooseFaculty: "\u{1F3DB} Fakultetni tanlang:",
    chooseCourse: "\u{1F393} Kursni tanlang:",
    chooseGroup: "\u{1F465} Guruhni tanlang:",
    chooseDirection: "\u{1F9ED} Yo'nalishni tanlang:",
    course: (n) => n ? `${n}-kurs` : "Boshqa",
    searchHint: "\u{1F4A1} Yoki guruh nomini yozing, masalan: <code>MO-901</code>",
    groupSet: (g) => `\u2705 Guruh saqlandi: <b>${g}</b>`,
    groupSetChat: (g, m = 1260) => `\u2705 Bu chat <b>${g}</b> guruhiga ulandi.

\u{1F319} Har kuni soat <b>${hhmm(m)}</b> da ertangi darslar yuboriladi (vaqtni admin /time bilan o'zgartiradi).
\u{1F5D3} Har yakshanba kechqurun haftalik jadval, jadval o'zgarsa darhol xabar beriladi.`,
    noGroup: "Siz hali guruh tanlamagansiz. /group buyrug'ini yuboring.",
    noGroupChat: "Bu chat hali guruhga ulanmagan. Chat admini /setgroup yuborsin.",
    noLessons: "Dars yo'q \u{1F389}",
    noTT: "\u23F3 Bu guruh uchun jadval hali EduPage'da kiritilmagan. Jadval paydo bo'lishi bilan sizga xabar beraman.",
    freeDay: "Bugun dars yo'q \u{1F389}",
    today: "Bugun",
    tomorrow: "Ertaga",
    btnToday: "\u{1F4C5} Bugun",
    btnTomorrow: "\u27A1\uFE0F Ertaga",
    btnWeek: "\u{1F5D3} Hafta",
    btnSettings: "\u2699\uFE0F Sozlamalar",
    btnApp: "\u{1F4F1} Ilovani ochish",
    btnFree: "\u{1F7E2} Bo'sh xonalar",
    btnWhere: "\u{1F50E} Ustoz qayerda?",
    whereAsk: "\u{1F50E} Ustoz qayerda?\nO'qituvchining familiyasini yozing \u{1F447}",
    whereAskPh: "Karimov",
    whereNone: "Bunday ustoz topilmadi. Familiyani tekshiring, masalan: Karimov",
    wherePick: "\u{1F50E} Topildi \u2014 qaysi ustoz?",
    whereGroupHint: "\u{1F50E} Ustoz qayerda? Familiyani yozing: <code>/where Karimov</code>",
    whereMine: "\u{1F50E} <b>Ustoz qayerda?</b>\n\u{1F393} Sizga dars beradigan ustozlar \u2014 birini tanlang:",
    whereMineGroup: "\u{1F50E} <b>Ustoz qayerda?</b>\n\u{1F393} Guruh ustozlari \u2014 birini tanlang (boshqasi uchun: <code>/where Karimov</code>):",
    btnWhereOther: "\u270D\uFE0F Boshqa ustoz",
    btnWhereBack: "\u25C0\uFE0F Mening ustozlarim",
    btnRefresh: "\u{1F504} Yangilash",
    btnWhereApp: "\u{1F4F1} Ilovada ochish",
    whatsNew: "\u{1F195} <b>Yangilik!</b>\n\n\u{1F50E} <b>Ustoz qayerda?</b> \u2014 o'qituvchining hozir qaysi xonada ekanini, keyingi darsi qachon va qayerda ekanini bilib oling.\n\nTugma pastdagi menyuga qo'shildi \u{1F447}",
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
    help: "<b>Buyruqlar</b>\n/today \u2014 bugungi darslar\n/tomorrow \u2014 ertangi darslar\n/week \u2014 haftalik jadval\n/group \u2014 guruhni tanlash (talaba)\n/where \u2014 ustoz qayerda? (masalan: /where Karimov)\n/teacher \u2014 o'qituvchi sifatida kirish\n/settings \u2014 sozlamalar\n/time \u2014 ertangi dars eslatmasi vaqti\n/app \u2014 ilovani ochish\n/feedback \u2014 taklif yoki xato yuborish\n\n<b>Guruh chatida</b>\n/setgroup \u2014 chatni guruhga ulash (admin)\n/unset \u2014 uzish (admin)\n/time \u2014 ertangi dars eslatmasi vaqti (admin)",
    dataError: "Jadvalni yuklab bo'lmadi, birozdan so'ng qayta urinib ko'ring.",
    now: "Hozir",
    btnInvite: "\u{1F4E4} Do'stlarni taklif qilish",
    inviteCaption: (g, n) => n > 0 ? `\u{1F389} <b>${g}</b> guruhidan yana ${n} kishi botdan foydalanmoqda!

Guruhdoshlaringizni ham taklif qiling \u{1F447}` : "\u{1F44B} Guruhdoshlaringizni ham taklif qiling \u2014 ularga ham qulay bo'ladi!",
    inviteShareText: (g) => `TDIU Jadval \u2014 ${g} guruhi jadvalini ko'rsatadi va o'zgarsa darhol xabar beradi. Sinab ko'ring:`,
    inviteShareGeneric: "TDIU Jadval \u2014 dars jadvalini ko'rsatadi va o'zgarsa darhol xabar beradi. Sinab ko'ring:",
    groupChatTip: "\u{1F4A1} <b>Maslahat:</b> botni guruh chatingizga ham qo'shing \u2014 u yerda /setgroup yuborsangiz, butun guruhga avtomatik xabar boradi.",
    feedbackPrompt: "\u270D\uFE0F Taklif yoki xatoni yozing:\n<code>/feedback Xona nomi noto'g'ri ko'rsatilyapti</code>",
    feedbackThanks: "\u2705 Rahmat! Xabaringiz qabul qilindi.",
    feedbackLimit: "\u23F3 Bir soat ichida juda ko'p xabar yuborildi. Iltimos, birozdan keyin qayta urinib ko'ring.",
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
    welcome: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u{1F44B}\n\u042F <b>TDIU Jadval</b> \u2014 \u0431\u043E\u0442 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u0422\u0413\u042D\u0423.\n\n\u2022 \u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u043E\u0432 \u0438 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0435\u0439\n\u2022 \u0421\u0440\u0430\u0437\u0443 \u0441\u043E\u043E\u0431\u0449\u0430\u044E \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445\n\u2022 \u0418\u0449\u0443 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438\n\u2022 \u041F\u043E\u0434\u0441\u043A\u0430\u0436\u0443, \u0432 \u043A\u0430\u043A\u043E\u0439 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438 \u0441\u0435\u0439\u0447\u0430\u0441 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C\n\n\u0414\u043B\u044F \u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u043A\u0442\u043E \u0432\u044B \u{1F447}",
    chooseFaculty: "\u{1F3DB} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442:",
    chooseCourse: "\u{1F393} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0443\u0440\u0441:",
    chooseGroup: "\u{1F465} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443:",
    chooseDirection: "\u{1F9ED} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435:",
    course: (n) => n ? `${n} \u043A\u0443\u0440\u0441` : "\u0414\u0440\u0443\u0433\u043E\u0435",
    searchHint: "\u{1F4A1} \u0418\u043B\u0438 \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: <code>MO-901</code>",
    groupSet: (g) => `\u2705 \u0413\u0440\u0443\u043F\u043F\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430: <b>${g}</b>`,
    groupSetChat: (g, m = 1260) => `\u2705 \u042D\u0442\u043E\u0442 \u0447\u0430\u0442 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0433\u0440\u0443\u043F\u043F\u0435 <b>${g}</b>.

\u{1F319} \u041A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C \u0432 <b>${hhmm(m)}</b> \u044F \u0431\u0443\u0434\u0443 \u043F\u0440\u0438\u0441\u044B\u043B\u0430\u0442\u044C \u043F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430 (\u0432\u0440\u0435\u043C\u044F \u043C\u0435\u043D\u044F\u0435\u0442 \u0430\u0434\u043C\u0438\u043D \u043A\u043E\u043C\u0430\u043D\u0434\u043E\u0439 /time).
\u{1F5D3} \u041A\u0430\u0436\u0434\u043E\u0435 \u0432\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435 \u0432\u0435\u0447\u0435\u0440\u043E\u043C \u2014 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E, \u0430 \u043F\u0440\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445 \u2014 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435.`,
    noGroup: "\u0412\u044B \u0435\u0449\u0451 \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u0433\u0440\u0443\u043F\u043F\u0443. \u041E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 /group.",
    noGroupChat: "\u0427\u0430\u0442 \u0435\u0449\u0451 \u043D\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0433\u0440\u0443\u043F\u043F\u0435. \u0410\u0434\u043C\u0438\u043D \u0447\u0430\u0442\u0430 \u0434\u043E\u043B\u0436\u0435\u043D \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C /setgroup.",
    noLessons: "\u041F\u0430\u0440 \u043D\u0435\u0442 \u{1F389}",
    noTT: "\u23F3 \u0414\u043B\u044F \u044D\u0442\u043E\u0439 \u0433\u0440\u0443\u043F\u043F\u044B \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0432 EduPage \u0435\u0449\u0451 \u043D\u0435 \u0432\u043D\u0435\u0441\u0435\u043D\u043E. \u041A\u0430\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u043D\u043E \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F, \u044F \u0441\u043E\u043E\u0431\u0449\u0443.",
    freeDay: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u0430\u0440 \u043D\u0435\u0442 \u{1F389}",
    today: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F",
    tomorrow: "\u0417\u0430\u0432\u0442\u0440\u0430",
    btnToday: "\u{1F4C5} \u0421\u0435\u0433\u043E\u0434\u043D\u044F",
    btnTomorrow: "\u27A1\uFE0F \u0417\u0430\u0432\u0442\u0440\u0430",
    btnWeek: "\u{1F5D3} \u041D\u0435\u0434\u0435\u043B\u044F",
    btnSettings: "\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
    btnApp: "\u{1F4F1} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
    btnFree: "\u{1F7E2} \u0421\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435",
    btnWhere: "\u{1F50E} \u0413\u0434\u0435 \u043F\u0440\u0435\u043F\u043E\u0434?",
    whereAsk: "\u{1F50E} \u0413\u0434\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C?\n\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0444\u0430\u043C\u0438\u043B\u0438\u044E \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044F \u{1F447}",
    whereAskPh: "Karimov",
    whereNone: "\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0444\u0430\u043C\u0438\u043B\u0438\u044E, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: Karimov",
    wherePick: "\u{1F50E} \u041D\u0430\u0439\u0434\u0435\u043D\u043E \u2014 \u043A\u0430\u043A\u043E\u0439 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C?",
    whereGroupHint: "\u{1F50E} \u0413\u0434\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C? \u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0444\u0430\u043C\u0438\u043B\u0438\u044E: <code>/where Karimov</code>",
    whereMine: "\u{1F50E} <b>\u0413\u0434\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C?</b>\n\u{1F393} \u0412\u0430\u0448\u0438 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0438 \u2014 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435:",
    whereMineGroup: "\u{1F50E} <b>\u0413\u0434\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C?</b>\n\u{1F393} \u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0438 \u0433\u0440\u0443\u043F\u043F\u044B \u2014 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 (\u0434\u0440\u0443\u0433\u043E\u0439: <code>/where Karimov</code>):",
    btnWhereOther: "\u270D\uFE0F \u0414\u0440\u0443\u0433\u043E\u0439 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C",
    btnWhereBack: "\u25C0\uFE0F \u041C\u043E\u0438 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0438",
    btnRefresh: "\u{1F504} \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",
    btnWhereApp: "\u{1F4F1} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438",
    whatsNew: "\u{1F195} <b>\u041D\u043E\u0432\u0438\u043D\u043A\u0430!</b>\n\n\u{1F50E} <b>\u0413\u0434\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C?</b> \u2014 \u0443\u0437\u043D\u0430\u0439\u0442\u0435, \u0432 \u043A\u0430\u043A\u043E\u0439 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C \u0441\u0435\u0439\u0447\u0430\u0441, \u0430 \u0442\u0430\u043A\u0436\u0435 \u043A\u043E\u0433\u0434\u0430 \u0438 \u0433\u0434\u0435 \u0435\u0433\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043F\u0430\u0440\u0430.\n\n\u041A\u043D\u043E\u043F\u043A\u0430 \u043F\u043E\u044F\u0432\u0438\u043B\u0430\u0441\u044C \u0432 \u043C\u0435\u043D\u044E \u0432\u043D\u0438\u0437\u0443 \u{1F447}",
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
    help: "<b>\u041A\u043E\u043C\u0430\u043D\u0434\u044B</b>\n/today \u2014 \u043F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F\n/tomorrow \u2014 \u043F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430\n/week \u2014 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E\n/where \u2014 \u0433\u0434\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C? (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: /where Karimov)\n/group \u2014 \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443 (\u0441\u0442\u0443\u0434\u0435\u043D\u0442)\n/teacher \u2014 \u0432\u043E\u0439\u0442\u0438 \u043A\u0430\u043A \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C\n/settings \u2014 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438\n/time \u2014 \u0432\u0440\u0435\u043C\u044F \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F \u043E \u043F\u0430\u0440\u0430\u0445 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430\n/app \u2014 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435\n/feedback \u2014 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432 \u0438\u043B\u0438 \u0441\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435\n\n<b>\u0412 \u0447\u0430\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u044B</b>\n/setgroup \u2014 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u0447\u0430\u0442 \u043A \u0433\u0440\u0443\u043F\u043F\u0435 (\u0430\u0434\u043C\u0438\u043D)\n/unset \u2014 \u043E\u0442\u0432\u044F\u0437\u0430\u0442\u044C (\u0430\u0434\u043C\u0438\u043D)\n/time \u2014 \u0432\u0440\u0435\u043C\u044F \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F \u043E \u043F\u0430\u0440\u0430\u0445 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430 (\u0430\u0434\u043C\u0438\u043D)",
    dataError: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435.",
    now: "\u0421\u0435\u0439\u0447\u0430\u0441",
    btnInvite: "\u{1F4E4} \u041F\u0440\u0438\u0433\u043B\u0430\u0441\u0438\u0442\u044C \u0434\u0440\u0443\u0437\u0435\u0439",
    inviteCaption: (g, n) => n > 0 ? `\u{1F389} \u0415\u0449\u0451 ${n} \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u0438\u0437 \u0433\u0440\u0443\u043F\u043F\u044B <b>${g}</b> \u0443\u0436\u0435 \u043F\u043E\u043B\u044C\u0437\u0443\u044E\u0442\u0441\u044F \u0431\u043E\u0442\u043E\u043C!

\u041F\u0440\u0438\u0433\u043B\u0430\u0441\u0438\u0442\u0435 \u0438 \u0441\u0432\u043E\u0438\u0445 \u043E\u0434\u043D\u043E\u0433\u0440\u0443\u043F\u043F\u043D\u0438\u043A\u043E\u0432 \u{1F447}` : "\u041F\u0440\u0438\u0433\u043B\u0430\u0441\u0438\u0442\u0435 \u0441\u0432\u043E\u0438\u0445 \u043E\u0434\u043D\u043E\u0433\u0440\u0443\u043F\u043F\u043D\u0438\u043A\u043E\u0432 \u2014 \u0438\u043C \u0442\u043E\u0436\u0435 \u0431\u0443\u0434\u0435\u0442 \u0443\u0434\u043E\u0431\u043D\u043E!",
    inviteShareText: (g) => `TDIU Jadval \u2014 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B ${g} \u0438 \u0441\u0440\u0430\u0437\u0443 \u0441\u043E\u043E\u0431\u0449\u0430\u0435\u0442 \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435:`,
    inviteShareGeneric: "TDIU Jadval \u2014 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438 \u0441\u0440\u0430\u0437\u0443 \u0441\u043E\u043E\u0431\u0449\u0430\u0435\u0442 \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435:",
    groupChatTip: "\u{1F4A1} <b>\u0421\u043E\u0432\u0435\u0442:</b> \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0431\u043E\u0442\u0430 \u0438 \u0432 \u0447\u0430\u0442 \u0432\u0430\u0448\u0435\u0439 \u0433\u0440\u0443\u043F\u043F\u044B \u2014 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0442\u0430\u043C /setgroup, \u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0431\u0443\u0434\u0443\u0442 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u044C \u0432\u0441\u0435\u0439 \u0433\u0440\u0443\u043F\u043F\u0435 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.",
    feedbackPrompt: "\u270D\uFE0F \u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043E\u0442\u0437\u044B\u0432 \u0438\u043B\u0438 \u043E\u043F\u0438\u0448\u0438\u0442\u0435 \u043E\u0448\u0438\u0431\u043A\u0443:\n<code>/feedback \u041D\u0435\u0432\u0435\u0440\u043D\u043E \u0443\u043A\u0430\u0437\u0430\u043D\u0430 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F</code>",
    feedbackThanks: "\u2705 \u0421\u043F\u0430\u0441\u0438\u0431\u043E! \u0412\u0430\u0448\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E.",
    feedbackLimit: "\u23F3 \u0417\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0447\u0430\u0441 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435.",
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
    welcome: "Hi! \u{1F44B}\nI'm <b>TDIU Jadval</b>, the TSUE timetable bot.\n\n\u2022 I show student and teacher timetables\n\u2022 I tell you right away when it changes\n\u2022 I can find free rooms\n\u2022 I can tell where a teacher is right now\n\nTo start, tell me who you are \u{1F447}",
    chooseFaculty: "\u{1F3DB} Choose your faculty:",
    chooseCourse: "\u{1F393} Choose your year:",
    chooseGroup: "\u{1F465} Choose your group:",
    chooseDirection: "\u{1F9ED} Choose a direction:",
    course: (n) => n ? `Year ${n}` : "Other",
    searchHint: "\u{1F4A1} Or type your group name, e.g. <code>MO-901</code>",
    groupSet: (g) => `\u2705 Group saved: <b>${g}</b>`,
    groupSetChat: (g, m = 1260) => `\u2705 This chat is now linked to <b>${g}</b>.

\u{1F319} Every day at <b>${hhmm(m)}</b> I'll post tomorrow's classes (an admin can change the time with /time).
\u{1F5D3} Every Sunday evening the week's timetable, and an alert whenever it changes.`,
    noGroup: "You haven't picked a group yet. Send /group.",
    noGroupChat: "This chat isn't linked to a group yet. A chat admin should send /setgroup.",
    noLessons: "No classes \u{1F389}",
    noTT: "\u23F3 This group's timetable has not been entered in EduPage yet. I'll let you know as soon as it appears.",
    freeDay: "No classes today \u{1F389}",
    today: "Today",
    tomorrow: "Tomorrow",
    btnToday: "\u{1F4C5} Today",
    btnTomorrow: "\u27A1\uFE0F Tomorrow",
    btnWeek: "\u{1F5D3} Week",
    btnSettings: "\u2699\uFE0F Settings",
    btnApp: "\u{1F4F1} Open app",
    btnFree: "\u{1F7E2} Free rooms",
    btnWhere: "\u{1F50E} Find a teacher",
    whereAsk: "\u{1F50E} Where is the teacher?\nType the teacher's surname \u{1F447}",
    whereAskPh: "Karimov",
    whereNone: "Teacher not found. Check the surname, e.g. Karimov",
    wherePick: "\u{1F50E} Found \u2014 which teacher?",
    whereGroupHint: "\u{1F50E} Where is the teacher? Type the surname: <code>/where Karimov</code>",
    whereMine: "\u{1F50E} <b>Where is the teacher?</b>\n\u{1F393} Your teachers \u2014 pick one:",
    whereMineGroup: "\u{1F50E} <b>Where is the teacher?</b>\n\u{1F393} The group's teachers \u2014 pick one (another: <code>/where Karimov</code>):",
    btnWhereOther: "\u270D\uFE0F Another teacher",
    btnWhereBack: "\u25C0\uFE0F My teachers",
    btnRefresh: "\u{1F504} Refresh",
    btnWhereApp: "\u{1F4F1} Open in app",
    whatsNew: "\u{1F195} <b>New!</b>\n\n\u{1F50E} <b>Find a teacher</b> \u2014 see which room a teacher is in right now, and when and where their next class is.\n\nThe button is now in the menu below \u{1F447}",
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
    help: "<b>Commands</b>\n/today \u2014 today's classes\n/tomorrow \u2014 tomorrow's classes\n/week \u2014 weekly timetable\n/where \u2014 find a teacher (e.g. /where Karimov)\n/group \u2014 choose group (student)\n/teacher \u2014 sign in as a teacher\n/settings \u2014 settings\n/time \u2014 reminder time for tomorrow's classes\n/app \u2014 open the app\n/feedback \u2014 send feedback or report a bug\n\n<b>In a group chat</b>\n/setgroup \u2014 link chat to a group (admin)\n/unset \u2014 unlink (admin)\n/time \u2014 reminder time for tomorrow's classes (admin)",
    dataError: "Couldn't load the timetable, please try again in a moment.",
    now: "Now",
    btnInvite: "\u{1F4E4} Invite friends",
    inviteCaption: (g, n) => n > 0 ? `\u{1F389} ${n} more people from <b>${g}</b> already use the bot!

Invite your groupmates too \u{1F447}` : "Invite your groupmates too \u2014 it'll be handy for them as well!",
    inviteShareText: (g) => `TDIU Jadval \u2014 shows ${g}'s timetable and tells you right away when it changes. Try it:`,
    inviteShareGeneric: "TDIU Jadval \u2014 shows your timetable and tells you right away when it changes. Try it:",
    groupChatTip: "\u{1F4A1} <b>Tip:</b> add the bot to your group chat too \u2014 send /setgroup there and the whole group gets updates automatically.",
    feedbackPrompt: "\u270D\uFE0F Write your feedback or describe the bug:\n<code>/feedback The room number is shown wrong</code>",
    feedbackThanks: "\u2705 Thanks! Your message has been received.",
    feedbackLimit: "\u23F3 Too many messages in the last hour. Please try again a little later.",
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
function langFromCode(code) {
  const c = String(code || "").slice(0, 2).toLowerCase();
  if (c === "ru") return "ru";
  if (c === "en") return "en";
  return "uz";
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
var displayMonday = (now) => mondayOf(weekday(now) === 6 ? addDays(now, 1) : now);
var weekImgPath = (kind, id, lang) => `img/${lang === "ru" || lang === "en" ? lang + "/" : ""}${kind === "t" ? "t" : "g"}/${id}.png`;
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
    seeApp: "\u{1F4F1} Batafsil \u2014 ilovada",
    h: (m) => m >= 60 ? `${Math.floor(m / 60)} soat${m % 60 ? " " + m % 60 + " daqiqa" : ""}` : `${m} daqiqa`,
    wh: {
      now: "\u{1F7E2} <b>Hozir darsda</b>",
      between: "\u{1F7E1} <b>Hozir dars yo'q</b>",
      before: "\u23F3 <b>Bugungi dars hali boshlanmagan</b>",
      after: "\u{1F3C1} <b>Bugungi darslar tugagan</b>",
      off: "\u26AA <b>Bugun dars yo'q</b>",
      until: (t, left) => `\u23F1 ${t} gacha \u2014 ${left} qoldi`,
      next: "\u23ED <b>Keyingi dars</b>",
      inM: (d) => `${d}dan so'ng`,
      tomorrow: "Ertaga",
      today: (c) => `\u{1F5D3} <b>Bugungi tartib</b> \xB7 ${c}`,
      noRoom: "xona ko'rsatilmagan",
      note: "\u2139\uFE0F Rasmiy dars jadvali asosida \u2014 kutilmagan o'zgarishlar bo'lishi mumkin."
    }
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
    seeApp: "\u{1F4F1} \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u2014 \u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438",
    h: (m) => m >= 60 ? `${Math.floor(m / 60)} \u0447${m % 60 ? " " + m % 60 + " \u043C\u0438\u043D" : ""}` : `${m} \u043C\u0438\u043D`,
    wh: {
      now: "\u{1F7E2} <b>\u0421\u0435\u0439\u0447\u0430\u0441 \u043D\u0430 \u043F\u0430\u0440\u0435</b>",
      between: "\u{1F7E1} <b>\u0421\u0435\u0439\u0447\u0430\u0441 \u043F\u0430\u0440\u044B \u043D\u0435\u0442</b>",
      before: "\u23F3 <b>\u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0435 \u043F\u0430\u0440\u044B \u0435\u0449\u0451 \u043D\u0435 \u043D\u0430\u0447\u0430\u043B\u0438\u0441\u044C</b>",
      after: "\u{1F3C1} <b>\u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0435 \u043F\u0430\u0440\u044B \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C</b>",
      off: "\u26AA <b>\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u0430\u0440 \u043D\u0435\u0442</b>",
      until: (t, left) => `\u23F1 \u0434\u043E ${t} \u2014 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C ${left}`,
      next: "\u23ED <b>\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043F\u0430\u0440\u0430</b>",
      inM: (d) => `\u0447\u0435\u0440\u0435\u0437 ${d}`,
      tomorrow: "\u0417\u0430\u0432\u0442\u0440\u0430",
      today: (c) => `\u{1F5D3} <b>\u041F\u043B\u0430\u043D \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F</b> \xB7 ${c}`,
      noRoom: "\u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u0430",
      note: "\u2139\uFE0F \u041F\u043E \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u043C\u0443 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044E \u2014 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B \u043D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F."
    }
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
    seeApp: "\u{1F4F1} More in the app",
    h: (m) => m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? " " + m % 60 + " min" : ""}` : `${m} min`,
    wh: {
      now: "\u{1F7E2} <b>In class right now</b>",
      between: "\u{1F7E1} <b>No class right now</b>",
      before: "\u23F3 <b>Today's classes haven't started yet</b>",
      after: "\u{1F3C1} <b>Today's classes are over</b>",
      off: "\u26AA <b>No classes today</b>",
      until: (t, left) => `\u23F1 until ${t} \u2014 ${left} left`,
      next: "\u23ED <b>Next class</b>",
      inM: (d) => `in ${d}`,
      tomorrow: "Tomorrow",
      today: (c) => `\u{1F5D3} <b>Today's plan</b> \xB7 ${c}`,
      noRoom: "no room given",
      note: "\u2139\uFE0F Based on the official timetable \u2014 unexpected changes are possible."
    }
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
var TYPE_DOT = { lecture: "\u{1F7E6}", seminar: "\u{1F7E9}", lab: "\u{1F7E7}", practice: "\u{1F7E7}" };
var typeDot = (type) => TYPE_DOT[type] || "\u2B1C";
function fmtLesson(l, periods, lang, parity, state) {
  const w = words(lang);
  const t = times(periods, l);
  const sub = parseSubject(l.s, lang);
  const head = `${typeDot(sub.type)} <b>${t.a} \u2013 ${t.b}</b> \xB7 <i>${w.pair(l.p)}</i>${weekTag(l, lang, parity)}${state ? `  ${state}` : ""}`;
  const lines = [head, `${subjHtml(sub, true)}${sub.type ? ` \u2014 ${typeLabel(sub.type, lang)}` : ""}${l.g ? ` <i>(${esc(l.g)})</i>` : ""}`];
  const meta = [];
  if (l.r) meta.push(`\u{1F4CD} <b>${esc(roomLabel(l.r, lang))}</b>`);
  if (l.t) meta.push(`\u{1F464} ${esc(l.t)}`);
  if (meta.length) lines.push(meta.join("  \xB7  "));
  if (l.gr) lines.push(`\u{1F465} ${esc(l.gr)}`);
  return `<blockquote>${lines.join("\n")}</blockquote>`;
}
function fmtLessonShort(l, periods, lang, parity) {
  const t = times(periods, l);
  const sub = parseSubject(l.s, lang);
  let s = `${typeDot(sub.type)} <b>${t.a}</b> ${subjHtml(sub)}`;
  if (sub.type) s += ` <i>(${typeLabel(sub.type, lang).toLowerCase()})</i>`;
  if (l.g) s += ` <i>[${esc(l.g)}]</i>`;
  if (l.gr) s += ` <i>[${esc(l.gr)}]</i>`;
  if (l.r) s += ` \xB7 \u{1F4CD}${esc(l.r)}`;
  if (l.w && !parity) s += ` \xB7 <i>${l.w === "A" ? tr(lang).weekA : tr(lang).weekB}</i>`;
  return s;
}
var noTimetable = (group) => !!group && Array.isArray(group.lessons) && group.lessons.length === 0;
function fmtDay(group, index, date, lang, nowDate) {
  const L = tr(lang);
  const w = words(lang);
  const d = weekday(date);
  const parity = weekParity(index.weekA, date);
  const ls = d === 6 ? [] : lessonsForDay(group, d, parity);
  const endM = ls.length ? Math.max(...ls.map((l) => mins(times(index.periods, l).b))) : 0;
  const span = ls.length ? ` \xB7 ${times(index.periods, ls[0]).a}\u2013${hhmm(endM)}` : "";
  const head = [
    `\u{1F4C5} <b>${L.days[d]}, ${fmtDate(date, lang)}</b>` + (parity ? ` \xB7 ${parity === "A" ? L.weekA : L.weekB}` : ""),
    `${whoIcon(group)} ${esc(group.name)}${ls.length ? ` \xB7 ${w.count(ls.length)}${span}` : ""}`
  ].join("\n");
  if (!ls.length) return `${head}

${noTimetable(group) ? L.noTT : L.noLessons}`;
  const sameDay = nowDate && ymd(nowDate) === ymd(date);
  const nowM = sameDay ? nowDate.getUTCHours() * 60 + nowDate.getUTCMinutes() : -1;
  let nextMarked = false;
  const blocks = [];
  let prevEnd = null;
  for (const l of ls) {
    const t = times(index.periods, l);
    if (prevEnd != null) {
      const gap = mins(t.a) - prevEnd;
      if (gap >= 30) blocks.push(`<i>${w.brk(gap)}</i>`);
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
  return clip(`${head}

${blocks.join("\n")}

${w.finish(hhmm(endM))}`);
}
function spanOf(periods, l) {
  const a = periods.find((p) => p.p === l.p);
  const b = periods.find((p) => p.p === l.p + (l.n || 1) - 1) || a;
  return a ? { from: mins(a.start), to: mins(b.end) } : { from: 0, to: 0 };
}
function dayItems(entity, index, date) {
  const d = weekday(date);
  if (d === 6) return [];
  return lessonsForDay(entity, d, weekParity(index.weekA, date)).map((l) => ({ l, ...spanOf(index.periods, l) })).sort((x, y) => x.from - y.from || x.l.p - y.l.p);
}
function whereIs(entity, index, now) {
  const nowM = now.getUTCHours() * 60 + now.getUTCMinutes();
  const today = dayItems(entity, index, now);
  const cur = today.filter((x) => nowM >= x.from && nowM < x.to);
  const later = today.filter((x) => x.from > nowM);
  const done = today.some((x) => x.to <= nowM);
  let next = null;
  if (later.length) next = { date: now, today: true, items: later.filter((x) => x.from === later[0].from) };
  else {
    for (let k = 1; k <= 14 && !next; k++) {
      const date = addDays(now, k), items = dayItems(entity, index, date);
      if (items.length) next = { date, today: false, items: items.filter((x) => x.from === items[0].from) };
    }
  }
  const state = cur.length ? "now" : !today.length ? "off" : later.length ? done ? "between" : "before" : "after";
  const until = cur.length ? Math.max(...cur.map((x) => x.to)) : null;
  return { state, nowM, today, cur, next, until, left: until == null ? null : until - nowM, inMin: next && next.today ? next.items[0].from - nowM : null };
}
var shortList = (str, n = 2) => {
  const a = String(str || "").split(", ").filter(Boolean);
  return a.length > n ? `${a.slice(0, n).join(", ")} +${a.length - n}` : a.join(", ");
};
function fmtWhere(teacher, index, now, lang) {
  const w = words(lang), h = w.wh, L = tr(lang);
  const st = whereIs(teacher, index, now);
  const detail = (x) => {
    const l = x.l, sub = parseSubject(l.s, lang);
    const out2 = [
      `\u{1F4CD} <b>${esc(l.r ? roomLabel(l.r, lang) : h.noRoom)}</b>`,
      `${typeDot(sub.type)} ${subjHtml(sub, true)}${sub.type ? ` \u2014 ${typeLabel(sub.type, lang)}` : ""}${l.g ? ` <i>(${esc(l.g)})</i>` : ""}`
    ];
    if (l.gr) out2.push(`\u{1F465} ${esc(l.gr)}`);
    return out2.join("\n");
  };
  const out = [`\u{1F468}\u200D\u{1F3EB} <b>${esc(teacher.name)}</b>`, h[st.state]];
  if (st.state === "now") out.push(`<blockquote>${st.cur.map(detail).join("\n\n")}
${h.until(hhmm(st.until), w.h(st.left))}</blockquote>`);
  if (st.next) {
    const n = st.next, t0 = hhmm(n.items[0].from);
    const tomorrow = ymd(addDays(now, 1)) === ymd(n.date);
    const when = n.today ? `${t0} (${h.inM(w.h(st.inMin))})` : `${tomorrow ? h.tomorrow : `${L.days[weekday(n.date)]}, ${fmtDate(n.date, lang)}`}, ${t0}`;
    out.push("", `${h.next} \u2014 ${when}`, `<blockquote>${n.items.map(detail).join("\n\n")}</blockquote>`);
  }
  if (st.today.length) {
    out.push("", h.today(w.count(st.today.length)));
    for (const x of st.today) {
      const mark = st.cur.includes(x) ? "\u{1F7E2}" : x.to <= st.nowM ? "\u25AB\uFE0F" : "\u25AA\uFE0F";
      const room = x.l.r ? roomLabel(x.l.r, lang) : "\u2014";
      out.push(`${mark} ${hhmm(x.from)}\u2013${hhmm(x.to)} \xB7 ${esc(room)}${x.l.gr ? ` \xB7 ${esc(shortList(x.l.gr))}` : ""}`);
    }
  }
  out.push("", `<i>${h.note}</i>`);
  return clip(out.join("\n"));
}
function fmtWeek(group, index, monday, lang) {
  const L = tr(lang);
  const parity = weekParity(index.weekA, monday);
  const range = `${dm(monday)} \u2013 ${dm(addDays(monday, 5))}` + (parity ? ` \xB7 ${parity === "A" ? L.weekA : L.weekB}` : "");
  const parts = [L.weekTitle(esc(group.name), range)];
  for (let d = 0; d < 6; d++) {
    const ls = lessonsForDay(group, d, parity);
    if (!ls.length) continue;
    parts.push(`<b>${L.days[d]}</b> \xB7 ${words(lang).count(ls.length)}
${ls.map((l) => fmtLessonShort(l, index.periods, lang, parity)).join("\n")}`);
  }
  if (parts.length === 1) parts.push(noTimetable(group) ? L.noTT : words(lang).freeWeek);
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
  let out = s.slice(0, cut > 0 ? cut : 3950);
  const open = (out.match(/<blockquote>/g) || []).length, close = (out.match(/<\/blockquote>/g) || []).length;
  if (open > close) out += "</blockquote>";
  return out + "\n\u2026";
}
var BC_CAPTION_MAX = 1024;
function bcMessage(p, chat, ctx = {}) {
  const L = tr(chat.lang);
  const lang = LANGS.includes(chat.lang) ? chat.lang : "uz";
  const pick = (o) => o && (o[lang] || o.uz || Object.values(o).find(Boolean)) || "";
  const text = `\u{1F4E2} ${esc(pick(p.texts))}`;
  const rows = [];
  if (p.btn && p.btn.url) rows.push([{ text: pick(p.btn.text) || p.btn.url, url: p.btn.url }]);
  if (p.app !== false) {
    const gid = chat.group_id && validBcId(chat.group_id) ? `${chat.role === "teacher" ? "t" : "g"}=${chat.group_id}&` : "";
    if (ctx.site) rows.push([{ text: L.btnOpenInApp, web_app: { url: `${String(ctx.site).replace(/\/+$/, "")}/#${gid}l=${lang}` } }]);
    else if (ctx.bot) rows.push([{ text: L.btnOpenInApp, url: `https://t.me/${ctx.bot}` }]);
  }
  if (p.invite !== false && ctx.bot) {
    const link = `https://t.me/${ctx.bot}`;
    rows.push([{ text: L.btnInvite, url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(L.inviteShareGeneric)}` }]);
  }
  return { text, photo: p.photo ? { photo: p.photo, caption: text } : null, markup: rows.length ? { inline_keyboard: rows } : void 0 };
}
var validBcId = (id) => /^[A-Za-z0-9_-]{1,40}$/.test(String(id));

// src/jokes.mjs
var j = (uz, ru, en, extra = {}) => ({ uz, ru, en, ...extra });
var JOKES = {
  // ---- students, before a class
  s_morning: [
    j("\u2615 08:00 dagi dars \u2014 oddiy dars emas, iroda sinovi. Siz allaqachon g'olibsiz!", "\u2615 \u041F\u0430\u0440\u0430 \u0432 08:00 \u2014 \u044D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u0430\u0440\u0430, \u044D\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0441\u0438\u043B\u044B \u0432\u043E\u043B\u0438. \u0412\u044B \u0443\u0436\u0435 \u043F\u043E\u0431\u0435\u0434\u0438\u043B\u0438!", "\u2615 An 8 a.m. class isn't just a class, it's a test of willpower. You've already won!"),
    j("\u{1F6CF} Yostiq sizni sog'inadi. Lekin diplom sizni ko'proq kutyapti.", "\u{1F6CF} \u041F\u043E\u0434\u0443\u0448\u043A\u0430 \u043F\u043E \u0432\u0430\u043C \u0441\u043A\u0443\u0447\u0430\u0435\u0442. \u041D\u043E \u0434\u0438\u043F\u043B\u043E\u043C \u0436\u0434\u0451\u0442 \u0432\u0430\u0441 \u0441\u0438\u043B\u044C\u043D\u0435\u0435.", "\u{1F6CF} Your pillow misses you. But your diploma is waiting even harder."),
    j("\u2615 Kofe \u2014 ertalabki talabaning rasmiy yoqilg'isi. To'ldirib oldingizmi?", "\u2615 \u041A\u043E\u0444\u0435 \u2014 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u0442\u043E\u043F\u043B\u0438\u0432\u043E \u0443\u0442\u0440\u0435\u043D\u043D\u0435\u0433\u043E \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0430. \u0417\u0430\u043F\u0440\u0430\u0432\u0438\u043B\u0438\u0441\u044C?", "\u2615 Coffee is the official fuel of the morning student. Tank full?"),
    j("\u{1F305} Shahar hali uyg'onmagan, siz esa allaqachon bilim sari yo'ldasiz. Qahramon!", "\u{1F305} \u0413\u043E\u0440\u043E\u0434 \u0435\u0449\u0451 \u0441\u043F\u0438\u0442, \u0430 \u0432\u044B \u0443\u0436\u0435 \u0432 \u043F\u0443\u0442\u0438 \u0437\u0430 \u0437\u043D\u0430\u043D\u0438\u044F\u043C\u0438. \u0413\u0435\u0440\u043E\u0439!", "\u{1F305} The city's still asleep and you're already on your way to learn. Hero!")
  ],
  s_lecture: [
    j("\u{1F3A4} Ma'ruza \u2014 podkastning o'zi, faqat jonli va pauza tugmasisiz.", "\u{1F3A4} \u041B\u0435\u043A\u0446\u0438\u044F \u2014 \u044D\u0442\u043E \u043F\u043E\u0434\u043A\u0430\u0441\u0442, \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u0436\u0438\u0432\u0443\u044E \u0438 \u0431\u0435\u0437 \u043A\u043D\u043E\u043F\u043A\u0438 \u043F\u0430\u0443\u0437\u044B.", "\u{1F3A4} A lecture is a podcast, just live and without a pause button."),
    j(`\u{1F4DD} Bugungi konspekt \u2014 imtihon kuni o'zingizga aytadigan "rahmat"ingiz.`, "\u{1F4DD} \u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0439 \u043A\u043E\u043D\u0441\u043F\u0435\u043A\u0442 \u2014 \u044D\u0442\u043E \u0432\u0430\u0448\u0435 \xAB\u0441\u043F\u0430\u0441\u0438\u0431\u043E\xBB \u0441\u0435\u0431\u0435 \u0432 \u0434\u0435\u043D\u044C \u044D\u043A\u0437\u0430\u043C\u0435\u043D\u0430.", `\u{1F4DD} Today's notes are the "thank you" you'll send yourself on exam day.`),
    j("\u{1F9E0} Miyangizga yangi yangilanish yuklanmoqda... O'chirib qo'ymang!", "\u{1F9E0} \u0412 \u0432\u0430\u0448 \u043C\u043E\u0437\u0433 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u0442\u0441\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435... \u041D\u0435 \u0432\u044B\u043A\u043B\u044E\u0447\u0430\u0439\u0442\u0435!", "\u{1F9E0} A new update is downloading to your brain... Please don't switch off!")
  ],
  s_seminar: [
    j(`\u{1F4AC} "Kim javob beradi?" deganda ko'zingizni olib qochmang \u2014 bugun sizning kuningiz bo'lishi mumkin!`, "\u{1F4AC} \u041A\u043E\u0433\u0434\u0430 \u0441\u043F\u0440\u043E\u0441\u044F\u0442 \xAB\u041A\u0442\u043E \u043E\u0442\u0432\u0435\u0442\u0438\u0442?\xBB, \u043D\u0435 \u043E\u0442\u0432\u043E\u0434\u0438\u0442\u0435 \u0432\u0437\u0433\u043B\u044F\u0434 \u2014 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0432\u0430\u0448 \u0434\u0435\u043D\u044C!", `\u{1F4AC} When they ask "Who wants to answer?", don't look away. Today might be your day!`),
    j("\u{1F64B} Seminar \u2014 fikringiz eshitiladigan joy. Bitta gap ham katta qadam.", "\u{1F64B} \u0421\u0435\u043C\u0438\u043D\u0430\u0440 \u2014 \u043C\u0435\u0441\u0442\u043E, \u0433\u0434\u0435 \u0441\u043B\u044B\u0448\u0430\u0442 \u0432\u0430\u0448\u0435 \u043C\u043D\u0435\u043D\u0438\u0435. \u0414\u0430\u0436\u0435 \u043E\u0434\u043D\u0430 \u0444\u0440\u0430\u0437\u0430 \u2014 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0448\u0430\u0433.", "\u{1F64B} A seminar is where your voice gets heard. Even one sentence is a big step.")
  ],
  s_lab: [
    j("\u{1F52C} Laboratoriya \u2014 xato qilish rasman ruxsat etilgan joy. Fan aynan shunday rivojlangan!", "\u{1F52C} \u041B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u044F \u2014 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E, \u0433\u0434\u0435 \u043E\u0448\u0438\u0431\u0430\u0442\u044C\u0441\u044F \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u043E. \u0422\u0430\u043A \u0438 \u0440\u0430\u0437\u0432\u0438\u0432\u0430\u043B\u0430\u0441\u044C \u043D\u0430\u0443\u043A\u0430!", "\u{1F52C} The lab is the one place where mistakes are officially allowed. That's how science got here!"),
    j("\u{1F9EA} Bugungi tajriba muvaffaqiyatli bo'ladi. Bo'lmasa ham \u2014 baribir tajriba \u{1F642}", "\u{1F9EA} \u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0439 \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442 \u0443\u0434\u0430\u0441\u0442\u0441\u044F. \u0410 \u0435\u0441\u043B\u0438 \u043D\u0435\u0442 \u2014 \u044D\u0442\u043E \u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043E\u043F\u044B\u0442 \u{1F642}", "\u{1F9EA} Today's experiment will work. And if it doesn't, it's still experience \u{1F642}")
  ],
  s_last: [
    j("\u{1F3C1} Oxirgi para! Uy, choy va divan sizni kutmoqda.", "\u{1F3C1} \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0430\u0440\u0430! \u0414\u043E\u043C, \u0447\u0430\u0439 \u0438 \u0434\u0438\u0432\u0430\u043D \u0443\u0436\u0435 \u0436\u0434\u0443\u0442.", "\u{1F3C1} Last class! Home, tea and the sofa are waiting."),
    j("\u{1F50B} Batareya oz qoldi, lekin marra yaqin \u2014 yana bitta para!", "\u{1F50B} \u0417\u0430\u0440\u044F\u0434 \u043D\u0430 \u0438\u0441\u0445\u043E\u0434\u0435, \u043D\u043E \u0444\u0438\u043D\u0438\u0448 \u0431\u043B\u0438\u0437\u043A\u043E \u2014 \u0435\u0449\u0451 \u043E\u0434\u043D\u0430 \u043F\u0430\u0440\u0430!", "\u{1F50B} Battery is low but the finish line is close. Just one more class!")
  ],
  s_fri: [j("\u{1F389} Juma! Dam olish kunlari eshik oldida turibdi.", "\u{1F389} \u041F\u044F\u0442\u043D\u0438\u0446\u0430! \u0412\u044B\u0445\u043E\u0434\u043D\u044B\u0435 \u0443\u0436\u0435 \u0441\u0442\u043E\u044F\u0442 \u0443 \u0434\u0432\u0435\u0440\u0438.", "\u{1F389} Friday! The weekend is already at the door.")],
  s_sat: [j("\u{1F4AA} Shanba kuni darsga borayotganlar \u2014 haftaning eng irodali odamlari.", "\u{1F4AA} \u0422\u0435, \u043A\u0442\u043E \u0438\u0434\u0451\u0442 \u043D\u0430 \u043F\u0430\u0440\u044B \u0432 \u0441\u0443\u0431\u0431\u043E\u0442\u0443, \u2014 \u0441\u0430\u043C\u044B\u0435 \u0432\u043E\u043B\u0435\u0432\u044B\u0435 \u043B\u044E\u0434\u0438 \u043D\u0435\u0434\u0435\u043B\u0438.", "\u{1F4AA} People heading to class on a Saturday are the week's strongest-willed humans.")],
  s_mon: [j("\u{1F300} Hafta boshlandi. Toza sahifa, yangi imkoniyat!", "\u{1F300} \u041D\u0435\u0434\u0435\u043B\u044F \u043D\u0430\u0447\u0430\u043B\u0430\u0441\u044C. \u0427\u0438\u0441\u0442\u044B\u0439 \u043B\u0438\u0441\u0442 \u2014 \u043D\u043E\u0432\u044B\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438!", "\u{1F300} A new week has started. Clean page, fresh chances!")],
  s_lunch: [j("\u{1F37D} Eng og'ir sinov \u2014 ovqatdan keyingi para. Siz uddalaysiz!", "\u{1F37D} \u0421\u0430\u043C\u043E\u0435 \u0442\u0440\u0443\u0434\u043D\u043E\u0435 \u0438\u0441\u043F\u044B\u0442\u0430\u043D\u0438\u0435 \u2014 \u043F\u0430\u0440\u0430 \u043F\u043E\u0441\u043B\u0435 \u043E\u0431\u0435\u0434\u0430. \u0412\u044B \u0441\u043F\u0440\u0430\u0432\u0438\u0442\u0435\u0441\u044C!", "\u{1F37D} The hardest test of all: the class right after lunch. You've got this!")],
  s_any: [
    j("\u{1F392} Daftar bor, ruchka bor, kayfiyat 100%. Ketdik!", "\u{1F392} \u0422\u0435\u0442\u0440\u0430\u0434\u044C \u0435\u0441\u0442\u044C, \u0440\u0443\u0447\u043A\u0430 \u0435\u0441\u0442\u044C, \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435 100%. \u041F\u043E\u0435\u0445\u0430\u043B\u0438!", "\u{1F392} Notebook: check. Pen: check. Mood: 100%. Let's go!"),
    j("\u{1F604} Tabassum bilan kirsangiz, dars tezroq o'tadi. Ilmiy isbotlanmagan, lekin sinab ko'ring!", "\u{1F604} \u0415\u0441\u043B\u0438 \u0432\u043E\u0439\u0442\u0438 \u0441 \u0443\u043B\u044B\u0431\u043A\u043E\u0439, \u043F\u0430\u0440\u0430 \u043F\u0440\u043E\u043B\u0435\u0442\u0438\u0442 \u0431\u044B\u0441\u0442\u0440\u0435\u0435. \u041D\u0430\u0443\u0447\u043D\u043E \u043D\u0435 \u0434\u043E\u043A\u0430\u0437\u0430\u043D\u043E, \u043D\u043E \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435!", "\u{1F604} Walk in smiling and the class goes faster. Not scientifically proven, but worth a try!"),
    j("\u{1F4F1} Telefon ham biroz dam olsin \u2014 u kecha ko'p ishladi.", "\u{1F4F1} \u041F\u0443\u0441\u0442\u044C \u0442\u0435\u043B\u0435\u0444\u043E\u043D \u0442\u043E\u0436\u0435 \u043E\u0442\u0434\u043E\u0445\u043D\u0451\u0442 \u2014 \u043E\u043D \u0432\u0447\u0435\u0440\u0430 \u043C\u043D\u043E\u0433\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u043B.", "\u{1F4F1} Let your phone rest a bit too. It worked hard yesterday."),
    j("\u{1F340} Bugun kimdir sizdan konspekt so'rashi aniq. Tayyor turing!", "\u{1F340} \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u043A\u0442\u043E-\u0442\u043E \u0442\u043E\u0447\u043D\u043E \u043F\u043E\u043F\u0440\u043E\u0441\u0438\u0442 \u0443 \u0432\u0430\u0441 \u043A\u043E\u043D\u0441\u043F\u0435\u043A\u0442. \u0411\u0443\u0434\u044C\u0442\u0435 \u0433\u043E\u0442\u043E\u0432\u044B!", "\u{1F340} Someone will definitely ask to borrow your notes today. Be ready!"),
    j("\u{1F680} Bugungi dars \u2014 kelajakdagi o'zingizga sovg'a.", "\u{1F680} \u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u044F\u044F \u043F\u0430\u0440\u0430 \u2014 \u043F\u043E\u0434\u0430\u0440\u043E\u043A \u0432\u0430\u043C \u0432 \u0431\u0443\u0434\u0443\u0449\u0435\u043C.", "\u{1F680} Today's class is a gift to your future self."),
    j("\u{1F989} Bilim \u2014 eng yengil yuk: qancha ko'p bo'lsa ham og'irlik qilmaydi.", "\u{1F989} \u0417\u043D\u0430\u043D\u0438\u044F \u2014 \u0441\u0430\u043C\u044B\u0439 \u043B\u0451\u0433\u043A\u0438\u0439 \u0433\u0440\u0443\u0437: \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043D\u0438 \u043D\u043E\u0441\u0438, \u043D\u0435 \u0442\u044F\u0436\u0435\u043B\u043E.", "\u{1F989} Knowledge is the lightest luggage: carry as much as you like."),
    j("\u{1F3A7} Darsga kirishdan oldin bitta chuqur nafas \u2014 tayyor!", "\u{1F3A7} \u041E\u0434\u0438\u043D \u0433\u043B\u0443\u0431\u043E\u043A\u0438\u0439 \u0432\u0434\u043E\u0445 \u043F\u0435\u0440\u0435\u0434 \u043F\u0430\u0440\u043E\u0439 \u2014 \u0438 \u0432\u044B \u0433\u043E\u0442\u043E\u0432\u044B!", "\u{1F3A7} One deep breath before class, and you're ready!"),
    j("\u{1F5D3} Bugun dars, ertaga tajriba, keyin diplom. Reja zo'r!", "\u{1F5D3} \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u0430\u0440\u0430, \u0437\u0430\u0432\u0442\u0440\u0430 \u043E\u043F\u044B\u0442, \u043F\u043E\u0442\u043E\u043C \u0434\u0438\u043F\u043B\u043E\u043C. \u041E\u0442\u043B\u0438\u0447\u043D\u044B\u0439 \u043F\u043B\u0430\u043D!", "\u{1F5D3} Class today, experience tomorrow, a diploma after that. Great plan!"),
    j("\u2B50 Bugun o'zingizga bitta yulduzcha qo'ying \u2014 darsga keldingiz!", "\u2B50 \u041F\u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u0435\u0431\u0435 \u0437\u0432\u0451\u0437\u0434\u043E\u0447\u043A\u0443 \u2014 \u0432\u044B \u043F\u0440\u0438\u0448\u043B\u0438 \u043D\u0430 \u043F\u0430\u0440\u0443!", "\u2B50 Give yourself a gold star: you showed up!"),
    j("\u{1F331} Har bir dars bilan biroz o'sasiz. Ko'rinmaydi, lekin bor!", "\u{1F331} \u0421 \u043A\u0430\u0436\u0434\u043E\u0439 \u043F\u0430\u0440\u043E\u0439 \u0432\u044B \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0440\u0430\u0441\u0442\u0451\u0442\u0435. \u041D\u0435\u0437\u0430\u043C\u0435\u0442\u043D\u043E, \u043D\u043E \u0442\u043E\u0447\u043D\u043E!", "\u{1F331} You grow a little with every class. You can't see it, but it's there!"),
    j("\u{1F36B} Darsdan keyin o'zingizni bir narsa bilan siylang. Bunga loyiqsiz!", "\u{1F36B} \u041F\u043E\u0441\u043B\u0435 \u043F\u0430\u0440\u044B \u043F\u043E\u0431\u0430\u043B\u0443\u0439\u0442\u0435 \u0441\u0435\u0431\u044F \u0447\u0435\u043C-\u043D\u0438\u0431\u0443\u0434\u044C. \u0412\u044B \u0437\u0430\u0441\u043B\u0443\u0436\u0438\u043B\u0438!", "\u{1F36B} Treat yourself to something after class. You deserve it!"),
    j("\u{1F9E9} Bugungi mavzu \u2014 katta jumboqning yana bir bo'lagi.", "\u{1F9E9} \u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u044F\u044F \u0442\u0435\u043C\u0430 \u2014 \u0435\u0449\u0451 \u043E\u0434\u0438\u043D \u043A\u0443\u0441\u043E\u0447\u0435\u043A \u0431\u043E\u043B\u044C\u0448\u043E\u0433\u043E \u043F\u0430\u0437\u043B\u0430.", "\u{1F9E9} Today's topic is one more piece of a big puzzle."),
    j("\u{1F511} Bilim \u2014 eng ko'p eshik ochadigan kalit.", "\u{1F511} \u0417\u043D\u0430\u043D\u0438\u044F \u2014 \u043A\u043B\u044E\u0447, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u0441\u0435\u0433\u043E \u0434\u0432\u0435\u0440\u0435\u0439.", "\u{1F511} Knowledge is the key that opens the most doors."),
    j("\u{1F4D6} Bugun bitta narsani tushunsangiz ham, dars muvaffaqiyatli o'tdi.", "\u{1F4D6} \u041F\u043E\u0439\u043C\u0451\u0442\u0435 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0445\u043E\u0442\u044C \u043E\u0434\u043D\u0443 \u0432\u0435\u0449\u044C \u2014 \u043F\u0430\u0440\u0430 \u043F\u0440\u043E\u0448\u043B\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E.", "\u{1F4D6} Understand just one thing today and the class was a success."),
    j("\u{1F31F} Oldingi qatorda yaxshiroq eshitiladi. Ustoz ham sizni eslab qoladi \u{1F642}", "\u{1F31F} \u041D\u0430 \u043F\u0435\u0440\u0432\u043E\u043C \u0440\u044F\u0434\u0443 \u043B\u0443\u0447\u0448\u0435 \u0441\u043B\u044B\u0448\u043D\u043E. \u0418 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C \u0432\u0430\u0441 \u0437\u0430\u043F\u043E\u043C\u043D\u0438\u0442 \u{1F642}", "\u{1F31F} You hear better from the front row. And the teacher will remember you \u{1F642}"),
    j("\u{1F3AF} Bugungi maqsad: tushunish, yozish, tabassum.", "\u{1F3AF} \u0426\u0435\u043B\u044C \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F: \u043F\u043E\u043D\u044F\u0442\u044C, \u0437\u0430\u043F\u0438\u0441\u0430\u0442\u044C, \u0443\u043B\u044B\u0431\u043D\u0443\u0442\u044C\u0441\u044F.", "\u{1F3AF} Today's goal: understand, write it down, smile."),
    j("\u{1F324} Kayfiyat ob-havosi: ochiq, bilim yog'ishi kutilmoqda.", "\u{1F324} \u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u044F: \u044F\u0441\u043D\u043E, \u043E\u0436\u0438\u0434\u0430\u044E\u0442\u0441\u044F \u043E\u0441\u0430\u0434\u043A\u0438 \u0432 \u0432\u0438\u0434\u0435 \u0437\u043D\u0430\u043D\u0438\u0439.", "\u{1F324} Mood forecast: clear skies with a chance of knowledge."),
    j("\u{1F9C3} Suv, ruchka, daftar \u2014 darsning uch qahramoni. Hammasi joyidami?", "\u{1F9C3} \u0412\u043E\u0434\u0430, \u0440\u0443\u0447\u043A\u0430, \u0442\u0435\u0442\u0440\u0430\u0434\u044C \u2014 \u0442\u0440\u0438 \u0433\u0435\u0440\u043E\u044F \u043F\u0430\u0440\u044B. \u0412\u0441\u0435 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435?", "\u{1F9C3} Water, pen, notebook: the three heroes of every class. All present?"),
    j("\u{1F3C6} Darsga vaqtida kelish \u2014 kichik, lekin haqiqiy g'alaba.", "\u{1F3C6} \u041F\u0440\u0438\u0439\u0442\u0438 \u043D\u0430 \u043F\u0430\u0440\u0443 \u0432\u043E\u0432\u0440\u0435\u043C\u044F \u2014 \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0430\u044F, \u043D\u043E \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0430\u044F \u043F\u043E\u0431\u0435\u0434\u0430.", "\u{1F3C6} Getting to class on time is a small but real win."),
    j("\u{1F6B6} Shoshilmang, 11 daqiqa bor \u2014 bemalol yetib olasiz.", "\u{1F6B6} \u041D\u0435 \u0441\u043F\u0435\u0448\u0438\u0442\u0435, \u0435\u0441\u0442\u044C 11 \u043C\u0438\u043D\u0443\u0442 \u2014 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E \u0443\u0441\u043F\u0435\u0435\u0442\u0435.", "\u{1F6B6} No rush, you've got 11 minutes. Plenty of time."),
    j("\u{1F60A} Kursdoshingizga salom bering \u2014 kimdir bugun shunga muhtoj.", "\u{1F60A} \u041F\u043E\u0437\u0434\u043E\u0440\u043E\u0432\u0430\u0439\u0442\u0435\u0441\u044C \u0441 \u043E\u0434\u043D\u043E\u043A\u0443\u0440\u0441\u043D\u0438\u043A\u043E\u043C \u2014 \u043A\u043E\u043C\u0443-\u0442\u043E \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u044D\u0442\u043E \u043E\u0447\u0435\u043D\u044C \u043D\u0443\u0436\u043D\u043E.", "\u{1F60A} Say hi to a classmate. Someone needs that today.")
  ],
  // students who stay in the same room for the next class
  stay: [
    j("\u{1FA91} Shu xonada qolasiz \u2014 oyoqlaringiz rahmat aytadi!", "\u{1FA91} \u041E\u0441\u0442\u0430\u0451\u0442\u0435\u0441\u044C \u0432 \u044D\u0442\u043E\u0439 \u0436\u0435 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438 \u2014 \u043D\u043E\u0433\u0438 \u0441\u043A\u0430\u0436\u0443\u0442 \u0441\u043F\u0430\u0441\u0438\u0431\u043E!", "\u{1FA91} Same room for the next class. Your feet say thank you!"),
    j("\u{1FA9F} Tanaffusda derazani ochib qo'ying \u2014 keyingi dars yengilroq o'tadi.", "\u{1FA9F} \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043E\u043A\u043D\u043E \u043D\u0430 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u0435 \u2014 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043F\u0430\u0440\u0430 \u043F\u043E\u0439\u0434\u0451\u0442 \u043B\u0435\u0433\u0447\u0435.", "\u{1FA9F} Open a window during the break. The next class will feel lighter.", { win: true }),
    j("\u{1F9D8} Joyingizda bir cho'zilib oling \u2014 tanangiz ham tanaffusga loyiq.", "\u{1F9D8} \u041F\u043E\u0442\u044F\u043D\u0438\u0442\u0435\u0441\u044C \u043F\u0440\u044F\u043C\u043E \u043D\u0430 \u043C\u0435\u0441\u0442\u0435 \u2014 \u0442\u0435\u043B\u043E \u0442\u043E\u0436\u0435 \u0437\u0430\u0441\u043B\u0443\u0436\u0438\u043B\u043E \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u0443.", "\u{1F9D8} Have a stretch right where you are. Your body deserves a break too."),
    j("\u{1F3E0} Bu xona bugun ikkinchi uyingizga aylandi. Qulay o'tiring!", "\u{1F3E0} \u042D\u0442\u0430 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0441\u0442\u0430\u043B\u0430 \u0432\u0430\u0448\u0438\u043C \u0432\u0442\u043E\u0440\u044B\u043C \u0434\u043E\u043C\u043E\u043C. \u0423\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0439\u0442\u0435\u0441\u044C \u043F\u043E\u0443\u0434\u043E\u0431\u043D\u0435\u0435!", "\u{1F3E0} This room has become your second home today. Get comfy!"),
    j("\u{1F4A7} Xonadan chiqmasangiz ham, suv ichishni unutmang.", "\u{1F4A7} \u0414\u0430\u0436\u0435 \u0435\u0441\u043B\u0438 \u043D\u0435 \u0432\u044B\u0445\u043E\u0434\u0438\u0442\u0435 \u0438\u0437 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438, \u043D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C\u0442\u0435 \u043F\u043E\u043F\u0438\u0442\u044C \u0432\u043E\u0434\u044B.", "\u{1F4A7} Even if you're not leaving the room, don't forget to drink some water."),
    j("\u{1F4CD} Joy o'zgarmadi \u2014 eng yaxshi o'rindiq hali ham sizniki!", "\u{1F4CD} \u041C\u0435\u0441\u0442\u043E \u0442\u043E \u0436\u0435 \u2014 \u043B\u0443\u0447\u0448\u0435\u0435 \u043A\u0440\u0435\u0441\u043B\u043E \u0432\u0441\u0451 \u0435\u0449\u0451 \u0432\u0430\u0448\u0435!", "\u{1F4CD} Same room, so the best seat is still yours!"),
    j("\u{1F5C2} Daftarni yopmang \u2014 keyingi dars shu yerda boshlanadi.", "\u{1F5C2} \u041D\u0435 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u0439\u0442\u0435 \u0442\u0435\u0442\u0440\u0430\u0434\u044C \u2014 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043F\u0430\u0440\u0430 \u043D\u0430\u0447\u043D\u0451\u0442\u0441\u044F \u0437\u0434\u0435\u0441\u044C \u0436\u0435.", "\u{1F5C2} Don't close your notebook. The next class starts right here."),
    j("\u{1F60C} Bugun yo'lda vaqt yo'qotmaysiz \u2014 11 daqiqa toza dam olish!", "\u{1F60C} \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u043D\u0435 \u043D\u0430\u0434\u043E \u043D\u0438\u043A\u0443\u0434\u0430 \u0438\u0434\u0442\u0438 \u2014 11 \u043C\u0438\u043D\u0443\u0442 \u0447\u0438\u0441\u0442\u043E\u0433\u043E \u043E\u0442\u0434\u044B\u0445\u0430!", "\u{1F60C} No walking between rooms today: 11 minutes of pure rest!"),
    j("\u{1F440} Ko'zlaringizga dam bering: bir daqiqa derazadan uzoqqa qarang.", "\u{1F440} \u0414\u0430\u0439\u0442\u0435 \u0433\u043B\u0430\u0437\u0430\u043C \u043E\u0442\u0434\u043E\u0445\u043D\u0443\u0442\u044C: \u043C\u0438\u043D\u0443\u0442\u0443 \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u0432\u0434\u0430\u043B\u044C \u0432 \u043E\u043A\u043D\u043E.", "\u{1F440} Rest your eyes: look out of the window into the distance for a minute.", { win: true }),
    j("\u{1F91D} Yoningizdagi kursdosh bilan bir og'iz gaplashing \u2014 tanaffus shunga ham kerak.", "\u{1F91D} \u041F\u0435\u0440\u0435\u043A\u0438\u043D\u044C\u0442\u0435\u0441\u044C \u043F\u0430\u0440\u043E\u0439 \u0441\u043B\u043E\u0432 \u0441 \u0441\u043E\u0441\u0435\u0434\u043E\u043C \u2014 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u0430 \u0438 \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0442\u043E\u0436\u0435.", "\u{1F91D} Have a quick chat with the person next to you. That's what breaks are for.")
  ],
  // ---- teachers, before a class
  t_start: [
    j("\u{1F393} Talabalar uyqusirab kirsa ham, sizning darsingizdan ilhom bilan chiqadi.", "\u{1F393} \u041F\u0443\u0441\u0442\u044C \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u044B \u0437\u0430\u0445\u043E\u0434\u044F\u0442 \u0441\u043E\u043D\u043D\u044B\u043C\u0438 \u2014 \u0441 \u0432\u0430\u0448\u0435\u0439 \u043F\u0430\u0440\u044B \u043E\u043D\u0438 \u0432\u044B\u0439\u0434\u0443\u0442 \u0432\u0434\u043E\u0445\u043D\u043E\u0432\u043B\u0451\u043D\u043D\u044B\u043C\u0438.", "\u{1F393} Students may walk in sleepy, but they leave your class inspired."),
    j(`\u{1F64C} "Savollar bormi?" degandagi jimlik \u2014 o'ylayotganlar borligini bildiradi.`, "\u{1F64C} \u0422\u0438\u0448\u0438\u043D\u0430 \u043F\u043E\u0441\u043B\u0435 \xAB\u0415\u0441\u0442\u044C \u0432\u043E\u043F\u0440\u043E\u0441\u044B?\xBB \u043E\u0437\u043D\u0430\u0447\u0430\u0435\u0442, \u0447\u0442\u043E \u043A\u0442\u043E-\u0442\u043E \u0437\u0430\u0434\u0443\u043C\u0430\u043B\u0441\u044F.", '\u{1F64C} The silence after "Any questions?" means someone is thinking.'),
    j("\u2728 Kimdir aynan bugungi darsingizdan keyin kasbini tanlashi mumkin.", "\u2728 \u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u043A\u0442\u043E-\u0442\u043E \u0432\u044B\u0431\u0435\u0440\u0435\u0442 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u044E \u0438\u043C\u0435\u043D\u043D\u043E \u043F\u043E\u0441\u043B\u0435 \u0432\u0430\u0448\u0435\u0439 \u0441\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0435\u0439 \u043F\u0430\u0440\u044B.", "\u2728 Someone may choose their career because of today's class."),
    j("\u2615 Birinchi para \u2014 kofe va ilhom vaqti. Auditoriya sizni kutmoqda!", "\u2615 \u041F\u0435\u0440\u0432\u0430\u044F \u043F\u0430\u0440\u0430 \u2014 \u0432\u0440\u0435\u043C\u044F \u043A\u043E\u0444\u0435 \u0438 \u0432\u0434\u043E\u0445\u043D\u043E\u0432\u0435\u043D\u0438\u044F. \u0410\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F \u0436\u0434\u0451\u0442 \u0432\u0430\u0441!", "\u2615 First class of the day: time for coffee and inspiration. Your audience awaits!"),
    j("\u{1F4DA} Bitta yaxshi misol o'nta ta'rifdan kuchliroq.", "\u{1F4DA} \u041E\u0434\u0438\u043D \u0445\u043E\u0440\u043E\u0448\u0438\u0439 \u043F\u0440\u0438\u043C\u0435\u0440 \u0441\u0438\u043B\u044C\u043D\u0435\u0435 \u0434\u0435\u0441\u044F\u0442\u0438 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0439.", "\u{1F4DA} One good example beats ten definitions."),
    j("\u{1F3C1} Kunning oxirgi darsi \u2014 bugungi eng sabrli auditoriya sizniki.", "\u{1F3C1} \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0430\u0440\u0430 \u0434\u043D\u044F \u2014 \u0441\u0430\u043C\u0430\u044F \u0442\u0435\u0440\u043F\u0435\u043B\u0438\u0432\u0430\u044F \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0432\u0430\u0448\u0430.", "\u{1F3C1} Last class of the day: today's most patient audience is all yours."),
    j("\u{1F31F} Har bir darsingiz kimningdir kelajagiga qo'shilgan hissa.", "\u{1F31F} \u041A\u0430\u0436\u0434\u0430\u044F \u0432\u0430\u0448\u0430 \u043F\u0430\u0440\u0430 \u2014 \u0432\u043A\u043B\u0430\u0434 \u0432 \u0447\u044C\u0451-\u0442\u043E \u0431\u0443\u0434\u0443\u0449\u0435\u0435.", "\u{1F31F} Every class you teach is an investment in someone's future."),
    j("\u2600\uFE0F Yaxshi kayfiyat yuqumli \u2014 auditoriyaga ham albatta yuqadi!", "\u2600\uFE0F \u0425\u043E\u0440\u043E\u0448\u0435\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435 \u0437\u0430\u0440\u0430\u0437\u043D\u043E \u2014 \u043E\u043D\u043E \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u043F\u0435\u0440\u0435\u0434\u0430\u0441\u0442\u0441\u044F \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438!", "\u2600\uFE0F A good mood is contagious, and your audience will catch it!"),
    j(`\u{1F4A1} Bugun kimdir darsingizda "aha!" deydi. Bu siz tufayli bo'ladi.`, "\u{1F4A1} \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u043A\u0442\u043E-\u0442\u043E \u043D\u0430 \u0432\u0430\u0448\u0435\u0439 \u043F\u0430\u0440\u0435 \u0441\u043A\u0430\u0436\u0435\u0442 \xAB\u0430\u0433\u0430!\xBB. \u0418 \u044D\u0442\u043E \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u0432\u0430\u043C.", '\u{1F4A1} Today someone in your class will go "aha!". That will be thanks to you.'),
    j("\u{1F4DD} Doskadagi har bir yozuv kimningdir daftarida yashab qoladi.", "\u{1F4DD} \u041A\u0430\u0436\u0434\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C \u043D\u0430 \u0434\u043E\u0441\u043A\u0435 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442 \u0436\u0438\u0442\u044C \u0432 \u0447\u044C\u0435\u0439-\u0442\u043E \u0442\u0435\u0442\u0440\u0430\u0434\u0438.", "\u{1F4DD} Everything you write on the board lives on in someone's notebook."),
    j("\u{1F9ED} Bugun siz yo'l ko'rsatuvchisiz \u2014 auditoriya sizga ishonadi.", "\u{1F9ED} \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0432\u044B \u2014 \u043F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A, \u0438 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F \u0432\u0430\u043C \u0434\u043E\u0432\u0435\u0440\u044F\u0435\u0442.", "\u{1F9ED} Today you are the guide, and your audience trusts you."),
    j("\u{1F331} Ekilgan bilim urug'i bir kun albatta unib chiqadi.", "\u{1F331} \u041F\u043E\u0441\u0435\u044F\u043D\u043D\u043E\u0435 \u0437\u0435\u0440\u043D\u043E \u0437\u043D\u0430\u043D\u0438\u0439 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u043E\u0434\u043D\u0430\u0436\u0434\u044B \u043F\u0440\u043E\u0440\u0430\u0441\u0442\u0451\u0442.", "\u{1F331} Every seed of knowledge you plant will sprout one day."),
    j("\u{1F338} Bugungi darsingiz oson va maroqli o'tsin!", "\u{1F338} \u041F\u0443\u0441\u0442\u044C \u0441\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u044F\u044F \u043F\u0430\u0440\u0430 \u043F\u0440\u043E\u0439\u0434\u0451\u0442 \u043B\u0435\u0433\u043A\u043E \u0438 \u0441 \u0443\u0434\u043E\u0432\u043E\u043B\u044C\u0441\u0442\u0432\u0438\u0435\u043C!", "\u{1F338} May today's class be easy and enjoyable!"),
    j("\u2728 Auditoriya diqqatli, savollar qiziqarli bo'lsin!", "\u2728 \u041F\u0443\u0441\u0442\u044C \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F \u0431\u0443\u0434\u0435\u0442 \u0432\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0439, \u0430 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u043D\u044B\u043C\u0438!", "\u2728 Wishing you an attentive audience and interesting questions!"),
    j("\u{1F340} Darsingizga omad! Talabalar sizdan ko'p narsa o'rganadi.", "\u{1F340} \u0423\u0434\u0430\u0447\u043D\u043E\u0439 \u043F\u0430\u0440\u044B! \u0421\u0442\u0443\u0434\u0435\u043D\u0442\u044B \u043C\u043D\u043E\u0433\u043E\u043C\u0443 \u0443 \u0432\u0430\u0441 \u043D\u0430\u0443\u0447\u0430\u0442\u0441\u044F.", "\u{1F340} Good luck with your class! Your students will learn a lot from you."),
    j("\u2600\uFE0F Yaxshi kayfiyat bilan boshlangan dars yaxshi xotira bo'lib qoladi. Omad!", "\u2600\uFE0F \u041F\u0430\u0440\u0430, \u043D\u0430\u0447\u0430\u0442\u0430\u044F \u0441 \u0445\u043E\u0440\u043E\u0448\u0438\u043C \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435\u043C, \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u0445\u043E\u0440\u043E\u0448\u0438\u043C \u0432\u043E\u0441\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435\u043C. \u0423\u0434\u0430\u0447\u0438!", "\u2600\uFE0F A class that starts in a good mood becomes a good memory. Good luck!")
  ],
  t_fri: [j("\u{1F389} Juma darsi \u2014 hafta yakuniga chiroyli nuqta.", "\u{1F389} \u041F\u044F\u0442\u043D\u0438\u0447\u043D\u0430\u044F \u043F\u0430\u0440\u0430 \u2014 \u043A\u0440\u0430\u0441\u0438\u0432\u0430\u044F \u0442\u043E\u0447\u043A\u0430 \u0432 \u043A\u043E\u043D\u0446\u0435 \u043D\u0435\u0434\u0435\u043B\u0438.", "\u{1F389} A Friday class is a lovely full stop to the week.")],
  t_sat: [j("\u{1F4AA} Shanba kuni dars berish \u2014 alohida fidoyilik. Rahmat sizga!", "\u{1F4AA} \u0412\u0435\u0441\u0442\u0438 \u043F\u0430\u0440\u044B \u0432 \u0441\u0443\u0431\u0431\u043E\u0442\u0443 \u2014 \u043E\u0441\u043E\u0431\u0430\u044F \u0441\u0430\u043C\u043E\u043E\u0442\u0434\u0430\u0447\u0430. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0432\u0430\u043C!", "\u{1F4AA} Teaching on a Saturday takes real dedication. Thank you!")],
  // ---- end of the day
  s_end: [
    j("\u{1F389} Bugungi darslar tugadi! Miya rasman dam olish rejimiga o'tdi.", "\u{1F389} \u041F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C! \u041C\u043E\u0437\u0433 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u043F\u0435\u0440\u0435\u0448\u0451\u043B \u0432 \u0440\u0435\u0436\u0438\u043C \u043E\u0442\u0434\u044B\u0445\u0430.", "\u{1F389} That's it for today! Your brain is officially in rest mode."),
    j("\u{1F3E0} Darslar tamom. Endi uy, choy va bir oz dam \u2014 bunga to'liq loyiqsiz!", "\u{1F3E0} \u041F\u0430\u0440\u044B \u043E\u043A\u043E\u043D\u0447\u0435\u043D\u044B. \u0422\u0435\u043F\u0435\u0440\u044C \u0434\u043E\u043C, \u0447\u0430\u0439 \u0438 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u043E\u0442\u0434\u044B\u0445\u0430 \u2014 \u0432\u044B \u044D\u0442\u043E \u0437\u0430\u0441\u043B\u0443\u0436\u0438\u043B\u0438!", "\u{1F3E0} Classes are over. Home, tea and a little rest: you've earned it!"),
    j("\u{1F50B} Bugungi bilim zaryadi: 100%. Endi o'zingizni ham zaryadlang.", "\u{1F50B} \u0417\u0430\u0440\u044F\u0434 \u0437\u043D\u0430\u043D\u0438\u0439 \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F: 100%. \u0422\u0435\u043F\u0435\u0440\u044C \u043F\u043E\u0434\u0437\u0430\u0440\u044F\u0434\u0438\u0442\u0435\u0441\u044C \u0441\u0430\u043C\u0438.", "\u{1F50B} Today's knowledge charge: 100%. Now recharge yourself."),
    j("\u{1F307} Kun yakunlandi \u2014 siz uni uddaladingiz. Ofarin!", "\u{1F307} \u0414\u0435\u043D\u044C \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D \u2014 \u0432\u044B \u0441\u043F\u0440\u0430\u0432\u0438\u043B\u0438\u0441\u044C. \u041C\u043E\u043B\u043E\u0434\u0435\u0446!", "\u{1F307} The day is done and you nailed it. Well done!"),
    j("\u{1F372} Darslar tugadi, endi eng muhim fan \u2014 mazali ovqat.", "\u{1F372} \u041F\u0430\u0440\u044B \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C, \u0442\u0435\u043F\u0435\u0440\u044C \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u043F\u0440\u0435\u0434\u043C\u0435\u0442 \u2014 \u0432\u043A\u0443\u0441\u043D\u0430\u044F \u0435\u0434\u0430.", "\u{1F372} Classes are over. Now for the most important subject: good food."),
    j("\u{1F60C} Bugun ham bir qadam oldinga. Ertangi o'zingiz sizdan mamnun bo'ladi.", "\u{1F60C} \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0435\u0449\u0451 \u043E\u0434\u0438\u043D \u0448\u0430\u0433 \u0432\u043F\u0435\u0440\u0451\u0434. \u0412\u044B \u0437\u0430\u0432\u0442\u0440\u0430\u0448\u043D\u0438\u0439 \u0431\u0443\u0434\u0435\u0442\u0435 \u0434\u043E\u0432\u043E\u043B\u044C\u043D\u044B.", "\u{1F60C} Another step forward today. Tomorrow's you will be grateful."),
    j("\u{1F6CB} Divan sizni sabrsizlik bilan kutmoqda. Uni uzoq kuttirmang!", "\u{1F6CB} \u0414\u0438\u0432\u0430\u043D \u0436\u0434\u0451\u0442 \u0432\u0430\u0441 \u0441 \u043D\u0435\u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435\u043C. \u041D\u0435 \u0437\u0430\u0441\u0442\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u0435\u0433\u043E \u0436\u0434\u0430\u0442\u044C!", "\u{1F6CB} The sofa is waiting impatiently. Don't keep it waiting!"),
    j("\u{1F319} Bugun erta yotsangiz, ertaga birinchi parada kofe kamroq kerak bo'ladi \u{1F642}", "\u{1F319} \u041B\u044F\u0436\u0435\u0442\u0435 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u043E\u0440\u0430\u043D\u044C\u0448\u0435 \u2014 \u0437\u0430\u0432\u0442\u0440\u0430 \u043D\u0430 \u043F\u0435\u0440\u0432\u043E\u0439 \u043F\u0430\u0440\u0435 \u043F\u043E\u043D\u0430\u0434\u043E\u0431\u0438\u0442\u0441\u044F \u043C\u0435\u043D\u044C\u0448\u0435 \u043A\u043E\u0444\u0435 \u{1F642}", "\u{1F319} Go to bed early tonight and you'll need less coffee in tomorrow's first class \u{1F642}"),
    j("\u{1F3AE} Darsdan keyingi vaqt \u2014 sizniki. Sevimli ishingizga vaqt ajrating!", "\u{1F3AE} \u0412\u0440\u0435\u043C\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u0430\u0440 \u2014 \u0432\u0430\u0448\u0435. \u041D\u0430\u0439\u0434\u0438\u0442\u0435 \u0432\u0440\u0435\u043C\u044F \u0434\u043B\u044F \u043B\u044E\u0431\u0438\u043C\u043E\u0433\u043E \u0434\u0435\u043B\u0430!", "\u{1F3AE} The time after class is yours. Spend some on something you love!"),
    j("\u{1F3A7} Uyga yo'lda sevimli musiqangizni qo'yib oling \u2014 kun yakuni shunday bo'lishi kerak.", "\u{1F3A7} \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043B\u044E\u0431\u0438\u043C\u0443\u044E \u043C\u0443\u0437\u044B\u043A\u0443 \u043F\u043E \u0434\u043E\u0440\u043E\u0433\u0435 \u0434\u043E\u043C\u043E\u0439 \u2014 \u0442\u0430\u043A \u0438 \u0434\u043E\u043B\u0436\u0435\u043D \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u0434\u0435\u043D\u044C.", "\u{1F3A7} Put on your favourite music on the way home. That's how a day should end."),
    j("\u{1F4AA} Kichik g'alabalar kattasini quradi. Bugungisi ham hisobga o'tdi!", "\u{1F4AA} \u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0435 \u043F\u043E\u0431\u0435\u0434\u044B \u0441\u0442\u0440\u043E\u044F\u0442 \u0431\u043E\u043B\u044C\u0448\u0443\u044E. \u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u044F\u044F \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u043D\u0430!", "\u{1F4AA} Small wins build big ones. Today's counts!")
  ],
  s_end_fri: [j("\u{1F389} Darslar ham, hafta ham tugadi! Maroqli dam oling!", "\u{1F389} \u0417\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C \u0438 \u043F\u0430\u0440\u044B, \u0438 \u043D\u0435\u0434\u0435\u043B\u044F! \u0425\u043E\u0440\u043E\u0448\u0438\u0445 \u0432\u044B\u0445\u043E\u0434\u043D\u044B\u0445!", "\u{1F389} Classes are done, and so is the week! Have a great weekend!")],
  s_end_sat: [j("\u{1F3D6} Shanba darslari ham tugadi \u2014 endi haqiqiy dam olish!", "\u{1F3D6} \u0421\u0443\u0431\u0431\u043E\u0442\u043D\u0438\u0435 \u043F\u0430\u0440\u044B \u0442\u043E\u0436\u0435 \u043F\u043E\u0437\u0430\u0434\u0438 \u2014 \u0442\u0435\u043F\u0435\u0440\u044C \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0438\u0439 \u043E\u0442\u0434\u044B\u0445!", "\u{1F3D6} Saturday classes are done too. Now for some real rest!")],
  t_thanks: [
    j("\u{1F64F} Bugungi darslaringiz uchun rahmat! Bilim ulashish \u2014 eng ezgu ish.", "\u{1F64F} \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0435 \u043F\u0430\u0440\u044B! \u0414\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u0437\u043D\u0430\u043D\u0438\u044F\u043C\u0438 \u2014 \u0441\u0430\u043C\u043E\u0435 \u0431\u043B\u0430\u0433\u043E\u0440\u043E\u0434\u043D\u043E\u0435 \u0434\u0435\u043B\u043E.", "\u{1F64F} Thank you for today's classes! Sharing knowledge is the noblest work there is."),
    j("\u{1F490} Bugun ham talabalarga vaqtingiz va bilimingizni berdingiz. Katta rahmat!", "\u{1F490} \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0432\u044B \u0441\u043D\u043E\u0432\u0430 \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0430\u043C \u0441\u0432\u043E\u0451 \u0432\u0440\u0435\u043C\u044F \u0438 \u0437\u043D\u0430\u043D\u0438\u044F. \u041E\u0433\u0440\u043E\u043C\u043D\u043E\u0435 \u0441\u043F\u0430\u0441\u0438\u0431\u043E!", "\u{1F490} Today you gave your students your time and knowledge again. Thank you so much!"),
    j("\u{1F31F} Bugungi darslaringiz kimningdir kelajagiga poydevor bo'ldi. Rahmat sizga!", "\u{1F31F} \u0412\u0430\u0448\u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0435 \u043F\u0430\u0440\u044B \u0441\u0442\u0430\u043B\u0438 \u0444\u0443\u043D\u0434\u0430\u043C\u0435\u043D\u0442\u043E\u043C \u0447\u044C\u0435\u0433\u043E-\u0442\u043E \u0431\u0443\u0434\u0443\u0449\u0435\u0433\u043E. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0432\u0430\u043C!", "\u{1F31F} Today's classes became the foundation of someone's future. Thank you!"),
    j("\u{1F90D} Sabringiz va mehnatingiz uchun tashakkur. Yaxshi dam oling!", "\u{1F90D} \u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u0438\u043C \u0437\u0430 \u0432\u0430\u0448\u0435 \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435 \u0438 \u0442\u0440\u0443\u0434. \u0425\u043E\u0440\u043E\u0448\u0435\u0433\u043E \u043E\u0442\u0434\u044B\u0445\u0430!", "\u{1F90D} Thank you for your patience and hard work. Have a good rest!"),
    j("\u{1F64F} Sizdek ustozlar borligi talabalar uchun katta omad. Rahmat!", "\u{1F64F} \u0422\u0430\u043A\u0438\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0438, \u043A\u0430\u043A \u0432\u044B, \u2014 \u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0443\u0434\u0430\u0447\u0430 \u0434\u043B\u044F \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u043E\u0432. \u0421\u043F\u0430\u0441\u0438\u0431\u043E!", "\u{1F64F} Teachers like you are a stroke of luck for students. Thank you!"),
    j("\u{1F4DA} Bugun aytgan har bir so'zingiz bekorga ketmadi. Mehnatingiz uchun rahmat!", "\u{1F4DA} \u041A\u0430\u0436\u0434\u043E\u0435 \u0432\u0430\u0448\u0435 \u0441\u043B\u043E\u0432\u043E \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0431\u044B\u043B\u043E \u043D\u0435 \u0437\u0440\u044F. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u0432\u0430\u0448 \u0442\u0440\u0443\u0434!", "\u{1F4DA} Not a single word you said today was wasted. Thank you for your work!"),
    j("\u{1F337} Kun davomidagi mehnatingiz uchun minnatdormiz. Oilangiz bilan yaxshi hordiq chiqaring!", "\u{1F337} \u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u0438\u043C \u0437\u0430 \u0432\u0430\u0448 \u0442\u0440\u0443\u0434 \u0441\u0435\u0433\u043E\u0434\u043D\u044F. \u0425\u043E\u0440\u043E\u0448\u0435\u0433\u043E \u043E\u0442\u0434\u044B\u0445\u0430 \u0441 \u0441\u0435\u043C\u044C\u0451\u0439!", "\u{1F337} We are grateful for your work today. Enjoy a relaxing evening with your family!")
  ],
  t_thanks_fri: [j("\u{1F389} Butun haftadagi mehnatingiz uchun rahmat! Maroqli dam oling!", "\u{1F389} \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u0432\u0430\u0448 \u0442\u0440\u0443\u0434 \u0432\u0441\u044E \u043D\u0435\u0434\u0435\u043B\u044E! \u041F\u0440\u0438\u044F\u0442\u043D\u044B\u0445 \u0432\u044B\u0445\u043E\u0434\u043D\u044B\u0445!", "\u{1F389} Thank you for all your work this week! Enjoy the weekend!")],
  t_thanks_sat: [j("\u{1F490} Shanba kuni ham dars berganingiz uchun alohida rahmat!", "\u{1F490} \u041E\u0442\u0434\u0435\u043B\u044C\u043D\u043E\u0435 \u0441\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u0442\u043E, \u0447\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u043B\u0438 \u043F\u0430\u0440\u044B \u0434\u0430\u0436\u0435 \u0432 \u0441\u0443\u0431\u0431\u043E\u0442\u0443!", "\u{1F490} A special thank you for teaching on a Saturday too!")],
  t_wish: [
    j("\u2615 Darslar tugadi \u2014 endi bir piyola choy va tinch oqshom sizga!", "\u2615 \u041F\u0430\u0440\u044B \u043E\u043A\u043E\u043D\u0447\u0435\u043D\u044B \u2014 \u0442\u0435\u043F\u0435\u0440\u044C \u0432\u0430\u043C \u0447\u0430\u0448\u043A\u0443 \u0447\u0430\u044F \u0438 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439 \u0432\u0435\u0447\u0435\u0440!", "\u2615 Classes are over. Wishing you a cup of tea and a quiet evening!"),
    j("\u{1F319} Bugungi kun samarali o'tdi. Ertaga ham shunday ilhom tilaymiz!", "\u{1F319} \u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0439 \u0434\u0435\u043D\u044C \u043F\u0440\u043E\u0448\u0451\u043B \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0438\u0432\u043D\u043E. \u0416\u0435\u043B\u0430\u0435\u043C \u0442\u0430\u043A\u043E\u0433\u043E \u0436\u0435 \u0432\u0434\u043E\u0445\u043D\u043E\u0432\u0435\u043D\u0438\u044F \u0437\u0430\u0432\u0442\u0440\u0430!", "\u{1F319} Today was productive. Wishing you the same inspiration tomorrow!"),
    j("\u{1F4AA} Sog'liq va kuch-quvvat tilaymiz \u2014 talabalaringizga siz kerak!", "\u{1F4AA} \u0416\u0435\u043B\u0430\u0435\u043C \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F \u0438 \u0441\u0438\u043B \u2014 \u0432\u044B \u043D\u0443\u0436\u043D\u044B \u0441\u0432\u043E\u0438\u043C \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0430\u043C!", "\u{1F4AA} Wishing you health and energy. Your students need you!")
  ]
};
var SUBJECT_JOKES = [
  { re: /iqtisod|экономи/i, list: [
    j("\u{1F4C8} Talab yuqori \u2014 sizning bilimingizga. Taklifni oshiramiz!", "\u{1F4C8} \u0421\u043F\u0440\u043E\u0441 \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u2014 \u043D\u0430 \u0432\u0430\u0448\u0438 \u0437\u043D\u0430\u043D\u0438\u044F. \u041D\u0430\u0440\u0430\u0449\u0438\u0432\u0430\u0435\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435!", "\u{1F4C8} Demand is high, for your knowledge. Let's increase the supply!"),
    j(`\u{1F4A1} Iqtisodchilar "boshqa narsalar teng bo'lganda" deyishni yaxshi ko'radi. Bugun hamma narsa sizning foydangizga!`, "\u{1F4A1} \u042D\u043A\u043E\u043D\u043E\u043C\u0438\u0441\u0442\u044B \u043B\u044E\u0431\u044F\u0442 \u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C \xAB\u043F\u0440\u0438 \u043F\u0440\u043E\u0447\u0438\u0445 \u0440\u0430\u0432\u043D\u044B\u0445\xBB. \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0432\u0441\u0451 \u043F\u0440\u043E\u0447\u0435\u0435 \u2014 \u0432 \u0432\u0430\u0448\u0443 \u043F\u043E\u043B\u044C\u0437\u0443!", '\u{1F4A1} Economists love saying "all else being equal". Today, all else is in your favour!')
  ] },
  { re: /statist|статист/i, list: [
    j("\u{1F4CA} Darsga kelganlarning 100% i nimadir o'rganadi. Namuna kichik, lekin ishonchli \u{1F642}", "\u{1F4CA} 100% \u043F\u0440\u0438\u0448\u0435\u0434\u0448\u0438\u0445 \u043D\u0430 \u043F\u0430\u0440\u0443 \u0447\u0435\u043C\u0443-\u0442\u043E \u043D\u0430\u0443\u0447\u0430\u0442\u0441\u044F. \u0412\u044B\u0431\u043E\u0440\u043A\u0430 \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0430\u044F, \u043D\u043E \u043D\u0430\u0434\u0451\u0436\u043D\u0430\u044F \u{1F642}", "\u{1F4CA} 100% of people who come to class learn something. Small sample, but reliable \u{1F642}"),
    j("\u{1F4C9} O'rtacha qiymat siz haqingizda emas. Siz o'rtachadan yuqorisiz!", "\u{1F4C9} \u0421\u0440\u0435\u0434\u043D\u0435\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u2014 \u044D\u0442\u043E \u043D\u0435 \u043F\u0440\u043E \u0432\u0430\u0441. \u0412\u044B \u0432\u044B\u0448\u0435 \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E!", "\u{1F4C9} The average isn't about you. You're above it!")
  ] },
  { re: /matemat|математ/i, list: [
    j("\u2797 Javob topilmaguncha masala tugamaydi. Siz ham shundaysiz!", "\u2797 \u0417\u0430\u0434\u0430\u0447\u0430 \u043D\u0435 \u0437\u0430\u043A\u043E\u043D\u0447\u0435\u043D\u0430, \u043F\u043E\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043E\u0442\u0432\u0435\u0442. \u0412\u044B \u0442\u0430\u043A\u043E\u0439 \u0436\u0435!", "\u2797 A problem isn't finished until the answer is found. Neither are you!"),
    j("\u221E Cheksizlikka intilish \u2014 sevimli mashg'ulot. Bugun yana bir qadam yaqinlashamiz.", "\u221E \u0421\u0442\u0440\u0435\u043C\u0438\u0442\u044C\u0441\u044F \u043A \u0431\u0435\u0441\u043A\u043E\u043D\u0435\u0447\u043D\u043E\u0441\u0442\u0438 \u2014 \u043B\u044E\u0431\u0438\u043C\u043E\u0435 \u0437\u0430\u043D\u044F\u0442\u0438\u0435. \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0441\u0442\u0430\u043D\u0435\u043C \u043D\u0430 \u0448\u0430\u0433 \u0431\u043B\u0438\u0436\u0435.", "\u221E Reaching for infinity is the favourite hobby here. One step closer today.")
  ] },
  { re: /buxgalter|бухгалтер|hisob|учёт|учет|audit|аудит/i, list: [
    j("\u{1F9FE} Debet kredit bilan, siz esa bilim bilan teng bo'lasiz.", "\u{1F9FE} \u0414\u0435\u0431\u0435\u0442 \u0441\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0441 \u043A\u0440\u0435\u0434\u0438\u0442\u043E\u043C, \u0430 \u0432\u044B \u2014 \u0441\u043E \u0437\u043D\u0430\u043D\u0438\u044F\u043C\u0438.", "\u{1F9FE} Debit balances credit, and you balance knowledge."),
    j("\u{1F4D2} Balans hamma joyda kerak: hisobda ham, hayotda ham.", "\u{1F4D2} \u0411\u0430\u043B\u0430\u043D\u0441 \u043D\u0443\u0436\u0435\u043D \u0432\u0435\u0437\u0434\u0435: \u0438 \u0432 \u0443\u0447\u0451\u0442\u0435, \u0438 \u0432 \u0436\u0438\u0437\u043D\u0438.", "\u{1F4D2} Balance matters everywhere: in the books and in life.")
  ] },
  { re: /moliya|финанс|bank|банк|kredit|кредит|investitsiya|инвест|sug'urta|sugʻurta|страхов/i, list: [
    j("\u{1F4B0} Eng yaxshi investitsiya \u2014 o'zingizga qilinganidir. Foizi ham eng yuqori!", "\u{1F4B0} \u041B\u0443\u0447\u0448\u0430\u044F \u0438\u043D\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u044F \u2014 \u0432 \u0441\u0435\u0431\u044F. \u0418 \u043F\u0440\u043E\u0446\u0435\u043D\u0442 \u0441\u0430\u043C\u044B\u0439 \u0432\u044B\u0441\u043E\u043A\u0438\u0439!", "\u{1F4B0} The best investment is in yourself. It pays the highest interest too!"),
    j("\u{1F3E6} Bilim \u2014 inflyatsiyadan qo'rqmaydigan yagona aktiv.", "\u{1F3E6} \u0417\u043D\u0430\u043D\u0438\u044F \u2014 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0430\u043A\u0442\u0438\u0432, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043D\u0435 \u0431\u043E\u0438\u0442\u0441\u044F \u0438\u043D\u0444\u043B\u044F\u0446\u0438\u0438.", "\u{1F3E6} Knowledge is the only asset that isn't afraid of inflation."),
    j("\u{1F6E1} Konspekt \u2014 imtihondan eng yaxshi sug'urta.", "\u{1F6E1} \u041A\u043E\u043D\u0441\u043F\u0435\u043A\u0442 \u2014 \u043B\u0443\u0447\u0448\u0430\u044F \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u043A\u0430 \u043E\u0442 \u044D\u043A\u0437\u0430\u043C\u0435\u043D\u0430.", "\u{1F6E1} Good notes are the best insurance against exams.")
  ] },
  { re: /marketing|маркетинг|reklama|реклам/i, list: [
    j(`\u{1F4E3} Bugungi darsni o'zingizga "sotib" ko'ring \u2014 reklamasi juda yaxshi!`, "\u{1F4E3} \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \xAB\u043F\u0440\u043E\u0434\u0430\u0442\u044C\xBB \u0441\u0435\u0431\u0435 \u0441\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u044E\u044E \u043F\u0430\u0440\u0443 \u2014 \u0443 \u043D\u0435\u0451 \u043E\u0442\u043B\u0438\u0447\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430!", `\u{1F4E3} Try "selling" yourself today's class. It has great advertising!`),
    j("\u{1F3AF} Maqsadli auditoriya aniq \u2014 bu siz!", "\u{1F3AF} \u0426\u0435\u043B\u0435\u0432\u0430\u044F \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0430 \u2014 \u044D\u0442\u043E \u0432\u044B!", "\u{1F3AF} Target audience identified: it's you!")
  ] },
  { re: /menejment|менеджмент|boshqaruv|управлен/i, list: [
    j("\u{1F5C2} Vaqtni boshqarish birinchi qoida. Mana, 11 daqiqa oldin xabardorsiz!", "\u{1F5C2} \u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0435\u043C \u2014 \u043F\u0435\u0440\u0432\u043E\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E. \u0412\u043E\u0442, \u0432\u044B \u0432 \u043A\u0443\u0440\u0441\u0435 \u0437\u0430 11 \u043C\u0438\u043D\u0443\u0442!", "\u{1F5C2} Time management is rule number one. Look, you're already 11 minutes ahead!")
  ] },
  { re: /ingliz|english|английск/i, list: [
    j("\u{1F1EC}\u{1F1E7} Today's plan: learn, smile, repeat!", "\u{1F1EC}\u{1F1E7} Today's plan: learn, smile, repeat!", "\u{1F1EC}\u{1F1E7} Today's plan: learn, smile, repeat!")
  ] },
  { re: /xorijiy til|chet til|иностран|tili|язык/i, list: [
    j("\u{1F5E3} Yangi til \u2014 yangi dunyo. Bugun kamida bitta yangi so'z!", "\u{1F5E3} \u041D\u043E\u0432\u044B\u0439 \u044F\u0437\u044B\u043A \u2014 \u043D\u043E\u0432\u044B\u0439 \u043C\u0438\u0440. \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E!", "\u{1F5E3} A new language is a new world. At least one new word today!")
  ] },
  { re: /huquq|право|юрид/i, list: [
    j("\u2696\uFE0F Kechikmaslik \u2014 eng oddiy qonun. Siz uni buzmaysiz!", "\u2696\uFE0F \u041D\u0435 \u043E\u043F\u0430\u0437\u0434\u044B\u0432\u0430\u0442\u044C \u2014 \u0441\u0430\u043C\u044B\u0439 \u043F\u0440\u043E\u0441\u0442\u043E\u0439 \u0437\u0430\u043A\u043E\u043D. \u0412\u044B \u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0440\u0443\u0448\u0438\u0442\u0435!", "\u2696\uFE0F Don't be late: the simplest law there is. You won't break it!")
  ] },
  { re: /informat|информат|axborot|информац|dastur|программ|raqamli|цифров/i, list: [
    j('\u{1F4BB} Miyangizni "Ctrl+S" qilishni unutmang!', "\u{1F4BB} \u041D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C\u0442\u0435 \u043D\u0430\u0436\u0430\u0442\u044C \xABCtrl+S\xBB \u0432 \u0441\u0432\u043E\u0435\u0439 \u0433\u043E\u043B\u043E\u0432\u0435!", `\u{1F4BB} Don't forget to hit "Ctrl+S" on your brain!`),
    j("\u{1F5A5} Dasturda ham, darsda ham bitta qoida: avval tushun, keyin bajar.", "\u{1F5A5} \u0418 \u0432 \u043A\u043E\u0434\u0435, \u0438 \u043D\u0430 \u043F\u0430\u0440\u0435 \u043E\u0434\u043D\u043E \u043F\u0440\u0430\u0432\u0438\u043B\u043E: \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u043E\u0439\u043C\u0438, \u043F\u043E\u0442\u043E\u043C \u0434\u0435\u043B\u0430\u0439.", "\u{1F5A5} In code and in class, one rule: understand first, then do.")
  ] },
  { re: /soliq|налог/i, list: [
    j("\u{1F9FE} Bilimdan soliq olinmaydi \u2014 xohlagancha to'plang!", "\u{1F9FE} \u0417\u043D\u0430\u043D\u0438\u044F \u043D\u0430\u043B\u043E\u0433\u043E\u043C \u043D\u0435 \u043E\u0431\u043B\u0430\u0433\u0430\u044E\u0442\u0441\u044F \u2014 \u043A\u043E\u043F\u0438\u0442\u0435 \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0443\u0433\u043E\u0434\u043D\u043E!", "\u{1F9FE} Knowledge is tax-free. Collect as much as you like!")
  ] },
  { re: /jismoniy|физическ|sport|спорт/i, list: [
    j("\u{1F3C3} Bugun miya emas, muskullar ishlaydi. Isinishni unutmang!", "\u{1F3C3} \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442 \u043D\u0435 \u043C\u043E\u0437\u0433\u0438, \u0430 \u043C\u044B\u0448\u0446\u044B. \u041D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C\u0442\u0435 \u0440\u0430\u0437\u043C\u0438\u043D\u043A\u0443!", "\u{1F3C3} Today it's muscles, not brains, doing the work. Don't skip the warm-up!")
  ] },
  { re: /falsafa|философ/i, list: [
    j(`\u{1F914} "Darsga boraymi?" \u2014 bu savolning javobi allaqachon ma'lum: ha!`, "\u{1F914} \xAB\u0418\u0434\u0442\u0438 \u043B\u0438 \u043D\u0430 \u043F\u0430\u0440\u0443?\xBB \u2014 \u043E\u0442\u0432\u0435\u0442 \u043D\u0430 \u044D\u0442\u043E\u0442 \u0432\u043E\u043F\u0440\u043E\u0441 \u0443\u0436\u0435 \u0438\u0437\u0432\u0435\u0441\u0442\u0435\u043D: \u0434\u0430!", '\u{1F914} "Should I go to class?" The answer to this question is already known: yes!')
  ] },
  { re: /tarix|истори/i, list: [
    j("\u{1F4DC} Bugun siz ham tarixning bir qismisiz \u2014 darsga o'z vaqtida kelgan talaba sifatida!", "\u{1F4DC} \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0432\u044B \u0442\u043E\u0436\u0435 \u0447\u0430\u0441\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u2014 \u043A\u0430\u043A \u0441\u0442\u0443\u0434\u0435\u043D\u0442, \u043F\u0440\u0438\u0448\u0435\u0434\u0448\u0438\u0439 \u0432\u043E\u0432\u0440\u0435\u043C\u044F!", "\u{1F4DC} Today you're part of history too, as the student who arrived on time!")
  ] },
  { re: /logist|логист/i, list: [
    j("\u{1F69A} Eng yaxshi marshrut \u2014 to'g'ri xonaga!", "\u{1F69A} \u041B\u0443\u0447\u0448\u0438\u0439 \u043C\u0430\u0440\u0448\u0440\u0443\u0442 \u2014 \u0432 \u043D\u0443\u0436\u043D\u0443\u044E \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044E!", "\u{1F69A} The best route: straight to the right room!")
  ] },
  { re: /turizm|туризм|mehmonxona|гостинич/i, list: [
    j("\u2708\uFE0F Bilim olamiga sayohat boshlanmoqda. Pasport shart emas!", "\u2708\uFE0F \u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0435 \u0432 \u043C\u0438\u0440 \u0437\u043D\u0430\u043D\u0438\u0439 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F. \u041F\u0430\u0441\u043F\u043E\u0440\u0442 \u043D\u0435 \u043D\u0443\u0436\u0435\u043D!", "\u2708\uFE0F Your journey into the world of knowledge begins. No passport required!")
  ] }
];

// src/lessons.mjs
var LR_BEFORE = 11;
var LR_DELETE_AFTER_START = 10;
var DE_DELETE_AFTER = 60;
var W2 = {
  uz: {
    inMin: (m) => m <= 1 ? "\u23F0 Hozir dars boshlanadi" : `\u23F0 ${m} daqiqadan keyin dars`,
    stay: "\u{1FA91} Shu xonada qolasiz",
    intro: "\u{1F195} Endi har dars oldidan eslatib turaman. Bu xabar dars boshlangach o'zi o'chib ketadi.",
    endS: "\u2705 Bugungi darslar tugadi!",
    endT: "\u2705 Bugungi darslaringiz tugadi!",
    off: "\u{1F515} Eslatmani o'chirish",
    more: "\u{1F604} Yana bittasi",
    back: "\u21A9\uFE0F Qayta yoqish",
    offLr: "\u{1F515} Dars oldidan eslatmalar o'chirildi. Qayta yoqish: shu tugma yoki \u2699\uFE0F Sozlamalar.",
    offDe: "\u{1F515} Kun yakuni xabarlari o'chirildi. Qayta yoqish: shu tugma yoki \u2699\uFE0F Sozlamalar.",
    onLr: "\u{1F514} Dars oldidan eslatmalar yoqildi.",
    onDe: "\u{1F514} Kun yakuni xabarlari yoqildi.",
    setLr: (on) => `\u23F0 Dars oldidan eslatma: ${on ? "\u2705" : "\u274C"}`,
    setDe: (on) => `\u{1F3E0} Kun yakuni xabari: ${on ? "\u2705" : "\u274C"}`
  },
  ru: {
    inMin: (m) => m <= 1 ? "\u23F0 \u041F\u0430\u0440\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F" : `\u23F0 \u0427\u0435\u0440\u0435\u0437 ${m} \u043C\u0438\u043D. \u043F\u0430\u0440\u0430`,
    stay: "\u{1FA91} \u041E\u0441\u0442\u0430\u0451\u0442\u0435\u0441\u044C \u0432 \u044D\u0442\u043E\u0439 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438",
    intro: "\u{1F195} \u0422\u0435\u043F\u0435\u0440\u044C \u044F \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u044E \u043F\u0435\u0440\u0435\u0434 \u043A\u0430\u0436\u0434\u043E\u0439 \u043F\u0430\u0440\u043E\u0439. \u042D\u0442\u043E \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u0441\u0430\u043C\u043E \u0438\u0441\u0447\u0435\u0437\u043D\u0435\u0442 \u043F\u043E\u0441\u043B\u0435 \u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u0430\u0440\u044B.",
    endS: "\u2705 \u041F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C!",
    endT: "\u2705 \u0412\u0430\u0448\u0438 \u043F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C!",
    off: "\u{1F515} \u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
    more: "\u{1F604} \u0415\u0449\u0451 \u043E\u0434\u043D\u0443",
    back: "\u21A9\uFE0F \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u043D\u043E\u0432\u0430",
    offLr: "\u{1F515} \u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F \u043F\u0435\u0440\u0435\u0434 \u043F\u0430\u0440\u0430\u043C\u0438 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u044B. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u043D\u043E\u0432\u0430: \u044D\u0442\u0430 \u043A\u043D\u043E\u043F\u043A\u0430 \u0438\u043B\u0438 \u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438.",
    offDe: "\u{1F515} \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0432 \u043A\u043E\u043D\u0446\u0435 \u0434\u043D\u044F \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u044B. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u043D\u043E\u0432\u0430: \u044D\u0442\u0430 \u043A\u043D\u043E\u043F\u043A\u0430 \u0438\u043B\u0438 \u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438.",
    onLr: "\u{1F514} \u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F \u043F\u0435\u0440\u0435\u0434 \u043F\u0430\u0440\u0430\u043C\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B.",
    onDe: "\u{1F514} \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0432 \u043A\u043E\u043D\u0446\u0435 \u0434\u043D\u044F \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B.",
    setLr: (on) => `\u23F0 \u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u0434 \u043F\u0430\u0440\u043E\u0439: ${on ? "\u2705" : "\u274C"}`,
    setDe: (on) => `\u{1F3E0} \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u0432 \u043A\u043E\u043D\u0446\u0435 \u0434\u043D\u044F: ${on ? "\u2705" : "\u274C"}`
  },
  en: {
    inMin: (m) => m <= 1 ? "\u23F0 Class is starting" : `\u23F0 Class in ${m} minutes`,
    stay: "\u{1FA91} You stay in this room",
    intro: "\u{1F195} I now remind you before every class. This message disappears by itself once the class starts.",
    endS: "\u2705 That's all your classes for today!",
    endT: "\u2705 That's all your classes for today!",
    off: "\u{1F515} Turn off",
    more: "\u{1F604} Another one",
    back: "\u21A9\uFE0F Turn back on",
    offLr: "\u{1F515} Class reminders are off. Turn them back on with this button or in \u2699\uFE0F Settings.",
    offDe: "\u{1F515} End-of-day messages are off. Turn them back on with this button or in \u2699\uFE0F Settings.",
    onLr: "\u{1F514} Class reminders are on.",
    onDe: "\u{1F514} End-of-day messages are on.",
    setLr: (on) => `\u23F0 Class reminders: ${on ? "\u2705" : "\u274C"}`,
    setDe: (on) => `\u{1F3E0} End-of-day message: ${on ? "\u2705" : "\u274C"}`
  }
};
var lw = (lang) => W2[lang] || W2.uz;
var toMin = (t) => {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
};
var hm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
function jokeList(key) {
  const m = /^sub(\d+)$/.exec(String(key));
  if (m) return SUBJECT_JOKES[Number(m[1])]?.list || null;
  return Object.hasOwn(JOKES, key) ? JOKES[key] : null;
}
var textOf = (entry, lang) => entry[LANGS.includes(lang) ? lang : "uz"] || entry.uz;
var isTeacherKey = (key) => String(key).startsWith("t_");
function jokePool(key) {
  const list = jokeList(key) || [];
  if (!list.length || list.length >= 4) return list;
  const wider = isTeacherKey(key) ? /^t_(thanks|wish)/.test(key) ? JOKES.t_thanks : JOKES.t_start : /^s_end/.test(key) ? JOKES.s_end : JOKES.s_any;
  return [...list, ...wider.filter((e) => !list.includes(e))];
}
function nextJoke(key, current, lang) {
  const list = jokePool(key);
  if (!list?.length) return null;
  const others = list.filter((e) => textOf(e, lang) !== current);
  const pool = others.length ? others : list;
  return textOf(pool[Math.floor(Math.random() * pool.length)], lang);
}
var JOKE_STYLES = [
  (t) => `<blockquote><i>${t}</i></blockquote>`,
  (t) => `<blockquote><b>${t}</b></blockquote>`,
  (t) => `<blockquote><b><i>${t}</i></b></blockquote>`,
  (t) => `<blockquote><u><i>${t}</i></u></blockquote>`,
  (t) => `<blockquote><code>${t}</code></blockquote>`,
  (t) => `<blockquote>${t}</blockquote>`
];
var jokeHtml = (text, rand = Math.random) => JOKE_STYLES[Math.floor(rand() * JOKE_STYLES.length)](esc(text));
var ENT = {
  bold: ["<b>", "</b>"],
  italic: ["<i>", "</i>"],
  underline: ["<u>", "</u>"],
  strikethrough: ["<s>", "</s>"],
  code: ["<code>", "</code>"],
  blockquote: ["<blockquote>", "</blockquote>"],
  expandable_blockquote: ["<blockquote expandable>", "</blockquote>"],
  spoiler: ["<tg-spoiler>", "</tg-spoiler>"]
};
function entitiesToHtml(text, entities = []) {
  const list = (entities || []).filter((e) => ENT[e.type] && e.length > 0).sort((a, b) => a.offset - b.offset || b.length - a.length);
  let out = "", k = 0;
  const stack = [];
  for (let i = 0; i <= text.length; i++) {
    while (stack.length && stack[stack.length - 1].offset + stack[stack.length - 1].length <= i) out += ENT[stack.pop().type][1];
    if (i === text.length) break;
    while (k < list.length && list[k].offset === i) {
      out += ENT[list[k].type][0];
      stack.push(list[k++]);
    }
    out += esc(text[i]);
  }
  while (stack.length) out += ENT[stack.pop().type][1];
  return out;
}
function paragraphs(text, entities = []) {
  const out = [];
  let from = 0;
  const parts = String(text || "").split("\n\n");
  for (const part of parts) {
    const to = from + part.length;
    const ents = (entities || []).filter((e) => e.offset < to && e.offset + e.length > from).map((e) => ({ ...e, offset: Math.max(e.offset, from) - from, length: Math.min(e.offset + e.length, to) - Math.max(e.offset, from) }));
    out.push({ text: part, html: entitiesToHtml(part, ents) });
    from = to + 2;
  }
  return out;
}
function lessonRunPlan(periods) {
  const fixed = /* @__PURE__ */ new Set();
  const flex = [];
  const ends = [];
  for (const p of periods || []) {
    const a = toMin(p.start), b = toMin(p.end);
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    fixed.add(a - LR_BEFORE);
    flex.push([a + LR_DELETE_AFTER_START + 1, 1], [b + 1, 2]);
    ends.push(b);
  }
  if (ends.length) flex.push([Math.max(...ends) + DE_DELETE_AFTER + 2, 1]);
  const fx = [...fixed];
  const rest = [...new Set(flex.filter(([m, early]) => !fx.some((f) => f - m >= -early && f - m <= 4)).map(([m]) => m))].sort((x, y) => x - y);
  const merged = [];
  for (const m of rest) {
    if (merged.length && m - merged[merged.length - 1] < 4) merged[merged.length - 1] = m;
    else merged.push(m);
  }
  return [.../* @__PURE__ */ new Set([...fx, ...merged])].sort((x, y) => x - y);
}

// worker/worker.mjs
var PAGE = 36;
var TPAGE = 16;
var KB_VERSION = 2;
var CALENDAR_ENABLED = false;
var SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "no-referrer",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "strict-transport-security": "max-age=31536000",
  "cache-control": "no-store"
};
function withSecurityHeaders(res) {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
var worker_default = {
  async fetch(request, env, ctx) {
    return withSecurityHeaders(await route(request, env, ctx));
  },
  // GitHub's own `schedule:` trigger is "best effort" and can silently go quiet for hours on a
  // low-traffic public repo (a known GitHub Actions limitation, not a bug in our workflow) — so
  // instead of trusting it alone, Cloudflare's own Cron Trigger (reliable, free, up to once a
  // minute) calls this on its schedule and nudges the GitHub Action awake via the API. Configure
  // a Cron Trigger for this Worker in the dashboard and set GITHUB_PAT + GITHUB_REPO to turn it
  // on; without them this quietly does nothing, so it's safe to leave unconfigured.
  async scheduled(event, env, ctx) {
    const at = event?.scheduledTime || Date.now();
    await Promise.all([
      timetableTick(env, at).catch((e) => console.error("timetable tick", e?.message)),
      lessonsTick(env, at).catch((e) => console.error("lessons tick", e?.message))
    ]);
  }
};
async function timetableTick(env, at) {
  if (!env.GITHUB_PAT || !env.GITHUB_REPO) return;
  const D = await db(env);
  const last = Number((await D.prepare("SELECT v FROM admin_state WHERE k = 'tt_tick'").first())?.v || 0);
  if (at - last < 9 * 6e4) return;
  const h = tashkentNow(at).getUTCHours();
  if ((h >= 22 || h < 5) && at - last < 60 * 6e4 && !await reminderDueSince(D, last, at) && !await somethingToDelete(D, at + 6e4)) return;
  await D.prepare("INSERT OR REPLACE INTO admin_state (k, v) VALUES ('tt_tick', ?)").bind(String(at)).run();
  if (!await dispatchWorkflow(env)) await D.prepare("INSERT OR REPLACE INTO admin_state (k, v) VALUES ('tt_tick', ?)").bind(String(last)).run();
}
async function somethingToDelete(D, now) {
  const [a, b, c] = await D.batch([
    D.prepare("SELECT 1 x FROM admin_state WHERE k >= 'pend:' AND k <= ? LIMIT 1").bind(`pend:${String(Math.floor(now)).padStart(15, "0")}:~`),
    D.prepare("SELECT 1 x FROM broadcasts WHERE del_at IS NOT NULL AND del_at <= ? AND purged_at IS NULL LIMIT 1").bind(now),
    D.prepare("SELECT 1 x FROM eph WHERE del_at <= ? LIMIT 1").bind(now)
  ]);
  return [a, b, c].some((r) => r.results?.length);
}
async function reminderDueSince(D, fromMs, toMs) {
  const m = (ms) => {
    const t = tashkentNow(ms);
    return t.getUTCHours() * 60 + t.getUTCMinutes();
  };
  const a = m(Math.max(fromMs, toMs - 3 * 36e5)), b = m(toMs);
  const q = (x, y) => D.prepare("SELECT 1 FROM chats WHERE remind_at > ? AND remind_at <= ? LIMIT 1").bind(x, y).first();
  return Boolean(a <= b ? await q(a, b) : await q(a, 1440) || await q(-1, b));
}
var LR_LEAD = 5;
async function lessonsTick(env, at) {
  if (!env.GITHUB_PAT || !env.GITHUB_REPO) return;
  const tn = tashkentNow(at);
  if (weekday(tn) === 6) return;
  const nowMin = tn.getUTCHours() * 60 + tn.getUTCMinutes() + tn.getUTCSeconds() / 60;
  if (nowMin < 6 * 60 || nowMin > 23 * 60) return;
  const dayKey = ymd(tn);
  const D = await db(env);
  const st = JSON.parse((await D.prepare("SELECT v FROM admin_state WHERE k = 'lr_plan'").first())?.v || "null");
  const state = st && st.day === dayKey && Array.isArray(st.plan) ? st : { day: dayKey, done: [], gap: st?.gap || 10, last: null, plan: null };
  if (!state.plan) {
    const index = await getIndex(env).catch(() => null);
    if (!index) return;
    state.plan = lessonRunPlan(index.periods || []);
  }
  const gapBefore = state.gap;
  if (state.last != null && nowMin > state.last && nowMin - state.last <= 30) state.gap = Math.min(30, Math.max(1, Math.round(nowMin - state.last)));
  const changedGap = state.gap !== gapBefore || !st || st.day !== dayKey;
  state.last = nowMin;
  const due = state.plan.filter((m) => m >= nowMin - 5 && m <= nowMin + state.gap + LR_LEAD && !state.done.includes(m));
  const first = state.plan[0] ?? 0, lastM = state.plan[state.plan.length - 1] ?? 0;
  const active = nowMin >= first - state.gap - LR_LEAD - 15 && nowMin <= lastM + 5;
  let sent = false;
  for (const m of due) {
    if (await dispatchWorkflow(env, "lessons.yml", { at: hm(m) })) {
      state.done.push(m);
      sent = true;
    }
  }
  if (sent || changedGap || active) await D.prepare("INSERT OR REPLACE INTO admin_state (k, v) VALUES ('lr_plan', ?)").bind(JSON.stringify(state)).run();
}
async function dispatchWorkflow(env, file = "timetable.yml", inputs = null) {
  if (!env.GITHUB_PAT || !env.GITHUB_REPO) return false;
  const api = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(String(env.GITHUB_API || "")) ? env.GITHUB_API : "https://api.github.com";
  const res = await fetch(`${api}/repos/${env.GITHUB_REPO}/actions/workflows/${file}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_PAT}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "tdiu-jadval-cron"
    },
    body: JSON.stringify(inputs ? { ref: "main", inputs } : { ref: "main" })
  });
  const body = res.ok ? "" : await res.text().catch(() => "");
  if (!res.ok) console.error("GitHub dispatch failed:", res.status, body);
  await noteGithubHealth(env, res.ok, res.status, body).catch(() => {
  });
  return res.ok;
}
async function noteGithubHealth(env, ok, status, body) {
  const D = await db(env);
  const prev = JSON.parse((await D.prepare("SELECT v FROM admin_state WHERE k = 'gh_err'").first())?.v || "null");
  if (ok === !prev) return;
  const tell = (text) => env.ADMIN_CHAT_ID && (env.ADMIN_BOT_TOKEN ? atg : tg)(env, "sendMessage", { chat_id: Number(env.ADMIN_CHAT_ID), text, parse_mode: "HTML" }).catch(() => {
  });
  if (ok) {
    const del = await D.prepare("DELETE FROM admin_state WHERE k = 'gh_err'").run();
    if (del?.meta?.changes) await tell("\u2705 <b>GitHub bilan aloqa tiklandi</b> \u2014 eslatmalar va o'zgarish xabarlari yana ishlayapti.");
    return;
  }
  const hint = status === 401 ? "token eskirgan yoki o'chirilgan" : status === 403 ? "tokenda <b>Actions: Read and write</b> ruxsati yo'q" : status === 404 ? "token bu repoga ruxsat bermaydi (yoki GITHUB_REPO noto'g'ri)" : "GitHub javobi";
  const ins = await D.prepare("INSERT OR IGNORE INTO admin_state (k, v) VALUES ('gh_err', ?)").bind(JSON.stringify({ status, at: Date.now(), msg: String(body).slice(0, 200) })).run();
  if (ins?.meta?.changes) await tell(`\u26A0\uFE0F <b>GitHub'ni uyg'otib bo'lmayapti</b> (xato ${status}: ${hint}).
Dars eslatmalari, o'zgarish xabarlari va kechki eslatmalar to'xtab qoladi.

Tuzatish: GitHub \u2192 Settings \u2192 Developer settings \u2192 Fine-grained tokens \u2192 tokenda <i>Repository access</i> = tsue-timetable-bot, <i>Permissions \u2192 Actions: Read and write</i>. Yangi token bo'lsa \u2014 Cloudflare \u2192 Worker \u2192 Settings \u2192 Variables \u2192 <code>GITHUB_PAT</code>.`);
}
async function route(request, env, ctx) {
  const url = new URL(request.url);
  try {
    if (request.method === "POST" && url.pathname === "/tg") {
      if (env.ADMIN_BOT_TOKEN && ctx?.waitUntil) ctx.waitUntil(ensureAdminBot(env, url.origin).catch((e) => console.warn("admin bot setup", e?.message)));
      return await onWebhook(request, env);
    }
    if (request.method === "POST" && url.pathname === "/tga") return await onAdminWebhook(request, env);
    if (url.pathname === "/api/week-pic") return await onWeekPic(request, env);
    if (url.pathname === "/api/admin") return await onAdminApi(request, env);
    if (url.pathname === "/setup") return await onSetup(request, url, env);
    if (url.pathname.startsWith("/internal/")) return await onInternal(request, url, env);
    return new Response("TDIU Jadval bot is running \u2705", { headers: { "content-type": "text/plain; charset=utf-8" } });
  } catch (e) {
    console.error(e.stack || e);
    if (url.pathname === "/tg" || url.pathname === "/tga") return new Response("ok");
    return new Response("Something went wrong. Try again shortly.", { status: 500 });
  }
}
async function sha256hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function safeEqual(a, b) {
  if (a == null || b == null || String(a) === "" || String(b) === "") return false;
  const [ha, hb] = await Promise.all([sha256hex(String(a)), sha256hex(String(b))]);
  return ha === hb;
}
var webhookSecret = async (env) => (await sha256hex("tg:" + env.ADMIN_KEY)).slice(0, 48);
var AUTH_MAX = 15;
var AUTH_WINDOW = 10 * 60 * 1e3;
var authFails = /* @__PURE__ */ new Map();
var clientIp = (request) => request.headers.get("cf-connecting-ip") || "unknown";
function authBlocked(request) {
  const r = authFails.get(clientIp(request));
  if (!r) return false;
  if (Date.now() - r.since > AUTH_WINDOW) {
    authFails.delete(clientIp(request));
    return false;
  }
  return r.n >= AUTH_MAX;
}
function noteAuthFail(request) {
  const ip = clientIp(request), now = Date.now();
  if (authFails.size > 2e3) authFails.clear();
  const r = authFails.get(ip);
  if (!r || now - r.since > AUTH_WINDOW) authFails.set(ip, { n: 1, since: now });
  else r.n++;
}
var tooManyAttempts = () => new Response("Too many attempts", { status: 429, headers: { "retry-after": "600" } });
var FLOOD_MAX = 30;
var FLOOD_WINDOW = 10 * 1e3;
var floodSeen = /* @__PURE__ */ new Map();
function flooding(env, userId) {
  if (!userId) return false;
  const max = Number(env.FLOOD_MAX) > 0 ? Number(env.FLOOD_MAX) : FLOOD_MAX;
  const now = Date.now();
  if (floodSeen.size > 5e3) floodSeen.clear();
  const r = floodSeen.get(userId);
  if (!r || now - r.since > FLOOD_WINDOW) {
    floodSeen.set(userId, { n: 1, since: now });
    return false;
  }
  return ++r.n > max;
}
var asUid = (v) => {
  const n = Number(v);
  return Number.isSafeInteger(n) ? n : -1;
};
var validId = (id) => /^[A-Za-z0-9_-]{1,40}$/.test(String(id ?? ""));
var siteUrl = (env) => String(env.SITE_URL || "").replace(/\/+$/, "");
var tgBase = (env) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(String(env.TG_API || "")) ? env.TG_API : "https://api.telegram.org";
async function tg(env, method, body, token = env.BOT_TOKEN) {
  const res = await fetch(`${tgBase(env)}/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const j2 = await res.json().catch(() => ({ ok: false }));
  if (!j2.ok && !/message is not modified/.test(j2.description || "")) console.warn(method, j2.description);
  return j2;
}
var atg = (env, method, body) => tg(env, method, body, env.ADMIN_BOT_TOKEN);
var hasAdminBot = (env) => !!env.ADMIN_BOT_TOKEN;
var adminSend = (env, text, extra = {}) => (hasAdminBot(env) ? atg : tg)(env, "sendMessage", { chat_id: env.ADMIN_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra });
var json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });
var cache = /* @__PURE__ */ new Map();
var CACHE_MAX = 120;
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
  cache.delete(file);
  cache.set(file, { value, until: Date.now() + ttlSec * 1e3 });
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
  return value;
}
var getIndex = (env) => getData(env, "index.json");
var getGroup = async (env, id) => validId(id) ? getData(env, `g/${id}.json`) : null;
var getTeacher = async (env, id) => validId(id) ? getData(env, `t/${id}.json`) : null;
var getPeople = (env) => getData(env, "people.json", 600);
var subjectsAt = 0;
async function loadSubjects(env) {
  if (Date.now() - subjectsAt < 36e5) return;
  try {
    const j2 = await getData(env, "subjects.json", 3600);
    if (j2) setSubjects(j2);
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
var SCHEMA_VERSION = "2026-10-24a";
async function db(env) {
  if (!schemaReady) {
    try {
      if ((await env.DB.prepare("SELECT v FROM admin_state WHERE k = 'schema'").first())?.v === SCHEMA_VERSION) schemaReady = true;
    } catch {
    }
  }
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
      // Telegram update ids already handled: Telegram re-sends an update when our answer is slow, and without this every
      // retry would repeat the whole reply (the "bot answers twice" problem)
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS updates (
        update_id INTEGER PRIMARY KEY,
        at INTEGER NOT NULL)`),
      // the admin's /stats: how often each action was used, per day (Tashkent date)
      // admin announcements ("E'lon"): the queue, who has been served (so a re-run never repeats), and the last test the admin looked at
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS broadcasts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at INTEGER NOT NULL,
        payload TEXT NOT NULL,
        filter TEXT NOT NULL,
        total INTEGER NOT NULL DEFAULT 0,
        sent INTEGER NOT NULL DEFAULT 0,
        failed INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'queued',
        lease_until INTEGER NOT NULL DEFAULT 0,
        finished_at INTEGER)`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS broadcast_done (
        bid INTEGER NOT NULL,
        chat_id INTEGER NOT NULL,
        ok INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY (bid, chat_id))`),
      // feedback forwarded through the ADMIN bot (its message ids are a different sequence from the student bot's)
      // via = which bot the person wrote to ('s' student bot, 'a' the admin bot itself) — the answer goes back the same way
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS feedback_replies_a (
        admin_msg_id INTEGER PRIMARY KEY,
        chat_id INTEGER NOT NULL,
        via TEXT NOT NULL DEFAULT 's',
        created_at INTEGER)`),
      // lesson reminders / end-of-day messages: which chat got which one today (one per tag, so overlapping runs never
      // send twice) and which messages are to be deleted when (they disappear after the class / after an hour)
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS lclaim (
        tag TEXT NOT NULL,
        chat_id INTEGER NOT NULL,
        at INTEGER NOT NULL,
        PRIMARY KEY (tag, chat_id))`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS eph (
        chat_id INTEGER NOT NULL,
        msg_id INTEGER NOT NULL,
        del_at INTEGER NOT NULL,
        PRIMARY KEY (chat_id, msg_id))`),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_eph_del ON eph(del_at)"),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS admin_state (
        k TEXT PRIMARY KEY,
        v TEXT)`),
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
    {
      const bcols = (await env.DB.prepare("PRAGMA table_info(broadcast_done)").all()).results || [];
      if (!bcols.some((c) => c.name === "msg_id")) await addColumn("ALTER TABLE broadcast_done ADD COLUMN msg_id INTEGER");
      const bbcols = (await env.DB.prepare("PRAGMA table_info(broadcasts)").all()).results || [];
      if (!bbcols.some((c) => c.name === "deleted_at")) await addColumn("ALTER TABLE broadcasts ADD COLUMN deleted_at INTEGER");
      if (!bbcols.some((c) => c.name === "del_at")) await addColumn("ALTER TABLE broadcasts ADD COLUMN del_at INTEGER");
      if (!bbcols.some((c) => c.name === "purged_at")) await addColumn("ALTER TABLE broadcasts ADD COLUMN purged_at INTEGER");
    }
    {
      const fcols = (await env.DB.prepare("PRAGMA table_info(feedback)").all()).results || [];
      if (!fcols.some((c) => c.name === "via")) await addColumn("ALTER TABLE feedback ADD COLUMN via TEXT");
    }
    if (!cols.some((c) => c.name === "lr")) await addColumn("ALTER TABLE chats ADD COLUMN lr INTEGER NOT NULL DEFAULT 1", "UPDATE chats SET lr = 0 WHERE alerts = 0");
    if (!cols.some((c) => c.name === "de")) await addColumn("ALTER TABLE chats ADD COLUMN de INTEGER NOT NULL DEFAULT 1", "UPDATE chats SET de = 0 WHERE alerts = 0");
    if (!cols.some((c) => c.name === "lri")) await addColumn("ALTER TABLE chats ADD COLUMN lri INTEGER NOT NULL DEFAULT 0");
    if (!cols.some((c) => c.name === "lr_tag")) await addColumn("ALTER TABLE chats ADD COLUMN lr_tag TEXT");
    if (!cols.some((c) => c.name === "de_day")) await addColumn("ALTER TABLE chats ADD COLUMN de_day TEXT");
    if (!cols.some((c) => c.name === "kbv")) {
      await addColumn("ALTER TABLE chats ADD COLUMN kbv INTEGER NOT NULL DEFAULT 0");
    }
    {
      const tn = tashkentNow();
      const today = ymd(tn), nowMin = tn.getUTCHours() * 60 + tn.getUTCMinutes();
      if (!cols.some((c) => c.name === "sent_tmr")) await addColumn("ALTER TABLE chats ADD COLUMN sent_tmr TEXT", `UPDATE chats SET sent_tmr = '${today}' WHERE remind_at >= 0 AND remind_at <= ${nowMin}`);
      if (!cols.some((c) => c.name === "sent_wk")) await addColumn("ALTER TABLE chats ADD COLUMN sent_wk TEXT");
    }
    await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_chats_remind ON chats(remind_at)").run();
    await env.DB.prepare("DELETE FROM usage WHERE length(k) > 30").run();
    await env.DB.prepare("INSERT OR REPLACE INTO admin_state (k, v) VALUES ('schema', ?)").bind(SCHEMA_VERSION).run();
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
    weekly: kind === "group" ? 1 : 0,
    kbv: KB_VERSION
    // Uzbek is the default for everyone; changeable in the menu / settings
  };
  const now = Date.now();
  await (await db(env)).prepare("INSERT OR IGNORE INTO chats (chat_id, kind, lang, alerts, weekly, kbv, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)").bind(row.chat_id, kind, row.lang, row.alerts, row.weekly, KB_VERSION, now, now).run();
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
async function addFeedback(env, chatId, name, text, via = "s") {
  await (await db(env)).prepare("INSERT INTO feedback (chat_id, name, text, created_at, via) VALUES (?,?,?,?,?)").bind(chatId, name || null, text, Date.now(), via).run();
  if (env.ADMIN_CHAT_ID) await forwardFeedback(env, chatId, name, text, null, via);
}
async function forwardFeedback(env, chatId, name, text, when, via = "s") {
  const where = via === "a" ? " \xB7 <i>admin botga yozilgan</i>" : "";
  const r = await adminSend(env, `\u270D\uFE0F <b>${when ? "Fikr-mulohaza" : "Yangi fikr-mulohaza"}</b>${when ? ` \xB7 ${esc(when)}` : ""}${where}
${esc(name || "Anonim")} (id: ${chatId}):

${esc(text)}

\u21A9\uFE0F Javob berish uchun shu xabarga <b>Reply</b> qiling.`);
  if (r.ok && r.result?.message_id) {
    const D = await db(env);
    if (hasAdminBot(env)) await D.prepare("INSERT OR REPLACE INTO feedback_replies_a (admin_msg_id, chat_id, via, created_at) VALUES (?,?,?,?)").bind(r.result.message_id, chatId, via === "a" ? "a" : "s", Date.now()).run();
    else await D.prepare("INSERT OR REPLACE INTO feedback_replies (admin_msg_id, chat_id, created_at) VALUES (?,?,?)").bind(r.result.message_id, chatId, Date.now()).run();
  }
  return r;
}
async function onSetup(request, url, env) {
  if (authBlocked(request)) return tooManyAttempts();
  const key = request.headers.get("x-admin-key") || url.searchParams.get("key");
  if (!await safeEqual(key, env.ADMIN_KEY)) {
    noteAuthFail(request);
    return new Response("Wrong key", { status: 403 });
  }
  const out = {};
  out.webhook = await tg(env, "setWebhook", {
    url: `${url.origin}/tg`,
    secret_token: await webhookSecret(env),
    allowed_updates: ["message", "callback_query", "my_chat_member"],
    drop_pending_updates: true
  });
  const cmds = {
    uz: [["today", "Bugungi darslar"], ["tomorrow", "Ertangi darslar"], ["week", "Haftalik jadval"], ["where", "Ustoz qayerda? (/where Karimov)"], ["group", "Guruhni tanlash (talaba)"], ["teacher", "O'qituvchi sifatida kirish"], ["settings", "Sozlamalar"], ["time", "Ertangi dars eslatmasi vaqti"], ["app", "Ilovani ochish"], ["calendar", "Kalendarga obuna bo'lish"], ["feedback", "Taklif yoki xato yuborish"], ["help", "Yordam"]].filter(([c]) => CALENDAR_ENABLED || c !== "calendar"),
    ru: [["today", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F"], ["tomorrow", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430"], ["week", "\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E"], ["where", "\u0413\u0434\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C? (/where Karimov)"], ["group", "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443 (\u0441\u0442\u0443\u0434\u0435\u043D\u0442)"], ["teacher", "\u0412\u043E\u0439\u0442\u0438 \u043A\u0430\u043A \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C"], ["settings", "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"], ["time", "\u0412\u0440\u0435\u043C\u044F \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F \u043E \u043F\u0430\u0440\u0430\u0445"], ["app", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435"], ["calendar", "\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u043D\u0430 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C"], ["feedback", "\u041E\u0442\u0437\u044B\u0432 \u0438\u043B\u0438 \u043E\u0448\u0438\u0431\u043A\u0430"], ["help", "\u041F\u043E\u043C\u043E\u0449\u044C"]].filter(([c]) => CALENDAR_ENABLED || c !== "calendar"),
    en: [["today", "Today's classes"], ["tomorrow", "Tomorrow's classes"], ["week", "Weekly timetable"], ["where", "Find a teacher (/where Karimov)"], ["group", "Choose group (student)"], ["teacher", "Sign in as a teacher"], ["settings", "Settings"], ["time", "Reminder time"], ["app", "Open the app"], ["calendar", "Subscribe to calendar"], ["feedback", "Send feedback"], ["help", "Help"]].filter(([c]) => CALENDAR_ENABLED || c !== "calendar")
  };
  const groupCmds = {
    uz: [["today", "Bugungi darslar"], ["tomorrow", "Ertangi darslar"], ["week", "Haftalik jadval"], ["where", "Ustoz qayerda? (/where Karimov)"], ["setgroup", "Chatni guruhga ulash (admin)"], ["unset", "Uzish (admin)"], ["time", "Eslatma vaqti (admin)"]],
    ru: [["today", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F"], ["tomorrow", "\u041F\u0430\u0440\u044B \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430"], ["week", "\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E"], ["where", "\u0413\u0434\u0435 \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C? (/where Karimov)"], ["setgroup", "\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u0447\u0430\u0442 \u043A \u0433\u0440\u0443\u043F\u043F\u0435 (\u0430\u0434\u043C\u0438\u043D)"], ["unset", "\u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C (\u0430\u0434\u043C\u0438\u043D)"], ["time", "\u0412\u0440\u0435\u043C\u044F \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F (\u0430\u0434\u043C\u0438\u043D)"]],
    en: [["today", "Today's classes"], ["tomorrow", "Tomorrow's classes"], ["week", "Weekly timetable"], ["where", "Find a teacher (/where Karimov)"], ["setgroup", "Link chat to a group (admin)"], ["unset", "Unlink (admin)"], ["time", "Reminder time (admin)"]]
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
  if (hasAdminBot(env)) {
    await (await db(env)).prepare("DELETE FROM admin_state WHERE k = 'abot'").run();
    adminBotReadyFor = null;
    await ensureAdminBot(env, url.origin);
    out.adminBot = { ok: await (await db(env)).prepare("SELECT v FROM admin_state WHERE k = 'abot'").first() != null };
  }
  const ok = Object.values(out).every((r) => r.ok);
  return json({ ok, hint: ok ? "All set! Open your bot in Telegram and press Start." : "Some steps failed \u2014 see details.", ...out });
}
var appOrigin = (env) => {
  try {
    return new URL(siteUrl(env)).origin;
  } catch {
    return null;
  }
};
var corsFor = (env) => ({
  ...appOrigin(env) ? { "access-control-allow-origin": appOrigin(env) } : {},
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
  vary: "origin"
});
var jsonCors = (env, obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", ...corsFor(env) } });
async function hmacSha256(key, data) {
  const k = await crypto.subtle.importKey("raw", typeof key === "string" ? new TextEncoder().encode(key) : key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(data)));
}
async function verifyInitData(env, initData, token = env.BOT_TOKEN) {
  if (typeof initData !== "string" || initData.length > 4096 || !token) return null;
  const p = new URLSearchParams(initData);
  const hash = p.get("hash");
  p.delete("hash");
  if (!hash) return null;
  const check = [...p.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${k}=${v}`).join("\n");
  const secret = await hmacSha256("WebAppData", token);
  const sig = [...await hmacSha256(secret, check)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (!await safeEqual(sig, hash)) return null;
  const age = Date.now() / 1e3 - Number(p.get("auth_date") || 0);
  if (!(age > -300 && age < 86400)) return null;
  try {
    const u = JSON.parse(p.get("user") || "");
    return u && Number.isSafeInteger(u.id) ? u : null;
  } catch {
    return null;
  }
}
var lastWeekPic = /* @__PURE__ */ new Map();
async function onWeekPic(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsFor(env) });
  if (request.method !== "POST") return jsonCors(env, { ok: false, error: "method" }, 405);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonCors(env, { ok: false, error: "bad request" }, 400);
  const user = await verifyInitData(env, body.initData);
  if (!user) return jsonCors(env, { ok: false, error: "auth" }, 401);
  const type = body.type === "t" ? "t" : body.type === "g" ? "g" : null;
  const id = String(body.id ?? "");
  if (!type || !/^[\w-]{1,40}$/.test(id)) return jsonCors(env, { ok: false, error: "bad request" }, 400);
  const lang = LANGS.includes(body.lang) ? body.lang : "uz";
  const last = lastWeekPic.get(user.id) || 0;
  if (Date.now() - last < 4e3) return jsonCors(env, { ok: false, error: "wait" }, 429);
  if (lastWeekPic.size > 500) lastWeekPic.clear();
  lastWeekPic.set(user.id, Date.now());
  await loadSubjects(env);
  const [index, ent] = await Promise.all([getIndex(env), type === "t" ? getTeacher(env, id) : getGroup(env, id)]);
  if (!index || !ent) return jsonCors(env, { ok: false, error: "no data" }, 404);
  const group = type === "t" ? { ...ent, kind: "t" } : ent;
  const monday = displayMonday(tashkentNow());
  let r = null;
  if ((!index.weekA || index.imgMonday === ymd(monday)) && !noTimetable(group)) {
    const photo = `${siteUrl(env)}/${weekImgPath(type, group.id ?? id, lang)}?v=${group.v || index.tt?.num || ""}&w=${ymd(monday)}`;
    r = await tg(env, "sendPhoto", { chat_id: user.id, photo, caption: fmtWeekCaption(group, index, monday, lang), parse_mode: "HTML" });
  }
  if (!r?.ok) r = await send(env, user.id, fmtWeek(group, index, monday, lang));
  return jsonCors(env, { ok: !!r?.ok });
}
var BC_TEXT_MAX = 3500;
var BC_BTN_MAX = 40;
var BC_PHOTO_MAX = 4 * 1024 * 1024;
var BC_TEST_TTL = 2 * 3600 * 1e3;
var isAdminUser = (env, u) => !!u && !!env.ADMIN_CHAT_ID && String(u.id) === String(env.ADMIN_CHAT_ID);
function bcFilter(f) {
  f = f && typeof f === "object" ? f : {};
  return {
    lang: LANGS.includes(f.lang) ? f.lang : "all",
    role: f.role === "student" || f.role === "teacher" ? f.role : "all",
    group: validId(f.group) ? String(f.group) : "",
    scope: f.scope === "picked" ? "picked" : "all"
    // picked = only chats that chose a group / teacher
  };
}
function bcAudience(f) {
  const w = ["kind = 'private'"], b = [];
  if (f.lang !== "all") {
    w.push("lang = ?");
    b.push(f.lang);
  }
  if (f.role !== "all") {
    w.push("role = ?");
    b.push(f.role);
  }
  if (f.group) {
    w.push("group_id = ?");
    b.push(f.group);
  }
  if (f.scope === "picked") w.push("group_id IS NOT NULL");
  return { where: w.join(" AND "), binds: b };
}
var bcCount = async (D, f) => {
  const a = bcAudience(f);
  return (await D.prepare(`SELECT COUNT(*) AS n FROM chats WHERE ${a.where}`).bind(...a.binds).first())?.n || 0;
};
function bcPayload(raw) {
  if (!raw || typeof raw !== "object") return { error: "bad payload" };
  const photo = typeof raw.photo === "string" && /^[\w-]{10,200}$/.test(raw.photo) ? raw.photo : null;
  const texts = {};
  for (const l of LANGS) {
    const t = String(raw.texts?.[l] ?? "").replace(/\r\n/g, "\n").trim();
    if (t) texts[l] = t;
  }
  if (!Object.keys(texts).length) return { error: "empty" };
  for (const t of Object.values(texts)) {
    if (t.length > BC_TEXT_MAX) return { error: "too long" };
    if (photo && `\u{1F4E2} ${esc(t)}`.length > BC_CAPTION_MAX) return { error: "caption too long" };
  }
  let btn = null;
  if (raw.btn && (raw.btn.url || Object.values(raw.btn.text || {}).some(Boolean))) {
    let u;
    try {
      u = new URL(String(raw.btn.url || ""));
    } catch {
      return { error: "bad link" };
    }
    if (u.protocol !== "https:" || String(raw.btn.url).length > 500) return { error: "bad link" };
    const bt = {};
    for (const l of LANGS) {
      const t = String(raw.btn.text?.[l] ?? "").trim().slice(0, BC_BTN_MAX);
      if (t) bt[l] = t;
    }
    if (!Object.keys(bt).length) return { error: "button text" };
    btn = { text: bt, url: u.href };
  }
  const ttl = BC_TTL.some((x) => x[0] === Number(raw.ttl)) ? Number(raw.ttl) : 0;
  return { p: { texts, photo, btn, app: raw.app !== false, invite: raw.invite !== false, ttl } };
}
var BC_DELETE_WINDOW = 47 * 36e5;
async function bcRecent(D, limit) {
  const { results } = await D.prepare(`SELECT b.id, b.created_at, b.total, b.sent, b.failed, b.status, b.finished_at, b.deleted_at,
      json_extract(b.payload, '$.ttl') ttl, (SELECT COUNT(*) FROM broadcast_done d WHERE d.bid = b.id AND d.msg_id IS NOT NULL) ids
    FROM broadcasts b ORDER BY b.id DESC LIMIT ?`).bind(limit).all();
  const now = Date.now();
  return results.map((b) => ({ ...b, ttl: Number(b.ttl) || 0, deletable: !b.deleted_at && b.ids > 0 && now - b.created_at < BC_DELETE_WINDOW }));
}
async function bcDeleteNow(env, D, id) {
  const b = await D.prepare("SELECT id, created_at, status, deleted_at FROM broadcasts WHERE id = ?").bind(id).first();
  if (!b) return { ok: false, error: "not found" };
  if (b.deleted_at) return { ok: false, error: "already" };
  const now = Date.now();
  if (now - b.created_at > BC_DELETE_WINDOW) return { ok: false, error: "too old" };
  await D.prepare("UPDATE broadcasts SET status = 'cancelled', finished_at = ? WHERE id = ? AND status IN ('queued','sending')").bind(now, id).run();
  const n = (await D.prepare("SELECT COUNT(*) n FROM broadcast_done WHERE bid = ? AND ok = 1 AND msg_id IS NOT NULL").bind(id).first())?.n || 0;
  if (!n && b.status === "done") return { ok: false, error: "no ids" };
  await D.prepare("UPDATE broadcasts SET deleted_at = ?, del_at = ?, purged_at = NULL WHERE id = ?").bind(now, now, id).run();
  const woke = await dispatchWorkflow(env, "lessons.yml", { at: "" });
  return { ok: true, n, woke };
}
async function bcPick(env) {
  const me = await tg(env, "getMe", {});
  return { bot: me?.result?.username || null, site: siteUrl(env) || null };
}
async function onAdminApi(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsFor(env) });
  if (request.method !== "POST") return jsonCors(env, { ok: false, error: "method" }, 405);
  if (Number(request.headers.get("content-length") || 0) > 6 * 1024 * 1024) return jsonCors(env, { ok: false, error: "too big" }, 413);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonCors(env, { ok: false, error: "bad request" }, 400);
  const user = await verifyInitData(env, body.initData, hasAdminBot(env) ? env.ADMIN_BOT_TOKEN : env.BOT_TOKEN);
  if (!user) return jsonCors(env, { ok: false, error: "auth" }, hasAdminBot(env) && body.op === "me" ? 200 : 401);
  if (body.op === "me") return jsonCors(env, { ok: true, admin: isAdminUser(env, user) });
  if (!isAdminUser(env, user)) return jsonCors(env, { ok: false, error: "forbidden" }, 403);
  const D = await db(env);
  const adminId = Number(env.ADMIN_CHAT_ID);
  if (body.op === "count") return jsonCors(env, { ok: true, n: await bcCount(D, bcFilter(body.filter)) });
  if (body.op === "photo") {
    const m = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec(String(body.image || ""));
    if (!m) return jsonCors(env, { ok: false, error: "bad image" }, 400);
    let bin;
    try {
      bin = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
    } catch {
      return jsonCors(env, { ok: false, error: "bad image" }, 400);
    }
    const magicOk = bin[0] === 255 && bin[1] === 216 || bin[0] === 137 && bin[1] === 80;
    if (!magicOk || bin.length > BC_PHOTO_MAX) return jsonCors(env, { ok: false, error: "bad image" }, 400);
    const fd = new FormData();
    fd.append("chat_id", String(adminId));
    fd.append("disable_notification", "true");
    fd.append("caption", "\u{1F4CE} E'lon rasmi saqlandi");
    fd.append("photo", new Blob([bin], { type: m[1] === "png" ? "image/png" : "image/jpeg" }), m[1] === "png" ? "e.png" : "e.jpg");
    const res = await fetch(`${tgBase(env)}/bot${env.BOT_TOKEN}/sendPhoto`, { method: "POST", body: fd });
    const j2 = await res.json().catch(() => ({ ok: false }));
    const sizes = j2.result?.photo;
    const fileId = Array.isArray(sizes) && sizes.length ? sizes[sizes.length - 1].file_id : null;
    if (!j2.ok || !fileId) return jsonCors(env, { ok: false, error: "upload failed" }, 502);
    return jsonCors(env, { ok: true, photo: fileId });
  }
  if (body.op === "test" || body.op === "send") {
    const c = bcPayload(body.payload);
    if (c.error) return jsonCors(env, { ok: false, error: c.error }, 400);
    const filter = bcFilter(body.filter);
    const hash = await sha256hex(JSON.stringify([c.p, filter]));
    if (body.op === "test") {
      const ctx = await bcPick(env);
      const mine = await D.prepare("SELECT role, group_id FROM chats WHERE chat_id = ?").bind(adminId).first();
      let sent = 0;
      for (const lang of Object.keys(c.p.texts)) {
        const m = bcMessage(c.p, { lang, role: mine?.role, group_id: mine?.group_id }, ctx);
        const r = m.photo ? await tg(env, "sendPhoto", { chat_id: adminId, photo: m.photo.photo, caption: m.photo.caption, parse_mode: "HTML", reply_markup: m.markup }) : await tg(env, "sendMessage", { chat_id: adminId, text: m.text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup: m.markup });
        if (r?.ok) sent++;
      }
      if (!sent) return jsonCors(env, { ok: false, error: "test failed" }, 502);
      await D.prepare("INSERT OR REPLACE INTO admin_state (k, v) VALUES (?, ?)").bind("bc_test", JSON.stringify({ hash, at: Date.now() })).run();
      return jsonCors(env, { ok: true, sent, n: await bcCount(D, filter) });
    }
    const st = JSON.parse((await D.prepare("SELECT v FROM admin_state WHERE k = 'bc_test'").first())?.v || "null");
    if (!st || st.hash !== hash || Date.now() - st.at > BC_TEST_TTL) return jsonCors(env, { ok: false, error: "test first" }, 409);
    const n = await bcCount(D, filter);
    if (!n) return jsonCors(env, { ok: false, error: "nobody" }, 400);
    if (Number(body.confirm) !== n) return jsonCors(env, { ok: false, error: "count changed", n }, 409);
    const busy = await D.prepare("SELECT id FROM broadcasts WHERE status IN ('queued','sending') LIMIT 1").first();
    if (busy) return jsonCors(env, { ok: false, error: "busy", id: busy.id }, 409);
    const ins = await D.prepare("INSERT INTO broadcasts (created_at, payload, filter, total) VALUES (?, ?, ?, ?) RETURNING id").bind(Date.now(), JSON.stringify(c.p), JSON.stringify(filter), n).first();
    await D.prepare("DELETE FROM admin_state WHERE k = 'bc_test'").run();
    const woke = await dispatchWorkflow(env);
    return jsonCors(env, { ok: true, id: ins.id, total: n, woke });
  }
  if (body.op === "status") {
    return jsonCors(env, { ok: true, list: await bcRecent(D, 5) });
  }
  if (body.op === "delete") {
    const id = Number(body.id);
    if (!Number.isSafeInteger(id)) return jsonCors(env, { ok: false, error: "bad request" }, 400);
    const r = await bcDeleteNow(env, D, id);
    return jsonCors(env, r, r.ok ? 200 : 409);
  }
  if (body.op === "cancel") {
    const id = Number(body.id);
    if (!Number.isSafeInteger(id)) return jsonCors(env, { ok: false, error: "bad request" }, 400);
    const r = await D.prepare("UPDATE broadcasts SET status = 'cancelled', finished_at = ? WHERE id = ? AND status IN ('queued','sending')").bind(Date.now(), id).run();
    return jsonCors(env, { ok: true, cancelled: (r.meta?.changes || 0) > 0 });
  }
  return jsonCors(env, { ok: false, error: "bad request" }, 400);
}
async function onInternal(request, url, env) {
  if (authBlocked(request)) return tooManyAttempts();
  if (!await safeEqual(request.headers.get("x-admin-key"), env.ADMIN_KEY)) {
    noteAuthFail(request);
    return new Response("Forbidden", { status: 403 });
  }
  const D = await db(env);
  if (url.pathname === "/internal/subs") {
    const mode = url.searchParams.get("mode");
    const after = Number(url.searchParams.get("after") || "-9999999999999");
    const limit = Math.min(5e3, Number(url.searchParams.get("limit") || 2e3));
    let filter = mode === "all" || mode === "everyone" ? "" : mode === "lessons" ? "AND kind = 'private' AND (lr = 1 OR de = 1)" : `AND ${mode === "weekly" ? "weekly" : "alerts"} = 1`;
    const binds = [];
    if (mode === "tomorrow") {
      filter = "AND remind_at >= 0";
      if (url.searchParams.has("to")) {
        filter = "AND remind_at > ? AND remind_at <= ?";
        binds.push(Number(url.searchParams.get("from") || -1), Number(url.searchParams.get("to")));
      }
    }
    const day = url.searchParams.get("day");
    if (day && /^\d{4}-\d{2}-\d{2}$/.test(day) && (mode === "tomorrow" || mode === "weekly")) {
      const col = mode === "weekly" ? "sent_wk" : "sent_tmr";
      filter += ` AND (${col} IS NULL OR ${col} != ?)`;
      binds.push(day);
    }
    const { results } = await D.prepare(`SELECT chat_id, kind, role, group_id, lang, lr, de, lri FROM chats WHERE ${mode === "everyone" ? "(group_id IS NOT NULL OR kind = 'private')" : "group_id IS NOT NULL"} ${filter} AND chat_id > ? ORDER BY chat_id LIMIT ?`).bind(...binds, after, limit).all();
    return json({ rows: results, next: results.length === limit ? results[results.length - 1].chat_id : null });
  }
  if ((url.pathname === "/internal/claim" || url.pathname === "/internal/unclaim") && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const col = body?.kind === "wk" ? "sent_wk" : body?.kind === "tmr" ? "sent_tmr" : null;
    const ids = Array.isArray(body?.ids) ? body.ids.filter((x) => Number.isSafeInteger(x)).slice(0, 5e3) : [];
    if (!col || !/^\d{4}-\d{2}-\d{2}$/.test(String(body?.day)) || !ids.length) return json({ error: "bad request" }, 400);
    const claiming = url.pathname === "/internal/claim";
    const stmts = [];
    for (let i = 0; i < ids.length; i += 80) {
      const part = ids.slice(i, i + 80);
      const marks = part.map(() => "?").join(",");
      stmts.push(claiming ? D.prepare(`UPDATE chats SET ${col} = ? WHERE chat_id IN (${marks}) AND (${col} IS NULL OR ${col} != ?) RETURNING chat_id`).bind(body.day, ...part, body.day) : D.prepare(`UPDATE chats SET ${col} = NULL WHERE chat_id IN (${marks}) AND ${col} = ?`).bind(...part, body.day));
    }
    const res = await D.batch(stmts);
    return json(claiming ? { claimed: res.flatMap((r) => (r.results || []).map((x) => x.chat_id)) } : { ok: true });
  }
  if (url.pathname === "/internal/cleanup" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return json({ error: "bad request" }, 400);
    const remove = (Array.isArray(body.remove) ? body.remove : []).filter(Number.isSafeInteger).slice(0, 5e3);
    const migrate = (Array.isArray(body.migrate) ? body.migrate : []).filter((p) => Array.isArray(p) && p.length === 2 && p.every(Number.isSafeInteger)).slice(0, 5e3);
    const stmts = [];
    for (const id of remove) stmts.push(D.prepare("DELETE FROM chats WHERE chat_id = ?").bind(id));
    for (const [from, to] of migrate) stmts.push(D.prepare("UPDATE OR REPLACE chats SET chat_id = ? WHERE chat_id = ?").bind(to, from));
    if (stmts.length) await D.batch(stmts);
    return json({ ok: true, removed: remove.length, migrated: migrate.length });
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
  if (url.pathname === "/internal/lclaim2" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const kind = body?.kind, tag = String(body?.tag || "");
    const okTag = kind === "lr" ? /^\d{4}-\d\d-\d\d:\d{1,4}$/.test(tag) : kind === "de" ? /^\d{4}-\d\d-\d\d$/.test(tag) : false;
    const ids = (Array.isArray(body?.ids) ? body.ids : []).filter(Number.isSafeInteger).slice(0, 5e3);
    if (!okTag || !ids.length) return json({ claimed: [] });
    const col = kind === "lr" ? "lr_tag" : "de_day";
    const set = kind === "lr" ? "lr_tag = ?, lri = 1" : "de_day = ?";
    const stmts = [];
    for (let i = 0; i < ids.length; i += 90) {
      const part = ids.slice(i, i + 90);
      stmts.push(D.prepare(`UPDATE chats SET ${set} WHERE chat_id IN (${part.map(() => "?").join(",")}) AND (${col} IS NULL OR ${col} != ?) RETURNING chat_id`).bind(tag, ...part, tag));
    }
    const res = await D.batch(stmts);
    return json({ claimed: res.flatMap((r) => (r.results || []).map((x) => x.chat_id)) });
  }
  if (url.pathname === "/internal/pend/add" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const items = (Array.isArray(body?.items) ? body.items : []).filter((x) => Array.isArray(x) && x.length === 3 && x.every(Number.isSafeInteger)).slice(0, 2e4);
    const stmts = [];
    for (let i = 0; i < items.length; i += 1500) {
      const part = items.slice(i, i + 1500);
      const first = Math.min(...part.map((x) => x[2]));
      stmts.push(D.prepare("INSERT INTO admin_state (k, v) VALUES (?, ?)").bind(`pend:${String(first).padStart(15, "0")}:${crypto.randomUUID().slice(0, 8)}`, JSON.stringify(part)));
    }
    if (stmts.length) await D.batch(stmts);
    return json({ ok: true, lists: stmts.length });
  }
  if (url.pathname === "/internal/pend/due") {
    const now = Number(url.searchParams.get("now") || Date.now());
    const { results } = await D.prepare("SELECT k, v FROM admin_state WHERE k >= 'pend:' AND k <= ? ORDER BY k LIMIT 50").bind(`pend:${String(Math.floor(now)).padStart(15, "0")}:~`).all();
    return json({ rows: results.map((r) => ({ k: r.k, items: JSON.parse(r.v) })) });
  }
  if (url.pathname === "/internal/pend/done" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const rows = (Array.isArray(body?.rows) ? body.rows : []).filter((r) => r && /^pend:\d{15}:[\w-]{1,12}$/.test(String(r.k)) && Array.isArray(r.keep)).slice(0, 50);
    const stmts = [];
    for (const r of rows) {
      const keep = r.keep.filter((x) => Array.isArray(x) && x.length === 3 && x.every(Number.isSafeInteger));
      stmts.push(D.prepare("DELETE FROM admin_state WHERE k = ?").bind(r.k));
      if (keep.length) stmts.push(D.prepare("INSERT OR REPLACE INTO admin_state (k, v) VALUES (?, ?)").bind(`pend:${String(Math.min(...keep.map((x) => x[2]))).padStart(15, "0")}:${String(r.k).split(":")[2]}`, JSON.stringify(keep)));
    }
    if (stmts.length) await D.batch(stmts);
    return json({ ok: true });
  }
  if (url.pathname === "/internal/bcdel/due") {
    const now = Number(url.searchParams.get("now") || Date.now());
    const b = await D.prepare("SELECT id FROM broadcasts WHERE del_at IS NOT NULL AND del_at <= ? AND purged_at IS NULL ORDER BY del_at LIMIT 1").bind(now).first();
    if (!b) return json({ bid: null, rows: [] });
    const after = Number(url.searchParams.get("after") || -1e15);
    const { results } = await D.prepare("SELECT chat_id, msg_id FROM broadcast_done WHERE bid = ? AND ok = 1 AND msg_id IS NOT NULL AND chat_id > ? ORDER BY chat_id LIMIT 1000").bind(b.id, after).all();
    return json({ bid: b.id, rows: results, next: results.length === 1e3 ? results[results.length - 1].chat_id : null });
  }
  if (url.pathname === "/internal/bcdel/done" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const id = Number(body?.bid);
    if (!Number.isSafeInteger(id)) return json({ error: "bad request" }, 400);
    await D.prepare("UPDATE broadcasts SET purged_at = ?, deleted_at = COALESCE(deleted_at, ?) WHERE id = ?").bind(Date.now(), Date.now(), id).run();
    return json({ ok: true });
  }
  if (url.pathname === "/internal/lclaim" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const items = (Array.isArray(body?.items) ? body.items : []).filter((x) => x && /^[LE]:\d{4}-\d\d-\d\d(:\d{1,4})?$/.test(String(x.tag)) && Number.isSafeInteger(x.chat_id)).slice(0, 1e3);
    if (!items.length) return json({ claimed: [] });
    const now = Date.now();
    const res = await D.batch(items.map((x) => D.prepare("INSERT OR IGNORE INTO lclaim (tag, chat_id, at) VALUES (?, ?, ?) RETURNING tag, chat_id").bind(x.tag, x.chat_id, now)));
    if (Math.random() < 0.05) await D.prepare("DELETE FROM lclaim WHERE at < ?").bind(now - 3 * 864e5).run();
    return json({ claimed: res.flatMap((r) => r.results || []) });
  }
  if (url.pathname === "/internal/eph/add" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const items = (Array.isArray(body?.items) ? body.items : []).filter((x) => Array.isArray(x) && x.length === 3 && x.every(Number.isSafeInteger)).slice(0, 1e3);
    const intro = (Array.isArray(body?.intro) ? body.intro : []).filter(Number.isSafeInteger).slice(0, 1e3);
    const stmts = items.map(([c, m, t]) => D.prepare("INSERT OR REPLACE INTO eph (chat_id, msg_id, del_at) VALUES (?, ?, ?)").bind(c, m, t));
    for (let i = 0; i < intro.length; i += 80) {
      const part = intro.slice(i, i + 80);
      stmts.push(D.prepare(`UPDATE chats SET lri = 1 WHERE chat_id IN (${part.map(() => "?").join(",")})`).bind(...part));
    }
    if (stmts.length) await D.batch(stmts);
    return json({ ok: true, added: items.length });
  }
  if (url.pathname === "/internal/eph/due") {
    const now = Number(url.searchParams.get("now") || Date.now());
    const { results } = await D.prepare("SELECT chat_id, msg_id FROM eph WHERE del_at <= ? ORDER BY del_at LIMIT 500").bind(now).all();
    return json({ rows: results });
  }
  if (url.pathname === "/internal/eph/done" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const items = (Array.isArray(body?.items) ? body.items : []).filter((x) => Array.isArray(x) && x.length === 2 && x.every(Number.isSafeInteger)).slice(0, 1e3);
    if (items.length) await D.batch(items.map(([c, m]) => D.prepare("DELETE FROM eph WHERE chat_id = ? AND msg_id = ?").bind(c, m)));
    return json({ ok: true });
  }
  if (url.pathname === "/internal/broadcast/next") {
    const now = Date.now();
    const row = await D.prepare("UPDATE broadcasts SET status = 'sending', lease_until = ? WHERE id = (SELECT id FROM broadcasts WHERE status = 'queued' OR (status = 'sending' AND lease_until < ?) ORDER BY id LIMIT 1) RETURNING id, payload, filter, del_at").bind(now + 10 * 6e4, now).first();
    const ttl = row ? Number(JSON.parse(row.payload).ttl) || 0 : 0;
    if (row && ttl && !row.del_at) await D.prepare("UPDATE broadcasts SET del_at = ? WHERE id = ?").bind(now + ttl * 36e5, row.id).run();
    return json({ job: row ? { id: row.id, payload: JSON.parse(row.payload), filter: JSON.parse(row.filter) } : null });
  }
  if (url.pathname === "/internal/broadcast/chats") {
    const id = Number(url.searchParams.get("id"));
    const after = Number(url.searchParams.get("after") || "-9999999999999");
    const limit = Math.min(500, Number(url.searchParams.get("limit") || 200));
    const job = Number.isSafeInteger(id) ? await D.prepare("SELECT filter FROM broadcasts WHERE id = ?").bind(id).first() : null;
    if (!job) return json({ error: "not found" }, 404);
    const a = bcAudience(bcFilter(JSON.parse(job.filter)));
    const { results } = await D.prepare(`SELECT chat_id, lang, role, group_id FROM chats WHERE ${a.where} AND chat_id > ? AND chat_id NOT IN (SELECT chat_id FROM broadcast_done WHERE bid = ?) ORDER BY chat_id LIMIT ?`).bind(...a.binds, after, id, limit).all();
    return json({ rows: results, next: results.length === limit ? results[results.length - 1].chat_id : null });
  }
  if (url.pathname === "/internal/broadcast/progress" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const id = Number(body?.id);
    if (!Number.isSafeInteger(id)) return json({ error: "bad request" }, 400);
    const ids = (a) => Array.isArray(a) ? a.filter(Number.isSafeInteger).slice(0, 500) : [];
    const msg = new Map((Array.isArray(body.msgs) ? body.msgs : []).filter((x) => Array.isArray(x) && x.length === 2 && x.every(Number.isSafeInteger)).slice(0, 500));
    const gone = (await D.prepare("SELECT deleted_at FROM broadcasts WHERE id = ?").bind(id).first())?.deleted_at;
    const stmts = [
      ...ids(body.done).map((c) => D.prepare("INSERT OR IGNORE INTO broadcast_done (bid, chat_id, ok, msg_id) VALUES (?, ?, 1, ?)").bind(id, c, msg.get(c) ?? null)),
      ...gone && msg.size ? [D.prepare("UPDATE broadcasts SET purged_at = NULL WHERE id = ?").bind(id)] : [],
      // these copies need deleting too
      ...ids(body.failed).map((c) => D.prepare("INSERT OR IGNORE INTO broadcast_done (bid, chat_id, ok) VALUES (?, ?, 0)").bind(id, c)),
      D.prepare("UPDATE broadcasts SET sent = (SELECT COUNT(*) FROM broadcast_done WHERE bid = ?1 AND ok = 1), failed = (SELECT COUNT(*) FROM broadcast_done WHERE bid = ?1 AND ok = 0), lease_until = ?2 WHERE id = ?1").bind(id, Date.now() + 10 * 6e4)
    ];
    await D.batch(stmts);
    const row = await D.prepare("SELECT status FROM broadcasts WHERE id = ?").bind(id).first();
    return json({ status: row?.status || "missing" });
  }
  if (url.pathname === "/internal/broadcast/finish" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const id = Number(body?.id);
    if (!Number.isSafeInteger(id)) return json({ error: "bad request" }, 400);
    await D.prepare("UPDATE broadcasts SET status = 'done', finished_at = ? WHERE id = ? AND status = 'sending'").bind(Date.now(), id).run();
    return json({ ok: true });
  }
  if (url.pathname === "/internal/stats") {
    const r = await D.prepare(`SELECT kind, role, COUNT(*) AS n, SUM(group_id IS NOT NULL) AS with_group FROM chats GROUP BY kind, role`).all();
    const fb = await D.prepare("SELECT chat_id, name, text, created_at FROM feedback ORDER BY id DESC LIMIT 20").all();
    return json({ stats: r.results, feedback: fb.results });
  }
  return new Response("Not found", { status: 404 });
}
async function onWebhook(request, env) {
  if (authBlocked(request)) return tooManyAttempts();
  if (!await safeEqual(request.headers.get("x-telegram-bot-api-secret-token"), await webhookSecret(env))) {
    noteAuthFail(request);
    return new Response("Forbidden", { status: 403 });
  }
  if (Number(request.headers.get("content-length") || 0) > 1e6) return new Response("Too large", { status: 413 });
  const update = await request.json().catch(() => null);
  if (!update || typeof update !== "object") return new Response("ok");
  const gm = update.message;
  if (gm && gm.chat?.type !== "private" && !gm.migrate_to_chat_id && !String(gm.text || "").startsWith("/")) return new Response("ok");
  if (flooding(env, gm?.from?.id || update.callback_query?.from?.id)) return new Response("ok");
  if (await alreadyHandled(env, update.update_id)) return new Response("ok");
  await loadSubjects(env);
  if (update.message) await onMessage(env, update.message);
  else if (update.callback_query) await onCallback(env, update.callback_query);
  else if (update.my_chat_member) await onMyChatMember(env, update.my_chat_member);
  await track(env, update);
  return new Response("ok");
}
var adminWebhookSecret = async (env) => (await sha256hex("tga:" + env.ADMIN_KEY)).slice(0, 48);
var adminBotUser = null;
async function adminBotName(env) {
  if (!hasAdminBot(env)) return null;
  if (!adminBotUser) {
    const r = await atg(env, "getMe", {});
    if (r?.ok) adminBotUser = r.result.username;
  }
  return adminBotUser;
}
var adminBotReadyFor = null;
async function ensureAdminBot(env, origin) {
  if (!hasAdminBot(env) || !env.ADMIN_KEY || !/^(https:\/\/|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$)/.test(origin)) return;
  const sig = (await sha256hex("abot:" + env.ADMIN_BOT_TOKEN + "|" + origin)).slice(0, 32);
  if (adminBotReadyFor === sig) return;
  const D = await db(env);
  const have = (await D.prepare("SELECT v FROM admin_state WHERE k = 'abot'").first())?.v;
  if (have === sig) {
    adminBotReadyFor = sig;
    return;
  }
  const r = await atg(env, "setWebhook", { url: `${origin}/tga`, secret_token: await adminWebhookSecret(env), allowed_updates: ["message", "callback_query"], drop_pending_updates: true });
  if (!r?.ok) return;
  await setupAdminBotMenu(env);
  await D.prepare("INSERT OR REPLACE INTO admin_state (k, v) VALUES ('abot', ?)").bind(sig).run();
  adminBotReadyFor = sig;
}
async function setupAdminBotMenu(env) {
  await atg(env, "setMyCommands", { commands: [
    { command: "start", description: "\u{1F3E0} Bosh menyu" },
    { command: "stats", description: "\u{1F4CA} Statistika" },
    { command: "fikrlar", description: "\u270D\uFE0F So'nggi fikr-mulohazalar" },
    { command: "elon", description: "\u{1F4E3} E'lon yuborish" }
  ] });
  await atg(env, "setMyShortDescription", { short_description: "TDIU Jadval \u2014 boshqaruv paneli (faqat jamoa uchun)." });
  if (env.ADMIN_CHAT_ID && siteUrl(env)) {
    await atg(env, "setChatMenuButton", { chat_id: Number(env.ADMIN_CHAT_ID), menu_button: { type: "web_app", text: "\u{1F4E3} E'lon", web_app: { url: `${siteUrl(env)}/#tab=admin` } } });
  }
}
var VISITOR = {
  uz: { hi: (b) => `\u{1F44B} Salom! Bu \u2014 TDIU Jadval jamoasining xizmat boti.

\u{1F4C5} Dars jadvali, eslatmalar va bo'sh xonalar \u2014 ${b ? "@" + b : "asosiy botda"}.
\u270D\uFE0F Taklif, xato yoki savolingiz bo'lsa, shu yerga yozing \u2014 jamoaga yetkazamiz va shu yerda javob beramiz.`, open: "\u{1F4C5} TDIU Jadval botini ochish", thanks: "\u2705 Rahmat! Xabaringiz jamoaga yetkazildi. Javob shu yerga keladi.", text: "\u270D\uFE0F Iltimos, matn ko'rinishida yozing." },
  ru: { hi: (b) => `\u{1F44B} \u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u042D\u0442\u043E \u0441\u043B\u0443\u0436\u0435\u0431\u043D\u044B\u0439 \u0431\u043E\u0442 \u043A\u043E\u043C\u0430\u043D\u0434\u044B TDIU Jadval.

\u{1F4C5} \u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u044F \u0438 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438 \u2014 \u0432 ${b ? "@" + b : "\u043E\u0441\u043D\u043E\u0432\u043D\u043E\u043C \u0431\u043E\u0442\u0435"}.
\u270D\uFE0F \u0415\u0441\u0442\u044C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435, \u043E\u0448\u0438\u0431\u043A\u0430 \u0438\u043B\u0438 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0441\u044E\u0434\u0430, \u043C\u044B \u043F\u0435\u0440\u0435\u0434\u0430\u0434\u0438\u043C \u043A\u043E\u043C\u0430\u043D\u0434\u0435 \u0438 \u043E\u0442\u0432\u0435\u0442\u0438\u043C \u0437\u0434\u0435\u0441\u044C \u0436\u0435.`, open: "\u{1F4C5} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0431\u043E\u0442 TDIU Jadval", thanks: "\u2705 \u0421\u043F\u0430\u0441\u0438\u0431\u043E! \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D\u043E \u043A\u043E\u043C\u0430\u043D\u0434\u0435. \u041E\u0442\u0432\u0435\u0442 \u043F\u0440\u0438\u0434\u0451\u0442 \u0441\u044E\u0434\u0430.", text: "\u270D\uFE0F \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442\u043E\u043C." },
  en: { hi: (b) => `\u{1F44B} Hi! This is the TDIU Jadval team's service bot.

\u{1F4C5} Timetable, reminders and free rooms are in ${b ? "@" + b : "the main bot"}.
\u270D\uFE0F Have an idea, a bug or a question? Write it here \u2014 we'll pass it to the team and answer right here.`, open: "\u{1F4C5} Open the TDIU Jadval bot", thanks: "\u2705 Thank you! Your message reached the team. The answer will come here.", text: "\u270D\uFE0F Please write it as text." }
};
async function adminBotVisitor(env, msg) {
  const lang = langFromCode(msg.from?.language_code);
  const V = VISITOR[lang] || VISITOR.uz;
  const send2 = (text, extra = {}) => atg(env, "sendMessage", { chat_id: msg.chat.id, text, disable_web_page_preview: true, ...extra });
  const command = parseCommand(msg.text || "");
  if (!msg.text || command) {
    if (!msg.text && !command) return send2(V.text);
    const bot = await getBotName(env);
    return send2(V.hi(bot), bot ? { reply_markup: { inline_keyboard: [[{ text: V.open, url: `https://t.me/${bot}` }]] } } : {});
  }
  const recent = await (await db(env)).prepare("SELECT COUNT(*) AS n FROM feedback WHERE chat_id = ? AND created_at > ?").bind(msg.chat.id, Date.now() - 36e5).first();
  if ((recent?.n || 0) >= 5) return send2(tr(lang).feedbackLimit.replace(/<[^>]+>/g, ""));
  await addFeedback(env, msg.chat.id, msg.from?.username ? "@" + msg.from.username : msg.from?.first_name, msg.text.slice(0, 2e3), "a");
  return send2(V.thanks);
}
var ADMIN_KB = { keyboard: [[{ text: "\u{1F4CA} Statistika" }, { text: "\u270D\uFE0F Fikrlar" }], [{ text: "\u{1F4E3} E'lon" }]], resize_keyboard: true, is_persistent: true };
var adminElonButton = (env) => ({ inline_keyboard: [[{ text: "\u{1F4E3} E'lon oynasini ochish", web_app: { url: `${siteUrl(env)}/#tab=admin` } }]] });
async function onAdminWebhook(request, env) {
  if (!hasAdminBot(env)) return new Response("Not found", { status: 404 });
  if (authBlocked(request)) return tooManyAttempts();
  if (!await safeEqual(request.headers.get("x-telegram-bot-api-secret-token"), await adminWebhookSecret(env))) {
    noteAuthFail(request);
    return new Response("Forbidden", { status: 403 });
  }
  if (Number(request.headers.get("content-length") || 0) > 1e6) return new Response("Too large", { status: 413 });
  const update = await request.json().catch(() => null);
  if (!update || typeof update !== "object") return new Response("ok");
  const from = update.message?.from || update.callback_query?.from;
  if (flooding(env, from?.id)) return new Response("ok");
  if (Number.isSafeInteger(update.update_id) && await alreadyHandled(env, -1 - update.update_id)) return new Response("ok");
  const msg = update.message, cb = update.callback_query;
  const chatId = msg?.chat?.id ?? cb?.message?.chat?.id;
  if (msg && msg.chat?.type !== "private") return new Response("ok");
  if (!isAdminChat(env, chatId) || !isAdminChat(env, from?.id)) {
    if (cb) await atg(env, "answerCallbackQuery", { callback_query_id: cb.id });
    else if (msg) await adminBotVisitor(env, msg);
    return new Response("ok");
  }
  if (cb) {
    atg(env, "answerCallbackQuery", { callback_query_id: cb.id });
    if (cb.data === "adm:stats") await sendStats(env, chatId, cb.message.message_id, true);
    else if (String(cb.data || "").startsWith("bc:")) await onDraftButton(env, cb);
    else if (String(cb.data || "").startsWith("fb:")) await onFeedbackButton(env, cb);
    else if (String(cb.data || "").startsWith("bd:")) await onBcListButton(env, cb);
    return new Response("ok");
  }
  if (!msg) return new Response("ok");
  if (!msg.text) {
    await startDraft(env, msg);
    return new Response("ok");
  }
  const command = parseCommand(msg.text);
  const t = msg.text.trim();
  const cmd = command?.cmd || (t === "\u{1F4CA} Statistika" ? "stats" : t === "\u270D\uFE0F Fikrlar" ? "fikrlar" : t === "\u{1F4E3} E'lon" ? "elon" : null);
  if (cmd === "start" || cmd === "menu" || cmd === "help") {
    await atg(env, "sendMessage", { chat_id: chatId, parse_mode: "HTML", reply_markup: ADMIN_KB, text: [
      "\u{1F6E0} <b>TDIU Jadval \u2014 boshqaruv</b>",
      "",
      "\u{1F4CA} <b>Statistika</b> \u2014 foydalanuvchilar va faollik",
      "\u270D\uFE0F <b>Fikrlar</b> \u2014 so'nggi fikr-mulohazalar; javob berish uchun xabarga <b>Reply</b> qiling",
      "\u{1F4E3} <b>E'lon</b> \u2014 shaxsiy chatlarga e'lon (chap pastdagi tugma ham ochadi)",
      "\u{1F4E8} Yoki istalgan xabarni \u2014 matn, rasm, video, GIF, fayl \u2014 shu yerga yuboring yoki <b>forward</b> qiling: e'lon loyihasi bo'ladi, faqat tasdiqlaganingizdan keyin yuboriladi",
      "",
      "Yangi fikr-mulohaza kelsa, shu yerga keladi. Javobingiz talabaga @tdiujadval_bot orqali boradi."
    ].join("\n") });
    await setupAdminBotMenu(env);
    return new Response("ok");
  }
  if (cmd === "stats") {
    await sendStats(env, chatId, null, true);
    return new Response("ok");
  }
  if (cmd === "elon") {
    if (siteUrl(env)) await atg(env, "sendMessage", { chat_id: chatId, text: "\u{1F4E3} E'lon yuborish oynasi:", reply_markup: adminElonButton(env) });
    await sendBcList(env, chatId);
    return new Response("ok");
  }
  if (cmd === "fikrlar") {
    await sendFeedbackPage(env, chatId, 0);
    return new Response("ok");
  }
  let target = null, text = null, via = "s";
  if (cmd === "reply") {
    const m = /^(-?\d+)\s+([\s\S]+)$/.exec(command.arg || "");
    if (!m) {
      await atg(env, "sendMessage", { chat_id: chatId, parse_mode: "HTML", text: "\u21A9\uFE0F Format: <code>/reply 123456789 javob matni</code>\nyoki fikr xabariga Reply qiling." });
      return new Response("ok");
    }
    target = Number(m[1]);
    text = m[2];
  } else if (!command && msg.reply_to_message?.message_id) {
    const r = await (await db(env)).prepare("SELECT chat_id, via FROM feedback_replies_a WHERE admin_msg_id = ?").bind(msg.reply_to_message.message_id).first();
    if (r) {
      target = r.chat_id;
      text = msg.text;
      via = r.via;
    }
  }
  if (target != null && Number.isSafeInteger(target)) {
    const trow = await getChat(env, target);
    const body = tr(trow?.lang || "uz").adminReply(esc(String(text).slice(0, 3500)));
    const res = via === "a" ? await atg(env, "sendMessage", { chat_id: target, text: body, parse_mode: "HTML" }) : await send(env, target, body);
    await atg(env, "sendMessage", { chat_id: chatId, reply_to_message_id: msg.message_id, text: res.ok ? "\u2705 Javob yuborildi." : "\u274C Yuborilmadi (foydalanuvchi botni bloklagan bo'lishi mumkin)." });
    return new Response("ok");
  }
  if (command) {
    await atg(env, "sendMessage", { chat_id: chatId, text: "Buyruqni tanlang \u{1F447}", reply_markup: ADMIN_KB });
    return new Response("ok");
  }
  if (msg.reply_to_message) {
    await atg(env, "sendMessage", { chat_id: chatId, text: "\u21A9\uFE0F Bu xabar fikr-mulohaza emas \u2014 javob hech kimga yuborilmadi." });
    return new Response("ok");
  }
  await startDraft(env, msg);
  return new Response("ok");
}
var BC_STATUS = { queued: "\u23F3 navbatda", sending: "\u{1F4E4} yuborilmoqda", done: "\u2705 yuborildi", cancelled: "\u{1F6AB} bekor qilindi" };
async function sendBcList(env, chatId, editId = null, note = "") {
  const list = await bcRecent(await db(env), 5);
  const when = (ms) => {
    const tn = tashkentNow(ms || 0);
    return `${ymd(tn).slice(8, 10)}.${ymd(tn).slice(5, 7)} ${hhmm(tn.getUTCHours() * 60 + tn.getUTCMinutes())}`;
  };
  const text = list.length ? [
    note || null,
    "\u{1F4CB} <b>So'nggi e'lonlar</b>",
    ...list.map((b) => `
<b>#${b.id}</b> \xB7 ${when(b.created_at)} \xB7 ${b.deleted_at ? "\u{1F5D1} o'chirildi" : BC_STATUS[b.status] || esc(b.status)}
${b.sent}/${b.total} ga yetdi${b.ttl && !b.deleted_at ? ` \xB7 \u23F3 ${b.ttl} soatda o'chadi` : ""}`),
    "\n\u{1F5D1} \u2014 yuborilgan e'lonni hamma chatlardan o'chirish (Telegram faqat 48 soat ichida ruxsat beradi)."
  ].filter((x) => x !== null).join("\n") : "\u{1F4CB} Hali e'lon yuborilmagan.";
  const rows = list.filter((b) => b.deletable).map((b) => [{ text: `\u{1F5D1} #${b.id} ni o'chirish`, callback_data: `bd:${b.id}` }]);
  rows.push([{ text: "\u{1F504} Yangilash", callback_data: "bd:l" }]);
  const body = { chat_id: chatId, text, parse_mode: "HTML", reply_markup: { inline_keyboard: rows } };
  return editId ? atg(env, "editMessageText", { ...body, message_id: editId }) : atg(env, "sendMessage", body);
}
async function onBcListButton(env, cb) {
  const [, id, yes] = String(cb.data).split(":");
  const chatId = cb.message.chat.id, mid = cb.message.message_id;
  if (id === "l" || !/^\d+$/.test(id || "")) return sendBcList(env, chatId, mid);
  const D = await db(env);
  if (yes !== "y") {
    const b = (await bcRecent(D, 20)).find((x) => x.id === Number(id));
    if (!b) return sendBcList(env, chatId, mid);
    return atg(env, "editMessageText", { chat_id: chatId, message_id: mid, parse_mode: "HTML", text: `\u{1F5D1} <b>#${b.id}</b> e'lonini o'chirasizmi?

U <b>${b.ids}</b> ta chatdan o'chiriladi (bir necha daqiqada). Buni qaytarib bo'lmaydi.`, reply_markup: { inline_keyboard: [[{ text: "\u{1F5D1} Ha, o'chirish", callback_data: `bd:${b.id}:y` }], [{ text: "\u21A9\uFE0F Orqaga", callback_data: "bd:l" }]] } });
  }
  const r = await bcDeleteNow(env, D, Number(id));
  const why = { "too old": "48 soatdan oshgan \u2014 Telegram endi o'chirishga ruxsat bermaydi", already: "allaqachon o'chirilgan", "no ids": "bu e'lon yangilanishdan oldin yuborilgan, nusxalari saqlanmagan", "not found": "topilmadi" };
  return sendBcList(env, chatId, mid, r.ok ? `\u2705 #${id} o'chirilmoqda: ${r.n} ta chatdan bir necha daqiqada o'chadi.
` : `\u274C #${id}: ${why[r.error] || r.error}.
`);
}
var FB_PAGE = 3;
async function sendFeedbackPage(env, chatId, offset = 0, editId = null) {
  const D = await db(env);
  offset = Math.max(0, Math.floor(Number(offset) || 0));
  const [{ results }, cnt] = await Promise.all([
    D.prepare("SELECT id, chat_id, name, text, created_at, via FROM feedback ORDER BY id DESC LIMIT ? OFFSET ?").bind(FB_PAGE, offset).all(),
    D.prepare("SELECT COUNT(*) n FROM feedback").first()
  ]);
  const total = cnt?.n || 0;
  const when = (ms) => {
    const tn = tashkentNow(ms || 0);
    return `${ymd(tn).slice(8, 10)}.${ymd(tn).slice(5, 7)} ${hhmm(tn.getUTCHours() * 60 + tn.getUTCMinutes())}`;
  };
  let text, rows = [];
  if (!results.length) {
    text = total ? "\u270D\uFE0F Bundan oldingi fikr yo'q." : "\u270D\uFE0F Hali fikr-mulohaza yo'q.";
  } else {
    text = [
      `\u270D\uFE0F <b>So'nggi fikrlar</b> (${offset + 1}\u2013${offset + results.length} / ${total})`,
      ...results.map((f, i) => `
<b>${offset + i + 1}.</b> ${esc(f.name || "Anonim")} \xB7 <i>${when(f.created_at)}</i>${f.via === "a" ? " \xB7 <i>admin bot</i>" : ""}
${esc(String(f.text).slice(0, 1e3))}${String(f.text).length > 1e3 ? "\u2026" : ""}`),
      "\n\u21A9\uFE0F Javob berish uchun pastdagi tugmani bosing."
    ].join("\n");
    rows.push(results.map((f, i) => ({ text: `\u21A9\uFE0F ${offset + i + 1}-ga javob`, callback_data: `fb:r:${f.id}` })));
  }
  const nav = [];
  if (offset > 0) nav.push({ text: "\u2B05\uFE0F Yangiroqlar", callback_data: `fb:p:${Math.max(0, offset - FB_PAGE)}` });
  if (offset + FB_PAGE < total) nav.push({ text: "Oldingi 3 ta \u27A1\uFE0F", callback_data: `fb:p:${offset + FB_PAGE}` });
  if (nav.length) rows.push(nav);
  const body = { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup: { inline_keyboard: rows } };
  return editId ? atg(env, "editMessageText", { ...body, message_id: editId }) : atg(env, "sendMessage", body);
}
async function onFeedbackButton(env, cb) {
  const [, act, val] = String(cb.data).split(":");
  const chatId = cb.message.chat.id;
  if (act === "p") return sendFeedbackPage(env, chatId, val, cb.message.message_id);
  if (act !== "r" || !/^\d+$/.test(val || "")) return;
  const D = await db(env);
  const f = await D.prepare("SELECT chat_id, name, text, via FROM feedback WHERE id = ?").bind(Number(val)).first();
  if (!f) return atg(env, "sendMessage", { chat_id: chatId, text: "\u231B Bu fikr topilmadi." });
  const excerpt = String(f.text).slice(0, 200) + (String(f.text).length > 200 ? "\u2026" : "");
  const r = await atg(env, "sendMessage", { chat_id: chatId, parse_mode: "HTML", text: `\u21A9\uFE0F <b>${esc(f.name || "Anonim")}</b> ga javobingizni yozing:
<i>\xAB${esc(excerpt)}\xBB</i>`, reply_markup: { force_reply: true, input_field_placeholder: "Javob matni\u2026" } });
  if (r?.ok && r.result?.message_id) await D.prepare("INSERT OR REPLACE INTO feedback_replies_a (admin_msg_id, chat_id, via, created_at) VALUES (?,?,?,?)").bind(r.result.message_id, f.chat_id, f.via === "a" ? "a" : "s", Date.now()).run();
}
var DRAFT_MAX_FILE = 20 * 1024 * 1024;
var AUD_LANG = [["all", "Hammasi"], ["uz", "UZ"], ["ru", "RU"], ["en", "EN"]];
var AUD_ROLE = [["all", "Hammasi"], ["student", "Talaba"], ["teacher", "O'qituvchi"]];
var BC_TTL = [[0, "\u267E Doim"], [1, "1 soat"], [3, "3 soat"], [6, "6 soat"], [12, "12 soat"], [24, "24 soat"]];
var ttlText = (h) => h ? `\u23F3 ${h} soatdan keyin o'chiriladi` : "\u267E Doim turadi (o'chirilmaydi)";
var draftGet = async (env) => JSON.parse((await (await db(env)).prepare("SELECT v FROM admin_state WHERE k = 'bc_draft'").first())?.v || "null");
var draftPut = async (env, d) => (await db(env)).prepare("INSERT OR REPLACE INTO admin_state (k, v) VALUES ('bc_draft', ?)").bind(JSON.stringify(d)).run();
function draftMedia(msg) {
  if (msg.photo?.length) {
    const p = msg.photo[msg.photo.length - 1];
    return { method: "sendPhoto", field: "photo", file: p, name: "photo.jpg", type: "image/jpeg" };
  }
  if (msg.video) return { method: "sendVideo", field: "video", file: msg.video, name: msg.video.file_name || "video.mp4", type: msg.video.mime_type || "video/mp4", extra: { supports_streaming: "true", width: msg.video.width, height: msg.video.height, duration: msg.video.duration } };
  if (msg.animation) return { method: "sendAnimation", field: "animation", file: msg.animation, name: msg.animation.file_name || "animation.mp4", type: msg.animation.mime_type || "video/mp4" };
  if (msg.document) return { method: "sendDocument", field: "document", file: msg.document, name: msg.document.file_name || "file", type: msg.document.mime_type || "application/octet-stream" };
  return null;
}
var lastAlbum = null;
async function startDraft(env, msg) {
  const say = (text, extra = {}) => atg(env, "sendMessage", { chat_id: msg.chat.id, text, parse_mode: "HTML", ...extra });
  if (msg.media_group_id) {
    if (lastAlbum !== msg.media_group_id) {
      lastAlbum = msg.media_group_id;
      await say("\u{1F5BC} Albom (bir nechta rasm/video birga) qo'llab-quvvatlanmaydi. Bitta rasm yoki videoni alohida yuboring.");
    }
    return;
  }
  const media = draftMedia(msg);
  if (!media && !msg.text) return say("\u{1F4E3} E'lon uchun matn, rasm, video, GIF yoki fayl yuboring (forward ham bo'ladi).");
  const adminId = Number(env.ADMIN_CHAT_ID);
  let r;
  if (!media) {
    r = await tg(env, "sendMessage", { chat_id: adminId, text: msg.text.slice(0, 4096), entities: msg.entities, link_preview_options: { is_disabled: true } });
  } else {
    if ((media.file.file_size || 0) > DRAFT_MAX_FILE) return say("\u{1F4E6} Fayl juda katta (20 MB dan oshmasin). Kichikroq video yuboring.");
    const f = await atg(env, "getFile", { file_id: media.file.file_id });
    if (!f?.ok || !f.result?.file_path) return say("\u274C Faylni olib bo'lmadi (20 MB dan katta bo'lishi mumkin).");
    const bin = await fetch(`${tgBase(env)}/file/bot${env.ADMIN_BOT_TOKEN}/${f.result.file_path}`);
    if (!bin.ok) return say("\u274C Faylni yuklab bo'lmadi, qayta urinib ko'ring.");
    const fd = new FormData();
    fd.append("chat_id", String(adminId));
    if (msg.caption) fd.append("caption", msg.caption.slice(0, 1024));
    if (msg.caption_entities) fd.append("caption_entities", JSON.stringify(msg.caption_entities));
    for (const [k, v] of Object.entries(media.extra || {})) if (v != null) fd.append(k, String(v));
    fd.append(media.field, new Blob([await bin.arrayBuffer()], { type: media.type }), media.name);
    const res = await fetch(`${tgBase(env)}/bot${env.BOT_TOKEN}/${media.method}`, { method: "POST", body: fd });
    r = await res.json().catch(() => ({ ok: false }));
  }
  if (!r?.ok || !r.result?.message_id) return say("\u274C Namunani @tdiujadval_bot ga yuborib bo'lmadi. U yerda botni ishga tushirganmisiz (Start)?");
  const d = { id: Math.random().toString(36).slice(2, 8), src: r.result.message_id, kind: media ? media.field : "text", filter: { lang: "all", role: "all", group: "", scope: "all" }, app: true, invite: true, ttl: 0, at: Date.now() };
  await draftPut(env, d);
  await refreshDraftPreview(env, d);
  const panel = await draftPanel(env, d);
  await say(panel.text, { reply_markup: panel.markup });
}
async function refreshDraftPreview(env, d) {
  const mine = await (await db(env)).prepare("SELECT role, group_id FROM chats WHERE chat_id = ?").bind(Number(env.ADMIN_CHAT_ID)).first();
  const m = bcMessage({ texts: {}, app: d.app, invite: d.invite }, { lang: "uz", role: mine?.role, group_id: mine?.group_id }, await bcPick(env));
  await tg(env, "editMessageReplyMarkup", { chat_id: Number(env.ADMIN_CHAT_ID), message_id: d.src, reply_markup: m.markup || { inline_keyboard: [] } });
}
async function draftPanel(env, d, confirm = false) {
  const n = await bcCount(await db(env), bcFilter(d.filter));
  const kinds = { text: "matn", photo: "rasm", video: "video", animation: "GIF", document: "fayl" };
  const name = (list, v) => list.find((x) => x[0] === v)?.[1] || v;
  if (confirm) {
    return { n, text: [
      "\u26A0\uFE0F <b>Tasdiqlang</b>",
      "",
      `\u{1F4E3} E'lon (${kinds[d.kind] || d.kind}) <b>${n}</b> ta shaxsiy chatga yuboriladi.`,
      `\u{1F465} Til: ${name(AUD_LANG, d.filter.lang)} \xB7 Kim: ${name(AUD_ROLE, d.filter.role)}`,
      ttlText(d.ttl || 0),
      "\u{1F6AB} Guruhlarga yuborilmaydi.",
      "",
      "Yuborilgach to'xtatib bo'lmaydi \u2014 faqat hali yetib bormaganlarini bekor qilish mumkin."
    ].join("\n"), markup: { inline_keyboard: [[{ text: `\u2705 Ha, ${n} ta chatga yuborish`, callback_data: `bc:${d.id}:go:${n}` }], [{ text: "\u21A9\uFE0F Orqaga", callback_data: `bc:${d.id}:back` }]] } };
  }
  const pick = (list, key) => list.map(([v, t]) => ({ text: (d.filter[key] === v ? "\u2713 " : "") + t, callback_data: `bc:${d.id}:${key === "lang" ? "l" : "r"}:${v}` }));
  return { n, text: [
    `\u{1F4E3} <b>Yangi e'lon loyihasi</b> (${kinds[d.kind] || d.kind})`,
    "",
    "\u{1F9EA} Namuna @tdiujadval_bot dagi chatingizga yuborildi \u2014 talabalar aynan shuni ko'radi.",
    "",
    `\u{1F465} Qabul qiluvchilar: <b>${n}</b> ta shaxsiy chat`,
    `\u{1F518} Ilova va taklif tugmalari: ${d.app || d.invite ? "bor" : "yo'q"}`,
    ttlText(d.ttl || 0)
  ].join("\n"), markup: { inline_keyboard: [
    pick(AUD_LANG, "lang"),
    pick(AUD_ROLE, "role"),
    ...[BC_TTL.slice(0, 3), BC_TTL.slice(3)].map((row) => row.map(([h, t]) => ({ text: ((d.ttl || 0) === h ? "\u2713 " : "") + t, callback_data: `bc:${d.id}:t:${h}` }))),
    [{ text: `\u{1F518} Tugmalar: ${d.app || d.invite ? "bor \u2713" : "yo'q"}`, callback_data: `bc:${d.id}:btn` }],
    [{ text: "\u27A1\uFE0F Davom etish", callback_data: `bc:${d.id}:ok` }, { text: "\u274C Bekor", callback_data: `bc:${d.id}:x` }]
  ] } };
}
async function onDraftButton(env, cb) {
  const [, id, act, val] = String(cb.data).split(":");
  const chatId = cb.message.chat.id, mid = cb.message.message_id;
  const edit = (text, markup) => atg(env, "editMessageText", { chat_id: chatId, message_id: mid, text, parse_mode: "HTML", reply_markup: markup || { inline_keyboard: [] } });
  const d = await draftGet(env);
  if (!d || d.id !== id || d.done) return edit("\u231B Bu loyiha eskirgan. E'lonni qaytadan yuboring.");
  if (act === "x") {
    d.done = true;
    await draftPut(env, d);
    return edit("\u274C Bekor qilindi. Hech kimga yuborilmadi.");
  }
  if (act === "l" && AUD_LANG.some((x) => x[0] === val)) d.filter.lang = val;
  if (act === "r" && AUD_ROLE.some((x) => x[0] === val)) d.filter.role = val;
  if (act === "btn") {
    d.app = d.invite = !(d.app || d.invite);
    await refreshDraftPreview(env, d);
  }
  if (act === "t" && BC_TTL.some((x) => String(x[0]) === val)) d.ttl = Number(val);
  if (act === "go") {
    const D = await db(env);
    const filter = bcFilter(d.filter);
    const n = await bcCount(D, filter);
    if (!n) return edit("\u{1F465} Bu tanlovda qabul qiluvchi yo'q.", (await draftPanel(env, d)).markup);
    if (Number(val) !== n) {
      const p2 = await draftPanel(env, d, true);
      return edit(`\u26A0\uFE0F Qabul qiluvchilar soni o'zgardi (${n}). Qayta tasdiqlang.

` + p2.text, p2.markup);
    }
    const busy = await D.prepare("SELECT id FROM broadcasts WHERE status IN ('queued','sending') LIMIT 1").first();
    if (busy) return edit(`\u23F3 Boshqa e'lon (#${busy.id}) hali yuborilmoqda. U tugagach qayta tasdiqlang.`, { inline_keyboard: [[{ text: "\u{1F504} Qayta urinish", callback_data: `bc:${d.id}:ok` }]] });
    const payload = { copy: { from_chat_id: Number(env.ADMIN_CHAT_ID), message_id: d.src }, kind: d.kind, texts: {}, photo: null, btn: null, app: d.app, invite: d.invite, ttl: d.ttl || 0 };
    const ins = await D.prepare("INSERT INTO broadcasts (created_at, payload, filter, total) VALUES (?, ?, ?, ?) RETURNING id").bind(Date.now(), JSON.stringify(payload), JSON.stringify(filter), n).first();
    d.done = true;
    await draftPut(env, d);
    await dispatchWorkflow(env);
    return edit(`\u2705 Navbatga qo'yildi: <b>#${ins.id}</b>, ${n} ta chat.
${ttlText(d.ttl || 0)}.
Taxminan 15 daqiqa ichida yuboriladi. Holatini E'lon oynasida ko'rasiz (u yerda bekor qilish ham mumkin).`, { inline_keyboard: [[{ text: "\u{1F4E3} E'lon oynasi", web_app: { url: `${siteUrl(env)}/#tab=admin` } }]] });
  }
  await draftPut(env, d);
  const p = await draftPanel(env, d, act === "ok");
  return edit(p.text, p.markup);
}
var seenUpdates = /* @__PURE__ */ new Set();
async function alreadyHandled(env, id) {
  if (!Number.isSafeInteger(id)) return false;
  if (seenUpdates.has(id)) return true;
  seenUpdates.add(id);
  if (seenUpdates.size > 3e3) for (const x of [...seenUpdates].slice(0, 1e3)) seenUpdates.delete(x);
  return false;
}
async function track(env, update) {
  try {
    const m = update.message, c = update.callback_query;
    const chat = m?.chat || c?.message?.chat;
    if (!chat) return;
    let k = null;
    if (c) {
      const kind = String(c.data || "").split(":")[0];
      k = "cb:" + (/^[A-Za-z]{1,4}$/.test(kind) ? kind : "other");
    } else if (m.text) {
      const cmd = parseCommand(m.text);
      k = cmd ? COUNTED_COMMANDS.has(cmd.cmd) ? cmd.cmd : "other" : BUTTONS[m.text.trim()] || (chat.type === "private" ? isWherePrompt(m.reply_to_message) ? "where" : "text" : null);
    }
    if (!k) return;
    const now = Date.now();
    const D = await db(env);
    const tn = tashkentNow(now), today0 = Date.UTC(tn.getUTCFullYear(), tn.getUTCMonth(), tn.getUTCDate()) - (tn.getTime() - now);
    if (!seenChats.has(chat.id) || seenChats.get(chat.id) < Math.max(today0, now - 3 * 36e5)) {
      await D.prepare("UPDATE chats SET last_seen = ? WHERE chat_id = ? AND (last_seen IS NULL OR last_seen < ?)").bind(now, chat.id, Math.max(today0, now - 3 * 36e5)).run();
      seenChats.set(chat.id, now);
      if (seenChats.size > 2e4) seenChats.clear();
    }
    const key = `${ymd(tn)}|${k}`;
    usageBuf.set(key, (usageBuf.get(key) || 0) + 1);
    if (now - usageFlushedAt > 6e4 || usageBuf.size > 20) await flushUsage(env);
  } catch (e) {
    console.warn("track", e?.message);
  }
}
var seenChats = /* @__PURE__ */ new Map();
var usageBuf = /* @__PURE__ */ new Map();
var usageFlushedAt = Date.now();
async function flushUsage(env) {
  if (!usageBuf.size) return;
  const items = [...usageBuf];
  usageBuf.clear();
  usageFlushedAt = Date.now();
  try {
    const D = await db(env);
    await D.batch(items.map(([dk, n]) => {
      const [day, k] = dk.split("|");
      return D.prepare("INSERT INTO usage (day, k, n) VALUES (?, ?, ?) ON CONFLICT(day, k) DO UPDATE SET n = n + excluded.n").bind(day, k, n);
    }));
  } catch (e) {
    for (const [dk, n] of items) usageBuf.set(dk, (usageBuf.get(dk) || 0) + n);
    console.warn("usage flush", e?.message);
  }
}
var COUNTED_COMMANDS = /* @__PURE__ */ new Set([
  "today",
  "tomorrow",
  "week",
  "settings",
  "start",
  "help",
  "app",
  "group",
  "setgroup",
  "unset",
  "teacher",
  "where",
  "ustoz",
  "find",
  "feedback",
  "time",
  "remind",
  "lang",
  "language",
  "calendar",
  "stats",
  "reply"
]);
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
  where: "\u{1F50E} Ustoz qayerda?",
  ustoz: "\u{1F50E} Ustoz qayerda?",
  text: "\u{1F50E} Nom yozib qidirish",
  feedback: "\u270D\uFE0F Fikr yuborish",
  time: "\u23F0 Eslatma vaqti",
  lang: "\u{1F310} Til",
  setgroup: "\u{1F517} /setgroup (guruhda)"
};
async function sendStats(env, chatId, editId, viaAdminBot = false) {
  await flushUsage(env);
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
  const ghErr = JSON.parse((await D.prepare("SELECT v FROM admin_state WHERE k = 'gh_err'").first().catch(() => null))?.v || "null");
  const n = (v) => v || 0;
  const dm2 = (s) => `${s.slice(8, 10)}.${s.slice(5, 7)}`;
  const feat = (rows) => {
    const list = rows.filter((x) => !x.k.startsWith("cb:") && x.k !== "stats" && x.k !== "reply").slice(0, 6);
    return list.length ? list.map((x, i) => `${i + 1}. ${Object.hasOwn(USAGE_NAMES, x.k) ? USAGE_NAMES[x.k] : "/" + esc(x.k)} \u2014 <b>${x.n}</b>`).join("\n") : "\u2014";
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
    ghErr ? `\u26A0\uFE0F <b>GitHub chaqiruvi ishlamayapti</b>: xato ${ghErr.status} (${hhmm((ghErr.at + 5 * 36e5) % 864e5 / 6e4 | 0)} dan beri)` : null,
    "",
    "<i>Mini App ochilishlari bu yerda hisoblanmaydi (u alohida sayt).</i>"
  ].filter((x) => x !== null);
  const text = lines.join("\n");
  const reply_markup = { inline_keyboard: [[{ text: "\u{1F504} Yangilash", callback_data: "adm:stats" }]] };
  const call = viaAdminBot ? atg : tg;
  if (editId) return call(env, "editMessageText", { chat_id: chatId, message_id: editId, text, parse_mode: "HTML", reply_markup });
  return call(env, "sendMessage", { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup });
}
async function adminMenu(env) {
  if (hasAdminBot(env)) {
    try {
      await tg(env, "deleteMyCommands", { scope: { type: "chat", chat_id: Number(env.ADMIN_CHAT_ID) } });
    } catch {
    }
    return;
  }
  try {
    const cur = await tg(env, "getMyCommands", { scope: { type: "all_private_chats" } });
    const list = (Array.isArray(cur.result) ? cur.result : []).filter((c) => c.command !== "stats" && c.command !== "elon");
    await tg(env, "setMyCommands", { scope: { type: "chat", chat_id: Number(env.ADMIN_CHAT_ID) }, commands: [{ command: "stats", description: "\u{1F4CA} Statistika (faqat siz uchun)" }, { command: "elon", description: "\u{1F4E3} E'lon yuborish (faqat siz uchun)" }, ...list] });
  } catch {
  }
}
function mainKeyboard(env, lang, groupId, role) {
  const L = tr(lang);
  const rows = [[{ text: L.btnToday }, { text: L.btnTomorrow }, { text: L.btnWeek }]];
  if (siteUrl(env)) rows.push(
    [{ text: L.btnWhere }, { text: L.btnFree, web_app: { url: `${siteUrl(env)}/#tab=free&l=${lang}` } }],
    [{ text: L.btnApp, web_app: { url: appUrl(env, groupId, lang, role) } }, { text: L.btnSettings }]
  );
  else rows.push([{ text: L.btnWhere }, { text: L.btnSettings }]);
  return { keyboard: rows, resize_keyboard: true, is_persistent: true };
}
function appUrl(env, groupId, lang, role) {
  return `${siteUrl(env)}/#${groupId ? `${role === "teacher" ? "t" : "g"}=${groupId}&` : ""}l=${lang}`;
}
var BUTTONS = /* @__PURE__ */ Object.create(null);
for (const l of LANGS) {
  BUTTONS[T[l].btnToday] = "today";
  BUTTONS[T[l].btnTomorrow] = "tomorrow";
  BUTTONS[T[l].btnWeek] = "week";
  BUTTONS[T[l].btnSettings] = "settings";
  BUTTONS[T[l].btnWhere] = "where";
}
var WHERE_PROMPTS = new Set(LANGS.map((l) => T[l].whereAsk.replace(/<[^>]+>/g, "").trim()));
var isWherePrompt = (m) => !!(m?.from?.is_bot && WHERE_PROMPTS.has(String(m.text || "").trim()));
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
  if (hasAdminBot(env) && (command?.cmd === "elon" || command?.cmd === "announce" || command?.cmd === "stats")) {
    const name = await adminBotName(env);
    await send(env, msg.chat.id, `\u{1F6E0} Admin ishlari endi alohida botda: ${name ? "@" + name : "admin bot"}`);
    await adminMenu(env);
    return true;
  }
  if (command?.cmd === "elon" || command?.cmd === "announce") {
    if (!siteUrl(env)) return true;
    await send(env, msg.chat.id, "\u{1F4E3} E'lon yuborish oynasi:", { reply_markup: { inline_keyboard: [[{ text: "\u{1F4E3} E'lonni ochish", web_app: { url: `${siteUrl(env)}/#tab=admin` } }]] } });
    await adminMenu(env);
    return true;
  }
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
  const flags = {};
  await privateMain(env, msg, command, flags);
  if (flags.upgrade && !flags.kbSent) await upgradeKeyboard(env, msg.chat.id);
}
async function upgradeKeyboard(env, chatId) {
  const row = await getChat(env, chatId);
  if (!row || (row.kbv | 0) >= KB_VERSION) return;
  await (await db(env)).prepare("UPDATE chats SET kbv = ? WHERE chat_id = ?").bind(KB_VERSION, chatId).run();
  await send(env, chatId, tr(row.lang).whatsNew, { reply_markup: mainKeyboard(env, row.lang, row.group_id, row.role) });
}
async function privateMain(env, msg, command, flags) {
  if (isAdminChat(env, msg.chat.id) && await onAdminReply(env, msg, command)) return;
  const { row, isNew } = await ensureChat(env, msg.chat, msg.from?.language_code);
  if (!isNew && (row.kbv | 0) < KB_VERSION) flags.upgrade = true;
  const lang = row.lang;
  const L = tr(lang);
  const uid = msg.from.id;
  const action = command ? command.cmd : BUTTONS[msg.text.trim()];
  if (!command && !action && isWherePrompt(msg.reply_to_message)) return whereSearch(env, msg.chat.id, lang, msg.text, "private", row);
  if (action === "start") {
    const m = /^g_([a-z0-9]+)$/.exec(command.arg);
    if (m) {
      flags.kbSent = true;
      return chooseGroup(env, msg.chat, uid, m[1], null, lang);
    }
    const mt = /^t_([a-z0-9]+)$/.exec(command.arg);
    if (mt) {
      flags.kbSent = true;
      return chooseTeacher(env, msg.chat, uid, mt[1], null, lang);
    }
    const mw = /^w_([a-z0-9]+)$/.exec(command.arg);
    if (mw) return showWhere(env, msg.chat.id, lang, "private", mw[1]);
    if (siteUrl(env)) await syncMenu(env, msg.chat.id);
    flags.kbSent = true;
    await send(env, msg.chat.id, L.welcome, { reply_markup: mainKeyboard(env, lang, row.group_id, row.role) });
    if (!row.group_id) return askRole(env, msg.chat.id, uid, lang, null, row.role);
    return;
  }
  if (action === "where" || action === "ustoz" || action === "find") {
    if (command?.arg) return whereSearch(env, msg.chat.id, lang, command.arg, "private", row);
    if (await whereList(env, msg.chat.id, lang, row, "private")) return;
    return send(env, msg.chat.id, L.whereAsk, { reply_markup: { force_reply: true, input_field_placeholder: L.whereAskPh, selective: true } });
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
    const recent = await (await db(env)).prepare("SELECT COUNT(*) AS n FROM feedback WHERE chat_id = ? AND created_at > ?").bind(msg.chat.id, Date.now() - 36e5).first();
    if ((recent?.n || 0) >= 5) return send(env, msg.chat.id, L.feedbackLimit);
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
  if (cmd === "where" || cmd === "ustoz") {
    if (!command.arg) {
      if (await whereList(env, msg.chat.id, lang, row, "group", null, msg.message_id)) return;
      return send(env, msg.chat.id, L.whereGroupHint, { reply_to_message_id: msg.message_id });
    }
    return whereSearch(env, msg.chat.id, lang, command.arg, "group", row);
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
    const monday = displayMonday(now);
    const fresh = (!index.weekA || index.imgMonday === ymd(monday)) && !noTimetable(group);
    if (!fresh) return send(env, chatId, fmtWeek(group, index, monday, row.lang), extra);
    const photo = `${siteUrl(env)}/${weekImgPath(isTeacher(row) ? "t" : "g", group.id, row.lang)}?v=${group.v || index.tt?.num || ""}&w=${ymd(monday)}`;
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
  const kb = index.faculties.map((f, i) => [{ text: `\u{1F3DB} ${f.name} \xB7 ${f.courses.reduce((n, c) => n + c.groups.length, 0)}`, callback_data: `f:${uid}:${i}` }]);
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
  let index;
  try {
    index = await getIndex(env);
  } catch {
    return send(env, chatId, L.dataError);
  }
  const fac = index.faculties[fi];
  if (!fac) return showFaculties(env, chatId, uid, lang, messageId);
  if (fac.courses.length === 1) return showGroups(env, chatId, uid, lang, fi, 0, 0, messageId);
  const kb = [];
  for (let i = 0; i < fac.courses.length; i += 2) {
    kb.push(fac.courses.slice(i, i + 2).map((c, j2) => ({ text: `\u{1F393} ${L.course(c.name)} \xB7 ${c.groups.length}`, callback_data: `c:${uid}:${fi}:${i + j2}:0` })));
  }
  kb.push([{ text: L.back, callback_data: `F:${uid}` }]);
  return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text: `\u{1F3DB} <b>${esc(fac.name)}</b>
${L.chooseCourse}`, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
}
var LOOKALIKE = { \u0410: "A", \u0412: "B", \u0415: "E", \u041A: "K", \u041C: "M", \u041D: "H", \u041E: "O", \u0420: "P", \u0421: "C", \u0422: "T", \u0425: "X", \u0423: "Y" };
function dirOf(name) {
  const t = String(name || "").trim();
  let d = ((/^[^\d\-\s/.]+/.exec(t) || [t.split(/[\s-]/)[0]])[0] || "").toUpperCase();
  if (/[A-Z]/.test(d)) d = d.replace(/[АВЕКМНОРСТХУ]/g, (c) => LOOKALIKE[c]);
  return d || "\u2014";
}
function directionsOf(course) {
  const by = /* @__PURE__ */ new Map();
  for (const g of course.groups) {
    const k = dirOf(g[1]);
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(g);
  }
  return [...by].map(([key, groups]) => ({ key, groups }));
}
async function showGroups(env, chatId, uid, lang, fi, ci, page, messageId, di = -1) {
  const L = tr(lang);
  let index;
  try {
    index = await getIndex(env);
  } catch {
    return send(env, chatId, L.dataError);
  }
  const fac = index.faculties[fi];
  const course = fac?.courses[ci];
  if (!course) return showFaculties(env, chatId, uid, lang, messageId);
  page = Math.max(0, page | 0);
  const toCourses = fac.courses.length > 1 ? `f:${uid}:${fi}` : `F:${uid}`;
  const head = `\u{1F3DB} <b>${esc(fac.name)}</b>${course.name ? ` \xB7 ${L.course(course.name)}` : ""}`;
  let dirs = course.groups.length > PAGE ? directionsOf(course) : null;
  if (dirs && (dirs.length < 2 || dirs.length > 16)) dirs = null;
  if (dirs && di < 0 && page === 0) {
    const kb2 = [];
    for (let i = 0; i < dirs.length; i += 3) kb2.push(dirs.slice(i, i + 3).map((d, j2) => ({ text: `${d.key} \xB7 ${d.groups.length}`, callback_data: `d:${uid}:${fi}:${ci}:${i + j2}:0` })));
    kb2.push([{ text: L.back, callback_data: toCourses }]);
    return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text: `${head} \xB7 ${course.groups.length}
${L.chooseDirection}`, parse_mode: "HTML", reply_markup: { inline_keyboard: kb2 } });
  }
  const dir = dirs && di >= 0 ? dirs[di] : null;
  if (dirs && di >= 0 && !dir) return showGroups(env, chatId, uid, lang, fi, ci, 0, messageId);
  const list = dir ? dir.groups : course.groups;
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  page = Math.min(page, pages - 1);
  const slice = list.slice(page * PAGE, page * PAGE + PAGE);
  const go = (p) => dir ? `d:${uid}:${fi}:${ci}:${di}:${p}` : `c:${uid}:${fi}:${ci}:${p}`;
  const kb = [];
  for (let i = 0; i < slice.length; i += 3) {
    kb.push(slice.slice(i, i + 3).map(([id, name]) => ({ text: name, callback_data: `g:${uid}:${id}` })));
  }
  const nav = [{ text: L.back, callback_data: dirs ? `c:${uid}:${fi}:${ci}:0` : toCourses }];
  if (page > 0) nav.push({ text: "\u2B05\uFE0F", callback_data: go(page - 1) });
  if (page + 1 < pages) nav.push({ text: L.more, callback_data: go(page + 1) });
  kb.push(nav);
  const where = `${head}${dir ? ` \xB7 ${esc(dir.key)}` : ""}${pages > 1 ? ` \xB7 ${page + 1}/${pages}` : ""}`;
  return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text: `${where}
${L.chooseGroup}`, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
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
async function myTeachers(env, row) {
  if (!row?.group_id || isTeacher(row)) return [];
  let g, people;
  try {
    [g, people] = await Promise.all([getGroup(env, row.group_id), getPeople(env)]);
  } catch {
    return [];
  }
  const idOf = new Map((people?.teachers || []).map(([id, name]) => [name, id]));
  const by = /* @__PURE__ */ new Map();
  for (const l of g?.lessons || []) {
    for (const name of String(l.t || "").split(", ").map((x) => x.trim()).filter(Boolean)) {
      const id = idOf.get(name);
      if (!id) continue;
      const o = by.get(id) || { id, name, n: 0 };
      o.n++;
      by.set(id, o);
    }
  }
  return [...by.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
}
var teacherButtons = (list) => {
  const kb = [];
  for (let i = 0; i < list.length; i += 2) {
    const pair = list.slice(i, i + 2).map((o) => ({ text: "\u{1F393} " + o.name, callback_data: `wh:${o.id}` }));
    if (pair.length === 2 && pair.some((b) => b.text.length > 26)) kb.push([pair[0]], [pair[1]]);
    else kb.push(pair);
  }
  return kb;
};
async function whereList(env, chatId, lang, row, kind, messageId, replyTo) {
  const L = tr(lang);
  const list = (await myTeachers(env, row)).slice(0, 24);
  if (!list.length) return false;
  const kb = teacherButtons(list);
  if (kind === "private") kb.push([{ text: L.btnWhereOther, callback_data: "whq" }]);
  const text = kind === "private" ? L.whereMine : L.whereMineGroup;
  if (messageId) await tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
  else await send(env, chatId, text, { reply_markup: { inline_keyboard: kb }, ...replyTo ? { reply_to_message_id: replyTo } : {} });
  return true;
}
async function whereSearch(env, chatId, lang, query, kind, row) {
  const L = tr(lang);
  const q = normT(query);
  if (q.length < 2) return send(env, chatId, L.whereNone);
  let people;
  try {
    people = await getPeople(env);
  } catch {
    return send(env, chatId, L.dataError);
  }
  const hits = [];
  for (const [id, name] of people?.teachers || []) {
    if (!/[A-Za-zА-Яа-яЎўҚқҒғҲҳ]{3,}/.test(name)) continue;
    const n = normT(name);
    if (n.includes(q)) hits.push([id, name, n === q ? 0 : n.startsWith(q) ? 1 : 2]);
  }
  if (!hits.length) return send(env, chatId, L.whereNone);
  hits.sort((a, b) => a[2] - b[2] || a[1].localeCompare(b[1]));
  const own = new Set((await myTeachers(env, row)).map((o) => o.id));
  const back = own.size > 0;
  if (hits.length === 1 || hits[0][2] === 0 && hits[1][2] !== 0) return showWhere(env, chatId, lang, kind, hits[0][0], null, back);
  if (own.size) hits.sort((a, b) => (own.has(b[0]) ? 1 : 0) - (own.has(a[0]) ? 1 : 0));
  const top = hits.slice(0, 16);
  const kb = [];
  for (let i = 0; i < top.length; i += 2) kb.push(top.slice(i, i + 2).map(([id, name]) => ({ text: (own.has(id) ? "\u{1F393} " : "\u{1F468}\u200D\u{1F3EB} ") + name, callback_data: `wh:${id}` })));
  return send(env, chatId, L.wherePick, { reply_markup: { inline_keyboard: kb } });
}
async function showWhere(env, chatId, lang, kind, teacherId, messageId, back) {
  const L = tr(lang);
  let index, t;
  try {
    [index, t] = await Promise.all([getIndex(env), getTeacher(env, teacherId)]);
  } catch {
    return send(env, chatId, L.dataError);
  }
  if (!t) return send(env, chatId, L.whereNone);
  const text = fmtWhere({ ...t, kind: "t" }, index, tashkentNow(), lang);
  const rows = [[{ text: L.btnRefresh, callback_data: `wh:${teacherId}` }]];
  if (back) rows.push([{ text: L.btnWhereBack, callback_data: "whm" }]);
  if (siteUrl(env)) {
    if (kind === "private") rows.push([{ text: L.btnWhereApp, web_app: { url: `${siteUrl(env)}/#w=${teacherId}&l=${lang}` } }]);
    else {
      const name = await getBotName(env);
      if (name) rows.push([{ text: L.btnWhereApp, url: `https://t.me/${name}?start=w_${teacherId}` }]);
    }
  }
  const reply_markup = { inline_keyboard: rows };
  if (messageId) return tg(env, "editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup });
  return send(env, chatId, text, { reply_markup });
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
  const top = hits.slice(0, PAGE);
  const kb = [];
  for (let i = 0; i < top.length; i += 3) kb.push(top.slice(i, i + 3).map(([id, name]) => ({ text: name, callback_data: `g:${uid}:${id}` })));
  return send(env, chatId, `\u{1F50E} ${L.found}${hits.length > top.length ? ` ${top.length}/${hits.length}` : ""}`, { reply_markup: { inline_keyboard: kb } });
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
  await setRemindAt(env, chatId, m);
  return send(env, chatId, L.remindSet(m));
}
async function setRemindAt(env, chatId, m) {
  const tn = tashkentNow();
  const fields = { remind_at: m };
  if (m >= 0 && m <= tn.getUTCHours() * 60 + tn.getUTCMinutes()) fields.sent_tmr = ymd(tn);
  await updateChat(env, chatId, fields);
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
    const LW = lw(row.lang);
    kb.inline_keyboard.splice(2, 0, [{ text: LW.setLr(!!row.lr), callback_data: "s:lr" }], [{ text: LW.setDe(!!row.de), callback_data: "s:de" }]);
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
async function onEphemeralButton(env, cb, row, parts) {
  const msg = cb.message, chatId = msg.chat.id, lang = row?.lang || "uz";
  if (msg.chat.type !== "private" || !row) return;
  const LW = lw(lang);
  const paras = paragraphs(String(msg.text || ""), msg.entities || []);
  const keyOf = () => (msg.reply_markup?.inline_keyboard || []).flat().map((b) => /^jk:(\w+)$/.exec(b.callback_data || "")?.[1]).find(Boolean) || null;
  const edit = (html, reply_markup) => tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: html, parse_mode: "HTML", reply_markup });
  if (parts[0] === "jk") {
    const key = parts[1];
    const list = jokePool(key);
    if (!list.length || isTeacherKey(key) !== (row.role === "teacher")) return;
    const i = paras.findIndex((p) => list.some((e) => textOf(e, lang) === p.text.trim()));
    if (i < 0) return;
    const next = nextJoke(key, paras[i].text.trim(), lang);
    if (!next) return;
    paras[i] = { text: next, html: jokeHtml(next) };
    return edit(paras.map((p) => p.html).join("\n\n"), msg.reply_markup);
  }
  const kind = parts[0], act = parts[1];
  const offLine = kind === "lr" ? LW.offLr : LW.offDe, onLine = kind === "lr" ? LW.onLr : LW.onDe;
  const base = paras.filter((p) => p.text !== offLine && p.text !== onLine).map((p) => p.html).join("\n\n");
  if (act === "off") {
    await updateChat(env, chatId, { [kind]: 0 });
    const key = keyOf();
    return edit(`${base}

${esc(offLine)}`, { inline_keyboard: [[{ text: LW.back, callback_data: `${kind}:on${key ? ":" + key : ""}` }]] });
  }
  if (act === "on") {
    await updateChat(env, chatId, { [kind]: 1 });
    const key = parts[2] && jokeList(parts[2]) ? parts[2] : null;
    const row1 = [{ text: LW.off, callback_data: `${kind}:off` }];
    if (key) row1.push({ text: LW.more, callback_data: `jk:${key}` });
    return edit(`${base}

${esc(onLine)}`, { inline_keyboard: [row1] });
  }
}
var recentTaps = /* @__PURE__ */ new Map();
function repeatedTap(chatId, messageId, data) {
  const k = `${chatId}:${messageId}:${data}`, now = Date.now();
  const last = recentTaps.get(k);
  if (recentTaps.size > 500) recentTaps.clear();
  recentTaps.set(k, now);
  return last != null && now - last < 6e3;
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
  if (["f", "c", "d", "F", "g", "R", "RM", "tL", "tl", "tp"].includes(kind)) {
    const uid = Number(parts[1]);
    if (uid === 0 ? !await isAdmin(env, chatId, cb) : uid !== cb.from.id) {
      return tg(env, "answerCallbackQuery", { callback_query_id: cb.id, text: uid === 0 ? L.onlyAdmins : L.notYourMenu, show_alert: true });
    }
  }
  if (isGroupChat && (kind === "s" || kind === "lang" || kind === "rt") && !await isAdmin(env, chatId, cb)) {
    return tg(env, "answerCallbackQuery", { callback_query_id: cb.id, text: L.onlyAdmins, show_alert: true });
  }
  tg(env, "answerCallbackQuery", { callback_query_id: cb.id });
  if ((kind === "g" || kind === "tp") && repeatedTap(chatId, msg.message_id, cb.data)) return;
  if (kind === "lr" || kind === "de" || kind === "jk") return onEphemeralButton(env, cb, row, parts);
  if (kind === "adm") {
    if (isAdminChat(env, chatId)) await sendStats(env, chatId, msg.message_id);
    return;
  }
  if (kind === "lang") {
    const newLang = LANGS.includes(parts[1]) ? parts[1] : "uz";
    await updateChat(env, chatId, { lang: newLang });
    const L2 = tr(newLang);
    if (parts[2] === "pick") return showFaculties(env, chatId, asUid(parts[3]), newLang, msg.message_id);
    if (parts[2] === "tpick") return showTeacherLetters(env, chatId, asUid(parts[3]), newLang, msg.message_id);
    if (parts[2] === "role") return askRole(env, chatId, asUid(parts[3]), newLang, msg.message_id, row.role);
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
    await setRemindAt(env, chatId, m);
    return tg(env, "editMessageText", { chat_id: chatId, message_id: msg.message_id, text: L.remindSet(m), parse_mode: "HTML" });
  }
  if (kind === "wh" && !validId(parts[1])) return;
  if (kind === "wh") return showWhere(env, chatId, lang, isGroupChat ? "group" : "private", parts[1], msg.message_id, (await myTeachers(env, row)).length > 0);
  if (kind === "whm") {
    if (!await whereList(env, chatId, lang, row, isGroupChat ? "group" : "private", msg.message_id)) return send(env, chatId, L.whereGroupHint);
    return;
  }
  if (kind === "whq") return send(env, chatId, L.whereAsk, { reply_markup: { force_reply: true, input_field_placeholder: L.whereAskPh, selective: true } });
  if (kind === "day") {
    if (!row.group_id) return;
    return onDayTab(env, row, msg, Number(parts[1]), Number(parts[2]));
  }
  if (kind === "wk") {
    if (!row.group_id) return;
    return sendSchedule(env, chatId, row, "week");
  }
  if (kind === "F") return showFaculties(env, chatId, asUid(parts[1]), lang, msg.message_id);
  if (kind === "f") return showCourses(env, chatId, asUid(parts[1]), lang, Number(parts[2]), msg.message_id);
  if (kind === "c") return showGroups(env, chatId, asUid(parts[1]), lang, Number(parts[2]), Number(parts[3]), Number(parts[4]), msg.message_id);
  if (kind === "d") return showGroups(env, chatId, asUid(parts[1]), lang, Number(parts[2]), Number(parts[3]), Number(parts[5]) || 0, msg.message_id, Number(parts[4]));
  if (kind === "g") return chooseGroup(env, chat, Number(parts[1]), parts[2], msg.message_id, lang);
  if (["R", "RM", "tL", "tl", "tp"].includes(kind)) {
    if (isGroupChat) return;
    if (kind === "R") {
      const role = parts[2] === "t" ? "teacher" : "student";
      await setRole(env, chatId, row, role);
      return role === "teacher" ? showTeacherLetters(env, chatId, asUid(parts[1]), lang, msg.message_id) : showFaculties(env, chatId, asUid(parts[1]), lang, msg.message_id);
    }
    if (kind === "RM") return askRole(env, chatId, asUid(parts[1]), lang, msg.message_id, row.role);
    if (kind === "tL") return showTeacherLetters(env, chatId, asUid(parts[1]), lang, msg.message_id);
    if (kind === "tl") return showTeachers(env, chatId, asUid(parts[1]), lang, parts[2], Math.max(0, Number(parts[3]) | 0), msg.message_id);
    return chooseTeacher(env, chat, Number(parts[1]), parts[2], msg.message_id, lang);
  }
  if (kind === "s") {
    const what = parts[1];
    if ((what === "lr" || what === "de") && chat.type === "private") {
      const val = row[what] ? 0 : 1;
      await updateChat(env, chatId, { [what]: val });
      return showSettings(env, chatId, { ...row, [what]: val }, msg.message_id);
    }
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
