"use strict";

// const BASE_URL = 'http://localhost:3000';
var BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';
var LOGIN_URL = "".concat(BASE_URL, "/login");
var USERS_URL = "".concat(BASE_URL, "/660/users");
var PRODUCTS_URL = "".concat(BASE_URL, "/664/products");
var TABLES_URL = "".concat(BASE_URL, "/644/tables");
var CARTS_URL = "".concat(BASE_URL, "/660/carts");
var formLogin = document.querySelector(".js-form-login");
var btnLogin = document.querySelector(".js-btn-login");
var btnUserMenu = document.querySelector('.js-user-selection');
var menuList = document.querySelector(".menu-list"); // console.log(menuList);

var cartData = []; ////登入頁面
//存至localStorage

function saveUserToLocal(_ref) {
  var accessToken = _ref.accessToken,
      user = _ref.user;
  localStorage.setItem('token', accessToken);
  localStorage.setItem('userId', user.id);
  localStorage.setItem('nickname', user.nickname);
}

function login() {
  console.log('Login!');
  var url = "".concat(LOGIN_URL);
  var data = {
    email: formLogin.email.value.trim(),
    password: formLogin.password.value.trim()
  };
  var hasInput = data.email && data.password;

  if (hasInput) {
    return axios.post(url, data).then(function (response) {
      // console.log('login:::', JSON.stringify(response, null, 2));
      if (response.status === 200) {
        var _response$data, _response$data$user;

        sweetSuccess("登入成功!", "歡迎光臨~");
        saveUserToLocal(response.data);
        var _redirectPath = 'https://jonathanhsu0817.github.io/pnp-sideproject/index.html'; // let redirectPath = '/';

        var isAdmin = ((_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$user = _response$data.user) === null || _response$data$user === void 0 ? void 0 : _response$data$user.role) === 'admin';

        if (isAdmin) {
          _redirectPath = 'https://jonathanhsu0817.github.io/pnp-sideproject/admin.html'; // redirectPath = './admin.html';
        }

        setTimeout(function () {
          console.log('Redirect!');
          window.location.replace(_redirectPath);
        }, 150);
        /* end of setTimeout */
      }
      /* end of response.OK */

    })["catch"](function (error) {
      sweetError("登入失敗", "再重新試一試喔~"); // console.log('error:::', JSON.stringify(error, null, 2));
    });
    /*  end of axios */
  }
  /* end of IF-hasInput */

}

btnLogin.addEventListener('click', function () {
  return login();
}); //判斷登入後渲染登入畫面

function getLoggedID() {
  return localStorage.getItem('userId') || 0;
}
/* end of hasLogged() */


function templateOfUserMenu(user) {
  var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  // console.log('me:::', JSON.stringify(user, null, 2));
  var isAdmin = (user === null || user === void 0 ? void 0 : user.role) === 'admin';

  if (isAdmin) {
    template = "\n        <li class=\"nav-item\">\n            <div class=\"d-flex\">\n                <a href=\"./admin.html\" class=\"d-block btn btn-outline-primary btn-bg-white me-2\">\n                \u524D\u5F80\u5F8C\u53F0\n                </a>\n            </div>\n        </li>\n      ";
  }
  /* end of (isAdmin) */


  redirectPath;
  template += "\n      <li class=\"nav-item\">\n        <div class=\"d-flex\">\n          <select name=\"table-selection\" id=\"table-selection\" class=\"border-primary bg-backStage text-primary me-2\">\n            <option value=\"\u8ACB\u9078\u64C7\u684C\u865F\">\u8ACB\u9078\u64C7\u684C\u865F</option>\n            <option value=\"1\">B1</option>\n            <option value=\"2\">B2</option>\n            <option value=\"3\">B3</option>\n            <option value=\"4\">B4</option>\n            <option value=\"5\">B5</option>\n            <option value=\"6\">B6</option>\n            <option value=\"7\">B7</option>\n            <option value=\"8\">B8</option>\n            <option value=\"9\">B9</option>\n          </select>\n          <a href=\"#\" class=\"js-logout d-block btn btn-outline-primary btn-bg-white\">\n            \u767B\u51FA\n          </a>\n        </div>\n      </li>";
  return template;
}
/* end of templateOfUserMenu() */


