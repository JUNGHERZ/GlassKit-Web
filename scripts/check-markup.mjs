#!/usr/bin/env node
/* ============================================================
   Markup-Guard: glw-Override-Klassen brauchen ihre GlassKit-Basis

   Wenn GlassKit eine Komponente mitbringt, die vorher im glw-Layer lebte,
   setzt das Template darauf auf: Das Markup trägt beide Klassen, und
   site.css behält nur noch die Abweichungen der Website. Seitdem hängt
   site.css am Markup — und genau das bricht beim Nachziehen in abgeleiteten
   Projekten: site.css wird dort komplett übernommen (SKILL.md §7), die
   Komponenten und Rechtsseiten mit dem Markup aber nie. Fehlt die
   Basisklasse, fehlt still das halbe Styling (bei .glw-prose: Zeilenhöhe,
   Abstände, Linkfarben auf jeder Rechtsseite und im Blog).

   Prüft, dass jedes Element mit einer Override-Klasse auch die Basisklasse
   trägt — und dass die installierte GlassKit-Version die Basis überhaupt kennt.
   Neues Paar = eine Zeile in PAIRS.
   Aufruf: npm run check:markup   (läuft auch als Teil von npm test)
   ============================================================ */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative, extname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GLASSKIT = resolve(root, 'node_modules/@jungherz-de/glasskit/glasskit.css');
const SRC = resolve(root, 'src');

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

// class="…", class='…', class={`…`}, class:list={[…]} — Klassenlisten grob, aber ohne Fehlalarm:
// gezählt werden nur ganze Klassennamen, Modifier wie glw-prose--article zählen nicht als Override.
const ATTR = /\bclass(?::list)?=(?:"([^"]*)"|'([^']*)'|\{([\s\S]*?)\}(?=[\s/>]))/g;
const hasClass = (text, cls) => new RegExp(`(^|[\\s"'\`\\[,{])${cls}(?=$|[\\s"'\`\\],}])`).test(text);

const glasskit = readFileSync(GLASSKIT, 'utf8');
const version = glasskit.match(/v(\d+\.\d+\.\d+)/)?.[1] ?? '?';
const problems = [];
let checked = 0;

for (const pair of PAIRS) {
  let used = false;
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(ATTR)) {
      const value = m[1] ?? m[2] ?? m[3];
      if (!hasClass(value, pair.override)) continue;
      used = true;
      checked++;
      if (!hasClass(value, pair.base)) {
        const line = text.slice(0, m.index).split('\n').length;
        problems.push(`    ${relative(root, file)}:${line}  „${pair.override}" ohne „${pair.base}" → ${pair.base} ergänzen`);
      }
    }
  }
  if (used && !new RegExp(`\\.${pair.base}\\b`).test(glasskit)) {
    problems.push(`    GlassKit ${version} kennt .${pair.base} noch nicht → @jungherz-de/glasskit mindestens auf ${pair.glasskit} heben`);
  }
}

if (problems.length) {
  console.error('\n✗ Markup passt nicht zur site.css: Override-Klassen ohne ihre GlassKit-Basis.\n');
  console.error(problems.join('\n'));
  console.error('\n  site.css stylt diese Blöcke nur noch als Abweichung von GlassKit; ohne die');
  console.error('  Basisklasse fehlt das Grundstyling still. Paare und Herkunft: scripts/check-markup.mjs,');
  console.error('  Hintergrund: SKILL.md §4 (Regeln) und §7 (Updates).\n');
  process.exit(1);
}

console.log(`✓ Markup: ${checked} Override-Vorkommen geprüft, alle mit GlassKit-Basis (GlassKit ${version}).`);
