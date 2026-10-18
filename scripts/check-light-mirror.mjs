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
   Seit GlassKit 1.24 kommen die Oberflächen-Presets (data-surface="solid" |
   "tint") dazu: Ohne data-theme griffe sonst der Glas-Spiegel, deshalb trägt
   der Spiegel auch GlassKits Light-Blöcke der Presets — der Guard vergleicht
   sie vollständig. Dasselbe gilt für die Markendatei: Was brand.css nur für
   [data-theme="light"] setzt, muss auch in ihrem No-JS-Block stehen, sonst
   gilt ohne JavaScript der Dark-Wert aus :root. Ein Projekt mit festem
   data-theme am <html> (z. B. nur Dark) braucht keinen Spiegel — dann meldet
   der Guard das und ist zufrieden.
   Aufruf: npm run check:tokens   (läuft auch als Teil von npm test)
   ============================================================ */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GLASSKIT = resolve(root, 'node_modules/@jungherz-de/glasskit/glasskit.css');
const SITE = resolve(root, 'src/styles/site.css');
const BRAND = resolve(root, 'src/styles/brand.css');
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
    const m = decl.match(/^\s*(--glw?-[\w-]+)\s*:\s*([\s\S]+)$/);
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
const parts = (sel) => sel.split(',').map((s) => s.trim());
const dark = findGlasskit((sel) => parts(sel).includes(':root'), ':root (dark)');
const light = findGlasskit((sel) => sel === '[data-theme="light"]', '[data-theme="light"]');
// Presets (ab GlassKit 1.24/1.25) — fehlen sie, ist GlassKit älter
const optional = (test) => { const r = glasskitRules.find(([sel]) => test(sel)); return r ? tokensOf(r[1]) : null; };
const PRESETS = [
  { label: 'Preset solid/tint (Light)', since: '1.24.0',
    glasskit: optional((sel) => parts(sel).includes('[data-surface="solid"][data-theme="light"]')),
    selector: ':root[data-surface="solid"]:not([data-theme]), :root[data-surface="tint"]:not([data-theme])' },
  { label: 'Preset tint', since: '1.25.0',
    glasskit: optional((sel) => parts(sel).includes(':root[data-surface="tint"]')),
    selector: ':root[data-surface="tint"]:not([data-theme])' },
];
const version = readFileSync(GLASSKIT, 'utf8').match(/v(\d+\.\d+\.\d+)/)?.[1] ?? '?';

