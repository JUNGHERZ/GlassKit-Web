<h1 align="center">🧊 GlassKit Web</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.2.0-orange?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/Astro-5-ff5d01?style=flat-square&logo=astro&logoColor=white" alt="Astro 5">
  <img src="https://img.shields.io/badge/sections-20-green?style=flat-square" alt="20 Sections">
  <img src="https://img.shields.io/badge/i18n-DE%20%2F%20EN-7ec8e3?style=flat-square" alt="i18n DE/EN">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square" alt="License">
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/changelog-v1.2.0-f5a623?style=flat-square" alt="Changelog"></a>
  <a href="https://github.com/JUNGHERZ/GlassKit-Web/generate"><img src="https://img.shields.io/badge/template-use_this-44cc11?style=flat-square&logo=github&logoColor=white" alt="Use this template"></a>
</p>

<p align="center">
  <strong>The website template of the <a href="https://glasskit.jungherz.com">GlassKit</a> design language.</strong><br>
  Glassmorphism websites for B2C &amp; B2B from one codebase ·
  Bilingual · SEO · No-JS fallbacks · Smoke-tested
</p>

<p align="center">
  <a href="https://glasskit-web.jungherz.com">🌐 Product page</a> &nbsp;·&nbsp;
  <a href="https://glasskit-web.jungherz.com/demo/">🖥️ Live demo</a> &nbsp;·&nbsp;
  <a href="https://glasskit-web.jungherz.com/docs.html">📖 Documentation</a> &nbsp;·&nbsp;
  <a href="https://github.com/JUNGHERZ/GlassKit">🧊 GlassKit</a> &nbsp;·&nbsp;
  <a href="https://github.com/JUNGHERZ/GlassKit-Elements">🔌 Elements</a>
</p>

<p align="center">
  <strong>🇬🇧 English</strong> · <a href="README.de.md">🇩🇪 Deutsch</a>
</p>

---

## ✨ What is GlassKit Web?

