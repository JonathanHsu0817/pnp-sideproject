"use strict";

var BASE_URL = 'http://localhost:3000'; // const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';

var USERS_URL = "".concat(BASE_URL, "/600/users");
var ORDERS_URL = "".concat(BASE_URL, "/660/orders?_expand=table");
var orderContent = document.querySelector(".order-content");
orderContent.addEventListener("click", function (e) {
  // console.log(e.target.nodeName)
  if (e.target.nodeName === "INPUT") {
    var targetInput = e.target.closest("input");

    if (targetInput.getAttribute(["deliverStatus"]) == null) {
      targetInput.setAttribute(["deliverStatus"], "checked");
      targetInput.parentNode.parentNode.classList.add('table-success');
      return;
    } else {
      targetInput.removeAttribute(["deliverStatus"]);
      targetInput.parentNode.parentNode.classList.remove('table-success');
      return;
    }
  } else if (e.target.nodeName === "BUTTON") {
    //注意
    var orderId = e.target.dataset.id;
    var AUTH = "Bearer ".concat(localStorage.getItem('token'));
    axios.defaults.headers.common.Authorization = AUTH;
    var url = "".concat(BASE_URL, "/660/orders/").concat(orderId);
    var data = {
      hasAllDelivered: true
    };
    axios.patch(url, data).then(function (res) {
      console.log("已刪除");
      sweetSuccess("完成~");
      getOrderData();
      renderTotalState();
    })["catch"](function (err) {
      console.log("再確認一下");
      sweetError("再確認一下喔");
    });
  } else {
    return;
  }
});

function renderCartList(data) {
  var str = "";
  data.forEach(function (item) {
    var createdAt = item.createdAt,
        products = item.products,
        hasAllDelivered = item.hasAllDelivered,
        table = item.table,
        id = item.id;
    var list = "";
    products.forEach(function (productItem) {
      var listItem = ""; //判斷訂單狀態

      var deliverStatus;
      listItem += "\n            <tr class=\"order-list\">\n                <td>".concat(productItem.title, "</td>\n                <td class=\"text-center\">").concat(productItem.quantity, "</td>\n                <td class=\"text-center\">\n                    <input data-id=\"\" type=\"checkbox\" class=\"form-check-input\" ").concat(deliverStatus, ">\n                </td>\n            </tr>");
      list += listItem;
    });
    var content = "<div class=\"col-6 col-md-4 col-lg-3\">\n            <div class=\"order bg-light\">\n                <div class=\"d-flex justify-content-around text-center pt-4 mb-4\">\n                    <h2 class=\"fs-4 lh-base mb-0\">\u684C\u865F\uFF1A".concat(table.area, "</h2>\n                    <button data-id=\"").concat(id, "\" class=\"btn btn-outline-primary btn-sm\">\u5B8C\u6210\u8A02\u55AE</button>\n                </div>\n                <div class=\"orderTime fs-8 ms-2\">\u8A02\u55AE\u6210\u7ACB\uFF1A").concat(switchTimeStamp(createdAt), "</div>\n                <table class=\"table table-hover\">\n                    <thead>\n                        <tr>\n                            <td class=\"fw-bold\" width=\"55%\">\u9910\u9EDE</td>\n                            <td class=\"fw-bold text-center\" width=\"22%\">\u6578\u91CF</td>\n                            <td class=\"fw-bold text-center\" width=\"22%\">\u51FA\u9910</td>\n                        </tr>\n                    <tbody class=\"align-middle\">\n                        ").concat(list, "\n                    </tbody>    \n                </table>\n            </div> \n        </div>\n        ");
    str += content;
  });
  orderContent.innerHTML = str;
}

function getOrderData() {
  var userId = getLoggedID();
  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH;
  var url = "".concat(ORDERS_URL);
  axios.get(url).then(function (res) {
    var orderData = res.data;
    var orderDataFiltered = orderData.filter(function (item) {
      return item.hasAllDelivered == false;
    }); // console.log(orderDataFiltered)

    renderCartList(orderDataFiltered);
  })["catch"](function (err) {
    console.log(err);
  });
}

function init() {
  getOrderData();
}

init(); //utillities function

function switchTimeStamp(timeStamp) {
  var thisStamp = new Date(timeStamp);
  var minutes = thisStamp.getMinutes() < 10 ? '0' + thisStamp.getMinutes() : thisStamp.getMinutes();
  var thisTime = "".concat(thisStamp.getFullYear(), "/").concat(thisStamp.getMonth() + 1, "/").concat(thisStamp.getDate(), " ").concat(thisStamp.getHours(), ":").concat(minutes);
  return thisTime;
}

new Sortable(orderContent, {
  ghostClass: 'blue-background-class',
  animation: 200
});
//# sourceMappingURL=admin.js.map
