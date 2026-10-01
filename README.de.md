<h1 align="center">🧊 GlassKit Web</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.2.1-orange?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/Astro-5-ff5d01?style=flat-square&logo=astro&logoColor=white" alt="Astro 5">
  <img src="https://img.shields.io/badge/sections-20-green?style=flat-square" alt="20 Sections">
  <img src="https://img.shields.io/badge/i18n-DE%20%2F%20EN-7ec8e3?style=flat-square" alt="i18n DE/EN">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square" alt="License">
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/changelog-v1.2.1-f5a623?style=flat-square" alt="Changelog"></a>
  <a href="https://github.com/JUNGHERZ/GlassKit-Web/generate"><img src="https://img.shields.io/badge/template-use_this-44cc11?style=flat-square&logo=github&logoColor=white" alt="Use this template"></a>
</p>

<p align="center">
  <strong>Das Website-Template der <a href="https://glasskit.jungherz.com">GlassKit</a>-Designsprache.</strong><br>
  Glassmorphism-Websites für B2C &amp; B2B aus einer Codebasis ·
  Zweisprachig · SEO · No-JS-Fallbacks · Smoke-getestet
</p>

<p align="center">
  <a href="https://glasskit-web.jungherz.com">🌐 Produktseite</a> &nbsp;·&nbsp;
  <a href="https://glasskit-web.jungherz.com/demo/">🖥️ Live-Demo</a> &nbsp;·&nbsp;
  <a href="https://glasskit-web.jungherz.com/docs.html">📖 Dokumentation</a> &nbsp;·&nbsp;
  <a href="https://github.com/JUNGHERZ/GlassKit">🧊 GlassKit</a> &nbsp;·&nbsp;
  <a href="https://github.com/JUNGHERZ/GlassKit-Elements">🔌 Elements</a>
</p>

<p align="center">
  <a href="README.md">🇬🇧 English</a> · <strong>🇩🇪 Deutsch</strong>
</p>

---

## ✨ Was ist GlassKit Web?

