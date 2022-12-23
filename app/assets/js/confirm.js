// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';

const USERS_URL = `${BASE_URL}/600/users`;
const CARTS_URL = `${BASE_URL}/600/carts`;

const confirmContent = document.querySelector(".confirm-content")

function getLoggedID() {
    return localStorage.getItem('userId') || 0;
  }

function getOrderData() {
    return localStorage.getItem('orders') || 0;
  }

//更改產品數量
confirmContent.addEventListener("click",(e)=>{
    // console.log(e.target)
    let btnSelected = e.target.nodeName
    if(btnSelected !=="BUTTON"){
        return
    }
    let btnChange = e.target.id;
    // console.log(btnChange);
    const inputNum = e.target.parentNode.childNodes[3];//抓input
    if(btnChange === "plus"){
        inputNum.value++
    }else if(btnChange === "minus"&&inputNum.value>1){
        inputNum.value--
    }
    let selectProductId = inputNum.dataset.id;
    patchCartNum(selectProductId,inputNum.value)
})

//patch 產品數量變動
function patchCartNum(targetId,num){
    const AUTH = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.common.Authorization = AUTH;
    const url = `${CARTS_URL}/${targetId}`;
    
    const data = {
        quantity: Number(num)
    }

    axios.patch(url,data)
    .then(res=>{
        console.log("餐點數量已更改~")
        renderCartState();
        renderConfirmStatus();
    })
    .catch(err=>{
        console.log('error:::', JSON.stringify(error, null, 2));
    })       
}

//組order資料
const btnSendOrder = document.querySelector(".js-sendOrder")

btnSendOrder.addEventListener("click",buildOrderList);

function buildOrderList(){
    const cartData = JSON.parse(getOrderData());

    //訂單單一餐點整理
    const orderItems = cartData.map(item=>{
        return {
            productId: item.product.id,
            quantity: item.quantity,
            title: item.product.title,
            price: item.product.price
        };
    })

    const orderTables = cartData.find(item=>{
        return item.tableId
    })
    const orderTablesId = `${orderTables.tableId}`;
    
    let sum = 0;
    let sumWithService = 0;
    cartData.forEach((item) => {
        const intQty = Number(item.quantity) || 0;
        const intPrice = Number(item.product.price);
        const total = intQty * intPrice;
        const totalWithServiceFee = (intQty * intPrice)+Math.round(intQty * intPrice * 0.1);
        sum += total;
        sumWithService += totalWithServiceFee;
    });

    //建立訂單資料
    const newOrder = {
        createdAt: Date.now(),
        tableId: orderTablesId,
        products: orderItems,
        payment: sum,
        paymentTaxIncluded: sumWithService,
        hasAllDelivered: false
    }
    // console.log(newOrder);
    sendOrderData(newOrder);
}

