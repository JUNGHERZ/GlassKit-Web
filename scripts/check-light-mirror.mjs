#!/usr/bin/env node
/* ============================================================
   Drift-Guard für den No-JS-Light-Spiegelblock (site.css)

   Ohne JavaScript kann kein data-theme gesetzt werden. Damit die Seite
   bei heller OS-Präferenz trotzdem hell aussieht, spiegelt site.css den
   [data-theme="light"]-Block von GlassKit in
   @media (prefers-color-scheme: light) { :root:not([data-theme]) { … } }.

   Dieser Spiegel driftet still: Tokens, die GlassKit in einem Minor-Release
   ergänzt, fehlen im Spiegel und fallen dann auf ihren DARK-Wert zurück —
   sichtbar nur im No-JS-Pfad, den kein Browser-Test standardmäßig abdeckt.
   (Genau so wären 1.7.0s --gl-state-scrim und --gl-color-*-on-surface
   als dunkle Badge-Tinte in einer hellen Seite gelandet.)

   Gespiegelt werden muss nur, was sich zwischen Dark und Light unterscheidet.
   Ein Projekt mit festem data-theme am <html> (z. B. nur Dark) braucht keinen
   Spiegel — dann meldet der Guard das und ist zufrieden.
   Aufruf: npm run check:tokens   (läuft auch als Teil von npm test)
   ============================================================ */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GLASSKIT = resolve(root, 'node_modules/@jungherz-de/glasskit/glasskit.css');
const SITE = resolve(root, 'src/styles/site.css');
const LAYOUTS = resolve(root, 'src/layouts');

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Alle Regeln einer Ebene als [Selektor/At-Regel, Body] — per Klammer-Zählung. */
function rulesOf(css) {
  const out = [];
  let depth = 0;
  let head = 0;
  let start = -1;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') {
      if (depth++ === 0) start = i + 1;
    } else if (css[i] === '}') {
      if (--depth === 0) {
        out.push([css.slice(head, start - 1).replace(/\s+/g, ' ').trim(), css.slice(start, i)]);
        head = i + 1;
      }
    } else if (css[i] === ';' && depth === 0) {
      head = i + 1; // @import/@charset u. ä. überspringen
    }
  }
  return out;
}

/** --gl-*-Deklarationen eines Regel-Bodys als Map (Werte whitespace-normalisiert). */
function tokensOf(body) {
  const out = new Map();
  for (const decl of body.split(';')) {
    const m = decl.match(/^\s*(--gl-[\w-]+)\s*:\s*([\s\S]+)$/);
    if (m) out.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  }
  return out;
}

const glasskitRules = rulesOf(stripComments(readFileSync(GLASSKIT, 'utf8')));
const findGlasskit = (test, label) => {
  const rule = glasskitRules.find(([sel]) => test(sel));
  if (!rule) throw new Error(`GlassKit-Block nicht gefunden: ${label}`);
  return tokensOf(rule[1]);
};
const dark = findGlasskit((sel) => sel.split(',').some((s) => s.trim() === ':root'), ':root (dark)');
const light = findGlasskit((sel) => sel === '[data-theme="light"]', '[data-theme="light"]');
const version = readFileSync(GLASSKIT, 'utf8').match(/v(\d+\.\d+\.\d+)/)?.[1] ?? '?';

// Spiegel = die Regel mit genau dem Selektor :root:not([data-theme]) in irgendeinem
// @media (prefers-color-scheme: light) — Projekte haben dort teils weitere Regeln.
let mirror = null;
for (const [sel, body] of rulesOf(stripComments(readFileSync(SITE, 'utf8')))) {
  if (!/^@media\s*\(\s*prefers-color-scheme\s*:\s*light\s*\)$/.test(sel)) continue;
  const rule = rulesOf(body).find(([inner]) => inner === ':root:not([data-theme])');
  if (rule) { mirror = tokensOf(rule[1]); break; }
}

if (!mirror) {
  const fixed = existsSync(LAYOUTS) && readdirSync(LAYOUTS)
    .filter((f) => f.endsWith('.astro'))
    .map((f) => readFileSync(resolve(LAYOUTS, f), 'utf8').match(/<html[^>]*\sdata-theme=["'](dark|light)["']/))
    .find(Boolean);
  if (fixed) {
    console.log(`✓ Kein No-JS-Light-Spiegel nötig: data-theme="${fixed[1]}" steht fest am <html> (GlassKit ${version}).`);
    process.exit(0);
  }
  console.error('\n✗ Kein No-JS-Light-Spiegel in site.css gefunden.');
  console.error('  Erwartet: @media (prefers-color-scheme: light) { :root:not([data-theme]) { --gl-…: …; } }');
  console.error('  Ohne ihn zeigt die Seite ohne JS bei heller OS-Präferenz die Dark-Palette.');
  console.error('  Block aus der Template-site.css übernehmen — oder data-theme fest ans <html> setzen,');
  console.error('  wenn das Projekt bewusst nur ein Theme hat.\n  Referenz: SKILL.md §3 (Theme).\n');
  process.exit(1);
}

const missing = [];
const wrong = [];
const redundant = [];

for (const [name, lightValue] of light) {
  const differs = dark.get(name) !== lightValue;
  const mirrored = mirror.has(name);
  if (differs && !mirrored) missing.push([name, lightValue]);
  else if (mirrored && mirror.get(name) !== lightValue) wrong.push([name, mirror.get(name), lightValue]);
  else if (!differs && mirrored) redundant.push(name);
}

const unknown = [...mirror.keys()].filter((name) => !light.has(name));

const line = (name, value) => `    ${(name + ':').padEnd(Math.max(30, name.length + 2))}${value};`;
const token = (n) => (n === 1 ? '1 Token' : `${n} Token`);
const verb = (n, one, many) => (n === 1 ? one : many);

if (missing.length) {
  console.error(`\n✗ Im Spiegelblock ${verb(missing.length, 'fehlt', 'fehlen')} ${token(missing.length)} mit abweichendem Light-Wert.`);
  console.error('  Ohne JS und bei heller OS-Präferenz greift dort der Dark-Wert.');
  console.error('  In site.css einfügen (@media prefers-color-scheme: light):\n');
  for (const [name, value] of missing) console.error(line(name, value));
}

if (wrong.length) {
  console.error(`\n✗ ${token(wrong.length)} im Spiegelblock ${verb(wrong.length, 'weicht', 'weichen')} von GlassKit ${version} ab — so ersetzen:\n`);
  for (const [name, mine, theirs] of wrong) console.error(`${line(name, theirs)}\n        bisher: ${mine}`);
}

if (unknown.length) {
  console.error(`\n✗ ${token(unknown.length)} im Spiegelblock ${verb(unknown.length, 'existiert', 'existieren')} in GlassKits Light-Block nicht:\n`);
  for (const name of unknown) console.error(`    ${name}`);
  console.error(`\n  Tippfehler, von GlassKit entfernt — oder die installierte GlassKit-Version (${version}) ist`);
  console.error('  älter als der Spiegel: Version in package.json prüfen, dann npm install.');
}

if (missing.length || wrong.length || unknown.length) {
  console.error('\n  Referenz: SKILL.md §3 (Theme) und §7 (Updates).\n');
  process.exit(1);
}

console.log(
  `✓ No-JS-Light-Spiegel deckt GlassKit ${version} ab: ` +
    `${mirror.size - redundant.length} abweichende Token gespiegelt` +
    (redundant.length ? `, ${redundant.length} überzählig (Light = Dark, unschädlich)` : '') +
    '.'
);
