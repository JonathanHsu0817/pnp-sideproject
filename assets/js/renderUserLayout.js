"use strict";

var BASE_URL = 'http://localhost:3000'; // const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';

var LOGIN_URL = "".concat(BASE_URL, "/login");
var USERS_URL = "".concat(BASE_URL, "/600/users");
var PRODUCTS_URL = "".concat(BASE_URL, "/664/products");
var TABLES_URL = "".concat(BASE_URL, "/644/tables");
var CARTS_URL = "".concat(BASE_URL, "/600/carts");
var formLogin = document.querySelector(".js-form-login");
var btnLogin = document.querySelector(".js-btn-login");
var btnUserMenu = document.querySelector('.js-user-selection');
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
        var redirectPath = '/'; // const isAdmin = response.data?.user?.role?.includes('admin');

        var isAdmin = ((_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$user = _response$data.user) === null || _response$data$user === void 0 ? void 0 : _response$data$user.role) === 'admin';

        if (isAdmin) {
          redirectPath = 'admin.html';
        }

        setTimeout(function () {
          console.log('Redirect!');
          window.location.replace(redirectPath);
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


  template += "\n          <li class=\"nav-item\">\n            <div class=\"d-flex\">\n                <select name=\"table-selection\" id=\"table-selection\" class=\"border-primary bg-backStage text-primary me-2\">\n                <option value=\"\u8ACB\u9078\u64C7\u684C\u865F\">\u8ACB\u9078\u64C7\u684C\u865F</option>\n                <option value=\"1\">B1</option>\n                <option value=\"2\">B2</option>\n                <option value=\"3\">B3</option>\n                <option value=\"4\">B4</option>\n                <option value=\"5\">B5</option>\n                <option value=\"6\">B6</option>\n                <option value=\"7\">B7</option>\n                <option value=\"8\">B8</option>\n                <option value=\"9\">B9</option>\n              </select>\n                <a href=\"#\" class=\"js-logout d-block btn btn-outline-primary btn-bg-white\">\n                \u767B\u51FA\n                </a>\n            </div>\n        </li>\n    ";
  return template;
}
/* end of templateOfUserMenu() */


function renderUserMenu() {
  var userId = getLoggedID();
  var url = "".concat(BASE_URL, "/600/users/").concat(userId); // console.log('url >>> ', url);

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
      console.log('401'); // localStorage.removeItem('myCat');

      localStorage.clear();
    }
  });
}
/* end of renderUserMenu() */


function logout(e) {
  var target = e.target; // console.log('target:::', target);

  var targetBtn = e.target.closest('.js-logout'); // console.log('targetBtn:::', targetBtn);

  if (!targetBtn) {
    return;
  }

  localStorage.clear();
  setTimeout(function () {
    window.location.replace('/');
  }, 300);
  /* end of setTimeout */
}
/* end of logout(event) */
//選取桌號值


btnUserMenu.addEventListener("click", function (e) {
  var tableSelection = e.target.nodeName;

  if (tableSelection !== "SELECT") {
    return;
  }

  var tableId = e.target.value;
  localStorage.setItem('tableId', tableId);
}); //購物車相關api

var cartList = document.querySelector(".cart-body");
cartList.addEventListener("click", function (e) {
  var targetA = e.target.closest("a");
  console.log(targetA.childNodes[0].nodeName);

  if (!targetA) {
    return;
  } else if (targetA.childNodes[0].nodeName == "I") {
    //指定刪除(垃圾桶)
    var targetId = targetA.dataset.id;
    var AUTH = "Bearer ".concat(localStorage.getItem('token'));
    axios.defaults.headers.common.Authorization = AUTH;
    var url = "".concat(CARTS_URL, "/").concat(targetId);
    axios["delete"](url).then(function (res) {
      // console.log('carts:::', JSON.stringify(res, null, 2));
      if (res.status === 200) {
        renderCartState();
      }
    })["catch"](function (error) {
      console.log('error:::', JSON.stringify(error, null, 2));
    }); // }else if(targetA.innerText=="清空購物車"){//刪除全部購物車
    //   const carts = JSON.parse(localStorage.getItem('carts'));
    //   console.log(carts)
    //   let arrayOfDelete = [];
    //   carts.forEach((item) => {
    //     const request = axiosDeleteCart(item.id);
    //     arrayOfDelete.push(request);
    //   });
    //   Promise.all(arrayOfDelete)
    //     .then(function (results) {
    //     console.log('results:::', results);
    //       if (results.length === arrayOfDelete.length) {
    //         renderCartState();
    //         sweetSuccess("已全部清空~~")
    //         setTimeout(() => {
    //           console.log('Redirect!');
    //           window.location.replace('./menu-hot.html');
    //         }, 150);
    //       }
    //     })
    //     .catch(function (error) {
    //     console.log('error:::', JSON.stringify(error, null, 2));
    //     });
  }
});

