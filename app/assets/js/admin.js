// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';
const USERS_URL = `${BASE_URL}/600/users`;
const ORDERS_URL = `${BASE_URL}/660/orders?_expand=table`;

const orderContent = document.querySelector(".order-content")

orderContent.addEventListener("click",(e)=>{
    // console.log(e.target.nodeName)
    if(e.target.nodeName==="INPUT"){
        let targetInput = e.target.closest("input");
        if(targetInput.getAttribute(["deliverStatus"])==null){
            targetInput.setAttribute(["deliverStatus"],"checked");
            targetInput.parentNode.parentNode.classList.add('table-success');
            return
        }else{
            targetInput.removeAttribute(["deliverStatus"]);
            targetInput.parentNode.parentNode.classList.remove('table-success');
            return
        }

    }else if(e.target.nodeName==="BUTTON"){
        //注意
        let orderId = e.target.dataset.id
        
        const AUTH = `Bearer ${localStorage.getItem('token')}`;
        axios.defaults.headers.common.Authorization = AUTH;

        const url = `${BASE_URL}/660/orders/${orderId}`
        
        const data = {
            hasAllDelivered: true
        }

        axios.patch(url,data)
        .then(res=>{
            console.log("已刪除")
            sweetSuccess("完成~")
            getOrderData()
            renderTotalState();
        })
        .catch(err=>{
            console.log("再確認一下")
            sweetError("再確認一下喔")
        })
    }else{
        return
    }
    
})

function renderCartList(data){
    let str = "";
    data.forEach(item=>{
        const {createdAt,products,hasAllDelivered,table,id} = item;
        let list = "";
        products.forEach(productItem=>{
            let listItem = "";

            //判斷訂單狀態
            let deliverStatus;

            listItem+=`
            <tr class="order-list">
                <td>${productItem.title}</td>
                <td class="text-center">${productItem.quantity}</td>
                <td class="text-center">
                    <input data-id="" type="checkbox" class="form-check-input" ${deliverStatus}>
                </td>
            </tr>`
            list+=listItem
        })
        let content = `<div class="col-6 col-md-4 col-lg-3">
            <div class="order bg-light">
                <div class="d-flex justify-content-around text-center pt-4 mb-4">
                    <h2 class="fs-4 lh-base mb-0">桌號：${table.area}</h2>
                    <button data-id="${id}" class="btn btn-outline-primary btn-sm">完成訂單</button>
                </div>
                <div class="orderTime fs-8 ms-2">訂單成立：${switchTimeStamp(createdAt)}</div>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <td class="fw-bold" width="55%">餐點</td>
                            <td class="fw-bold text-center" width="22%">數量</td>
                            <td class="fw-bold text-center" width="22%">出餐</td>
                        </tr>
                    <tbody class="align-middle">
                        ${list}
                    </tbody>    
                </table>
            </div> 
        </div>
        `
    str+=content;
    })
    orderContent.innerHTML = str;
}

function getOrderData(){
    const AUTH = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.common.Authorization = AUTH;

    const url = `${ORDERS_URL}`;

    axios.get(url)
    .then(res=>{
        const orderData = res.data
        const orderDataFiltered= orderData.filter(item=>{
           return item.hasAllDelivered == false;
        })
        // console.log(orderDataFiltered)
        renderCartList(orderDataFiltered);
    })
    .catch(err=>{
        console.log(err);
    })
}

function init(){
    getOrderData();
}

init();

//utillities function

function switchTimeStamp(timeStamp){
    const thisStamp = new Date(timeStamp);
    let minutes = thisStamp.getMinutes() < 10 ? '0' + thisStamp.getMinutes() : thisStamp.getMinutes();
    const thisTime = `${thisStamp.getFullYear()}/${thisStamp.getMonth()+1}/${thisStamp.getDate()} ${thisStamp.getHours()}:${minutes}`
    return thisTime;
}

new Sortable(orderContent,{
    ghostClass: 'blue-background-class',
    animation:200
})
