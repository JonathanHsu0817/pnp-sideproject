"use strict";

var BASE_URL = 'http://localhost:3000'; // const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app/';

var swiperHot = document.querySelector('.js-swiper-hot'); // console.log(swiperHot);

swiperHot.addEventListener('click', getTargetproductId);

function getTargetproductId(e) {
  // e.preventDefault();
  var targetID = e.target.closest("A").dataset.id;
  localStorage.setItem('productId', targetID) || 0;
}

function getProductID() {
  return localStorage.getItem('productId') || 0;
}

function templateOfSwipers(products) {
  var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  // console.log('products:::', JSON.stringify(products, null, 2));
  products.forEach(function (item) {
    template += "\n        <div class=\"swiper-slide\">\n            <a href=\"./product.html?productId=".concat(item.id, "\" data-id=\"").concat(item.id, "\" class=\"img-info d-block\">\n            <img src=\"").concat(item.img, "\" class=\"img-fluid rounded-3\" alt=\"food_pic\">\n            <div class=\"img-info-background bg-transparent opacity-0\">\n                <div class=\"img-info-content justify-content-end\">\n                <h4 class=\"fs-6 fs-md-5 fs-md-4 lh-base mb-0 text-white\">").concat(item.title, "</h4>\n                </div>\n            </div>\n            </a>\n        </div>\n        ");
  });
  /* end of products.forEach() */

  return template;
}

function renderSwiper() {
  var url = "".concat(BASE_URL, "/products?id=2&id=3&id=5&id=6");
  axios.get(url).then(function (response) {
    // console.log('GET-Products:::', JSON.stringify(response, null, 2));
    if (response.status === 200) {
      var productsData = response.data;
      swiperHot.innerHTML = templateOfSwipers(productsData);
    }
  })["catch"](function (error) {
    var _error$response;

    // console.log('error:::', JSON.stringify(error, null, 2));
    alert((error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) || error);
  });
  /*  end of axios */
}

function init() {// renderSwiper();
}

init();
//# sourceMappingURL=index.js.map
