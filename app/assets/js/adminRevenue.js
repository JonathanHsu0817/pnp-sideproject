// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://sideproject-pnp-json-server-vercel.vercel.app';

const ORDERS_URL = `${BASE_URL}/660/orders?_expand=table`;

function sortingDataNum(data){
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

  function sortingDataPrice(data){
    let filterData = []
    data.forEach(item=>{
      const {products} = item;
      products.forEach(productItem=>{
        let obj = {
          product: productItem.title,
          quantity: productItem.quantity,
          price: productItem.price
        }
        filterData.push(obj)
      })
    })
    let total = {};
    filterData.forEach(goods=>{
      let price = 0
      if(!total[goods.product]){
        price = goods.quantity*goods.price*1.1
        return total[goods.product] = Math.round(price)
      }else{
        price = total[goods.product]+goods.quantity*goods.price*1.1
        return total[goods.product] = Math.round(price)
      }
    })
    return total
  }

function renderC3Num(data){
    //改成C3格式
    let totalItemC3 = Object.entries(data)
    totalItemC3.sort((a,b)=>{
        return b[1]-a[1]
    })
    console.log(totalItemC3)
    

    let otherItem = totalItemC3.filter((item,index)=>{
        return index>2
    })
    // console.log(otherItem);
    let otherItemTotal = otherItem.reduce((prev,curr)=>{
        // console.log(prev[0]+curr[0]);
        return [`其他`,prev[1]+curr[1]]
    })
    totalItemC3.splice(3,totalItemC3.length-1)
    let newOtherTotalC3 = [...totalItemC3,...[otherItemTotal]];
    
    let chart = c3.generate({
        bindto: '.chartNum', // HTML 元素綁定
        size:{
            width:480
        },
        data: {
            type: "pie",
            columns: newOtherTotalC3,
        },
        color:{ 
            pattern: ["#EC6D4E","#FCE9E4","#7889A3","#c2c2c2"]
        }
    });
    return chart;
}

function renderC3Price(data){
    //改成C3格式
    let totalItemC3 = Object.entries(data)
    totalItemC3.sort((a,b)=>{
        return b[1]-a[1]
    })
    let otherItem = totalItemC3.filter((item,index)=>{
        return index>2
    })
    let otherItemTotal = otherItem.reduce((prev,curr)=>{
        return [`其他`,prev[1]+curr[1]]
    })

    totalItemC3.splice(3,totalItemC3.length-1)

    let newOtherTotalC3 = [...totalItemC3,...[otherItemTotal]];
    
    let chart1 = c3.generate({
        bindto: '.chartPrice', // HTML 元素綁定
        size:{
            width:480
        },
        data: {
            type: "pie",
            columns: newOtherTotalC3,
        },
        color:{ 
            pattern: ["#EC6D4E","#FCE9E4","#7889A3","#c2c2c2"]
        }
    });
    return chart1;
}

function getOrderData(){
    const AUTH = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.common.Authorization = AUTH;

    const url = `${ORDERS_URL}`;

    axios.get(url)
    .then(res=>{
        const orderData = res.data
        // console.log(sortingDataNum(orderData));
        renderC3Num(sortingDataNum(orderData))
        // console.log(sortingDataPrice(orderData));
        renderC3Price(sortingDataPrice(orderData))
    })
    .catch(err=>{
        console.log(err);
    })
}

function init(){
    getOrderData()
}

init();