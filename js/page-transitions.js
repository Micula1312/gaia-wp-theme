document.addEventListener('DOMContentLoaded', function () {
  try {
    // Add barba wrapper if missing
    if (!document.body.hasAttribute('data-barba')) {
      document.body.setAttribute('data-barba', 'wrapper');
    }

    const main = document.querySelector('main');

    if (main && !main.hasAttribute('data-barba')) {
      main.setAttribute('data-barba', 'container');

      // Create namespace from body class
      const bodyClasses = document.body.className;
      let namespace = 'default';

      if (bodyClasses.includes('home')) {
        namespace = 'home';
      } else if (bodyClasses.includes('page')) {
        const match = bodyClasses.match(/page-id-(\d+)/);
        namespace = match ? 'page-' + match[1] : 'page';
      } else if (bodyClasses.includes('single')) {
        namespace = 'single';
      } else if (bodyClasses.includes('archive')) {
        namespace = 'archive';
      } else if (bodyClasses.includes('search')) {
        namespace = 'search';
      } else if (bodyClasses.includes('error404')) {
        namespace = '404';
      }

      main.setAttribute('data-barba-namespace', namespace);
    }

    // Prevent reinit
    if (window.__barbaInitialized) return;
    window.__barbaInitialized = true;

    // Init Barba
    barba.init({
      transitions: [
        {
          name: 'fade',
          async leave(data) {
            await gsap.to(data.current.container, {
              opacity: 0,
              duration: 0.4,
              ease: 'power2.out'
            });
          },
          async enter(data) {
            window.scrollTo(0, 0);
            await gsap.from(data.next.container, {
              opacity: 0,
              duration: 0.4,
              ease: 'power2.out'
            });
          }
        }
      ]
    });
  } catch (err) {
    console.error('❌ Barba init error:', err);
  }
});
