import { test, expect } from '@playwright/test';

/**
 * Smoke-Tests — laufen im CI vor jedem Deploy (Job "test" in deploy.yml).
 * Prüft die manuelle Abnahme-Matrix: {dark, light} × {B2C, B2B} × {Desktop, 390 px},
 * No-JS-Fallbacks, Navigation von Unterseiten (base-Präfix) und Konsolenfehler.
 *
 * URLs sind bewusst RELATIV (ohne führenden Slash): baseURL in
 * playwright.config.ts endet auf den base-Pfad, absolute Pfade würden ihn verwerfen.
 *
 * reducedMotion 'reduce' ist global gesetzt (playwright.config.ts) — ohne diese
 * Emulation frieren klick-initiierte Navigationen wegen der Cross-Document
 * View Transitions in Headless-Chrome ein. Siehe SKILL.md §3.
 */

test.beforeEach(async ({ page }) => {
  // use.reducedMotion aus der Config kommt beim Fixture-Kontext nicht
  // zuverlässig an (beobachtet mit Playwright 1.61: matchMedia meldet false,
  // obwohl die Option im aufgelösten Projekt steht) — deshalb hier erzwungen.
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

const pages = [
  { path: '', name: 'Startseite' },
  { path: 'blog/', name: 'Blog-Übersicht' },
  { path: 'blog/papierkram-wochenende/', name: 'Blog-Artikel' },
  { path: 'impressum/', name: 'Impressum' },
  { path: 'datenschutz/', name: 'Datenschutz' },
  { path: 'en/', name: 'EN-Startseite' },
  { path: 'en/impressum/', name: 'EN-Imprint' },
  { path: 'en/datenschutz/', name: 'EN-Privacy' },
];

for (const p of pages) {
  test(`${p.name} rendert ohne Konsolenfehler`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));

    const res = await page.goto(p.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const scheme of ['dark', 'light'] as const) {
  test(`Theme ${scheme}: B2C-Default und Umschalten auf B2B`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('');
    await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);

    // Default-Ansicht: B2C sichtbar, B2B versteckt
    await expect(page.locator('h1.only-b2c')).toBeVisible();
    await expect(page.locator('h1.only-b2b')).toBeHidden();

    await page.locator('[data-audience-btn="b2b"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-audience', 'b2b');
    await expect(page.locator('h1.only-b2b')).toBeVisible();
    await expect(page.locator('h1.only-b2c')).toBeHidden();
  });
}

test('Theme-Toggle wechselt das Farbschema', async ({ page }) => {
  await page.goto('');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.locator('#themeToggle').click();
  const after = await html.getAttribute('data-theme');
  expect(after).not.toBe(before);
  expect(['dark', 'light']).toContain(after);
});

test('Navigation: Startseite → Blog → Artikel → Anker von Unterseite', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'Desktop-Nav ist mobil ausgeblendet');
  await page.goto('');

  await page.locator('.glw-nav a', { hasText: 'Blog' }).click();
  await expect(page).toHaveURL(/\/blog\/$/);

  await page.locator('.glw-post-card h2 a').first().click();
  await expect(page.locator('.glw-article h1')).toBeVisible();
  await expect(page.locator('.glw-prose--article')).toBeVisible();

  // Anker-Link von der Unterseite zurück auf den One-Pager (muss base-sicher sein)
  await page.locator('.glw-nav a', { hasText: 'Preise' }).click();
  await expect(page).toHaveURL(/\/#preise$/);
  await expect(page.locator('#preise')).toBeVisible();
});

test('Footer-Brand (#top) scrollt zurück nach oben', async ({ page }) => {
  await page.goto('');
  const brand = page.locator('.glw-footer .glw-brand');
  await brand.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  // id="top" liegt auf dem glass-bg-Wrapper (BaseLayout) — auf dem fixed
  // Header würde der Same-Page-Anker nicht scrollen.
  await brand.click();
  await expect(page).toHaveURL(/#top$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('Skip-Link: erster Tab-Stopp, springt über den Header in den Inhalt', async ({ page }) => {
  await page.goto('');
  await page.keyboard.press('Tab');
  const skip = page.locator('.glw-skip');
  await expect(skip).toBeFocused();
  await expect(skip).toHaveText('Zum Inhalt springen');
  // Mit Fokus im Viewport (ohne Fokus liegt er darüber)
  expect((await skip.boundingBox())?.y).toBeGreaterThanOrEqual(0);

  await page.keyboard.press('Enter');
  await expect(page.locator('main#main')).toBeFocused();
  // Der nächste Tab-Stopp liegt im Inhalt — die zehn Header-Stopps sind übersprungen
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('main'))).toBe(true);
});

