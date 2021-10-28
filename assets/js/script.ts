import * as jQuery from "jquery";

window.addEventListener('load', function () {
    'use strict';

    // header sticky
    jQuery(window).scroll(function () {
      if (jQuery(window).scrollTop() >= 50) {
        jQuery('.header-nav').addClass('header-sticky-top');
      } else {
        jQuery('.header-nav').removeClass('header-sticky-top');
      }
    });

    // search-popup
    function searchPopup() {
      jQuery('[data-toggle="search"]').on('click', function () {
        jQuery('.search-block').fadeIn(200);
        setTimeout(function () {
          jQuery('.search-block').addClass('is-visible');
          var value = jQuery('#search-field').val();
          jQuery('#search-query').focus().val('').val(value);
        }, 250);
      });
      jQuery('[data-toggle="search-close"]').on('click', function () {
        jQuery('.search-block').fadeOut(200).removeClass('is-visible');
      });
    }
    searchPopup();

    // menuHumBurger icon toggle Init
    function menuHumBurgerIcon() {
      jQuery('.navbar-toggler').on('click', function () {
        jQuery('svg').toggleClass('d-inline d-none');
      });
    }
    menuHumBurgerIcon();

    // instafeed
    if ((jQuery('#instafeed').length) !== 0) {
      var accessToken = jQuery('#instafeed').attr('data-accessToken');
      // @ts-ignore
      var userFeed = new Instafeed({
        get: 'user',
        limit: 6,
        resolution: 'low_resolution',
        accessToken: accessToken,
        template: '<div class="col-xl col-lg-2 col-md-3 col-sm-3 col-4"><a class="instagram-post" href="{{link}}" aria-label="instagram-post-link"><img loading="lazy" class="img-fluid" src="{{image}}" alt="instagram-image"></a></div>'
      });
      userFeed.run();
    }

    // Accordions
    jQuery('.collapse').on('shown.bs.collapse', function () {
      jQuery(this).parent().find('.fa-plus').removeClass('fa-plus').addClass('fa-minus');
    }).on('hidden.bs.collapse', function () {
      jQuery(this).parent().find('.fa-minus').removeClass('fa-minus').addClass('fa-plus');
    });
});
