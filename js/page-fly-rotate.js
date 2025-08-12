document.addEventListener('DOMContentLoaded', () => {
  if (window.__barbaInitialized) return;
  window.__barbaInitialized = true;

  barba.init({
    transitions: [
      {
        name: 'fly-rotate',
        async leave(data) {
          const container = data.current.container;

          await gsap.to(container, {
            duration: 0.8,
            opacity: 0,
            rotateY: 45,
            y: -100,
            scale: 0.9,
            transformOrigin: 'center center',
            ease: 'power2.inOut'
          });
        },
        enter(data) {
          const container = data.next.container;

          gsap.set(container, {
            opacity: 0,
            rotateY: -15,
            y: 100,
            scale: 0.95,
            transformOrigin: 'center center'
          });

          return gsap.to(container, {
            duration: 0.8,
            opacity: 1,
            rotateY: 0,
            y: 0,
            scale: 1,
            ease: 'power2.out'
          });
        }
      }
    ]
  });
});