test('Skip-Link spricht die Sprache der Seite, auch auf der zweisprachigen 404', async ({ page }) => {
  for (const [path, label] of [
    ['en/', 'Skip to content'],
    ['diese-seite-gibt-es-nicht/', 'Zum Inhalt springen'],
    ['en/diese-seite-gibt-es-nicht/', 'Skip to content'],
  ]) {
    await page.goto(path);
    await page.keyboard.press('Tab');
    await expect(page.locator('.glw-skip:focus'), path).toHaveText(label);
  }
});

test('Landmarks: jede Seite hat genau ein <main>, Header und Footer liegen außerhalb', async ({ page }) => {
  for (const path of [...pages.map((p) => p.path), 'diese-seite-gibt-es-nicht/']) {
    await page.goto(path);
    await expect(page.locator('main'), path || '/').toHaveCount(1);
    await expect(page.locator('main .glw-header, main .glw-footer'), path || '/').toHaveCount(0);
  }
});

test('Kontaktformular: Hinweis bei fehlenden Pflichtfeldern, danach Demo-Versand', async ({ page }) => {
  await page.goto('');
  const status = page.locator('#contactStatus');
  await expect(status).toBeHidden();

  // Leer abschicken: die native Validierung blockiert den Submit —
  // der Click-Handler muss die Inline-Meldung zeigen.
  await page.locator('#kontakt [type="submit"]').click();
  await expect(status).toBeVisible();
  await expect(status).toHaveClass(/glw-status--error/);
  await expect(status).toContainText('Pflichtfelder');

  await page.locator('#cf-name').fill('Test Person');
  await page.locator('#cf-email').fill('test@example.com');
  await page.locator('#cf-message').fill('Testnachricht');
  // Über die Rolle anhaken: seit GlassKit 1.20.0 liegt das unsichtbare Input
  // über dem Kästchen und nimmt den Klick selbst — ein Klick auf
  // .glass-checkbox__box würde von ihm abgefangen.
  const consent = page.locator('#kontakt').getByRole('checkbox');
  await consent.check();
  await expect(consent).toBeChecked();
  await page.locator('#kontakt [type="submit"]').click();
  await expect(status).toContainText('Demo-Modus');
  await expect(status).not.toHaveClass(/glw-status--error/);
});

test('EN: Pflichtfeld-Hinweis nutzt data-msg-invalid', async ({ page }) => {
  await page.goto('en/');
  await page.locator('#contact [type="submit"]').click();
  const status = page.locator('#contactStatus');
  await expect(status).toBeVisible();
  await expect(status).toContainText('required fields');
});

test('Mobile-Menü öffnet, navigiert und schließt', async ({ page }) => {
  test.skip(test.info().project.name !== 'mobile', 'Burger-Menü existiert nur mobil');
  await page.goto('');

  await page.locator('.glw-mobilenav__toggle').click();
  const blogLink = page.locator('.glw-mobilenav__panel a', { hasText: 'Blog' });
  await expect(blogLink).toBeVisible();

  await blogLink.click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(page.locator('.glw-mobilenav__panel a').first()).toBeHidden();
});

test('Sprach-Umschalter: DE → EN → DE', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');

  await page.locator('.glw-lang a[lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1.only-b2c')).toContainText('Your documents');

  await page.locator('.glw-lang a[lang="de"]').click();
  await expect(page).toHaveURL(String(test.info().project.use.baseURL));
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('Sprach-Umschalter erhält die Unterseite', async ({ page }) => {
  await page.goto('impressum/');
  await expect(page.locator('.glw-lang a[lang="en"]')).toHaveAttribute('href', /\/en\/impressum\/$/);
  await page.locator('.glw-lang a[lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/impressum\/$/);
  await expect(page.locator('h1')).toContainText('Imprint');
});

test('hreflang: Alternates auf übersetzten Seiten, keine im Blog', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);

  await page.goto('blog/');
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  // Blog ist nicht übersetzt: der Umschalter fällt auf die EN-Startseite zurück
  // (auf den sichtbaren DE-Zweig scopen — untranslated Seiten rendern beide Header)
  await expect(page.locator('.glw-i18n--de .glw-lang a[lang="en"]')).toHaveAttribute('href', /\/en\/$/);
});

