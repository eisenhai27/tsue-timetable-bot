// Short, kind jokes and wishes for the lesson reminders ("⏰ 11 daqiqadan keyin…") and the end-of-day message.
// Rules for anything added here: nobody is laughed at — not teachers, not students, not any group of people. Light everyday
// humour (coffee, 08:00, Friday, the last class), encouragement, and for teachers warm wishes and thanks.
// Every entry exists in all three languages; `win: true` marks a line about windows (lecture halls often have none).

const j = (uz, ru, en, extra = {}) => ({ uz, ru, en, ...extra });

export const JOKES = {
  // ---- students, before a class
  s_morning: [
    j("☕ 08:00 dagi dars — oddiy dars emas, iroda sinovi. Siz allaqachon g'olibsiz!", '☕ Пара в 08:00 — это не просто пара, это проверка силы воли. Вы уже победили!', "☕ An 8 a.m. class isn't just a class, it's a test of willpower. You've already won!"),
    j("🛏 Yostiq sizni sog'inadi. Lekin diplom sizni ko'proq kutyapti.", '🛏 Подушка по вам скучает. Но диплом ждёт вас сильнее.', '🛏 Your pillow misses you. But your diploma is waiting even harder.'),
    j("☕ Kofe — ertalabki talabaning rasmiy yoqilg'isi. To'ldirib oldingizmi?", '☕ Кофе — официальное топливо утреннего студента. Заправились?', "☕ Coffee is the official fuel of the morning student. Tank full?"),
    j("🌅 Shahar hali uyg'onmagan, siz esa allaqachon bilim sari yo'ldasiz. Qahramon!", '🌅 Город ещё спит, а вы уже в пути за знаниями. Герой!', "🌅 The city's still asleep and you're already on your way to learn. Hero!"),
  ],
  s_lecture: [
    j('🎤 Ma\'ruza — podkastning o\'zi, faqat jonli va pauza tugmasisiz.', '🎤 Лекция — это подкаст, только вживую и без кнопки паузы.', '🎤 A lecture is a podcast, just live and without a pause button.'),
    j("📝 Bugungi konspekt — imtihon kuni o'zingizga aytadigan \"rahmat\"ingiz.", '📝 Сегодняшний конспект — это ваше «спасибо» себе в день экзамена.', '📝 Today\'s notes are the "thank you" you\'ll send yourself on exam day.'),
    j("🧠 Miyangizga yangi yangilanish yuklanmoqda... O'chirib qo'ymang!", '🧠 В ваш мозг загружается обновление... Не выключайте!', "🧠 A new update is downloading to your brain... Please don't switch off!"),
  ],
  s_seminar: [
    j('💬 "Kim javob beradi?" deganda ko\'zingizni olib qochmang — bugun sizning kuningiz bo\'lishi mumkin!', '💬 Когда спросят «Кто ответит?», не отводите взгляд — сегодня может быть ваш день!', '💬 When they ask "Who wants to answer?", don\'t look away. Today might be your day!'),
    j("🙋 Seminar — fikringiz eshitiladigan joy. Bitta gap ham katta qadam.", '🙋 Семинар — место, где слышат ваше мнение. Даже одна фраза — большой шаг.', '🙋 A seminar is where your voice gets heard. Even one sentence is a big step.'),
  ],
  s_lab: [
    j("🔬 Laboratoriya — xato qilish rasman ruxsat etilgan joy. Fan aynan shunday rivojlangan!", '🔬 Лаборатория — единственное место, где ошибаться официально разрешено. Так и развивалась наука!', '🔬 The lab is the one place where mistakes are officially allowed. That\'s how science got here!'),
    j("🧪 Bugungi tajriba muvaffaqiyatli bo'ladi. Bo'lmasa ham — baribir tajriba 🙂", '🧪 Сегодняшний эксперимент удастся. А если нет — это всё равно опыт 🙂', "🧪 Today's experiment will work. And if it doesn't, it's still experience 🙂"),
  ],
  s_last: [
    j('🏁 Oxirgi para! Uy, choy va divan sizni kutmoqda.', '🏁 Последняя пара! Дом, чай и диван уже ждут.', '🏁 Last class! Home, tea and the sofa are waiting.'),
    j('🔋 Batareya oz qoldi, lekin marra yaqin — yana bitta para!', '🔋 Заряд на исходе, но финиш близко — ещё одна пара!', '🔋 Battery is low but the finish line is close. Just one more class!'),
  ],
  s_fri: [j('🎉 Juma! Dam olish kunlari eshik oldida turibdi.', '🎉 Пятница! Выходные уже стоят у двери.', '🎉 Friday! The weekend is already at the door.')],
  s_sat: [j("💪 Shanba kuni darsga borayotganlar — haftaning eng irodali odamlari.", '💪 Те, кто идёт на пары в субботу, — самые волевые люди недели.', "💪 People heading to class on a Saturday are the week's strongest-willed humans.")],
  s_mon: [j('🌀 Hafta boshlandi. Toza sahifa, yangi imkoniyat!', '🌀 Неделя началась. Чистый лист — новые возможности!', '🌀 A new week has started. Clean page, fresh chances!')],
  s_lunch: [j("🍽 Eng og'ir sinov — ovqatdan keyingi para. Siz uddalaysiz!", '🍽 Самое трудное испытание — пара после обеда. Вы справитесь!', "🍽 The hardest test of all: the class right after lunch. You've got this!")],
  s_any: [
    j("🎒 Daftar bor, ruchka bor, kayfiyat 100%. Ketdik!", '🎒 Тетрадь есть, ручка есть, настроение 100%. Поехали!', "🎒 Notebook: check. Pen: check. Mood: 100%. Let's go!"),
    j("😄 Tabassum bilan kirsangiz, dars tezroq o'tadi. Ilmiy isbotlanmagan, lekin sinab ko'ring!", '😄 Если войти с улыбкой, пара пролетит быстрее. Научно не доказано, но попробуйте!', "😄 Walk in smiling and the class goes faster. Not scientifically proven, but worth a try!"),
    j("📱 Telefon ham biroz dam olsin — u kecha ko'p ishladi.", '📱 Пусть телефон тоже отдохнёт — он вчера много работал.', '📱 Let your phone rest a bit too. It worked hard yesterday.'),
    j("🍀 Bugun kimdir sizdan konspekt so'rashi aniq. Tayyor turing!", '🍀 Сегодня кто-то точно попросит у вас конспект. Будьте готовы!', '🍀 Someone will definitely ask to borrow your notes today. Be ready!'),
    j('🚀 Bugungi dars — kelajakdagi o\'zingizga sovg\'a.', '🚀 Сегодняшняя пара — подарок вам в будущем.', "🚀 Today's class is a gift to your future self."),
    j("🦉 Bilim — eng yengil yuk: qancha ko'p bo'lsa ham og'irlik qilmaydi.", '🦉 Знания — самый лёгкий груз: сколько ни носи, не тяжело.', '🦉 Knowledge is the lightest luggage: carry as much as you like.'),
    j('🎧 Darsga kirishdan oldin bitta chuqur nafas — tayyor!', '🎧 Один глубокий вдох перед парой — и вы готовы!', "🎧 One deep breath before class, and you're ready!"),
    j('🗓 Bugun dars, ertaga tajriba, keyin diplom. Reja zo\'r!', '🗓 Сегодня пара, завтра опыт, потом диплом. Отличный план!', '🗓 Class today, experience tomorrow, a diploma after that. Great plan!'),
    j("⭐ Bugun o'zingizga bitta yulduzcha qo'ying — darsga keldingiz!", '⭐ Поставьте себе звёздочку — вы пришли на пару!', '⭐ Give yourself a gold star: you showed up!'),
    j("🌱 Har bir dars bilan biroz o'sasiz. Ko'rinmaydi, lekin bor!", '🌱 С каждой парой вы немного растёте. Незаметно, но точно!', "🌱 You grow a little with every class. You can't see it, but it's there!"),
    j("🍫 Darsdan keyin o'zingizni bir narsa bilan siylang. Bunga loyiqsiz!", '🍫 После пары побалуйте себя чем-нибудь. Вы заслужили!', '🍫 Treat yourself to something after class. You deserve it!'),
    j("🧩 Bugungi mavzu — katta jumboqning yana bir bo'lagi.", '🧩 Сегодняшняя тема — ещё один кусочек большого пазла.', "🧩 Today's topic is one more piece of a big puzzle."),
    j('🔑 Bilim — eng ko\'p eshik ochadigan kalit.', '🔑 Знания — ключ, который открывает больше всего дверей.', '🔑 Knowledge is the key that opens the most doors.'),
    j("📖 Bugun bitta narsani tushunsangiz ham, dars muvaffaqiyatli o'tdi.", '📖 Поймёте сегодня хоть одну вещь — пара прошла успешно.', '📖 Understand just one thing today and the class was a success.'),
    j('🌟 Oldingi qatorda yaxshiroq eshitiladi. Ustoz ham sizni eslab qoladi 🙂', '🌟 На первом ряду лучше слышно. И преподаватель вас запомнит 🙂', '🌟 You hear better from the front row. And the teacher will remember you 🙂'),
    j('🎯 Bugungi maqsad: tushunish, yozish, tabassum.', '🎯 Цель на сегодня: понять, записать, улыбнуться.', "🎯 Today's goal: understand, write it down, smile."),
    j("🌤 Kayfiyat ob-havosi: ochiq, bilim yog'ishi kutilmoqda.", '🌤 Прогноз настроения: ясно, ожидаются осадки в виде знаний.', '🌤 Mood forecast: clear skies with a chance of knowledge.'),
    j('🧃 Suv, ruchka, daftar — darsning uch qahramoni. Hammasi joyidami?', '🧃 Вода, ручка, тетрадь — три героя пары. Все на месте?', '🧃 Water, pen, notebook: the three heroes of every class. All present?'),
    j('🏆 Darsga vaqtida kelish — kichik, lekin haqiqiy g\'alaba.', '🏆 Прийти на пару вовремя — маленькая, но настоящая победа.', '🏆 Getting to class on time is a small but real win.'),
    j('🚶 Shoshilmang, 11 daqiqa bor — bemalol yetib olasiz.', '🚶 Не спешите, есть 11 минут — спокойно успеете.', "🚶 No rush, you've got 11 minutes. Plenty of time."),
    j('😊 Kursdoshingizga salom bering — kimdir bugun shunga muhtoj.', '😊 Поздоровайтесь с однокурсником — кому-то сегодня это очень нужно.', '😊 Say hi to a classmate. Someone needs that today.'),
  ],
  // students who stay in the same room for the next class
  stay: [
    j('🪑 Shu xonada qolasiz — oyoqlaringiz rahmat aytadi!', '🪑 Остаётесь в этой же аудитории — ноги скажут спасибо!', '🪑 Same room for the next class. Your feet say thank you!'),
    j('🪟 Tanaffusda derazani ochib qo\'ying — keyingi dars yengilroq o\'tadi.', '🪟 Откройте окно на перемене — следующая пара пойдёт легче.', '🪟 Open a window during the break. The next class will feel lighter.', { win: true }),
    j("🧘 Joyingizda bir cho'zilib oling — tanangiz ham tanaffusga loyiq.", '🧘 Потянитесь прямо на месте — тело тоже заслужило перемену.', '🧘 Have a stretch right where you are. Your body deserves a break too.'),
    j('🏠 Bu xona bugun ikkinchi uyingizga aylandi. Qulay o\'tiring!', '🏠 Эта аудитория сегодня стала вашим вторым домом. Устраивайтесь поудобнее!', '🏠 This room has become your second home today. Get comfy!'),
    j('💧 Xonadan chiqmasangiz ham, suv ichishni unutmang.', '💧 Даже если не выходите из аудитории, не забудьте попить воды.', "💧 Even if you're not leaving the room, don't forget to drink some water."),
    j("📍 Joy o'zgarmadi — eng yaxshi o'rindiq hali ham sizniki!", '📍 Место то же — лучшее кресло всё ещё ваше!', '📍 Same room, so the best seat is still yours!'),
    j('🗂 Daftarni yopmang — keyingi dars shu yerda boshlanadi.', '🗂 Не закрывайте тетрадь — следующая пара начнётся здесь же.', "🗂 Don't close your notebook. The next class starts right here."),
    j("😌 Bugun yo'lda vaqt yo'qotmaysiz — 11 daqiqa toza dam olish!", '😌 Сегодня не надо никуда идти — 11 минут чистого отдыха!', '😌 No walking between rooms today: 11 minutes of pure rest!'),
    j("👀 Ko'zlaringizga dam bering: bir daqiqa derazadan uzoqqa qarang.", '👀 Дайте глазам отдохнуть: минуту посмотрите вдаль в окно.', '👀 Rest your eyes: look out of the window into the distance for a minute.', { win: true }),
    j("🤝 Yoningizdagi kursdosh bilan bir og'iz gaplashing — tanaffus shunga ham kerak.", '🤝 Перекиньтесь парой слов с соседом — перемена и для этого тоже.', "🤝 Have a quick chat with the person next to you. That's what breaks are for."),
  ],
  // ---- teachers, before a class
  t_start: [
    j('🎓 Talabalar uyqusirab kirsa ham, sizning darsingizdan ilhom bilan chiqadi.', '🎓 Пусть студенты заходят сонными — с вашей пары они выйдут вдохновлёнными.', '🎓 Students may walk in sleepy, but they leave your class inspired.'),
    j('🙌 "Savollar bormi?" degandagi jimlik — o\'ylayotganlar borligini bildiradi.', '🙌 Тишина после «Есть вопросы?» означает, что кто-то задумался.', '🙌 The silence after "Any questions?" means someone is thinking.'),
    j('✨ Kimdir aynan bugungi darsingizdan keyin kasbini tanlashi mumkin.', '✨ Возможно, кто-то выберет профессию именно после вашей сегодняшней пары.', '✨ Someone may choose their career because of today\'s class.'),
    j('☕ Birinchi para — kofe va ilhom vaqti. Auditoriya sizni kutmoqda!', '☕ Первая пара — время кофе и вдохновения. Аудитория ждёт вас!', '☕ First class of the day: time for coffee and inspiration. Your audience awaits!'),
    j('📚 Bitta yaxshi misol o\'nta ta\'rifdan kuchliroq.', '📚 Один хороший пример сильнее десяти определений.', '📚 One good example beats ten definitions.'),
    j('🏁 Kunning oxirgi darsi — bugungi eng sabrli auditoriya sizniki.', '🏁 Последняя пара дня — самая терпеливая аудитория сегодня ваша.', "🏁 Last class of the day: today's most patient audience is all yours."),
    j('🌟 Har bir darsingiz kimningdir kelajagiga qo\'shilgan hissa.', '🌟 Каждая ваша пара — вклад в чьё-то будущее.', "🌟 Every class you teach is an investment in someone's future."),
    j('☀️ Yaxshi kayfiyat yuqumli — auditoriyaga ham albatta yuqadi!', '☀️ Хорошее настроение заразно — оно обязательно передастся аудитории!', '☀️ A good mood is contagious, and your audience will catch it!'),
    j('💡 Bugun kimdir darsingizda "aha!" deydi. Bu siz tufayli bo\'ladi.', '💡 Сегодня кто-то на вашей паре скажет «ага!». И это благодаря вам.', '💡 Today someone in your class will go "aha!". That will be thanks to you.'),
    j('📝 Doskadagi har bir yozuv kimningdir daftarida yashab qoladi.', '📝 Каждая запись на доске продолжит жить в чьей-то тетради.', '📝 Everything you write on the board lives on in someone\'s notebook.'),
    j('🧭 Bugun siz yo\'l ko\'rsatuvchisiz — auditoriya sizga ishonadi.', '🧭 Сегодня вы — проводник, и аудитория вам доверяет.', '🧭 Today you are the guide, and your audience trusts you.'),
    j('🌱 Ekilgan bilim urug\'i bir kun albatta unib chiqadi.', '🌱 Посеянное зерно знаний обязательно однажды прорастёт.', '🌱 Every seed of knowledge you plant will sprout one day.'),
    j("🌸 Bugungi darsingiz oson va maroqli o'tsin!", '🌸 Пусть сегодняшняя пара пройдёт легко и с удовольствием!', '🌸 May today\'s class be easy and enjoyable!'),
    j('✨ Auditoriya diqqatli, savollar qiziqarli bo\'lsin!', '✨ Пусть аудитория будет внимательной, а вопросы интересными!', '✨ Wishing you an attentive audience and interesting questions!'),
    j("🍀 Darsingizga omad! Talabalar sizdan ko'p narsa o'rganadi.", '🍀 Удачной пары! Студенты многому у вас научатся.', '🍀 Good luck with your class! Your students will learn a lot from you.'),
    j("☀️ Yaxshi kayfiyat bilan boshlangan dars yaxshi xotira bo'lib qoladi. Omad!", '☀️ Пара, начатая с хорошим настроением, становится хорошим воспоминанием. Удачи!', '☀️ A class that starts in a good mood becomes a good memory. Good luck!'),
  ],
  t_fri: [j('🎉 Juma darsi — hafta yakuniga chiroyli nuqta.', '🎉 Пятничная пара — красивая точка в конце недели.', "🎉 A Friday class is a lovely full stop to the week.")],
  t_sat: [j('💪 Shanba kuni dars berish — alohida fidoyilik. Rahmat sizga!', '💪 Вести пары в субботу — особая самоотдача. Спасибо вам!', '💪 Teaching on a Saturday takes real dedication. Thank you!')],
  // ---- end of the day
  s_end: [
    j('🎉 Bugungi darslar tugadi! Miya rasman dam olish rejimiga o\'tdi.', '🎉 Пары на сегодня закончились! Мозг официально перешёл в режим отдыха.', "🎉 That's it for today! Your brain is officially in rest mode."),
    j('🏠 Darslar tamom. Endi uy, choy va bir oz dam — bunga to\'liq loyiqsiz!', '🏠 Пары окончены. Теперь дом, чай и немного отдыха — вы это заслужили!', '🏠 Classes are over. Home, tea and a little rest: you\'ve earned it!'),
    j('🔋 Bugungi bilim zaryadi: 100%. Endi o\'zingizni ham zaryadlang.', '🔋 Заряд знаний на сегодня: 100%. Теперь подзарядитесь сами.', "🔋 Today's knowledge charge: 100%. Now recharge yourself."),
    j('🌇 Kun yakunlandi — siz uni uddaladingiz. Ofarin!', '🌇 День завершён — вы справились. Молодец!', '🌇 The day is done and you nailed it. Well done!'),
    j('🍲 Darslar tugadi, endi eng muhim fan — mazali ovqat.', '🍲 Пары закончились, теперь главный предмет — вкусная еда.', '🍲 Classes are over. Now for the most important subject: good food.'),
    j('😌 Bugun ham bir qadam oldinga. Ertangi o\'zingiz sizdan mamnun bo\'ladi.', '😌 Сегодня ещё один шаг вперёд. Вы завтрашний будете довольны.', '😌 Another step forward today. Tomorrow\'s you will be grateful.'),
    j('🛋 Divan sizni sabrsizlik bilan kutmoqda. Uni uzoq kuttirmang!', '🛋 Диван ждёт вас с нетерпением. Не заставляйте его ждать!', "🛋 The sofa is waiting impatiently. Don't keep it waiting!"),
    j('🌙 Bugun erta yotsangiz, ertaga birinchi parada kofe kamroq kerak bo\'ladi 🙂', '🌙 Ляжете сегодня пораньше — завтра на первой паре понадобится меньше кофе 🙂', '🌙 Go to bed early tonight and you\'ll need less coffee in tomorrow\'s first class 🙂'),
    j('🎮 Darsdan keyingi vaqt — sizniki. Sevimli ishingizga vaqt ajrating!', '🎮 Время после пар — ваше. Найдите время для любимого дела!', '🎮 The time after class is yours. Spend some on something you love!'),
    j('🎧 Uyga yo\'lda sevimli musiqangizni qo\'yib oling — kun yakuni shunday bo\'lishi kerak.', '🎧 Включите любимую музыку по дороге домой — так и должен заканчиваться день.', "🎧 Put on your favourite music on the way home. That's how a day should end."),
    j('💪 Kichik g\'alabalar kattasini quradi. Bugungisi ham hisobga o\'tdi!', '💪 Маленькие победы строят большую. Сегодняшняя засчитана!', "💪 Small wins build big ones. Today's counts!"),
  ],
  s_end_fri: [j('🎉 Darslar ham, hafta ham tugadi! Maroqli dam oling!', '🎉 Закончились и пары, и неделя! Хороших выходных!', '🎉 Classes are done, and so is the week! Have a great weekend!')],
  s_end_sat: [j('🏖 Shanba darslari ham tugadi — endi haqiqiy dam olish!', '🏖 Субботние пары тоже позади — теперь настоящий отдых!', '🏖 Saturday classes are done too. Now for some real rest!')],
  t_thanks: [
    j('🙏 Bugungi darslaringiz uchun rahmat! Bilim ulashish — eng ezgu ish.', '🙏 Спасибо за сегодняшние пары! Делиться знаниями — самое благородное дело.', "🙏 Thank you for today's classes! Sharing knowledge is the noblest work there is."),
    j('💐 Bugun ham talabalarga vaqtingiz va bilimingizni berdingiz. Katta rahmat!', '💐 Сегодня вы снова подарили студентам своё время и знания. Огромное спасибо!', '💐 Today you gave your students your time and knowledge again. Thank you so much!'),
    j('🌟 Bugungi darslaringiz kimningdir kelajagiga poydevor bo\'ldi. Rahmat sizga!', '🌟 Ваши сегодняшние пары стали фундаментом чьего-то будущего. Спасибо вам!', "🌟 Today's classes became the foundation of someone's future. Thank you!"),
    j('🤍 Sabringiz va mehnatingiz uchun tashakkur. Yaxshi dam oling!', '🤍 Благодарим за ваше терпение и труд. Хорошего отдыха!', '🤍 Thank you for your patience and hard work. Have a good rest!'),
    j('🙏 Sizdek ustozlar borligi talabalar uchun katta omad. Rahmat!', '🙏 Такие преподаватели, как вы, — большая удача для студентов. Спасибо!', '🙏 Teachers like you are a stroke of luck for students. Thank you!'),
    j('📚 Bugun aytgan har bir so\'zingiz bekorga ketmadi. Mehnatingiz uchun rahmat!', '📚 Каждое ваше слово сегодня было не зря. Спасибо за ваш труд!', '📚 Not a single word you said today was wasted. Thank you for your work!'),
    j('🌷 Kun davomidagi mehnatingiz uchun minnatdormiz. Oilangiz bilan yaxshi hordiq chiqaring!', '🌷 Благодарим за ваш труд сегодня. Хорошего отдыха с семьёй!', '🌷 We are grateful for your work today. Enjoy a relaxing evening with your family!'),
  ],
  t_thanks_fri: [j('🎉 Butun haftadagi mehnatingiz uchun rahmat! Maroqli dam oling!', '🎉 Спасибо за ваш труд всю неделю! Приятных выходных!', '🎉 Thank you for all your work this week! Enjoy the weekend!')],
  t_thanks_sat: [j('💐 Shanba kuni ham dars berganingiz uchun alohida rahmat!', '💐 Отдельное спасибо за то, что провели пары даже в субботу!', '💐 A special thank you for teaching on a Saturday too!')],
  t_wish: [
    j('☕ Darslar tugadi — endi bir piyola choy va tinch oqshom sizga!', '☕ Пары окончены — теперь вам чашку чая и спокойный вечер!', '☕ Classes are over. Wishing you a cup of tea and a quiet evening!'),
    j('🌙 Bugungi kun samarali o\'tdi. Ertaga ham shunday ilhom tilaymiz!', '🌙 Сегодняшний день прошёл продуктивно. Желаем такого же вдохновения завтра!', '🌙 Today was productive. Wishing you the same inspiration tomorrow!'),
    j('💪 Sog\'liq va kuch-quvvat tilaymiz — talabalaringizga siz kerak!', '💪 Желаем здоровья и сил — вы нужны своим студентам!', '💪 Wishing you health and energy. Your students need you!'),
  ],
};

