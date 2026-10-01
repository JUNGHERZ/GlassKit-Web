# Changelog

All notable changes to **GlassKit Web** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
GlassKit Web uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For derived projects this file is the update guide: work through the entries
between your last synced release and the current one (SKILL.md, recipe §7).

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
