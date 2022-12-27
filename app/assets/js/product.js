// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';

const USERS_URL = `${BASE_URL}/660/users`;
const PRODUCTS_URL = `${BASE_URL}/products`;
let id = 1;

const productsItemsContent = document.querySelector(".productsContent");
const swiperProduct = document.querySelector('.js-swiper-product')

swiperProduct.addEventListener('click',getTargetproductId)

function getTargetproductId(e){
  // e.preventDefault();
  const targetID = e.target.closest("A").dataset.id;
  localStorage.setItem('productId', targetID) || 0;
}

function getLoggedID() {
    return localStorage.getItem('userId') || 0;
  }
  
function getTableID() {
    return localStorage.getItem('tableId') || 0;
  }

function getProductID() {
    return localStorage.getItem('productId') || 0;
  }


function templateOfProductsItem(products, template = ``) {
    // console.log('products:::', JSON.stringify(products, null, 2));
        template += `
        <div class="col-md-6 pe-md-0">
            <div class="overflow-hidden">
                <img src="${products.img}" class="img-fluid " alt="food.png">
            </div>
        </div>
        <div class="col-md-6">
            <div class="description d-flex flex-column h-100 text-primary p-3 px-md-0 pt-0 pb-3 pb-md-0" >
                <span class="text-secondary mt-3">${products.category}</span>
                <h2 class="description-title text-primary mb-5">${products.title}</h2>
                <p class="description-content text-black mb-5">${products.description}</p>
                <h3 class="fs-8 text-black mb-auto"><i class="fas fa-genderless"></i> 主食材：${products.main}</h3>
                <p class="mb-3">價錢：NT $${products.price}</p>

                <div class="input-group">
                    <button class="btn btn-outline-primary btn-text-primary " type="button" id="button-minus">-</button>
                    <input type="number" class="form-num text-center border-1 border-primary bg-backStage text-primary flex-fill" value="${products.quantity}">
                    <button class="btn btn-outline-primary btn-text-primary" type="button" id="button-plus">+</button>
                </div>
                <a href="#" class="js-addCartBtn btn btn-outline-primary btn-text-primary -mt-xs-1">加入購物車</a>
            </div>
        </div>
        `;
    
    /* end of products.forEach() */
    return template;
  }


//數字加減操作&加入購物車
productsItemsContent.addEventListener("click",(e)=>{
    const inputNum = document.querySelector(".form-num")
    if(e.target.nodeName=="BUTTON"){
        if(e.target.getAttribute("id")=="button-minus"&&inputNum.value>1){
            inputNum.value--;
        }else if(e.target.getAttribute("id")=="button-plus"){
            inputNum.value++;
        }
    }

    if(e.target.getAttribute("class")!=="js-addCartBtn btn btn-outline-primary btn-text-primary -mt-xs-1"){
        return
    }
    let userId = getLoggedID();
    let productId = getProductID();
    let tableId = getTableID();

    const data = {
        userId: userId,
        productId: productId,
        tableId: tableId,
        quantity: Number(inputNum.value)
      }
    // console.log(data);
    const url = `${USERS_URL}/${userId}/carts`;
  
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
        window.location.replace('https://github.com/jonathanHsu0817/pnp-sideproject/index.html');
        // window.location.replace('./login.html');
        }
    });
})
 
function renderProductsPage() {
    const productId = getProductID();

    const url = `${PRODUCTS_URL}/${productId}`;

    axios
      .get(url)
      .then(function (response) {
        // console.log('GET-Products:::', JSON.stringify(response, null, 2));

        if (response.status === 200) {
          const productsItemData = response.data;
        //   console.log(productsItemData);
          productsItemsContent.innerHTML = templateOfProductsItem(productsItemData);
        }
      })

      .catch(function (error) {
        // console.log('error:::', JSON.stringify(error, null, 2));
       alert(error?.response?.status || error); 
      });

    /*  end of axios */
  }

  function init(){
    renderProductsPage();
  }
  
  init();