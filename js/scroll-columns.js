/* assets/js/scroll-columns.js
 * GAIA – colonne full-height sotto header sticky
 * - aggiorna --header-h (altezza header)
 * - per ogni .scrollable-columns imposta --group-h (spazio viewport residuo)
 */
(() => {
  const BREAKPOINT = 782; // sotto questa larghezza: scroll naturale della pagina

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const debounce = (fn, wait = 60) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  function updateHeaderVar() {
    const header = $('.wp-site-blocks > header');
    const h = header ? Math.round(header.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--header-h', `${h}px`);
    return h;
  }

  function updateGroupsHeight() {
    const groups = $$('.wp-block-columns.scrollable-columns');
    if (!groups.length) return;

    const vw = window.innerWidth;
    const headerH = updateHeaderVar();

    // Mobile: lascia che scorra l’intera pagina
    if (vw < BREAKPOINT) {
      groups.forEach(g => g.style.removeProperty('--group-h'));
      return;
    }

    // Desktop: ciascun gruppo riempie lo spazio dalla sua top al fondo viewport
    const vh = window.innerHeight;
    groups.forEach(g => {
      const rect = g.getBoundingClientRect();
      // spazio disponibile dalla posizione corrente del gruppo fino al fondo
      const available = Math.max(120, Math.round(vh - Math.max(0, rect.top)));
      g.style.setProperty('--group-h', `${available}px`);
    });
  }

  const run = debounce(() => {
    // requestAnimationFrame per evitare layout thrashing durante resize
    requestAnimationFrame(updateGroupsHeight);
  }, 50);

  // Init
  document.addEventListener('DOMContentLoaded', run, { once: true });
  window.addEventListener('load', run, { once: true });
  window.addEventListener('resize', run);

  // Reagisci a cambi di altezza dell'header (menu che si chiude/apre, ecc.)
  const header = document.querySelector('.wp-site-blocks > header');
  if (header && 'ResizeObserver' in window) {
    new ResizeObserver(run).observe(header);
  }

  // Se usi Barba.js: ricalcola dopo le transizioni
  if (window.barba?.hooks) {
    window.barba.hooks.after(run);
    window.barba.hooks.afterEnter(run);
  }
})();
