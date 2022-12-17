"use strict";

var bannerSwiper = new Swiper(".banner-swiper", {
  loop: true,
  speed: 6000,
  autoplay: {
    delay: 0
  },
  centeredSlides: true,
  slidesPerView: 2,
  breakpoints: {
    768: {
      slidesPerView: 3
    },
    992: {
      slidesPerView: 4
    },
    1080: {
      slidesPerView: 5
    }
  },
  spaceBetween: 18,
  effect: 'slide',
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
});
var indexSwiper = new Swiper(".index-swiper", {
  loop: true,
  speed: 500,
  autoplay: {
    delay: 3000
  },
  centeredSlides: true,
  slidesPerView: 2,
  breakpoints: {
    768: {
      slidesPerView: 3
    },
    1200: {
      slidesPerView: 3.1
    }
  },
  spaceBetween: 24,
  effect: 'slide',
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
});
//# sourceMappingURL=user-swiper.js.map
