var gbPlayer;
  var ctaShown = false;
  var ctaInterval;

  function onYouTubeIframeAPIReady() {
    gbPlayer = new YT.Player('gb-player', {
      videoId: 'd8fja9R0co4',
      playerVars: {
        autoplay: 0,
        controls: 1,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: function() {
          jQuery('.gb-play-video').removeClass('disabled').css('pointer-events', 'auto');
        },
        onStateChange: function(e) {
          if (e.data === YT.PlayerState.PLAYING && !ctaShown) {
            if (ctaInterval) clearInterval(ctaInterval);
            ctaInterval = setInterval(function() {
              if (!gbPlayer || ctaShown) return;
              var t = gbPlayer.getCurrentTime();
              if (t >= 30) {
                ctaShown = true;
                clearInterval(ctaInterval);
                jQuery('#gbOpenCta').addClass('visible');
              }
            }, 1000);
          }
        }
      }
    });
  }

(function($) {
  var GB_BASE = '/wp-content/uploads/2026/03/index.html';

  function gbStarUrl(n) {
    if (n === 28)           return GB_BASE + '/0028_1_2_1x.webp';
    if (n >= 29 && n <= 68) return GB_BASE + '/00' + n + '_1_3_1x.webp';
    if (n >= 69 && n <= 72) return GB_BASE + '/00' + n + '_1_2_1x.webp';
    if (n >= 73 && n <= 80) return GB_BASE + '/00' + n + '_1_1_1x.webp';
    return GB_BASE + '/00' + n + '_1_1_1x.webp';
  }
  function gbLeftArmUrl(n) {
    if (n <= 27) return GB_BASE + '/00' + n + '_1.webp';
    if (n === 28) return GB_BASE + '/0028_1-1.webp';
    return GB_BASE + '/00' + n + '_1-2.webp';
  }
  function gbRightArmUrl(n) { return GB_BASE + '/00' + n + '_1-1.webp'; }
  function gbIsMobile()     { return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); }
  function gbIsTablet()     { return /iPad|Tablet|Nexus 7|Nexus 10|KFAPWI/i.test(navigator.userAgent); }

  $(function() {

    var $preload = $('.gb-hidden-images');
    for (var i = 26; i <= 68; i++) $preload.append('<img decoding="async" src="' + gbLeftArmUrl(i) + '" alt="">');
    for (var i = 29; i <= 71; i++) $preload.append('<img decoding="async" src="' + gbRightArmUrl(i) + '" alt="">');
    for (var i = 28; i <= 80; i++) $preload.append('<img decoding="async" src="' + gbStarUrl(i) + '" alt="">');

    $preload.imagesLoaded().always(function() {
      var intervalStar;
      var allow = true;
      var generated = false;
      var handL, handR;

      $('.gb-play-video').on('click', function(e) {
        e.preventDefault();
        var $btn = $(this);
        $btn.fadeOut(300).css('pointer-events', 'none').addClass('active');
        allow = false;

        // Ocultar el rectángulo VSL preview
        $('#gbVslPreview').addClass('hidden');

        $('.gb-widget').append('<div class="gb-vhs-line"></div>').addClass('gb-glitching-active');

        var start = 28;
        $('.gb-star').css('z-index', '12');

        var glitchInterval = setInterval(function() {
          $('.gb-star').addClass('gb-glitching');
          setTimeout(function() {
            $('.gb-star').removeClass('gb-glitching');
          }, 80 + Math.random() * 120);
        }, 300 + Math.random() * 400);

        intervalStar = setInterval(function() {
          start++;
          setTimeout(function(){ $('.gb-right-arm').fadeOut(400); }, 1200);
          $('.gb-star>img').attr('src', gbStarUrl(start));

          if (start >= 80) {
            clearInterval(intervalStar);
            clearInterval(glitchInterval);

            $('.gb-star').addClass('gb-glitching');
            setTimeout(function() {
              $('.gb-star').removeClass('gb-glitching');
              $('.gb-vhs-line').remove();
              $('.gb-widget').removeClass('gb-glitching-active');

              $('.gb-widget>.gb-left-arm').fadeOut(500);
              $('.gb-widget>.gb-right-arm').fadeOut(500);
              $('.gb-star').fadeOut(300);
              $('.gb-widget>video').fadeOut(600);
              $('#gbHero').addClass('gb-hero--top');

              setTimeout(function() {
                $('#gbOpenLayout').addClass('visible');
                gbPlayer.unMute();
                gbPlayer.setVolume(100);
                gbPlayer.playVideo();
              }, 200);
            }, 100);
          }
        }, 30);
      });

      $('.gb-play-video').on('mouseenter', function(){ $('.gb-star').css('opacity','1'); });
      $('.gb-play-video').on('mouseleave', function(){
        if (!$(this).hasClass('active')) $('.gb-star').css('opacity','0');
      });

      $(window).on('resize', function() {
        if ($(window).width() > 1440) {
          generated = false; allow = true;
          clearInterval(handL); clearInterval(handR);
        } else if (gbIsMobile() || gbIsTablet()) {
          generateAnimation();
        }
      });
      if ($(window).width() < 1440 && (gbIsMobile() || gbIsTablet())) generateAnimation();

      function generateAnimation() {
        if (generated) return;
        allow = false; generated = true;
        if (handL) clearInterval(handL);
        if (handR) clearInterval(handR);
        var lTime = 2500 / 43, rTime = 2500 / 43;
        var lStart = 26, rStart = 29, revL = false, revR = false;
        handL = setInterval(function() {
          if (!revL) { lStart++; if (lStart >= 68) revL = true; }
          else { lStart--; if (lStart <= 26) revL = false; }
          $('.gb-left-arm>img').attr('src', gbLeftArmUrl(lStart));
        }, lTime);
        handR = setInterval(function() {
          if (!revR) { rStart++; if (rStart >= 71) revR = true; }
          else { rStart--; if (rStart <= 29) revR = false; }
          $('.gb-right-arm>img').attr('src', gbRightArmUrl(rStart));
        }, rTime);
      }

      $(document).on('mousemove', function(e) {
        if (!allow) return;
        var mouseX = e.pageX, mouseY = e.pageY;
        var centerX = $(window).width() / 2, centerY = $(window).height() / 2;
        var distX = mouseX - centerX, distY = (mouseY - centerY) * 1.5;
        var dist = Math.sqrt(distX * distX + distY * distY);
        var maxDist = Math.sqrt(centerX * centerX + (centerY * 1.5) * (centerY * 1.5));
        var factor = 1 - Math.min(dist / maxDist, 1);
        var accel = Math.pow(factor, 3);
        var lIdx = dist <= 30 ? 68 : Math.round(accel * 42) + 26;
        var rIdx = dist <= 30 ? 71 : Math.round(accel * 42) + 29;
        $('.gb-left-arm>img').attr('src', gbLeftArmUrl(lIdx));
        $('.gb-right-arm>img').attr('src', gbRightArmUrl(rIdx));
      });
    });
  });
})(jQuery);