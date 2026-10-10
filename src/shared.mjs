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
    welcome: "Assalomu alaykum! 👋\nMen <b>TDIU Jadval</b> botiman.\n\n• Talaba va o'qituvchilar jadvalini ko'rsataman\n• Jadval o'zgarsa darhol xabar beraman\n• Bo'sh xonalarni qidiraman\n• Ustoz hozir qaysi xonada ekanini aytaman\n\nBoshlash uchun kim ekaningizni tanlang 👇",
    chooseFaculty: '🏛 Fakultetni tanlang:',
    chooseCourse: '🎓 Kursni tanlang:',
    chooseGroup: '👥 Guruhni tanlang:',
    course: (n) => (n ? `${n}-kurs` : 'Boshqa'),
    searchHint: '💡 Yoki guruh nomini yozing, masalan: <code>MO-901</code>',
    groupSet: (g) => `✅ Guruh saqlandi: <b>${g}</b>`,
    groupSetChat: (g, m = 1260) => `✅ Bu chat <b>${g}</b> guruhiga ulandi.\n\n🌙 Har kuni soat <b>${hhmm(m)}</b> da ertangi darslar yuboriladi (vaqtni admin /time bilan o'zgartiradi).\n🗓 Har yakshanba kechqurun haftalik jadval, jadval o'zgarsa darhol xabar beriladi.`,
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
    btnWhere: '🔎 Ustoz qayerda?',
    whereAsk: "🔎 Ustoz qayerda?\nO'qituvchining familiyasini yozing 👇",
    whereAskPh: 'Karimov',
    whereNone: "Bunday ustoz topilmadi. Familiyani tekshiring, masalan: Karimov",
    wherePick: '🔎 Topildi — qaysi ustoz?',
    whereGroupHint: '🔎 Ustoz qayerda? Familiyani yozing: <code>/where Karimov</code>',
    btnRefresh: '🔄 Yangilash',
    btnWhereApp: '📱 Ilovada ochish',
    whatsNew: "🆕 <b>Yangilik!</b>\n\n🔎 <b>Ustoz qayerda?</b> — o'qituvchining hozir qaysi xonada ekanini, keyingi darsi qachon va qayerda ekanini bilib oling.\n\nTugma pastdagi menyuga qo'shildi 👇",
    thisWeekShort: 'Shu hafta',
    nextWeekShort: 'Keyingi hafta',
    btnOpenInApp: '📱 Ilovada ochish',
    weekTitle: (g, range) => `🗓 <b>Haftalik jadval</b> — ${g}\n<i>${range}</i>`,
    changedTitle: (g) => `⚠️ <b>Jadval o'zgardi</b> — ${g}`,
    newTTTitle: (g) => `🆕 <b>Yangi jadval e'lon qilindi</b> — ${g}`,
    weekA: 'Yuqori hafta',
    weekB: 'Quyi hafta',
    onlyAdmins: "Faqat chat adminlari buni o'zgartira oladi.",
    notYourMenu: "Bu menyu sizga tegishli emas.",
    addedToGroup: "Salom! 👋 Men dars jadvali botiman.\n\nChat admini /setgroup yuborib guruhni tanlasin — shundan so'ng har kuni kechqurun ertangi darslar, haftalik jadval va o'zgarishlar shu yerga yuboriladi.",
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
    help: "<b>Buyruqlar</b>\n/today — bugungi darslar\n/tomorrow — ertangi darslar\n/week — haftalik jadval\n/group — guruhni tanlash (talaba)\n/where — ustoz qayerda? (masalan: /where Karimov)\n/teacher — o'qituvchi sifatida kirish\n/settings — sozlamalar\n/time — ertangi dars eslatmasi vaqti\n/app — ilovani ochish\n/feedback — taklif yoki xato yuborish\n\n<b>Guruh chatida</b>\n/setgroup — chatni guruhga ulash (admin)\n/unset — uzish (admin)\n/time — ertangi dars eslatmasi vaqti (admin)",
    dataError: "Jadvalni yuklab bo'lmadi, birozdan so'ng qayta urinib ko'ring.",
    now: 'Hozir',
    btnInvite: "📤 Do'stlarni taklif qilish",
    inviteCaption: (g, n) => n > 0
      ? `🎉 <b>${g}</b> guruhidan yana ${n} kishi botdan foydalanmoqda!\n\nGuruhdoshlaringizni ham taklif qiling 👇`
      : "👋 Guruhdoshlaringizni ham taklif qiling — ularga ham qulay bo'ladi!",
    inviteShareText: (g) => `TDIU Jadval — ${g} guruhi jadvalini ko'rsatadi va o'zgarsa darhol xabar beradi. Sinab ko'ring:`,
    groupChatTip: "💡 <b>Maslahat:</b> botni guruh chatingizga ham qo'shing — u yerda /setgroup yuborsangiz, butun guruhga avtomatik xabar boradi.",
    feedbackPrompt: "✍️ Taklif yoki xatoni yozing:\n<code>/feedback Xona nomi noto'g'ri ko'rsatilyapti</code>",
    feedbackThanks: '✅ Rahmat! Xabaringiz qabul qilindi.',
    adminReply: (t) => `💬 <b>TDIU Jadval jamoasidan javob:</b>\n\n${t}`,
    setRemind: (m) => `🌙 Ertangi darslar eslatmasi: ${m < 0 ? "o'chirilgan" : 'har kuni ' + hhmm(m)}`,
    remindTitle: '🌙 <b>Ertangi darslar eslatmasi</b>\nQaysi vaqtda yuborilsin? (Toshkent vaqti)\n\nBoshqa vaqt uchun yozing: <code>/time 20:30</code>',
    remindSet: (m) => (m < 0 ? "🔕 Ertangi darslar eslatmasi o'chirildi. Qayta yoqish: /time" : `✅ Har kuni soat <b>${hhmm(m)}</b> da ertangi darslar yuboriladi.`),
    remindBad: "❓ Vaqtni shunday yozing: <code>/time 21:00</code> (o'chirish: <code>/time off</code>)",
    btnRemindOff: "🔕 O'chirish",
    btnFeedback: '✍️ Taklif yoki xato yuborish',
    askRole: '👤 Siz kimsiz?',
    btnStudent: '🎓 Talaba',
    btnTeacher: "👨‍🏫 O'qituvchi",
    chooseTeacher: "👨‍🏫 O'qituvchini tanlang: familiyasining birinchi harfini bosing.",
    teacherSearchHint: '💡 Yoki familiyangizni yozing, masalan: <code>Karimov</code>',
    teacherSet: (n) => `✅ O'qituvchi saqlandi: <b>${n}</b>`,
    noTeacher: "Siz hali o'qituvchi sifatida tanlanmagansiz. /teacher buyrug'ini yuboring.",
    teacherNotFound: "O'qituvchi topilmadi. Familiyani tekshiring, masalan: Karimov",
    setTeacher: (n) => `👨‍🏫 O'qituvchi: ${n || '—'}`,
    btnRole: "🔄 Talaba / O'qituvchi",
    teacherTip: "🔔 Jadvalingiz o'zgarsa, shu yerga darhol yozaman. Xabarlarni Sozlamalarda boshqarishingiz mumkin.",
    btnCalendar: '📅 Kalendar',
    calendarInfo: (url) => `📅 <b>Kalendarga obuna bo'ling</b>\n\nQuyidagi havolani telefon yoki kompyuteringizdagi kalendar ilovasiga qo'shsangiz, jadval u yerda avtomatik yangilanib turadi.\n\n<b>iPhone (Apple Calendar):</b> havolani oching → "Obuna bo'lish" tugmasini bosing.\n<b>Google Calendar:</b> Sozlamalar → "Boshqa kalendarlar qo'shish" → "URL orqali" → havolani joylashtiring.\n\n<code>${esc(url)}</code>`,
  },
  ru: {
    days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    daysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    langName: '🇷🇺 Русский',
    chooseLang: 'Tilni tanlang / Выберите язык / Choose language',
    welcome: 'Здравствуйте! 👋\nЯ <b>TDIU Jadval</b> — бот расписания ТГЭУ.\n\n• Показываю расписание студентов и преподавателей\n• Сразу сообщаю об изменениях\n• Ищу свободные аудитории\n• Подскажу, в какой аудитории сейчас преподаватель\n\nДля начала выберите, кто вы 👇',
    chooseFaculty: '🏛 Выберите факультет:',
    chooseCourse: '🎓 Выберите курс:',
    chooseGroup: '👥 Выберите группу:',
    course: (n) => (n ? `${n} курс` : 'Другое'),
    searchHint: '💡 Или напишите название группы, например: <code>MO-901</code>',
    groupSet: (g) => `✅ Группа сохранена: <b>${g}</b>`,
    groupSetChat: (g, m = 1260) => `✅ Этот чат привязан к группе <b>${g}</b>.\n\n🌙 Каждый день в <b>${hhmm(m)}</b> я буду присылать пары на завтра (время меняет админ командой /time).\n🗓 Каждое воскресенье вечером — расписание на неделю, а при изменениях — уведомление.`,
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
    btnWhere: '🔎 Где препод?',
    whereAsk: '🔎 Где преподаватель?\nНапишите фамилию преподавателя 👇',
    whereAskPh: 'Karimov',
    whereNone: 'Преподаватель не найден. Проверьте фамилию, например: Karimov',
    wherePick: '🔎 Найдено — какой преподаватель?',
    whereGroupHint: '🔎 Где преподаватель? Напишите фамилию: <code>/where Karimov</code>',
    btnRefresh: '🔄 Обновить',
    btnWhereApp: '📱 Открыть в приложении',
    whatsNew: '🆕 <b>Новинка!</b>\n\n🔎 <b>Где преподаватель?</b> — узнайте, в какой аудитории преподаватель сейчас, а также когда и где его следующая пара.\n\nКнопка появилась в меню внизу 👇',
    thisWeekShort: 'Эта неделя',
    nextWeekShort: 'След. неделя',
    btnOpenInApp: '📱 Открыть в приложении',
    weekTitle: (g, range) => `🗓 <b>Расписание на неделю</b> — ${g}\n<i>${range}</i>`,
    changedTitle: (g) => `⚠️ <b>Расписание изменилось</b> — ${g}`,
    newTTTitle: (g) => `🆕 <b>Опубликовано новое расписание</b> — ${g}`,
    weekA: 'Верхняя неделя',
    weekB: 'Нижняя неделя',
    onlyAdmins: 'Это могут менять только админы чата.',
    notYourMenu: 'Это меню не для вас.',
    addedToGroup: 'Привет! 👋 Я бот расписания.\n\nАдмин чата, отправьте /setgroup и выберите группу — после этого сюда будут приходить пары на завтра (каждый вечер), расписание на неделю и изменения.',
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
    help: '<b>Команды</b>\n/today — пары на сегодня\n/tomorrow — пары на завтра\n/week — расписание на неделю\n/where — где преподаватель? (например: /where Karimov)\n/group — выбрать группу (студент)\n/teacher — войти как преподаватель\n/settings — настройки\n/time — время напоминания о парах на завтра\n/app — открыть приложение\n/feedback — отправить отзыв или сообщить об ошибке\n\n<b>В чате группы</b>\n/setgroup — привязать чат к группе (админ)\n/unset — отвязать (админ)\n/time — время напоминания о парах на завтра (админ)',
    dataError: 'Не удалось загрузить расписание, попробуйте чуть позже.',
    now: 'Сейчас',
    btnInvite: '📤 Пригласить друзей',
    inviteCaption: (g, n) => n > 0
      ? `🎉 Ещё ${n} человек из группы <b>${g}</b> уже пользуются ботом!\n\nПригласите и своих одногруппников 👇`
      : 'Пригласите своих одногруппников — им тоже будет удобно!',
    inviteShareText: (g) => `TDIU Jadval — показывает расписание группы ${g} и сразу сообщает об изменениях. Попробуйте:`,
    groupChatTip: '💡 <b>Совет:</b> добавьте бота и в чат вашей группы — отправьте там /setgroup, и уведомления будут приходить всей группе автоматически.',
    feedbackPrompt: "✍️ Напишите отзыв или опишите ошибку:\n<code>/feedback Неверно указана аудитория</code>",
    feedbackThanks: '✅ Спасибо! Ваше сообщение получено.',
    adminReply: (t) => `💬 <b>Ответ команды TDIU Jadval:</b>\n\n${t}`,
    setRemind: (m) => `🌙 Напоминание о парах на завтра: ${m < 0 ? 'выкл' : 'каждый день в ' + hhmm(m)}`,
    remindTitle: '🌙 <b>Напоминание о парах на завтра</b>\nВо сколько присылать? (время Ташкента)\n\nДругое время: <code>/time 20:30</code>',
    remindSet: (m) => (m < 0 ? '🔕 Напоминание о парах на завтра выключено. Включить снова: /time' : `✅ Каждый день в <b>${hhmm(m)}</b> буду присылать пары на завтра.`),
    remindBad: '❓ Напишите время так: <code>/time 21:00</code> (выключить: <code>/time off</code>)',
    btnRemindOff: '🔕 Выключить',
    btnFeedback: '✍️ Отзыв или ошибка',
    askRole: '👤 Кто вы?',
    btnStudent: '🎓 Студент',
    btnTeacher: '👨‍🏫 Преподаватель',
    chooseTeacher: '👨‍🏫 Выберите преподавателя: нажмите первую букву фамилии.',
    teacherSearchHint: '💡 Или напишите фамилию, например: <code>Karimov</code>',
    teacherSet: (n) => `✅ Преподаватель сохранён: <b>${n}</b>`,
    noTeacher: 'Вы ещё не выбрали себя как преподавателя. Отправьте /teacher.',
    teacherNotFound: 'Преподаватель не найден. Проверьте фамилию, например: Karimov',
    setTeacher: (n) => `👨‍🏫 Преподаватель: ${n || '—'}`,
    btnRole: '🔄 Студент / Преподаватель',
    teacherTip: '🔔 Если ваше расписание изменится, я сразу напишу сюда. Уведомлениями можно управлять в настройках.',
    btnCalendar: '📅 Календарь',
    calendarInfo: (url) => `📅 <b>Подпишитесь на календарь</b>\n\nДобавьте эту ссылку в календарь на телефоне или компьютере — расписание будет обновляться там само.\n\n<b>iPhone (Apple Calendar):</b> откройте ссылку → нажмите «Подписаться».\n<b>Google Calendar:</b> Настройки → «Добавить календарь» → «По URL» → вставьте ссылку.\n\n<code>${esc(url)}</code>`,
  },
  en: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    langName: '🇬🇧 English',
    chooseLang: 'Tilni tanlang / Выберите язык / Choose language',
    welcome: "Hi! 👋\nI'm <b>TDIU Jadval</b>, the TSUE timetable bot.\n\n• I show student and teacher timetables\n• I tell you right away when it changes\n• I can find free rooms\n• I can tell where a teacher is right now\n\nTo start, tell me who you are 👇",
    chooseFaculty: '🏛 Choose your faculty:',
    chooseCourse: '🎓 Choose your year:',
    chooseGroup: '👥 Choose your group:',
    course: (n) => (n ? `Year ${n}` : 'Other'),
    searchHint: '💡 Or type your group name, e.g. <code>MO-901</code>',
    groupSet: (g) => `✅ Group saved: <b>${g}</b>`,
    groupSetChat: (g, m = 1260) => `✅ This chat is now linked to <b>${g}</b>.\n\n🌙 Every day at <b>${hhmm(m)}</b> I'll post tomorrow's classes (an admin can change the time with /time).\n🗓 Every Sunday evening the week's timetable, and an alert whenever it changes.`,
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
    btnWhere: '🔎 Find a teacher',
    whereAsk: "🔎 Where is the teacher?\nType the teacher's surname 👇",
    whereAskPh: 'Karimov',
    whereNone: 'Teacher not found. Check the surname, e.g. Karimov',
    wherePick: '🔎 Found — which teacher?',
    whereGroupHint: '🔎 Where is the teacher? Type the surname: <code>/where Karimov</code>',
    btnRefresh: '🔄 Refresh',
    btnWhereApp: '📱 Open in app',
    whatsNew: "🆕 <b>New!</b>\n\n🔎 <b>Find a teacher</b> — see which room a teacher is in right now, and when and where their next class is.\n\nThe button is now in the menu below 👇",
    thisWeekShort: 'This week',
    nextWeekShort: 'Next week',
    btnOpenInApp: '📱 Open in app',
    weekTitle: (g, range) => `🗓 <b>Weekly timetable</b> — ${g}\n<i>${range}</i>`,
    changedTitle: (g) => `⚠️ <b>Timetable changed</b> — ${g}`,
    newTTTitle: (g) => `🆕 <b>New timetable published</b> — ${g}`,
    weekA: 'Upper week',
    weekB: 'Lower week',
    onlyAdmins: 'Only chat admins can change this.',
    notYourMenu: 'This menu is not for you.',
    addedToGroup: "Hi! 👋 I'm the timetable bot.\n\nA chat admin should send /setgroup and pick the group. After that I'll post tomorrow's classes every evening, plus the weekly timetable and changes.",
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
    help: '<b>Commands</b>\n/today — today\'s classes\n/tomorrow — tomorrow\'s classes\n/week — weekly timetable\n/where — find a teacher (e.g. /where Karimov)\n/group — choose group (student)\n/teacher — sign in as a teacher\n/settings — settings\n/time — reminder time for tomorrow\'s classes\n/app — open the app\n/feedback — send feedback or report a bug\n\n<b>In a group chat</b>\n/setgroup — link chat to a group (admin)\n/unset — unlink (admin)\n/time — reminder time for tomorrow\'s classes (admin)',
    dataError: "Couldn't load the timetable, please try again in a moment.",
    now: 'Now',
    btnInvite: '📤 Invite friends',
    inviteCaption: (g, n) => n > 0
      ? `🎉 ${n} more people from <b>${g}</b> already use the bot!\n\nInvite your groupmates too 👇`
      : 'Invite your groupmates too — it\'ll be handy for them as well!',
    inviteShareText: (g) => `TDIU Jadval — shows ${g}'s timetable and tells you right away when it changes. Try it:`,
    groupChatTip: '💡 <b>Tip:</b> add the bot to your group chat too — send /setgroup there and the whole group gets updates automatically.',
    feedbackPrompt: "✍️ Write your feedback or describe the bug:\n<code>/feedback The room number is shown wrong</code>",
    feedbackThanks: '✅ Thanks! Your message has been received.',
    adminReply: (t) => `💬 <b>Reply from the TDIU Jadval team:</b>\n\n${t}`,
    setRemind: (m) => `🌙 Tomorrow's-classes reminder: ${m < 0 ? 'off' : 'every day at ' + hhmm(m)}`,
    remindTitle: "🌙 <b>Tomorrow's-classes reminder</b>\nWhat time should I send it? (Tashkent time)\n\nOther time: <code>/time 20:30</code>",
    remindSet: (m) => (m < 0 ? "🔕 Tomorrow's-classes reminder turned off. Turn it on again: /time" : `✅ I'll send tomorrow's classes every day at <b>${hhmm(m)}</b>.`),
    remindBad: '❓ Write the time like this: <code>/time 21:00</code> (turn off: <code>/time off</code>)',
    btnRemindOff: '🔕 Turn off',
    btnFeedback: '✍️ Send feedback',
    askRole: '👤 Who are you?',
    btnStudent: '🎓 Student',
    btnTeacher: '👨‍🏫 Teacher',
    chooseTeacher: '👨‍🏫 Choose the teacher: tap the first letter of the surname.',
    teacherSearchHint: '💡 Or type the surname, e.g. <code>Karimov</code>',
    teacherSet: (n) => `✅ Teacher saved: <b>${n}</b>`,
    noTeacher: "You haven't picked yourself as a teacher yet. Send /teacher.",
    teacherNotFound: 'Teacher not found. Check the surname, e.g. Karimov',
    setTeacher: (n) => `👨‍🏫 Teacher: ${n || '—'}`,
    btnRole: '🔄 Student / Teacher',
    teacherTip: "🔔 If your timetable changes, I'll message you here right away. You can manage alerts in Settings.",
    btnCalendar: '📅 Calendar',
    calendarInfo: (url) => `📅 <b>Subscribe to your calendar</b>\n\nAdd this link to your phone or computer's calendar app, and the timetable will keep itself up to date there.\n\n<b>iPhone (Apple Calendar):</b> open the link → tap "Subscribe".\n<b>Google Calendar:</b> Settings → "Add calendar" → "From URL" → paste the link.\n\n<code>${esc(url)}</code>`,
  },
};

