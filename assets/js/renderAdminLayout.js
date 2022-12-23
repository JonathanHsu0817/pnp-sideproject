"use strict";

// const BASE_URL = 'http://localhost:3000';
var BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';
var LOGIN_URL = "".concat(BASE_URL, "/login");
var USERS_URL = "".concat(BASE_URL, "/600/users");
var ORDERS_URL = "".concat(BASE_URL, "/660/orders?_expand=table");
var formLogin = document.querySelector(".js-form-login");
var btnLogin = document.querySelector(".js-btn-login");
var btnUserMenu = document.querySelector('.js-user-selection');

function saveUserToLocal(_ref) {
  var accessToken = _ref.accessToken,
      user = _ref.user;
  localStorage.setItem('token', accessToken);
  localStorage.setItem('userId', user.id);
  localStorage.setItem('nickname', user.nickname);
} //登入


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
        var redirectPath = 'https://jonathanhsu0817.github.io/pnp-sideproject/index.html'; // const isAdmin = response.data?.user?.role?.includes('admin');

        var isAdmin = ((_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$user = _response$data.user) === null || _response$data$user === void 0 ? void 0 : _response$data$user.role) === 'admin';

        if (isAdmin) {
          redirectPath = 'https://jonathanhsu0817.github.io/pnp-sideproject/admin.html';
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
});

function getLoggedID() {
  return localStorage.getItem('userId') || 0;
}

function templateOfAdminMenu(user) {
  var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  // console.log('me:::', JSON.stringify(user, null, 2));
  var isAdmin = (user === null || user === void 0 ? void 0 : user.role) === 'admin';

  if (isAdmin) {
    template = "\n        <li class=\"nav-item\">\n            <div class=\"d-flex\">\n                <a href=\"./index.html\" class=\"d-block btn btn-outline-primary btn-bg-white me-2\">\n                \u524D\u5F80\u524D\u53F0\n                </a>\n            </div>\n        </li>\n      ";
  }
  /* end of (isAdmin) */


  template += "\n          <li class=\"nav-item\">\n            <div class=\"d-flex\">\n                <a href=\"#\" class=\"js-logout d-block btn btn-outline-primary btn-bg-white\">\n                \u767B\u51FA\n                </a>\n            </div>\n        </li>\n    ";
  return template;
}

function renderAdminMenu() {
  var userId = getLoggedID();
  var url = "".concat(BASE_URL, "/600/users/").concat(userId);
  axios.get(url).then(function (response) {
    // console.log('GET-Me:::', JSON.stringify(response, null, 2));
    if (response.status === 200) {
      // console.log('OK!');
      document.querySelector('.js-user-selection').innerHTML = '';
      btnUserMenu.innerHTML = templateOfAdminMenu(response.data);
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

function logout(e) {
  var target = e.target; // console.log('target:::', target);

  var targetBtn = e.target.closest('.js-logout'); // console.log('targetBtn:::', targetBtn);

  if (!targetBtn) {
    return;
  }

  localStorage.clear();
  setTimeout(function () {
    window.location.replace('https://jonathanhsu0817.github.io/pnp-sideproject/index.html');
  }, 300);
  /* end of setTimeout */
} //總計未出餐


var totalList = document.querySelector(".total-content");

function renderTotalState() {
  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH; // #Step-2.4

  var url = "".concat(ORDERS_URL);
  axios.get(url).then(function (res) {
    if (res.status === 200) {
      var cartData = res.data; // console.log(cartData);

      var cartDataFiltered = cartData.filter(function (item) {
        return item.hasAllDelivered == false;
      }); //整理數值

      renderTotalList(sortingData(cartDataFiltered)); // renderTotalList(cartData,sum)
    }
  }); //加入購物車按扭寫在menu-hot.js & 各別product.js上(不同邏輯)
}

function sortingData(data) {
  var filterData = [];
  data.forEach(function (item) {
    var products = item.products;
    products.forEach(function (productItem) {
      var obj = {
        product: productItem.title,
        quantity: productItem.quantity
      };
      filterData.push(obj);
    });
  });
  var total = {};
  filterData.forEach(function (goods) {
    var num = 0;

    if (!total[goods.product]) {
      num = goods.quantity * 1;
      return total[goods.product] = num;
    } else {
      num = total[goods.product] + goods.quantity * 1;
      return total[goods.product] = num;
    }
  });
  return total;
}

function renderTotalList(data) {
  var arr = Object.entries(data);
  var list = "";
  arr.sort().forEach(function (item) {
    list += "<tr>\n      <td width=\"55\">".concat(item[0], "</td>\n      <td class=\"text-center\">").concat(item[1], "</td>\n    </tr>");
  });
  var template = "<table class=\"table\" cellpadding=\"8\">\n    <thead>\n      <tr>\n        <th width=\"85%\">\u9910\u9EDE</th>\n        <th width=\"15%\">\u6578\u91CF</th>\n      </tr>\n    <thead>\n    <tbody>\n      ".concat(list, "\n    </tbody>    \n  </table>"); // console.log(template)

  totalList.innerHTML = template;
}

function init() {
  // console.log('getLoggedID():::', getLoggedID());
  if (getLoggedID()) {
    var localToken = localStorage.getItem('token');
    var AUTH = "Bearer ".concat(localToken);
    axios.defaults.headers.common.Authorization = AUTH;
    renderAdminMenu();
    renderTotalState(); //購物車
  }
  /* end of if-getLoggedID */


  btnUserMenu.addEventListener('click', function (event) {
    return logout(event);
  });
} // MAIN


init();
//# sourceMappingURL=renderAdminLayout.js.map
