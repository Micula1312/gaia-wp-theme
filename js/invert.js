// js/invert.js
(function () {
  const KEY = 'gaiaInvert'; // "on" | "off"
  const CLASS = 'invert';

  function applyInvert(flag) {
    const on = flag === 'on';
    document.body.classList.toggle(CLASS, on);
    // opzionale: data-flag anche su html, se ti torna comodo in CSS
    document.documentElement.dataset.invert = on ? 'on' : 'off';
    // aggiorna gli eventuali bottoni/toggle presenti in pagina
    document.querySelectorAll('[data-invert-toggle]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  function readState() {
    return localStorage.getItem(KEY) || 'off';
  }

  function writeState(flag) {
    localStorage.setItem(KEY, flag);
  }

  // Init all’avvio
  applyInvert(readState());

  // Event delegation per il toggle (resiste alle sostituzioni Barba)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-invert-toggle]');
    if (!btn) return;
    const next = readState() === 'on' ? 'off' : 'on';
    writeState(next);
    applyInvert(next);
  });

  // Integrazione con Barba.js (se presente)
  if (window.barba && window.barba.hooks) {
    // Dopo ogni transizione, riapplica lo stato
    window.barba.hooks.after(() => {
      applyInvert(readState());
    });
  }

  // Se preferisci fare l’init su domready:
  // document.addEventListener('DOMContentLoaded', () => applyInvert(readState()));
})();
