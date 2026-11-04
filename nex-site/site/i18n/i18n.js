/* Tradução do site, sem dependências. Carregar no <head>, antes de qualquer outro script.
   - A chave é o próprio texto em pt-BR. O pt-BR não tem arquivo: sem tradução, aparece o original.
   - Traduções em i18n/locales/<idioma>.js, no formato { "texto original": "tradução" }. Só o idioma escolhido é baixado.
   - HTML: todo texto visível é traduzido pelo próprio texto (e placeholder, aria-label, alt, title, data-title).
     [translate="no"] fica como está (marcas, nomes, valores). [data-i18n] traduz o elemento inteiro,
     com os filhos como <0>…</0>, <1>…</1>. [data-i18n-words] traduz um título montado palavra por palavra.
   - JS: t('Texto com {{x}}', { x }); constantes marcadas com tx('texto') e traduzidas ao mostrar, com t(constante).
   - NEX_I18N.apply() traduz o que já foi carregado da página; chame antes dos scripts que leem os textos.
   - Idioma: ?lang=en-US no endereço (bom para anúncios por país) > escolha guardada > idioma do navegador > pt-BR.
   Conferência: node tools/i18n/check.mjs (na raiz do repositório). */
(() => {
  const ORIGINAL = 'pt-BR';
  const LANGS = [
    { code: 'pt-BR', name: 'Português (Brasil)', short: 'PT',
      flag: '<svg viewBox="0 0 24 24"><path fill="#009c3b" d="M0 0h24v24H0z"/><path fill="#ffdf00" d="M12 3.6 22.8 12 12 20.4 1.2 12z"/><circle cx="12" cy="12" r="4.6" fill="#002776"/><path fill="none" stroke="#fff" stroke-width="1" d="M7.5 11a9.5 9.5 0 0 1 8.9 2.6"/></svg>' },
    { code: 'pt-PT', name: 'Português (Portugal)', short: 'PT',
      flag: '<svg viewBox="0 0 24 24"><path fill="#f00" d="M0 0h24v24H0z"/><path fill="#060" d="M0 0h9.6v24H0z"/><circle cx="9.6" cy="12" r="4.4" fill="#ffe000"/><path fill="#fff" stroke="#f00" stroke-width=".9" d="M7.6 9.4h4v3.4a2 2 0 0 1-4 0z"/></svg>' },
    { code: 'en-US', name: 'English (US)', short: 'EN',
      flag: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M0 0h24v24H0z"/><path fill="#b22234" d="M0 0h24v1.85H0zm0 3.7h24v1.85H0zm0 3.7h24v1.85H0zm0 3.7h24v1.85H0zm0 3.7h24v1.85H0zm0 3.7h24v1.85H0zm0 3.7h24v1.85H0z"/><path fill="#3c3b6e" d="M0 0h12v12.95H0z"/><g fill="#fff"><circle cx="4.6" cy="3.2" r=".7"/><circle cx="7.6" cy="3.2" r=".7"/><circle cx="10.6" cy="3.2" r=".7"/><circle cx="6.1" cy="6.4" r=".7"/><circle cx="9.1" cy="6.4" r=".7"/><circle cx="4.6" cy="9.6" r=".7"/><circle cx="7.6" cy="9.6" r=".7"/><circle cx="10.6" cy="9.6" r=".7"/></g></svg>' },
    { code: 'es-ES', name: 'Español (España)', short: 'ES',
      flag: '<svg viewBox="0 0 24 24"><path fill="#d80027" d="M0 0h24v24H0z"/><path fill="#ffda44" d="M0 6h24v12H0z"/></svg>' },
  ];

  /* ---------- idioma: ?lang= no endereço > escolha guardada > idioma do navegador > pt-BR ---------- */
  const KEY = 'nex-idioma';
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} },
  };
  const valid = code => LANGS.some(l => l.code === code);
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (valid(fromUrl)) store.set(fromUrl);
  // buscadores, prévias de link e medições (Lighthouse) veem sempre o original
  const detect = () => {
    if (/bot|crawl|spider|slurp|preview|lighthouse|google|facebookexternalhit/i.test(navigator.userAgent || '')) return null;
    for (const tag of navigator.languages || [navigator.language || '']) {
      const [base, region] = String(tag).toLowerCase().split('-');
      if (base === 'pt') return region && region !== 'br' ? 'pt-PT' : 'pt-BR';
      if (base === 'en') return 'en-US';
      if (base === 'es') return 'es-ES';
    }
    return null;
  };
  const lang = [fromUrl, store.get(), detect()].find(valid) || ORIGINAL;
  // a escolha vai também no endereço: funciona com o storage bloqueado e o link pode ser compartilhado
  const setLang = code => { store.set(code); const u = new URL(location.href); u.searchParams.set('lang', code); location.href = u.href; };

  /* ---------- tradução ---------- */
  const dict = Object.create(null);
  const add = (code, entries) => { if (code === lang) Object.assign(dict, entries); };
  const t = (key, vars) => {
    const s = (lang !== ORIGINAL && dict[key]) || key;
    return vars ? s.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => k in vars ? vars[k] : m) : s;
  };
  const tx = key => key;

  /* ---------- textos do HTML ---------- */
  const ATTRS = ['placeholder', 'aria-label', 'aria-roledescription', 'alt', 'title', 'data-title'];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'svg']);
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const hasText = s => /\p{L}/u.test(s.replace(/R\$/g, ''));
  // <h2>Texto <span>destaque</span>.</h2> → "Texto <0>destaque</0>."
  const markup = el => norm([...el.childNodes].map(n => {
    if (n.nodeType === 3) return n.nodeValue;
    if (n.nodeType !== 1) return '';
    const i = [...el.children].indexOf(n);
    return `<${i}>${n.textContent}</${i}>`;
  }).join(''));
  const setMarkup = (el, s) => {
    const kids = [...el.children];
    el.replaceChildren(...s.split(/(<\d+>[\s\S]*?<\/\d+>)/).filter(Boolean).map(part => {
      const m = /^<(\d+)>([\s\S]*)<\/\1>$/.exec(part);
      if (!m) return part;
      const c = kids[+m[1]]; c.textContent = m[2]; return c;
    }));
  };
  // Título com uma <span class="w"><span>palavra</span></span> por palavra: refaz as palavras mantendo o ritmo da animação
  const setWords = (el, s) => {
    const ws = [...el.children], delay = ws.map(w => parseFloat(w.firstElementChild.style.animationDelay) || 0);
    const step = ws.length > 1 ? (delay[ws.length - 1] - delay[0]) / (ws.length - 1) : 0;
    const words = s.split(' ');
    el.replaceChildren(...words.flatMap((word, i) => {
      const w = ws[i === words.length - 1 ? ws.length - 1 : 0].cloneNode(true), inner = w.firstElementChild;
      inner.textContent = word; inner.style.animationDelay = (delay[0] + step * i).toFixed(2) + 's';
      return i ? [' ', w] : [w];
    }));
  };

  // Percorre os textos traduzíveis: visit(chave, tipo, nó, aplicar). Usado aqui e pelo teste.
  function walk(el, visit) {
    if (SKIP.has(el.tagName) || el.getAttribute('translate') === 'no') return;
    ATTRS.forEach(a => { const v = el.getAttribute(a); if (v && hasText(v)) visit(norm(v), 'attr', el, s => el.setAttribute(a, s)); });
    if (el.tagName === 'META' && el.name === 'description') visit(norm(el.content), 'attr', el, s => { el.content = s; });
    // valor de resposta (radio, checkbox, option): continua em pt-BR no código; é traduzido só ao mostrar, com t(valor)
    if (el.matches('input[type="radio"], input[type="checkbox"], option') && hasText(el.getAttribute('value') || ''))
      visit(norm(el.getAttribute('value')), 'valor', el, null);
    if (el.hasAttribute('data-i18n')) return visit(markup(el), 'html', el, s => setMarkup(el, s));
    if (el.hasAttribute('data-i18n-words')) return visit(norm(el.textContent), 'words', el, s => setWords(el, s));
    [...el.childNodes].forEach(n => {
      if (n.nodeType === 1) walk(n, visit);
      else if (n.nodeType === 3 && hasText(n.nodeValue))
        visit(norm(n.nodeValue), 'text', n, s => { n.nodeValue = n.nodeValue.replace(/\S[\s\S]*\S|\S/, () => s); });
    });
  }
  const collect = (root = document.documentElement) => {
    const found = [];
    walk(root, (key, kind, node) => found.push({ key, kind, node }));
    return found;
  };

  const done = new WeakSet();
  function apply() {
    if (lang !== ORIGINAL) {
      const todo = [];
      walk(document.documentElement, (key, kind, node, set) => { if (set && !done.has(node)) todo.push([key, node, set]); });
      todo.forEach(([key, node, set]) => { if (dict[key]) set(t(key)); done.add(node); });
    }
    // veio com ?lang=: os links para as outras páginas do site levam o idioma junto
    if (valid(fromUrl)) document.querySelectorAll('a[href]').forEach(a => {
      if (a.getAttribute('href').startsWith('#')) return;
      const u = new URL(a.href);
      if (u.origin !== location.origin) return;
      u.searchParams.set('lang', lang); a.href = u.href;
    });
    document.querySelectorAll('[data-lang-picker]').forEach(box => { if (!box.firstChild) mountPicker(box); });
  }

  /* ---------- seletor de idioma ---------- */
  function mountPicker(box) {
    const cur = LANGS.find(l => l.code === lang);
    const flag = l => `<span class="lang-flag" aria-hidden="true">${l.flag}</span>`;
    box.classList.add('lang'); box.setAttribute('translate', 'no');
    box.innerHTML = `<button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="${t('Idioma: {{idioma}}', { idioma: cur.name })}">${flag(cur)}<span class="lang-code">${cur.short}</span><svg class="lang-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5"/></svg></button>`
      + `<div class="lang-menu" hidden>${LANGS.map(l => `<button type="button" lang="${l.code}" data-lang="${l.code}"${l.code === lang ? ' aria-current="true"' : ''}>${flag(l)}<span>${l.name}</span></button>`).join('')}</div>`;
    const btn = box.querySelector('.lang-btn'), menu = box.querySelector('.lang-menu'), items = [...menu.children];
    const toggle = open => { menu.hidden = !open; btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', () => { toggle(menu.hidden); if (!menu.hidden) (items.find(i => i.dataset.lang === lang) || items[0]).focus(); });
    menu.addEventListener('click', e => {
      const b = e.target.closest('[data-lang]'); if (!b) return;
      if (b.dataset.lang === lang) { toggle(false); btn.focus(); } else setLang(b.dataset.lang);
    });
    box.addEventListener('keydown', e => {
      if (menu.hidden) return;
      if (e.key === 'Escape') { toggle(false); btn.focus(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const i = items.indexOf(document.activeElement), d = e.key === 'ArrowDown' ? 1 : -1;
        items[(i + d + items.length) % items.length].focus();
      }
    });
    box.addEventListener('focusout', e => { if (!box.contains(e.relatedTarget)) toggle(false); });
    document.addEventListener('click', e => { if (!box.contains(e.target)) toggle(false); });
  }

  const css = document.createElement('style');
  css.textContent = `html.i18n-wait body{visibility:hidden}
.lang{position:relative;flex:none}
.lang-btn{display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 12px 0 10px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.03);color:var(--fg,#f2f1f6);font:500 12.5px/1 var(--f-mono,ui-monospace,monospace);letter-spacing:.08em;cursor:pointer;transition:border-color .2s,background .2s}
.lang-btn:hover{border-color:rgba(255,255,255,.36);background:rgba(255,255,255,.06)}
.lang-flag{display:block;width:20px;height:20px;border-radius:50%;overflow:hidden;flex:none;box-shadow:0 0 0 1px rgba(255,255,255,.2)}
.lang-flag svg{display:block;width:100%;height:100%}
.lang-chev{width:10px;height:10px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;opacity:.7;transition:transform .25s}
.lang-btn[aria-expanded="true"] .lang-chev{transform:rotate(180deg)}
.lang-menu{position:absolute;right:0;top:calc(100% + 8px);z-index:100;display:flex;flex-direction:column;gap:2px;min-width:236px;padding:6px;border-radius:16px;border:1px solid rgba(160,130,255,.35);background:#120d22;box-shadow:0 24px 60px -18px rgba(0,0,0,.85),0 0 40px -16px rgba(91,43,255,.7)}
.lang-menu button{display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;border:0;border-radius:10px;background:none;color:var(--fg,#f2f1f6);font:500 14px var(--f-body,system-ui,sans-serif);text-align:left;cursor:pointer;transition:background .2s}
.lang-menu button:hover{background:rgba(255,255,255,.07)}
.lang-menu button[aria-current="true"]{background:rgba(91,43,255,.28)}
.lang-menu button[aria-current="true"]::after{content:"✓";margin-left:auto;color:#b9a3ff}
@media(max-width:420px){.lang-code{display:none}.lang-btn{gap:5px;padding:0 9px 0 8px}}`;
  document.head.appendChild(css);

  window.NEX_I18N = { lang, original: ORIGINAL, langs: LANGS, t, tx, add, apply, collect, setLang };

  if (lang !== ORIGINAL) {
    document.documentElement.lang = lang;
    // esconde a página até os textos serem trocados, para não piscar em pt-BR
    document.documentElement.classList.add('i18n-wait');
    addEventListener('DOMContentLoaded', () => document.documentElement.classList.remove('i18n-wait'));
    const src = new URL(`locales/${lang}.js`, document.currentScript ? document.currentScript.src : new URL('i18n/', location.href));
    document.write(`<script src="${src}"><\/script>`);
  }
})();
