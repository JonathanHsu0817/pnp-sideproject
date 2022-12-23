const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';
const LOGIN_URL = `${BASE_URL}/login`;
const USERS_URL = `${BASE_URL}/600/users`;
const ORDERS_URL = `${BASE_URL}/660/orders?_expand=table`;

const formLogin = document.querySelector(".js-form-login");
const btnLogin = document.querySelector(".js-btn-login");
const btnUserMenu = document.querySelector('.js-user-selection');



function saveUserToLocal({ accessToken, user }) {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('userId', user.id);
  localStorage.setItem('nickname', user.nickname);
}
//登入
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

function getLoggedID() {
    return localStorage.getItem('userId') || 0;
}

function templateOfAdminMenu(user, template = '') {
    // console.log('me:::', JSON.stringify(user, null, 2));
    const isAdmin = user?.role === 'admin';
    if (isAdmin) {
      template = `
        <li class="nav-item">
            <div class="d-flex">
                <a href="./index.html" class="d-block btn btn-outline-primary btn-bg-white me-2">
                前往前台
                </a>
            </div>
        </li>
      `;
    }
    /* end of (isAdmin) */
    template += `
          <li class="nav-item">
            <div class="d-flex">
                <a href="#" class="js-logout d-block btn btn-outline-primary btn-bg-white">
                登出
                </a>
            </div>
        </li>
    `;
    return template;
}

function renderAdminMenu() {
    const userId = getLoggedID();
    const url = `${BASE_URL}/600/users/${userId}`;

    axios.get(url)
    .then(function (response) {
        // console.log('GET-Me:::', JSON.stringify(response, null, 2));
        if (response.status === 200) {
          // console.log('OK!');
          document.querySelector('.js-user-selection').innerHTML = '';
          btnUserMenu.innerHTML = templateOfAdminMenu(response.data);
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
//總計未出餐
const totalList = document.querySelector(".total-content")

function renderTotalState(){
  const AUTH = `Bearer ${localStorage.getItem('token')}`;
  axios.defaults.headers.common.Authorization = AUTH;

  // #Step-2.4
  const url = `${ORDERS_URL}`;

  axios.get(url)
  .then(res=>{
    if (res.status === 200) {
      const cartData = res.data;
      // console.log(cartData);
      const cartDataFiltered = cartData.filter(item=>{
        return item.hasAllDelivered == false;
      })
      //整理數值
      
      renderTotalList(sortingData(cartDataFiltered))
      // renderTotalList(cartData,sum)
    }
  })
  //加入購物車按扭寫在menu-hot.js & 各別product.js上(不同邏輯)
}

function sortingData(data){
  let filterData = []
  data.forEach(item=>{
    const {products} = item;
    products.forEach(productItem=>{
      let obj = {
        product: productItem.title,
        quantity: productItem.quantity
      }
      filterData.push(obj)
    })
  })
  let total = {};
  filterData.forEach(goods=>{
    let num = 0
    if(!total[goods.product]){
      num = goods.quantity*1
      return total[goods.product] = num
    }else{
      num = total[goods.product]+goods.quantity*1
      return total[goods.product] = num
    }
  })
  return total
}

function renderTotalList(data){
  const arr = Object.entries(data)
  let list= "";
  arr.sort().forEach(item=>{
    list +=`<tr>
      <td width="55">${item[0]}</td>
      <td class="text-center">${item[1]}</td>
    </tr>`
  })
  let template =`<table class="table" cellpadding="8">
    <thead>
      <tr>
        <th width="85%">餐點</th>
        <th width="15%">數量</th>
      </tr>
    <thead>
    <tbody>
      ${list}
    </tbody>    
  </table>`
  // console.log(template)
  totalList.innerHTML = template;
}

function init() {
    // console.log('getLoggedID():::', getLoggedID());
    if (getLoggedID()) {
      const localToken = localStorage.getItem('token');
      const AUTH = `Bearer ${localToken}`;
  
      axios.defaults.headers.common.Authorization = AUTH;

      renderAdminMenu();
      renderTotalState();

      //購物車
    }
    /* end of if-getLoggedID */
    btnUserMenu.addEventListener('click', (event) => logout(event));
}
  
  // MAIN
  init();