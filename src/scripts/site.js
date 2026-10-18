/* LUMEN — GlassKit Web-Layer: Interaktion (Theme, Zielgruppe, Reveal, Tilt) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Theme-Umschalter (alle Instanzen) ---------------------- */
  document.querySelectorAll('.glass-theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
    });
  });

  /* ---- Druck: immer im Light-Theme ----------------------------
     Papier ist hell: im Dark-Theme druckte die helle Schrift fast
     unsichtbar (Rezept aus GlassKit 1.21.1). Ohne JS übernimmt das der
     Light-Spiegel in site.css, der auch für @media print gilt. */
  var printTheme = null;
  addEventListener('beforeprint', function () {
    printTheme = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
  });
  addEventListener('afterprint', function () {
    if (printTheme) root.setAttribute('data-theme', printTheme);
    else root.removeAttribute('data-theme');
  });

  /* ---- Zielgruppen-Umschalter (B2C / B2B) -------------------- */
  var segBtns = document.querySelectorAll('[data-audience-btn]');
  segBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var audience = btn.getAttribute('data-audience-btn');
      if (root.getAttribute('data-audience') === audience) return;
      root.setAttribute('data-audience', audience);
      segBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      if (!reducedMotion.matches) {
        var visible = document.querySelectorAll('.only-' + audience);
        visible.forEach(function (el) {
          el.classList.remove('glw-aud-fade');
          void el.offsetWidth; /* Reflow: Animation neu starten */
          el.classList.add('glw-aud-fade');
        });
      }
    });
  });

  /* ---- Header: Glas-Fläche nach dem ersten Scroll ------------ */
  var header = document.querySelector('.glw-header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile-Navigation (details/summary) --------------------
     Auf-/Zuklappen funktioniert nativ ohne JS; hier nur Komfort:
     Scroll-Lock, Fokus-Trap im Header, ESC, Schließen nach Klick. */
  var mnav = document.getElementById('mobileNav');
  if (mnav && header) {
    var mnavSummary = mnav.querySelector('summary');
    var mnavPanel = mnav.querySelector('.glw-mobilenav__panel');

    mnav.addEventListener('toggle', function () {
      root.classList.toggle('glw-nav-open', mnav.open);
      if (mnav.open) {
        var first = mnavPanel.querySelector('a, button');
        if (first) first.focus();
      }
    });

    mnavPanel.addEventListener('click', function (e) {
      if (e.target.closest('a')) mnav.open = false;
    });

    document.addEventListener('keydown', function (e) {
      if (!mnav.open) return;
      if (e.key === 'Escape') {
        mnav.open = false;
        mnavSummary.focus();
        return;
      }
      if (e.key === 'Tab') {
        var focusables = [].slice
          .call(header.querySelectorAll('a, button, summary'))
          .filter(function (el) { return el.offsetParent !== null; });
        if (!focusables.length) return;
        var i = focusables.indexOf(document.activeElement);
        var last = focusables.length - 1;
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          focusables[last].focus();
        } else if (!e.shiftKey && i === last) {
          e.preventDefault();
          focusables[0].focus();
        }
      }
    });
  }

  /* ---- Sprach-Dropdown (details/summary, nur bei 3+ Sprachen) --
     Auf-/Zuklappen funktioniert nativ ohne JS; hier nur Komfort:
     ESC und Klick außerhalb schließen das Menü. */
  var lmenu = document.getElementById('langMenu');
  if (lmenu) {
    document.addEventListener('keydown', function (e) {
      if (lmenu.open && e.key === 'Escape') {
        lmenu.open = false;
        lmenu.querySelector('summary').focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (lmenu.open && !lmenu.contains(e.target)) lmenu.open = false;
    });
  }

  /* ---- Accordion (FAQ) ----------------------------------------
     GlassKit steuert das Accordion über is-open auf dem Item;
     hier Klick-Toggle + aria-expanded. Ohne JS zeigt ein CSS-Fallback
     alle Antworten aufgeklappt (site.css). */
  document.querySelectorAll('.glass-accordion__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var open = trigger.parentElement.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---- Kontaktformular -----------------------------------------
     Endpoint kommt aus src/data/site.ts (action-Attribut). Leer =
     Demo-Modus. Mit Endpoint: fetch-POST + Inline-Status statt
     Seitenwechsel; ohne JS postet das Formular nativ. */
  var cform = document.querySelector('[data-contact-form]');
  if (cform) {
    var cstatus = document.getElementById('contactStatus');
    var cstatusText = cstatus.querySelector('p');
    /* Status-Texte kommen als data-msg-* aus der Komponente (Copy bleibt
       bei ihrem Markup — wichtig für Sprachzweige); deutsche Fallbacks. */
    var cmsg = function (key, fallback) {
      return cform.getAttribute('data-msg-' + key) || fallback;
    };
    var showStatus = function (type, msg) {
      cstatus.hidden = false;
      cstatus.classList.remove('glw-status--success', 'glw-status--error');
      if (type) cstatus.classList.add('glw-status--' + type);
      cstatusText.textContent = msg;
    };
    /* Pflichtfeld-Hinweis: blockiert die native Validierung den Submit,
       zeigt der Click-Handler zusätzlich eine dauerhafte, übersetzbare
       Inline-Meldung (Click feuert VOR der Validierung, Submit dann gar
       nicht). Bis GlassKit 1.6.3 war das sogar zwingend: das 0×0 versteckte
       Checkbox-Input bot der Browser-Bubble keinen Anker — der Submit blieb
       komplett stumm (upstream in 1.6.4 behoben). */
    var submitBtn = cform.querySelector('[type="submit"]');
    submitBtn.addEventListener('click', function () {
      if (!cform.checkValidity()) {
        showStatus('error', cmsg('invalid', 'Bitte alle Pflichtfelder ausfüllen und die Datenschutzerklärung bestätigen.'));
      } else if (cstatus.classList.contains('glw-status--error')) {
        cstatus.hidden = true;
      }
    });
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      if (cform.elements.botcheck && cform.elements.botcheck.value) return; /* Honeypot */
      var endpoint = cform.getAttribute('action');
      if (!endpoint) {
        showStatus('success', cmsg('demo', 'Demo-Modus: Es wurde nichts versendet. Endpoint in src/data/site.ts konfigurieren.'));
        cform.reset();
        return;
      }
      submitBtn.disabled = true;
      showStatus('', cmsg('sending', 'Nachricht wird gesendet …'));
      fetch(endpoint, {
        method: 'POST',
        body: new FormData(cform),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        showStatus('success', cmsg('success', 'Danke! Die Nachricht ist angekommen – wir melden uns zeitnah.'));
        cform.reset();
      }).catch(function () {
        showStatus('error', cmsg('error', 'Senden fehlgeschlagen. Bitte später erneut versuchen.'));
      }).finally(function () {
        submitBtn.disabled = false;
      });
    });
  }

  /* ---- Scroll-Reveal ----------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Parallax-Tilt (Spatial-Fenster, Hero-Panel) -------------
     Jedes Element mit [data-tilt] bekommt bei Mausbewegung die Deltas
     --tilt-dx/--tilt-dy (in deg) gesetzt; die Basiswinkel stehen im CSS
     als calc(<basis> + var(--tilt-dx/dy, 0deg)). Hover-Zone ist die
     umgebende .glw-stage, sonst das Element selbst. */
  if (matchMedia('(pointer: fine)').matches && !reducedMotion.matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (tiltEl) {
      var zone = tiltEl.closest('.glw-stage') || tiltEl;
      zone.addEventListener('pointermove', function (e) {
        var r = tiltEl.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        tiltEl.style.setProperty('--tilt-dx', (y * -5).toFixed(2) + 'deg');
        tiltEl.style.setProperty('--tilt-dy', (x * 7).toFixed(2) + 'deg');
      });
      zone.addEventListener('pointerleave', function () {
        tiltEl.style.removeProperty('--tilt-dx');
        tiltEl.style.removeProperty('--tilt-dy');
      });
    });
  }
})();
