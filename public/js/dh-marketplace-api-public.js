(function ($) {
    'use strict';

    $(document).ready(function () {

        $('.dh-tab-description-text').text(getDescription('core'));
        
        
        function getDescription(view) {
            var text = "";
            if(view === "overview") {
                //get overview description
                text = $('.tab-community-description-text').text();
            } else {
                //get core description
                text = $('.tab-core-description-text').text();
            }
            return text;
        }


        $('ul.dh-tabs li').click(function () {
            var tab_id = $(this).attr('data-tab');
            $('ul.dh-tabs li').removeClass('current');
            $('.dh-tab-content').removeClass('current');

            $(this).addClass('current');
            $("#" + tab_id).addClass('current');
            if(tab_id === "dh-tab-1") {
                $('.dh-tab-description-text').text(getDescription('overview'));
                $('#dhma-count').show();
                $('#dhma-count-core').hide();
                $('.dhma-search-field-two.core').hide();
                $('.dhma-search-field-two.overview').show();
            }else {
                $('.dh-tab-description-text').text(getDescription('core'));
                $('#dhma-count').hide();
                $('#dhma-count-core').show();
                $('.dhma-search-field-two.core').show();
                $('.dhma-search-field-two.overview').hide();
            }
        });
    });

})(jQuery);
