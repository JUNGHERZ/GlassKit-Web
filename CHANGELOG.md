# Changelog

All notable changes to **GlassKit Web** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
GlassKit Web uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For derived projects this file is the update guide: work through the entries
between your last synced release and the current one (SKILL.md, recipe §7).

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
