<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://https://www.oeaw.ac.at/acdh/
 * @since      1.0.0
 *
 * @package    Dh_Marketplace_Api
 * @subpackage Dh_Marketplace_Api/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Dh_Marketplace_Api
 * @subpackage Dh_Marketplace_Api/includes
 * @author     ACDH-CH <acdh-ch-helpdesk@oeaw.ac.at>
 */
class Dh_Marketplace_Api_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'dh-marketplace-api',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
