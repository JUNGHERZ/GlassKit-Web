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
   Aufruf: npm run check:tokens   (läuft auch als erster Schritt von npm test)
   ============================================================ */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GLASSKIT = resolve(root, 'node_modules/@jungherz-de/glasskit/glasskit.css');
const SITE = resolve(root, 'src/styles/site.css');

/** Body einer Regel ab der Position ihres Selektors, per Klammer-Zählung. */
function bodyAt(css, from) {
  let depth = 0;
  let start = -1;
  for (let i = from; i < css.length; i++) {
    if (css[i] === '{') {
      if (depth++ === 0) start = i + 1;
    } else if (css[i] === '}') {
      if (--depth === 0) return css.slice(start, i);
    }
  }
  throw new Error('Unbalancierte Klammern ab Position ' + from);
}

function bodyOf(css, selector, label) {
  const m = css.match(selector);
  if (!m) throw new Error(`Block nicht gefunden: ${label}`);
  return bodyAt(css, m.index);
}

/** --gl-*-Deklarationen eines Regel-Bodys als Map (Werte whitespace-normalisiert). */
function tokensOf(body) {
  const out = new Map();
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const decl of clean.split(';')) {
    const m = decl.match(/^\s*(--gl-[\w-]+)\s*:\s*([\s\S]+)$/);
    if (m) out.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  }
  return out;
}

const glasskit = readFileSync(GLASSKIT, 'utf8');
const site = readFileSync(SITE, 'utf8');

const dark = tokensOf(bodyOf(glasskit, /^:root[^{]*\{/m, ':root (dark)'));
const light = tokensOf(bodyOf(glasskit, /^\[data-theme="light"\]\s*\{/m, '[data-theme="light"]'));

const mediaBody = bodyOf(site, /@media \(prefers-color-scheme: light\)/, '@media (prefers-color-scheme: light)');
const mirror = tokensOf(bodyOf(mediaBody, /:root:not\(\[data-theme\]\)/, ':root:not([data-theme])'));

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

const version = glasskit.match(/v(\d+\.\d+\.\d+)/)?.[1] ?? '?';
const pad = (n) => n.padEnd(30);
const token = (n) => (n === 1 ? '1 Token' : `${n} Token`);

if (missing.length) {
  console.error(`\n✗ Im Spiegelblock fehlt ${token(missing.length)} mit abweichendem Light-Wert.`);
  console.error('  Ohne JS und bei heller OS-Präferenz greift dort der Dark-Wert.');
  console.error('  In site.css einfügen (@media prefers-color-scheme: light):\n');
  for (const [name, value] of missing) console.error(`    ${pad(name + ':')}${value};`);
}

if (wrong.length) {
  console.error(`\n✗ ${token(wrong.length)} im Spiegelblock weicht von GlassKit ab (Spiegel → GlassKit):\n`);
  for (const [name, mine, theirs] of wrong) console.error(`    ${name}\n      Spiegel:  ${mine}\n      GlassKit: ${theirs}`);
}

if (unknown.length) {
  console.error(`\n✗ ${token(unknown.length)} im Spiegelblock existiert in GlassKits Light-Block nicht (Tippfehler oder entfernt):\n`);
  for (const name of unknown) console.error(`    ${name}`);
}

if (missing.length || wrong.length || unknown.length) {
  console.error('\n  Referenz: SKILL.md §3 (Theme) und §7 (GlassKit layer).\n');
  process.exit(1);
}

console.log(
  `✓ No-JS-Light-Spiegel deckt GlassKit ${version} ab: ` +
    `${mirror.size - redundant.length} abweichende Token gespiegelt` +
    (redundant.length ? `, ${redundant.length} überzählig (Light = Dark, unschädlich)` : '') +
    '.'
);