export const tr = (lang) => T[lang] || T.uz;

/** Minutes after midnight → "21:00". */
export function hhmm(m) {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
/** "21", "21:00", "9.30", "off" → minutes after midnight (-1 = off); null when it isn't a time. */
export function parseClock(s) {
  const t = String(s || '').trim().toLowerCase();
  if (/^(off|0ff|o'chir|ochir|выкл|нет|no)$/.test(t)) return -1;
  const m = /^(\d{1,2})(?:\s*[:.\-]\s*(\d{2}))?$/.exec(t);
  if (!m) return null;
  const h = Number(m[1]);
  const mi = m[2] == null ? 0 : Number(m[2]);
  return h > 23 || mi > 59 ? null : h * 60 + mi;
}

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
    finish: (t) => `🏁 Darslar ${t} da tugaydi`, moved: '🔁 Vaqti o‘zgardi', roomCh: '🚪 Xona o‘zgardi', teachCh: '👤 O‘qituvchi o‘zgardi', groupCh: '👥 Guruhlar o‘zgardi',
    removed: '❌ Bekor qilindi', added: '➕ Yangi dars', wkCap: (g, r, n) => `🗓 <b>${g}</b> — haftalik jadval\n${r} · ${n} ta dars`,
    lessonsWeek: 'Haftalik jadval', freeWeek: "Bu hafta dars yo'q 🎉", seeApp: '📱 Batafsil — ilovada',
    h: (m) => (m >= 60 ? `${Math.floor(m / 60)} soat${m % 60 ? ' ' + (m % 60) + ' daqiqa' : ''}` : `${m} daqiqa`),
    wh: { now: '🟢 <b>Hozir darsda</b>', between: "🟡 <b>Hozir dars yo'q</b>", before: '⏳ <b>Bugungi dars hali boshlanmagan</b>', after: '🏁 <b>Bugungi darslar tugagan</b>', off: "⚪ <b>Bugun dars yo'q</b>",
      until: (t, left) => `⏱ ${t} gacha — ${left} qoldi`, next: '⏭ <b>Keyingi dars</b>', inM: (d) => `${d}dan so'ng`, tomorrow: 'Ertaga', today: (c) => `🗓 <b>Bugungi tartib</b> · ${c}`,
      noRoom: "xona ko'rsatilmagan", note: "ℹ️ Rasmiy dars jadvali asosida — kutilmagan o'zgarishlar bo'lishi mumkin." } },
  ru: { lecture: 'Лекция', seminar: 'Семинар', lab: 'Лабораторная', practice: 'Практика', bld: (b) => `корпус ${b}`, room: (r) => `ауд. ${r}`,
    count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'пара' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'пары' : 'пар'}`, pair: (n) => `${n} пара`,
    now: '🟢 Сейчас', next: '⏭ Следующая', brk: (m) => `☕ перерыв ${m} мин`, finish: (t) => `🏁 Пары закончатся в ${t}`,
    moved: '🔁 Изменилось время', roomCh: '🚪 Изменилась аудитория', teachCh: '👤 Изменился преподаватель', groupCh: '👥 Изменились группы', removed: '❌ Отменено', added: '➕ Новая пара',
    wkCap: (g, r, n) => `🗓 <b>${g}</b> — расписание на неделю\n${r} · ${n} пар`, lessonsWeek: 'Расписание на неделю', freeWeek: 'На этой неделе пар нет 🎉', seeApp: '📱 Подробнее — в приложении',
    h: (m) => (m >= 60 ? `${Math.floor(m / 60)} ч${m % 60 ? ' ' + (m % 60) + ' мин' : ''}` : `${m} мин`),
    wh: { now: '🟢 <b>Сейчас на паре</b>', between: '🟡 <b>Сейчас пары нет</b>', before: '⏳ <b>Сегодняшние пары ещё не начались</b>', after: '🏁 <b>Сегодняшние пары закончились</b>', off: '⚪ <b>Сегодня пар нет</b>',
      until: (t, left) => `⏱ до ${t} — осталось ${left}`, next: '⏭ <b>Следующая пара</b>', inM: (d) => `через ${d}`, tomorrow: 'Завтра', today: (c) => `🗓 <b>План на сегодня</b> · ${c}`,
      noRoom: 'аудитория не указана', note: 'ℹ️ По официальному расписанию — возможны неожиданные изменения.' } },
  en: { lecture: 'Lecture', seminar: 'Seminar', lab: 'Lab', practice: 'Practice', bld: (b) => `Building ${b}`, room: (r) => `Room ${r}`,
    count: (n) => `${n} class${n === 1 ? '' : 'es'}`, pair: (n) => `Period ${n}`, now: '🟢 Now', next: '⏭ Next', brk: (m) => `☕ ${m} min break`,
    finish: (t) => `🏁 Classes end at ${t}`, moved: '🔁 Time changed', roomCh: '🚪 Room changed', teachCh: '👤 Teacher changed', groupCh: '👥 Groups changed', removed: '❌ Cancelled',
    added: '➕ New class', wkCap: (g, r, n) => `🗓 <b>${g}</b> — weekly timetable\n${r} · ${n} classes`, lessonsWeek: 'Weekly timetable', freeWeek: 'No classes this week 🎉', seeApp: '📱 More in the app',
    h: (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ' ' + (m % 60) + ' min' : ''}` : `${m} min`),
    wh: { now: '🟢 <b>In class right now</b>', between: '🟡 <b>No class right now</b>', before: "⏳ <b>Today's classes haven't started yet</b>", after: "🏁 <b>Today's classes are over</b>", off: '⚪ <b>No classes today</b>',
      until: (t, left) => `⏱ until ${t} — ${left} left`, next: '⏭ <b>Next class</b>', inM: (d) => `in ${d}`, tomorrow: 'Tomorrow', today: (c) => `🗓 <b>Today's plan</b> · ${c}`,
      noRoom: 'no room given', note: "ℹ️ Based on the official timetable — unexpected changes are possible." } },
};
export const words = (lang) => W[lang] || W.uz;

