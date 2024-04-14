var _functions = {}, winWidth, shareButton;

jQuery(function ($) {
    var isTouchScreen = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);
    if (isTouchScreen)
        $('html').addClass('touch-screen');
    var winScr, winHeight, is_Mac = navigator.platform.toUpperCase().indexOf('MAC') >= 0,
        is_IE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d+/.test(navigator.userAgent),
        is_Chrome = navigator.userAgent.indexOf('Chrome') >= 0 && navigator.userAgent.indexOf('Edge') < 0;
    winWidth = $(window).width();
    winHeight = $(window).height();
    if (is_Mac) {
        $('html').addClass('mac');
    }
    if (is_IE) {
        $('html').addClass('ie');
    }
    if (is_Chrome) {
        $('html').addClass('chrome');
    }


    _functions.getSwOptions = function (swiper) {
        let options = swiper.data('options');
        options = (!options || typeof options !== 'object') ? {} : options;
        const $p = swiper.closest('.swiper-entry'),
            slidesLength = swiper.find('>.swiper-wrapper>.swiper-slide').length;
        if (!options.pagination) options.pagination = {
            el: $p.find('.swiper-pagination')[0],
            clickable: true,


            renderBullet: function (index, className) {
                return '<span class="' + className + '">0' + (index + 1) + '</span>';
            }

        };
        if (!options.navigation) options.navigation = {
            nextEl: $p.find('.swiper-button-next')[0],
            prevEl: $p.find('.swiper-button-prev')[0]
        };
        options.preloadImages = false;
        options.lazy = {
            loadPrevNext: true
        };
        options.observer = true;
        options.observeParents = true;
        options.watchOverflow = true;
        options.centerInsufficientSlides = true;
        if (!options.speed) options.speed = 500;
        options.roundLengths = true;
        if (isTouchScreen) options.direction = "horizontal";
        if (slidesLength <= 1) {
            options.loop = false;
            $p.find('.swiper-wrapper').css({
                "cursor": "default"
            })
        }
        if (options.customFraction) {
            $p.addClass('custom-fraction');
            if (slidesLength > 1 && slidesLength < 10) {
                $p.find('.custom-current').text('1');
                $p.find('.custom-total').text(slidesLength);
            } else if (slidesLength > 1) {
                $p.find('.custom-current').text('1');
                $p.find('.custom-total').text(slidesLength);
            }
        }
        return options;
    };
    _functions.initSwiper = function (el) {
        const swiper = new Swiper(el[0], _functions.getSwOptions(el));
    }
    ;
    $('.swiper-entry .swiper-container').each(function () {
        _functions.initSwiper($(this));
    });


    //custom fraction
    $('.custom-fraction').each(function () {
        var $this = $(this),
            $thisSwiper = $this.find('.swiper-container')[0].swiper;

        $thisSwiper.on('slideChange', function () {
            $this.find('.custom-current').text(
                function () {
                    if ($thisSwiper.realIndex < 9) {
                        return ($thisSwiper.realIndex + 1)
                    } else {
                        return $thisSwiper.realIndex + 1
                    }
                }
            )
        });
    });


    // video stop/play
    $('.banner-slider').each(function () {
        let $thisSwiper = $('.banner-slider').find('.swiper-container')[0].swiper;

        $thisSwiper.on('slideChange', function () {

            var $cSlides = $('.swiper-container').find('.banner-slide');
            _functions.customSlide($thisSwiper, $cSlides);

        });
    });
    _functions.customSlide = function (swiperObj, $customSlides) {
        var slideTo = $customSlides.eq(swiperObj.activeIndex),
            slideFrom = $customSlides.eq(swiperObj.previousIndex);

        var prevSlideVideo = slideFrom.find('video'),
            activeSlideVideo = slideTo.find('video');

        if (prevSlideVideo.length) prevSlideVideo[0].pause();
        if (prevSlideVideo.length) prevSlideVideo[0].currentTime = 0;
        if (activeSlideVideo.length) activeSlideVideo[0].play();
    }

    //popup
    let popupTop = 0;
    _functions.removeScroll = function () {
        popupTop = $(window).scrollTop();
        $('html').css({
            "position": "fixed",
            "top": -$(window).scrollTop(),
            "width": "100%"
        });
    }
    _functions.addScroll = function () {

        $('html').css({
            "position": "static"
        });
        // $('html').css({}).removeClass("overflow-hidden");
        window.scroll(0, popupTop);
    }

    _functions.openPopup = function (popup) {

        $('.popup-content').removeClass('active');

        // $('.popup-content').removeClass('animate-away').addClass('animate-in');

        $(popup + ', .popup-wrapper').addClass('active');
        _functions.removeScroll();
    };

    _functions.closePopup = function () {


        //$('.popup-content').removeClass('animate-in').addClass('animate-away');

        $('.popup-wrapper, .popup-content').removeClass('active');
        _functions.addScroll();
    };

    $(document).on('click', '.open-popup', function (e) {
        e.preventDefault();
        _functions.openPopup('.popup-content[data-rel="' + $(this).data('rel') + '"]');
    });

    $(document).on('click', '.popup-wrapper .btn-close, .popup-wrapper .layer-close, .popup-wrapper .btn-back', function (e) {
        e.preventDefault();
        _functions.closePopup();
    });


    $(window).scroll(function () {
        _functions.scrollCall();
    });
    var prev_scroll = 0;
    _functions.scrollCall = function () {
        winScr = $(window).scrollTop();
        if (winScr > prev_scroll) {
            $('header').addClass('header__hidden');
            $('.menu-item').removeClass('active');
        } else {
            $('header').removeClass('header__hidden');

        }
        prev_scroll = winScr;
        if (winScr <= 10) {
            $('header').removeClass('header__hidden');
            prev_scroll = 0;
        }
    }

   /* _functions.coolNav = function () {
        let r = $("header");
        $(window).on("scroll", (function () {
                $(window).scrollTop() > 100 ? r.addClass("fixed-top") : r.removeClass("fixed-top")
            }
        ));
    };
    _functions.coolNav();
*/


    _functions.coolNav = function () {


        let n = $(".no-touch .menu >  .menu-item > a"), i = $(".no-touch .menu"), r = $("header");
        n.mouseenter((function () {
                r.removeClass("open-dropdown"),
                    n.parent().removeClass("active"),
                    $(this).parent().addClass("active"),
                $(this).parent().hasClass("menu-item-has-children") && r.addClass("open-dropdown")
            }
        )),
            i.mouseleave((function () {
                    n.parent().removeClass("active"),
                        r.removeClass("open-dropdown")
                }
            )),

            /// $(".touchevents .menu-item-has-children > a").on("click", (function () {
            ///  alert("ghgjhj");
            //  }
            //  ));
            $(window).on("scroll", (function () {
                    $(window).scrollTop() > 100 ? r.addClass("fixed-top") : r.removeClass("fixed-top")
                }
            ));

    };
    _functions.coolNav();



    if ($('.select-box').length) {

        $('select').SumoSelect();
    }

});