function renderUserMenu() {
  var userId = getLoggedID();
  var url = "".concat(BASE_URL, "/600/users/").concat(userId);
  axios.get(url).then(function (response) {
    // console.log('GET-Me:::', JSON.stringify(response, null, 2));
    if (response.status === 200) {
      // console.log('OK!');
      document.querySelector('.js-user-selection').innerHTML = '';
      btnUserMenu.innerHTML = templateOfUserMenu(response.data);
    }
    /* end of res-OK */

  })["catch"](function (error) {
    var _error$response;

    // console.log('error:::', JSON.stringify(error, null, 2));
    if ((error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 401) {
      console.log('401');
      localStorage.clear();
    }
  });
}
/* end of renderUserMenu() */


function logout(e) {
  var target = e.target;
  var targetBtn = e.target.closest('.js-logout');

  if (!targetBtn) {
    return;
  }

  localStorage.clear();
  setTimeout(function () {
    window.location.replace('https://jonathanhsu0817.github.io/pnp-sideproject/index.html'); // window.location.replace('./index.html');
  }, 300);
  /* end of setTimeout */
}
/* end of logout(event) */
//抓取指定菜單選項


menuList.addEventListener("click", function (e) {
  // e.preventDefault();
  var targetMenuSelection = e.target.closest("a").dataset.category; // console.log(targetMenuSelection)

  localStorage.setItem('category', targetMenuSelection);
}); //渲染菜單選單

function renderResturantMenu() {
  var content = "\n    <li class=\"d-block d-flex justify-content-center align-items-end fs-5 fw-bold mb-11\">\u83DC\u55AE<span class=\"text-primary fs-6 fw-normal ms-3\">Menu</span></li>\n    <li><a href=\"./menu.html\" data-category=\"\" class=\"d-block d-flex justify-content-center align-items-end btn border-0 fs-5 fw-bold mb-9\">\u71B1\u9580\u9910\u9EDE<span class=\"link-primary fs-6 fw-normal ms-3 font-monospace\">Hot</span></a></li>\n    <li><a href=\"./menu.html\" data-category=\"\" class=\"d-block d-flex justify-content-center align-items-end btn border-0 fs-5 fw-bold mb-9\">\u5206\u4EAB\u9910<span class=\"link-primary fs-6 fw-normal ms-3 font-monospace\">Combo Meals</span></a></li>\n    <li><a href=\"./menu.html\" data-category=\"\u524D\u83DC\" class=\"d-block d-flex justify-content-center align-items-end btn border-0 fs-5 fw-bold mb-9\">\u524D\u83DC<span class=\"link-primary fs-6 fw-normal ms-3 font-monospace\">Appetizer</span></a></li>\n    <li><a href=\"./menu.html\" data-category=\"\u62B1\u98DF\u4E3B\u83DC\" class=\"d-block d-flex justify-content-center align-items-end btn border-0 fs-5 fw-bold mb-9\">\u62B1\u98DF\u4E3B\u83DC<span class=\"link-primary fs-6 fw-normal ms-3 font-monospace\">Sharing Courses</span></a></li>\n    <li><a href=\"./menu.html\" data-category=\"\u4E3B\u5EDA\u7CBE\u9078\" class=\"d-block d-flex justify-content-center align-items-end btn border-0 fs-5 fw-bold mb-9\">\u4E3B\u5EDA\u7CBE\u9078<span class=\"link-primary fs-6 fw-normal ms-3 font-monospace\">Delicate Courses</span></a></li>\n    <li><a href=\"./menu.html\" data-category=\"\u914D\u83DC\" class=\"d-block d-flex justify-content-center align-items-end btn border-0 fs-5 fw-bold mb-9\">\u914D\u83DC<span class=\"link-primary fs-6 fw-normal ms-3 font-monospace\">Side Dishes</span></a></li>\n    <li><a href=\"./menu.html\" data-category=\"\u751C\u9EDE\" class=\"d-block d-flex justify-content-center align-items-end btn border-0 fs-5 fw-bold mb-9\">\u751C\u9EDE<span class=\"link-primary fs-6 fw-normal ms-3 font-monospace\">Dessert</span></a></li>\n    <li><a href=\"./menu.html\" data-category=\"\u98F2\u6599\u53CA\u9152\" class=\"d-block d-flex justify-content-center align-items-end btn border-0 fs-5 fw-bold\">\u98F2\u6599 & \u9152<span class=\"link-primary fs-6 fw-normal ms-3 font-monospace\">Beverages</span></a></li>\n    "; // console.log(content)

  menuList.innerHTML = content;
} //選取桌號值


btnUserMenu.addEventListener("click", function (e) {
  var tableSelection = e.target.nodeName;

  if (tableSelection !== "SELECT") {
    return;
  }

  var tableId = e.target.value;
  localStorage.setItem('tableId', tableId);
}); ////購物車相關api

var cartList = document.querySelector(".cart-body"); //指定刪除(垃圾桶)

cartList.addEventListener("click", function (e) {
  var targetA = e.target.closest("a");

  if (!targetA) {
    return;
  }

  if (targetA.childNodes[0].nodeName == "I") {
    var targetId = targetA.dataset.id;
    var AUTH = "Bearer ".concat(localStorage.getItem('token'));
    axios.defaults.headers.common.Authorization = AUTH;
    var url = "".concat(CARTS_URL, "/").concat(targetId);
    axios["delete"](url).then(function (res) {
      if (res.status === 200) {
        renderCartState();
      }
    })["catch"](function (error) {
      console.log('error:::', JSON.stringify(error, null, 2));
    });
  }
}); //確認是否購物空值

var btnConfirm = document.querySelector(".js-confirm");
btnConfirm.addEventListener("click", function (e) {
  if (e.target.innerText !== "加點") {
    return;
  }

  var userId = getLoggedID();
  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH;
  var url = "".concat(USERS_URL, "/").concat(userId, "/carts?_expand=product&_expand=table");
  axios.get(url).then(function (res) {
    if (res.status === 200) {
      cartData = res.data;

      if (cartData.length == 0) {
        sweetError("購物車是空的喔~");
        return;
      }

      window.location.replace('https://github.com/jonathanHsu0817/pnp-sideproject/menu.html'); // window.location.replace('./menu.html')
    }
  });
}); //清空購物車

var deleteAllCart = document.querySelector(".js-deleteAllCart");
deleteAllCart.addEventListener("click", function (e) {
  if (e.target.innerText !== "清空購物車") {
    return;
  }

  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH;
  var carts = JSON.parse(localStorage.getItem('carts')); // console.log(carts)

  var arrayOfDelete = [];
  carts.forEach(function (item) {
    var request = axiosDeleteCart(item.id);
    arrayOfDelete.push(request);
  });
  Promise.all(arrayOfDelete).then(function (results) {
    console.log('results:::', results);

    if (results.length === arrayOfDelete.length) {
      renderCartState();
      sweetSuccess("已全部清空~~");
      setTimeout(function () {
        console.log('Redirect!');
        window.location.replace('https://github.com/JonathanHsu0817/pnp-sideproject/menu.html'); // window.location.replace('./menu.html');
      }, 150);
    }
  })["catch"](function (error) {
    console.log('error:::', JSON.stringify(error, null, 2));
  });
}); //清空購物車所設定promise function

function axiosDeleteCart() {
  var cartId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var url = "".concat(CARTS_URL, "/").concat(cartId);
  return axios["delete"](url);
} //渲染購物車


function renderCartState() {
  var userId = getLoggedID();
  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH;
  var url = "".concat(USERS_URL, "/").concat(userId, "/carts?_expand=product&_expand=table");
  axios.get(url).then(function (res) {
    if (res.status === 200) {
      var _cartData = res.data;
      console.log(_cartData);

      if (_cartData.length == 0) {
        renderNoCartData();
        return;
      }

      localStorage.setItem('carts', JSON.stringify(_cartData)); // console.log(cartData);
      //計算總金額

      var sum = 0;
      var sumWithTax = 0;

      _cartData.forEach(function (item) {
        var intQty = Number(item.quantity);
        var intPrice = Number(item.product.price);
        var total = intQty * intPrice;
        sum += total;
      }); // console.log(newCartData)


      renderCartList(_cartData, sum);
    }
  }); //加入購物車按扭寫在menu.js & 各別product.js上(不同邏輯)
}

function renderNoCartData() {
  var content = "\n  <div class=\"d-flex align-items-center justify-content-center\">\n    <p class=\"text-secondary my-16\">\u76EE\u524D\u8CFC\u7269\u8ECA\u662F\u7A7A\u7684\u5594~</p>\n  </div>\n  ";
  cartList.innerHTML = content;
} //渲染購物車畫面function


function renderCartList(data, total) {
  var str = "";
  data.forEach(function (item) {
    var list = "\n    <div class=\"cart-card d-flex align-items-center border-bottom border-1 pb-4 mb-4\">\n      <img class=\"cart-img object-position-top me-2 me-md-3\" src=\"".concat(item.product.img, "\" alt=\"food_pic\">\n      <div class=\"card-content col-5\">\n        <p class=\"mb-2\">").concat(item.product.title, "</p>\n        <span class=\"text-primary\">NT$").concat(toThousandsComma(item.product.price), "</span>\n      </div>\n      <div class=\"cart-num col-2 ms-2 ms-md-3\">\n        <input type=\"number\" class=\"cart-input text-center lh-1 py-3\" id=\"cart-input\" value=\"").concat(item.quantity, "\">\n      </div>\n      <a href=\"#\" data-id=\"").concat(item.id, "\" class=\"cart-delete d-block ms-4 ms-md-3\"><i class=\"fas fa-trash-alt text-primary fs-4\"></i></a>\n    </div>");
    str += list;
  });
  var cartTotal = "\n    <div class=\"cart-charge-content d-flex mb-16\">\n      <div class=\"d-flex align-items-center ms-auto\">\n        <h5 class=\"mb-0\">\u5C0F\u8A08\u91D1\u984D</h5>\n        <span class=\"cart-charge-total text-primary fs-6 ms-3\">NT$".concat(toThousandsComma(total), "</span>\n      </div>\n    </div>");
  str += cartTotal;
  cartList.innerHTML = str;
}

function init() {
  renderResturantMenu(); // console.log('getLoggedID():::', getLoggedID());

  if (getLoggedID()) {
    var localToken = localStorage.getItem('token');
    var AUTH = "Bearer ".concat(localToken);
    axios.defaults.headers.common.Authorization = AUTH;
    renderUserMenu(); //購物車

    renderCartState();
  }
  /* end of if-getLoggedID */


  btnUserMenu.addEventListener('click', function (event) {
    return logout(event);
  });
} // MAIN


init(); //utillities

function toThousandsComma(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//# sourceMappingURL=renderUserLayout.js.map