// EduPage gives subject names in Uzbek. For Russian / English readers they are looked up in
// docs/data/subjects.json ({ "<Uzbek name>": [ru, en] }) — loaded by the Worker, the scripts and the
// Mini App and handed to setSubjects(). Matching ignores case, spaces and punctuation, so
// "Audit-2" and "Audit 2" are the same; a name that isn't in the table is shown as it is.
let SUBJECTS = new Map();
const subjKey = (s) => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
export function setSubjects(obj) {
  SUBJECTS = new Map(Object.entries(obj || {}).map(([k, v]) => [subjKey(k), v]));
}
export const hasSubject = (name) => SUBJECTS.has(subjKey(name));
export function subjectName(name, lang) {
  if (lang !== 'ru' && lang !== 'en') return name;
  const hit = SUBJECTS.get(subjKey(name));
  return (hit && hit[lang === 'ru' ? 0 : 1]) || name;
}

/**
 * "Ekonometrika (Ma)" -> { name: "Ekonometrika", type: "lecture" }. With `lang` the name is translated and the
 * original (Uzbek) name is kept in `orig` — only when the translation really differs, so readers see
 * "Auditing / Audit" but never "Audit / Audit".
 */
export function parseSubject(s, lang) {
  const r = parseSubjectRaw(s);
  if (!lang) return r;
  const name = subjectName(r.name, lang);
  return { name, orig: subjKey(name) === subjKey(r.name) ? null : r.name, type: r.type };
}
/** Name for a message: translated name, then the original in italics — "Auditing / <i>Audit</i>". */
export const subjHtml = (sub, bold) => (bold ? `<b>${esc(sub.name)}</b>` : esc(sub.name)) + (sub.orig ? ` / <i>${esc(sub.orig)}</i>` : '');
function parseSubjectRaw(s) {
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

/** 👤 for a teacher's timetable, 👥 for a group's. */
export const whoIcon = (g) => (g?.kind === 't' ? '👤' : '👥');

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

const TYPE_DOT = { lecture: '🟦', seminar: '🟩', lab: '🟧', practice: '🟧' };
/** Colour square of a lesson type — the same colours as the weekly picture and the Mini App cards. */
export const typeDot = (type) => TYPE_DOT[type] || '⬜';

/** Full lesson card for "today / tomorrow" messages (a quote block, so lessons read as separate cards). */
export function fmtLesson(l, periods, lang, parity, state) {
  const w = words(lang);
  const t = times(periods, l);
  const sub = parseSubject(l.s, lang);
  const head = `${typeDot(sub.type)} <b>${t.a} – ${t.b}</b> · <i>${w.pair(l.p)}</i>${weekTag(l, lang, parity)}${state ? `  ${state}` : ''}`;
  const lines = [head, `${subjHtml(sub, true)}${sub.type ? ` — ${typeLabel(sub.type, lang)}` : ''}${l.g ? ` <i>(${esc(l.g)})</i>` : ''}`];
  const meta = [];
  if (l.r) meta.push(`📍 <b>${esc(roomLabel(l.r, lang))}</b>`);
  if (l.t) meta.push(`👤 ${esc(l.t)}`);
  if (meta.length) lines.push(meta.join('  ·  '));
  if (l.gr) lines.push(`👥 ${esc(l.gr)}`); // teacher timetables: which groups attend
  return `<blockquote>${lines.join('\n')}</blockquote>`;
}

/** One-line version used in weekly captions and change alerts. */
export function fmtLessonShort(l, periods, lang, parity) {
  const t = times(periods, l);
  const sub = parseSubject(l.s, lang);
  let s = `${typeDot(sub.type)} <b>${t.a}</b> ${subjHtml(sub)}`;
  if (sub.type) s += ` <i>(${typeLabel(sub.type, lang).toLowerCase()})</i>`;
  if (l.g) s += ` <i>[${esc(l.g)}]</i>`;
  if (l.gr) s += ` <i>[${esc(l.gr)}]</i>`;
  if (l.r) s += ` · 📍${esc(l.r)}`;
  if (l.w && !parity) s += ` · <i>${l.w === 'A' ? tr(lang).weekA : tr(lang).weekB}</i>`;
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
  const endM = ls.length ? Math.max(...ls.map((l) => mins(times(index.periods, l).b))) : 0;
  const span = ls.length ? ` · ${times(index.periods, ls[0]).a}–${hhmm(endM)}` : '';
  const head = [`📅 <b>${L.days[d]}, ${fmtDate(date, lang)}</b>` + (parity ? ` · ${parity === 'A' ? L.weekA : L.weekB}` : ''),
    `${whoIcon(group)} ${esc(group.name)}${ls.length ? ` · ${w.count(ls.length)}${span}` : ''}`].join('\n');
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
      if (gap >= 30) blocks.push(`<i>${w.brk(gap)}</i>`);
    }
    prevEnd = Math.max(prevEnd ?? 0, mins(t.b));
    let state = '';
    if (sameDay) {
      if (nowM >= mins(t.a) && nowM < mins(t.b)) state = w.now;
      else if (nowM < mins(t.a) && !nextMarked) { state = w.next; nextMarked = true; }
    }
    blocks.push(fmtLesson(l, index.periods, lang, parity, state));
  }
  return clip(`${head}\n\n${blocks.join('\n')}\n\n${w.finish(hhmm(endM))}`);
}

