"use strict";

Shopify.theme.jsRecommendedProducts = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsRecommendedProducts = $.extend(this, Shopify.theme.getSectionData($section)); // Look for an element with class 'product-recommendations'

    var $productRecommendations = $section.find('.product-recommendations');
    /* NE compatibility */
    // These selectors can be removed in the new editor

    var $productRecommendationsContainer = $('[data-product-recommendations-container]');
    var $productRecommendationsBlock = $productRecommendationsContainer.closest('.block__recommended-products');
    /* Ends NE compatibility */

    /* NE compatibility
     * In the new editor, this can be removed
     * We can use this snippet to check if the element exists instead
     * if ($productRecommendations.length === 0) { return; }
    */
    // Hides product recommendations based on settings

    if (this.show_product_recommendations === false) {
      $productRecommendationsBlock.hide();
      return;
    }
    /* Ends NE compatibility */

    /* NE compatibility */
    // These can be removed in the new editor


    $('.recommended-products-section').show();
    $productRecommendationsBlock.show();
    /* Ends NE compatibility */
    // Selectors

    var productID = $productRecommendations.data('product-id');
    var limit = $productRecommendations.data('limit');
    /* NE compatibility */
    // Remove in new editor

    var sectionEnabled = $productRecommendations.data('enabled');
    /* Ends NE compatibility */

    /* NE compatibility
     * In NE, we will have a dynamic section ID that will need to be grabbed from the DOM like the other variables
     * const section ID = $productRecommendationsContainer.data('section-id');
     Ends NE compatibility */
    // If showing custom collection we do not want to build request url

    if (this.show_custom_collection) {
      this.showCustomCollection($section);
      return;
    } // Build request URL


    var shopURL = $productRecommendations.data('base-url'); // For NE section ID will be pulled from the DOM

    var requestUrl = "".concat(shopURL, "?section_id=product__recommendations&product_id=").concat(productID, "&limit=").concat(limit); //const requestUrl = `${shopURL}?section_id=${sectionID}&limit=${limit}&product_id=${productID}`;

    /* NE compatibility
     * In NE, this request url will need to be updated to reflect the dynamic section ID, 'section_id=' + sectionID
     Ends NE compatibility */

    $.ajax({
      type: 'GET',
      url: requestUrl,
      success: function success(data) {
        /* NE compatibility */
        // Remove in new editor
        if (!sectionEnabled) {
          $productRecommendationsContainer.empty();
          return;
        }
        /* Ends NE compatibility */


        var $recommendedProductsElement = $(data).find('.product-recommendations').html(); // Insert product list into the product recommendations container

        $productRecommendationsContainer.html($recommendedProductsElement);
        /* NE compatibility */
        // Remove in new editor

        $('.recommended-products-section').hide();
        /* Ends NE compatibility */

        Shopify.theme.jsProduct.relatedProducts(); // Initialize shopify payment buttons

        if (Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
        /* NE Compatibility */
        // Remove in new editor


        var $product = $productRecommendationsContainer.find('.thumbnail');

        if ($product.length === 0) {
          $productRecommendationsBlock.hide();
        }
        /* Ends NE compatibility */
        // Converting the currencies


        if (Currency.show_multiple_currencies) {
          Shopify.theme.currencyConverter.convertCurrencies();
        }
      }
    });
  },
  setupRecommendedVideoPlayer: function setupRecommendedVideoPlayer($section) {
    var videosInRecommendedProducts = $section.find('[data-product-recommendations-container] [data-html5-video] video, [data-product-recommendations-container] [data-youtube-video]').get(); // Only run Plyr.setup if videosInRecommendedProducts exists

    if (videosInRecommendedProducts.length > 0) {
      videosInRecommendedProductsPlayer = Plyr.setup(videosInRecommendedProducts, {
        controls: videoControls,
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: true
        },
        storage: {
          enabled: false
        }
      });

      if (videoPlayers !== null) {
        var combinedArray = videoPlayers.concat(videosInRecommendedProductsPlayer);
        videoPlayers = combinedArray;
      } else {
        videoPlayers = videosInRecommendedProductsPlayer;
      }
    }

    Shopify.theme.jsVideo.setupListeners();
  },
  showCustomCollection: function showCustomCollection($section) {
    var $recommendedProductsElement = $section.find('.product-recommendations').html();
    /* NE compatibility */
    // Update this selector to target $('.product-recommendations') instead

    var $productRecommendationsContainer = $('[data-product-recommendations-container]');
    /* Ends NE compatibility */

    $productRecommendationsContainer.html($recommendedProductsElement);
    /* NE compatibility */
    // Remove in new editor

    $('.recommended-products-section').hide();
    /* Ends NE compatibility */

    Shopify.theme.jsProduct.relatedProducts();
  },
  unload: function unload($section) {}
};