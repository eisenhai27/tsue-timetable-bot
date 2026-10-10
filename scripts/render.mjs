// Draws the weekly timetable of every group and every teacher as a PNG picture (like the grid on
// tsue.edupage.org), in the TDIU Jadval style.
// Output: docs/img/g/<groupId>.png and docs/img/t/<teacherId>.png — sent by the bot for "Week".
//
//   node scripts/render.mjs                  (all groups + all teachers)
//   node scripts/render.mjs 1thm8e1 t1o0h5yi  (only these groups / teachers, for testing)

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { parseSubject } from '../src/shared.mjs';

const DATA = path.resolve('docs/data');
const OUT = { g: path.resolve('docs/img/g'), t: path.resolve('docs/img/t') };
const FONTS = ['Manrope_400Regular.ttf', 'Manrope_600SemiBold.ttf', 'Manrope_800ExtraBold.ttf'].map((f) => path.resolve('fonts', f));
// Fallback for letters Manrope doesn't have (e.g. Uzbek Cyrillic Ў, Қ): DejaVu is preinstalled on GitHub's Ubuntu runners
for (const f of ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']) {
  try { await fs.access(f); FONTS.push(f); } catch {}
}

// Brand colours (from the logo)
const C = {
  navy: '#0B3F7A', blue: '#2A7BDB', sky: '#DCEBFD', ink: '#10233F', mute: '#6B7A90', line: '#E3E9F2', bg: '#F4F7FB', white: '#FFFFFF',
  type: {
    lecture: { fill: '#E7F0FD', bar: '#2A7BDB', tag: "MA'RUZA" },
    seminar: { fill: '#E4F5EC', bar: '#1F9D55', tag: 'SEMINAR' },
    lab: { fill: '#FFF1E0', bar: '#E07B00', tag: 'LAB' },
    practice: { fill: '#FFF1E0', bar: '#E07B00', tag: 'AMALIY' },
    other: { fill: '#EEF1F6', bar: '#7C8AA0', tag: '' },
  },
};
const DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

