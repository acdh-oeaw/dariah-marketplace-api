<?php

require_once __DIR__ . '/vendor/autoload.php';
require plugin_dir_path(__FILE__) . 'src/Helper/ApiCall.php';

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://https://www.oeaw.ac.at/acdh/
 * @since             1.0.0
 * @package           Dh_Marketplace_Api
 *
 * @wordpress-plugin
 * Plugin Name:       Dariah Marketplace API
 * Plugin URI:        https://dariah.eu
 * Description:       marketplace-api.sshopencloud.eu marketplace API plugin for the Dariah website.
 * Version:           1.0.0
 * Author:            ACDH-CH
 * Author URI:        https://https://www.oeaw.ac.at/acdh/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       dh-marketplace-api
 * Domain Path:       /languages
 */
// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('DH_MARKETPLACE_API_VERSION', '1.0.0');
define("PLUGIN_DIR", plugin_dir_path(__FILE__));

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-dh-marketplace-api-activator.php
 */
function activate_dh_marketplace_api() {
    require_once plugin_dir_path(__FILE__) . 'includes/class-dh-marketplace-api-activator.php';
    Dh_Marketplace_Api_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-dh-marketplace-api-deactivator.php
 */
function deactivate_dh_marketplace_api() {
    require_once plugin_dir_path(__FILE__) . 'includes/class-dh-marketplace-api-deactivator.php';
    Dh_Marketplace_Api_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_dh_marketplace_api');
register_deactivation_hook(__FILE__, 'deactivate_dh_marketplace_api');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-dh-marketplace-api.php';

function addApi_scripts() {
    $wp_scripts = wp_scripts();
    wp_enqueue_style('jquery_ui_css', 'https://ajax.googleapis.com/ajax/libs/jqueryui/' . $wp_scripts->registered['jquery-ui-core']->ver . '/themes/flick/jquery-ui.css');
    wp_enqueue_script('addapi-script', plugin_dir_url(__FILE__) . '/public/js/api-request.js', array('jquery', 'jquery-ui-core', 'jquery-ui-autocomplete'));
    wp_localize_script('addapi-script', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
}


function dhma_overview_search_widget() {
    return '<div class="sb_widget widget_rss">'
            . '<h3>Search</h3>'
            . '<div class="dhma-search-field" >'
            . '<div class="dhma-search-field-one" style="text-align: left;">'
            . '<input type="text" placeholder="Search.." id="toolsSearchInput" style="max-width:250px;">'
            . '</div>'
            . '<div class="dhma-search-field-one" style="text-align: center; padding-top: 10px;">'
            . '<a href="#" class="rd_normal_bt small_rd_bt rda_fadeInUp animated fadeInUp" style="border: 1px solid; margin-left: 5px;" id="toolsSearchBtn">Search</a>'
            . '</div>'
            . '<div class="dhma-search-field-one" style="text-align: center; padding-top: 10px;">'
            . '<a href="#" class="rd_normal_bt small_rd_bt rda_fadeInUp animated fadeInUp" style="border: 1px solid; margin-left: 5px;" id="toolsResetSearchBtn">Reset Filters</a>'
            . '</div>'
            . '<div class="dhma-search-field-two core" id="">'
            . '<br><section><h4>Actors:</h4> <div id="actor-list-core" style="width: 250px;"></div></section>'
            . '&nbsp;<section><h4>Actvitiy:</h4> <div id="activity-list-core" style="width: 250px;"></div></section>'
            . '&nbsp;<section><h4>Category:</h4> <div id="category-list-core" style="width: 250px;"></div></section>'
            . '</div>'
            . '<div class="dhma-search-field-two overview" id="">'
            . '<br><section><h4>Actors:</h4> <div id="actor-list" style="width: 250px;"></div></section>'
            . '&nbsp;<section><h4>Actvitiy:</h4> <div id="activity-list" style="width: 250px;"></div></section>'
            . '&nbsp;<section><h4>Category:</h4> <div id="category-list" style="width: 250px;"></div></section>'
            . '</div>'
            . '</div>'
            . '</div><br>'
            ;
}

function dhma_overview() {
    return '<ul class="dh-tabs">
                <li class="dh-tab-link current" data-tab="dh-tab-2">Core services</li>
		<li class="dh-tab-link" data-tab="dh-tab-1">Community Services</li>
            </ul>'
            . '<div id="wrapper" class="dh-tab-count-wrapper">'
                . '<div class="dh-tab-description">'
                    . '<div class="dh-tab-description-div">'
                        . '<span class="dh-tab-description-text"></span>'
                    .'</div>'
                    . '<div id="dhma-count" style="display: none;"></div>'
                    . '<div id="dhma-count-core" ></div>'
                    . '<div id="dhma-sidebar-div" style=""><a href="#" class="dhma_sidebar_hide_btn" id="dhma-sidebar-hide">Hide Sidebar</a></div>'
                .'</div>'
            .'</div>'
           
               
            . '<div id="dh-tab-2" class="dh-tab-content current">'
                . '<div id="dhma-overview-core-div" class="list-category" style="text-align: center; margin-left: 0px; padding-left: 0px;">'
                    . '<ul id="dhma-ul-list-core" class="dh-list" style="margin-left: 0px; padding-left: 0px;"></ul>'
                . '</div>'
            . '</div>'
            . '<div id="dh-tab-1" class="dh-tab-content ">'
                . '<div id="dhma-overview-div" class="list-category" style="text-align: center;">'
                    . '<ul id="dhma-ul-list" class="dh-list"></ul>'
                . '</div>'
            . '</div>'
            . '</div>';
}

function dhma_detail() {
    return '<div id="dhma-detail-div" style="text-align: center;"></div>';
}

// Register shortcode
add_shortcode('dhma_overview_search_widget', 'dhma_overview_search_widget');
add_shortcode('dhma_overview', 'dhma_overview');
add_shortcode('dhma_detail', 'dhma_detail');

function ajax_overviewProcess() {
    $api = new \dhma\Helper\ApiCall(PLUGIN_DIR);
    $opt = [];
    if(isset( $_POST['page'])) {
        $opt['page'] =  $_POST['page'];
    }
    if(isset( $_POST['searchStr'])) {
        $opt['searchStr'] =  $_POST['searchStr'];
    }
    wp_send_json_success($api->getOverview($opt));
}

function ajax_detailProcess() {
    $api = new \dhma\Helper\ApiCall(PLUGIN_DIR);
    wp_send_json_success($api->getDetail($_POST['data']['id']));
}

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_dh_marketplace_api() {

    add_action('wp_enqueue_scripts', 'addApi_scripts');

    $plugin = new \Dh_Marketplace_Api();
    $plugin->run();
    add_action('wp_ajax_nopriv_overviewProcess', 'ajax_overviewProcess');
    add_action('wp_ajax_overviewProcess', 'ajax_overviewProcess');
    add_action('wp_ajax_nopriv_detailProcess', 'ajax_detailProcess');
    add_action('wp_ajax_detailProcess', 'ajax_detailProcess');
}

run_dh_marketplace_api();
