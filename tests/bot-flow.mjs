// Simulates Telegram updates against a local Worker (wrangler dev) + mock Telegram.
import crypto from 'node:crypto';
const W = process.env.W || 'http://localhost:8787', M = 'http://localhost:8790';
const secret = crypto.createHash('sha256').update('tg:secretkey').digest('hex').slice(0, 48);
let uid = 1;
const post = (update) => fetch(W + '/tg', { method: 'POST', headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': secret }, body: JSON.stringify({ update_id: uid++, ...update }) }).then((r) => r.status);
const log = async () => (await fetch(M + '/__log')).json();
const reset = () => fetch(M + '/__reset');
const user = { id: 111, first_name: 'Ali', language_code: 'uz' };
const priv = { id: 111, type: 'private' };
const msg = (text, chat = priv, from = user) => ({ message: { message_id: 1, date: 0, chat, from, text } });
const cb = (data, chat = priv, from = user) => ({ callback_query: { id: 'c' + uid, from, data, message: { message_id: 50, chat } } });
let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? '✅' : '❌') + ' ' + name); if (!cond) { fails++; if (extra) console.log(JSON.stringify(extra, null, 1).slice(0, 1500)); } };
const texts = (l) => l.map((c) => `${c.method}: ${(c.data.text || '').slice(0, 90).replace(/\n/g, ' ⏎ ')}`);

// wrong secret is rejected
check('rejects wrong secret', (await fetch(W + '/tg', { method: 'POST', headers: { 'x-telegram-bot-api-secret-token': 'nope' }, body: '{}' })).status === 403);

await reset(); await post(msg('/start'));
let l = await log();
check('new user → welcome in Uzbek (default) + "who are you?" (student / teacher)', l.some((c) => /Assalomu alaykum/.test(c.data.text || '')) && l.some((c) => /Siz kimsiz/.test(c.data.text || '')), texts(l));
const roleKb = l.find((c) => /Siz kimsiz/.test(c.data.text || ''))?.data.reply_markup.inline_keyboard;
check('role keyboard: student / teacher + language row', roleKb?.[0]?.[0]?.callback_data === 'R:111:s' && roleKb?.[0]?.[1]?.callback_data === 'R:111:t' && roleKb?.at(-1)?.[0]?.callback_data === 'lang:uz:role:111', roleKb);
await reset(); await post(cb('lang:en:role:111'));
l = await log();
check('language switch on the role screen redraws it', l.some((c) => c.method === 'editMessageText' && /Who are you/.test(c.data.text || '')), texts(l));
await post(cb('lang:uz:role:111'));
await reset(); await post(cb('R:111:s'));
l = await log();
check('pick "student" → faculty list', l.some((c) => c.method === 'editMessageText' && /Fakultetni tanlang/.test(c.data.text || '')), texts(l));
const pickKb = l.find((c) => /Fakultetni/.test(c.data.text || ''))?.data.reply_markup.inline_keyboard;
check('language row under faculty list, Uzbek first and selected', pickKb?.at(-1)?.[0]?.callback_data === 'lang:uz:pick:111' && /✓/.test(pickKb.at(-1)[0].text), pickKb?.at(-1));

await reset(); await post(cb('lang:ru:pick:111'));
l = await log();
check('switch to RU → faculty list redrawn in Russian', l.some((c) => c.method === 'editMessageText' && /факультет/.test(c.data.text || '')), texts(l));
const facKb = l.find((c) => /факультет/.test(c.data.text || ''))?.data.reply_markup.inline_keyboard;
console.log('   faculties:', facKb?.map((r) => r[0].text).join(' | '));

await reset(); await post(cb('f:111:0'));
l = await log();
check('faculty → courses', l.some((c) => c.method === 'editMessageText' && /курс/.test(c.data.text)), texts(l));

await reset(); await post(cb('c:111:0:0:0'));
l = await log();
const grpKb = l.find((c) => c.method === 'editMessageText')?.data.reply_markup.inline_keyboard;
check('course → groups', grpKb && grpKb[0][0].callback_data.startsWith('g:111:'), texts(l));

await reset(); await post(cb('g:111:1thm8e1'));
l = await log();
check('group chosen → saved + today schedule + main keyboard', l.some((c) => /MO-901\/26/.test(c.data.text || '') && /сохранена/.test(c.data.text)) && l.some((c) => c.data.reply_markup?.keyboard), texts(l));

