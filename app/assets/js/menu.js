const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';
let BASE_PAGE = 1
// const BASE_PRODUCT_URL = `${BASE_URL}/664/products?_page=${BASE_PAGE}&_limit=6`;
const USERS_URL = `${BASE_URL}/660/users`;


function getLoggedID() {
  return localStorage.getItem('userId') || 0;
}

function getTableID() {
  return localStorage.getItem('tableId') || 0;
}

function getCategory() {
  return localStorage.getItem('category') || 0;
}

const menuPage = document.querySelector(".menu-container");
// console.log(menuPage)

//在目錄加入購物車按扭
// const productsContent = document.querySelector(".products-hot-content")
const userSelection = document.querySelector(".js-user-selection");
// console.log(userSelection);

menuPage.addEventListener("click",menuAddtoCart);

function menuAddtoCart(e) {
  let addBtnInMenu = e.target.innerText;
  let selectedImg = e.target.nodeName
  if(selectedImg=="IMG"){
    let productId = e.target.parentNode.dataset.id;
    localStorage.setItem('productId', productId) || 0;
  }
  if(addBtnInMenu == "加入購物車"){
    let productId = e.target.dataset.id;
    let userId = getLoggedID();
    let tableId = getTableID();

    //確認購物車是否有重複
    const AUTH = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.common.Authorization = AUTH;

    const data = {
      userId: userId,
      productId: productId,
      tableId: tableId,
      quantity: 1
    }
    const url = `${USERS_URL}/${userId}/carts`;

    postToCart(url,data);
  }
}

function postToCart(url,data){
  axios.post(url, data)
  .then(function (response) {
  // console.log('carts:::', JSON.stringify(response, null, 2))
    if (response.status === 201) {
    renderCartState();
    sweetSmallSuccess("成功加入購物車~~")
    }
  })
  .catch(function (error) {
    console.log('error:::', JSON.stringify(error, null, 2));

    if (error?.response?.status === 401) {
      console.log('401');
      localStorage.clear();
      window.location.replace('./index.html');
    }
  });
}

//渲染卡片
function templateOfProducts(products, template = ``) {
    // console.log('products:::', JSON.stringify(products, null, 2));
    let list = "";
    products.forEach(function (item) {
      list += `
          <div class="col-md-4 col-6 mb-4">
              <div class="card border-0 shadow rounded-3 position-relative h-100">
                  <a href="./product.html?productId=${item.id}" data-id="${item.id}" class="overflow-hidden d-block"><img src="${item.img}" class="img-top img-fluid rounded-top" alt="food-picz"></a>
                  <div class="card-body d-flex flex-column align-items-center text-center">
                      <h3 class="fs-5 text-black">${item.title}</h3>
                      <span class="text-primary mb-2">NT $${toThousandsComma(item.price)}</span>
                      <a href="#" data-id="${item.id}" class="js-addToCartBtn btn btn-outline-primary rounded-3 btn-text-white btn-xl mt-3 mt-auto">
                          加入購物車
                      </a>
                  </div>
              </div>    
          </div>
    `;
  });
    // products.find(item=>{
    //   return item.category
    // })
    // console.log(products)
    // if(products.category==undefined){
    //   products.category=`熱門餐點`;
    //   products.category_e = `Popular Dishes`
    // }
    let page =`
    <nav>
      <div class="d-flex justify-content-center py-7">
        <h2 class="nav-title mb-0 pb-2">熱門餐點<span class="font-monospace text-primary fs-7 ms-4">Popular Dishes</span></h3>
      </div>
    </nav>
    <div class="row mb-0 products-hot-content">
      ${list}
    </div>
    `
    template += page
    
    /* end of products.forEach() */
    return template;
  }

  //pagination切換
  const pagination = document.querySelector(".pagination")
  let totalPages = 5
  
  pagination.addEventListener("click",(e)=>{
    // console.log(e.target)
    if(e.target.innerText=="»"){
      BASE_PAGE++
    }else if(e.target.innerText=="«"){
      BASE_PAGE--
    }else{
      BASE_PAGE = e.target.innerText
    }
    renderProducts(BASE_PAGE);
  })

  function element(totalPages,page){
    let liTag = '';
    let beforePages = page-1;
    let pageActive;
    let afterPages = page+1
    if(page>1){
      liTag += `<li class="page-item" onclick="element(totalPages,${page-1})"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`
    }
    if(page>2){
      liTag += `<li class="page-item" onclick="element(totalPages,1)"><a class="page-link" href="#">1</a></li>`
    }
    if(page>3){
      liTag += `<li class="page-item"><a class="page-link" href="#">...</a></li>`
    }
    //顯示多少頁面
    if(page == totalPages){
      beforePages-=1;
    }else if(page == 1){
      afterPages+=1;
    }
    
    for(let pageLength = beforePages; pageLength<=afterPages;pageLength++){
      if(pageLength>totalPages){
        continue;
      }
      if(pageLength==0){
        pageLength++;
      }
      if(page == pageLength){
        pageActive = 'active';
      }else{
        pageActive ='';
      }
      liTag += `<li class="page-item ${pageActive}" onclick="element(totalPages,${pageLength})"><a class="page-link" href="#">${pageLength}</a></li>`
    }
    if(page<totalPages-1){
      if(page<totalPages-2){
        liTag += `<li class="page-item" onclick="element(totalPages,${totalPages-1})"><a class="page-link" href="#">...</a></li>`
      }
      liTag += `<li class="page-item" onclick="element(totalPages,${totalPages})""><a class="page-link" href="#">${totalPages}</a></li>`
    }
    if(page<totalPages){
      liTag += `<li class="page-item" onclick="element(totalPages,${page+1})"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`
    }
    pagination.innerHTML = liTag;
  }
  
function renderProducts(page) {
    let category = getCategory();
    (!category)? category=``:category = `category=${getCategory()}&`;
    const url = `${BASE_URL}/products?${category}_page=${page}&_limit=6`;
    axios
      .get(url)
      .then(function (response) {
        // console.log('GET-Products:::', JSON.stringify(response, null, 2));

        if (response.status === 200) {
          
          let productsData  = response.data;
          // console.log(productsData)
          menuPage.innerHTML = templateOfProducts(productsData);
        }
      })

      .catch(function (error) {
        // console.log('error:::', JSON.stringify(error, null, 2));
       alert(error?.response?.status || error); 
      });

    /*  end of axios */
  }

  function init(){
    element(totalPages,1)
    renderProducts(BASE_PAGE);
  }
  
  init();

//utillities
function　toThousandsComma(num){
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}