<?php
/**
 * GAIA child – functions
 * Pulizia enqueue + CPT conservati
 */

add_action('after_setup_theme', function () {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('wp-block-styles');
  register_nav_menus(['primary' => __('Primary Menu', 'gaia')]);
});

/**
 * Enqueue CSS/JS (ordine controllato)
 */
add_action('wp_enqueue_scripts', function () {
  $uri = get_stylesheet_directory_uri();
  $dir = get_stylesheet_directory();

  // --- Parent + Child CSS
  wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css', [], null);
  wp_enqueue_style(
    'child-style',
    $uri . '/style.css',
    ['parent-style'],
    file_exists($dir . '/style.css') ? filemtime($dir . '/style.css') : null
  );

  // --- Cardinal Fruit (titoli)
  wp_enqueue_style(
    'cardinal-fruit',
    'https://db.onlinewebfonts.com/c/2bfe809f5a433474ec388de3ccb69e73?family=Cardinal+Fruit+Medium',
    [],
    null
  );

  // --- p5.js + p5.sound + sketch
  $sketch_path = $dir . '/js/sketch.js';
  $sketch_ver  = file_exists($sketch_path) ? filemtime($sketch_path) : null;
  wp_enqueue_script('p5-js',    'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js', [], null, true);
  wp_enqueue_script('p5-sound', 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/addons/p5.sound.min.js', ['p5-js'], null, true);
  wp_enqueue_script('sketch',    $uri . '/js/sketch.js', ['p5-js','p5-sound'], $sketch_ver, true);
  wp_localize_script('sketch', 'themeData', ['themeUrl' => $uri]);

  // --- Scroll Columns (misura header/viewport -> CSS vars)
  $scroll_js = $dir . '/js/scroll-columns.js';
  if (file_exists($scroll_js)) {
    wp_enqueue_script(
      'scroll-columns',
      $uri . '/js/scroll-columns.js',
      [],
      filemtime($scroll_js),
      true
    );
  }

  // --- GSAP + Barba + Transitions (evita doppie enqueued)
  wp_enqueue_script('gsap',  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', [], null, true);
  wp_enqueue_script('barba', 'https://unpkg.com/@barba/core', [], null, true);

  // scegli il primo file di transizioni disponibile
  $trans_candidates = [
    '/js/page-transitions.js',
    '/js/page-fly-rotate.js',
    '/js/page-flip.js'
  ];
  $transition_handle = null;
  foreach ($trans_candidates as $rel) {
    $full = $dir . $rel;
    if (file_exists($full)) {
      $transition_handle = 'page-transitions';
      wp_enqueue_script(
        $transition_handle,
        $uri . $rel,
        ['gsap', 'barba'],
        filemtime($full),
        true
      );
      break;
    }
  }

  // --- Fade columns effect (se presente)
  $fade_js = $dir . '/js/fade-columns.js';
  if (file_exists($fade_js)) {
    wp_enqueue_script(
      'fade-columns',
      $uri . '/js/fade-columns.js',
      [],
      filemtime($fade_js),
      true
    );
  }

  // --- Move gallery into column (solo sui single)
  if (is_single()) {
    $move_js = $dir . '/js/move-gallery-to-column.js';
    if (file_exists($move_js)) {
      wp_enqueue_script(
        'move-gallery',
        $uri . '/js/move-gallery-to-column.js',
        [],
        filemtime($move_js),
        true
      );
    }
  }
}, 20);

/**
 * Body class passthrough (lo mantengo come avevi)
 */
add_filter('body_class', function($classes) { return $classes; });

/**
 * CUSTOM POST TYPE: Collaboration (invariato)
 */
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
