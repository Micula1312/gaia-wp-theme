// gaia-audio.js
(() => {
  const BTN_SELECTOR = '#audio-toggle';
  const LS_KEY_MUTED  = 'gaiaAudioMuted';
  const LS_KEY_VOLUME = 'gaiaAudioVolume';

  // Stato → default: muted = true, volume = 1.0
  const initialMuted  = localStorage.getItem(LS_KEY_MUTED);
  const initialVolume = localStorage.getItem(LS_KEY_VOLUME);

  const getBool = (v, fallback) => (v === 'true' ? true : v === 'false' ? false : fallback);

  const btn = document.querySelector(BTN_SELECTOR);
  if (!btn) return;

  const src = btn.dataset.audioUrl;
  if (!src) {
    console.warn('[gaia-audio] data-audio-url mancante sul bottone.');
    return;
  }

  // Crea audio nascosto
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = 'auto';
  audio.crossOrigin = 'anonymous';

  audio.muted  = getBool(initialMuted, true);         // avvia muto per sicurezza/autoplay
  audio.volume = initialVolume ? Number(initialVolume) : 1.0;

  // UI helper
  function refreshUI() {
    const isMuted = audio.muted || audio.volume === 0;
    btn.setAttribute('aria-pressed', String(!isMuted));
    btn.textContent = isMuted ? 'Audio OFF' : 'Audio ON';
  }

  // Avvio: prova a partire in muto (permesso dai browser)
  audio.play().catch(() => {
    // ok, partirà al primo click dell’utente
  }).finally(refreshUI);

  // Toggle al click
  btn.addEventListener('click', async () => {
    // Primo gesto utente → assicura il play
    try { await audio.play(); } catch (e) { /* ignorabile */ }

    audio.muted = !audio.muted;
    localStorage.setItem(LS_KEY_MUTED, String(audio.muted));
    refreshUI();
  });

  // (Opzionale) Alt+wheel sul bottone = volume su/giù
  btn.addEventListener('wheel', (e) => {
    if (!e.altKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
    if (audio.volume > 0 && audio.muted) audio.muted = false;
    localStorage.setItem(LS_KEY_VOLUME, String(audio.volume));
    localStorage.setItem(LS_KEY_MUTED, String(audio.muted));
    refreshUI();
  }, { passive: false });

  // Aggiorna UI se utente cambia volume da devtools ecc.
  audio.addEventListener('volumechange', refreshUI);
})();
