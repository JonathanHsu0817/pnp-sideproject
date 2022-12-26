"use strict";

var BASE_URL = 'http://localhost:3000'; // const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';

var USERS_URL = "".concat(BASE_URL, "/660/users");
var CARTS_URL = "".concat(BASE_URL, "/660/carts");
var confirmContent = document.querySelector(".confirm-content");

function getLoggedID() {
  return localStorage.getItem('userId') || 0;
}

function getOrderData() {
  return localStorage.getItem('orders') || 0;
} //更改產品數量


confirmContent.addEventListener("click", function (e) {
  // console.log(e.target)
  var btnSelected = e.target.nodeName;

  if (btnSelected !== "BUTTON") {
    return;
  }

  var btnChange = e.target.id; // console.log(btnChange);

  var inputNum = e.target.parentNode.childNodes[3]; //抓input

  if (btnChange === "plus") {
    inputNum.value++;
  } else if (btnChange === "minus" && inputNum.value > 1) {
    inputNum.value--;
  }

  var selectProductId = inputNum.dataset.id;
  patchCartNum(selectProductId, inputNum.value);
}); //patch 產品數量變動

function patchCartNum(targetId, num) {
  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH;
  var url = "".concat(CARTS_URL, "/").concat(targetId);
  var data = {
    quantity: Number(num)
  };
  axios.patch(url, data).then(function (res) {
    console.log("餐點數量已更改~");
    renderCartState();
    renderConfirmStatus();
  })["catch"](function (err) {
    console.log('error:::', JSON.stringify(error, null, 2));
  });
} //組order資料


var btnSendOrder = document.querySelector(".js-sendOrder");
btnSendOrder.addEventListener("click", buildOrderList);

function buildOrderList() {
  var cartData = JSON.parse(getOrderData()); //訂單單一餐點整理

  var orderItems = cartData.map(function (item) {
    return {
      productId: item.product.id,
      quantity: item.quantity,
      title: item.product.title,
      price: item.product.price
    };
  });
  var orderTables = cartData.find(function (item) {
    return item.tableId;
  });
  var orderTablesId = "".concat(orderTables.tableId);
  var sum = 0;
  var sumWithService = 0;
  cartData.forEach(function (item) {
    var intQty = Number(item.quantity) || 0;
    var intPrice = Number(item.product.price);
    var total = intQty * intPrice;
    var totalWithServiceFee = intQty * intPrice + Math.round(intQty * intPrice * 0.1);
    sum += total;
    sumWithService += totalWithServiceFee;
  }); //建立訂單資料

  var newOrder = {
    createdAt: Date.now(),
    tableId: orderTablesId,
    products: orderItems,
    payment: sum,
    paymentTaxIncluded: sumWithService,
    hasAllDelivered: false
  }; // console.log(newOrder);

  sendOrderData(newOrder);
} //送出order function


function sendOrderData(data) {
  var userId = getLoggedID();
  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH;
  var url = "".concat(USERS_URL, "/").concat(userId, "/orders"); //sweetAlert 確認餐點送出

  var swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary btn-text-white',
      cancelButton: "btn btn-outline-secondary"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: '確定要送出嗎?',
    text: "訂單送出去就無法更改囉!",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: '等等我有點後悔!',
    confirmButtonText: '對!我要送出!',
    reverseButtons: true,
    preConfirm: function preConfirm() {
      return axios.post(url, data).then(function (res) {
        console.log(res.data); //清空購物車(function寫在renderUserLayout.js)

        if (res.status === 201) {
          var localCarts = localStorage.getItem('carts');
          var carts = JSON.parse(localCarts); // const AUTH = `Bearer ${localStorage.getItem('token')}`;
          // axios.defaults.headers.common.Authorization = AUTH;

          var arrayOfDelete = [];
          carts.forEach(function (item) {
            var request = axiosDeleteCart(item.id);
            arrayOfDelete.push(request);
          });
          console.log('arrayOfDelete:::', arrayOfDelete);
          Promise.all(arrayOfDelete).then(function (results) {
            console.log('results:::', results); // results checker

            if (results.length === arrayOfDelete.length) {
              console.log('已全部刪除！');
              setTimeout(function () {
                console.log('Redirect!'); //   window.location.replace('https://jonathanhsu0817.github.io/pnp-sideproject/menu.html');

                window.location.replace('./menu.html');
              }, 1500);
              /* end of setTimeout */
            }
          });
        }
      })["catch"](function (err) {
        console.log(err);
      });
    }
  }).then(function (result) {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire('已送出不復返!ヽ(●´∀`●)ﾉ', '稍後幫您製作餐點~', 'success');
    }
  });
} //渲染確認畫面