Astro-Template in der [GlassKit](https://github.com/JUNGHERZ/GlassKit)-Designsprache:
Glassmorphism-Websites, die mit **einer Codebasis B2C- und B2B-Zielgruppen** ansprechen.
Drittes Mitglied der GlassKit-Familie — neben [GlassKit](https://glasskit.jungherz.com)
(CSS-Fundament) und [GlassKit Elements](https://glasskit-elements.jungherz.com)
(Web Components für App-UIs) ist GlassKit Web die Website-Schicht.

> 🤖 **Für KI-Assistenten:** Die maschinenlesbare Referenz (Sektions-Katalog, Regeln,
> Rezepte für neue Projekte und Umstellungen) liegt in [SKILL.md](SKILL.md) — der
> fertige Prompt steht in der [Dokumentation](https://glasskit-web.jungherz.com/docs.html#ai-prompt).

## 🎭 Demo-Szenario

Fiktive Marke **LUMEN** (Dokumenten-Scan & -Management). Alle Inhalte sind Platzhalter.
Der Zielgruppen-Umschalter im Hero wechselt Copy, Tonalität (Du/Sie), Preise und
Testimonials zwischen Privat- und Geschäftskunden — dieselbe Designsprache, zwei Ansprachen.
Die Demo ist zweisprachig (Deutsch an der Wurzel, Englisch unter `/en/`) —
siehe [Mehrsprachigkeit](#-mehrsprachigkeit-opt-in).

## 🚀 Schnellstart

```bash
npm install
npm run dev        # → http://localhost:4321/demo/
npm run build      # → dist/
npm run preview    # dist/ lokal testen (inkl. base-Pfad wie auf GitHub Pages)
npm test           # Playwright-Smoke-Tests (baut selbst und startet den Preview)
```

## 📁 Struktur

```
astro.config.mjs              site + base (Demo baut nach /demo/ neben die Produktseite)
.github/workflows/deploy.yml  Build & Deploy bei jedem Push auf main
site/                         Produkt-Landing-Page + Doku von GlassKit Web selbst
                              (statisch, DE/EN) — NICHT Teil des Templates,
                              beim Ableiten eines Projekts löschen
src/
├── data/site.ts              Site-Konstanten + href()-Helper für base-sichere Links
├── styles/site.css           Web-Layer (.glw-*): Layout, Sektionen — nur --gl-*-Tokens
├── styles/brand.css          Kunden-Branding: Token-Overrides (mit Beispiel-Themes)
├── scripts/site.js           Theme-Toggle, B2C/B2B-Umschalter, Scroll-Reveal, 3D-Tilt
├── layouts/BaseLayout.astro  Head, GlassKit-Import, Bootstrap-Script, Header/Footer
├── components/               Eine Datei pro Sektion (Copy wird direkt dort editiert)
│   └── en/                   Englischer Sprachzweig derselben Sektionen (Opt-in)
├── assets/flags/             Sprachflaggen (circle-flags, MIT) für den Umschalter ab 3 Sprachen
└── pages/                    index + impressum + datenschutz (File-Routing)
    └── en/                   Englische Seiten unter /en/
tests/smoke.spec.ts           Playwright-Smoke-Tests (laufen im CI vor jedem Deploy)
```

## 📐 Konventionen

- **GlassKit kommt aus npm** (`@jungherz-de/glasskit`) und wird **nie lokal editiert**.
  Update = Version in `package.json` anheben. (Ohne Build-Step ginge alternativ jsDelivr:
  `https://cdn.jsdelivr.net/npm/@jungherz-de/glasskit@1/glasskit.min.css` — vom Template
  bewusst nicht genutzt, damit die Seite ohne externe Requests auskommt.)
- **Eigene Klassen** tragen das Präfix `.glw-` und verwenden ausschließlich
  `--gl-*`-Design-Tokens — keine hartkodierten Farbwerte.
- **Kein Astro-Scoped-CSS** (`<style>` in Komponenten): Das Scoping würde die globalen
  Mechaniken (`.only-b2c/.only-b2b`, `.js .reveal`, JS-getoggelte Klassen) brechen.
  Alle Styles leben global in `src/styles/site.css`.
- **Theming:** `data-theme="dark|light"` auf `<html>`, gesetzt vom Bootstrap-Script
  (OS-Präferenz) bzw. Toggle. Ohne JavaScript greift ein CSS-Fallback.
- **Zielgruppen:** `data-audience="b2c|b2b"` auf `<html>`; Inhalte über
  `.only-b2c` / `.only-b2b`. Ohne JavaScript gilt B2C.
- **Links** immer über `href()` aus `src/data/site.ts` bauen (`href('/#preise')`,
  `href('/impressum/')` mit Trailing Slash) — nackte `#anker` brechen auf Unterseiten.
- **Barrierefreiheit:** `prefers-reduced-motion` deaktiviert Float/Tilt/Reveal,
  Fokus-Ringe in Primary-Farbe, dekorative Demo-UI ist `aria-hidden`.

## 🧱 Neues Projekt aus dem Template

1. Repo als Vorlage verwenden / forken.
2. `astro.config.mjs`: `base` an den neuen Repo-Namen anpassen — bei Custom Domain
   `base` entfernen, `site` auf die Domain setzen und `public/CNAME` anlegen.
3. `src/data/site.ts`: Name, Title, Description, Repo-URL.
4. Hero wählen: Produkt mit UI → `Hero` (Device-Panel, wahlweise geneigt oder
   flach — siehe „Hero-Varianten"); Dienstleister/Agentur → `HeroEditorial`
   (Import in `index.astro` tauschen).
5. Copy pro Sektion in `src/components/` tauschen (nach „LUMEN" suchen) —
   die Nav-Links existieren zweimal (Desktop-Nav + Mobile-Menü im Header).
6. `public/og.png` ersetzen (Social-Vorschaubild, 1200 × 630) und `public/favicon.svg` anpassen.
7. Sektionen in `src/pages/index.astro` an-/abwählen oder umsortieren.
8. Branding-Farben in `src/styles/brand.css` setzen — Token-Overrides nach dem
   Muster von [GlassKit theme-override](https://github.com/JUNGHERZ/GlassKit),
   Beispiel-Themes liegen auskommentiert bei (nie glasskit.css anfassen).
9. Impressum/Datenschutz mit echten Angaben füllen.
10. Push auf `main` — GitHub Actions baut und deployed automatisch
    (einmalig: Settings → Pages → Source „GitHub Actions").

**Updates später einspielen:** Abgeleitete Projekte sind eigenständige Repos —
Template-Änderungen fließen nicht automatisch. Das Template als zweites Remote
anlegen und Mechanik-Dateien gezielt übernehmen; neue Opt-in-Sektionen werden
dabei pro Projekt bewusst gewählt statt still kopiert. Schritt-für-Schritt:
SKILL.md, Recipe §7.

## 🪟 Hero-Varianten & Visualisierungen (Opt-in)

Zwei Hero-Typen stehen zur Wahl: das **Showcase-Hero** (`Hero.astro`, Device-Panel
aus GlassKit-Komponenten — für Produkte mit UI) und das **Editorial-Hero**
(`HeroEditorial.astro`, typografisch, einspaltig, ohne Panel — für Dienstleister
und Agenturen, schnellster LCP). Das Device-Panel kann per Opt-in **3D-geneigt**
werden (`glw-hero__visual--tilt` + `data-tilt` auf dem Visual, im Demo aktiv):
Maus-Parallax wie im Spatial-Showcase, echte Tiefe der Chips via `translateZ`,
stillgelegt bei `prefers-reduced-motion`.

Grundsatz des Templates: **Visualisierungen werden gebaut, nicht gescreenshottet.**
Produktdarstellungen, Prozesse und Integrations-Übersichten entstehen aus
GlassKit-Komponenten und SVG — vom Media-Slot in den Bento-Karten (`Bento.astro`)
bis zum Prozess-Diagramm (`Flow.astro`, Glas-Nodes über animierten
Verbindungspfaden, ganz ohne JavaScript). So greifen Theme, Tokens und Rebranding
automatisch auch in den Schaubildern; Muster und Regeln stehen in der SKILL.md (§2b).

## 📝 Blog (Opt-in)

Artikel liegen als Markdown in `src/content/blog/` (Frontmatter: title,
description, pubDate, author) — Übersicht unter `/blog/`, RSS unter `/rss.xml`,
Verlinkung in Header-Nav und Footer. **Nur für Projekte aktiv lassen, die
redaktionell liefern**; die Entfernungs-Schritte stehen in der SKILL.md.

Seitenwechsel (z. B. Startseite → Artikel) nutzen native **Cross-Document View
Transitions** (`@view-transition`, CSS-only): sanfter Übergang in unterstützenden
Browsern, normale Navigation überall sonst, deaktiviert bei `prefers-reduced-motion`.

## 🌍 Mehrsprachigkeit (Opt-in)

Die Default-Sprache liegt an der Wurzel, jede weitere unter `/<code>/` — pro Sprache
ein eigener Zweig aus Seiten (`src/pages/en/`) und Sektions-Komponenten
(`src/components/en/`). Die Copy bleibt damit wie überall im Template direkt bei
ihrem Markup; Slugs sind in allen Sprachen gleich (hält den Umschalter mapping-frei).
`hreflang`-Alternates, `<html lang>`, `og:locale` und die Sitemap-Verknüpfung
entstehen automatisch aus der `languages`-Liste in `src/data/site.ts`.

Der **Sprach-Umschalter** im Header hat zwei Gesichter aus derselben Config:

- **Genau 2 Sprachen** → Segmented-Pill „DE | EN" (so live in der Demo).
- **3+ Sprachen** → Flaggen-Dropdown mit [circle-flags](https://github.com/HatScripts/circle-flags)
  (MIT; die Sprach-SVGs liegen vendored in `src/assets/flags/`, weitere Codes einfach
  aus `flags/language/` des Repos dazukopieren).

Beide Varianten sind reine **Links auf die äquivalente Seite der Zielsprache** —
kein JS-Toggle, daher SEO-sauber und ohne JavaScript funktionsfähig. Der Blog
erscheint bewusst nur in der Default-Sprache. **Entfernen** (einsprachige Projekte)
und **weitere Sprache ergänzen**: Schritte in der [SKILL.md](SKILL.md), §3b.
Projekte mit vielen Sprachen (3+) sollten stattdessen zentrale Sprachdateien
erwägen — auch das ist dort notiert.

## ✉️ Kontaktformular anschließen

Das Formular (`#kontakt`) ist provider-agnostisch: Ziel in `src/data/site.ts`
unter `contactForm` konfigurieren — leerer `endpoint` = Demo-Modus.

- **n8n-Webhook** (empfohlen, eigener Stack): `endpoint` auf den Webhook setzen;
  Workflow: Webhook → `botcheck` prüfen → Ziel nach Wahl → Respond 200.
  Über einen Notion-Node landen Anfragen z. B. direkt in einer Notion-Datenbank.
  (Die Notion-API nie direkt aus dem Browser aufrufen: Der Secret-Token wäre
  öffentlich, und Notion blockt Browser-CORS ohnehin.)
- **Web3Forms**: `endpoint: 'https://api.web3forms.com/submit'` +
  `hiddenFields: { access_key: '…' }` (der Key ist als öffentlich konzipiert).
- **Formspree**: `endpoint: 'https://formspree.io/f/<form-id>'`.

Eingebaut: Honeypot (`botcheck`, serverseitig erneut prüfen), Pflicht-Checkbox
mit Link auf die Datenschutzerklärung, B2B-Zusatzfeld „Unternehmen" und ein
sichtbarer Hinweis bei fehlenden Pflichtfeldern (dauerhaft und übersetzbar,
ergänzend zur flüchtigen Browser-Meldung). DSGVO:
Der Empfänger gehört in die Datenschutzerklärung. Dies ist die einzige
dokumentierte Ausnahme von der „keine externen Requests"-Konvention —
es lädt nichts vor dem Absenden.

**SEO- & KI-Hinweis:** Sitemap (`sitemap-index.xml`), `robots.txt`, `llms.txt`,
Canonical- und Open-Graph-Meta werden automatisch generiert. Die
[llms.txt](https://llmstxt.org/) ist ein kuratierter Markdown-Index für
KI-Assistenten, erzeugt aus `site.ts` + Blog-Collection — mit realistischer
Erwartung: Die großen AI-Suchcrawler ignorieren die Datei bislang und lesen das
HTML direkt; zuverlässig genutzt wird sie von KI-Coding-Assistenten (Claude
Code, Cursor & Co.), denen man die Site gibt. Auf GitHub-Pages-*Projektseiten*
(`…github.io/<repo>/`) liegen `robots.txt` und `llms.txt` nicht am Domain-Root
und werden dort ignoriert — die Sitemap per Search Console einreichen. Mit
Custom Domain greift alles automatisch.

## 🧪 Tests

`npm test` fährt die Playwright-Smoke-Suite: beide Themes × beide Zielgruppen ×
Desktop/Mobile, Navigation von Unterseiten (base-Präfix), Mobile-Menü, No-JS-Fallbacks,
404/RSS/Sitemap und Konsolenfehler. Im CI läuft die Suite als eigener Job **vor** dem
Deploy — schlägt sie fehl, geht nichts live. Wichtig für eigene Automatisierung:
Headless-Chrome braucht wegen der View Transitions zwingend
`reducedMotion: 'reduce'` (Details in der [SKILL.md](SKILL.md), §3).

## 🏷️ Versionierung & Releases

GlassKit Web ist seit **v1.0.0** versioniert ([SemVer](https://semver.org),
Format: [Keep a Changelog](https://keepachangelog.com)). Jede Template-Änderung
wird in der [CHANGELOG.md](CHANGELOG.md) dokumentiert — sie ist der
Update-Leitfaden für abgeleitete Projekte (SKILL.md, Recipe §7). Die
Distribution läuft bewusst über GitHub („Use this template" bzw.
`npm create astro -- --template JUNGHERZ/GlassKit-Web`), nicht über npm;
nur das GlassKit-Fundament kommt als npm-Paket.

## 📄 Lizenz

MIT © Jungherz GmbH
