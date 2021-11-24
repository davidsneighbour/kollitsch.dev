window.addEventListener('load', () => {
  // search-popup
  function searchPopup() {
    jQuery('[data-toggle="search"]').on('click', () => {
      jQuery('.search-block').fadeIn(200);
      setTimeout(() => {
        jQuery('.search-block').addClass('is-visible');
        const value = jQuery('#search-field').val();
        jQuery('#search-query').focus().val('').val(value);
      }, 250);
    });
    jQuery('[data-toggle="search-close"]').on('click', () => {
      jQuery('.search-block').fadeOut(200).removeClass('is-visible');
    });
  }
  searchPopup();

  // menuHumBurger icon toggle Init
  function menuHumBurgerIcon() {
    jQuery('.navbar-toggler').on('click', () => {
      jQuery('svg').toggleClass('d-inline d-none');
    });
  }
  menuHumBurgerIcon();

  // instafeed
  if (jQuery('#instafeed').length !== 0) {
    const accessToken = jQuery('#instafeed').attr('data-accessToken');
    // @ts-ignore
    const userFeed = new Instafeed({
      get: 'user',
      limit: 6,
      resolution: 'low_resolution',
      accessToken,
      template:
        '<div class="col-xl col-lg-2 col-md-3 col-sm-3 col-4"><a class="instagram-post" href="{{link}}" aria-label="instagram-post-link"><img loading="lazy" class="img-fluid" src="{{image}}" alt="instagram-image"></a></div>',
    });
    userFeed.run();
  }

  // Accordions
  jQuery('.collapse')
    .on('shown.bs.collapse', function showCollapse() {
      jQuery(this)
        .parent()
        .find('.fa-plus')
        .removeClass('fa-plus')
        .addClass('fa-minus');
    })
    .on('hidden.bs.collapse', function hideCollapse() {
      jQuery(this)
        .parent()
        .find('.fa-minus')
        .removeClass('fa-minus')
        .addClass('fa-plus');
    });
});