function scrollAnime() {
    if ($('.animation').length) {
        $('.animation').not('.animated').each(function() {
            var th = $(this);
            if ($(window).width() < 768) {
                if ($(window).scrollTop() >= th.offset().top - ($(window).height() * 0.95)) {
                    th.addClass('animated');
                }
            } else {
                if ($(window).scrollTop() >= th.offset().top - ($(window).height() * 0.85)) {
                    th.addClass('animated');
                }
            }
        });
    }
}
scrollAnime();
$(window).on('scroll', function () {
    scrollAnime();
});


jQuery(function () {
    $(".burger__wrap").on("click", function () {
        $(this).toggleClass("active"),
            $(".navbar").toggleClass("is-visible")
    })
});


$(function () {

    var body = $('body');
    $('.lang__current').on('click', function (e) {

        e.preventDefault();
        $('.lang__wrap').toggleClass('open');
    });

    body.on('click', function (e) {
        if (!$(e.target).closest('.lang__wrap').length) {
            $('.lang__wrap').removeClass('open');
        }
    });
});



// about page
$('.preload__btn').on('click', function () {
    $(this).parents(".preload-entry").find(".preload").css({
        'z-index': -1,
        'opacity': 0
    });
    $(this).parents(".preload-entry").find("video").css({
        "display": "block"
    });

    var video = $(this).parents(".preload-entry").find("video")[0];

    console.log(video.paused);
    if (video.paused === false) {
        $(this).parents(".preload-entry").find('.--pause').removeClass("d-block").addClass("d-none");
        $(this).parents(".preload-entry").find('.--play').removeClass("d-none").addClass("d-block");
        video.pause();
    } else {
        video.play();
        $(this).parents(".preload-entry").find('.--play').removeClass("d-block").addClass("d-none");
        $(this).parents(".preload-entry").find('.--pause').removeClass("d-none").addClass("d-block");
    }
});
