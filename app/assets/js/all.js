const indexSwiper = new Swiper(".index-swiper", {
  loop: true,
  speed: 500,
  autoplay: {
    delay: 3000,
  },
  centeredSlides: true,
  slidesPerView: 2,
  breakpoints: {
    768: {
      slidesPerView: 3
    },
    1200: {
      slidesPerView: 2.9
    },
    1400: {
      slidesPerView: 2.5
    }
  },
  spaceBetween: 24,
  effect: 'slide',
  pagination: {
  el: ".swiper-pagination",
  clickable: true,
  },
});