(function ($) {
    'use strict';
    let pluginUrl = "/wp-content/plugins/dh-marketplace-api/";
    var allData = "";
    var allDataCore = "";

    //handle the pages
    jQuery(document).ready(function ($) {
        var pageURL = $(location).attr("href");
        if (pageURL.indexOf("/tools-services/tools-and-services/?update") >= 0) {
            $('.section.def_section').css('padding-top', '10px');
            $('#posts').css('padding', '20px 0px 20px 0;');
            $('body').removeClass('page-template-default');
            $('body').addClass('page-template page-template-single-app page-template-single-app-php');
            wprequest();
        } else
        if (pageURL.indexOf("/tools-services/tools-and-services/") >= 0) {
            $('body').removeClass('page-template-default');
            $('body').addClass('page-template page-template-single-app page-template-single-app-php');
            $('.section.def_section').css('padding-top', '10px');
            //$('.page-template-single-app').css('padding', '20px;');
            $('#posts').css('padding', '20px 0px 20px 0;');
            processAPIFile();
        }
        if (pageURL.indexOf("/tools-services/tools-services-detail-view/") >= 0) {
            $('.section.def_section').css('padding-top', '10px');
            $('.page-template-single-app.def_section').css('padding', '20px;');
            let searchParams = new URLSearchParams(window.location.search);
            displayDetailView(searchParams.get('id'));
        }
    });
    
    $(document).delegate("#toolsResetSearchBtn", "click", function (e) {
        e.preventDefault();
        $('input:checkbox').removeAttr('checked');
        $('#toolsSearchInput').val('');
        doTheSearch();
    });
    
    function doTheSearch() {
        let searchStr = $('#toolsSearchInput').val();
        var actors = [];
        var activities = [];
        var categories = [];

        $('input[class="actors-chk"]:checked').each(function () {
            let category = $(this).attr("data-category");
            /*
             if (!actors[category]) {
             actors[category] = [];
             }
             
             if (this.value) {
             actors[category].push(this.value.toLowerCase());
             }*/
            let obj = {role: category, name: this.value.toLowerCase()};
            actors.push(obj);
        });

        $('input[class="activity-chk"]:checked').each(function () {
            if (this.value) {
                activities.push(this.value.toLowerCase());
            }
        });

        $('input[class="category-chk"]:checked').each(function () {
            if (this.value) {
                categories.push(this.value.toLowerCase());
            }
        });
        var view = '#dhma-overview-div';
        var viewList = 'dhma-ul-list';
        if($('.dh-tab-link.current').data('tab') === "dh-tab-2") {
            view = '#dhma-overview-core-div';
            viewList = 'dhma-ul-list-core';
        }
        $(view).empty().html('<ul id="'+viewList+'" class="dh-list"></ul>');
        wpSearch(searchStr, actors, categories, activities);
        
    }
    
    $(document).delegate("#toolsSearchInput", "change", function (e) {
        e.preventDefault();
        if($(this).val().length > 2) {
            doTheSearch();
        } 
        
    });
    
    $(document).delegate(".dhma-search-field input[type=checkbox]", "change", function (e) {
        e.preventDefault();
        doTheSearch();
    });

    //submit the search criterias
    $(document).delegate("#toolsSearchBtn", "click", function (e) {
        e.preventDefault();
        doTheSearch();
    });

    //handle the filter events
    $(document).delegate(".filter-more", "click", function (e) {
        e.preventDefault();
        var view = "";
        let tabval = $('.dh-tab-link.current').data('tab');
        
        if($('.dh-tab-link.current').data('tab') === "dh-tab-2") {
            view = "-core";
        }
        let category = $(this).attr("data-category");
        if (category === "actor") {
            $('#' + category + '-list'+view+' h5.hidden-dhma-list-element').show();
        }
        $('#' + category + '-list'+view+' li.hidden-dhma-list-element').show();
        $('.dhma-' + category + '-more-less > a.filter-more').hide();
        $('.dhma-' + category + '-more-less > a.filter-less').show();
    });

    $(document).delegate(".filter-less", "click", function (e) {
        e.preventDefault();
        var view = "";
        if($('.dh-tab-link.current').data('tab') === "dh-tab-2") {
            view = "-core";
        }
        let category = $(this).attr("data-category");
        if (category == "actor") {
            $('#' + category + '-list'+view+' h5.hidden-dhma-list-element').hide();
        }
        
        $('#' + category + '-list'+view+' li.hidden-dhma-list-element').hide();
        $('.dhma-' + category + '-more-less > a.filter-more').show();
        $('.dhma-' + category + '-more-less > a.filter-less').hide();
    });

    $(document).delegate("#dhma-sidebar-hide", "click", function (e) {
        e.preventDefault();
        if ($(this).hasClass('dhma_sidebar_hide_btn')) {
            $('.right_sb.business_sidebar.dhma_tool_sidebar').hide();
            $('.left_posts.business_posts.dariah_tool').addClass('wm-100');
            $('.left_posts.business_posts.dariah_tool').addClass('w-100');
            $(this).text('Show Sidebar');
            $(this).removeClass('dhma_sidebar_hide_btn');
            $(this).addClass('dhma_sidebar_show_btn');
        } else {
            $('.right_sb.business_sidebar.dhma_tool_sidebar').show();
            $('.left_posts.business_posts.dariah_tool').removeClass('wm-100');
            $('.left_posts.business_posts.dariah_tool').removeClass('w-100');
            $(this).text('Hide Sidebar');
            $(this).addClass('dhma_sidebar_hide_btn');
            $(this).removeClass('dhma_sidebar_show_btn');
        }
    });

    function processAPIFile() {
        
        var loaderContainer = $('<span/>', {
            'class': 'loader-image-container'
        }).appendTo('#dhma-overview-core-div');

        var loader = $('<img/>', {
            src: '/wp-admin/images/loading.gif',
            'class': 'loader-image'
        }).appendTo(loaderContainer);

        $.getJSON(pluginUrl + 'api-data.json', function (json, status, xhr) {
            let lastModified = xhr.getResponseHeader('Last-Modified');
            let today = new Date();
            let creationDate = new Date(lastModified);

            if ((new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)) < creationDate)
            {
                wprequest();
            } else {
                allData = json.overview;
                allDataCore = json.core;
                loaderContainer.remove();
                displayFileContent(json.overview, 'overview');
                displayFileContent(json.core, 'core');
            }
            let count = json.overview.items.length;
            let countCore = json.core.items.length;
            $('#dhma-count').html("<span class='dh_num_of_tools'>Number of Tools and Services: " + count + " </span>");
            $('#dhma-count-core').html("<span class='dh_num_of_tools'>Number of Tools and Services: " + countCore + " </span>");

        }).fail(function (error, status, xhr) {
            loaderContainer.remove();
            if (xhr === "Not Found") {
                $('#dhma-overview-div').html('Please regenerate data json!');
                $('#dhma-overview-core-div').html('Please regenerate data json!');
            } else {
                $('#dhma-overview-div').html('Tools And Servies List is empty!');
                $('#dhma-overview-core-div').html('Tools And Servies List is empty!');
            }
        });
    }
    
    function displayFileContent(json, view) {
        updateActors(view);
        updateActivityCategory(view);
        createList(json, view);
    }

    function updateActors(view) {
        var dataset = allData;
        var actorId = "#actor-list";
        if(view === "core") {
            dataset = allDataCore;
            actorId = "#actor-list-core";
        }
        
        var actors = {};
        $.each(dataset.items, function (index, obj) {
            if (obj.contributors) {
                $.each(obj.contributors, function (i, actor) {
                    let role = actor.role.code;
                    if (!actors[role]) {
                        actors[role] = [];
                    }
                    if (actor.actor.name !== 'DARIAH-EU') {
                        var actorsStr = $.inArray(actor.actor.name, actors[role]);
                        if (actorsStr === -1) {
                            actors[role].push(actor.actor.name);
                        }
                    }
                });
            }
        });

        var $el = $(actorId);
        $el.empty();
        $el.append("<ul>");
        var i = 0;
        let hidden = "style='display: none;'";

        $.each(actors, function (key, value) {
            if(key === 'reviewer') {
                if (i < 5) {
                    $el.append("<h5 style='text-transform: capitalize;'>DARIAH national node</h5>");
                } else {
                    $el.append("<h5 style='text-transform: capitalize; display: none;' class='hidden-dhma-list-element'>DARIAH national node</h5>");
                }
                value = value.sort();
                $.each(value, function (k, v) {
                    if (i > 5) {
                        $el.append($("<li " + hidden + " class='hidden-dhma-list-element'><input class='actors-chk' name='actors' type='checkbox' data-category='" + key + "' value='" + v.toLowerCase() + "' id='actorschk_" + k + "'> <label for='actorschk_" + k + "'>" + v + "</label></li>"));
                    } else {
                        $el.append($("<li><input class='actors-chk' name='actors' type='checkbox' value='" + v.toLowerCase() + "' data-category='" + key + "' id='actorschk_" + k + "'> <label for='actorschk_" + k + "'>" + v + "</label></li>"));
                    }
                    i++;
                });
            }
        });
        $el.append("</ul>");
        $el.append("<div class='dhma-actor-more-less'><a class='filter-more' data-category='actor' href='#'>+ More</a><a class='filter-less' href='#' data-category='actor'>- Less</a></div>");
    }

    function updateActivityCategory(view) {
        var activities = [];
        var categories = [];
        var dataset = allData;
        var activityId = "#activity-list";
        var categoryId = "#category-list";
        if(view === "core") {
            dataset = allDataCore;
            activityId = "#activity-list-core";
            categoryId = "#category-list-core";
        }
      
        $.each(dataset.items, function (index, obj) {
            if (obj.properties) {
                $.each(obj.properties, function (i, prop) {
                    if (prop.type.code === "activity") {
                        var activityStr = $.inArray(prop.concept.label, activities);
                        if (activityStr == -1) {
                            activities.push(prop.concept.label);
                        }
                    }
                    if (prop.type.code === "resource-category") {
                        var catStr = $.inArray(prop.concept.label, categories);
                        if (catStr == -1) {
                            categories.push(prop.concept.label);
                        }
                    }
                });
            }
        });
        activities = activities.sort();
        var $el = $(activityId);
        $el.empty();
        $el.append("<ul>");
        var i = 0;
        let hidden = "style='display: none;'";
        $.each(activities, function (key, value) {
            if (i > 5) {
                $el.append($("<li " + hidden + " class='hidden-dhma-list-element'><input class='activity-chk' name='activity' type='checkbox' value='" + value.toLowerCase() + "'> <label>" + value + "</label></li>"));
            } else {
                $el.append($("<li><input class='activity-chk' name='activity' type='checkbox' value='" + value.toLowerCase() + "'> <label>" + value + "</label></li>"));
            }
            i++;
        });
        $el.append("</ul>");
        $el.append("<div class='dhma-activity-more-less'><a class='filter-more' href='#' data-category='activity'>+ More</a><a class='filter-less' href='#' data-category='activity'>- Less</a></div>");

        categories = categories.sort();
        var $elc = $(categoryId);
        $elc.empty();
        $elc.append("<ul>");
        var i = 0;

        $.each(categories, function (key, value) {
            if (i > 5) {
                $elc.append($("<li " + hidden + " class='hidden-dhma-list-element'><input class='category-chk' name='category-tools' type='checkbox' value='" + value.toLowerCase() + "'> <label>" + value + "</label></li>"));
            } else {
                $elc.append($("<li><input class='category-chk' name='category-tools' type='checkbox' value='" + value.toLowerCase() + "'> <label>" + value + "</label></li>"));
            }
            i++;
        });
        $elc.append("</ul>");
        $elc.append("<div class='dhma-category-more-less'><a class='filter-more' href='#' data-category='category'>+ More</a><a class='filter-less' href='#' data-category='category'>- Less</a></div>");
    }

    /** The detail view Ajax event **/
    function displayDetailView(id) {
        var loaderContainer = $('<span/>', {
            'class': 'loader-image-container'
        }).appendTo('#dhma-detail-div');

        var loader = $('<img/>', {
            src: '/wp-admin/images/loading.gif',
            'class': 'loader-image'
        }).appendTo(loaderContainer);

        $.ajax({
            type: "POST",
            url: ajax_object.ajax_url,
            data: {
                action: 'detailProcess',
                data: {'id': id}
            },
            success: function (response) {
                if (typeof response === 'string' || response instanceof String) {
                    $("#dhma-detail-div").html('https://marketplace-api.sshopencloud.eu/ Service Temporarily Unavailable!');
                    loaderContainer.remove();
                } else {
                    var data = response.data;
                    loaderContainer.remove();
                    var jsonObj = $.parseJSON(data);
                    displayDetailViewContent(jsonObj);
                }
            },
            error: function (xhr, status, error) {
                $("#dhma-detail-div").html(xhr.responseText);
                loaderContainer.remove();
            }
        });
    }

    /** The search event and ajax **/
    function wpSearch(searchStr, actor, category, activity) {

        var view ="overview";
        if($('.dh-tab-link.current').data('tab') === "dh-tab-2") {
            view = "core";
        }
        var loaderContainer = $('<span/>', {
            'class': 'loader-image-container'
        }).appendTo('#dhma-overview-core-div');

        var loader = $('<img/>', {
            src: '/wp-admin/images/loading.gif',
            'class': 'loader-image'
        }).appendTo(loaderContainer);

        $.getJSON(pluginUrl + 'api-data.json', function (json) {
            loaderContainer.remove();
            var view = "overview";
            var jsonData = json.overview;
            if($('.dh-tab-link.current').data('tab') === "dh-tab-2") {
                jsonData = json.core;
                view = "core";
            }
            
            let result = searchContent(jsonData, searchStr, actor, category, activity);
            
            displayFileContent(result, view);
            //update the frontend with the user selected checkbox fields
            updateSelectedCheckboxes(actor, category, activity, view);
            var count = 0;
            var overviewDiv = "#dhma-overview-div";
            if(result.items !== undefined) {
                count = result.items.length;
            }
            var countView ="";
            if(view === "core") {
                countView = "-core";
                overviewDiv = "#dhma-overview-core-div";
            }
            $('#dhma-count'+countView).html("<h4>Number of Tools and Services: " + count + " </h4>");

        }).fail(function () {
            loaderContainer.remove();
            $(overviewDiv).html('Tools And Servies List is empty!');
        });
    }

    function updateSelectedCheckboxes(actor, category, activity, view) {
        
        var activityId = "#activity-list";
        var actorId = "#actor-list";
        var categoryId = "#category-list";
        if(view === "core") {
            activityId = "#activity-list-core";
            categoryId = "#category-list-core";
            actorId = "#actor-list-core";
        }
        
        $.each(actor, function (index, obj) {
            $(actorId+' li input[type=checkbox]').filter(function () {
                let category = $(this).attr("data-category");
                return (category === obj.role) && (this.value === obj.name);
            }).prop('checked', true);
        });

        $.each(category, function (index, obj) {
            $(categoryId+' li input[type=checkbox]').filter(function () {
                return this.value === obj;
            }).prop('checked', true);
        });

        $.each(activity, function (index, obj) {
            $(activityId+' li input[type=checkbox]').filter(function () {
                return this.value === obj;
            }).prop('checked', true);
        });

    }


    /* we have to compare the two array */
    var doesArrayBContainArrayA = function (a, b)
    {
        var u = [];
        a.map(e =>
        {
            var match = false;
            b.forEach(function (bx) {
                if (!match) {
                    match = JSON.stringify(bx) === JSON.stringify(e);
                }
            });
            if (!match) {
                //console.log(JSON.stringify(bx)+'--'+JSON.stringify(e));
                u.push(e);   //add non existing item to temp array
            }

        });
        return u.length === 0;
    }

    /** Filter the search values **/
    function searchContent(json, searchStr, actorArr, categoryArr, activityArr) {
        var results = json;

        if (searchStr) {
            var searchArr = [];
            searchStr = searchStr.toLowerCase();
            $.each(json.items, function (index, obj) {
                if (obj) {
                    let label = obj.label.toLowerCase();
                    if (label.indexOf(searchStr) >= 0) {
                        searchArr.push(obj);
                    }
                }
            });

            if (searchArr.length === 0) {
                return [];
            }
            results.items = searchArr;
        }

        var actors = [];
        var allactors = false;
        if (Object.entries(actorArr).length > 0 && results.items.length > 0) {
            $.each(json.items, function (index, obj) {
                var contrib = [];
                $.each(obj.contributors, function (i, o) {
                    let label = o.actor.name.toLowerCase();
                    let role = o.role.code;
                    var authObj = {role: role, name: label};
                    contrib.push(authObj);
                });
                
                if(doesArrayBContainArrayA(actorArr, contrib)) {
                    actors.push(obj);
                }
            });
            if (Object.entries(actors).length === 0) {
                results.items = [];
            }
            $.each(results.items, function (index, obj) {
                $.each(obj.contributors, function (i, o) {
                    let label = o.actor.name.toLowerCase();
                    let role = o.role.code;
                    if (jQuery.inArray(label, actorArr[role]) !== -1) {
                        actors.push(obj);
                    }
                });
            });
        }

        if (actors.length > 0 && results.items.length > 0) {
            results.items = results.items.filter(function (o1) {
                return actors.some(function (o2) {
                    return o1.id === o2.id; // return the ones with equal id
                });
            });
        }

        var categories = [];
        if (categoryArr.length > 0) {
            $.each(json.items, function (index, obj) {
                $.each(obj.properties, function (i, o) {
                    if (o.type.code === "resource-category") {
                        let label = o.concept.label.toLowerCase();
                        if ($.inArray(label, categoryArr) !== -1) {
                            categories.push(obj);
                        }
                    }
                });
            });
            if (categories.length === 0) {
                results.items = [];
            }
        }

        if (categories.length > 0 && results.items.length > 0) {
            results.items = results.items.filter(function (o1) {
                return categories.some(function (o2) {
                    return o1.id === o2.id; // return the ones with equal id
                });
            });
        }

        var activities = [];
        if (activityArr.length > 0) {
            $.each(json.items, function (index, obj) {
                $.each(obj.properties, function (i, o) {
                    if (o.type.code === "activity") {
                        let label = o.concept.label.toLowerCase();
                        if ($.inArray(label, activityArr) !== -1) {
                            activities.push(obj);
                        }
                    }
                });
            });
            if (activities.length === 0) {
                results.items = [];
            }
        }

        if (activities.length > 0 && results.items.length > 0) {
            results.items = results.items.filter(function (o1) {
                return activities.some(function (o2) {
                    return o1.id === o2.id; // return the ones with equal id
                });
            });
        }

        return results;

    }

    function wprequest() {
        var loaderContainer = $('<span/>', {
            'class': 'loader-image-container'
        }).appendTo('#dhma-overview-core-div');

        var loader = $('<img/>', {
            src: '/wp-admin/images/loading.gif',
            'class': 'loader-image'
        }).appendTo(loaderContainer);

        $.ajax({
            type: "POST",
            url: ajax_object.ajax_url,
            data: {
                action: 'overviewProcess'
            },
            success: function (response) {
                var data = response.data;
                loaderContainer.remove();
                processAPIFile();
            },
            error: function (xhr, status, error) {
                $("#dhma-overview-div").html(xhr.responseText);
                $("#dhma-overview-core-div").html(xhr.responseText);
                loaderContainer.remove();
            }
        });
    }

    /** Create the Main view list **/
    function createList(json, view) {
        
        var divId = "#dhma-overview-div";
        var listId = "#dhma-ul-list";
        if(view === "core") {
            divId = "#dhma-overview-core-div";
            listId = "#dhma-ul-list-core";
        }
        
        if (json.items === undefined || json.items.length === 0) {
            $(divId).html('<span style="color:red;">There is no data! Please refine the search criterias!</span>');
            return;
        }


        let items = json.items
                .map(value => ({value, sort: Math.random()}))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
        $.each(items, function (index, obj) {
            let persistentId = obj.persistentId;
            var shortDesc = obj.description.substring(0, 200) + "...";

            //var media = "https://www-dev.dariah.eu/wp-content/uploads/2017/02/logo.png";
            var media = "";
            if (json.thumbnail !== undefined) {
                if (json.thumbnail[persistentId]) {
                    if (json.thumbnail[persistentId].info.mediaId !== null) {
                        media = 'https://marketplace-api.sshopencloud.eu/api/media/download/' + json.thumbnail[persistentId].info.mediaId;
                    }
                }
            }
            var listText = '<li itemscope="" itemtype="http://schema.org/WebApplication" class="dh-list-item">\n\
                                <a href="/tools-services/tools-services-detail-view/?id=' + obj.persistentId + '">';
            if(media) {
                listText += '<div class="dh-list-item__image"><img src="' + media + '" ></div>';
            } else {
                listText += '<div class="dh-list-item__image"></div>';
            }
            listText += '<div class="dh-list-item__content">\n\
                                                 <h4 class="title" itemprop="name" style="text-align: justify;">' + obj.label + '</h4>\n\
                                                <p class="description" itemprop="about" style="text-align: justify;">' + shortDesc + '</p>   \n\
                                                </div>              \n\
                                                </a>\n\
                            </li>';
            $(listId).append(listText);
            
        });
    }

    function detailMainContent(obj) {
        var text = "";
        text += "<h3>" + obj.label + "</h3>";
        text += "<p>" + obj.description + "</p>";
        if (obj.media.length !== 0) {
            $.each(obj.media, function (i, o) {
                var image = o.info.mediaId;
                if (image) {
                    text += "<a href='https://marketplace-api.sshopencloud.eu/api/media/download/" + image + "' target='_blank'><img src='https://marketplace-api.sshopencloud.eu/api/media/download/" + image + "'></a><br>";
                }
            });
        }
        return text;
    }

    function detailSideBarContent(obj) {
        //resource_category, technology-readiness-level, intended_audience
        let allowed_categories = ['activity', 'keyword', 'discipline', 'language',
            'intended_audience', 'license', 'terms-of-use-url', 'resource_category',
            'technology-readiness-level'];

        var arr = {};
        var text = "<div id='rss-2' class='sb_widget widget_rss' style='text-align: left;' >";

        text += "<h3>Accessible At</h3>";
        if (obj.accessibleAt) {
            let url = obj.accessibleAt[0];
            text += "<a href='" + url + "' target='_blank'>" + url + "</a><br><br>";
        }
        text += "<a href='https://marketplace.sshopencloud.eu/tool-or-service/" + obj.persistentId + "' target='_blank'>https://marketplace.sshopencloud.eu/tool-or-service/" + obj.persistentId + "</a><br>";
        text += "<br>";

        text += "<h3>Details</h3>";

        var actorsArr = [];
        $.each(obj.properties, function (index, val) {
            if (val.type.groupName && val.concept) {
                var values = {
                    'label': val.type.label,
                    'concept': {'label': val.concept.label, 'url': val.concept.uri, 'definition': val.concept.definition}
                };
                //arr.push(values);
                let code = val.type.code;
                if (code in arr === false) {
                    arr[code] = [];
                    arr[code].push(values);
                } else {
                    arr[code].push(values);
                }
            }
        });
        text += "<table style='border-collapse: separate; border-spacing: 0 8px;'>";
        $.each(arr, function (key, value) {
            if (jQuery.inArray(key, allowed_categories) !== -1) {
                text += "<tr>";
                text += "<td width='40%;' >";
                text += "<span style='font-weight: bold;'>" + value[0].label + ': </span>';
                text += "</td>";
                text += "<td width='60%;'>";
                $.each(value, function (k, v) {
                    var alt = "";
                    if (v.concept.definition !== undefined) {
                        alt = v.concept.definition;
                    }
                    text += "<span><a href='" + v.concept.url + "' title='" + alt + "'>" + v.concept.label + "</a></span>, ";
                });
                text = text.slice(0, -2);
                text += "<br>";
                text += "</td>";
                text += "</tr>";
            }
        });
        text += "</table>";

        actorsArr['provider'] = [];
        actorsArr['contact'] = [];
        actorsArr['reviewer'] = [];
        actorsArr['curator'] = [];
        var actorsVal = false;
        $.each(obj.contributors, function (index, val) {
            if (val.role.code == 'provider') {
                actorsVal = true;
                actorsArr['provider'].push(val);
            }
            if (val.role.code == 'contact') {
                actorsVal = true;
                actorsArr['contact'].push(val);
            }
            if (val.role.code == 'reviewer') {
                actorsVal = true;
                actorsArr['reviewer'].push(val);
            }
            if (val.role.code == 'curator') {
                actorsVal = true;
                actorsArr['curator'].push(val);
            }
        });
        if (actorsVal === true) {
            text += "<br><h3>Actor(s)</h3>";
            text += displayActors('provider', actorsArr);
            text += displayActors('contact', actorsArr);
            text += displayActors('reviewer', actorsArr);
            text += displayActors('curator', actorsArr);
        }
        text += "</div>";
        return text;
    }

    function displayActors(key, array) {
        var string = "";
        $.each(array[key], function (index, val) {
            string += '<span style="display:inline-block; margin-bottom: 10px;">' + val.actor.name + ' (' + val.role.label + ')</span><br>';
        });
        return string;
    }

    function displayDetailViewContent(obj) {
        var text = "";
        text += "<div class='wrapper section_wrapper'>";
        text += "<div id='posts' class='left_posts business_posts' style='text-align: justify;'>";
        text += detailMainContent(obj);
        text += "</div>";

        text += "<div id='sidebar' class='right_sb business_sidebar'>";
        text += detailSideBarContent(obj);
        text += "</div>";
        text += "</div>";

        $('#dhma-detail-div').html(text);
    }


})(jQuery);
