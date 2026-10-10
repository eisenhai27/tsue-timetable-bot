// Generates a subscribable calendar feed (.ics) for every group, so a student can add their
// timetable to Google/Apple Calendar once and have it update automatically whenever the file is
// regenerated (i.e. whenever the timetable actually changes).
//
//   node scripts/ics.mjs              (all groups)
//   node scripts/ics.mjs 1thm8e1 ...  (only these groups, for testing)
//
// Output: docs/data/ics/<groupId>.ics — served by GitHub Pages at ${SITE_URL}/data/ics/<id>.ics
//
// Design notes:
// - Tashkent has a stable UTC+5 offset with no daylight saving, so times are emitted in plain UTC
//   ("Z" suffix) instead of needing a VTIMEZONE block — simpler, and still displays correctly in
//   any calendar app regardless of the viewer's own timezone.
// - Each lesson becomes a weekly-recurring VEVENT (RRULE), not a list of individual dated events,
//   so the feed only needs to be regenerated when the lesson content actually changes — not every
//   day just to "slide a window forward".
// - A/B week lessons: if WEEK_A_MONDAY (index.weekA) is configured, the real weeks are known, so
//   we emit a true biweekly RRULE (INTERVAL=2) anchored to the correct week. If it isn't configured
//   (the common case), we don't know which real weeks are A vs B, so — exactly like the bot's own
//   text and weekly picture already do — we show both possibilities every week, labelled.

import fs from 'node:fs/promises';
import path from 'node:path';
import { parseSubject, weekParity, mondayOf, addDays, ymd } from '../src/shared.mjs';

const DATA = path.resolve('docs/data');
const OUT = path.resolve('docs/data/ics');
const DAY_MS = 86400000;

const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
const pad = (n) => String(n).padStart(2, '0');

/** "08:00" on a given local-Tashkent date → UTC ICS timestamp "YYYYMMDDTHHMMSSZ" (Tashkent = UTC+5). */
function icsStamp(date, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const utcMs = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), h - 5, m);
  const d = new Date(utcMs);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}
const icsDateOnly = (date) => `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T000000Z`;

function buildCalendar(group, index) {
  const periods = new Map((index.periods || []).map((p) => [p.p, p]));
  const semesterStart = group.tt?.from ? mondayOf(new Date(group.tt.from + 'T00:00:00Z')) : null;
  const until = icsDateOnly(addDays(new Date(), 300)); // recurs ~10 months out; the feed is regenerated whenever lessons change anyway

  const events = [];
  for (const l of group.lessons || []) {
    const start = periods.get(l.p);
    const end = periods.get(l.p + (l.n || 1) - 1) || start;
    if (!start || !end || !semesterStart) continue;

    let firstDate = addDays(semesterStart, l.d);
    let interval = 1;
    let title = parseSubject(l.s).name;
    if (l.w) {
      const known = !!index.weekA;
      if (known) {
        interval = 2;
        if (weekParity(index.weekA, firstDate) !== l.w) firstDate = addDays(firstDate, 7);
      } else {
        title += l.w === 'A' ? ' (Yuqori hafta)' : ' (Quyi hafta)';
      }
    }

    const uid = `${group.id}-d${l.d}-p${l.p}${l.w ? '-' + l.w : ''}@tdiujadval.bot`;
    const descParts = [l.t, l.g ? `Kichik guruh: ${l.g}` : null, 'TDIU Jadval · t.me/tdiujadval_bot'].filter(Boolean);
    events.push([
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${icsDateOnly(new Date())}`,
      `DTSTART:${icsStamp(firstDate, start.start)}`,
      `DTEND:${icsStamp(firstDate, end.end)}`,
      `RRULE:FREQ=WEEKLY;INTERVAL=${interval};UNTIL=${until}`,
      `SUMMARY:${esc(title)}`,
      l.r ? `LOCATION:${esc(l.r)}` : null,
      `DESCRIPTION:${esc(descParts.join(' · '))}`,
      'END:VEVENT',
    ].filter(Boolean).join('\r\n'));
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TDIU Jadval//tdiujadval_bot//UZ',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(group.name)} — TDIU Jadval`,
    'X-WR-TIMEZONE:Asia/Tashkent',
    'REFRESH-INTERVAL;VALUE=DURATION:P1D',
    'X-PUBLISHED-TTL:P1D',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n') + '\r\n';
}

async function main() {
  const index = JSON.parse(await fs.readFile(path.join(DATA, 'index.json'), 'utf8'));
  let ids = process.argv.slice(2);
  if (!ids.length) ids = (await fs.readdir(path.join(DATA, 'g'))).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
  await fs.mkdir(OUT, { recursive: true });
  const t0 = Date.now();
  let n = 0;
  for (const id of ids) {
    const g = JSON.parse(await fs.readFile(path.join(DATA, 'g', `${id}.json`), 'utf8'));
    await fs.writeFile(path.join(OUT, `${id}.ics`), buildCalendar(g, index));
    n++;
  }
  console.log(`Generated ${n} calendar feeds in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
export { buildCalendar };