function renderConfirmContent(data, sum) {
  var content = "";
  var str = "";
  data.forEach(function (item) {
    var template = "\n        <tr class=\"fs-8 fs-md-6\">\n            <td class=\"py-md-4\">".concat(item.product.title, "</td>\n            <td class=\"py-md-4 text-center\">$").concat(toThousandsComma(item.product.price), "</td>\n            <td class=\"py-md-4 text-center\">\n                <div class=\"d-flex col-md-6 col-12 ms-md-15\">\n                    <button type=\"button\" id=\"minus\" data-method=\"patch\" class='btn btn-link text-decoration-none px-2' value=\"-\">-</button>\n                    <input data-id='").concat(item.id, "' name='quantity' type='number' value='").concat(item.quantity, "' min='1' class='form-control form-control-sm text-center' disabled/>\n                    <button type=\"button\" id=\"plus\" data-method=\"patch\" class='btn btn-link text-decoration-none px-2' value=\"+\">+</button>\n                </div>\n            </td>\n            <td class=\"py-md-4 text-end \">$").concat(toThousandsComma(item.product.price * item.quantity), "</td>\n        </tr>\n        ");
    str += template;
  });
  var table = "\n    <table class=\"table table-hover align-middle \">\n        <thead>\n            <tr>\n                <th width=\"35%\">\u9910\u9EDE\u8CC7\u8A0A</th>\n                <th width=\"15%\" class=\"text-center\">\u50F9\u683C</th>\n                <th width=\"35%\" class=\"text-center\">\u6578\u91CF</th>\n                <th width=\"15%\" class=\"text-end text-md-center\">\u5C0F\u8A08</th>\n            </tr>\n        </thead>\n        <tbody>\n            ".concat(str, "\n        </tbody>\n    </table>\n    ");
  content += table;
  var chargeContent = "\n    <div class=\"confirm-charge-content d-flex flex-column mb-16\">\n        <div class=\"d-flex align-items-center ms-auto mb-1\">\n            <h5 class=\"fs-7 fs-md-6 mb-0\">\u5C0F\u8A08\u91D1\u984D\uFF1A</h5>\n            <span class=\"cart-charge-total text-primary fs-7 fs-md-6 ms-2\">NT $".concat(toThousandsComma(sum), "</span>\n         </div>\n        <div class=\"d-flex align-items-center  ms-auto mb-3\">\n            <h5 class=\"fs-8 fs-md-7 mb-0\">\u670D\u52D9\u8CBB(10%)\uFF1A</h5>\n            <span class=\"cart-charge-total text-primary fs-8 fs-md-7 ms-2\">NT $").concat(toThousandsComma(Math.round(sum * 0.1)), "</span>\n        </div>\n        <div class=\"d-flex align-items-center ms-auto\">\n            <h5 class=\"fs-7 fs-md-6 mb-0\">\u7E3D\u5171\uFF1A</h5>\n            <span class=\"cart-charge-total text-primary fs-7 fs-md-6\">NT $").concat(toThousandsComma(Math.round(sum * 0.1) + sum), "</span>\n        </div>\n    </div>\n    ");
  content += chargeContent;
  confirmContent.innerHTML = content;
} //抓取購物車整理的資料


function renderConfirmStatus() {
  // const cartData = JSON.parse(getCartData())
  var userId = getLoggedID();
  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH;
  var url = "".concat(USERS_URL, "/").concat(userId, "/carts?_expand=product&_expand=table");
  getCartData(url);
} //取購物車api


function getCartData(url) {
  axios.get(url).then(function (res) {
    if (res.status === 200) {
      var cartData = res.data;
      localStorage.setItem('orders', JSON.stringify(cartData));
      var sum = 0;
      var sumWithTax = 0;
      cartData.forEach(function (item) {
        var intQty = Number(item.quantity);
        var intPrice = Number(item.product.price);
        var total = intQty * intPrice;
        sum += total;
        sumWithTax += total + Math.round(total * 0.1);
      }); // console.log(cartData)

      renderConfirmContent(cartData, sum); // buildOrderList(cartData,sum,sumWithTax)
    }
  })["catch"](function (err) {
    console.log(err);
  });
}

function init() {
  renderConfirmStatus();
}

init(); //utillities

function toThousandsComma(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//# sourceMappingURL=confirm.js.map
