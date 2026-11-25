/* Meta Pixel "NEX CRM": único lugar do site com o ID do pixel.
   Carregado no <head> de todas as páginas.
   LGPD: o pixel só carrega depois do aceite de cookies de marketing (ver nex-cookies.js).
   Para rastrear um botão ou link, adicione no HTML:
     data-meta-event="Contact"  data-meta-name="Descrição"  [data-meta-value="597"]
   Para disparar via código: trackMetaEvent('Lead', { content_name: '...' }) */
(function () {
  var PIXEL_ID = '4820743728147875';
  var CONSENT_KEY = 'nex-cookie-consent-v1';
  var loaded = false, granted = false;

  function savedConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); } catch (e) { return null; }
  }

  function load() {
    if (loaded) return;
    loaded = true;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function setConsent(ok) {
    granted = !!ok;
    if (granted) {
      if (loaded && typeof window.fbq === 'function') window.fbq('consent', 'grant');
      load();
    } else if (loaded && typeof window.fbq === 'function') {
      window.fbq('consent', 'revoke');
    }
  }

  function trackMetaEvent(name, params) {
    try {
      if (granted && typeof window !== 'undefined' && typeof window.fbq === 'function') window.fbq('track', name, params || {});
    } catch (e) {}
  }

  window.nexPixel = { setConsent: setConsent, consented: function () { return granted; } };
  window.trackMetaEvent = trackMetaEvent;

  /* Eventos declarados no HTML via data-meta-event. */
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-meta-event]');
    if (!el) return;
    var p = {};
    if (el.dataset.metaName) p.content_name = el.dataset.metaName;
    if (el.dataset.metaValue) { p.value = Number(el.dataset.metaValue); p.currency = 'BRL'; }
    trackMetaEvent(el.dataset.metaEvent, p);
  }, true);

  var c = savedConsent();
  if (c && c.marketing) setConsent(true);
})();