test('EN: Anker-Navigation von Unterseite', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'Desktop-Nav ist mobil ausgeblendet');
  await page.goto('en/impressum/');
  await page.locator('.glw-nav a', { hasText: 'Pricing' }).click();
  await expect(page).toHaveURL(/\/en\/#pricing$/);
  await expect(page.locator('#pricing')).toBeVisible();
});

test.describe('Ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('B2C sichtbar, Reveals sichtbar, FAQ aufgeklappt', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('h1.only-b2c')).toBeVisible();
    await expect(page.locator('h1.only-b2b')).toBeHidden();
    // Ohne html.js darf nichts per Reveal-Opacity versteckt sein
    await expect(page.locator('.reveal').first()).toHaveCSS('opacity', '1');
    // FAQ-Antworten sind ohne JS vollständig ausgeklappt
    await expect(page.locator('.glass-accordion__content').first()).toBeVisible();
  });

  test('Druck ohne JS: dunkle Schrift auch bei dunkler OS-Präferenz', async ({ page }) => {
    // Der Light-Spiegel gilt auch für @media print — ohne ihn gäbe es helle Schrift auf Papier
    await page.emulateMedia({ colorScheme: 'dark', media: 'print' });
    await page.goto('datenschutz/');
    await expect(page.locator('.glw-prose p').first()).toHaveCSS('color', 'rgba(26, 42, 54, 0.55)');
  });

  for (const [surface, expected] of [
    ['solid', /color-mix\(in srgb, #ffffff 50%, #f0f4f8\)/],
    ['tint', /color-mix\(in srgb, #1a2a36 4%, transparent\)/],
  ] as const) {
    test(`Oberflächen-Preset ${surface} ohne JS: der Spiegel folgt data-surface`, async ({ page }) => {
      // data-surface fest ins <html> schreiben, wie ein Projekt es in BaseLayout setzen würde
      await page.route('**/*', async (route) => {
        if (route.request().resourceType() !== 'document') return route.continue();
        const res = await route.fetch();
        const body = (await res.text()).replace(/<html([^>]*)>/, `<html$1 data-surface="${surface}">`);
        await route.fulfill({ response: res, body });
      });
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('');
      // Light-Wert des Presets statt des Glas-Spiegels (rgba(255, 255, 255, .5))
      await expect(page.locator('html')).toHaveCSS('--gl-surface-1', expected);
    });
  }
});

test('Druck: Light-Theme fürs Papier, Skip-Link ausgeblendet', async ({ page }) => {
  await page.goto('datenschutz/');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.glw-skip')).toBeHidden();
});

test('RSS-Feed, Sitemap und llms.txt sind erreichbar', async ({ request }) => {
  const rss = await request.get('rss.xml');
  expect(rss.status()).toBe(200);
  expect(await rss.text()).toContain('<rss');

  const sitemap = await request.get('sitemap-index.xml');
  expect(sitemap.status()).toBe(200);

  const llms = await request.get('llms.txt');
  expect(llms.status()).toBe(200);
  const llmsBody = await llms.text();
  expect(llmsBody).toContain('# LUMEN');
  expect(llmsBody).toContain('## Blog-Artikel');
});

test('Unbekannte URL liefert die 404-Seite', async ({ page }) => {
  const res = await page.goto('diese-seite-gibt-es-nicht/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('.glw-i18n--de h1')).toBeVisible();
  await expect(page.locator('.glw-i18n--en h1')).toBeHidden();
});

test('404 unter /en/ zeigt den englischen Zweig', async ({ page }) => {
  const res = await page.goto('en/diese-seite-gibt-es-nicht/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('data-path-lang', 'en');
  await expect(page.locator('.glw-i18n--en h1')).toBeVisible();
  await expect(page.locator('.glw-i18n--de h1')).toBeHidden();
});