//送出order function
function sendOrderData(data){
    const userId = getLoggedID();

    const AUTH = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.common.Authorization = AUTH;

    const url = `${USERS_URL}/${userId}/orders`;

    //sweetAlert 確認餐點送出
    const swalWithBootstrapButtons = Swal.mixin({
        customClass:{
            confirmButton: 'btn btn-primary btn-text-white',
            cancelButton: "btn btn-outline-secondary"
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: '確定要送出嗎?',
        text: "訂單送出去就無法更改囉!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: '等等我有點後悔!',
        confirmButtonText: '對!我要送出!',
        reverseButtons: true,
        preConfirm:()=>{
            return axios.post(url, data)
            .then(res=>{
                console.log(res.data);

                //清空購物車(function寫在renderUserLayout.js)
                if (res.status === 201) {
                    const localCarts = localStorage.getItem('carts');
                    const carts = JSON.parse(localCarts);

                    // const AUTH = `Bearer ${localStorage.getItem('token')}`;
                    // axios.defaults.headers.common.Authorization = AUTH;

                    let arrayOfDelete = [];
                    carts.forEach((item) => {
                        const request = axiosDeleteCart(item.id);
                        arrayOfDelete.push(request);
                    });
                    console.log('arrayOfDelete:::', arrayOfDelete);

                    Promise.all(arrayOfDelete)
                    .then((results)=> {
                    console.log('results:::', results);

                  // results checker
                  if (results.length === arrayOfDelete.length) {
                    console.log('已全部刪除！');
                    setTimeout(() => {
                      console.log('Redirect!');
                      window.location.replace('https://jonathanhsu0817.github.io/pnp-sideproject/menu.html');
                    }, 1500);
                    /* end of setTimeout */
                  }
                })
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
            '已送出不復返!ヽ(●´∀`●)ﾉ',
            '稍後幫您製作餐點~',
            'success'
          )
        }
    })
}


//渲染確認畫面
function renderConfirmContent(data,sum){
    let content = "";
    let str = "";
    data.forEach(item =>{
        let template = `
        <tr class="fs-8 fs-md-6">
            <td class="py-md-4">${item.product.title}</td>
            <td class="py-md-4 text-center">$${toThousandsComma(item.product.price)}</td>
            <td class="py-md-4 text-center">
                <div class="d-flex col-md-6 col-12 ms-md-15">
                    <button type="button" id="minus" data-method="patch" class='btn btn-link text-decoration-none px-2' value="-">-</button>
                    <input data-id='${item.id}' name='quantity' type='number' value='${item.quantity}' min='1' class='form-control form-control-sm text-center' disabled/>
                    <button type="button" id="plus" data-method="patch" class='btn btn-link text-decoration-none px-2' value="+">+</button>
                </div>
            </td>
            <td class="py-md-4 text-end ">$${toThousandsComma(item.product.price*item.quantity)}</td>
        </tr>
        `
        str+=template;
    })

    let table = `
    <table class="table table-hover align-middle ">
        <thead>
            <tr>
                <th width="35%">餐點資訊</th>
                <th width="15%" class="text-center">價格</th>
                <th width="35%" class="text-center">數量</th>
                <th width="15%" class="text-end text-md-center">小計</th>
            </tr>
        </thead>
        <tbody>
            ${str}
        </tbody>
    </table>
    `
    content+=table;

    let chargeContent =`
    <div class="confirm-charge-content d-flex flex-column mb-16">
        <div class="d-flex align-items-center ms-auto mb-1">
            <h5 class="fs-7 fs-md-6 mb-0">小計金額：</h5>
            <span class="cart-charge-total text-primary fs-7 fs-md-6 ms-2">NT $${toThousandsComma(sum)}</span>
         </div>
        <div class="d-flex align-items-center  ms-auto mb-3">
            <h5 class="fs-8 fs-md-7 mb-0">服務費(10%)：</h5>
            <span class="cart-charge-total text-primary fs-8 fs-md-7 ms-2">NT $${toThousandsComma(Math.round(sum*0.1))}</span>
        </div>
        <div class="d-flex align-items-center ms-auto">
            <h5 class="fs-7 fs-md-6 mb-0">總共：</h5>
            <span class="cart-charge-total text-primary fs-7 fs-md-6">NT $${toThousandsComma(Math.round(sum*0.1)+sum)}</span>
        </div>
    </div>
    `
    content+=chargeContent;
    confirmContent.innerHTML = content;
}

//抓取購物車整理的資料
function renderConfirmStatus(){
    // const cartData = JSON.parse(getCartData())
    const userId = getLoggedID();

    const AUTH = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.common.Authorization = AUTH;

    const url = `${USERS_URL}/${userId}/carts?_expand=product&_expand=table`;

    getCartData(url)
  }
//取購物車api
function getCartData(url) {
    axios.get(url)
    .then(res=>{
        if (res.status === 200){
            const cartData = res.data;
            localStorage.setItem('orders', JSON.stringify(cartData));
            let sum = 0;
            let sumWithTax = 0;
            cartData.forEach((item) => {
            const intQty = Number(item.quantity);
            const intPrice = Number(item.product.price);
            const total = intQty * intPrice;
            sum += total;
            sumWithTax += (total + Math.round(total*0.1));
            })
            // console.log(cartData)
            renderConfirmContent(cartData,sum)
            // buildOrderList(cartData,sum,sumWithTax)
        }
    })
    .catch(err=>{
        console.log(err);
    })
}  

function init(){
    renderConfirmStatus();
  }

init()

//utillities
function　toThousandsComma(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
