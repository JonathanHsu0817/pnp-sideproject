const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';
const LOGIN_URL = `${BASE_URL}/login`;
const USERS_URL = `${BASE_URL}/600/users`;
const PRODUCTS_URL = `${BASE_URL}/664/products`;
const TABLES_URL = `${BASE_URL}/644/tables`;
const CARTS_URL = `${BASE_URL}/600/carts`;

const formLogin = document.querySelector(".js-form-login");
const btnLogin = document.querySelector(".js-btn-login");
const btnUserMenu = document.querySelector('.js-user-selection');

let cartData = [];

////登入頁面

//存至localStorage
function saveUserToLocal({ accessToken, user }) {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('userId', user.id);
  localStorage.setItem('nickname', user.nickname);
}


function login() {
  console.log('Login!');

  const url = `${LOGIN_URL}`;

  const data = {
    email: formLogin.email.value.trim(),
    password: formLogin.password.value.trim(),
  };

  const hasInput = data.email && data.password;
  if (hasInput) {
    return axios
      .post(url, data)
      .then(function (response) {
        // console.log('login:::', JSON.stringify(response, null, 2));
        if (response.status === 200) {
          sweetSuccess("登入成功!", "歡迎光臨~")
          saveUserToLocal(response.data);

          let redirectPath = '/';
          // const isAdmin = response.data?.user?.role?.includes('admin');
          const isAdmin = response.data?.user?.role === 'admin';
          if (isAdmin) {
            redirectPath = 'admin.html';
          }

          setTimeout(() => {
            console.log('Redirect!');
            window.location.replace(redirectPath);
          }, 150);
          /* end of setTimeout */
        }
        /* end of response.OK */
      })
      .catch(function (error) {
        sweetError("登入失敗", "再重新試一試喔~")
        // console.log('error:::', JSON.stringify(error, null, 2));
      });
    /*  end of axios */
  }
  /* end of IF-hasInput */
}
btnLogin.addEventListener('click', () => login());

//判斷登入後渲染登入畫面
function getLoggedID() {
    return localStorage.getItem('userId') || 0;
}
  /* end of hasLogged() */

function templateOfUserMenu(user, template = '') {
    // console.log('me:::', JSON.stringify(user, null, 2));
    const isAdmin = user?.role === 'admin';
    if (isAdmin) {
      template = `
        <li class="nav-item">
            <div class="d-flex">
                <a href="./admin.html" class="d-block btn btn-outline-primary btn-bg-white me-2">
                前往後台
                </a>
            </div>
        </li>
      `;
    }
    /* end of (isAdmin) */

    template += `
          <li class="nav-item">
            <div class="d-flex">
                <select name="table-selection" id="table-selection" class="border-primary bg-backStage text-primary me-2">
                <option value="請選擇桌號">請選擇桌號</option>
                <option value="1">B1</option>
                <option value="2">B2</option>
                <option value="3">B3</option>
                <option value="4">B4</option>
                <option value="5">B5</option>
                <option value="6">B6</option>
                <option value="7">B7</option>
                <option value="8">B8</option>
                <option value="9">B9</option>
              </select>
                <a href="#" class="js-logout d-block btn btn-outline-primary btn-bg-white">
                登出
                </a>
            </div>
        </li>
    `;
    return template;
}
  /* end of templateOfUserMenu() */ 

  function renderUserMenu() {
    const userId = getLoggedID();
    const url = `${BASE_URL}/600/users/${userId}`;
  
    // console.log('url >>> ', url);
  
    axios.get(url)
    .then(function (response) {
        // console.log('GET-Me:::', JSON.stringify(response, null, 2));
        if (response.status === 200) {
          // console.log('OK!');
          document.querySelector('.js-user-selection').innerHTML = '';
          btnUserMenu.innerHTML = templateOfUserMenu(response.data);
        }
        /* end of res-OK */
    })
    .catch(function (error) {
        // console.log('error:::', JSON.stringify(error, null, 2));
        if (error?.response?.status === 401) {
            console.log('401');
            // localStorage.removeItem('myCat');
            localStorage.clear();
        }
    });
  }
  /* end of renderUserMenu() */  
  function logout(e) {
    const target = e.target;
    // console.log('target:::', target);
    const targetBtn = e.target.closest('.js-logout');
    // console.log('targetBtn:::', targetBtn);
    if (!targetBtn) {
      return;
    }
  
    localStorage.clear();
  
    setTimeout(() => {
      window.location.replace('/');
    }, 300);
    /* end of setTimeout */
  }
  /* end of logout(event) */  

