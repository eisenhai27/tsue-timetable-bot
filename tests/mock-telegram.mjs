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
    const data = body ? JSON.parse(body) : {};
    log.push({ method, data });
    let result = true;
    if (method === 'sendMessage') result = { message_id: ++msgId, chat: { id: data.chat_id }, text: data.text };
    if (method === 'getChatMember') result = { status: data.user_id === 111 ? 'administrator' : 'member' };
    if (method === 'getMe') result = { id: 1, username: 'tsue_test_bot' };
    // simulate a blocked user
    if (method === 'sendMessage' && data.chat_id === 999) { res.end(JSON.stringify({ ok: false, error_code: 403, description: 'Forbidden: bot was blocked by the user' })); return; }
    res.end(JSON.stringify({ ok: true, result }));
  });
}).listen(8790, () => console.log('mock telegram on 8790'));
