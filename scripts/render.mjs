// Draws the weekly timetable of every group and every teacher as a PNG picture (like the grid on
// tsue.edupage.org), in the TDIU Jadval style — in Uzbek, Russian and English.
// The picture is drawn for ONE week (the one the bot shows: the coming week on Sunday, otherwise this week), so the
// lessons of that week's type (upper / lower) get their own colour and the other week's lessons are greyed out.
// Output (see weekImgPath() in src/shared.mjs):
//   docs/img/g/<id>.png     docs/img/t/<id>.png        Uzbek
//   docs/img/ru/g/<id>.png  docs/img/ru/t/<id>.png     Russian
//   docs/img/en/g/<id>.png  docs/img/en/t/<id>.png     English
//
//   node scripts/render.mjs                    (all groups + all teachers, all languages)
//   node scripts/render.mjs 1thm8e1 t1o0h5yi   (only these groups / teachers, for testing)
//   options: --lang=ru|en|uz   --parity=A|B|none (force the week type)   --out=<dir> (write there instead of docs/img)

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { Resvg } from '@resvg/resvg-js';
import { parseSubject, setSubjects, tr, words, weekParity, displayMonday, tashkentNow, addDays, weekImgPath } from '../src/shared.mjs';

const DATA = path.resolve('docs/data');
const FONTS = ['Manrope_400Regular.ttf', 'Manrope_600SemiBold.ttf', 'Manrope_800ExtraBold.ttf'].map((f) => path.resolve('fonts', f));
// Fallback for letters Manrope doesn't have (e.g. Uzbek Cyrillic Қ, Ғ, Ҳ): DejaVu is preinstalled on GitHub's Ubuntu runners
for (const f of ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']) {
  try { await fs.access(f); FONTS.push(f); } catch {}
}

// Brand colours (from the logo)
const C = {
  navy: '#0B3F7A', blue: '#2A7BDB', sky: '#DCEBFD', ink: '#10233F', mute: '#6B7A90', line: '#E3E9F2', bg: '#F4F7FB', white: '#FFFFFF',
  type: {
    lecture: { fill: '#E7F0FD', bar: '#2A7BDB' },
    seminar: { fill: '#E4F5EC', bar: '#1F9D55' },
    lab: { fill: '#FFF1E0', bar: '#E07B00' },
    practice: { fill: '#FFF1E0', bar: '#E07B00' },
    other: { fill: '#EEF1F6', bar: '#7C8AA0' },
  },
  // the week the picture is drawn for: its own lessons in purple (no other colour above is purple), the other week's greyed out
  thisWeek: { fill: '#F6E8FB', bar: '#8E24AA', ink: '#4A1259' },
  otherWeek: { fill: '#F1F3F7', bar: '#C5CCD8' },
};

// "September 14 -2026 (07. 09. - 30. 10. 2026)" → "07.09 – 30.10.2026" (the footer also carries the author, so it has to stay short)
const ttPeriod = (tt) => { const m = /\(([^)]*)\)\s*$/.exec(tt?.label || ''); return m ? m[1].replace(/\s+/g, '').replace(/\.?-/, ' – ').replace(/\.$/, '') : (tt?.label || ''); };

// Everything the picture says in words (subject names come from the data / subjects.json).
const IMG = {
  uz: {
    title: 'Haftalik dars jadvali', teacher: 'O‘qituvchi', course: (n) => `${n}-kurs`, free: 'Dars yo‘q', src: 'Manba', author: 'Muallif: Xolmamatov Shavkat',
    promo: 'Jadval o‘zgarsa — darhol xabar: t.me/tdiujadval_bot',
    tag: { lecture: 'MA‘RUZA', seminar: 'SEMINAR', lab: 'LAB', practice: 'AMALIY' }, wk: { A: 'YUQORI', B: 'QUYI' },
    legThis: (w) => `${w} — shu haftadagi darslar`, legOther: (w) => `${w} — bu haftada o‘tilmaydi`,
  },
  ru: {
    title: 'Расписание на неделю', teacher: 'Преподаватель', course: (n) => `${n} курс`, free: 'Занятий нет', src: 'Источник', author: 'Автор: Холмаматов Шавкат',
    promo: 'Расписание изменится — сразу сообщим: t.me/tdiujadval_bot',
    tag: { lecture: 'ЛЕКЦИЯ', seminar: 'СЕМИНАР', lab: 'ЛАБ', practice: 'ПРАКТИКА' }, wk: { A: 'ВЕРХНЯЯ', B: 'НИЖНЯЯ' },
    legThis: (w) => `${w} — занятия этой недели`, legOther: (w) => `${w} — на этой неделе нет`,
  },
  en: {
    title: 'Weekly timetable', teacher: 'Teacher', course: (n) => `Year ${n}`, free: 'No classes', src: 'Source', author: 'Made by Shavkat Kholmamatov',
    promo: 'Timetable changes — instant alert: t.me/tdiujadval_bot',
    tag: { lecture: 'LECTURE', seminar: 'SEMINAR', lab: 'LAB', practice: 'PRACTICE' }, wk: { A: 'UPPER', B: 'LOWER' },
    legThis: (w) => `${w} — this week’s classes`, legOther: (w) => `${w} — not this week`,
  },
};