An Astro template in the [GlassKit](https://github.com/JUNGHERZ/GlassKit) design
language: glassmorphism websites that address **B2C and B2B audiences from a
single codebase**. Third member of the GlassKit family — alongside
[GlassKit](https://glasskit.jungherz.com) (the CSS foundation) and
[GlassKit Elements](https://glasskit-elements.jungherz.com) (web components for
app UIs), GlassKit Web is the website layer.

> 🤖 **For AI assistants:** the machine-readable reference (section catalog,
> rules, recipes for new projects and conversions) lives in [SKILL.md](SKILL.md) —
> the ready-made prompt is in the [documentation](https://glasskit-web.jungherz.com/docs.html#ai-prompt).

## 🎭 Demo scenario

Fictional brand **LUMEN** (document scanning & management). All content is
placeholder copy. The audience switch in the hero flips copy, tone, pricing and
testimonials between private and business customers — the same design language,
two voices. The demo is bilingual (German at the root, English under `/en/`) —
see [Multilingual](#-multilingual-opt-in).

## 🚀 Quick start

```bash
npm install
npm run dev        # → http://localhost:4321/demo/
npm run build      # → dist/
npm run preview    # test dist/ locally (incl. the base path used on GitHub Pages)
npm test           # Playwright smoke tests (builds and starts the preview itself)
```

## 📁 Structure

```
astro.config.mjs              site + base (the demo builds to /demo/ next to the product page)
.github/workflows/deploy.yml  build & deploy on every push to main
site/                         product landing page + docs of GlassKit Web itself
                              (static, DE/EN) — NOT part of the template,
                              delete it when deriving a project
src/
├── data/site.ts              site constants + href() helper for base-safe links
├── styles/site.css           web layer (.glw-*): layout, sections — --gl-* tokens only
├── styles/brand.css          client branding: token overrides (with example themes)
├── scripts/site.js           theme toggle, B2C/B2B switch, scroll reveal, 3D tilt
├── layouts/BaseLayout.astro  head, GlassKit import, bootstrap script, header/footer
├── components/               one file per section (copy is edited right there)
│   └── en/                   English language branch of the same sections (opt-in)
├── assets/flags/             language flags (circle-flags, MIT) for the 3+-language switcher
└── pages/                    index + impressum + datenschutz (file routing)
    └── en/                   English pages under /en/
tests/smoke.spec.ts           Playwright smoke tests (run in CI before every deploy)
```

## 📐 Conventions

- **GlassKit comes from npm** (`@jungherz-de/glasskit`) and is **never edited
  locally**. Updating = bumping the version in `package.json`. (Without a build
  step, jsDelivr would work as an alternative:
  `https://cdn.jsdelivr.net/npm/@jungherz-de/glasskit@1/glasskit.min.css` —
  deliberately not used by the template so the site ships without external requests.)
- **Own classes** carry the `.glw-` prefix and use `--gl-*` design tokens
  exclusively — no hard-coded color values.
- **No Astro scoped CSS** (`<style>` inside components): scoping would break the
  global mechanics (`.only-b2c/.only-b2b`, `.js .reveal`, JS-toggled classes).
  All styles live globally in `src/styles/site.css`.
- **Theming:** `data-theme="dark|light"` on `<html>`, set by the bootstrap
  script (OS preference) or the toggle. Without JavaScript a CSS fallback applies.
- **Audiences:** `data-audience="b2c|b2b"` on `<html>`; content via
  `.only-b2c` / `.only-b2b`. Without JavaScript, B2C is shown.
- **Links** are always built via `href()` from `src/data/site.ts`
  (`href('/#preise')`, `href('/impressum/')` with trailing slash) — bare
  `#anchor` links break on subpages.
- **Accessibility:** `prefers-reduced-motion` disables float/tilt/reveal, focus
  rings in the primary color, decorative demo UI is `aria-hidden`.

## 🧱 New project from this template

1. Use the repo as a template / fork it.
2. `astro.config.mjs`: adapt `base` to the new repo name — for a custom domain
   remove `base`, set `site` to the domain and add `public/CNAME`.
3. `src/data/site.ts`: name, title, description, repo URL.
4. Choose the hero: product with a UI → `Hero` (device panel, tilted or flat —
   see "Hero variants"); service provider/agency → `HeroEditorial`
   (swap the import in `index.astro`).
5. Replace the copy per section in `src/components/` (search for "LUMEN") —
   nav links exist twice (desktop nav + mobile menu in the header).
6. Replace `public/og.png` (social preview image, 1200 × 630) and adapt `public/favicon.svg`.
7. Select/deselect or reorder sections in `src/pages/index.astro`.
8. Set brand colors in `src/styles/brand.css` — token overrides following the
   [GlassKit theme-override](https://github.com/JUNGHERZ/GlassKit) pattern,
   commented example themes are included (never touch glasskit.css).
9. Fill impressum/datenschutz (legal pages) with real content.
10. Push to `main` — GitHub Actions builds and deploys automatically
    (one-time: Settings → Pages → Source "GitHub Actions").

**Pulling updates later:** derived projects are standalone repos — template
changes do not flow automatically. Add the template as a second remote and take
the mechanics files selectively; new opt-in sections are chosen consciously per
project instead of being copied silently. Step by step: SKILL.md, recipe §7.

## 🪟 Hero variants & visualizations (opt-in)

Two hero types are available: the **showcase hero** (`Hero.astro`, device panel
built from GlassKit components — for products with a UI) and the **editorial
hero** (`HeroEditorial.astro`, typographic, single-column, no panel — for
service providers and agencies, fastest LCP). The device panel can opt into a
**3D tilt** (`glw-hero__visual--tilt` + `data-tilt` on the visual, active in the
demo): mouse parallax like the spatial showcase, real chip depth via
`translateZ`, disabled with `prefers-reduced-motion`.

The template's principle: **visualizations are built, not screenshotted.**
Product depictions, processes and integration overviews are made from GlassKit
components and SVG — from the media slots in the Bento cards (`Bento.astro`) to
the process diagram (`Flow.astro`, glass nodes over animated connector paths,
entirely without JavaScript). Theme, tokens and rebranding automatically apply
to the diagrams too; patterns and rules are in SKILL.md (§2b).

## 📝 Blog (opt-in)

Articles live as Markdown in `src/content/blog/` (frontmatter: title,
description, pubDate, author) — overview at `/blog/`, RSS at `/rss.xml`, linked
in the header nav and footer. **Only keep it active for projects that will
actually publish**; the removal steps are in SKILL.md.

Page transitions (e.g. home → article) use native **cross-document view
transitions** (`@view-transition`, CSS-only): a smooth transition in supporting
browsers, normal navigation everywhere else, disabled with
`prefers-reduced-motion`.

## 🌍 Multilingual (opt-in)

The default language lives at the root, every additional one under `/<code>/` —
per language its own branch of pages (`src/pages/en/`) and section components
(`src/components/en/`). Copy thus stays right next to its markup, as everywhere
in the template; slugs are identical across languages (keeps the switcher
mapping-free). `hreflang` alternates, `<html lang>`, `og:locale` and the sitemap
links are generated automatically from the `languages` list in `src/data/site.ts`.

The **language switcher** in the header has two faces from the same config:

- **Exactly 2 languages** → segmented pill "DE | EN" (live in the demo).
- **3+ languages** → flag dropdown using [circle-flags](https://github.com/HatScripts/circle-flags)
  (MIT; the language SVGs are vendored in `src/assets/flags/`, additional codes
  are simply copied from the repo's `flags/language/`).

Both variants are pure **links to the equivalent page in the target language** —
no JS toggle, hence SEO-clean and functional without JavaScript. The blog
deliberately appears only in the default language. **Removing** it
(single-language projects) and **adding another language**: steps in
[SKILL.md](SKILL.md), §3b. Projects with many languages (3+) should consider
central language dictionaries instead — that is noted there as well.

## ✉️ Wiring up the contact form

The form (`#kontakt`) is provider-agnostic: configure the target in
`src/data/site.ts` under `contactForm` — an empty `endpoint` = demo mode.

- **n8n webhook** (recommended, your own stack): point `endpoint` at the
  webhook; workflow: Webhook → check `botcheck` → any target → Respond 200.
  Via a Notion node, inquiries land directly in a Notion database, for example.
  (Never call the Notion API directly from the browser: the secret token would
  be public, and Notion blocks browser CORS anyway.)
- **Web3Forms**: `endpoint: 'https://api.web3forms.com/submit'` +
  `hiddenFields: { access_key: '…' }` (the key is designed to be public).
- **Formspree**: `endpoint: 'https://formspree.io/f/<form-id>'`.

Built in: honeypot (`botcheck`, re-check server-side), required consent checkbox
linking to the privacy policy, B2B-only "company" field and a visible message
when required fields are missing (persistent and translatable, complementing the
transient browser bubble). GDPR: the recipient belongs in the privacy policy.
This is the single documented exception to the "no external requests"
convention — nothing loads before submit.

**SEO & AI note:** sitemap (`sitemap-index.xml`), `robots.txt`, `llms.txt`,
canonical and Open Graph meta are generated automatically. The
[llms.txt](https://llmstxt.org/) is a curated Markdown index for AI assistants,
built from `site.ts` + the blog collection — with realistic expectations: the
big AI search crawlers still ignore the file and read the HTML directly; it is
reliably used by AI coding assistants (Claude Code, Cursor & co.) that you hand
the site to. On GitHub Pages *project sites* (`…github.io/<repo>/`),
`robots.txt` and `llms.txt` are not at the domain root and get ignored there —
submit the sitemap via Search Console. With a custom domain everything applies
automatically.

## 🧪 Tests

`npm test` runs the Playwright smoke suite: both themes × both audiences ×
desktop/mobile, navigation from subpages (base prefix), mobile menu, no-JS
fallbacks, 404/RSS/sitemap and console errors. In CI the suite runs as its own
job **before** the deploy — if it fails, nothing goes live. Important for your
own automation: because of the view transitions, headless Chrome strictly needs
`reducedMotion: 'reduce'` (details in [SKILL.md](SKILL.md), §3).

## 🏷️ Versioning & releases

GlassKit Web is versioned since **v1.0.0** ([SemVer](https://semver.org),
format: [Keep a Changelog](https://keepachangelog.com)). Every template change
is documented in [CHANGELOG.md](CHANGELOG.md) — it is the update guide for
derived projects (SKILL.md, recipe §7). Distribution deliberately runs through
GitHub ("Use this template" or
`npm create astro -- --template JUNGHERZ/GlassKit-Web`), not through npm; only
the GlassKit foundation ships as an npm package.

## 📄 License

MIT © Jungherz GmbH
