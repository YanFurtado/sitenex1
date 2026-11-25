/* Menu mobile do cabeçalho (abaixo de 820px). Abre/fecha pelo botão, fecha ao escolher um link, com Esc ou ao clicar fora.
   Carregar depois de i18n/i18n.js. */
(() => {
  const { t } = window.NEX_I18N || { t: s => s };
  const nav = document.getElementById('nav');
  const btn = nav && nav.querySelector('.nav-burger');
  const menu = btn && document.getElementById(btn.getAttribute('aria-controls'));
  if (!menu) return;
  const set = open => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? t('Fechar menu') : t('Abrir menu'));
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); } });
  document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target)) set(false); });
  matchMedia('(min-width: 821px)').addEventListener('change', e => { if (e.matches) set(false); });
})();
