# Changelog

All notable changes to **GlassKit Web** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
GlassKit Web uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For derived projects this file is the update guide: work through the entries
between your last synced release and the current one (SKILL.md, recipe §7).

---

## [1.4.1] – 2026-10-18

### Changed

- **GlassKit `^1.26.0` → `^1.27.0`.** It adds the droplet — a fluid, iOS-26-style selection for the tab bar and `.glass-segmented` (`--droplet`), driven by the new optional module `glasskit-droplet.js` — and tokens for a capsule behind the active tab. The template uses neither. Computed-style protocol over 8,905 elements on eight page types in dark, light, mobile and no-JS light: 0 differences. The light mirror and its preset rules need nothing new — the droplet's gloss token is the same in both themes and `none` under the surface presets.
- **SKILL.md §2c** names the droplet and how a project loads its module, and records that it does not change why the hero's audience switch stays `.glw-seg`.

### For derived projects

- Bump GlassKit to `^1.27.0` with the next sync and take `SKILL.md`; nothing else changes. The notes of 1.4.0 (and 1.3.0, if still open) apply as written.

### Template state at 1.4.1

Astro 5 · GlassKit ^1.27.0 · everything else as at 1.4.0.

---

## [1.4.0] – 2026-10-18

### Fixed

- **Icons in primary buttons render as icons ([#17](https://github.com/JUNGHERZ/GlassKit-Web/issues/17)).** GlassKit fills icons in `.glass-btn--primary` by design (`fill`, `stroke-width: 0`), and the hero's outline icons lost their strokes: the download arrow became a small triangle, the calendar a solid block, the camera in the device panel a silhouette without its lens. They are filled glyphs now, DE and EN — an arrow over a tray, a calendar with rings and header band, a camera with the lens cut out (`fill-rule="evenodd"`). The editorial hero's speech bubble is a closed shape and was already right. The markup guard gains a third rule: icons in primary buttons must consist of closed shapes, and it names every open line with file and line — against the old hero it reports all four outline icons. Overlapping closed shapes, like the old camera, still need a look.
- **The header CTA hides below 900 px when it is a link ([#18](https://github.com/JUNGHERZ/GlassKit-Web/issues/18)).** `.glw-header__cta { display: none }` (0,1,0) lost to GlassKit's `a.glass-btn { display: inline-flex }` (0,1,1) as soon as a site made its CTA a link: it stayed in the header and pushed the menu button off screen. The rule is `.glass-btn.glw-header__cta` now. The template's own CTA was a `<button>` without any action; it is one link per audience now (B2C → pricing, B2B → contact), in the header and in the menu, so the demo exercises the case. At 390 px the menu button sits at 324–370 px, the issue's figures; the header (DE/EN × dark/light × B2C/B2B) and the open menu render pixel-identical to before. A smoke test checks both widths and fails against the old rule.
- **Accent text follows `--gl-color-primary-text` ([#19](https://github.com/JUNGHERZ/GlassKit-Web/issues/19)).** Eyebrows, links, step numbers, list markers, line icons and the focus ring took `--gl-color-primary` — the button fill, which a brand darkens for white button text. They read `var(--gl-color-primary-text, var(--gl-color-primary))` now (14 rules); fills, tints and glows keep the primary. Gradient text (headline glint, stats, case metrics) runs from `--glw-gradient-text-from` to `--glw-gradient-text-to`, by default primary → primary-dark. With the default palette nothing changes (computed-style protocol: 0 differences). Measured with `#c25028` on the default dark ground, text hidden and the background behind it sampled: eyebrow, step number, quote mark, footer link and consent link at 1.35–3.41:1 and the glint at 2.16 → 1.52:1 without the recipe below, 4.98–12.6:1 and 5.32 → 7.19:1 with it. A smoke test sets the tokens and checks every rule follows them.

### Changed

- **GlassKit `^1.25.0` → `^1.26.0`**, which adds `--gl-color-primary-text` (the primary as text) and `--gl-tab-bar-active-color` (JUNGHERZ/GlassKit#12). Both themes declare the new token as `var(--gl-color-primary)`, so the light mirror needs nothing new and the demo renders identically: 0 differences in 8,982 elements.

### Added

- **A brand.css recipe for a dark primary**: three blocks — lighter accent and gradient text in the dark theme, the primary again in the light theme, and the no-JS block (which also covers printing). The "Ocean Blue" example is down to the two lines GlassKit needs since 1.11, plus the warm background glow, which is not derived. The explanatory notes moved out of the commented CSS: uncommented, a sentence inside a block would have swallowed the declaration after it.
- **The token guard checks brand.css:** every value it sets for `[data-theme="light"]` needs an identical twin in its no-JS block, or the dark value applies without JavaScript. The three Mona projects pass — 4, 14 and 6 light values, all twinned.

### For derived projects

- Take `src/styles/site.css`, `scripts/` and `SKILL.md`, bump GlassKit to `^1.26.0`, run `npm run check`. If the 1.3.0 sync is still open, its notes apply first (one test line per project).
- Header CTAs that are links hide below 900 px with the new site.css — no markup change needed.
- Components are not synced, so check the icons in your own primary buttons: the guard flags open lines (all five pass today). A hero still carrying the template's original icons takes the filled ones from `src/components/Hero.astro`.
- A dark brand primary takes the recipe from the template's brand.css, all three blocks; the guard checks the no-JS twins.

### Template state at 1.4.0

Astro 5 · GlassKit ^1.26.0 · accent text on `--gl-color-primary-text` with gradient-text hooks · filled icons in primary buttons, guarded · header CTAs as links · everything else as at 1.3.0.

---

## [1.3.0] – 2026-10-18

### Changed

- **GlassKit `^1.19.1` → `^1.25.0`.** Six minor releases and four patches, measured as before: a computed-style protocol of 8,982 elements on eight page types in dark, light, mobile and no-JS light, before and after, and full-page screenshots of both builds served side by side. The protocol shows 658 differences, none of them in colour, size, position or spacing: `text-align: left` became `start` (right-to-left support, 1.20.0), inputs end in an ellipsis when their text overflows (1.25.0), list titles may break inside a long word (1.23.0), and the consent checkbox's invisible input now lies on top of its box and takes the click (1.20.0). The screenshots are pixel-identical in all fourteen cases — dark, light, phone, no-JS light and the ticked consent box included. The physical `padding-left` / `border-left` of the article overrides still win over GlassKit's new logical properties (same specificity, site.css loads later).
- **No-JS light mirror** gained `--gl-select-chevron` (1.20.0: the select's arrow is drawn in the muted text colour in the light theme instead of white). The token guard named exactly this one line; of the 17 new theme tokens all others are the same in both themes.
- **The contact-form test ticks the consent box by role.** With the input on top, a click on `.glass-checkbox__box` is intercepted ("intercepts pointer events") and the test timed out after 30 s; `getByRole('checkbox').check()` is what GlassKit intends.
- **The submit button dims while sending.** site.js has always disabled it during the request; since GlassKit 1.21.2 a disabled `.glass-btn` looks disabled (0.45, not-allowed cursor).

### Added

- **Support for GlassKit's surface presets in the no-JS path.** `data-surface="solid"` (1.24.0) and `"tint"` (1.25.0) on `<html>` work with JavaScript out of the box — measured on the demo with the attribute in the served HTML: in dark and light, under both presets, not one element still blurs, and surfaces and shine follow the preset. Without JavaScript there is no `data-theme`, so the light mirror's glass surfaces outranked the preset (specificity 0,2,0 against 0,1,0) and brought translucent white plates and the inner shine back. The mirror now carries GlassKit's light preset blocks as two more rules, `:root[data-surface="solid" | "tint"]:not([data-theme])` — dormant without the attribute. The token guard compares them with GlassKit token by token and prints a missing rule ready to paste. Two smoke tests pin each preset into the served HTML with JavaScript off and check the surface token.
- **Printing in the light theme.** Printed in the dark theme, the privacy page came out as light grey text on white paper, with the skip link at the bottom of the page. site.js now switches to the light theme on `beforeprint` and back on `afterprint` — the recipe from GlassKit 1.21.1 — and the light mirror's media query is `(prefers-color-scheme: light), print`, so a page printed without JavaScript is light too. The skip link is hidden in print (two classes: GlassKit's `a.glass-btn { display: inline-flex }` outranks one). Checked by PDF: the privacy page prints dark on white with the skip link gone; Chromium fires both events for its own PDF export. Two smoke tests cover the theme switch, the hidden skip link and the no-JS print.
- **SKILL.md:** GlassKit presets and printing in §3, ticking GlassKit controls by role in the testing note, `.glass-input-wrap` in §2c, right-to-left in §3b (GlassKit mirrors itself since 1.20, the glw layer still has about two dozen physical left/right values), and the disabled submit button in the `Contact` row.

### For derived projects

All five were synced to 1.2.1 with GlassKit 1.19.1 on 2026-10-01 and carry the guards, so this is a regular sync per SKILL.md §7:

- Take `src/styles/site.css`, `src/scripts/site.js`, `scripts/` and `SKILL.md`; bump GlassKit to `^1.25.0`; `npm run check` should pass right away.
- **Change one line in the smoke suite:** all five click `#kontakt .glass-checkbox__box` in the contact-form test (jungherz-com line 178, monacore-eu 152, monahilft-de 179, monaoffice-de 154, wimmer-service-nrw 130). With GlassKit ≥ 1.20 that click is intercepted and the test times out; tick the box with `page.locator('#kontakt').getByRole('checkbox').check()`.
- Print one legal page with Ctrl+P after the sync. Dark-only projects (jungherz-com and wimmer-service-nrw pin `data-theme="dark"`) print in the light theme as well — intended, paper is white.

### Template state at 1.3.0

Astro 5 · GlassKit ^1.25.0 · surface presets supported with and without JavaScript · light-theme printing · everything else as at 1.2.1.

---

## [1.2.1] – 2026-10-01

### Added

- **Skip link and a `<main>` landmark on every page.** Measured on the live demo before: ten tab stops in the header (logo, five nav links, DE, EN, theme, CTA) before the first piece of content on every page, five on a phone, and no `<main>` at all — screen-reader users had no "main content" landmark to jump to, keyboard users no way past the header (WCAG 2.4.1, level A). BaseLayout now wraps every page in `<main id="main" tabindex="-1">` and puts a skip link in front of the header: the first tab stop, visible only with keyboard focus, and one Enter later the focus is in the content. It is the secondary button on an opaque plate — 5.0:1 (dark) and 11.7:1 (light) at the plate's darkest point; the primary's white on orange would miss AA. On the bilingual 404 it follows the language branch, like header and footer. Three smoke tests cover the keyboard path, both languages including the 404, and exactly one `<main>` on every page with header and footer outside it.
- **Markup guard checks landmarks.** `npm run check:markup` now also fails when the layout lacks `<main>` or the skip link, and names every page or component that brings its own `<main>` — after a sync that would be a second, nested one.

### For derived projects

- In the BaseLayout diff (SKILL.md §7 step 4), take the `skipLabels` lines, the skip-link block and `<main id="main" tabindex="-1">` around `<slot />`; keep the project's own meta. The CSS (`.glw-skip`, `#main:focus`) arrives with site.css.
- `npm run check` names what is left. monahilft wraps seven pages in its own `<main>` (home, podcast, the `[slug]` pages and the 404, each DE and EN) — remove those tags, the content stays. The other four have none.
- A project with a third language adds its label to `skipLabels`.

### Template state at 1.2.1

Astro 5 · GlassKit ^1.19.1 · skip link and one `<main>` landmark on every page, guarded · everything else as at 1.2.0.

---

## [1.2.0] – 2026-10-01

### Changed

- **GlassKit `^1.14.0` → `^1.19.1`.** Five minor releases and two patches, measured like 1.1.0: a computed-style protocol of every element on eight page types (home, legal pages, blog, article, EN, 404) in dark, light and no-JS light, 8,795 elements before and after the bump. No colour, size or spacing changed anywhere. The only computed differences are 1.15.1's stacking change: `.glass-bg` becomes one isolated stacking context, its aurora decorations move to `z-index: -1`, and its children — header, sections, footer — stop being stacking contexts of their own. Pixel comparison against the old stacking rules: identical on every page and at six scroll positions under the fixed header, apart from compositing noise (≤ 6/255 per channel), and one real improvement on the 404 page — the aurora `::after` used to sit *above* the footer there, because the footer's `display: contents` language wrapper never got the old `z-index: 1`; it no longer washes out the footer text (up to 14/255). The CSS of all five derived projects was checked for the same risk: no `z-index` ≥ 50 outside the header and none negative, so the change is safe there as well.
  New in GlassKit and not used by the template yet: segmented control, steps, bottom sheet and empty state (1.15.0), date strip, calendar and image picker (1.16.0), `--scroll`/`--wrap` for the segmented control and an iOS fix for date fields (1.17.0), a warning tone for badges with its tokens (1.18.0), toast action and close button plus `--gl-toast-top` (1.19.0); `.glass-btn[hidden]` now really hides (1.16.0). SKILL.md §2c maps them to website use — and names where the glw layer stays separate on purpose.
- **No-JS light mirror** gained `--gl-color-warning-on-surface` (1.18.0; its light value mixes with black, the dark one with white). The token guard reported exactly this one line.
- **`npm test` runs both guards** (`npm run check`) before the smoke suite, and the CI step runs `npm run check`.
- **SKILL.md §7 rewritten for large jumps.** Template and GlassKit now move in one pass, because the template's site.css is written against a GlassKit version and the guards check that pairing. Added: the GlassKit bump, wiring the guards in older projects, fixing exactly what `npm run check` prints, and a review list for what no guard sees (`z-index` since 1.15.1, `brand.css` overrides GlassKit now derives itself, project patches that may counteract upstream fixes).

### Added

- **`scripts/check-markup.mjs` — markup guard (`npm run check:markup`).** Since 1.1.0, site.css relies on markup: `.glw-prose` only overrides `.glass-prose`. A sync takes site.css wholesale but never the components and legal pages that carry the classes, so a derived project silently lost its running-text styling — measured on the template with the class removed: paragraphs from 24 px to `line-height: normal`, margins and font size to browser defaults. The guard lists every `file:line` where an override class lacks its GlassKit base, and flags a GlassKit too old to have the base at all. Run against the five derived projects (read-only): it names all of their legal pages.
- **SKILL.md §2c — GlassKit building blocks vs. the glw layer**, and two rules in §4: how the glw layer builds on a GlassKit component (both classes in the markup, deviations only in site.css, the pair registered in the markup guard), and the stacking order since GlassKit 1.15.1.

### Fixed

- **The demo's brand tints follow the brand.** Five rules held the default orange as fixed `rgba()` values — `::selection`, the feature icon plate, the active pill in the Showcase window, the warm glow in the media slot and the process step numbers — so they stayed orange in every rebranded project and showed the dark-theme orange in light mode as well. They now mix from `--gl-color-primary` and `--gl-color-primary-dark` at the same strengths. Measured against the old values: dark mode pixel-identical; light mode follows the lighter light primary (≤ 8/255 on the plates, 17/255 in the media glow), as GlassKit 1.7.0 decided for its own primary chip; with the "Ocean Blue" example from `brand.css` exactly these spots turn blue and nothing else on the page changes. Three derived projects had run into this on their own: monahilft and monaoffice had replaced the literals locally with the very same expressions, wimmer-service had put its red in as a new literal, and monacore had fixed only `::selection` — its pink site still shows four orange tints. Text and icons on filled primary surfaces (initials avatar, Flow core) now use `--gl-color-on-primary`, so a project's opt-in to dark AA ink reaches them; the fixed teal avatar keeps its own white. SKILL.md §4 names both patterns.
- **Token guard works on every derived project.** It crashed on a project without a light mirror (wimmer-service pins `data-theme="dark"` on `<html>` by brand decision) and found the mirror only by luck where a project has several `prefers-color-scheme: light` blocks (monahilft, monaoffice). It now looks for the exact `:root:not([data-theme])` rule in any of them, passes a project with a pinned `data-theme`, prints ready-to-paste replacement lines for outdated values, and names an outdated GlassKit when the mirror holds tokens the installed version lacks.

### Not adopted, on purpose

- **`.glass-segmented` for the hero's audience switch.** Same semantics as `.glw-seg` (`role="group"`, `aria-pressed`), but it keeps labels on one line: at 320 and 360 px the second option ("Für Unternehmen") would end at 362 px — past the pill and, at 320 px, past the viewport — where `.glw-seg` wraps the label inside the pill today. The language pill `.glw-lang` consists of links with `aria-current`, which `.glass-segmented` does not style. Both stay in the glw layer until GlassKit covers these cases.

### For derived projects

All five are on GlassKit 1.6.4 with a template state from before 1.0.0, so this is the large jump SKILL.md §7 is now written for — in one pass:

- Take `src/styles/site.css`, `src/scripts/site.js`, `scripts/` and `SKILL.md` from the template, bump GlassKit to `^1.19.1`, wire `npm run check` (§7 step 7).
- Fix what `npm run check` prints: the light mirror lines, and `glass-prose` next to every `glw-prose` (from 1.1.0 — every legal page).
- The brand-tint fix arrives with site.css: no difference for monahilft and monaoffice (their local fix is identical), four orange tints disappear from monacore's pink site, and wimmer-service's red `::selection` literal becomes the same colour through the token.
- Review per §7 step 9. Visible from GlassKit 1.7.0 on: the badge ink (see 1.1.0). monahilft and monaoffice carry local contrast workarounds for badges from before 1.7.0 (`.glw-chip`; in monaoffice also the Bento and Flow badges): white text in dark, the raw state colour in light and no-JS light. 1.7.0 solves the same problem with its own ink tokens, and the light half of the workaround puts back exactly the ink 1.7.0 replaced (2.0–2.5:1) — remove the whole block after the bump.

### Template state at 1.2.0

Astro 5 · GlassKit ^1.19.1 · 20 catalog sections · running text on GlassKit's `.glass-prose` · `npm run check` guards the no-JS light mirror and the markup base classes · everything else as at 1.1.0.

---

## [1.1.0] – 2026-09-20

### Added

- **`scripts/check-light-mirror.mjs` — drift guard for the no-JS light mirror.** The mirror block in site.css is the only place where a GlassKit token has to be repeated by hand, and nothing verified it: no browser test runs the JS-off + OS-light path. The script compares the mirror against GlassKit's `[data-theme="light"]` block, fails with the exact lines to add, and runs via `npm run check:tokens` — as the first step of `npm test` and as its own CI step ahead of the smoke suite.

### Changed

- **GlassKit `^1.6.4` → `^1.14.0`.** Eight minor releases, taken in two steps and measured on the built site, dark and light, before and after each. From **1.7.0**: badges reach WCAG AA in both themes via a scrim behind the tint and lightened (dark) / darkened (light) label ink — a visible change in the demo and in every derived project (`.glass-badge--primary/--success` labels shift, dark `#f5a623` → a pale sand, light `#e8852d` → a warm brown; primary button, checkbox tick and toggle knob unchanged by design), and state colours re-branded in `brand.css` now move fill, border, text and glow together. Projects preferring the 1.6.x chips add the five-token revert block from GlassKit's CHANGELOG to `brand.css`. From **1.7.1 to 1.14.0**: the only measured differences are the 1.11.0 tokens now mixed from `--gl-color-primary` instead of holding fixed amber (`--gl-color-primary-mid`, `--gl-border-warm`, `--gl-border-focus`, `--gl-shadow-btn-primary`, `--gl-shadow-focus`) — within rounding of the old values with the default palette, and finally brand-aware with a custom one. Along the way: `color-scheme` is declared (1.7.1), so browser-drawn controls follow the theme; checkbox, radio and toggle align on the first line of a multi-line label (1.11.0), which is exactly the consent checkbox in the contact form on a phone; badges can be chips (1.12.0); `.glass-skeleton`, `.glass-table` and `.glass-prose` exist (1.14.0).

- **`.glw-prose` builds on GlassKit's `.glass-prose`.** The text pages and the blog article carry `glass-prose glw-prose` now; GlassKit styles headings, paragraphs, lists, links, code, quotes, images and tables, and site.css keeps only what the website wants differently — column width, the compact heading, muted paragraphs, and for articles the larger headings, primary list markers, hover-only link underlines, the serif pull-quote without a surface, and bordered code. The old `display: grid; gap: 14px` rhythm is replaced by GlassKit's margins, with one em-based rule keeping the site's air under headings. Net effect on the rendered pages, measured: heading spacing within a pixel of before (13.8 px under a heading for 14, 25.8 px above for 26), line-height 1.65 → 1.6, and article paragraphs now render at their intended 15.5 px — the old base rule `.glw-prose p { font-size: 15px }` sat later in the file and had been overriding the article rule all along. Running text gains `pre`, `img`, `hr` and table styling it never had.

- **No-JS light mirror completed and kept in step with GlassKit.** The block in `src/styles/site.css` gained the tokens whose light value differs from the dark one and which it had been missing — `--gl-color-primary/success/error-on-surface`, `--gl-state-scrim`, `--gl-color-success-dark`, `--gl-color-error-dark` and the pre-existing gap `--gl-toggle-thumb-bg`; without them badges rendered with dark-theme ink when the OS is light and JS is off. For the five 1.11.0 tokens it now holds the same `color-mix()` expressions as GlassKit, so a brand colour reaches glow and focus ring in that path too. **Derived projects must apply this as well**; the guard above tells them exactly what is missing (SKILL.md §3 and §7).

### Fixed

- **Five mirror values that never matched GlassKit.** The guard's first run found `--gl-bg-aurora-3`, `--gl-bg-light-streak-1/2`, `--gl-bg-warm-glow` and `--gl-placeholder` carrying hand-estimated values (white streaks instead of the teal ones, off-by-one alphas) rather than GlassKit's — present since the block was written, visible only with JS off under a light OS preference. Now mirrored verbatim; `--gl-icon-on-primary` follows GlassKit's indirection (`var(--gl-color-on-primary, #ffffff)`) so a dark-ink opt-in reaches the no-JS path too.

### For derived projects

*Added after the release — the original entry did not name the markup step.*

- **Add `glass-prose` next to every `glw-prose`** (legal pages, blog article layout). `.glw-prose` in site.css now only overrides GlassKit's running text; without the base class, paragraphs fall back to `line-height: normal`, font size and margins to browser defaults, and links lose their styling. These files are never overwritten by a sync, so `npm run check:markup` (since 1.2.0) lists every spot.
- **Wire the token guard** (`scripts/check-light-mirror.mjs`, `check:tokens`) and paste the lines it prints into the light mirror.
- **Expect the badge change from GlassKit 1.7.0** (paler ink in dark, darker in light); keep it, or restore the 1.6.x chips with GlassKit's revert block in `brand.css`.

### Template state at 1.1.0

Astro 5 · GlassKit ^1.14.0 · 20 catalog sections · running text on GlassKit's `.glass-prose` with `.glw-prose` as the site's override layer · no-JS light mirror guarded by `npm run check:tokens` · everything else as at 1.0.0.

---

## [1.0.0] – 2026-07-19

First versioned release — GlassKit Web becomes the official website layer of the
GlassKit family, proven in five production sites (monaoffice.de, monahilft.de,
monacore.eu, wimmer-service.nrw, jungherz.com).

### Added

- **Product landing page + docs** (`site/`, static DE/EN) deployed at
  https://glasskit-web.jungherz.com — the LUMEN demo now builds to `/demo/`
  next to it (one repo, one Pages deployment, two builds). `site/` is not part
  of the template and is deleted when deriving a project.
- **CHANGELOG.md** (this file) as the versioned update guide for derived
  projects; referenced from SKILL.md recipe §7.

### Changed

- Repository renamed **GlassKit-Web-Template → GlassKit-Web**; custom domain
  `glasskit-web.jungherz.com` replaces the github.io project page. In
  `astro.config.mjs` the demo now uses `site: 'https://glasskit-web.jungherz.com'`
  and `base: '/demo/'`; all derived URLs (canonical, hreflang, sitemap,
  robots.txt, llms.txt, test baseURL) follow automatically.
- `deploy.yml` builds twice (static `site/` at the root, Astro demo at
  `/demo/`) and uploads one merged Pages artifact. Derived projects remove the
  assemble step (marked `GlassKit-Web only`).

### Template state at 1.0.0

Astro 5 · GlassKit ^1.6.4 · 20 catalog sections (incl. `Hero`/`HeroEditorial`,
`Bento`, `Flow`, `Showcase`) · B2C/B2B audience switch · dark/light theming ·
opt-in blog with RSS · opt-in i18n via language branches (DE root, EN under
`/en/`) · provider-agnostic contact form · SEO (canonical, hreflang, sitemap,
robots.txt, llms.txt, JSON-LD) · no-JS fallbacks throughout · Playwright smoke
suite as deploy gate.
