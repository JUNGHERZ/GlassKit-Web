# Changelog

All notable changes to **GlassKit Web** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
GlassKit Web uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For derived projects this file is the update guide: work through the entries
between your last synced release and the current one (SKILL.md, recipe §7).

---

## [Unreleased]

### Added

- **`scripts/check-light-mirror.mjs` — drift guard for the no-JS light mirror.**
  The mirror block in site.css is the only place where a GlassKit token has to
  be repeated by hand, and nothing verified it: no browser test runs the
  JS-off + OS-light path. The script compares the mirror against GlassKit's
  `[data-theme="light"]` block, fails with the exact lines to add, and runs via
  `npm run check:tokens` — as the first step of `npm test` and as its own CI
  step ahead of the smoke suite.

### Fixed

- **Five mirror values that never matched GlassKit.** The guard's first run
  found `--gl-bg-aurora-3`, `--gl-bg-light-streak-1/2`, `--gl-bg-warm-glow` and
  `--gl-placeholder` carrying hand-estimated values (white streaks instead of
  the teal ones, off-by-one alphas) rather than GlassKit's — present since the
  block was written, visible only with JS off under a light OS preference. Now
  mirrored verbatim; `--gl-icon-on-primary` follows GlassKit's indirection
  (`var(--gl-color-on-primary, #ffffff)`) so a dark-ink opt-in reaches the
  no-JS path too.

### Changed

- **GlassKit `^1.6.4` → `^1.7.0`.** Accessibility release for tinted state
  surfaces: badges now reach WCAG AA in both themes via a scrim behind the tint
  and lightened (dark) / darkened (light) label ink. Visible change in the demo
  and in every derived project — `.glass-badge--primary/--success` labels shift
  (dark `#f5a623` → a pale sand, light `#e8852d` → a warm brown); the primary
  button, checkbox tick and toggle knob are unchanged by design. State colors
  re-branded in `brand.css` now move fill, border, text and glow together, so a
  brand teal no longer leaves a green pill behind. Projects preferring the 1.6.x
  chips add the five-token revert block from GlassKit's CHANGELOG to
  `brand.css`.
- **No-JS light fallback in `src/styles/site.css` completed.** The mirror block
  gained the six tokens whose light value differs from the dark one:
  `--gl-color-primary/success/error-on-surface`, `--gl-state-scrim`,
  `--gl-color-success-dark`, `--gl-color-error-dark` — without them, badges
  rendered with dark-theme ink when the OS is light and JS is off.
  `--gl-toggle-thumb-bg` (a pre-existing gap) was mirrored in the same pass.
  **Derived projects must apply this too**; see SKILL.md §3 and §7.

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
