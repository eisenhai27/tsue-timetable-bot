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
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
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
check(`the main Timetable workflow keeps its pace — at most every 9 minutes (${r.main} a day with a 10-minute cron)`, r.main >= 130 && r.main <= 144, r.main);
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
check('each moment is handed out 0–11 minutes before it', handed.every(([m, at]) => toMin(at) - m >= 0 && toMin(at) - m <= 11), handed);

console.log(fails ? `\n${fails} lessons-cron check(s) failed` : '\nAll lessons-cron checks passed ✅');
process.exit(fails ? 1 : 0);