// Subject jokes: chosen when the subject name contains one of the words (Uzbek or Russian names in the data).
export const SUBJECT_JOKES = [
  { re: /iqtisod|экономи/i, list: [
    j('📈 Talab yuqori — sizning bilimingizga. Taklifni oshiramiz!', '📈 Спрос высокий — на ваши знания. Наращиваем предложение!', "📈 Demand is high, for your knowledge. Let's increase the supply!"),
    j('💡 Iqtisodchilar "boshqa narsalar teng bo\'lganda" deyishni yaxshi ko\'radi. Bugun hamma narsa sizning foydangizga!', '💡 Экономисты любят говорить «при прочих равных». Сегодня всё прочее — в вашу пользу!', '💡 Economists love saying "all else being equal". Today, all else is in your favour!'),
  ] },
  { re: /statist|статист/i, list: [
    j('📊 Darsga kelganlarning 100% i nimadir o\'rganadi. Namuna kichik, lekin ishonchli 🙂', '📊 100% пришедших на пару чему-то научатся. Выборка маленькая, но надёжная 🙂', '📊 100% of people who come to class learn something. Small sample, but reliable 🙂'),
    j("📉 O'rtacha qiymat siz haqingizda emas. Siz o'rtachadan yuqorisiz!", '📉 Среднее значение — это не про вас. Вы выше среднего!', "📉 The average isn't about you. You're above it!"),
  ] },
  { re: /matemat|математ/i, list: [
    j('➗ Javob topilmaguncha masala tugamaydi. Siz ham shundaysiz!', '➗ Задача не закончена, пока не найден ответ. Вы такой же!', "➗ A problem isn't finished until the answer is found. Neither are you!"),
    j("∞ Cheksizlikka intilish — sevimli mashg'ulot. Bugun yana bir qadam yaqinlashamiz.", '∞ Стремиться к бесконечности — любимое занятие. Сегодня станем на шаг ближе.', '∞ Reaching for infinity is the favourite hobby here. One step closer today.'),
  ] },
  { re: /buxgalter|бухгалтер|hisob|учёт|учет|audit|аудит/i, list: [
    j('🧾 Debet kredit bilan, siz esa bilim bilan teng bo\'lasiz.', '🧾 Дебет сходится с кредитом, а вы — со знаниями.', '🧾 Debit balances credit, and you balance knowledge.'),
    j('📒 Balans hamma joyda kerak: hisobda ham, hayotda ham.', '📒 Баланс нужен везде: и в учёте, и в жизни.', '📒 Balance matters everywhere: in the books and in life.'),
  ] },
  { re: /moliya|финанс|bank|банк|kredit|кредит|investitsiya|инвест|sug'urta|sugʻurta|страхов/i, list: [
    j("💰 Eng yaxshi investitsiya — o'zingizga qilinganidir. Foizi ham eng yuqori!", '💰 Лучшая инвестиция — в себя. И процент самый высокий!', '💰 The best investment is in yourself. It pays the highest interest too!'),
    j('🏦 Bilim — inflyatsiyadan qo\'rqmaydigan yagona aktiv.', '🏦 Знания — единственный актив, который не боится инфляции.', "🏦 Knowledge is the only asset that isn't afraid of inflation."),
    j('🛡 Konspekt — imtihondan eng yaxshi sug\'urta.', '🛡 Конспект — лучшая страховка от экзамена.', '🛡 Good notes are the best insurance against exams.'),
  ] },
  { re: /marketing|маркетинг|reklama|реклам/i, list: [
    j('📣 Bugungi darsni o\'zingizga "sotib" ko\'ring — reklamasi juda yaxshi!', '📣 Попробуйте «продать» себе сегодняшнюю пару — у неё отличная реклама!', '📣 Try "selling" yourself today\'s class. It has great advertising!'),
    j('🎯 Maqsadli auditoriya aniq — bu siz!', '🎯 Целевая аудитория определена — это вы!', "🎯 Target audience identified: it's you!"),
  ] },
  { re: /menejment|менеджмент|boshqaruv|управлен/i, list: [
    j('🗂 Vaqtni boshqarish birinchi qoida. Mana, 11 daqiqa oldin xabardorsiz!', '🗂 Управление временем — первое правило. Вот, вы в курсе за 11 минут!', "🗂 Time management is rule number one. Look, you're already 11 minutes ahead!"),
  ] },
  { re: /ingliz|english|английск/i, list: [
    j("🇬🇧 Today's plan: learn, smile, repeat!", "🇬🇧 Today's plan: learn, smile, repeat!", "🇬🇧 Today's plan: learn, smile, repeat!"),
  ] },
  { re: /xorijiy til|chet til|иностран|tili|язык/i, list: [
    j("🗣 Yangi til — yangi dunyo. Bugun kamida bitta yangi so'z!", '🗣 Новый язык — новый мир. Сегодня хотя бы одно новое слово!', '🗣 A new language is a new world. At least one new word today!'),
  ] },
  { re: /huquq|право|юрид/i, list: [
    j('⚖️ Kechikmaslik — eng oddiy qonun. Siz uni buzmaysiz!', '⚖️ Не опаздывать — самый простой закон. Вы его не нарушите!', "⚖️ Don't be late: the simplest law there is. You won't break it!"),
  ] },
  { re: /informat|информат|axborot|информац|dastur|программ|raqamli|цифров/i, list: [
    j('💻 Miyangizni "Ctrl+S" qilishni unutmang!', '💻 Не забудьте нажать «Ctrl+S» в своей голове!', '💻 Don\'t forget to hit "Ctrl+S" on your brain!'),
    j('🖥 Dasturda ham, darsda ham bitta qoida: avval tushun, keyin bajar.', '🖥 И в коде, и на паре одно правило: сначала пойми, потом делай.', '🖥 In code and in class, one rule: understand first, then do.'),
  ] },
  { re: /soliq|налог/i, list: [
    j('🧾 Bilimdan soliq olinmaydi — xohlagancha to\'plang!', '🧾 Знания налогом не облагаются — копите сколько угодно!', '🧾 Knowledge is tax-free. Collect as much as you like!'),
  ] },
  { re: /jismoniy|физическ|sport|спорт/i, list: [
    j('🏃 Bugun miya emas, muskullar ishlaydi. Isinishni unutmang!', '🏃 Сегодня работают не мозги, а мышцы. Не забудьте разминку!', "🏃 Today it's muscles, not brains, doing the work. Don't skip the warm-up!"),
  ] },
  { re: /falsafa|философ/i, list: [
    j('🤔 "Darsga boraymi?" — bu savolning javobi allaqachon ma\'lum: ha!', '🤔 «Идти ли на пару?» — ответ на этот вопрос уже известен: да!', '🤔 "Should I go to class?" The answer to this question is already known: yes!'),
  ] },
  { re: /tarix|истори/i, list: [
    j('📜 Bugun siz ham tarixning bir qismisiz — darsga o\'z vaqtida kelgan talaba sifatida!', '📜 Сегодня вы тоже часть истории — как студент, пришедший вовремя!', '📜 Today you\'re part of history too, as the student who arrived on time!'),
  ] },
  { re: /logist|логист/i, list: [
    j("🚚 Eng yaxshi marshrut — to'g'ri xonaga!", '🚚 Лучший маршрут — в нужную аудиторию!', '🚚 The best route: straight to the right room!'),
  ] },
  { re: /turizm|туризм|mehmonxona|гостинич/i, list: [
    j("✈️ Bilim olamiga sayohat boshlanmoqda. Pasport shart emas!", '✈️ Путешествие в мир знаний начинается. Паспорт не нужен!', '✈️ Your journey into the world of knowledge begins. No passport required!'),
  ] },
];
