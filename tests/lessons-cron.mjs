// The Worker's cron tick hands the lessons workflow only the fixed moments of the school day (lessonRunPlan), once each,
// looking ahead to the next tick — never on Sunday, never at night — and keeps the main workflow at its usual pace.
// In-process: the Worker module with an in-memory database and a stubbed fetch, so the ticks can run at any time of day.
import fs from 'node:fs';
import { fakeD1 } from './d1-shim.mjs';
import { lessonRunPlan, clock } from '../src/lessons.mjs';

let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? '✅' : '❌') + ' ' + name); if (!cond) { fails++; if (extra !== undefined) console.log(JSON.stringify(extra, null, 1).slice(0, 1500)); } };
const indexText = fs.readFileSync(new URL('../docs/data/index.json', import.meta.url), 'utf8');
const plan = lessonRunPlan(JSON.parse(indexText).periods).map(clock);

const calls = [];
let ghStatus = 204;
const tgSent = [];
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (url.includes('api.telegram.org')) { tgSent.push(JSON.parse(init.body || '{}')); return new Response('{"ok":true,"result":{}}'); }
  if (/\/dispatches$/.test(url) && ghStatus !== 204) return new Response('Bad credentials', { status: ghStatus });
  if (url.endsWith('/data/index.json')) return new Response(indexText, { headers: { 'content-type': 'application/json' } });
  if (/\/dispatches$/.test(url)) { calls.push({ file: /workflows\/([^/]+)\/dispatches/.exec(url)[1], body: JSON.parse(init.body || '{}') }); return new Response(null, { status: 204 }); }
  return new Response('{}', { status: 404 });
};
const { default: worker } = await import('../worker/worker.mjs');
const DB = fakeD1(); // one database (the Worker sets its tables up once per process); each scenario starts from a clean state
const env = () => { try { DB._db.exec('DELETE FROM admin_state'); } catch {} return { DB, GITHUB_PAT: 'x', GITHUB_REPO: 'me/repo', SITE_URL: 'https://site.example' }; };
const tk = (day, min) => Date.parse(`${day}T00:00:00Z`) - 5 * 3600e3 + min * 60e3; // Tashkent minute → real ms
async function dayOfTicks(e, day, every) {
  calls.length = 0;
  for (let m = 0; m < 24 * 60; m += every) await worker.scheduled({ scheduledTime: tk(day, m), cron: '' }, e, { waitUntil() {} });
  return { lessons: calls.filter((c) => c.file === 'lessons.yml').map((c) => c.body.inputs?.at), main: calls.filter((c) => c.file === 'timetable.yml').length };
}
const sorted = (a) => JSON.stringify([...a].sort());

// a Tuesday, cron every 10 minutes
const e1 = env();
let r = await dayOfTicks(e1, '2026-10-27', 10);
check(`every planned moment is handed out exactly once (${r.lessons.length} of ${plan.length})`, sorted(r.lessons) === sorted(plan), { got: r.lessons, plan });
check(`the main Timetable workflow: every ~10 min by day, hourly 22:00–05:00 (${r.main} a day with a 10-minute cron)`, r.main >= 100 && r.main <= 112, r.main);
check('nothing for the lessons workflow at night', !r.lessons.some((a) => a < '07:00' || a > '22:00'), r.lessons);
// Sunday
r = await dayOfTicks(env(), '2026-11-01', 10);
check('Sunday: the lessons workflow is never woken', r.lessons.length === 0, r.lessons);
// a slower cron, and a faster one
r = await dayOfTicks(env(), '2026-10-28', 15);
check(`with a 15-minute cron every moment still comes, once (${r.lessons.length})`, sorted(r.lessons) === sorted(plan), r.lessons);
r = await dayOfTicks(env(), '2026-10-29', 1);
check(`with a 1-minute cron: still each moment once (${r.lessons.length}), the main workflow still only every ~9 min (${r.main})`, sorted(r.lessons) === sorted(plan) && r.main <= 160, { l: r.lessons, main: r.main });
// the hand-out comes before the moment, never more than one tick + a minute ahead
calls.length = 0;
const e2 = env();
const handed = [];
for (let m = 0; m < 24 * 60; m += 10) {
  const before = calls.length;
  await worker.scheduled({ scheduledTime: tk('2026-10-27', m), cron: '' }, e2, { waitUntil() {} });
  for (const c of calls.slice(before)) if (c.file === 'lessons.yml') handed.push([m, c.body.inputs.at]);
}
const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
check('each moment is handed out 5–16 minutes before it (time for GitHub to start the job)', handed.every(([m, at]) => toMin(at) - m >= 5 && toMin(at) - m <= 16), handed);

// at night the main workflow runs hourly — but a chat whose own "tomorrow's classes" time is 22:35 still gets it on time
{
  const e3 = env();
  DB._db.exec("DELETE FROM chats"); DB._db.exec("INSERT INTO chats (chat_id, kind, remind_at) VALUES (1, 'private', 1355)");
  calls.length = 0;
  const mains = [];
  for (let m = 21 * 60; m < 24 * 60; m += 10) { const n = calls.length; await worker.scheduled({ scheduledTime: tk('2026-10-27', m), cron: '' }, e3, { waitUntil() {} }); if (calls.slice(n).some((c) => c.file === 'timetable.yml')) mains.push(clock(m)); }
  check(`night: hourly, plus right after a chat's own reminder time 22:35 (${mains.join(' ')})`, mains.includes('22:40') && mains.filter((t) => t >= '22:00').length <= 4, mains);
  DB._db.exec("DELETE FROM chats");
}

// the GitHub wake-up starts failing (expired token): the admin is told once, not on every tick; and once when it works again
{
  const e4 = { ...env(), ADMIN_CHAT_ID: '42', BOT_TOKEN: 'b' };
  tgSent.length = 0; ghStatus = 401;
  for (let m = 12 * 60; m < 13 * 60; m += 10) await worker.scheduled({ scheduledTime: tk('2026-10-27', m), cron: '' }, e4, { waitUntil() {} });
  const warn = tgSent.filter((b) => /GitHub'ni uyg'otib bo'lmayapti/.test(b.text || ''));
  check(`a failing token: ONE warning to the admin (${warn.length}), naming the error`, warn.length === 1 && /401/.test(warn[0].text) && warn[0].chat_id === 42, tgSent);
  ghStatus = 204; tgSent.length = 0;
  for (let m = 13 * 60; m < 13 * 60 + 30; m += 10) await worker.scheduled({ scheduledTime: tk('2026-10-27', m), cron: '' }, e4, { waitUntil() {} });
  check('…and one "works again" message once it is fixed', tgSent.filter((b) => /tiklandi/.test(b.text || '')).length === 1, tgSent);
}

console.log(fails ? `\n${fails} lessons-cron check(s) failed` : '\nAll lessons-cron checks passed ✅');
process.exit(fails ? 1 : 0);
