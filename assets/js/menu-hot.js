"use strict";

var BASE_URL = 'http://localhost:3000'; // const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app/';

var BASE_PAGE = 1; // const BASE_PRODUCT_URL = `${BASE_URL}/664/products?_page=${BASE_PAGE}&_limit=6`;

var USERS_URL = "".concat(BASE_URL, "/600/users");

function getLoggedID() {
  return localStorage.getItem('userId') || 0;
}

function getTableID() {
  return localStorage.getItem('tableId') || 0;
} //在目錄加入購物車按扭


var productsContent = document.querySelector(".products-hot-content");
var userSelection = document.querySelector(".js-user-selection"); // console.log(userSelection);
//存取productId(給product頁面使用)
// productsContent.addEventListener("click",(e)=>{
//   // e.preventDefault();
//   let selectedd = e.target.getAttribute("class");
//   console.log(selectedd);
//   if(selectedd !== "img-top img-fluid rounded-top"){
//     return
//   }
//   let productId = e.target.dataset.id;
//   console.log(productId);
//   localStorage.setItem('productId', productId) || 0;
// });

productsContent.addEventListener("click", menuAddtoCart);

function menuAddtoCart(e) {
  var addBtnInMenu = e.target.innerText;
  var selectedImg = e.target.nodeName;

  if (selectedImg == "IMG") {
    var productId = e.target.parentNode.dataset.id;
    localStorage.setItem('productId', productId) || 0;
  }

  if (addBtnInMenu == "加入購物車") {
    var _productId = e.target.dataset.id;
    var userId = getLoggedID();
    var tableId = getTableID();
    var data = {
      userId: userId,
      productId: _productId,
      tableId: tableId,
      quantity: 1
    };
    var url = "".concat(USERS_URL, "/").concat(userId, "/carts");
    postToCart(url, data);
  }
}

function postToCart(url, data) {
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
} //渲染卡片


function templateOfProducts(products) {
  var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  // console.log('products:::', JSON.stringify(products, null, 2));
  products.forEach(function (item) {
    template += "\n            <div class=\"col-md-4 col-sm-6\">\n                <div class=\"card border-0 shadow rounded-3 mb-4 position-relative\">\n                    <a href=\"./product.html?productId=".concat(item.id, "\" data-id=\"").concat(item.id, "\" class=\"overflow-hidden d-block\"><img src=\"").concat(item.img, "\" class=\"img-top img-fluid rounded-top\" alt=\"food-picz\"></a>\n                    <div class=\"card-body d-flex flex-column align-items-center text-center\">\n                        <h3 class=\"fs-5 text-black\">").concat(item.title, "</h3>\n                        <span class=\"text-primary\">NT $").concat(item.price, "</span>\n                        <a href=\"#\" data-id=\"").concat(item.id, "\" class=\"js-addToCartBtn btn btn-outline-primary rounded-3 btn-text-white btn-xl mt-3\">\n                            \u52A0\u5165\u8CFC\u7269\u8ECA\n                        </a>\n                    </div>\n                </div>    \n            </div>\n      ");
  });
  /* end of products.forEach() */

  return template;
} //pagination切換


var pagination = document.querySelector(".pagination");
var totalPages = 5;
pagination.addEventListener("click", function (e) {
  console.log(e.target);

  if (e.target.innerText == "»") {
    BASE_PAGE++;
  } else if (e.target.innerText == "«") {
    BASE_PAGE--;
  } else {
    BASE_PAGE = e.target.innerText;
  }

  renderProducts(BASE_PAGE);
});

function element(totalPages, page) {
  var liTag = '';
  var beforePages = page - 1;
  var pageActive;
  var afterPages = page + 1;

  if (page > 1) {
    liTag += "<li class=\"page-item\" onclick=\"element(totalPages,".concat(page - 1, ")\"><a class=\"page-link\" href=\"#\" aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a>");
  }

  if (page > 2) {
    liTag += "<li class=\"page-item\" onclick=\"element(totalPages,1)\"><a class=\"page-link\" href=\"#\">1</a></li>";
  }

  if (page > 3) {
    liTag += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\">...</a></li>";
  } //顯示多少頁面


  if (page == totalPages) {
    beforePages -= 1;
  } else if (page == 1) {
    afterPages += 1;
  }

  for (var pageLength = beforePages; pageLength <= afterPages; pageLength++) {
    if (pageLength > totalPages) {
      continue;
    }

    if (pageLength == 0) {
      pageLength++;
    }

    if (page == pageLength) {
      pageActive = 'active';
    } else {
      pageActive = '';
    }

    liTag += "<li class=\"page-item ".concat(pageActive, "\" onclick=\"element(totalPages,").concat(pageLength, ")\"><a class=\"page-link\" href=\"#\">").concat(pageLength, "</a></li>");
  }

  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      liTag += "<li class=\"page-item\" onclick=\"element(totalPages,".concat(totalPages - 1, ")\"><a class=\"page-link\" href=\"#\">...</a></li>");
    }

    liTag += "<li class=\"page-item\" onclick=\"element(totalPages,".concat(totalPages, ")\"\"><a class=\"page-link\" href=\"#\">").concat(totalPages, "</a></li>");
  }

  if (page < totalPages) {
    liTag += "<li class=\"page-item\" onclick=\"element(totalPages,".concat(page + 1, ")\"><a class=\"page-link\" href=\"#\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a>");
  }

  pagination.innerHTML = liTag;
}

function renderProducts(page) {
  var url = "".concat(BASE_URL, "/664/products?_page=").concat(page, "&_limit=6");
  axios.get(url).then(function (response) {
    // console.log('GET-Products:::', JSON.stringify(response, null, 2));
    if (response.status === 200) {
      var productsData = response.data;
      productsContent.innerHTML = templateOfProducts(productsData);
    }
  })["catch"](function (error) {
    var _error$response2;

    // console.log('error:::', JSON.stringify(error, null, 2));
    alert((error === null || error === void 0 ? void 0 : (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.status) || error);
  });
  /*  end of axios */
}

function init() {
  element(totalPages, 1);
  renderProducts(BASE_PAGE);
}

init();
//# sourceMappingURL=menu-hot.js.map
