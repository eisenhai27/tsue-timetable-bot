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
check('new user → language picker', l.some((c) => c.method === 'sendMessage' && c.data.reply_markup?.inline_keyboard?.[0]?.[0]?.callback_data === 'lang:uz:start'), l);

await reset(); await post(cb('lang:ru:start'));
l = await log();
check('choose RU → welcome in Russian + faculty list', l.some((c) => /Здравствуйте/.test(c.data.text || '')) && l.some((c) => /факультет/.test(c.data.text || '')), texts(l));
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
check('week button (RU) → weekly picture with caption', l.some((c) => c.method === 'sendPhoto' && /\/img\/g\/.+\.png/.test(c.data.photo) && /расписание на неделю/.test(c.data.caption)), texts(l));

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

await reset(); await post(msg('/today', grp, { id: 444 }));
l = await log();
check('anyone can /today in group', l.some((c) => c.data.chat_id === -100500 && /MO-901/.test(c.data.text || '')), texts(l));

// ---- internal API
const subs = await (await fetch(W + '/internal/subs?mode=weekly', { headers: { 'x-admin-key': 'secretkey' } })).json();
check('internal subs (weekly) lists the group chat', subs.rows.some((r) => r.chat_id === -100500 && r.group_id === '1thm8e1'), subs);
const subsA = await (await fetch(W + '/internal/subs?mode=alerts', { headers: { 'x-admin-key': 'secretkey' } })).json();
check('internal subs (alerts) has private user + group', subsA.rows.length === 2, subsA);
check('internal API needs key', (await fetch(W + '/internal/subs?mode=alerts')).status === 403);
const st = await (await fetch(W + '/internal/stats', { headers: { 'x-admin-key': 'secretkey' } })).json();
console.log('   stats:', JSON.stringify(st));

// setup endpoint
await reset();
const setup = await (await fetch(W + '/setup?key=secretkey')).json();
l = await log();
check('/setup sets webhook, commands, menu button', setup.ok && l.some((c) => c.method === 'setWebhook' && c.data.secret_token === secret) && l.some((c) => c.method === 'setChatMenuButton'), setup);

// bot removed from group
await post({ my_chat_member: { chat: grp, from: user, date: 0, old_chat_member: { status: 'administrator', user: { id: 1 } }, new_chat_member: { status: 'left', user: { id: 1 } } } });
const subs2 = await (await fetch(W + '/internal/subs?mode=weekly', { headers: { 'x-admin-key': 'secretkey' } })).json();
check('bot removed → chat deleted', !subs2.rows.some((r) => r.chat_id === -100500), subs2);

console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
process.exit(fails ? 1 : 0);
