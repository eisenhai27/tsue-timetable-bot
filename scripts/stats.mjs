// Prints how many chats use the bot and recent student feedback, by reading the
// Worker's /internal/stats endpoint.
//   node scripts/stats.mjs
// Env: WORKER_URL, ADMIN_KEY

const { WORKER_URL, ADMIN_KEY } = process.env;
if (!WORKER_URL || !ADMIN_KEY) throw new Error('WORKER_URL and ADMIN_KEY must be set');

const res = await fetch(`${WORKER_URL.replace(/\/+$/, '')}/internal/stats`, {
  headers: { 'X-Admin-Key': ADMIN_KEY },
});
if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
const { stats, feedback } = await res.json();

const labels = { private: 'Shaxsiy chatlar (talabalar)', group: 'Guruh chatlari' };
console.log('--- Foydalanuvchilar statistikasi ---');
let total = 0;
for (const s of stats) {
  console.log(`${labels[s.kind] || s.kind}: ${s.n} ta (guruhini tanlagan: ${s.with_group})`);
  total += s.n;
}
console.log(`Jami: ${total} ta chat`);

console.log('\n--- So\'nggi fikr-mulohazalar (eng oxirgi 20 tasi) ---');
if (!feedback?.length) {
  console.log('(hali hech kim yozmagan)');
} else {
  for (const f of feedback) {
    const when = new Date(f.created_at).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    console.log(`[${when}] ${f.name || 'anonim'} (chat ${f.chat_id}): ${f.text}`);
  }
}