// ---------- "Where is the teacher?" ----------
// Pure functions over a timetable entity ({ lessons }) — a teacher's file, but a group's or a room's works too.
// The Mini App has a twin of whereIs() (docs/index.html); tests/app-ui.mjs checks that both give the same answer.

/** {from, to} in minutes after midnight for a lesson (a double period covers both). */
function spanOf(periods, l) {
  const a = periods.find((p) => p.p === l.p);
  const b = periods.find((p) => p.p === l.p + (l.n || 1) - 1) || a;
  return a ? { from: mins(a.start), to: mins(b.end) } : { from: 0, to: 0 };
}
/** Lessons held on `date` (alternating weeks resolved), each with its time span, in time order. */
export function dayItems(entity, index, date) {
  const d = weekday(date);
  if (d === 6) return [];
  return lessonsForDay(entity, d, weekParity(index.weekA, date))
    .map((l) => ({ l, ...spanOf(index.periods, l) }))
    .sort((x, y) => x.from - y.from || x.l.p - y.l.p);
}

/**
 * Where is this teacher right now? `now` is a Tashkent "local date" (see tashkentNow).
 *   state  'now' (in class) | 'between' (free, has more classes today) | 'before' (day not started)
 *          | 'after' (today's classes are over) | 'off' (no classes today)
 *   cur    lessons running now         today  all of today's lessons
 *   next   { date, today, items } — the next lesson start (today, or on the next teaching day within two weeks)
 */