await reset(); await post(cb('g:222:1thm8e1'));
l = await log();
check("someone else's menu is refused", l.some((c) => c.method === 'answerCallbackQuery' && c.data.show_alert), texts(l));

await reset(); await post(msg('🗓 Неделя'));
l = await log();
check('week button (RU) → text week with Russian subject names (picture is Uzbek-only)', !l.some((c) => c.method === 'sendPhoto') && l.some((c) => c.method === 'sendMessage' && /Расписание на неделю/i.test(c.data.text || '') && /[А-Яа-я]{4}/.test((c.data.text || '').replace(/Расписание на неделю/gi, ''))), texts(l));

await reset(); await post(msg('/tomorrow'));
l = await log();
check('/tomorrow', l.some((c) => /MO-901/.test(c.data.text || '')), texts(l));
console.log('\n' + l[0]?.data.text + '\n');

l = await log();
const tabs = l[0]?.data.reply_markup?.inline_keyboard;
check('day message has 6 day tabs', tabs && tabs[0].length === 6 && tabs[0][0].callback_data.startsWith('day:'), tabs);
await reset(); await post(cb('day:2:0'));
l = await log();
check('tapping a day tab edits the message to that day', l.some((c) => c.method === 'editMessageText' && /Среда/.test(c.data.text) && /• Ср •/.test(JSON.stringify(c.data.reply_markup))), texts(l));
await reset(); await post(cb('day:0:1'));
l = await log();
check('next-week tab works', l.some((c) => c.method === 'editMessageText' && /Понедельник/.test(c.data.text)), texts(l));

await reset(); await post(msg('bha 80'));
l = await log();
check('free text search "bha 80" → buttons', l.some((c) => c.data.reply_markup?.inline_keyboard?.flat().some((b) => /BHA-80/.test(b.text))), texts(l));

await reset(); await post(msg('zzzz'));
l = await log();
check('search nothing found', l.some((c) => /Ничего не найдено/.test(c.data.text || '')), texts(l));

await reset(); await post(msg('/settings'));
await post(cb('s:alerts'));
l = await log();
check('settings + toggle alerts', l.some((c) => c.method === 'editMessageText' && /выкл/.test(c.data.text)), texts(l));
await post(cb('s:alerts'));

