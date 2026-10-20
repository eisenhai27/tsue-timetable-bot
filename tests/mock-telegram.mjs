// Fake Telegram Bot API for local tests: records every call, answers "ok".
import http from 'node:http';
import fs from 'node:fs';
const log = [];
let msgId = 100;
http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const method = req.url.split('/').pop();
    if (req.url === '/__log') { res.end(JSON.stringify(log)); return; }
    if (req.url === '/__reset') { log.length = 0; res.end('ok'); return; }
    const multipart = /multipart\/form-data/.test(req.headers['content-type'] || '');
    // (a picture upload: only the chat id is of interest to the tests)
    const data = multipart ? { multipart: true, chat_id: Number(/name="chat_id"\r\n\r\n(-?\d+)/.exec(body)?.[1]) } : body ? JSON.parse(body) : {};
    const entry = { method, data, bot: (req.url.split('/')[1] || '').slice(3) }; // which bot's token made the call
    log.push(entry);
    let result = true;
    if (method === 'sendMessage') result = { message_id: ++msgId, chat: { id: data.chat_id }, text: data.text };
    if (multipart && method === 'sendPhoto') result = { message_id: ++msgId, chat: { id: data.chat_id }, photo: [{ file_id: 'SMALL_FILE_ID_0001', width: 90, height: 90 }, { file_id: 'UPLOADED_FILE_ID_0001', width: 800, height: 600 }] };
    if (method === 'getChatMember') result = { status: data.user_id === 111 ? 'administrator' : 'member' };
    if (method === 'getMe') result = { id: 1, username: 'tsue_test_bot' };
    if (method === 'getMyCommands') result = [{ command: 'today', description: 'Bugungi darslar' }, { command: 'help', description: 'Yordam' }];
    // simulate a chat where sending fails for a reason that is worth retrying later (Telegram 5xx)
    if ((method === 'sendMessage' || method === 'sendPhoto') && data.chat_id === 998) { res.end(JSON.stringify({ ok: false, error_code: 500, description: 'Internal Server Error' })); return; }
    // simulate a blocked user
    if (method === 'sendMessage' && data.chat_id === 999) { res.end(JSON.stringify({ ok: false, error_code: 403, description: 'Forbidden: bot was blocked by the user' })); return; }
    entry.result = result;
    res.end(JSON.stringify({ ok: true, result }));
  });
}).listen(8790, () => console.log('mock telegram on 8790'));
