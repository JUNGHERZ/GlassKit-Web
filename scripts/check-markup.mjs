#!/usr/bin/env node
/* ============================================================
   Markup-Guard: das Markup muss zu site.css und BaseLayout passen

   site.css und BaseLayout werden in abgeleiteten Projekten übernommen
   (SKILL.md §7), die Komponenten und Seiten mit dem Markup aber nie. Wo die
   Mechanik Annahmen über dieses Markup macht, bricht ein Sync still:

   1. Basisklassen. Wenn GlassKit eine Komponente mitbringt, die vorher im
      glw-Layer lebte, setzt das Template darauf auf: Das Markup trägt beide
      Klassen, site.css behält nur die Abweichungen. Fehlt die Basisklasse,
      fehlt das halbe Styling (bei .glw-prose: Zeilenhöhe, Abstände,
      Linkfarben auf jeder Rechtsseite und im Blog). Neues Paar = eine Zeile
      in PAIRS.
   2. Landmarks. BaseLayout umschließt jede Seite mit <main id="main"> und
      setzt davor den Skip-Link. Ein <main> in einer Seite oder Komponente
      ergäbe ein zweites, verschachteltes — ungültig und für Screenreader
      doppelt.
   3. Icons in Primary-Buttons. GlassKit füllt sie (fill, stroke-width 0).
      Offene Linien — ein Pfad ohne z, <line>, <polyline> — haben keine
      Fläche: Sie verschwinden oder werden zu Dreiecken (ein Download-Pfeil
      neben dem wichtigsten CTA). Überlagerte geschlossene Formen erkennt
      die Regel nicht — die bleiben ein Fall für den Blick (SKILL.md §4).

   Aufruf: npm run check:markup   (läuft auch als Teil von npm test)
   ============================================================ */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative, extname, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GLASSKIT = resolve(root, 'node_modules/@jungherz-de/glasskit/glasskit.css');
const SRC = resolve(root, 'src');
const LAYOUTS = resolve(SRC, 'layouts');

// override: glw-Klasse in site.css · base: GlassKit-Klasse darunter · since: Template-/GlassKit-Version
const PAIRS = [
  { override: 'glw-prose', base: 'glass-prose', template: '1.1.0', glasskit: '1.14.0' },
];

const EXT = new Set(['.astro', '.html', '.md', '.mdx', '.jsx', '.tsx', '.svelte', '.vue']);
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.has(extname(name))) files.push(p);
  }
})(SRC);
const text = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));
const lineOf = (src, index) => src.slice(0, index).split('\n').length;

// class="…", class='…', class={`…`}, class:list={[…]} — Klassenlisten grob, aber ohne Fehlalarm:
// gezählt werden nur ganze Klassennamen, Modifier wie glw-prose--article zählen nicht als Override.
const ATTR = /\bclass(?::list)?=(?:"([^"]*)"|'([^']*)'|\{([\s\S]*?)\}(?=[\s/>]))/g;
const hasClass = (value, cls) => new RegExp(`(^|[\\s"'\`\\[,{])${cls}(?=$|[\\s"'\`\\],}])`).test(value);

const glasskit = readFileSync(GLASSKIT, 'utf8');
const version = glasskit.match(/v(\d+\.\d+\.\d+)/)?.[1] ?? '?';

// 1. Basisklassen
const classProblems = [];
let checked = 0;
for (const pair of PAIRS) {
  let used = false;
  for (const [file, src] of text) {
    for (const m of src.matchAll(ATTR)) {
      const value = m[1] ?? m[2] ?? m[3];
      if (!hasClass(value, pair.override)) continue;
      used = true;
      checked++;
      if (!hasClass(value, pair.base)) {
        classProblems.push(`    ${relative(root, file)}:${lineOf(src, m.index)}  „${pair.override}" ohne „${pair.base}" → ${pair.base} ergänzen`);
      }
    }
  }
  if (used && !new RegExp(`\\.${pair.base}\\b`).test(glasskit)) {
    classProblems.push(`    GlassKit ${version} kennt .${pair.base} noch nicht → @jungherz-de/glasskit mindestens auf ${pair.glasskit} heben`);
  }
}

