const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app/';

const swiperHot = document.querySelector('.js-swiper-hot')
// console.log(swiperHot);

swiperHot.addEventListener('click',getTargetproductId)

function getTargetproductId(e){
    const targetID = e.target.closest(".img-info-background").parentNode.dataset.id
    localStorage.setItem('productId', targetID) || 0;
}

function getProductID() {
    return localStorage.getItem('productId') || 0;
  }

function templateOfSwipers(products, template = ``) {
    // console.log('products:::', JSON.stringify(products, null, 2));
    products.forEach(function (item) {
        template += `
        <div class="swiper-slide">
            <a href="./product.html?productId=${item.id}" data-id="${item.id}" class="img-info d-block">
            <img src="${item.img}" class="img-fluid rounded-3" alt="food_pic">
            <div class="img-info-background bg-transparent opacity-0">
                <div class="img-info-content justify-content-end">
                <h4 class="fs-5 fs-md-4 lh-base mb-0 text-white">${item.title}</h4>
                </div>
            </div>
            </a>
        </div>
        `;
    });
    /* end of products.forEach() */
    return template;
  }

function renderSwiper() {
    const url = `${BASE_URL}/products?id=2&id=3&id=5&id=6`;
    axios
      .get(url)
      .then(function (response) {
        // console.log('GET-Products:::', JSON.stringify(response, null, 2));

        if (response.status === 200) {
          
          const productsData = response.data;
          swiperHot.innerHTML = templateOfSwipers(productsData);
        }
      })

      .catch(function (error) {
        // console.log('error:::', JSON.stringify(error, null, 2));
       alert(error?.response?.status || error); 
      });

    /*  end of axios */
  }

function init(){
    renderSwiper();
  }
  
  init();