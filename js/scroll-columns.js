(() => {
  const BREAKPOINT = 782;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const debounce = (fn, wait = 60) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

  function updateVars() {
    const header = $('.wp-site-blocks > header');
    const footer = $('.wp-site-blocks > footer');
    const headerH = header ? Math.round(header.getBoundingClientRect().height) : 0;
    const footerH = footer ? Math.round(footer.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--header-h', `${headerH}px`);
    document.documentElement.style.setProperty('--footer-h', `${footerH}px`);
    return { headerH, footerH };
  }

  function updateGroupsHeight() {
    const groups = $$('.wp-block-columns.scrollable-columns');
    if (!groups.length) return;

    const vw = window.innerWidth;
    const { headerH, footerH } = updateVars();

    if (vw < BREAKPOINT) {
      groups.forEach(g => g.style.removeProperty('--group-h'));
      return;
    }

    const vh = window.innerHeight;
    groups.forEach(g => {
      const rect = g.getBoundingClientRect();
      const available = Math.max(
        120,
        Math.round(vh - Math.max(0, rect.top) - footerH)
      );
      g.style.setProperty('--group-h', `${available}px`);
    });
  }

  const run = debounce(() => requestAnimationFrame(updateGroupsHeight), 50);

  document.addEventListener('DOMContentLoaded', run, { once: true });
  window.addEventListener('load', run, { once: true });
  window.addEventListener('resize', run);

  const header = document.querySelector('.wp-site-blocks > header');
  const footer = document.querySelector('.wp-site-blocks > footer');
  if ('ResizeObserver' in window) {
    if (header) new ResizeObserver(run).observe(header);
    if (footer) new ResizeObserver(run).observe(footer);
  }

  if (window.barba?.hooks) {
    window.barba.hooks.after(run);
    window.barba.hooks.afterEnter(run);
  }
})();