//選取桌號值
btnUserMenu.addEventListener("click",(e)=>{
  let tableSelection=e.target.nodeName;
  if(tableSelection !== "SELECT"){
    return
  }
  let tableId = e.target.value;
  localStorage.setItem('tableId', tableId);
})

//購物車相關api
const cartList= document.querySelector(".cart-body");

cartList.addEventListener("click",(e)=>{
  let targetA = e.target.closest("a")
  console.log(targetA.childNodes[0].nodeName)
  if(!targetA){
    return
  }else if(targetA.childNodes[0].nodeName=="I"){//指定刪除(垃圾桶)
    let targetId = targetA.dataset.id;

    const AUTH = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.common.Authorization = AUTH;
  
    const url = `${CARTS_URL}/${targetId}`;
  
    axios.delete(url)
      .then(function (res) {
      // console.log('carts:::', JSON.stringify(res, null, 2));
        if (res.status === 200) {
          renderCartState();
        }
      })
      .catch(function (error) {
        console.log('error:::', JSON.stringify(error, null, 2));
      });

  // }else if(targetA.innerText=="清空購物車"){//刪除全部購物車
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
})

function axiosDeleteCart(cartId = 0) {
  const url = `${CARTS_URL}/${cartId}`;

  return axios.delete(url);
}


function renderCartState(){
  const userId = getLoggedID();

  const AUTH = `Bearer ${localStorage.getItem('token')}`;
  axios.defaults.headers.common.Authorization = AUTH;

  // const params = new URLSearchParams(document.location.search);
  // const productId = params.get('productId') || 1;

  // #Step-2.4
  const url = `${USERS_URL}/${userId}/carts?_expand=product`;

  axios.get(url)
  .then(res=>{
    if (res.status === 200) {
      const cartData = res.data;
      localStorage.setItem('carts', JSON.stringify(cartData));
      // console.log(cartData);
      //計算總金額
      let sum = 0;
      cartData.forEach((item) => {
      const intQty = Number(item.quantity);
      const intPrice = Number(item.product.price);
      const total = intQty * intPrice;
      sum += total;
    })
      //渲染購物車畫面
      renderCartList(cartData,sum)
    }
  })
  //加入購物車按扭寫在menu-hot.js & 各別product.js上(不同邏輯)
}

function renderCartList(data,total){
  let str ="";
  data.forEach(item=>{
    let list =`
    <div class="cart-card d-flex align-items-center border-bottom border-1 pb-4 mb-4">
      <img class="cart-img object-position-top me-2 me-md-3" src="${item.product.img}" alt="food_pic">
      <div class="card-content col-5">
        <p class="mb-2">${item.product.title}</p>
        <span class="text-primary">NT$${item.product.price}</span>
      </div>
      <div class="cart-num col-2 ms-2 ms-md-3">
        <input type="number" class="cart-input text-center lh-1 py-3" id="cart-input" value="${item.quantity}">
      </div>
      <a href="#" data-id="${item.id}" class="cart-delete d-block ms-4 ms-md-3"><i class="fas fa-trash-alt text-primary fs-4"></i></a>
    </div>`
    str+=list;
    });
  let cartFooter =`
    <div class="cart-charge-content d-flex mb-16">
      <div class="d-flex align-items-center ms-auto">
        <h5 class="mb-0">小計金額</h5>
        <span class="cart-charge-total text-primary fs-6 ms-3">NT$${total}</span>
      </div>
    </div>
    <div class="d-flex flex-column">
      <a href="#" class="btn btn-primary text-white round-0 py-3 mb-6">加點</a>
        <a href="#" class="js-deleteAllCart btn btn-outline-secondary border-0 round-0 align-self-center py-2 px-4 mb-4">清空購物車</a>
    </div>`;
  str+=cartFooter;

  cartList.innerHTML = str;
}

/**
 * #Step-0: after page refresh
 */
 function init() {
    // console.log('getLoggedID():::', getLoggedID());
    if (getLoggedID()) {
      const localToken = localStorage.getItem('token');
      const AUTH = `Bearer ${localToken}`;
  
      axios.defaults.headers.common.Authorization = AUTH;

      renderUserMenu();

      //購物車
      renderCartState();
    }
    /* end of if-getLoggedID */
    btnUserMenu.addEventListener('click', (event) => logout(event));
  }
  /* end of init() */
  
  // MAIN
  init();