"use strict";

// const BASE_URL = 'http://localhost:3000';
var BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app/';
var USERS_URL = "".concat(BASE_URL, "/600/users");
var PRODUCTS_URL = "".concat(BASE_URL, "/products");
var id = 1;
var productsItemsContent = document.querySelector(".productsContent");
var swiperProduct = document.querySelector('.js-swiper-product');
swiperProduct.addEventListener('click', getTargetproductId);

function getTargetproductId(e) {
  // e.preventDefault();
  var targetID = e.target.closest("A").dataset.id;
  localStorage.setItem('productId', targetID) || 0;
}

function getLoggedID() {
  return localStorage.getItem('userId') || 0;
}

function getTableID() {
  return localStorage.getItem('tableId') || 0;
}

function getProductID() {
  return localStorage.getItem('productId') || 0;
}

function templateOfProductsItem(products) {
  var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  // console.log('products:::', JSON.stringify(products, null, 2));
  template += "\n        <div class=\"col-md-6 pe-md-0\">\n            <div class=\"overflow-hidden\">\n                <img src=\"".concat(products.img, "\" class=\"img-fluid \" alt=\"food.png\">\n            </div>\n        </div>\n        <div class=\"col-md-6\">\n            <div class=\"description d-flex flex-column h-100 text-primary p-3 px-md-0 pt-0 pb-3 pb-md-0\" >\n                <span class=\"text-secondary mt-3\">").concat(products.category, "</span>\n                <h2 class=\"description-title text-primary mb-5\">").concat(products.title, "</h2>\n                <p class=\"description-content text-black mb-5\">").concat(products.description, "</p>\n                <h3 class=\"fs-8 text-black mb-auto\"><i class=\"fas fa-genderless\"></i> \u4E3B\u98DF\u6750\uFF1A").concat(products.main, "</h3>\n                <p class=\"mb-3\">\u50F9\u9322\uFF1ANT $").concat(products.price, "</p>\n\n                <div class=\"input-group\">\n                    <button class=\"btn btn-outline-primary btn-text-primary \" type=\"button\" id=\"button-minus\">-</button>\n                    <input type=\"number\" class=\"form-num text-center border-1 border-primary bg-backStage text-primary flex-fill\" value=\"").concat(products.quantity, "\">\n                    <button class=\"btn btn-outline-primary btn-text-primary\" type=\"button\" id=\"button-plus\">+</button>\n                </div>\n                <a href=\"#\" class=\"js-addCartBtn btn btn-outline-primary btn-text-primary -mt-xs-1\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n            </div>\n        </div>\n        ");
  /* end of products.forEach() */

  return template;
} //數字加減操作&加入購物車


productsItemsContent.addEventListener("click", function (e) {
  var inputNum = document.querySelector(".form-num");

  if (e.target.nodeName == "BUTTON") {
    if (e.target.getAttribute("id") == "button-minus" && inputNum.value > 1) {
      inputNum.value--;
    } else if (e.target.getAttribute("id") == "button-plus") {
      inputNum.value++;
    }
  }

  if (e.target.getAttribute("class") !== "js-addCartBtn btn btn-outline-primary btn-text-primary -mt-xs-1") {
    return;
  }

  var userId = getLoggedID();
  var productId = getProductID();
  var tableId = getTableID();
  var data = {
    userId: userId,
    productId: productId,
    tableId: tableId,
    quantity: Number(inputNum.value)
  }; // console.log(data);

  var url = "".concat(USERS_URL, "/").concat(userId, "/carts");
  axios.post(url, data).then(function (response) {
    // console.log('carts:::', JSON.stringify(response, null, 2))
    if (response.status === 201) {
      renderCartState();
      sweetSmallSuccess("成功加入購物車~~");
    }
  })["catch"](function (error) {
    var _error$response;

    console.log('error:::', JSON.stringify(error, null, 2));

    if ((error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 401) {
      console.log('401');
      localStorage.clear();
      window.location.replace('/login.html');
    }
  });
});

function renderProductsPage() {
  var productId = getProductID();
  var url = "".concat(PRODUCTS_URL, "/").concat(productId);
  axios.get(url).then(function (response) {
    // console.log('GET-Products:::', JSON.stringify(response, null, 2));
    if (response.status === 200) {
      var productsItemData = response.data; //   console.log(productsItemData);

      productsItemsContent.innerHTML = templateOfProductsItem(productsItemData);
    }
  })["catch"](function (error) {
    var _error$response2;

    // console.log('error:::', JSON.stringify(error, null, 2));
    alert((error === null || error === void 0 ? void 0 : (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.status) || error);
  });
  /*  end of axios */
}

function init() {
  renderProductsPage();
}

init();
//# sourceMappingURL=product.js.map
