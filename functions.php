<?php
/**
 * GAIA child – functions
 * - Enqueue puliti (CSS/JS) con versioning
 * - Font Cardinal Fruit (front-end + editor)
 * - p5.js + sketch
 * - GSAP + Barba + transizioni (senza doppioni)
 * - Scroll-columns
 * - Script opzionali: fade-columns, move-gallery (solo single)
 * - Menu/supports e CPT Collaboration
 */

/* ---------------------------------------------
 * Theme supports + menu
 * -------------------------------------------*/
add_action('after_setup_theme', function () {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('wp-block-styles');

  register_nav_menus([
    'primary' => __('Primary Menu', 'gaia'),
  ]);
});

/* ---------------------------------------------
 * Enqueue: CSS + JS (front-end)
 * -------------------------------------------*/
add_action('wp_enqueue_scripts', function () {
  $uri = get_stylesheet_directory_uri();
  $dir = get_stylesheet_directory();

  // 1) Parent + Child CSS
  wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css', [], null);
  $child_css = $dir . '/style.css';
  wp_enqueue_style(
    'child-style',
    $uri . '/style.css',
    ['parent-style'],
    file_exists($child_css) ? filemtime($child_css) : null
  );


  $invert_css = $dir . '/css/invert.css';
  if (file_exists($invert_css)) {
    wp_enqueue_style(
      'gaia-invert-css',
      $uri . '/css/invert.css',
      ['child-style'], // dopo lo stile base
      filemtime($invert_css)
    );
  }

  

  // 2) Font: Cardinal Fruit (front-end)
  wp_enqueue_style(
    'cardinal-fruit',
    'https://db.onlinewebfonts.com/c/2bfe809f5a433474ec388de3ccb69e73?family=Cardinal+Fruit+Medium',
    [],
    null
  );


  

  // 3) Scroll columns (misura header/footer + --group-h)
  $scroll_js = $dir . '/js/scroll-columns.js';
  if (file_exists($scroll_js)) {
    wp_enqueue_script(
      'gaia-scroll-columns',
      $uri . '/js/scroll-columns.js',
      [],
      filemtime($scroll_js),
      true
    );
  }

  // 4) p5.js + p5.sound + sketch.js (attualmente disattivati)
  // $sketch = $dir . '/js/sketch.js';
  // wp_enqueue_script('p5-js',    'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js', [], null, true);
  // wp_enqueue_script('p5-sound', 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/addons/p5.sound.min.js', ['p5-js'], null, true);
  // wp_enqueue_script('gaia-sketch', $uri . '/js/sketch.js', ['p5-js','p5-sound'], file_exists($sketch) ? filemtime($sketch) : null, true);
  // wp_localize_script('gaia-sketch', 'themeData', ['themeUrl' => $uri]);

  // 5) GSAP + Barba + transizione (sceglie il primo file disponibile, evita doppioni)
  wp_enqueue_script('gsap',  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', [], null, true);
  wp_enqueue_script('barba', 'https://unpkg.com/@barba/core', [], null, true);

  $transition_candidates = [
    '/js/page-transitions.js',
    '/js/page-fly-rotate.js',
    '/js/page-flip.js',
  ];
  foreach ($transition_candidates as $rel) {
    $full = $dir . $rel;
    if (file_exists($full)) {
      wp_enqueue_script(
        'gaia-page-transitions',
        $uri . $rel,
        ['gsap', 'barba'],
        filemtime($full),
        true
      );
      break;
    }
  }

  // 6) Fade columns (se presente)
  $fade = $dir . '/js/fade-columns.js';
  if (file_exists($fade)) {
    wp_enqueue_script('gaia-fade-columns', $uri . '/js/fade-columns.js', [], filemtime($fade), true);
  }

  // 7) Move gallery to column (solo single)
  if (is_single()) {
    $move = $dir . '/js/move-gallery-to-column.js';
    if (file_exists($move)) {
      wp_enqueue_script('gaia-move-gallery', $uri . '/js/move-gallery-to-column.js', [], filemtime($move), true);
    }
  }

  // 8) Hover preview (immagine on hover) — FILE: /js/hover-preview.js
  $hover_rel = '/js/hover-preview.js';
  $hover_abs = $dir . $hover_rel;

  if (file_exists($hover_abs)) {
    wp_enqueue_script(
      'gaia-hover-preview',
      $uri . $hover_rel,
      ['barba'],                 // dipende da Barba (già enqueued)
      filemtime($hover_abs),
      true                       // in footer
    );
    wp_add_inline_script('gaia-hover-preview', 'console.log("gaia-hover-preview loaded");');
  } else {
    add_action('wp_footer', function() use ($hover_rel) {
      echo "\n<!-- MISSING FILE: {$hover_rel} (controlla percorso nel tema child) -->\n";
    }, 99);
  }


  add_action('wp_enqueue_scripts', function () {
  // Carica il JS in footer, dopo tutto (niente dipendenze particolari)
  wp_enqueue_script(
    'gaia-audio',
    get_stylesheet_directory_uri() . '/assets/js/gaia-audio.js',
    [],
    filemtime( get_stylesheet_directory() . '/assets/js/gaia-audio.js' ),
    true
  );
});

  // 8b) Audio
  $audio_js = $dir . '/js/audio-toggle.js';
  if (file_exists($scroll_js)) {
    wp_enqueue_script(
      'gaia-audio-toggle',
      $uri . '/js/audio-toggle.js',
      [],
      filemtime($audio_js),
      true
    );
  }

  // 9) Invert toggle — FILE: /js/invert.js (dipende da Barba)
  $invert_rel = '/js/invert.js';
  $invert_abs = $dir . $invert_rel;
  if (file_exists($invert_abs)) {
    wp_enqueue_script(
      'gaia-invert',
      $uri . $invert_rel,
      ['barba'], // così window.barba è già disponibile
      filemtime($invert_abs),
      true
    );
  } else {
    add_action('wp_footer', function() use ($invert_rel) {
      echo "\n<!-- MISSING FILE: {$invert_rel} (controlla percorso nel tema child) -->\n";
    }, 99);
  }

}, 20);

/* ---------------------------------------------
 * Font nel block editor (Cardinal anche in editor)
 * -------------------------------------------*/
add_action('enqueue_block_editor_assets', function () {
  wp_enqueue_style(
    'cardinal-fruit-editor',
    'https://db.onlinewebfonts.com/c/2bfe809f5a433474ec388de3ccb69e73?family=Cardinal+Fruit+Medium',
    [],
    null
  );
});

/* ---------------------------------------------
 * (Opzionale) Categoria pattern "GAIA"
 * -------------------------------------------*/
add_action('init', function () {
  if (function_exists('register_block_pattern_category')) {
    register_block_pattern_category('gaia', ['label' => __('GAIA', 'gaia')]);
  }
});

/* ---------------------------------------------
 * Body class passthrough (se ti serve averlo)
 * -------------------------------------------*/
add_filter('body_class', function ($classes) {
  return $classes;
});

/* ---------------------------------------------
 * CPT: Collaboration (identico al tuo)
 * -------------------------------------------*/
add_action('init', function() {
  register_post_type('collaboration', array(
    'labels' => array(
      'name' => 'Collaborations',
      'singular_name' => 'Collaboration',
      'menu_name' => 'Collaborations',
      'all_items' => 'Tutti/e gli/le Collaborations',
      'edit_item' => 'Modifica Collaboration',
      'view_item' => 'Visualizza Collaboration',
      'view_items' => 'Visualizza Collaborations',
      'add_new_item' => 'Aggiungi nuovo/a Collaboration',
      'add_new' => 'Aggiungi nuovo/a Collaboration',
      'new_item' => 'Nuovo/a Collaboration',
      'parent_item_colon' => 'Collaboration genitore:',
      'search_items' => 'Cerca Collaborations',
      'not_found' => 'Non abbiamo trovato collaborations',
      'not_found_in_trash' => 'Non ci sono collaborations nel cestino',
      'archives' => 'Archivi Collaboration',
      'attributes' => 'Attributi Collaboration',
      'insert_into_item' => 'Inserisci in collaboration',
      'uploaded_to_this_item' => 'Caricato in questo/a collaboration',
      'filter_items_list' => 'Filtrare l\'elenco di collaborations',
      'filter_by_date' => 'Filtra collaborations per data',
      'items_list_navigation' => 'Navigazione elenco Collaborations',
      'items_list' => 'Elenco Collaborations',
      'item_published' => 'Collaboration pubblicato/a.',
      'item_published_privately' => 'Collaboration pubblicato/a privatamente.',
      'item_reverted_to_draft' => 'Collaboration riconvertito/a in bozza.',
      'item_scheduled' => 'Collaboration programmato/a.',
      'item_updated' => 'Collaboration aggiornato/a.',
      'item_link' => 'Link Collaboration',
      'item_link_description' => 'Un link a un/a collaboration.',
    ),
    'public' => true,
    'hierarchical' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-editor-paste-word',
    'supports' => ['title','author','editor','excerpt','thumbnail','custom-fields'],
    'taxonomies' => ['post_tag'],
    'has_archive' => true,
    'rewrite' => ['feeds' => false],
    'delete_with_user' => false,
  ));
});

// GAIA: Blocco "Invert Colors Toggle"
add_action('init', function () {
  // JS di view (se vuoi che il blocco usi lo stesso script, puoi anche puntare qui a /js/invert.js)
  $js_rel  = '/js/view.js';
  $js_path = get_stylesheet_directory() . $js_rel;
  $js_url  = get_stylesheet_directory_uri() . $js_rel;

  wp_register_script(
    'gaia-invert-view',
    $js_url,
    [], // opzionale: ['barba']
    file_exists($js_path) ? filemtime($js_path) : null,
    true
  );

  // CSS del bottone (oppure metti le regole nel tuo style.css e salta questo)
  $css_rel  = '/css/invert-toggle.css';
  $css_path = get_stylesheet_directory() . $css_rel;
  $css_url  = get_stylesheet_directory_uri() . $css_rel;

  if (file_exists($css_path)) {
    wp_register_style(
      'gaia-invert-style',
      $css_url,
      [],
      filemtime($css_path)
    );
  }

  // Registra il blocco server-rendered
  register_block_type( get_stylesheet_directory() . '/blocks/invert-toggle' );
});
