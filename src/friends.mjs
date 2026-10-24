// 👥 Friends: two people who added each other (an invite link + a "yes") see where the other one is right now — read from their
// timetables, never from a phone's location — and when both of them are free today. Texts and the pure logic live here; the Worker
// keeps the friendships (D1 table `friends`) and the Mini App draws the same thing in its own "Do'stlar" tab.
import { esc, hhmm, roomLabel, whereIs, dayItems } from './shared.mjs';

export const FT = {
  uz: {
    btn: "👥 Do'stlar",
    title: "👥 <b>Do'stlaringiz</b>",
    empty: "Hali do'stingiz yo'q.\n\nDo'st qo'shsangiz, ikkalangiz bir-biringizning <b>hozir qaysi xonada ekaningizni</b> va <b>bugun qachon ikkalangiz bo'sh ekaningizni</b> ko'rasiz — tanaffusda uchrashish, birga tushlik qilish uchun.\n\n➕ Pastdagi tugma bilan havolangizni do'stingizga yuboring. U rozi bo'lsa — do'st bo'lasiz.\n\n<i>Faqat dars jadvali asosida — joylashuvingiz (GPS) hech kimga ko'rinmaydi.</i>",
    noGroup: "ℹ️ Do'stlaringiz sizni ko'rishi uchun avval guruhingizni tanlang: /group",
    now: (room, t) => `📘 Darsda: ${room} · ${t} gacha`,
    free: (t, room) => `🟢 Hozir bo'sh · keyingi dars ${t}${room ? `, ${room}` : ''}`,
    after: '✅ Bugungi darslari tugadi',
    off: "🏠 Bugun darsi yo'q",
    unknown: '❔ Guruh tanlamagan',
    both: (list) => `🤝 Ikkalangiz bo'sh: ${list}`,
    afterT: (t) => `${t} dan keyin`,
    noCommon: "🤝 Bugun umumiy bo'sh vaqt yo'q",
    bothNow: "🤝 Hozir ikkalangiz ham bo'shsiz",
    sum: (n, f, c) => `${n} ta do'st · 🟢 ${f} bo'sh · 📘 ${c} darsda`,
    onlyFree: "🟢 Faqat bo'shlar", all: '👥 Hammasi', noneFree: "Hozir bo'sh do'stingiz yo'q.",
    add: "➕ Do'st qo'shish",
    refresh: '🔄 Yangilash',
    manage: "⚙️ Do'stlarni boshqarish",
    manageT: "⚙️ Ro'yxatdan olib tashlash uchun ismni bosing.\nU sizni ham, siz uni ham ko'rmay qolasiz.",
    back: '◀️ Orqaga',
    removed: (n) => `✖️ ${n} ro'yxatdan olib tashlandi.`,
    shareText: "Keling, TDIU Jadval'da do'st bo'laylik — qaysi xonada ekanimizni va umumiy bo'sh vaqtimizni ko'rib turamiz 👇",
    invite: (n) => `👋 <b>${n}</b> sizni TDIU Jadval'da do'st qilib qo'shmoqchi.\n\nDo'st bo'lsangiz, ikkalangiz bir-biringizning <b>hozir qaysi xonada ekaningizni</b> va <b>umumiy bo'sh vaqtingizni</b> ko'rasiz.\n\n<i>Faqat dars jadvali asosida — joylashuv (GPS) emas. Istalgan payt olib tashlash mumkin.</i>`,
    yes: '✅ Qabul qilaman',
    no: "❌ Yo'q",
    declined: "Mayli, do'st qo'shilmadi.",
    done: (n) => `🎉 Endi siz va <b>${n}</b> do'stsiz!`,
    accepted: (n) => `🎉 <b>${n}</b> do'stlik taklifingizni qabul qildi — endi bir-biringizni ko'rasiz.`,
    self: "Bu sizning o'z havolangiz 🙂 Uni do'stingizga yuboring.",
    already: (n) => `Siz va <b>${n}</b> allaqachon do'stsiz.`,
    bad: "Bu havola eskirgan yoki noto'g'ri.",
    full: "Do'stlar soni chegarasiga yetildi (100 ta).",
    pickGroup: "Do'stingiz sizni ko'rishi uchun endi guruhingizni tanlang 👇",
    whatsNew: "🆕 <b>Yangilik: 👥 Do'stlar!</b>\n\nDo'stlaringiz <b>hozir qaysi xonada</b> ekanini va <b>bugun qachon ikkalangiz bo'sh</b> ekaningizni ko'ring — tanaffusda uchrashish, birga tushlik qilish uchun.\n\nPastdagi <b>👥 Do'stlar</b> tugmasini bosing va havolangizni do'stingizga yuboring 👇\n\n<i>Faqat dars jadvali asosida — joylashuvingiz hech kimga ko'rinmaydi.</i>",
  },
  ru: {
    btn: '👥 Друзья',
    title: '👥 <b>Ваши друзья</b>',
    empty: 'Пока друзей нет.\n\nДобавьте друга — и вы оба будете видеть, <b>в какой аудитории другой сейчас</b> и <b>когда вы оба свободны сегодня</b> — чтобы встретиться на перемене или пообедать вместе.\n\n➕ Отправьте другу свою ссылку кнопкой ниже. Если он согласится — вы друзья.\n\n<i>Только по расписанию — ваше местоположение (GPS) никому не видно.</i>',
    noGroup: 'ℹ️ Чтобы друзья видели вас, сначала выберите группу: /group',
    now: (room, t) => `📘 На паре: ${room} · до ${t}`,
    free: (t, room) => `🟢 Сейчас свободен · следующая пара ${t}${room ? `, ${room}` : ''}`,
    after: '✅ Пары на сегодня закончились',
    off: '🏠 Сегодня пар нет',
    unknown: '❔ Группа не выбрана',
    both: (list) => `🤝 Вы оба свободны: ${list}`,
    afterT: (t) => `после ${t}`,
    noCommon: '🤝 Сегодня общего свободного времени нет',
    bothNow: '🤝 Сейчас вы оба свободны',
    sum: (n, f, c) => `${n} друзей · 🟢 ${f} свободны · 📘 ${c} на паре`,
    onlyFree: '🟢 Только свободные', all: '👥 Все', noneFree: 'Сейчас свободных друзей нет.',
    add: '➕ Добавить друга',
    refresh: '🔄 Обновить',
    manage: '⚙️ Управлять друзьями',
    manageT: '⚙️ Нажмите на имя, чтобы убрать из списка.\nВы перестанете видеть друг друга.',
    back: '◀️ Назад',
    removed: (n) => `✖️ ${n} — убран(а) из списка.`,
    shareText: 'Давай дружить в TDIU Jadval — будем видеть, кто в какой аудитории и когда мы оба свободны 👇',
    invite: (n) => `👋 <b>${n}</b> хочет добавить вас в друзья в TDIU Jadval.\n\nВы оба будете видеть, <b>в какой аудитории другой сейчас</b> и <b>ваше общее свободное время</b>.\n\n<i>Только по расписанию — не по GPS. Убрать можно в любой момент.</i>`,
    yes: '✅ Принять',
    no: '❌ Нет',
    declined: 'Хорошо, не добавляем.',
    done: (n) => `🎉 Теперь вы с <b>${n}</b> друзья!`,
    accepted: (n) => `🎉 <b>${n}</b> принял(а) ваше приглашение — теперь вы видите друг друга.`,
    self: 'Это ваша собственная ссылка 🙂 Отправьте её другу.',
    already: (n) => `Вы с <b>${n}</b> уже друзья.`,
    bad: 'Ссылка устарела или неверна.',
    full: 'Достигнут предел друзей (100).',
    pickGroup: 'Чтобы друг видел вас, выберите свою группу 👇',
    whatsNew: '🆕 <b>Новинка: 👥 Друзья!</b>\n\nСмотрите, <b>в какой аудитории</b> сейчас ваши друзья и <b>когда вы оба свободны</b> сегодня — чтобы встретиться на перемене или пообедать вместе.\n\nНажмите <b>👥 Друзья</b> внизу и отправьте другу свою ссылку 👇\n\n<i>Только по расписанию — ваше местоположение никому не видно.</i>',
  },
  en: {
    btn: '👥 Friends',
    title: '👥 <b>Your friends</b>',
    empty: "No friends yet.\n\nAdd a friend and you will both see <b>which room the other one is in right now</b> and <b>when you are both free today</b> — to meet in a break or have lunch together.\n\n➕ Send your link to a friend with the button below. Once they accept, you're friends.\n\n<i>Timetable only — your location (GPS) is never shown to anyone.</i>",
    noGroup: 'ℹ️ So your friends can see you, pick your group first: /group',
    now: (room, t) => `📘 In class: ${room} · until ${t}`,
    free: (t, room) => `🟢 Free now · next class ${t}${room ? `, ${room}` : ''}`,
    after: '✅ Done for today',
    off: '🏠 No classes today',
    unknown: '❔ No group picked',
    both: (list) => `🤝 Both free: ${list}`,
    afterT: (t) => `after ${t}`,
    noCommon: '🤝 No common free time today',
    bothNow: "🤝 You're both free now",
    sum: (n, f, c) => `${n} friends · 🟢 ${f} free · 📘 ${c} in class`,
    onlyFree: '🟢 Free only', all: '👥 All', noneFree: 'None of your friends is free right now.',
    add: '➕ Add a friend',
    refresh: '🔄 Refresh',
    manage: '⚙️ Manage friends',
    manageT: "⚙️ Tap a name to remove them.\nYou will stop seeing each other.",
    back: '◀️ Back',
    removed: (n) => `✖️ ${n} removed.`,
    shareText: "Let's be friends on TDIU Jadval — we'll see which room we're in and when we're both free 👇",
    invite: (n) => `👋 <b>${n}</b> wants to add you as a friend on TDIU Jadval.\n\nYou will both see <b>which room the other one is in right now</b> and <b>your common free time</b>.\n\n<i>Timetable only — not GPS. You can remove each other any time.</i>`,
    yes: '✅ Accept',
    no: '❌ No',
    declined: "OK, not added.",
    done: (n) => `🎉 You and <b>${n}</b> are friends now!`,
    accepted: (n) => `🎉 <b>${n}</b> accepted your invite — you can see each other now.`,
    self: "That's your own link 🙂 Send it to a friend.",
    already: (n) => `You and <b>${n}</b> are already friends.`,
    bad: 'This link is outdated or wrong.',
    full: 'Friend limit reached (100).',
    pickGroup: 'So your friend can see you, pick your group now 👇',
    whatsNew: "🆕 <b>New: 👥 Friends!</b>\n\nSee <b>which room</b> your friends are in right now and <b>when you're both free</b> today — to meet in a break or have lunch together.\n\nTap <b>👥 Friends</b> below and send your link to a friend 👇\n\n<i>Timetable only — your location is never shown.</i>",
  },
};
export const ft = (lang) => FT[lang] || FT.uz;
export const FRIENDS_MAX = 100;