export function whereIs(entity, index, now) {
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
  const state = cur.length ? 'now' : !today.length ? 'off' : later.length ? (done ? 'between' : 'before') : 'after';
  const until = cur.length ? Math.max(...cur.map((x) => x.to)) : null;
  return { state, nowM, today, cur, next, until, left: until == null ? null : until - nowM, inMin: next && next.today ? next.items[0].from - nowM : null };
}

const shortList = (str, n = 2) => { const a = String(str || '').split(', ').filter(Boolean); return a.length > n ? `${a.slice(0, n).join(', ')} +${a.length - n}` : a.join(', '); };

/** The "Ustoz qayerda?" answer: status line, room card, next class, today's plan. */
export function fmtWhere(teacher, index, now, lang) {
  const w = words(lang), h = w.wh, L = tr(lang);
  const st = whereIs(teacher, index, now);
  const detail = (x) => {
    const l = x.l, sub = parseSubject(l.s, lang);
    const out = [`📍 <b>${esc(l.r ? roomLabel(l.r, lang) : h.noRoom)}</b>`,
      `${typeDot(sub.type)} ${subjHtml(sub, true)}${sub.type ? ` — ${typeLabel(sub.type, lang)}` : ''}${l.g ? ` <i>(${esc(l.g)})</i>` : ''}`];
    if (l.gr) out.push(`👥 ${esc(l.gr)}`);
    return out.join('\n');
  };
  const out = [`👨‍🏫 <b>${esc(teacher.name)}</b>`, h[st.state]];
  if (st.state === 'now') out.push(`<blockquote>${st.cur.map(detail).join('\n\n')}\n${h.until(hhmm(st.until), w.h(st.left))}</blockquote>`);
  if (st.next) {
    const n = st.next, t0 = hhmm(n.items[0].from);
    const tomorrow = ymd(addDays(now, 1)) === ymd(n.date);
    const when = n.today ? `${t0} (${h.inM(w.h(st.inMin))})` : `${tomorrow ? h.tomorrow : `${L.days[weekday(n.date)]}, ${fmtDate(n.date, lang)}`}, ${t0}`;
    out.push('', `${h.next} — ${when}`, `<blockquote>${n.items.map(detail).join('\n\n')}</blockquote>`);
  }
  if (st.today.length) {
    out.push('', h.today(w.count(st.today.length)));
    for (const x of st.today) {
      const mark = st.cur.includes(x) ? '🟢' : x.to <= st.nowM ? '▫️' : '▪️';
      const room = x.l.r ? roomLabel(x.l.r, lang) : '—';
      out.push(`${mark} ${hhmm(x.from)}–${hhmm(x.to)} · ${esc(room)}${x.l.gr ? ` · ${esc(shortList(x.l.gr))}` : ''}`);
    }
  }
  out.push('', `<i>${h.note}</i>`);
  return clip(out.join('\n'));
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
    parts.push(`<b>${L.days[d]}</b> · ${words(lang).count(ls.length)}\n${ls.map((l) => fmtLessonShort(l, index.periods, lang, parity)).join('\n')}`);
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

/**
 * Short evening "tomorrow" ping — one per day, only to chats that have classes tomorrow.
 * Returns null (send nothing) when tomorrow is a free day, so quiet days stay quiet.
 */
export function fmtTomorrow(group, index, date, lang) {
  const L = tr(lang);
  const w = words(lang);
  const d = weekday(date);
  const parity = weekParity(index.weekA, date);
  const ls = d === 6 ? [] : lessonsForDay(group, d, parity);
  if (!ls.length) return null;
  const first = times(index.periods, ls[0]);
  const firstName = subjHtml(parseSubject(ls[0].s, lang));
  const last = times(index.periods, ls[ls.length - 1]).b;
  const title = lang === 'ru' ? `🌙 <b>Завтра</b> — ${L.days[d]}, ${fmtDate(date, lang)}`
    : lang === 'en' ? `🌙 <b>Tomorrow</b> — ${L.days[d]}, ${fmtDate(date, lang)}`
    : `🌙 <b>Ertaga</b> — ${L.days[d]}, ${fmtDate(date, lang)}`;
  const line2 = `${whoIcon(group)} ${esc(group.name)} · ${w.count(ls.length)}${parity ? ` · ${parity === 'A' ? L.weekA : L.weekB}` : ''}`;
  const line3 = lang === 'ru' ? `🕘 Первая пара: <b>${first.a}</b> — ${firstName}`
    : lang === 'en' ? `🕘 First class: <b>${first.a}</b> — ${firstName}`
    : `🕘 Birinchi dars: <b>${first.a}</b> — ${firstName}`;
  return `${title}\n${line2}\n\n${line3}\n${w.finish(last)}`;
}

/** Full list of tomorrow's classes (the daily reminder for group chats). null on a free day → send nothing. */
export function fmtTomorrowFull(group, index, date, lang) {
  const d = weekday(date);
  if (d === 6 || !lessonsForDay(group, d, weekParity(index.weekA, date)).length) return null;
  const title = lang === 'ru' ? '🌙 <b>Пары на завтра</b>' : lang === 'en' ? "🌙 <b>Tomorrow's classes</b>" : '🌙 <b>Ertangi darslar</b>';
  return clip(`${title}\n\n${fmtDay(group, index, date, lang, null)}`);
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
      const name = subjHtml(parseSubject(n.s, lang), true);
      if (o.p !== n.p || o.n !== n.n) lines.push(`${w.moved}: ${name}\n     ${times(P, o).a} → <b>${times(P, n).a}</b>${n.r ? ` · 📍${esc(n.r)}` : ''}`);
      else if (o.r !== n.r) lines.push(`${w.roomCh}: ${name} (${times(P, n).a})\n     ${esc(o.r || '—')} → <b>${esc(n.r || '—')}</b>`);
      else if (o.t !== n.t) lines.push(`${w.teachCh}: ${name} (${times(P, n).a})\n     ${esc(o.t || '—')} → <b>${esc(n.t || '—')}</b>`);
      else if ((o.gr || '') !== (n.gr || '')) lines.push(`${w.groupCh}: ${name} (${times(P, n).a})\n     ${esc(o.gr || '—')} → <b>${esc(n.gr || '—')}</b>`);
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
  // cut at a line break so no HTML tag is left open (every line closes its own tags) …
  const cut = s.lastIndexOf('\n', 3950);
  let out = s.slice(0, cut > 0 ? cut : 3950);
  // … except a <blockquote> that spans several lines
  const open = (out.match(/<blockquote>/g) || []).length, close = (out.match(/<\/blockquote>/g) || []).length;
  if (open > close) out += '</blockquote>';
  return out + '\n…';
}
