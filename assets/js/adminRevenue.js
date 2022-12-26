"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var BASE_URL = 'http://localhost:3000'; // const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';

var ORDERS_URL = "".concat(BASE_URL, "/660/orders?_expand=table");

function sortingDataNum(data) {
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

function sortingDataPrice(data) {
  var filterData = [];
  data.forEach(function (item) {
    var products = item.products;
    products.forEach(function (productItem) {
      var obj = {
        product: productItem.title,
        quantity: productItem.quantity,
        price: productItem.price
      };
      filterData.push(obj);
    });
  });
  var total = {};
  filterData.forEach(function (goods) {
    var price = 0;

    if (!total[goods.product]) {
      price = goods.quantity * goods.price * 1.1;
      return total[goods.product] = Math.round(price);
    } else {
      price = total[goods.product] + goods.quantity * goods.price * 1.1;
      return total[goods.product] = Math.round(price);
    }
  });
  return total;
}

function renderC3Num(data) {
  //改成C3格式
  var totalItemC3 = Object.entries(data);
  totalItemC3.sort(function (a, b) {
    return b[1] - a[1];
  }); // console.log(totalItemC3)

  var otherItem = totalItemC3.filter(function (item, index) {
    return index > 2;
  }); // console.log(otherItem);

  var otherItemTotal = otherItem.reduce(function (prev, curr) {
    // console.log(prev[0]+curr[0]);
    return ["\u5176\u4ED6", prev[1] + curr[1]];
  });
  totalItemC3.splice(3, totalItemC3.length - 1);
  var newOtherTotalC3 = [].concat(_toConsumableArray(totalItemC3), [otherItemTotal]);
  var chart = c3.generate({
    bindto: '.chartNum',
    // HTML 元素綁定
    size: {
      width: 480
    },
    data: {
      type: "pie",
      columns: newOtherTotalC3
    },
    color: {
      pattern: ["#EC6D4E", "#FCE9E4", "#7889A3", "#c2c2c2"]
    }
  });
  return chart;
}

function renderC3Price(data) {
  //改成C3格式
  var totalItemC3 = Object.entries(data);
  totalItemC3.sort(function (a, b) {
    return b[1] - a[1];
  });
  var otherItem = totalItemC3.filter(function (item, index) {
    return index > 2;
  });
  var otherItemTotal = otherItem.reduce(function (prev, curr) {
    return ["\u5176\u4ED6", prev[1] + curr[1]];
  });
  totalItemC3.splice(3, totalItemC3.length - 1);
  var newOtherTotalC3 = [].concat(_toConsumableArray(totalItemC3), [otherItemTotal]);
  var chart1 = c3.generate({
    bindto: '.chartPrice',
    // HTML 元素綁定
    size: {
      width: 480
    },
    data: {
      type: "pie",
      columns: newOtherTotalC3
    },
    color: {
      pattern: ["#EC6D4E", "#FCE9E4", "#7889A3", "#c2c2c2"]
    }
  });
  return chart1;
}

function getOrderData() {
  var AUTH = "Bearer ".concat(localStorage.getItem('token'));
  axios.defaults.headers.common.Authorization = AUTH;
  var url = "".concat(ORDERS_URL);
  axios.get(url).then(function (res) {
    var orderData = res.data; // console.log(sortingDataNum(orderData));

    renderC3Num(sortingDataNum(orderData)); // console.log(sortingDataPrice(orderData));

    renderC3Price(sortingDataPrice(orderData));
  })["catch"](function (err) {
    console.log(err);
  });
}

function init() {
  getOrderData();
}

init();
//# sourceMappingURL=adminRevenue.js.map