/** A short room name for one line: "11-bino, 204-xona" (several rooms joined with " / "). */
const roomOf = (x, lang) => (x?.l?.r ? roomLabel(x.l.r, lang) : '—');

/** Where they are, for sorting / counting: 'free' (between classes) · 'class' · 'done' (after / no classes) · 'none' (no group). */
export function friendState(entity, index, now) {
  if (!entity) return 'none';
  const st = whereIs(entity, index, now).state;
  return st === 'now' ? 'class' : st === 'before' || st === 'between' ? 'free' : 'done';
}

/** One line: where this person is right now (entity = their group's or teacher's timetable; null = nothing picked). */
export function friendStatus(entity, index, now, lang) {
  const F = ft(lang);
  if (!entity) return F.unknown;
  const st = whereIs(entity, index, now);
  if (st.state === 'now') return F.now(esc(roomOf(st.cur[0], lang)), hhmm(st.until));
  if (st.state === 'before' || st.state === 'between') return F.free(hhmm(st.next.items[0].from), esc(roomOf(st.next.items[0], lang)));
  return st.state === 'after' ? F.after : F.off;
}

/**
 * When are both free today, from now on: the gaps (15+ minutes) in which neither has a class, between the first class of the two
 * and the end of the later one's day, plus "after HH:MM" once both are done. null = one of them has no classes today (or nothing
 * picked). → { gaps: [{ from, to }], after }
 */
