// Prints how many chats use the bot, by reading the Worker's /internal/stats endpoint.
//   node scripts/stats.mjs
// Env: WORKER_URL, ADMIN_KEY

const { WORKER_URL, ADMIN_KEY } = process.env;
if (!WORKER_URL || !ADMIN_KEY) throw new Error('WORKER_URL and ADMIN_KEY must be set');

const res = await fetch(`${WORKER_URL.replace(/\/+$/, '')}/internal/stats`, {
  headers: { 'X-Admin-Key': ADMIN_KEY },
});
if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
const { stats } = await res.json();

const labels = { private: 'Shaxsiy chatlar (talabalar)', group: 'Guruh chatlari' };
console.log('--- Foydalanuvchilar statistikasi ---');
let total = 0;
for (const s of stats) {
  console.log(`${labels[s.kind] || s.kind}: ${s.n} ta (guruhini tanlagan: ${s.with_group})`);
  total += s.n;
}
console.log(`Jami: ${total} ta chat`);
