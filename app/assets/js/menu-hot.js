const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app/';
let BASE_PAGE = 1
// const BASE_PRODUCT_URL = `${BASE_URL}/664/products?_page=${BASE_PAGE}&_limit=6`;
const USERS_URL = `${BASE_URL}/600/users`;

function getLoggedID() {
  return localStorage.getItem('userId') || 0;
}

function getTableID() {
  return localStorage.getItem('tableId') || 0;
}

//在目錄加入購物車按扭
const productsContent = document.querySelector(".products-hot-content")
const userSelection = document.querySelector(".js-user-selection");
// console.log(userSelection);

productsContent.addEventListener("click",menuAddtoCart);

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
      window.location.replace('/login.html');
    }
  });
}

//渲染卡片
function templateOfProducts(products, template = ``) {
    // console.log('products:::', JSON.stringify(products, null, 2));
    products.forEach(function (item) {
        template += `
            <div class="col-md-4 col-sm-6">
                <div class="card border-0 shadow rounded-3 mb-4 position-relative">
                    <a href="./product.html?productId=${item.id}" data-id="${item.id}" class="overflow-hidden d-block"><img src="${item.img}" class="img-top img-fluid rounded-top" alt="food-picz"></a>
                    <div class="card-body d-flex flex-column align-items-center text-center">
                        <h3 class="fs-5 text-black">${item.title}</h3>
                        <span class="text-primary">NT $${item.price}</span>
                        <a href="#" data-id="${item.id}" class="js-addToCartBtn btn btn-outline-primary rounded-3 btn-text-white btn-xl mt-3">
                            加入購物車
                        </a>
                    </div>
                </div>    
            </div>
      `;
    });
    /* end of products.forEach() */
    return template;
  }


  //pagination切換
  const pagination = document.querySelector(".pagination")
  let totalPages = 5
  
  pagination.addEventListener("click",(e)=>{
    console.log(e.target)
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
    const url = `${BASE_URL}/664/products?_page=${page}&_limit=6`;
    axios
      .get(url)
      .then(function (response) {
        // console.log('GET-Products:::', JSON.stringify(response, null, 2));

        if (response.status === 200) {
          
          const productsData = response.data;
          productsContent.innerHTML = templateOfProducts(productsData);
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