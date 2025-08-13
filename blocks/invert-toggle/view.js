/*! GAIA invert view (no DOM creation) */
(function(){
  var KEY = 'gaia_invert_colors';

  function get(){ try{return localStorage.getItem(KEY)==='1';}catch(e){return false;} }
  function set(v){ try{localStorage.setItem(KEY, v?'1':'0');}catch(e){} }
  function apply(v){
    if (!document.body) return;
    if (v) document.body.classList.add('invert-colors');
    else document.body.classList.remove('invert-colors');
  }
  function bind(){
    var btn = document.querySelector('.invert-toggle');
    if (!btn) return;

    // stato iniziale
    apply(get());
    var on = document.body.classList.contains('invert-colors');
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? 'Invert ON' : 'Invert OFF';

    if (btn.__gaiaBound) return;
    btn.__gaiaBound = true;

    btn.addEventListener('click', function(e){
      e.preventDefault();
      var next = !document.body.classList.contains('invert-colors');
      apply(next); set(next);
      btn.setAttribute('aria-pressed', next ? 'true' : 'false');
      btn.textContent = next ? 'Invert ON' : 'Invert OFF';
    });
  }

  function mount(){ apply(get()); bind(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, {once:true});
  } else { mount(); }

  // Barba compat
  if (window.barba && window.barba.hooks){
    try{
      window.barba.hooks.once(mount);
      window.barba.hooks.afterEnter(mount);
      window.barba.hooks.after(mount);
    }catch(e){}
  }
})();
