var embedBannerVideo = function(videoUrl) {
    $(window).scroll(function() {
      $('.bannerVideo').css({
        'top': ($(this).scrollTop()) - ($(this).scrollTop()         / 3) + "px"
      });
    });

  $(window).bind("load", function() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    } else {
      var banner = $('#content-wrapper #parallax-images .image-container:nth-child(1) img').first();
      
      $('<video class="bannerVideo" autoplay="" loop="" preload><source src="' + videoUrl + '" type="video/mp4"></video>').insertAfter(banner);
    }
  });    
};