const x = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/[ʻʼ`]/g, '‘'); // o‘ / g‘ — glyph that the font has

function wrap(text, maxChars, maxLines) {
  // keep a trailing number with its word ("Iqtisodiyot nazariyasi 1" never leaves a lonely "1" on the next line)
  const words = String(text).replace(/\s+(\d{1,2})\s*$/, '\u0001$1').split(/\s+/).filter(Boolean).map((w) => w.replace('\u0001', ' '));
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= maxChars) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  const out = lines.slice(0, maxLines).map((l) => (l.length > maxChars ? l.slice(0, maxChars - 1) + '…' : l));
  if (lines.length > maxLines) out[maxLines - 1] = out[maxLines - 1].replace(/.{0,2}$/, '') + '…';
  return out;
}

const shortTeacher = (t) => String(t || '').split(', ').map((n) => {
  const p = n.trim().split(/\s+/);
  return p.length >= 2 ? `${p[0]} ${p[1][0]}.` : n;
}).join(', ');

const dm = (d) => `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

/**
 * opts: { lang: 'uz'|'ru'|'en', parity: 'A'|'B'|null, monday: Date|null }
 * parity = which week type the picture is for (null = unknown: both kinds are drawn the same, with a YUQORI / QUYI tag).
 */
export function renderSvg(group, index, logoDataUri, opts = {}) {
  const lang = IMG[opts.lang] ? opts.lang : 'uz';
  const S = IMG[lang];
  const Lg = tr(lang);
  const parity = opts.parity === 'A' || opts.parity === 'B' ? opts.parity : null;
  // 'this' = only in this week's type, 'other' = only in the other type, 'every' = every week
  const stateOf = (l) => (!parity || !l.w ? 'every' : l.w === parity ? 'this' : 'other');
  const lessons = group.lessons || [];
  const isT = group.kind === 't'; // a teacher's timetable: cells show the groups instead of the teacher
  const W = 1400;
  const M = 28; // outer margin
  const HEAD = 150;
  const COLH = 64;
  const ROWHDR = 178;
  const LEG = parity ? 40 : 0; // legend line under the grid
  const WKBAR = 40; // the upper / lower week switch under the header
  const FOOT = 64;

  // Week-type chip (▲ YUQORI / ▼ QUYI) for a lesson that only happens in one of the two weeks.
  // mode: 'on' = this week's (filled purple), 'off' = the other week's (grey outline), 'plain' = week unknown (navy outline)
  const CHIP_FS = 12, CHIP_H = 22;
  const chipW = (w) => Math.ceil(S.wk[w].length * CHIP_FS * 0.74) + 36;
  const chip = (right, yTop, w, mode) => {
    const wd = chipW(w), x0 = right - wd;
    const clr = mode === 'on' ? C.white : mode === 'off' ? C.mute : C.navy;
    const box = mode === 'on'
      ? `<rect x="${x0}" y="${yTop}" width="${wd}" height="${CHIP_H}" rx="11" fill="${C.thisWeek.bar}"/>`
      : `<rect x="${x0 + 0.75}" y="${yTop + 0.75}" width="${wd - 1.5}" height="${CHIP_H - 1.5}" rx="10.25" fill="${C.white}" stroke="${mode === 'off' ? '#AEB8C7' : C.navy}" stroke-width="1.5"/>`;
    const tri = w === 'A'
      ? `M${x0 + 10} ${yTop + 15.5} L${x0 + 20} ${yTop + 15.5} L${x0 + 15} ${yTop + 6.5} Z`
      : `M${x0 + 10} ${yTop + 6.5} L${x0 + 20} ${yTop + 6.5} L${x0 + 15} ${yTop + 15.5} Z`;
    return `${box}<path d="${tri}" fill="${clr}"/><text x="${x0 + 26}" y="${yTop + 16}" font-size="${CHIP_FS}" font-weight="800" fill="${clr}" letter-spacing="0.4">${x(S.wk[w])}</text>`;
  };

  // Only the periods that are used this week (EduPage shows all; we keep it compact)
  const used = new Set();
  for (const l of lessons) for (let k = 0; k < (l.n || 1); k++) used.add(l.p + k);
  let pMin = Math.min(...used), pMax = Math.max(...used);
  if (!isFinite(pMin)) { pMin = 1; pMax = 4; }
  const periods = index.periods.filter((p) => p.p >= pMin && p.p <= pMax);
  const days = [0, 1, 2, 3, 4, 5].filter((d) => d < 5 || lessons.some((l) => l.d === d));
  const ROWH = days.length <= 5 ? 150 : 132;
  const top = parity ? HEAD + 18 + WKBAR + 14 : HEAD + M; // top of the period headers
  const H = top + COLH + days.length * ROWH + LEG + FOOT + M;
  const gridX = M + ROWHDR;
  const colW = (W - gridX - M) / periods.length;
  const colX = (p) => gridX + (p - pMin) * colW;

  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Manrope">`);
  o.push(`<rect width="${W}" height="${H}" fill="${C.bg}"/>`);

  // ---- header band with the calendar-ring signature
  o.push(`<rect x="0" y="0" width="${W}" height="${HEAD}" fill="${C.navy}"/>`);
  o.push(`<path d="M${W - 360} 0 L${W} 0 L${W} ${HEAD} L${W - 470} ${HEAD} Z" fill="${C.blue}" opacity="0.35"/>`);
  o.push(`<path d="M${W - 250} 0 L${W} 0 L${W} ${HEAD} L${W - 330} ${HEAD} Z" fill="${C.blue}" opacity="0.35"/>`);
  if (logoDataUri) {
    o.push(`<rect x="${M}" y="30" width="90" height="90" rx="22" fill="${C.white}"/>`);
    o.push(`<image x="${M + 7}" y="37" width="76" height="76" xlink:href="${logoDataUri}"/>`);
  }
  const tx = M + (logoDataUri ? 116 : 0);
  o.push(`<text x="${tx}" y="78" font-size="46" font-weight="800" fill="${C.white}">${x(group.name)}</text>`);
  // faculty names exist in Uzbek only, so Russian / English pictures show just the course
  const course = group.course ? S.course(group.course) : '';
  const sub = isT ? S.teacher : (lang === 'uz' ? [group.fac, course] : [course]).filter(Boolean).join(' · ');
  o.push(`<text x="${tx}" y="114" font-size="22" font-weight="600" fill="#A9C8F2">${x(S.title)}${sub ? ' · ' + x(sub) : ''}</text>`);
  o.push(`<text x="${W - M}" y="72" font-size="30" font-weight="800" fill="${C.white}" text-anchor="end">TDIU Jadval</text>`);
  o.push(`<text x="${W - M}" y="106" font-size="20" font-weight="600" fill="#CFE2FB" text-anchor="end">@tdiujadval_bot</text>`);
  // lightning accent
  o.push(`<path transform="translate(${W - M - 232},46) scale(1.25)" d="M14 0 L2 18 L10 18 L6 32 L20 12 L12 12 L16 0 Z" fill="#FFC83D"/>`);

  // ---- the week switch: [▲ Upper week] [▼ Lower week] — the one this picture is for is filled — and its dates
  if (parity) {
    const by = HEAD + 18;
    let bx = M;
    for (const w of ['A', 'B']) {
      const label = w === 'A' ? Lg.weekA : Lg.weekB;
      const on = w === parity;
      const pw = Math.round(label.length * 10.8 + 58);
      const clr = on ? C.white : C.mute;
      o.push(on
        ? `<rect x="${bx}" y="${by}" width="${pw}" height="${WKBAR}" rx="${WKBAR / 2}" fill="${C.thisWeek.bar}"/>`
        : `<rect x="${bx + 1}" y="${by + 1}" width="${pw - 2}" height="${WKBAR - 2}" rx="${WKBAR / 2 - 1}" fill="${C.white}" stroke="#C5CCD8" stroke-width="2"/>`);
      const ty0 = by + WKBAR / 2;
      o.push(w === 'A'
        ? `<path d="M${bx + 16} ${ty0 + 6} L${bx + 30} ${ty0 + 6} L${bx + 23} ${ty0 - 7} Z" fill="${clr}"/>`
        : `<path d="M${bx + 16} ${ty0 - 6} L${bx + 30} ${ty0 - 6} L${bx + 23} ${ty0 + 7} Z" fill="${clr}"/>`);
      o.push(`<text x="${bx + 42}" y="${by + 26}" font-size="18" font-weight="800" fill="${clr}">${x(label)}</text>`);
      bx += pw + 12;
    }
    if (opts.monday) o.push(`<text x="${bx + 10}" y="${by + 28}" font-size="22" font-weight="800" fill="${C.navy}">${dm(opts.monday)} – ${dm(addDays(opts.monday, 5))}</text>`);
  }
  // ---- column headers (periods)
  for (const p of periods) {
    const cx = colX(p.p);
    o.push(`<text x="${cx + colW / 2}" y="${top + 26}" font-size="22" font-weight="800" fill="${C.navy}" text-anchor="middle">${x(words(lang).pair(p.p))}</text>`);
    o.push(`<text x="${cx + colW / 2}" y="${top + 52}" font-size="18" font-weight="600" fill="${C.mute}" text-anchor="middle">${p.start}–${p.end}</text>`);
  }

  // ---- rows
  const gy = top + COLH;
  days.forEach((d, i) => {
    const y = gy + i * ROWH;
    o.push(`<rect x="${M}" y="${y + 4}" width="${W - 2 * M}" height="${ROWH - 8}" rx="18" fill="${C.white}"/>`);
    const dayName = Lg.days[d];
    o.push(`<text x="${M + 22}" y="${y + ROWH / 2 + 2}" font-size="${dayName.length > 10 ? 20 : 23}" font-weight="800" fill="${C.ink}">${x(dayName)}</text>`);
    const dayLessons = lessons.filter((l) => l.d === d);
    if (!dayLessons.length) {
      o.push(`<text x="${gridX + 16}" y="${y + ROWH / 2 + 8}" font-size="20" font-weight="600" fill="${C.mute}">${x(S.free)}</text>`);
      return;
    }
    // group lessons that share the same start period (upper/lower weeks, subgroups) → split the cell
    const bySlot = new Map();
    for (const l of dayLessons) (bySlot.get(l.p) || bySlot.set(l.p, []).get(l.p)).push(l);
    for (const [p, list0] of bySlot) {
      // this week's lessons first and tall, the other week's below, short and faded
      const list = parity ? [...list0].sort((a, b) => (stateOf(a) === 'other') - (stateOf(b) === 'other')) : list0;
      const span = Math.max(...list.map((l) => l.n || 1));
      const cx = colX(p) + 6;
      const cw = colW * span - 12;
      const weights = list.map((l) => (list.length > 1 && stateOf(l) === 'other' ? 0.5 : 1));
      const wSum = weights.reduce((a, b) => a + b, 0);
      let cy = y + 10;
      list.forEach((l, k) => {
        const partH = ((ROWH - 20) * weights[k]) / wSum;
        const ch = partH - (list.length > 1 ? 4 : 0);
        const state = stateOf(l);
        const sp = parseSubject(l.s, lang);
        const ty0 = C.type[sp.type] || C.type.other;
        const st = state === 'this' ? C.thisWeek : state === 'other' ? C.otherWeek : ty0;
        const tagClr = state === 'this' ? C.thisWeek.bar : state === 'other' ? C.mute : ty0.bar;
        const ink = state === 'this' ? C.thisWeek.ink : C.ink;
        o.push(`<g${state === 'other' ? ' opacity="0.55"' : ''}>`);
        if (state === 'this') o.push(`<rect x="${cx + 1.25}" y="${cy + 1.25}" width="${cw - 2.5}" height="${ch - 2.5}" rx="12" fill="${st.fill}" stroke="${st.bar}" stroke-width="2.5"/>`);
        else o.push(`<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="12" fill="${st.fill}"/>`);
        o.push(`<rect x="${cx}" y="${cy}" width="6" height="${ch}" rx="3" fill="${st.bar}"/>`);
        const small = list.length > 1;
        const roomy = small && state !== 'other' && ch >= 66; // this week's lesson beside a faded strip: tall enough for the full layout
        if (small && state === 'other') {
          // the other week's lesson next to this week's: just a faded one-line strip (name + a ▼ / ▲ week chip)
          const cwChip = chipW(l.w) + 10;
          const max = Math.floor((cw - 26 - cwChip) / (15 * 0.56));
          const nm = sp.name.length > max ? sp.name.slice(0, Math.max(3, max - 1)) + '…' : sp.name;
          o.push(`<text x="${cx + 16}" y="${cy + ch / 2 + 5}" font-size="15" font-weight="800" fill="${C.ink}">${x(nm)}</text>`);
          o.push(chip(cx + cw - 8, cy + (ch - CHIP_H) / 2, l.w, 'off'));
          o.push('</g>');
          cy += partH;
          return;
        }
        const fs = small ? 16 : 19;
        const maxChars = Math.max(8, Math.floor((cw - 26) / (fs * 0.56)));
        const nameLines = wrap(sp.name, maxChars, small ? 1 : 2);
        let ty = cy + (small && !roomy ? 22 : roomy ? 26 : 28);
        // a lesson of only one week type gets a ▲ / ▼ chip in the corner of its card (when it fits); otherwise the word goes in the tag line
        const chipped = !!l.w && (!small || roomy) && cw >= 230;
        if (chipped) o.push(chip(cx + cw - 10, cy + 9, l.w, state === 'this' ? 'on' : state === 'other' ? 'off' : 'plain'));
        const tags = [S.tag[sp.type] || '', l.w && !chipped ? S.wk[l.w] : '', l.g ? l.g.toUpperCase() : ''].filter(Boolean).join(' · ');
        if (tags && (!small || roomy)) {
          o.push(`<text x="${cx + 16}" y="${ty - 4}" font-size="13" font-weight="800" fill="${tagClr}" letter-spacing="0.6">${x(tags)}</text>`);
          ty += 18;
        }
        for (const line of nameLines) {
          o.push(`<text x="${cx + 16}" y="${ty}" font-size="${fs}" font-weight="800" fill="${ink}">${x(line)}</text>`);
          ty += fs + 4;
        }
        const metaFs = small ? 13 : 15;
        const metaMax = Math.floor((cw - 26) / (metaFs * 0.55));
        const cut = (t, max) => (t.length > max ? t.slice(0, max - 1) + '…' : t);
        if (isT && !small) {
          // teacher: groups (the important part) on one line, the room under it
          const grMax = Math.floor((cw - 26) / (14 * 0.58));
          if (l.gr) o.push(`<text x="${cx + 16}" y="${cy + ch - 30}" font-size="14" font-weight="800" fill="${ink}">${x(cut(l.gr, grMax))}</text>`);
          if (l.r) o.push(`<text x="${cx + 16}" y="${cy + ch - 10}" font-size="${metaFs}" font-weight="600" fill="${C.mute}">${x(cut(l.r, metaMax))}</text>`);
        } else {
          const meta = (isT ? [l.r, l.gr] : [l.r, shortTeacher(l.t)]).filter(Boolean).join('  ·  ');
          const metaText = (small && !roomy && tags ? tags + '  ·  ' : '') + meta;
          o.push(`<text x="${cx + 16}" y="${Math.min(ty + 2, cy + ch - 10)}" font-size="${metaFs}" font-weight="600" fill="${C.mute}">${x(cut(metaText, metaMax))}</text>`);
        }
        o.push('</g>');
        cy += partH;
      });
    }
  });

  // ---- legend: what the colours mean
  if (parity) {
    const ly = gy + days.length * ROWH + 28;
    const thisName = parity === 'A' ? Lg.weekA : Lg.weekB;
    const otherName = parity === 'A' ? Lg.weekB : Lg.weekA;
    const t1 = S.legThis(thisName), t2 = S.legOther(otherName);
    o.push(`<rect x="${M + 6}" y="${ly - 15}" width="20" height="20" rx="6" fill="${C.thisWeek.fill}" stroke="${C.thisWeek.bar}" stroke-width="2.5"/>`);
    o.push(`<text x="${M + 36}" y="${ly}" font-size="18" font-weight="800" fill="${C.thisWeek.bar}">${x(t1)}</text>`);
    const x2 = M + 36 + t1.length * 10.4 + 46;
    o.push(`<rect x="${x2}" y="${ly - 15}" width="20" height="20" rx="6" fill="${C.otherWeek.fill}" stroke="${C.otherWeek.bar}" stroke-width="2"/>`);
    o.push(`<text x="${x2 + 30}" y="${ly}" font-size="18" font-weight="600" fill="${C.mute}">${x(t2)}</text>`);
  }

  // ---- footer
  const fy = H - M - 14;
  o.push(`<text x="${M}" y="${fy}" font-size="17" font-weight="600" fill="${C.mute}">${x(S.src)}: tsue.edupage.org · ${x(ttPeriod(group.tt))} · ${x(S.author)}</text>`);
  o.push(`<text x="${W - M}" y="${fy}" font-size="17" font-weight="800" fill="${C.navy}" text-anchor="end">${x(S.promo)}</text>`);
  o.push('</svg>');
  return o.join('\n');
}

export function renderPng(svg) {
  const r = new Resvg(svg, {
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Manrope' },
    fitTo: { mode: 'original' },
  });
  return r.render().asPng();
}

// Pictures are flat colours + text, so a palette PNG is ~3× smaller with no visible difference. Three languages would otherwise
// triple the size of the site (GitHub Pages allows 1 GB). Falls back to the plain PNG when sharp isn't installed.
let sharp = null;
try { sharp = (await import('sharp')).default; } catch {}
async function shrink(png) {
  if (!sharp) return png;
  try { return await sharp(png).png({ palette: true, quality: 90, colours: 96, effort: 1, compressionLevel: 6, dither: 0 }).toBuffer(); }
  catch { return png; }
}

/** Draws `jobs` ([kind, id] pairs) in every language. Runs inside a worker thread (or inline for a handful of pictures). */
async function renderShard({ jobs, langs, outRoot, parity, monday, index, subjects, logo }) {
  if (subjects) setSubjects(subjects);
  const mon = monday ? new Date(monday + 'T00:00:00Z') : null;
  let n = 0, bytes = 0;
  const pending = new Set();
  for (const [k, id] of jobs) {
    const obj = JSON.parse(await fs.readFile(path.join(DATA, k, `${id}.json`), 'utf8'));
    const entity = k === 't' ? { ...obj, kind: 't' } : obj;
    if (!(entity.lessons || []).length) continue; // no lessons yet (timetable not on EduPage) → nothing to draw; the bot sends a text note
    for (const lang of langs) {
      const png = renderPng(renderSvg(entity, index, logo, { lang, parity, monday: mon }));
      const job = shrink(png).then((buf) => fs.writeFile(path.join(outRoot, weekImgPath(k, id, lang)), buf).then(() => { n++; bytes += buf.length; }));
      pending.add(job);
      job.finally(() => pending.delete(job));
      if (pending.size >= 6) await Promise.race(pending);
    }
  }
  await Promise.all(pending);
  return { n, bytes };
}

async function main() {
  const argv = process.argv.slice(2);
  const flag = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
  const langs = flag('lang') ? flag('lang').split(',') : ['uz', 'ru', 'en'];
  const outRoot = flag('out') ? path.resolve(flag('out')) : path.resolve('docs');
  const index = JSON.parse(await fs.readFile(path.join(DATA, 'index.json'), 'utf8'));
  let subjects = null;
  try { subjects = JSON.parse(await fs.readFile(path.join(DATA, 'subjects.json'), 'utf8')); } catch {}

  // the week this picture is drawn for = the one update.mjs wrote into index.json (the bot checks the very same value)
  const mondayD = index.imgMonday ? new Date(index.imgMonday + 'T00:00:00Z') : displayMonday(tashkentNow());
  const monday = mondayD.toISOString().slice(0, 10);
  const forced = flag('parity');
  const parity = forced ? (forced === 'none' ? null : forced) : weekParity(index.weekA, mondayD);

  const ls = async (k) => (await fs.readdir(path.join(DATA, k))).filter((f) => f.endsWith('.json')).map((f) => [k, f.replace(/\.json$/, '')]);
  let jobs = argv.filter((a) => !a.startsWith('--')).map((id) => [id.startsWith('t') && !fsSync.existsSync(path.join(DATA, 'g', `${id}.json`)) ? 't' : 'g', id]);
  const all = !jobs.length;
  if (all) jobs = [...(await ls('g')), ...(await ls('t'))];

  // --only-changed (the workflow): docs/img comes back from the cache of the previous run, with img/manifest.json saying which
  // version (a hash of everything the picture shows) each picture was drawn from and for which week. Only what changed since is drawn again —
  // a timetable edit then takes seconds instead of redrawing all ~8,000 pictures, so the site (and the bot's "today") is fresh
  // minutes sooner. Another week / week type / language set (or no cache) → everything is drawn, exactly as before.
  const MANIFEST = path.join(outRoot, 'img', 'manifest.json');
  let manifestOut = null;
  if (all && argv.includes('--only-changed')) {
    const key = JSON.stringify({ monday, parity, langs });
    let old = null;
    try { old = JSON.parse(await fs.readFile(MANIFEST, 'utf8')); } catch {}
    const cur = {};
    for (const [k, id] of jobs) {
      try { const o = JSON.parse(await fs.readFile(path.join(DATA, k, `${id}.json`), 'utf8')); cur[`${k}:${id}`] = (o.lessons || []).length ? createHash('sha1').update(JSON.stringify([o.name, o.fac, o.course, o.tt, o.lessons])).digest('base64url').slice(0, 16) : '-'; } catch { cur[`${k}:${id}`] = '?'; }
    }
    if (old && old.key === key && old.v) {
      const before = jobs.length;
      jobs = jobs.filter(([k, id]) => {
        const v = cur[`${k}:${id}`];
        if (v === '-') return false; // no lessons → no picture
        return v === '?' || old.v[`${k}:${id}`] !== v || !langs.every((l) => fsSync.existsSync(path.join(outRoot, weekImgPath(k, id, l))));
      });
      console.log(`only-changed: ${jobs.length} of ${before} timetables to draw again`);
    } else console.log('only-changed: no picture set for this week from an earlier run → drawing all');
    manifestOut = { key, v: cur };
  }
  let logo = null;
  try { logo = 'data:image/png;base64,' + (await fs.readFile(path.resolve('docs/icon-192.png'))).toString('base64'); } catch {}
  for (const lang of langs) for (const k of ['g', 't']) await fs.mkdir(path.dirname(path.join(outRoot, weekImgPath(k, 'x', lang))), { recursive: true });

  const t0 = Date.now();
  const common = { langs, outRoot, parity, monday, index, subjects, logo };
  // ~7,500 pictures (groups + teachers × 3 languages): spread over all CPU cores
  const cores = Math.max(1, Math.min(os.availableParallelism ? os.availableParallelism() : os.cpus().length, 8));
  let results;
  if (jobs.length < 30 || cores === 1) results = [await renderShard({ ...common, jobs })];
  else {
    const shards = Array.from({ length: cores }, (_, i) => jobs.filter((_, j) => j % cores === i));
    results = await Promise.all(shards.map((shard) => new Promise((resolve, reject) => {
      const w = new Worker(new URL(import.meta.url), { workerData: { ...common, jobs: shard } });
      w.once('message', resolve); w.once('error', reject);
      w.once('exit', (c) => c && reject(new Error(`render worker exited with code ${c}`)));
    })));
  }
  const n = results.reduce((a, r) => a + r.n, 0), bytes = results.reduce((a, r) => a + r.bytes, 0);
  if (manifestOut) await fs.writeFile(MANIFEST, JSON.stringify(manifestOut));
  if (process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT, `rendered=${n}\n`);
  console.log(`Rendered ${n} weekly pictures (${langs.join('/')}; ${parity ? (parity === 'A' ? 'upper' : 'lower') + ' week' : 'week type unknown'}) in ${((Date.now() - t0) / 1000).toFixed(1)}s, ${(bytes / 1048576).toFixed(0)} MB`);
}

if (!isMainThread) renderShard(workerData).then((r) => parentPort.postMessage(r)).catch((e) => { console.error(e); process.exit(1); });
else if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
