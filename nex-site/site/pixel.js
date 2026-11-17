/* Meta Pixel (NEX IA) e rastreamento dos botões. Carregar no <head> das páginas.
   - Botão rastreado: data-px="Nome do botão" (fixo em pt-BR, para o relatório não mudar com o idioma).
     Sem data-px-evento → trackCustom 'CliqueBotao' { botao, pagina, idioma }.
     Com data-px-evento="Contact" (ou outro evento padrão da Meta) → track Contact { content_name, pagina, idioma }.
   - No código: nexTrack('Lead', { … }) ou nexTrack('DiagnosticoEtapa', { … }, true) para evento personalizado.
   - Nunca enviar nome, telefone ou e-mail do visitante nos parâmetros. */
!function (f, b, e, v, n, t, s) {
  if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
  if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
  n.queue = []; t = b.createElement(e); t.async = !0;
  t.src = v; s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s)
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1981197856191962');
fbq('track', 'PageView');

(() => {
  const base = () => ({ pagina: location.pathname.split('/').pop() || 'index.html', idioma: document.documentElement.lang });
  const track = (name, params, custom) => { try { fbq(custom ? 'trackCustom' : 'track', name, Object.assign(base(), params)); } catch (e) {} };
  window.nexTrack = track;
  document.addEventListener('click', e => {
    const el = e.target.closest && e.target.closest('[data-px],.lang-menu [data-lang]');
    if (!el) return;
    if (!el.dataset.px) return track('CliqueBotao', { botao: 'Idioma: ' + el.dataset.lang }, true);
    const ev = el.dataset.pxEvento;
    if (ev) track(ev, { content_name: el.dataset.px });
    else track('CliqueBotao', { botao: el.dataset.px }, true);
  }, true);
})();
