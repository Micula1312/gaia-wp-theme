document.addEventListener('DOMContentLoaded', () => {
  // Inizializza solo una volta
  if (window.__barbaInitialized) return;
  window.__barbaInitialized = true;

  barba.init({
    transitions: [
      {
        name: 'page-flip',
        async leave(data) {
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

          tl.set(data.current.container, { transformOrigin: "top left" });

          await tl.to(data.current.container, {
            rotateY: 90,
            duration: 0.6,
            opacity: 0,
            transformPerspective: 1000,
            transformStyle: "preserve-3d"
          });
        },
        enter(data) {
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

          gsap.set(data.next.container, {
            rotateY: -90,
            opacity: 0,
            transformPerspective: 1000,
            transformStyle: "preserve-3d"
          });

          return tl.to(data.next.container, {
            rotateY: 0,
            opacity: 1,
            duration: 0.6
          });
        }
      }
    ]
  });
});
