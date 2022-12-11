"use strict";

//sweetAlert 成功
function sweetSuccess(title, text) {
  var timer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1500;
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    showConfirmButton: false,
    timer: timer
  });
} //sweetAlert 失敗


function sweetError(title, text) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    showConfirmButton: false,
    timer: 1500
  });
} //sweetAlert 右上角 小成功


function sweetSmallSuccess(title) {
  var timer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1500;
  var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    didOpen: function didOpen(toast) {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  Toast.fire({
    icon: 'success',
    title: title
  });
} //sweetAlert 資訊


function sweetInfo(title) {
  var timer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
  var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    didOpen: function didOpen(toast) {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  Toast.fire({
    icon: 'info',
    title: title
  });
}
//# sourceMappingURL=swal.js.map
