<?php
/*
Plugin Name:  Wojewodztwa Chart
Plugin URI:   https://github.com/tomaszn/wp-wojewodztwa-chart
Description:  Simple charts with Polish voivodships
Version:      20201126
Author:       Tomasz Nowak
Author URI:   https://github.com/tomaszn
License:      GPLv2 or later
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  wporg
Domain Path:  /languages
*/

function wojewodztwa_chart( $atts , $content = null ) {

	wp_enqueue_style('wojewodztwa-style', plugins_url( '/style.css', __FILE__ ));
	wp_enqueue_script('d3.v5', plugins_url( '/d3.v5.min.js', __FILE__ ));
	wp_enqueue_script('topojson.v2', plugins_url( '/topojson.v2.min.js', __FILE__ ));
	wp_enqueue_script('d3-scale-chromatic.v1', plugins_url( '/d3-scale-chromatic.v1.min.js', __FILE__ ));

	wp_register_script('wojewodztwa-script', plugins_url( '/script.js', __FILE__ ));
	wp_localize_script('wojewodztwa-script', 'plugin_url', plugins_url( '/', __FILE__));
	wp_enqueue_script( 'wojewodztwa-script' );

	$hash = crc32( serialize($atts) );
	$target = 'woj' . $hash;
	$atts['target'] = $target;
	$params = json_encode( $atts );

	// return HTML code
	return <<<EOF
<div class="wojewodztwa" id="$target">
</div>
<script>
  jQuery( document ).ready( function( $ ) {
    wojewodztwa_insert('$params');
  });
</script>
EOF;

}
add_shortcode( 'wojewodztwa_chart', 'wojewodztwa_chart' );