function axiosDeleteCart() {
  var cartId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var url = "".concat(CARTS_URL, "/").concat(cartId);
  return axios["delete"](url);
}

function renderCartState() {
  var userId = getLoggedID();
  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH; // const params = new URLSearchParams(document.location.search);
  // const productId = params.get('productId') || 1;
  // #Step-2.4

  var url = "".concat(USERS_URL, "/").concat(userId, "/carts?_expand=product");
  axios.get(url).then(function (res) {
    if (res.status === 200) {
      var _cartData = res.data;
      localStorage.setItem('carts', JSON.stringify(_cartData)); // console.log(cartData);
      //計算總金額

      var sum = 0;

      _cartData.forEach(function (item) {
        var intQty = Number(item.quantity);
        var intPrice = Number(item.product.price);
        var total = intQty * intPrice;
        sum += total;
      }); //渲染購物車畫面


      renderCartList(_cartData, sum);
    }
  }); //加入購物車按扭寫在menu-hot.js & 各別product.js上(不同邏輯)
}

function renderCartList(data, total) {
  var str = "";
  data.forEach(function (item) {
    var list = "\n    <div class=\"cart-card d-flex align-items-center border-bottom border-1 pb-4 mb-4\">\n      <img class=\"cart-img object-position-top me-2 me-md-3\" src=\"".concat(item.product.img, "\" alt=\"food_pic\">\n      <div class=\"card-content col-5\">\n        <p class=\"mb-2\">").concat(item.product.title, "</p>\n        <span class=\"text-primary\">NT$").concat(item.product.price, "</span>\n      </div>\n      <div class=\"cart-num col-2 ms-2 ms-md-3\">\n        <input type=\"number\" class=\"cart-input text-center lh-1 py-3\" id=\"cart-input\" value=\"").concat(item.quantity, "\">\n      </div>\n      <a href=\"#\" data-id=\"").concat(item.id, "\" class=\"cart-delete d-block ms-4 ms-md-3\"><i class=\"fas fa-trash-alt text-primary fs-4\"></i></a>\n    </div>");
    str += list;
  });
  var cartFooter = "\n    <div class=\"cart-charge-content d-flex mb-16\">\n      <div class=\"d-flex align-items-center ms-auto\">\n        <h5 class=\"mb-0\">\u5C0F\u8A08\u91D1\u984D</h5>\n        <span class=\"cart-charge-total text-primary fs-6 ms-3\">NT$".concat(total, "</span>\n      </div>\n    </div>\n    <div class=\"d-flex flex-column\">\n      <a href=\"#\" class=\"btn btn-primary text-white round-0 py-3 mb-6\">\u52A0\u9EDE</a>\n        <a href=\"#\" class=\"js-deleteAllCart btn btn-outline-secondary border-0 round-0 align-self-center py-2 px-4 mb-4\">\u6E05\u7A7A\u8CFC\u7269\u8ECA</a>\n    </div>");
  str += cartFooter;
  cartList.innerHTML = str;
}
/**
 * #Step-0: after page refresh
 */


function init() {
  // console.log('getLoggedID():::', getLoggedID());
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
}
/* end of init() */
// MAIN


init();
//# sourceMappingURL=renderUserLayout.js.map