export function commonFree(a, b, index, now) {
  if (!a || !b) return null;
  const A = dayItems(a, index, now), B = dayItems(b, index, now);
  if (!A.length || !B.length) return null;
  const nowM = now.getUTCHours() * 60 + now.getUTCMinutes();
  const busy = [...A, ...B].map((x) => [x.from, x.to]).sort((x, y) => x[0] - y[0]);
  const start = Math.max(nowM, Math.min(A[0].from, B[0].from));
  const end = Math.max(...busy.map((x) => x[1]));
  const gaps = [];
  let t = start;
  for (const [f, e] of busy) {
    if (f > t && f - t >= 15) gaps.push({ from: t, to: f });
    t = Math.max(t, e);
  }
  return { gaps: gaps.filter((g) => g.to > nowM).slice(0, 3), after: end, done: end <= nowM };
}

export function fmtCommon(c, lang) {
  const F = ft(lang);
  if (!c) return null;
  if (c.done) return F.bothNow;
  const parts = c.gaps.map((g) => `${hhmm(g.from)}–${hhmm(g.to)}`);
  if (c.after < 22 * 60) parts.push(F.afterT(hhmm(c.after)));
  return parts.length ? F.both(parts.join(', ')) : F.noCommon;
}

/**
 * The bot's friends message, a page at a time. friends = [{ name, gname, ent }], me = my own timetable (or null).
 * Many friends: a one-line summary on top, the ones free right now first (then in class, then done for the day, then the rest),
 * PAGE per page, and a "free only" filter. → { text, pages, page }
 */
