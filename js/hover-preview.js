(function () {
  // Overlay singleton
  let preview = document.getElementById('hover-preview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'hover-preview';
    const img = document.createElement('img');
    img.decoding = 'async';
    img.loading = 'eager';
    preview.appendChild(img);
    document.body.appendChild(preview);
  }
  const img = preview.querySelector('img');

  const randDeg = (min=-12, max=12) =>
    (Math.random() * (max - min) + min).toFixed(2) + 'deg';

  // Trova la featured image dentro al li.wp-block-post
  function getFeaturedSrc(post) {
    const pic = post.querySelector('.wp-block-post-featured-image img');
    if (!pic) return null;
    // funziona anche se l'immagine è display:none
    return pic.currentSrc || pic.src || pic.getAttribute('data-src') || pic.getAttribute('data-lazy-src') || null;
  }

  function bindRows(root=document) {
    const rows = root.querySelectorAll('.wp-block-post-template .wp-block-post');
    if (!rows.length) {
      console.warn('[hover-preview] nessun li.wp-block-post trovato');
      return;
    }

    rows.forEach((row) => {
      if (row.__hoverBound) return;
      row.__hoverBound = true;

      row.addEventListener('mouseenter', () => {
        const src = getFeaturedSrc(row);
        if (!src) return;
        if (img.src !== src) img.src = src;
        preview.style.setProperty('--rot', randDeg());
        preview.classList.add('is-visible');
      });

      row.addEventListener('mouseleave', () => {
        preview.classList.remove('is-visible');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => bindRows());

  // Rebind dopo transizioni Barba
  if (window.barba) {
    barba.hooks.after(() => bindRows(document));
  }
})();



document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('header .gaia-nav a, footer .wp-block-navigation a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const deg = (Math.random() * 4 - 2).toFixed(2) + 'deg'; // tra -2 e +2 gradi
      link.style.setProperty('--rot', deg);
    });
    link.addEventListener('mouseleave', () => {
      link.style.setProperty('--rot', '0deg');
    });
  });
});