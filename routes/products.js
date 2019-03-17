var express = require('express');
var router = express.Router();
var sql=require("./../tool/sql.js")
const fileMd=require("./../tool/file.js")
const xlsxfile="./products.xlsx"

/* GET users listing. */
router.get('/', function(req, res, next) {
  let {pageCode,pageNumber}=req.query;
  pageCode=pageCode*1||1;//默认第一页
  pageNumber=pageNumber*1||8;//默认显示8条
  sql.find("sh1811","products",{}).then((data)=>{
    sql.distinct("sh1811","products","brand").then((brandArr)=>{
          let totalNumber=Math.ceil(data.length/pageNumber)
          data=data.splice((pageCode-1)*pageNumber,pageNumber)
          res.render('products',{
            activeIndex:3,
            routerType:"/products?",
            data,
            totalNumber,
            pageCode,
            pageNumber,
            brandArr,
          })
        })
      })
    })



router.get('/brand', function(req, res, next) {
  let {brand,pageCode,pageNumber}=req.query;
  pageCode=pageCode*1||1;//默认第一页
  pageNumber=pageNumber*1||8;//默认显示8条
  sql.find("sh1811","products",{brand}).then((data)=>{
    sql.distinct("sh1811","products","brand").then((brandArr)=>{
          let totalNumber=Math.ceil(data.length/pageNumber)
          data=data.splice((pageCode-1)*pageNumber,pageNumber)
          res.render('products',{
            activeIndex:3,
            routerType:"/products/brand?brand="+brand+"&",
            data,
            totalNumber,
            pageCode,
            pageNumber,
            brandArr,
          })
        })
      })
    })




router.get('/sort', function(req, res, next) {
  let {type,num,pageCode,pageNumber}=req.query;
  pageCode=pageCode*1||1;//默认第一页
  pageNumber=pageNumber*1||8;//默认显示8条
  num*=1
  let sortData={}
  sortData[type]=num
  sql.sort("qlb","products",sortData).then((data)=>{
    sql.distinct("sh1811","products","brand").then((brandArr)=>{
          let totalNumber=Math.ceil(data.length/pageNumber)
          data=data.splice((pageCode-1)*pageNumber,pageNumber)
          res.render('products',{
            activeIndex:3,
            routerType:"/products/sort?type="+type+"&&num="+num+"&",
            data,
            totalNumber,
            pageCode,
            pageNumber,
            brandArr,
          })
        })
      })
    })


router.get('/add', function(req, res, next) {
  let {pageNumber}=req.query
  res.render('products_add',{activeIndex:3,pageNumber});
});
router.post('/addAction', function(req, res, next) {
  console.log(req.body)
  var {brand,people,watchType,price,sale,idNum,pic,title,pageNumber}=req.body;
  price*=1;
  sale*=1;
  idNum*=1;
  sql.find("sh1811","products",{idNum}).then((data)=>{
    //如果查找不到则密码加密后添加到sql
      if(data.length==0){
        sql.insert("sh1811","products",{brand,people,watchType,price,sale,idNum,pic,title}).then(()=>{
          res.redirect('/products?pageNumber='+pageNumber)
        }).catch((err)=>{
          res.redirect('/products/add')
        })
        
      }
      //如果已经存在则跳回主界面
        else{res.redirect('/products/add')}
  }).catch((err)=>{
    if(err)throw err
    res.redirect('/products/add')
  })
});

// function analysisdata(){
//   return new Promise((resolve,reject)=>{
//     let obj=xlsx.parse(xlsxfile)
   
//     resolve(obj)
//   })
// }
// function filterData(data){
//   var arr=[]
//   data.map((item,index)=>{
//     if(index!=0){
//       arr.push({
//         tel:item[0],
//         nickname:item[1],
//         password:item[2]
//       })
//     }
//   })
  //console.log(arr)
//   return arr;
// }
router.get('/import',function(req,res,next){
  fileMd.analysisdata(xlsxfile).then((obj)=>{
      let data=obj[0].data
      data=fileMd.filterPro(data)
      // res.send(data)
       sql.insert("sh1811","products",data).then(()=>{
        res.redirect('/products')
       })
  })
})
router.get('/exportUsers',function(req,res,next){
  const _headers=[
    {caption:'brand',type:'string'},
    {caption:'idNum',type:'string'},
    {caption:'price',type:'string'},
    {caption:'sale',type:'string'},
    {caption:'watchType',type:'string'},
    {caption:'people',type:'string'},
    {caption:'pic',type:'string'},
    {caption:'title',type:'string'},
  ]
  sql.find("sh1811",'products',{}).then(data=>{
    let alldata=new Array()
    data.map((item,index)=>{
      let arr=[]
      arr.push(item.brand);
      arr.push(item.idNum);
      arr.push(item.price);
      arr.push(item.sale);
      arr.push(item.watchType);
      arr.push(item.people);
      arr.push(item.pic);
      arr.push(item.title);
      alldata.push(arr)
    })
    const result=fileMd.exportdata(_headers,alldata);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + "products.xlsx");
				res.end(result, 'binary');
  })
})

router.get('/removeAll',function(req,res,next){
  var {pageNumber}=req.query
  sql.remove("sh1811","products",{}).then(()=>{
  
    res.redirect('/products?pageNumber='+pageNumber)
  }).catch((err)=>{
    console.log(err)
  })
})

router.post('/updateAction',function(req,res,next){
  console.log(req.body)
  var {idNum,price,pic,sale,pageCode,pageNumber}=req.body
  price*=1;
  sale*=1;
  idNum*=1;
  sql.update("sh1811","products",'updateOne',{idNum},{$set: { price,pic,sale}}).then(()=>{
    console.log("update success")
    res.redirect('/products?pageCode='+pageCode+"&pageNumber="+pageNumber)
  }).catch((err)=>{
    console.log(err)
    res.redirect('/products')
  })
})

router.get('/remove',function(req,res,next){
  var {idNum,pageCode,pageNumber}=req.query
  idNum*=1;
  sql.remove("sh1811","products",{idNum}).then(()=>{
    res.redirect('/products?pageCode='+pageCode+"&pageNumber="+pageNumber)
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/removeAll',function(req,res,next){
  var {pageNumber}=req.query
  sql.remove("sh1811","products",{}).then(()=>{
  
    res.redirect('/products?pageNumber='+pageNumber)
  }).catch((err)=>{
    console.log(err)
  })
})
router.get('/search', function(req, res, next) {
  let {pageCode,pageNumber,title}=req.query;
  pageCode=pageCode*1||1;//默认第一页
  pageNumber=pageNumber*1||8;//默认显示8条
  sql.find("sh1811","products",{"title":eval('/'+title+'/')}).then((data)=>{
    sql.distinct("sh1811","products","brand").then((brandArr)=>{
            let totalNumber=Math.ceil(data.length/pageNumber)
            data=data.splice((pageCode-1)*pageNumber,pageNumber)
            res.render('products',{
              activeIndex:3,
              routerType:"/products",
              data,
              totalNumber,
              pageCode,
              pageNumber,
              brandArr,
            })
          })
        })  
     })


module.exports = router;