export const FR_PAGE = 8;
export function fmtFriends(friends, me, index, now, lang, { page = 0, onlyFree = false } = {}) {
  const F = ft(lang);
  if (!friends.length) return { text: `${F.title}\n\n${F.empty}`, pages: 1, page: 0 };
  const order = { free: 0, class: 1, done: 2, none: 3 };
  const all = friends.map((f) => ({ ...f, state: friendState(f.ent, index, now) }))
    .sort((a, b) => order[a.state] - order[b.state] || String(a.name).localeCompare(String(b.name)));
  const count = (k) => all.filter((f) => f.state === k).length;
  const list = onlyFree ? all.filter((f) => f.state === 'free') : all;
  const pages = Math.max(1, Math.ceil(list.length / FR_PAGE));
  page = Math.min(Math.max(0, page | 0), pages - 1);
  const out = [`${F.title} · ${hhmm(now.getUTCHours() * 60 + now.getUTCMinutes())}`];
  if (all.length > 3) out.push(`<i>${F.sum(all.length, count('free'), count('class'))}</i>`);
  if (!list.length) out.push('', F.noneFree);
  for (const f of list.slice(page * FR_PAGE, page * FR_PAGE + FR_PAGE)) {
    out.push('', `<b>${esc(f.name)}</b>${f.gname ? ` <i>(${esc(f.gname)})</i>` : ''}`, '   ' + friendStatus(f.ent, index, now, lang));
    const c = me ? fmtCommon(commonFree(me, f.ent, index, now), lang) : null;
    if (c) out.push('   ' + c);
  }
  if (!me) out.push('', F.noGroup);
  return { text: out.join('\n'), pages, page };
}