// Spiegel = die Regel mit genau dem Selektor :root:not([data-theme]) in irgendeinem
// @media (prefers-color-scheme: light) — mit oder ohne „, print"; Projekte haben dort
// teils weitere Regeln. Im selben Block liegen die Preset-Regeln.
const MEDIA = /^@media\s*\(\s*prefers-color-scheme\s*:\s*light\s*\)(\s*,\s*print)?$/;
let mirror = null;
const presetRules = new Map();
for (const [sel, body] of rulesOf(stripComments(readFileSync(SITE, 'utf8')))) {
  if (!MEDIA.test(sel)) continue;
  const inner = rulesOf(body);
  const rule = inner.find(([s]) => s === ':root:not([data-theme])');
  if (!rule) continue;
  mirror = tokensOf(rule[1]);
  for (const [s, b] of inner) if (PRESETS.some((p) => p.selector === s)) presetRules.set(s, tokensOf(b));
  break;
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

// Presets: jede Regel muss GlassKits Preset-Block vollständig und wertgleich tragen
let presetProblems = 0;
const presetSummary = [];
for (const preset of PRESETS) {
  const mine = presetRules.get(preset.selector);
  if (!preset.glasskit) {
    if (mine) {
      presetProblems++;
      console.error(`\n✗ ${preset.label}: site.css spiegelt ein Preset, das GlassKit ${version} noch nicht kennt`);
      console.error(`  (seit ${preset.since}) — @jungherz-de/glasskit heben, dann npm install.`);
    }
    continue;
  }
  if (!mine) {
    presetProblems++;
    console.error(`\n✗ ${preset.label} fehlt im Spiegel — ohne JS griffe bei data-surface das Glas.`);
    console.error('  Im selben @media-Block nach der :root:not([data-theme])-Regel einfügen:\n');
    console.error(`  ${preset.selector.replace(', ', ',\n  ')} {`);
    for (const [name, value] of preset.glasskit) console.error(line(name, value));
    console.error('  }');
    continue;
  }
  const pMissing = [...preset.glasskit].filter(([n]) => !mine.has(n));
  const pWrong = [...preset.glasskit].filter(([n, v]) => mine.has(n) && mine.get(n) !== v);
  const pUnknown = [...mine.keys()].filter((n) => !preset.glasskit.has(n));
  if (pMissing.length || pWrong.length || pUnknown.length) {
    presetProblems++;
    console.error(`\n✗ ${preset.label} weicht von GlassKit ${version} ab (${preset.selector}):\n`);
    for (const [n, v] of pMissing) console.error(`${line(n, v)}   ← fehlt`);
    for (const [n, v] of pWrong) console.error(`${line(n, v)}\n        bisher: ${mine.get(n)}`);
    for (const n of pUnknown) console.error(`    ${n}   ← kennt GlassKit hier nicht`);
  } else presetSummary.push(`${preset.label.replace('Preset ', '')} ${mine.size}`);
}

// brand.css: Werte nur für [data-theme="light"] brauchen ihren No-JS-Zwilling
let brandProblems = 0;
let brandLightCount = 0;
if (existsSync(BRAND)) {
  const lightBrand = new Map();
  const nojsBrand = new Map();
  for (const [sel, body] of rulesOf(stripComments(readFileSync(BRAND, 'utf8')))) {
    if (MEDIA.test(sel)) {
      for (const [s, b] of rulesOf(body)) if (s === ':root:not([data-theme])') for (const [k, v] of tokensOf(b)) nojsBrand.set(k, v);
    } else if (parts(sel).includes('[data-theme="light"]')) {
      for (const [k, v] of tokensOf(body)) lightBrand.set(k, v);
    }
  }
  brandLightCount = lightBrand.size;
  const bMissing = [...lightBrand].filter(([k]) => !nojsBrand.has(k));
  const bWrong = [...lightBrand].filter(([k, v]) => nojsBrand.has(k) && nojsBrand.get(k) !== v);
  if (bMissing.length || bWrong.length) {
    brandProblems = bMissing.length + bWrong.length;
    console.error(`\n✗ brand.css setzt ${token(brandProblems)} für [data-theme="light"], ohne ${verb(brandProblems, 'ihn', 'sie')} im No-JS-Block gleich zu setzen.`);
    console.error('  Ohne JavaScript (und beim Drucken ohne JS) gilt dort sonst der Dark-Wert aus :root.');
    console.error('  In brand.css so führen:\n');
    console.error('  @media (prefers-color-scheme: light), print {\n    :root:not([data-theme]) {');
    for (const [k, v] of lightBrand) console.error(`  ${line(k, v)}`);
    console.error('    }\n  }');
  }
}

if (missing.length || wrong.length || unknown.length || presetProblems || brandProblems) {
  console.error('\n  Referenz: SKILL.md §3 (Theme, Presets) und §7 (Updates).\n');
  process.exit(1);
}

console.log(
  `✓ No-JS-Light-Spiegel deckt GlassKit ${version} ab: ` +
    `${mirror.size - redundant.length} abweichende Token gespiegelt` +
    (redundant.length ? `, ${redundant.length} überzählig (Light = Dark, unschädlich)` : '') +
    (presetSummary.length ? `; Presets ${presetSummary.join(' + ')} Token` : '') +
    (brandLightCount ? `; brand.css: ${brandLightCount} Light-Token mit No-JS-Zwilling` : '') +
    '.'
);
