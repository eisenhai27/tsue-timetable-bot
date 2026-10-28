import { prettyText } from './shared.mjs';

/** Outgoing Telegram request with the visible texts (text, caption, inline button labels) passed through prettyText — never ids,
 * callback data or reply-keyboard buttons (their text comes back to the bot as a message and must match exactly). */
export function prettyBody(body) {
  if (!body || typeof body !== 'object') return body;
  let out = body;
  for (const k of ['text', 'caption']) if (typeof body[k] === 'string' && body[k].includes('`')) out = { ...out, [k]: prettyText(body[k]) };
  const kb = body.reply_markup;
  const fixRows = (rows) => rows.map((r) => (Array.isArray(r) ? r.map((b) => (b && typeof b.text === 'string' && b.text.includes('`') ? { ...b, text: prettyText(b.text) } : b)) : r));
  if (kb && Array.isArray(kb.inline_keyboard)) out = { ...out, reply_markup: { ...kb, inline_keyboard: fixRows(kb.inline_keyboard) } };
  return out;
}