await reset(); await post({ message: { message_id: 1, chat: priv, from: user, text: '/start g_fcrgrf' } });
l = await log();
check('deep link /start g_<id> sets group BHA-80/25', l.some((c) => /BHA-80\/25/.test(c.data.text || '')), texts(l));
const menuOf = (l, id) => l.filter((c) => c.method === 'setChatMenuButton' && c.data.chat_id === id).at(-1)?.data.menu_button;
check("choosing a group re-points this chat's menu button (#g=…&l=…)", /#g=fcrgrf&l=\w\w$/.test(menuOf(l, 111)?.web_app?.url || ''), menuOf(l, 111));

// ---- group chat
const grp = { id: -100500, type: 'supergroup', title: 'MO-901' };
await reset();
await post({ my_chat_member: { chat: grp, from: user, date: 0, old_chat_member: { status: 'left', user: { id: 1 } }, new_chat_member: { status: 'administrator', user: { id: 1 } } } });
l = await log();
check('bot added to group → greeting', l.some((c) => c.data.chat_id === -100500 && /setgroup/.test(c.data.text || '')), texts(l));

await reset(); await post(msg('/setgroup@tsue_test_bot', grp, { id: 333, first_name: 'Vali' }));
l = await log();
check('non-admin /setgroup refused', l.some((c) => /Faqat chat adminlari/.test(c.data.text || '')), texts(l));

await reset(); await post(msg('/setgroup', grp));
await post(cb('g:111:1thm8e1', grp));
l = await log();
check('admin /setgroup → linked + weekly post', l.some((c) => /ulandi/.test(c.data.text || '')) && l.some((c) => c.method === 'sendPhoto' && /haftalik jadval/.test(c.data.caption || '')), texts(l));
check('group link message has language row', l.some((c) => /ulandi/.test(c.data.text || '') && c.data.reply_markup?.inline_keyboard?.[0]?.[0]?.callback_data === 'lang:uz:chat'), texts(l));
await reset(); await post(cb('lang:ru:chat', grp));
l = await log();
check('admin switches group chat to RU', l.some((c) => c.method === 'editMessageText' && /привязан/.test(c.data.text || '')), texts(l));

await reset(); await post(msg('/today', grp, { id: 444 }));
l = await log();
check('anyone can /today in group', l.some((c) => c.data.chat_id === -100500 && /MO-901/.test(c.data.text || '')), texts(l));

// ---- invite friends / social proof / first-time group-chat tip
// Chat 111 is already on BHA-80/25 (fcrgrf) from the deep-link test above — a second private
// user picking the same group should see the "N groupmates already here" count.
const user2 = { id: 555, first_name: 'Olim', language_code: 'uz' };
const priv2 = { id: 555, type: 'private' };
await reset(); await post(msg('/start', priv2, user2));
await post(cb('g:555:fcrgrf', priv2, user2));
l = await log();
check('invite message shows groupmate count', l.some((c) => /yana 1 kishi botdan foydalanmoqda/.test(c.data.text || '') && c.data.reply_markup?.inline_keyboard?.[0]?.[0]?.url?.includes('t.me/share/url')), texts(l));
check('first-time setup shows the group-chat tip', l.some((c) => /guruh chatingizga ham qo'shing/.test(c.data.text || '')), texts(l));

// Picking a *different* group the second time should not repeat the one-time tip
await reset(); await post(cb('g:555:1thm8e1', priv2, user2));
l = await log();
check('switching groups later does not repeat the group-chat tip', !l.some((c) => /guruh chatingizga ham qo'shing/.test(c.data.text || '')), texts(l));

// ---- /calendar (hidden for now — CALENDAR_ENABLED = false)
await reset(); await post(msg('/calendar', priv2, user2));
l = await log();
check('/calendar is hidden: falls back to help, no .ics link', !l.some((c) => /Kalendarga obuna bo'ling/.test(c.data.text || '')) && l.some((c) => c.method === 'sendMessage'), texts(l));
await reset(); await post(msg('/settings', priv2, user2));
l = await log();
check('settings has no calendar button while hidden', !l.some((c) => c.data.reply_markup?.inline_keyboard?.flat().some((b) => /Kalendar/.test(b.text))), texts(l));

// ---- /feedback — now also shown as a Settings button, and forwarded to the admin's own DMs
check('settings shows a prominent feedback button', l.some((c) => c.data.reply_markup?.inline_keyboard?.flat().some((b) => /Taklif yoki xato yuborish/.test(b.text))), texts(l));
await reset(); await post(cb('s:feedback', priv2, user2));
l = await log();
check('settings feedback button shows the prompt', l.some((c) => /Taklif yoki xatoni yozing/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/feedback', priv2, user2));
l = await log();
check('/feedback with no text shows the prompt', l.some((c) => /Taklif yoki xatoni yozing/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/feedback Xona nomi notogri korsatilmoqda', priv2, user2));
l = await log();
check('/feedback with text is accepted', l.some((c) => /Rahmat! Xabaringiz qabul qilindi/.test(c.data.text || '')), texts(l));
check('/feedback is forwarded to ADMIN_CHAT_ID as a DM', l.some((c) => c.method === 'sendMessage' && String(c.data.chat_id) === '999999' && /Xona nomi/.test(c.data.text || '')), texts(l));

// ---- group chats: daily "tomorrow's classes" reminder (default 21:00, admin can change the time)
await post(cb('lang:uz:chat', grp)); // the group was switched to Russian above — back to Uzbek
await reset(); await post(msg('/setgroup', grp)); await post(cb('g:111:1thm8e1', grp));
l = await log();
check('group link message announces the daily reminder at 21:00 and /time', l.some((c) => /ulandi/.test(c.data.text || '') && /21:00/.test(c.data.text) && /\/time/.test(c.data.text)), texts(l));
await reset(); await post(msg('/time', grp, { id: 333, first_name: 'Vali' }));
l = await log();
check('non-admin /time refused in a group', l.some((c) => /Faqat chat adminlari/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/time', grp));
l = await log();
const timeKb = l.find((c) => /Ertangi darslar eslatmasi/.test(c.data.text || ''))?.data.reply_markup?.inline_keyboard;
check('/time shows the time picker with 21:00 selected', timeKb && timeKb.flat().some((b) => b.callback_data === 'rt:1260' && /✓/.test(b.text)) && timeKb.flat().some((b) => b.callback_data === 'rt:-1'), l);
await reset(); await post(cb('rt:1200', grp));
l = await log();
check('picking 20:00 saves it and confirms', l.some((c) => c.method === 'editMessageText' && /20:00/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/time 21.30', grp));
l = await log();
check('/time 21.30 → 21:30', l.some((c) => /21:30/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/time abc', grp));
l = await log();
check('/time with garbage → format hint', l.some((c) => /<code>\/time 21:00<\/code>/.test(c.data.text || '')), texts(l));
const rowsAt = async (from, to) => (await (await fetch(`${W}/internal/subs?mode=tomorrow&from=${from}&to=${to}`, { headers: { 'x-admin-key': 'secretkey' } })).json()).rows;
check('reminder window (21:15–21:45] includes the group (21:30)', (await rowsAt(1275, 1305)).some((r) => r.chat_id === -100500));
check('reminder window (21:30–22:00] excludes it (window is open at the start)', !(await rowsAt(1290, 1320)).some((r) => r.chat_id === -100500));
check('reminder window (20:00–21:00] excludes it too', !(await rowsAt(1200, 1260)).some((r) => r.chat_id === -100500));
await post(msg('/time off', grp));
check('/time off → group is no longer in any reminder window', !(await rowsAt(-1, 1439)).some((r) => r.chat_id === -100500));
const allTmr = await (await fetch(W + '/internal/subs?mode=tomorrow', { headers: { 'x-admin-key': 'secretkey' } })).json();
check('mode=tomorrow without a window = everyone who has it on (not the group, it is off)', allTmr.rows.length >= 2 && !allTmr.rows.some((r) => r.chat_id === -100500), allTmr);
await post(msg('/time 21:00', grp));
check('back to 21:00 → in the (20:55–21:05] window', (await rowsAt(1255, 1265)).some((r) => r.chat_id === -100500));
await reset(); await post(msg('/time 20:30', priv2, user2));
l = await log();
check('private chats can set their own reminder time too', l.some((c) => /20:30/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/settings', priv2, user2));
l = await log();
check('settings shows the reminder time + a button for it', l.some((c) => /20:30/.test(c.data.text || '') && c.data.reply_markup?.inline_keyboard?.flat().some((b) => b.callback_data === 's:time')), texts(l));
await reset(); await post(cb('s:time', priv2, user2));
l = await log();
check('settings → reminder button opens the picker', l.some((c) => c.method === 'editMessageText' && c.data.reply_markup?.inline_keyboard?.flat().some((b) => b.callback_data === 'rt:1260')), texts(l));
await post(msg('/time 21:00', priv2, user2));

// ---- teachers
const tUser = { id: 777, first_name: 'Dilshod', language_code: 'uz' };
const tPriv = { id: 777, type: 'private' };
await reset(); await post(msg('/start', tPriv, tUser));
await post(cb('R:777:t', tPriv, tUser));
l = await log();
const letterKb = l.find((c) => c.method === 'editMessageText' && /O'qituvchini tanlang/.test(c.data.text || ''))?.data.reply_markup.inline_keyboard;
check('teacher role → letter picker', letterKb && letterKb.flat().some((b) => b.callback_data === 'tl:777:K:0'), texts(l));
await reset(); await post(cb('tl:777:K:0', tPriv, tUser));
l = await log();
const tKb = l.find((c) => c.method === 'editMessageText')?.data.reply_markup.inline_keyboard;
check('letter K → teachers whose surname starts with K', tKb && tKb.flat().some((b) => /Karimov Dilshod/.test(b.text) && b.callback_data === 'tp:777:thf5rej'), texts(l));
await reset(); await post(cb('tp:777:thf5rej', tPriv, tUser));
l = await log();
check('teacher picked → saved + today/tomorrow-style schedule + main keyboard', l.some((c) => /O'qituvchi saqlandi/.test(c.data.text || '') && /Karimov Dilshod/.test(c.data.text)) && l.some((c) => /👤 Karimov Dilshod/.test(c.data.text || '') && c.data.reply_markup?.keyboard), texts(l));
check("choosing a teacher re-points the menu button (#t=…)", /#t=thf5rej&l=uz$/.test(menuOf(l, 777)?.web_app?.url || ''), menuOf(l, 777));
check('teacher gets the "alerts will come here" tip once', l.some((c) => /jadvalingiz o'zgarsa/i.test(c.data.text || '')), texts(l));
await reset(); await post(cb('lang:ru:start', tPriv, tUser));
l = await log();
check('language change → menu button text + link follow (Russian)', /Расписание/.test(menuOf(l, 777)?.text || '') && /l=ru$/.test(menuOf(l, 777)?.web_app?.url || ''), menuOf(l, 777));
await post(cb('lang:uz:start', tPriv, tUser));
const tUser2 = { id: 778, first_name: 'Sevara', language_code: 'uz' };
const tPriv2 = { id: 778, type: 'private' };
await reset(); await post({ message: { message_id: 1, chat: tPriv2, from: tUser2, text: '/start t_thf5rej' } });
l = await log();
check('shared teacher link /start t_<id> saves the teacher', l.some((c) => /O'qituvchi saqlandi/.test(c.data.text || '') && /Karimov Dilshod/.test(c.data.text)), texts(l));
await reset(); await post(msg('/week', tPriv, tUser));
l = await log();
check('teacher /week → picture from /img/t/<id>.png', l.some((c) => c.method === 'sendPhoto' && /\/img\/t\/thf5rej\.png/.test(c.data.photo)), texts(l));
await reset(); await post(msg('/today', tPriv, tUser));
l = await log();
check('teacher /today shows 👤 header and which groups attend', l.some((c) => /👤 Karimov Dilshod/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('karimov fax', tPriv, tUser));
l = await log();
check('teacher types a surname → search buttons', l.some((c) => c.data.reply_markup?.inline_keyboard?.flat().some((b) => /Karimov Faxriddin/.test(b.text) && b.callback_data === 'tp:777:t1c51c9b')), texts(l));
await reset(); await post(msg('Каримов', tPriv, tUser));
l = await log();
check('Cyrillic query is transliterated (Каримов → Karimov)', l.some((c) => c.data.reply_markup?.inline_keyboard?.flat().some((b) => /Karimov/.test(b.text))), texts(l));
await reset(); await post(msg('/settings', tPriv, tUser));
l = await log();
check('settings shows the teacher + role switch button', l.some((c) => /O'qituvchi: Karimov Dilshod/.test(c.data.text || '') && c.data.reply_markup?.inline_keyboard?.flat().some((b) => b.callback_data === 's:role')), texts(l));
const subsT = await (await fetch(W + '/internal/subs?mode=alerts', { headers: { 'x-admin-key': 'secretkey' } })).json();
check('internal subs marks the teacher (role=teacher, group_id=teacher id)', subsT.rows.some((r) => r.chat_id === 777 && r.role === 'teacher' && r.group_id === 'thf5rej'), subsT);
await reset(); await post(cb('s:role', tPriv, tUser));
await post(cb('R:777:s', tPriv, tUser));
l = await log();
check('switching to "student" clears the teacher and asks for a faculty', l.some((c) => c.method === 'editMessageText' && /Fakultetni tanlang/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/today', tPriv, tUser));
l = await log();
check('after the switch there is no timetable yet (asks to choose a group)', l.some((c) => /guruh tanlamagansiz/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/teacher karimov dil', tPriv, tUser));
l = await log();
check('/teacher <surname> searches directly', l.some((c) => c.data.reply_markup?.inline_keyboard?.flat().some((b) => b.callback_data === 'tp:777:thf5rej')), texts(l));
await post(cb('tp:777:thf5rej', tPriv, tUser));

// ---- the admin answers feedback: Reply to the forwarded DM → goes to that user, in their language
await reset(); await post(msg('/feedback Salom, jadvalda xato bor', priv2, user2));
l = await log();
const fwd = l.find((c) => c.method === 'sendMessage' && String(c.data.chat_id) === '999999' && /jadvalda xato/.test(c.data.text || ''));
check('feedback DM tells the admin how to reply', fwd && /Reply/.test(fwd.data.text), texts(l));
const admin = { id: 999999, first_name: 'Admin' };
const adminChat = { id: 999999, type: 'private' };
await reset();
await post({ message: { message_id: 7, date: 0, chat: adminChat, from: admin, text: 'Rahmat, tuzatdik!', reply_to_message: { message_id: fwd.result.message_id } } });
l = await log();
check('admin Reply → the user receives the answer', l.some((c) => c.method === 'sendMessage' && c.data.chat_id === 555 && /Rahmat, tuzatdik!/.test(c.data.text) && /TDIU Jadval jamoasidan javob/.test(c.data.text)), texts(l));
check('admin gets a delivery confirmation', l.some((c) => String(c.data.chat_id) === '999999' && /Javob yuborildi/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/reply 555 /reply orqali javob', adminChat, admin));
l = await log();
check('/reply <chat_id> text works as a fallback', l.some((c) => c.data.chat_id === 555 && /\/reply orqali javob/.test(c.data.text || '')), texts(l));
await reset(); await post(msg('/reply xato', adminChat, admin));
l = await log();
check('/reply without an id shows the format', l.some((c) => /Format: <code>\/reply/.test(c.data.text || '')), texts(l));
await reset(); await post({ message: { message_id: 8, date: 0, chat: priv2, from: user2, text: 'men ham yozaman', reply_to_message: { message_id: fwd.result.message_id } } });
l = await log();
check("an ordinary user's reply is NOT relayed to anyone", !l.some((c) => c.data.chat_id === 555 && /jamoasidan javob/.test(c.data.text || '')) && !l.some((c) => String(c.data.chat_id) === '999999' && /men ham yozaman/.test(c.data.text || '')), texts(l));
await post(cb('lang:ru:start', priv2, user2)); // chat 555 → Russian: the answer must arrive in Russian
await reset();
await post({ message: { message_id: 9, date: 0, chat: adminChat, from: admin, text: 'Исправили', reply_to_message: { message_id: fwd.result.message_id } } });
l = await log();
check('the answer arrives in the user’s own language (RU)', l.some((c) => c.data.chat_id === 555 && /Ответ команды/.test(c.data.text || '')), texts(l));
await post(cb('lang:uz:start', priv2, user2));

// ---- internal API
const subs = await (await fetch(W + '/internal/subs?mode=weekly', { headers: { 'x-admin-key': 'secretkey' } })).json();
check('internal subs (weekly) lists the group chat', subs.rows.some((r) => r.chat_id === -100500 && r.group_id === '1thm8e1'), subs);
const subsA = await (await fetch(W + '/internal/subs?mode=alerts', { headers: { 'x-admin-key': 'secretkey' } })).json();
check('internal subs (alerts) has both private users + the group (+ the two teachers)', subsA.rows.length === 5 && subsA.rows.some((r) => r.chat_id === 111) && subsA.rows.some((r) => r.chat_id === 555) && subsA.rows.some((r) => r.chat_id === -100500), subsA);
check('internal API needs key', (await fetch(W + '/internal/subs?mode=alerts')).status === 403);
const st = await (await fetch(W + '/internal/stats', { headers: { 'x-admin-key': 'secretkey' } })).json();
console.log('   stats:', JSON.stringify(st));
check('stats include the feedback message', st.feedback?.some((f) => /Xona nomi/.test(f.text)), st.feedback);

// mode=all reaches every chat with a group, even ones that toggled alerts off
await post(cb('s:alerts', priv2, user2)); // chat 555 turns its own change-alerts off
const subsAll = await (await fetch(W + '/internal/subs?mode=all', { headers: { 'x-admin-key': 'secretkey' } })).json();
const subsAlertsOnly = await (await fetch(W + '/internal/subs?mode=alerts', { headers: { 'x-admin-key': 'secretkey' } })).json();
check('mode=all includes a chat with alerts off', subsAll.rows.some((r) => r.chat_id === 555), subsAll);
check('mode=alerts excludes that same chat', !subsAlertsOnly.rows.some((r) => r.chat_id === 555), subsAlertsOnly);
await post(cb('s:alerts', priv2, user2)); // turn it back on, tidy

// setup endpoint
await reset();
const setup = await (await fetch(W + '/setup?key=secretkey')).json();
l = await log();
check('/setup sets webhook, commands, menu button', setup.ok && l.some((c) => c.method === 'setWebhook' && c.data.secret_token === secret) && l.some((c) => c.method === 'setChatMenuButton'), setup);
check('/setup command list omits /calendar while hidden', l.filter((c) => c.method === 'setMyCommands').every((c) => !c.data.commands.some((cmd) => cmd.command === 'calendar')), texts(l));

// bot removed from group
await post({ my_chat_member: { chat: grp, from: user, date: 0, old_chat_member: { status: 'administrator', user: { id: 1 } }, new_chat_member: { status: 'left', user: { id: 1 } } } });
const subs2 = await (await fetch(W + '/internal/subs?mode=weekly', { headers: { 'x-admin-key': 'secretkey' } })).json();
check('bot removed → chat deleted', !subs2.rows.some((r) => r.chat_id === -100500), subs2);

console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
process.exit(fails ? 1 : 0);