// 2. Landmarks: <main> nur im Layout, dort mit Skip-Link
const landmarkProblems = [];
const MAIN = /<main[\s>]/g;
const inLayout = (file) => file.startsWith(LAYOUTS + sep);
const layoutSources = [...text].filter(([f]) => inLayout(f)).map(([, src]) => src);
if (!layoutSources.some((src) => /<main[\s>]/.test(src))) {
  landmarkProblems.push('    src/layouts: kein <main> → <main id="main"> und den Skip-Link aus der Template-BaseLayout übernehmen (seit Template 1.2.1)');
} else if (!layoutSources.some((src) => /glw-skip/.test(src) && /href="#main"/.test(src))) {
  landmarkProblems.push('    src/layouts: <main> ohne Skip-Link → <a class="… glw-skip" href="#main"> aus der Template-BaseLayout übernehmen');
}
for (const [file, src] of text) {
  if (inLayout(file)) continue;
  for (const m of src.matchAll(MAIN)) {
    landmarkProblems.push(`    ${relative(root, file)}:${lineOf(src, m.index)}  eigenes <main> → Tag entfernen, BaseLayout umschließt jede Seite schon (der Inhalt bleibt)`);
  }
}

// 3. Icons in Primary-Buttons: jede Teilform muss geschlossen sein
const iconProblems = [];
let primaryIcons = 0;
const PRIMARY = /<(button|a|span)\b[^>]*\bclass=(?:"[^"]*\bglass-btn--primary\b[^"]*"|'[^']*\bglass-btn--primary\b[^']*')[^>]*>/g;
for (const [file, src] of text) {
  for (const m of src.matchAll(PRIMARY)) {
    const close = src.indexOf(`</${m[1]}>`, m.index);
    const inner = src.slice(m.index, close === -1 ? undefined : close);
    const svg = inner.match(/<svg[\s\S]*?<\/svg>/);
    if (!svg) continue;
    primaryIcons++;
    const open = [];
    if (/<(line|polyline)\b/.test(svg[0])) open.push('<line>/<polyline>');
    for (const d of svg[0].matchAll(/<path\b[^>]*\sd="([^"]+)"/g)) {
      for (const sp of d[1].split(/(?=[Mm])/).map((x) => x.trim()).filter(Boolean)) {
        if (!/[zZ]$/.test(sp)) open.push(`„${sp.length > 18 ? sp.slice(0, 18) + '…' : sp}"`);
      }
    }
    if (open.length) {
      iconProblems.push(`    ${relative(root, file)}:${lineOf(src, m.index)}  offen: ${open.slice(0, 3).join(', ')}${open.length > 3 ? ' …' : ''} → gefülltes Icon (geschlossene Formen) oder keins`);
    }
  }
}

if (classProblems.length || landmarkProblems.length || iconProblems.length) {
  if (classProblems.length) {
    console.error('\n✗ Override-Klassen ohne ihre GlassKit-Basis:\n');
    console.error(classProblems.join('\n'));
    console.error('\n  site.css stylt diese Blöcke nur noch als Abweichung von GlassKit; ohne die');
    console.error('  Basisklasse fehlt das Grundstyling still. Paare und Herkunft: PAIRS in diesem Skript.');
  }
  if (landmarkProblems.length) {
    console.error('\n✗ Landmarks passen nicht zur BaseLayout:\n');
    console.error(landmarkProblems.join('\n'));
    console.error('\n  Jede Seite braucht genau ein <main> — das aus der BaseLayout, mit dem Skip-Link davor.');
  }
  if (iconProblems.length) {
    console.error('\n✗ Icons in Primary-Buttons mit offenen Linien — GlassKit füllt sie, die Linien verschwinden:\n');
    console.error(iconProblems.join('\n'));
  }
  console.error('\n  Hintergrund: SKILL.md §3 (Landmarks), §4 (Regeln) und §7 (Updates).\n');
  process.exit(1);
}

console.log(
  `✓ Markup: ${checked} Override-Vorkommen mit GlassKit-Basis, <main> nur aus dem Layout, ` +
    `Skip-Link vorhanden, ${primaryIcons} ${primaryIcons === 1 ? 'Icon' : 'Icons'} in Primary-Buttons geschlossen (GlassKit ${version}).`
);
