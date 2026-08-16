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
                        bootstrap <script is:inline>, glass-bg wrapper, header/footer.
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
scripts/check-light-mirror.mjs  Drift guard for the no-JS light mirror in site.css
                        (§3): compares it against GlassKit's [data-theme="light"]
                        block and prints the missing lines. `npm run check:tokens`,
                        also the first step of `npm test` and its own CI step.
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
| `Contact` | Contact form (`id="kontakt"` — nav/footer link here) | Endpoint configured in `site.ts` (`contactForm`); empty endpoint = demo mode. Honeypot field `botcheck`, required consent checkbox linking to `/datenschutz/`, B2B-only company field. With JS: fetch + inline `glass-status`; without JS: native POST to the endpoint. A click handler on the submit button shows `data-msg-invalid` when `checkValidity()` fails — a persistent, translatable message alongside the transient native bubble (with GlassKit ≤ 1.6.3 this was mandatory: the 0×0 hidden checkbox input gave the bubble no anchor, silently blocking the submit; fixed upstream in 1.6.4) |
| `CtaBanner` | Closing call-to-action panel | Warm border (`--gl-border-warm`) |
| `SiteFooter` | Link columns, newsletter dummy, legal links | Rendered by BaseLayout |
| `glw-page` + `glw-prose` | Plain text subpage (Impressum/Datenschutz pattern) | See `src/pages/impressum.astro` |

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
`npm test` and in CI, and prints the exact lines to add.

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
  the pair by locale — a new language adds one more branch there.

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
`glw-prose--article`. Only ship it for clients who will actually publish. To REMOVE
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
- Use `--gl-*` tokens for every color/radius/shadow; brand re-colors go into `src/styles/brand.css` (token overrides, loads last), never as hex values in glw rules.
- New sections: `glw-` prefix, global CSS in site.css, follow the section skeleton.
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
9. Verify: `npm test` (smoke suite; covers themes × audiences × viewports, no-JS, subpage links) plus a manual look via `npm run build && npm run preview`. If sections/pages were removed, update `tests/smoke.spec.ts` accordingly.
10. Push to `main`; one-time repo setting: Settings → Pages → Source "GitHub Actions".

## 6. Recipe: Convert an Existing Website to This Template

1. Inventory the existing site's content and map each block to a catalog section
   (hero → `Hero` or `HeroEditorial`, feature/benefit lists → `Features`, prices → `Pricing`, testimonials
   → `Quote`, contact → `CtaBanner`, text pages → `glw-page`/`glw-prose`).
2. Migrate copy into the matching components; do NOT port the old site's CSS.
3. For content with no matching section type, build a new `glw-` section following the
   skeleton and rules above — compose from GlassKit components (`glass-card`,
   `glass-list`, `glass-badge`, …) instead of importing foreign styles.
4. Keep the old site's brand colors via `src/styles/brand.css` (token overrides,
   example themes included), not by editing glasskit.css or glw rules.
5. Run the verification from recipe 5, step 9.

## 7. Recipe: Pull Template Updates into a Derived Project

Derived projects (monaoffice.de, monahilft.de, …) are standalone repos —
template changes do NOT flow automatically. Updates live on two layers:

**GlassKit layer:** bump `@jungherz-de/glasskit` in package.json, then read GlassKit's
own CHANGELOG for visible changes and run `npm run check:tokens` — it names the tokens
the no-JS light mirror in site.css (§3) is missing after the bump. Projects derived
before this guard existed should copy `scripts/check-light-mirror.mjs` and the
`check:tokens` script along with it.

**Template layer** — use the template repo as a second remote:

1. One-time setup in the project repo:
   `git remote add template https://github.com/JUNGHERZ/GlassKit-Web.git`
2. `git fetch template`, then read the CURRENT template reference before doing
   anything: `git show template/main:SKILL.md` (the project's own SKILL.md copy
   may be outdated — this recipe itself might have changed).
3. Review what changed — primary source is the template's
   `git show template/main:CHANGELOG.md`: work through the entries between the
   last synced release and now (the template is versioned since v1.0.0).
   `git log --oneline ..template/main` and
   `git diff HEAD template/main -- src/styles/site.css src/scripts/site.js`
   remain the detail view.
4. **Mechanics files** are designed to stay project-neutral and can be taken
   wholesale — then REVIEW the staged diff and revert any project-specific
   deviations you find (tests may reference removed sections, BaseLayout may
   carry per-project meta):
   `git checkout template/main -- src/styles/site.css src/scripts/site.js SKILL.md`
   (add `src/layouts/BaseLayout.astro`, `tests/smoke.spec.ts`,
   `playwright.config.ts` only after diffing them — they drift more often).
5. **NEVER overwrite:** `src/data/site.ts`, `src/styles/brand.css`,
   `src/components/**` (copy lives there), `public/**`, legal pages. Never
   pull `site/` (GlassKit Web's product page) into a derived project.
6. **New opt-in sections/features** (new files under `src/components/` since
   the last sync): do NOT copy silently. List them with a one-line purpose
   each (from §2's catalog) and **ask the user per feature** whether to adopt
   it — e.g. "The template now ships `Bento` (feature cards with embedded
   mini visualizations), `Flow` (process diagram), `HeroEditorial`
   (typographic hero) — which should this project get?" If adopted: copy the
   component (+ every language branch the project has), replace the LUMEN
   demo copy with project copy, wire it into each branch's index.astro.
7. Verify: `npm test` + `npm run build && npm run preview`; fix fallout.
8. Commit with the synced template commit in the message
   (`template-sync: <short-sha>`) — the next sync's step 3 uses it as the
   starting point.
