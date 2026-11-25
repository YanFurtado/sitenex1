/* Consentimento de cookies (LGPD): banner + painel de preferências, compartilhado por todas as páginas.
   Nenhuma tag opcional roda antes do aceite. A escolha é repassada ao pixel por nexPixel.setConsent (nex-pixel.js).
   Qualquer link com o texto "Preferências de cookies" abre o painel. */
(() => {
  const KEY = 'nex-cookie-consent-v1';
  const TERMS = 'https://nexinteligence.com.br/termos';

  document.body.insertAdjacentHTML('beforeend', `
<div class="ck-bar" id="ck-bar" role="region" aria-label="Aviso de cookies" hidden>
  <b>Sua privacidade, sua escolha</b>
  <p>Usamos cookies para o site funcionar e, com sua permissão, para medir os resultados dos nossos anúncios no Facebook e no Instagram. Saiba mais nos <a href="${TERMS}" target="_blank" rel="noopener">Termos e Política</a>.</p>
  <div class="ck-row"><button type="button" class="ck-btn" data-ck="all">Aceitar todos</button><button type="button" class="ck-btn" data-ck="none">Recusar opcionais</button></div>
  <button type="button" class="ck-link" data-ck="open">Personalizar</button>
</div>
<div class="ck-modal" id="ck-modal" role="dialog" aria-modal="true" aria-labelledby="ck-title" hidden>
  <div class="ck-bg" data-ck="close"></div>
  <div class="ck-panel">
    <button type="button" class="ck-x" data-ck="close" aria-label="Fechar">✕</button>
    <span class="eyebrow">Preferências de cookies</span>
    <h3 id="ck-title" style="margin-top:10px">Escolha o que podemos usar</h3>
    <p>Você pode mudar estas escolhas quando quiser pelo link "Preferências de cookies", no rodapé do site.</p>
    <div class="ck-cats">
      <div class="ck-cat"><div class="ck-cat-hd"><b>Necessários</b><span class="ck-always">Sempre ativos</span></div><p>Fazem o site funcionar e guardam a sua escolha de cookies. Não podem ser desligados.</p><small>Preferência de consentimento · segurança</small></div>
      <div class="ck-cat"><div class="ck-cat-hd"><b>Marketing</b><label class="ck-sw"><input type="checkbox" id="ck-mk" aria-label="Cookies de marketing"><i></i></label></div><p>Medem os resultados dos anúncios da NEX no Facebook e no Instagram e ajudam a mostrar anúncios mais relevantes.</p><small>Meta Pixel</small></div>
    </div>
    <div class="ck-acts"><button type="button" class="ck-btn ghost" data-ck="none">Recusar opcionais</button><button type="button" class="ck-btn ghost" data-ck="save">Salvar escolhas</button><button type="button" class="ck-btn" data-ck="all">Aceitar todos</button></div>
    <p class="ck-saved" id="ck-saved" hidden>Preferências salvas.</p>
  </div>
</div>`);

  const $ = id => document.getElementById(id);
  const bar = $('ck-bar'), modal = $('ck-modal'), mk = $('ck-mk');
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
  const write = c => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} };

  function apply(c) {
    window.nexConsent = c;
    if (window.nexPixel) window.nexPixel.setConsent(!!c.marketing);
  }
  function decide(c) {
    c.date = new Date().toISOString(); write(c); apply(c);
    bar.hidden = true;
    if (!modal.hidden) { $('ck-saved').hidden = false; setTimeout(closePanel, 700); }
  }
  let last = null;
  function openPanel(trigger) {
    last = trigger || document.activeElement;
    const c = read() || { marketing: false };
    mk.checked = !!c.marketing; $('ck-saved').hidden = true;
    modal.hidden = false; document.documentElement.style.overflow = 'hidden'; modal.querySelector('.ck-x').focus();
  }
  function closePanel() { modal.hidden = true; document.documentElement.style.overflow = ''; last && last.focus && last.focus(); }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-ck]'); if (!t) return;
    const a = t.dataset.ck;
    if (a === 'all') decide({ marketing: true });
    else if (a === 'none') decide({ marketing: false });
    else if (a === 'save') decide({ marketing: mk.checked });
    else if (a === 'open') openPanel(t);
    else if (a === 'close') closePanel();
  });
  document.querySelectorAll('a').forEach(l => { if (l.textContent.trim() === 'Preferências de cookies') { l.setAttribute('href', '#cookies'); l.setAttribute('role', 'button'); l.addEventListener('click', e => { e.preventDefault(); openPanel(l); }); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closePanel(); });

  const saved = read();
  if (saved) apply(saved); else bar.hidden = false;
})();
