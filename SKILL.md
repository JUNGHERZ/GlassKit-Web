---
name: glasskit-web
description: AI reference for GlassKit Web — an Astro starter for glassmorphism marketing sites that address B2C and B2B audiences from one codebase. Use this whenever building a new website from this template or converting an existing site to it. For GlassKit component markup (glass-* classes), always consult the GlassKit SKILL.md as well.
---

# GlassKit Web – AI Reference

Astro 5 starter for marketing/landing websites in the GlassKit design language
(glassmorphism, dark/light, orange primary). One codebase serves **two audiences**
(B2C and B2B) via a runtime switch. Demo brand "LUMEN" — every piece of copy is a
placeholder meant to be replaced per project.

**Layering — know which reference to use:**

| Layer | Prefix | Source | Reference |
|---|---|---|---|
| Design tokens + UI components | `glass-*`, `--gl-*` | npm `@jungherz-de/glasskit` (never edit) | [GlassKit SKILL.md](https://github.com/JUNGHERZ/GlassKit/blob/main/SKILL.md) |
| Site/section layer (this repo) | `glw-*` | `src/styles/site.css` | this file |

## 1. File Responsibilities

```
site/                   Product landing page + docs of GlassKit Web itself
                        (static HTML, deployed at the domain root; the demo
                        builds to /demo/). NOT part of the template — DELETE
                        this directory when deriving a project (§5 step 1).
astro.config.mjs        site + base. This repo: base '/demo/' (demo lives next
                        to the landing page). Fork → change base to
                        '/<repo-name>'. Custom domain → remove base, set site,
                        add public/CNAME.
src/data/site.ts        siteName, titles, repoUrl + base/href() link helper +
                        languages[] (i18n opt-in) with pathLang()/localeHref().
src/styles/site.css     ALL custom CSS (global). glw-* classes, --gl-* tokens only.
src/styles/brand.css    Per-project brand overrides (--gl-* tokens ONLY, loads last).
                        This is THE place for client colors — never edit glasskit.css
                        or recolor glw rules. Ships with commented example themes.
src/scripts/site.js     Behavior: theme toggle, audience switch, reveal, tilt.
                        Progressive enhancement — pages must work without it.
src/layouts/BaseLayout.astro  <head>, CSS imports (GlassKit BEFORE site.css),
                        bootstrap <script is:inline>, glass-bg wrapper, skip link,
                        header/footer and the page's only <main id="main"> around
                        the slot (§3 Landmarks).
src/components/*.astro  One file per section. Copy lives HERE, next to its markup.
                        Repeated structures (features, stats, plans) are frontmatter
                        const arrays rendered with .map().
src/components/en/      English language branch of the same sections (i18n opt-in;
                        same structure, translated copy). See §3b.
src/pages/en/           English pages under /en/ (same slugs as the default language).
src/assets/flags/       circle-flags language SVGs (MIT) for the 3+-language switcher.
src/pages/*.astro       File routing. index.astro composes the one-pager.
                        404.astro → dist/404.html (served by GitHub Pages).
src/content.config.ts   Blog collection schema (title, description, pubDate, author).
src/content/blog/*.md   Blog posts (Markdown). OPT-IN feature — see removal note below.
src/pages/blog/         index.astro (overview) + [slug].astro (article via glw-prose).
src/pages/rss.xml.ts    RSS feed from the blog collection (base-safe links).
src/pages/robots.txt.ts Generates robots.txt from site+base (fork-safe).
                        Note: ignored by crawlers on github.io/<repo>/ project
                        pages (not at domain root); effective with custom domain.
src/pages/llms.txt.ts   llms.txt (llmstxt.org): curated Markdown index for AI
                        assistants, generated from site.ts + blog collection +
                        languages[]. The page notes in mainPages[] are copy —
                        adjust per project. Honest scope: AI search crawlers
                        ignore the file today, AI coding assistants do fetch
                        it; same domain-root caveat as robots.txt.
public/og.png           Social preview image (1200×630) — replace per project.
playwright.config.ts    Smoke-test config. baseURL/webServer derive from astro.config.mjs
                        (fork-safe); webServer rebuilds before preview (stale-dist guard).
tests/smoke.spec.ts     CI smoke tests — run as the "test" job in deploy.yml before
                        deploy; a red suite blocks the release.
scripts/check-*.mjs     Guards that tie site.css to the installed GlassKit. `npm run check`
                        runs both — first step of `npm test` and its own CI step:
                        check-light-mirror.mjs (`check:tokens`) diffs the no-JS light
                        mirror (§3), including its surface-preset rules, against
                        GlassKit and prints the lines to add or replace; check-markup.mjs (`check:markup`) finds glw override
                        classes whose GlassKit base class is missing in the markup (§4)
                        and any `<main>` outside the layout (§3 Landmarks).
                        Project-neutral tooling — derived projects take them as-is (§7).
```

## 2. Section Catalog (compose in `src/pages/index.astro`)

| Component | Purpose | Notes |
|---|---|---|
| `SiteHeader` | Fixed glass nav: brand, anchors, theme toggle, CTA, mobile menu | Rendered by BaseLayout. Nav links exist TWICE: desktop `.glw-nav` and the `<details id="mobileNav">` overlay panel — always update both. Mobile menu opens/closes natively without JS (details/summary); site.js adds focus trap, ESC, scroll lock |
| `Hero` | Audience switch + headline pair + CTAs + decorative device panel | The device panel is a mini component showcase (aria-hidden); swap its content to match the product. 3D tilt is OPT-IN: `glw-hero__visual--tilt` + `data-tilt` on the visual (default ON in the demo; remove both for a flat panel) |
| `HeroEditorial` | ALTERNATIVE hero: typographic, single-column, no device panel | For service providers/agencies without a product UI (fastest LCP). Swap for `Hero` in index.astro; ships without the audience switch (add `.only-*` pairs if needed). Services badges + stat line are placeholders |
| `LogoStrip` | Social proof wordmarks | Text-only, styled via `glw-wordmark--*` variants |
| `Features` | 3-column glass card grid | Edit the `features[]` array (icon = inline outline SVG string, 24 viewBox) |
| `Bento` | Multi-column feature cards, each with an embedded mini visualization in a media slot | Built from GlassKit/glw components (badges, progress, search, `glw-node`, avatars) instead of images — see §2b. Media slots are decorative (aria-hidden); column widths via `--wide`/`--narrow` (7/5 of 12) |
| `Process` | Numbered how-it-works steps | `steps[]` array; numbering is honest here (real sequence) — don't add numbers to non-sequential sections |
| `Flow` | Embedded process visualization: sources → core → targets | Glass nodes (DOM) over an SVG with connector paths + traveling data points (`animateMotion`, no JS). Diagram is decorative (aria-hidden) — the message lives in the lead. See §2b |
| `Showcase` | 3D-tilted "spatial" glass window (visionOS look) | Decorative; parallax via `data-tilt` (generic mechanism in site.js) |
| `Stats` | 4 KPI figures, typographic | `stats[]` array; keep `tabular-nums` styling |
| `Cases` | Success stories / references | `cases[]` array: metric (gradient number) + label + text + client name |
| `Team` | People grid with initials avatars | `team[]` array; no photos in the template — replace avatars per project or drop the section |
| `Pricing` | Two plan grids, one per audience | `plansB2C[]` / `plansB2B[]`; `hot: true` highlights one plan |
| `Quote` | Serif testimonial, one per audience | Paired `.only-b2c` / `.only-b2b` blocks |
| `Faq` | GlassKit accordion + FAQPage JSON-LD | Edit the `faqs[]` array; `audience: 'b2c'\|'b2b'` marks audience-specific questions. JSON-LD mirrors the default (no-JS) view: general + B2C only. Toggle handled by site.js; without JS all answers render expanded |
| `LanguageSwitcher` | Language switcher in the header actions | Renders nothing with 1 language, a "DE \| EN" segmented pill with exactly 2, a details-based flag dropdown with 3+. Entries are LINKS to the equivalent page in the target language — never a JS toggle |
| `Contact` | Contact form (`id="kontakt"` — nav/footer link here) | Endpoint configured in `site.ts` (`contactForm`); empty endpoint = demo mode. Honeypot field `botcheck`, required consent checkbox linking to `/datenschutz/`, B2B-only company field. With JS: fetch + inline `glass-status`; without JS: native POST to the endpoint. A click handler on the submit button shows `data-msg-invalid` when `checkValidity()` fails — a persistent, translatable message alongside the transient native bubble (with GlassKit ≤ 1.6.3 this was mandatory: the 0×0 hidden checkbox input gave the bubble no anchor, silently blocking the submit; fixed upstream in 1.6.4). While sending, site.js disables the submit button; GlassKit ≥ 1.21.2 dims it — no own disabled look |
| `CtaBanner` | Closing call-to-action panel | Warm border (`--gl-border-warm`) |
| `SiteFooter` | Link columns, newsletter dummy, legal links | Rendered by BaseLayout |
| `glw-page` + `glw-prose` | Plain text subpage (Impressum/Datenschutz pattern) | See `src/pages/impressum.astro`. The container carries `glass-prose glw-prose`: GlassKit's `.glass-prose` (≥ 1.14.0) styles the running text, `.glw-prose` only overrides column width, heading size and muted paragraphs |

Section skeleton (every section follows this):

```html
<section class="glw-section" id="anchor-id">
  <div class="glw-container">
    <div class="glw-center reveal">
      <span class="glw-eyebrow">Eyebrow label</span>
      <h2 class="glw-h2">Headline.</h2>
      <p class="glw-lead">Subline.</p>
    </div>
    <!-- section body -->
  </div>
</section>
```

### 2b. Embedded visualizations (build, don't screenshot)

Whenever a task calls for "more visuals" — product depictions, process flows,
architecture derivations, integration overviews — build them from DOM/SVG
instead of images. Rationale: glassmorphism cannot be screenshotted
(`backdrop-filter` needs the live page background), DOM visuals inherit
tokens/theme/rebranding for free, and they cost no LCP.

Building blocks, in escalating order:

1. **Component collage** — GlassKit components arranged decoratively
   (`Hero` device panel pattern). For product/app depictions.
2. **Feature cards with media slots** — `Bento` pattern: `.glw-bento__media`
   (fixed height, sunken glass surface) holding a small built visualization
   per card — a `glw-node` with orbiting badges, avatars + `glass-progress`,
   a `glass-search` mock (use a `<span class="glass-input">`, never a real
   input — decorative), a badge chain with arrows. For feature highlights.
3. **Tilt/parallax** — `data-tilt` on any element + base angles in CSS via
   `calc(<base> + var(--tilt-dx/dy, 0deg))`; site.js sets the deltas on
   pointermove (fine pointers only, disabled with reduced motion).
   Used by `Showcase` (`.glw-window`) and the hero tilt opt-in.
4. **Flow diagram** — `.glw-flow` box (fixed `aspect-ratio`, `min-width`,
   horizontal scroll inside `.glw-flow-scroll`), `.glw-node` glass nodes
   positioned absolutely in % (SVG coordinate ÷ 10 and ÷ 4.6 for a
   1000×460 viewBox), connector `<path>`s + `.glw-flow__pulse` circles with
   SMIL `animateMotion`. No JS; reduced motion hides the pulses via CSS
   (SMIL can't be paused from CSS). Adapt the `Flow` section rather than
   building from scratch; give path/mpath ids a `glwFp` prefix per page to
   avoid collisions.

Rules: diagrams are decorative (`aria-hidden`) with the message in the
section lead; never introduce raster/stock imagery for these purposes.

### 2c. GlassKit building blocks vs. the glw layer

GlassKit keeps growing (34 components in 1.19). Before adding a `glw-` block,
check whether GlassKit already has it — and know where the website layer stays
separate on purpose:

| GlassKit | Use in a website for | Not for — the template keeps its own |
|---|---|---|
| `.glass-prose` (1.14) | All running text — the template builds on it (`glass-prose glw-prose`) | — |
| `.glass-table` (1.14) | Comparison tables (plan matrix, spec sheet) inside a section | — |
| `.glass-badge--warning` (1.18) | A third tone for "beta", "limited", "pending" chips | — |
| `.glass-avatar` (early) | Real team photos (`<img>` inside, `object-fit: cover`), neutral initials on glass | LUMEN's `.glw-avatar`: initials on a filled brand gradient, a different look rather than a variant — swap to `.glass-avatar` when a project brings photos |
| `.glass-segmented` (1.15) | A small exclusive choice in content, e.g. monthly / yearly pricing | The hero's audience switch `.glw-seg`: its two long labels wrap inside the pill on narrow phones, while `.glass-segmented` keeps items on one line — at 320 px the second option would run past the edge. The language pill `.glw-lang` is made of **links** (`aria-current`), and `.glass-segmented` styles only `aria-pressed` buttons |
| `.glass-steps` (1.15) | Progress through a multi-step form | The `Process` section (`.glw-steps`): a marketing sequence of cards, not a progress state |
| `.glass-empty` (1.15) | Empty states, e.g. a blog filter with no hits | The 404 page: an editorial text page with two actions |
| `.glass-toast` + `__action` / `__close` (1.19) | JS-driven transient notices | Form results: `Contact` keeps the inline `glass-status` next to the form — it persists and needs no JS to be read |
| `.glass-sheet` (1.15) | App-like bottom sheets | The mobile menu: `<details>`-based, must work without JS |
| `.glass-input-wrap` + `__prefix` / `__suffix` (1.22) | A unit, icon or button inside a field: price calculator, newsletter field with a send icon | — |
| `.glass-skeleton` (1.14), `.glass-calendar`, `.glass-date-strip`, `.glass-image-picker` (1.16) | Rarely on a static marketing site — app territory (GlassKit Elements) | — |

If a "not for" case changes upstream (e.g. `.glass-segmented` learns links or
wrapping labels), migrate per the rule in §4 and register the pair in
`scripts/check-markup.mjs`.

## 3. Core Mechanics

**Audience (B2C/B2B):** `data-audience="b2c|b2b"` on `<html>`, set by the bootstrap
script and the `[data-audience-btn]` segmented control. Content variants are sibling
elements with `.only-b2c` / `.only-b2b`. Without JS, B2C is shown (CSS
`:root:not([data-audience="b2b"]) .only-b2b { display: none }`). Keep copy pairs
adjacent in markup. B2C speaks "du", B2B speaks "Sie".

**Theme:** `data-theme="dark|light"` on `<html>`. Bootstrap sets it from the OS
preference before first paint; `#themeToggle` flips it. A no-JS CSS fallback block in
site.css mirrors the light tokens — never delete it. It mirrors only the tokens whose
light value differs from the dark one, and it drifts silently: tokens added to
GlassKit's `[data-theme="light"]` block are missing here and fall back to their dark
value in the no-JS/OS-light path (that is how 1.7.0's `--gl-state-scrim` and
`--gl-color-*-on-surface` would have put dark badge ink into a light page). No browser
test covers that path, so `npm run check:tokens`
(`scripts/check-light-mirror.mjs`) compares the mirror against GlassKit on every
`npm test` and in CI, and prints the exact lines to add or replace. The block's
media query is `(prefers-color-scheme: light), print`, so a page printed without
JS is light too. A project that pins `data-theme` on `<html>` (one theme by brand
decision) needs no mirror — delete the block there; the guard sees the pinned
attribute and passes.

**GlassKit presets:** `data-surface="solid"` (opaque surfaces, no blur, GlassKit
1.24) and `data-surface="tint"` (see-through tints of the text colour for a page
with a background of its own — brand colour, photo, pattern; 1.25) go on `<html>`
in BaseLayout, next to the `data-theme` the bootstrap sets. The glw layer follows
both without changes (measured: no element blurs, surfaces and shine follow the
tokens); `.glw-media` stays a fixed picture. Without JS there is no `data-theme`,
so the light mirror above would bring the glass back — the mirror therefore holds
GlassKit's light preset blocks as two more rules (`:root[data-surface=…]:not([data-theme])`),
dormant without the attribute and checked by the guard. With `solid`, set
`--gl-color-bg-mid` in brand.css to the brand background: the solid surfaces are
mixed over it. `data-density="compact"` (1.21) shrinks controls for app screens —
rarely right for a marketing page.

**Print:** paper is light, so site.js switches to the light theme on
`beforeprint` and back on `afterprint` (GlassKit 1.21.1's recipe; without JS the
mirror covers `print`). The skip link is hidden in print. Check a legal page with
Ctrl+P after design changes — dark-only projects print light as well, which is
intended.

**Landmarks & skip link:** BaseLayout wraps every page in the one
`<main id="main" tabindex="-1">` and puts a skip link (`.glw-skip`, "Zum Inhalt
springen" / "Skip to content") in front of the header — the first tab stop,
visible only with keyboard focus, one Enter lands in the content instead of
ten header stops later (WCAG 2.4.1). Header and footer stay outside `<main>`;
they are landmarks of their own. Pages and components never add a `<main>` —
`npm run check:markup` names any it finds. The skip link is the secondary
button on an opaque plate (≥ 5:1 in both themes); the primary's white on orange
would miss AA. Its labels are the only copy in BaseLayout (`skipLabels`, §3b).

**Reveal/motion:** `.reveal` elements fade in via IntersectionObserver (only when
`html.js` present). Stagger with inline `style="--d:.07s"`. `prefers-reduced-motion`
disables float/tilt/reveal — keep that media block intact.

**Page transitions:** cross-document view transitions are enabled CSS-only via
`@view-transition { navigation: auto }` (site.css); the header carries
`view-transition-name: glw-header` so it stays stable while content cross-fades.
Progressive enhancement — unsupported browsers navigate normally. Keep the
`navigation: none` override inside the reduced-motion block.
**Testing note:** in headless Chrome, click-initiated navigations stall on the
render-blocking transition (no compositor frames are produced) and the page
freezes — always run Playwright/automation with
`page.emulateMedia({ reducedMotion: 'reduce' })`, which routes through the
`navigation: none` override. Real, visible browsers are unaffected.
The repo's own smoke suite (`npm test`) enforces this in a `beforeEach`;
the `use.reducedMotion` config option alone is NOT enough — the test-runner
fixture context does not reliably apply it (observed with Playwright 1.61).
Tick GlassKit checkboxes, toggles and radios by role
(`getByRole('checkbox').check()`): since GlassKit 1.20 the invisible input lies
on top of the box and takes the click, so clicking `.glass-checkbox__box` fails
with "intercepts pointer events".

### 3b. i18n (opt-in) — language branches

Default language lives at the root, every additional language under `/<code>/`
as its OWN BRANCH: pages in `src/pages/<code>/`, section components in
`src/components/<code>/` (same structure, translated copy — the "copy next to
its markup" convention stays intact). Configured in TWO places that must match:
`languages[]` in `src/data/site.ts` and the `i18n` block in `astro.config.mjs`.
BaseLayout derives `<html lang>`, `og:locale` and hreflang alternates from the
URL; the sitemap gets xhtml:link alternates via its `i18n` option.

Rules for language branches:
- Same slugs in every language (`/en/impressum/`, not `/en/imprint/`) — keeps
  `localeHref()` mapping-free. Anchor IDs MAY be translated (they are copy);
  links inside a branch always carry the prefix: `href('/en/#pricing')`.
- Keep structure changes (new/removed/reordered sections) in sync across all
  branches — the smoke tests catch missing pages, not missing sections.
- Pages without a translation (blog, 404) pass `translated={false}` to
  BaseLayout: no hreflang is emitted, the switcher links to the target
  language's home page instead, and BaseLayout renders BOTH header/footer
  pairs, each wrapped in `.glw-i18n .glw-i18n--<code>`. The blog appears only
  in the default language (no blog link in EN header/footer).
- The 404 is ONE file for every path (GitHub Pages serves dist/404.html under
  /en/… too), so 404.astro also renders its content once per language as
  `.glw-i18n--<code>` branches. The bootstrap script sets `data-path-lang` on
  `<html>` from the URL before first paint; CSS in site.css shows only the
  matching branch (no JS → default language). The build URL is always /404/,
  so the switcher can't derive the branch language from the URL — the
  SiteHeaders pass it via the `current` prop of LanguageSwitcher.
- Contact form status messages travel as `data-msg-*` attributes on the form
  (site.js reads them; German fallbacks live in site.js) — including
  `data-msg-invalid`, shown when native validation blocks the submit.
- Header/Footer are part of each branch (nav labels are copy); BaseLayout picks
  the pair by locale — a new language adds one more branch there, plus its
  skip-link label in `skipLabels` and a `.glw-i18n--<code>` skip link next to
  the header's on untranslated pages (missing labels fall back to English).
- Right-to-left languages: GlassKit mirrors itself under `dir="rtl"` since 1.20;
  the glw layer does not yet — about two dozen physical `left`/`right` values
  (positions, the article list indent and quote rule, tilt angles) need
  logical properties before an RTL branch ships.

**Add a language:** extend `languages[]` + astro.config locales; copy
`src/components/en/` + `src/pages/en/` to the new code and translate; add the
branch to BaseLayout's header/footer pick AND its dual-render block for
untranslated pages, a content branch to 404.astro, and a `.glw-i18n--<code>`
rule to site.css; with 3+ languages drop the matching
circle-flags SVG (repo: HatScripts/circle-flags, `flags/language/`) into
`src/assets/flags/` — the switcher becomes a flag dropdown automatically.
**Remove i18n** (single-language project): delete `src/pages/en/`,
`src/components/en/`, `src/assets/flags/`, `LanguageSwitcher.astro` and its
usage in both SiteHeaders, the EN imports/branches in BaseLayout, the `i18n`
blocks in astro.config.mjs, `languages`/`pathLang`/`localeHref` in site.ts,
the i18n tests in `tests/smoke.spec.ts`, the `.glw-lang`/`.glw-langmenu`/
`.glw-i18n` styles in site.css, the EN branch (`.glw-i18n--en`) in 404.astro,
and the `data-path-lang` line in BaseLayout's bootstrap script.
**3+ languages at scale:** duplicated branches grow linearly — for projects
with many languages, consider refactoring to central per-language dictionaries
(`src/i18n/<code>.ts`) as a PROJECT decision; the template deliberately stays
with branches to keep copy next to markup.

**Blog (opt-in):** posts are Markdown files in `src/content/blog/` rendered through
`glass-prose glw-prose glw-prose--article` — GlassKit's prose rules underneath, the
article modifier on top (larger headings, primary list markers, hover-only link
underlines, serif pull-quote, bordered code). Only ship it for clients who will actually publish. To REMOVE
the blog: delete `src/content/`, `src/content.config.ts`, `src/pages/blog/`,
`src/pages/rss.xml.ts`, the RSS `<link>` in BaseLayout, the three "Blog" links
(desktop nav + mobile panel in SiteHeader, product column in SiteFooter), the blog
block in `src/pages/llms.txt.ts` (getCollection import + posts section + the
`/blog/` entry in `mainPages[]`), and the blog entries in `tests/smoke.spec.ts`
(blog paths in the `pages` list, the navigation test's blog steps, the RSS and
`## Blog-Artikel` assertions).

## 4. Rules

✅ Always
- Import order in BaseLayout: `@jungherz-de/glasskit/glasskit.css` **before** `../styles/site.css`.
- Keep the bootstrap script as `<script is:inline>` in `<head>` (it must run before first paint).
- Build every page/anchor link with `href()` from `src/data/site.ts`: `href('/#preise')`, `href('/impressum/')` — subpage links with trailing slash. Inside a language branch include the prefix: `href('/en/#pricing')`.
- Use `--gl-*` tokens for every color/radius/shadow; brand re-colors go into `src/styles/brand.css` (token overrides, loads last), never as hex values in glw rules. A tint of the brand is `color-mix(in srgb, var(--gl-color-primary) 22%, transparent)` (the dark stop: `--gl-color-primary-dark`), never a fixed `rgba(245, 166, 35, …)` — that stays orange in every rebranded project and ignores the lighter light-theme primary. Text or icons on a filled primary surface use `var(--gl-color-on-primary, #fff)`, so a project's opt-in to dark AA ink (GlassKit 1.7.0) reaches them. Only imagery that stands in for a photo may keep fixed colours (the `.glw-media` base), and then with its own fixed ink.
- Running text (rendered Markdown, legal pages) sits in a `glass-prose glw-prose` container. Do not restate what `.glass-prose` already styles; add to `.glw-prose` only what the site wants differently.
- When GlassKit ships a component the glw layer already has, build on it the same way: markup carries both classes (`glass-x glw-x`), site.css keeps only the deviations, and the pair goes into `PAIRS` in `scripts/check-markup.mjs` — derived projects take site.css wholesale but never their markup (§7), and the guard tells them where the base class is missing. Adopt only without regression; measure narrow viewports first (§2c names the cases that stay separate and why).
- Stacking: since GlassKit 1.15.1 `.glass-bg` is one isolated stacking context and its children (header, sections, footer) no longer form their own — every `z-index` on the page competes with every other. The header sits at 50 (mobile panel and language menu live inside it). Keep section content below 50, avoid negative `z-index` (it now resolves against `.glass-bg` and its aurora decoration), and give anything that must cover the header (cookie banner, overlay) a deliberate ≥ 100.
- New sections: `glw-` prefix, global CSS in site.css, follow the section skeleton.
- Every page goes through BaseLayout, which brings the skip link and the one `<main>`. Pages start their markup at `<section>`; never wrap content in a second `<main>`, never move header or footer into it.
- Pass per-page `title`, `description` (and optional `ogImage`) via BaseLayout props — canonical, OG/Twitter meta and sitemap come for free.
- Keep decorative UI (`Hero` device panel, `Showcase` window) `aria-hidden` and non-interactive (spans styled as buttons, not real `<button>`).

❌ Never
- No `<style>` blocks inside .astro components (Astro scoping breaks `.only-*`, `.js .reveal`, and JS-toggled classes).
- Never edit GlassKit CSS or copy it into the repo; bump the npm version instead.
- No bare `#anchor` hrefs in header/footer (they break on subpages).
- No external requests (fonts, CDNs, analytics) — the built site is fully self-contained. **Single documented exception:** the contact form's configured endpoint (user-initiated submit only, nothing loads before that; the recipient must be named in the privacy policy).
- Don't remove the no-JS fallbacks (light-theme token block, `:root:not([data-audience])` rule).
- No `id` anchor targets on the fixed header — same-page anchors to `position: fixed` elements don't scroll. `id="top"` lives on the `.glass-bg` wrapper in BaseLayout (once per page, so it also can't duplicate across language branches).

## 4b. Contact Form Providers

Configure in `src/data/site.ts` (`contactForm`). All providers accept the same form POST; the component and site.js need no changes.

| Target | endpoint | hiddenFields | Notes |
|---|---|---|---|
| Demo (default) | `''` | — | UI works, nothing is sent |
| n8n webhook | `https://<n8n-host>/webhook/kontakt` | — | Workflow: Webhook (POST) → IF `botcheck` empty → any target → Respond 200. **This is also the route to Notion**: add a Notion node ("Create Database Page") in the workflow. Never call the Notion API directly from the browser — the secret token would be public and Notion blocks browser CORS |
| Web3Forms | `https://api.web3forms.com/submit` | `{ access_key: '<key>' }` | access_key is designed to be public |
| Formspree | `https://formspree.io/f/<form-id>` | — | Their `_gotcha` honeypot can be added via hiddenFields if desired |

Server-side: always re-check the `botcheck` field (client check alone is bypassable). GDPR: name the recipient/processor in `/datenschutz/`.

## 5. Recipe: New Website From This Template

1. Use repo as template/fork; `npm install`. Delete `site/` (the GlassKit Web
   product page — not part of your site) and remove the landing-assemble step
   in `.github/workflows/deploy.yml` (marked with a `GlassKit-Web only`
   comment). KEEP `SKILL.md` — it stays in the project as the AI maintenance
   reference (catalog, rules, and §7 for future template updates).
2. `astro.config.mjs`: set `base` to `'/<new-repo-name>'` (or remove for custom domain + add `public/CNAME`).
3. `src/data/site.ts`: siteName, defaultTitle, defaultDescription, repoUrl.
4. **Choose the hero — ask the user:** product with a UI → `Hero` (showcase
   panel; then ask: tilted or flat? Tilt is the demo default — remove
   `glw-hero__visual--tilt` + `data-tilt` for flat) · service provider/agency
   without product UI → `HeroEditorial` (swap the import in index.astro).
   Also offer the `Flow` section when the product/service connects systems or
   automates a process (§2b); drop it otherwise.
5. Replace copy per section in `src/components/` (grep for `LUMEN`); adjust the Hero device panel (or the `HeroEditorial` services/stat line) to the product. Nav links live twice in SiteHeader (desktop + mobile panel).
6. Replace `public/og.png` (1200×630 social preview) and `public/favicon.svg`.
7. Choose sections: reorder/remove imports in `src/pages/index.astro`; single-audience sites may drop the switch and all `.only-b2b` blocks. Mirror the choice in `src/pages/en/index.astro` — or remove i18n entirely for single-language projects (steps in §3b).
8. Fill `impressum.astro` / `datenschutz.astro` with real legal content.
9. Verify: `npm test` (guards, then the smoke suite; covers themes × audiences × viewports, no-JS, subpage links, skip link and landmarks) plus a manual look via `npm run build && npm run preview`. If sections/pages were removed, update `tests/smoke.spec.ts` accordingly.
10. Push to `main`; one-time repo setting: Settings → Pages → Source "GitHub Actions".

## 6. Recipe: Convert an Existing Website to This Template

1. Inventory the existing site's content and map each block to a catalog section
   (hero → `Hero` or `HeroEditorial`, feature/benefit lists → `Features`, prices → `Pricing`, testimonials
   → `Quote`, contact → `CtaBanner`, text pages → `glw-page`/`glw-prose`).
2. Migrate copy into the matching components; do NOT port the old site's CSS —
   nor its page frame: `<main>`, skip link and header/footer come from
   BaseLayout, the old site's own wrappers stay behind.
3. For content with no matching section type, build a new `glw-` section following the
   skeleton and rules above — compose from GlassKit components (`glass-card`,
   `glass-list`, `glass-badge`, …) instead of importing foreign styles.
4. Keep the old site's brand colors via `src/styles/brand.css` (token overrides,
   example themes included), not by editing glasskit.css or glw rules.
5. Run the verification from recipe 5, step 9.

## 7. Recipe: Pull Template Updates into a Derived Project

Derived projects (monaoffice.de, monahilft.de, …) are standalone repos —
template and GlassKit changes do NOT flow automatically. **Move both layers in
one pass**, however many releases lie between: the template's site.css is
written against the GlassKit version in the template's `package.json` (it uses
classes and tokens older versions lack), and the guards in `scripts/` check
exactly that pairing. Taking one layer without the other breaks the site
quietly — that is what the guards are for.

1. One-time setup in the project repo:
   `git remote add template https://github.com/JUNGHERZ/GlassKit-Web.git`
2. `git fetch template`, then read the CURRENT template reference before doing
   anything: `git show template/main:SKILL.md` (the project's own SKILL.md copy
   may be outdated — this recipe itself might have changed).
3. **Find the starting point and read what changed.** The last
   `template-sync: <sha>` in `git log` marks the previous sync (none → the
   project predates the recipe; compare with the template history around its
   creation date). Work through `git show template/main:CHANGELOG.md` from that
   point on — release entries name the manual work under **For derived
   projects**. Then skim GlassKit's own CHANGELOG between the project's version
   (`node_modules/@jungherz-de/glasskit/package.json`) and the template's, for
   visible changes only. `git log --oneline <sha>..template/main` and
   `git diff <sha> template/main -- src/styles/site.css src/scripts/site.js`
   remain the detail view.
4. **Take the mechanics files wholesale**, then REVIEW the staged diff and
   revert any project-specific deviations you find (tests may reference removed
   sections, BaseLayout may carry per-project meta):
   `git checkout template/main -- src/styles/site.css src/scripts/site.js scripts/ SKILL.md`
   (add `src/layouts/BaseLayout.astro`, `tests/smoke.spec.ts`,
   `playwright.config.ts` only after diffing them — they drift more often; from
   the BaseLayout diff take at least the skip link and `<main>` of 1.2.1).
   If the project deliberately pins `data-theme` on `<html>`, delete the no-JS
   light mirror block from the new site.css again (§3).
5. **NEVER overwrite:** `src/data/site.ts`, `src/styles/brand.css`,
   `src/components/**` (copy lives there), `public/**`, legal pages. Never
   pull `site/` (GlassKit Web's product page) into a derived project.
6. **Bump GlassKit to the template's version** in the same pass:
   `git show template/main:package.json | grep glasskit`, then
   `npm install @jungherz-de/glasskit@<that version>`.
7. **Wire the guards** if the project predates them — `package.json` scripts:
   `"check": "npm run check:tokens && npm run check:markup"`,
   `"check:tokens": "node scripts/check-light-mirror.mjs"`,
   `"check:markup": "node scripts/check-markup.mjs"`,
   `"test": "npm run check && playwright test"`; in the project's deploy
   workflow a step `run: npm run check` before the smoke tests.
8. **`npm run check` and fix exactly what it prints:**
   - `check:tokens` — paste the printed lines into the light mirror. After
     step 4 it usually passes; it fails where the project had edited its mirror.
   - `check:markup` — add the named GlassKit base class at each printed
     `file:line`. These are the components and pages step 5 protects, so no
     wholesale copy can fix them (first case: `glw-prose` needs `glass-prose`
     since template 1.1.0 — without it every legal page and blog post loses
     line height, spacing and link styling). It also names pages that bring
     their own `<main>` (remove the tag, keep the content) and a layout still
     missing `<main>` or the skip link.
9. **Review what no guard sees:**
   - `z-index` in the project's own CSS (`grep -n "z-index" src/styles/*.css`):
     since GlassKit 1.15.1 all values on a page compete with each other and with
     the header (50) — anything ≥ 50 outside the header, or negative, needs a
     look (§4).
   - `brand.css`: since GlassKit 1.11 `--gl-color-primary-mid`,
     `--gl-border-warm`, `--gl-border-focus`, `--gl-shadow-btn-primary` and
     `--gl-shadow-focus` follow `--gl-color-primary` by themselves — manual
     overrides of these can usually go. Since 1.7.0 badge ink has its own
     tokens (`--gl-color-*-on-surface`).
   - Tests that click the visual part of a GlassKit control
     (`.glass-checkbox__box`, a toggle track, a radio circle): since GlassKit
     1.20 the invisible input lies on top — tick by role instead (§3 testing note).
   - Project rules that patched GlassKit behaviour — they may now counteract
     an upstream fix. Example: badge text colours forced for contrast before
     GlassKit 1.7.0; their light-mode half restores the very ink 1.7.0
     replaced. Remove such workarounds once the upstream fix is in.
10. **New opt-in sections/features** (new files under `src/components/` since
    the last sync): do NOT copy silently. List them with a one-line purpose
    each (from §2's catalog) and **ask the user per feature** whether to adopt
    it — e.g. "The template now ships `Bento` (feature cards with embedded
    mini visualizations), `Flow` (process diagram), `HeroEditorial`
    (typographic hero) — which should this project get?" If adopted: copy the
    component (+ every language branch the project has), replace the LUMEN
    demo copy with project copy, wire it into each branch's index.astro.
11. **Verify:** `npm test`, then `npm run build && npm run preview` and look
    at the spots updates touch: badges and chips, legal pages and blog posts,
    content scrolling under the header, and the page with JavaScript disabled
    under a light OS preference.
12. Commit with the synced template commit and the GlassKit step in the
    message (`template-sync: <short-sha> · GlassKit 1.6.4 → 1.19.1`) — the next
    sync's step 3 uses it as the starting point.