const x = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/[ʻʼ`]/g, '‘'); // o‘ / g‘ — glyph that the font has

function wrap(text, maxChars, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean);
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

export function renderSvg(group, index, logoDataUri) {
  const lessons = group.lessons || [];
  const isT = group.kind === 't'; // a teacher's timetable: cells show the groups instead of the teacher
  const W = 1400;
  const M = 28; // outer margin
  const HEAD = 150;
  const COLH = 64;
  const ROWHDR = 178;
  const FOOT = 64;

  // Only the periods that are used this week (EduPage shows all; we keep it compact)
  const used = new Set();
  for (const l of lessons) for (let k = 0; k < (l.n || 1); k++) used.add(l.p + k);
  let pMin = Math.min(...used), pMax = Math.max(...used);
  if (!isFinite(pMin)) { pMin = 1; pMax = 4; }
  const periods = index.periods.filter((p) => p.p >= pMin && p.p <= pMax);
  const days = [0, 1, 2, 3, 4, 5].filter((d) => d < 5 || lessons.some((l) => l.d === d));
  const ROWH = days.length <= 5 ? 150 : 132;
  const H = HEAD + M + COLH + days.length * ROWH + FOOT + M;
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
  const sub = isT ? 'O‘qituvchi' : [group.fac, group.course ? `${group.course}-kurs` : ''].filter(Boolean).join(' · ');
  o.push(`<text x="${tx}" y="114" font-size="22" font-weight="600" fill="#A9C8F2">Haftalik dars jadvali${sub ? ' · ' + x(sub) : ''}</text>`);
  o.push(`<text x="${W - M}" y="72" font-size="30" font-weight="800" fill="${C.white}" text-anchor="end">TDIU Jadval</text>`);
  o.push(`<text x="${W - M}" y="106" font-size="20" font-weight="600" fill="#CFE2FB" text-anchor="end">@tdiujadval_bot</text>`);
  // lightning accent
  o.push(`<path transform="translate(${W - M - 232},46) scale(1.25)" d="M14 0 L2 18 L10 18 L6 32 L20 12 L12 12 L16 0 Z" fill="#FFC83D"/>`);

  // ---- column headers (periods)
  const top = HEAD + M;
  for (const p of periods) {
    const cx = colX(p.p);
    o.push(`<text x="${cx + colW / 2}" y="${top + 26}" font-size="22" font-weight="800" fill="${C.navy}" text-anchor="middle">${p.p}-para</text>`);
    o.push(`<text x="${cx + colW / 2}" y="${top + 52}" font-size="18" font-weight="600" fill="${C.mute}" text-anchor="middle">${p.start}–${p.end}</text>`);
  }

  // ---- rows
  const gy = top + COLH;
  days.forEach((d, i) => {
    const y = gy + i * ROWH;
    o.push(`<rect x="${M}" y="${y + 4}" width="${W - 2 * M}" height="${ROWH - 8}" rx="18" fill="${C.white}"/>`);
    o.push(`<text x="${M + 22}" y="${y + ROWH / 2 + 2}" font-size="23" font-weight="800" fill="${C.ink}">${DAYS[d]}</text>`);
    const dayLessons = lessons.filter((l) => l.d === d);
    if (!dayLessons.length) {
      o.push(`<text x="${gridX + 16}" y="${y + ROWH / 2 + 8}" font-size="20" font-weight="600" fill="${C.mute}">Dars yo‘q</text>`);
      return;
    }
    // group lessons that share the same start period (upper/lower weeks, subgroups) → split the cell
    const bySlot = new Map();
    for (const l of dayLessons) (bySlot.get(l.p) || bySlot.set(l.p, []).get(l.p)).push(l);
    for (const [p, list] of bySlot) {
      const span = Math.max(...list.map((l) => l.n || 1));
      const cx = colX(p) + 6;
      const cw = colW * span - 12;
      const partH = (ROWH - 20) / list.length;
      list.forEach((l, k) => {
        const cy = y + 10 + k * partH;
        const ch = partH - (list.length > 1 ? 4 : 0);
        const sp = parseSubject(l.s);
        const st = C.type[sp.type] || C.type.other;
        o.push(`<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="12" fill="${st.fill}"/>`);
        o.push(`<rect x="${cx}" y="${cy}" width="6" height="${ch}" rx="3" fill="${st.bar}"/>`);
        const small = list.length > 1;
        const fs = small ? 16 : 19;
        const maxChars = Math.max(8, Math.floor((cw - 26) / (fs * 0.56)));
        const nameLines = wrap(sp.name, maxChars, small ? 1 : 2);
        let ty = cy + (small ? 22 : 28);
        const tags = [st.tag, l.w ? (l.w === 'A' ? 'YUQORI' : 'QUYI') : '', l.g ? l.g.toUpperCase() : ''].filter(Boolean).join(' · ');
        if (tags && !small) {
          o.push(`<text x="${cx + 16}" y="${ty - 4}" font-size="13" font-weight="800" fill="${st.bar}" letter-spacing="0.6">${x(tags)}</text>`);
          ty += 18;
        }
        for (const line of nameLines) {
          o.push(`<text x="${cx + 16}" y="${ty}" font-size="${fs}" font-weight="800" fill="${C.ink}">${x(line)}</text>`);
          ty += fs + 4;
        }
        const metaFs = small ? 13 : 15;
        const metaMax = Math.floor((cw - 26) / (metaFs * 0.55));
        const cut = (t, max) => (t.length > max ? t.slice(0, max - 1) + '…' : t);
        if (isT && !small) {
          // teacher: groups (the important part) on one line, the room under it
          const grMax = Math.floor((cw - 26) / (14 * 0.58));
          if (l.gr) o.push(`<text x="${cx + 16}" y="${cy + ch - 30}" font-size="14" font-weight="800" fill="${C.ink}">${x(cut(l.gr, grMax))}</text>`);
          if (l.r) o.push(`<text x="${cx + 16}" y="${cy + ch - 10}" font-size="${metaFs}" font-weight="600" fill="${C.mute}">${x(cut(l.r, metaMax))}</text>`);
        } else {
          const meta = (isT ? [l.r, l.gr] : [l.r, shortTeacher(l.t)]).filter(Boolean).join('  ·  ');
          const metaText = (small && tags ? tags + '  ·  ' : '') + meta;
          o.push(`<text x="${cx + 16}" y="${Math.min(ty + 2, cy + ch - 10)}" font-size="${metaFs}" font-weight="600" fill="${C.mute}">${x(cut(metaText, metaMax))}</text>`);
        }
      });
    }
  });

  // ---- footer
  const fy = H - M - 14;
  o.push(`<text x="${M}" y="${fy}" font-size="17" font-weight="600" fill="${C.mute}">Manba: tsue.edupage.org · ${x(group.tt?.label || '')}</text>`);
  o.push(`<text x="${W - M}" y="${fy}" font-size="17" font-weight="800" fill="${C.navy}" text-anchor="end">Jadval o‘zgarsa — darhol xabar: t.me/tdiujadval_bot</text>`);
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

async function main() {
  const index = JSON.parse(await fs.readFile(path.join(DATA, 'index.json'), 'utf8'));
  const ls = async (k) => (await fs.readdir(path.join(DATA, k))).filter((f) => f.endsWith('.json')).map((f) => [k, f.replace(/\.json$/, '')]);
  let jobs = process.argv.slice(2).map((id) => [id.startsWith('t') && !fsSync.existsSync(path.join(DATA, 'g', `${id}.json`)) ? 't' : 'g', id]);
  if (!jobs.length) jobs = [...(await ls('g')), ...(await ls('t'))];
  let logo = null;
  try { logo = 'data:image/png;base64,' + (await fs.readFile(path.resolve('docs/icon-192.png'))).toString('base64'); } catch {}
  await fs.mkdir(OUT.g, { recursive: true });
  await fs.mkdir(OUT.t, { recursive: true });
  const t0 = Date.now();
  let n = 0;
  for (const [k, id] of jobs) {
    const obj = JSON.parse(await fs.readFile(path.join(DATA, k, `${id}.json`), 'utf8'));
    await fs.writeFile(path.join(OUT[k], `${id}.png`), renderPng(renderSvg(k === 't' ? { ...obj, kind: 't' } : obj, index, logo)));
    n++;
  }
  console.log(`Rendered ${n} weekly pictures (groups + teachers) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
