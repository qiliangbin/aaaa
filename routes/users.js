var express = require('express');
var router = express.Router();
let sql = require('./../tool/sql')
var filemd = require('./../tool/file');
var mongo = require('mongodb');
var xlsx = require('node-xlsx');
var md5 = require('md5');
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   sql.find('qlb', 'users', {}).then(data => {
//     res.render('users', {
//       activeIndex : 3,
//       data     //  data <=> data:data
//     })
//   }).catch(err => {
//     console.log(err)
//   })
// });

router.get('/', (req, res, next) => {
  let { pageCode, pageNumber } = req.query;
  pageCode = pageCode * 1 || 1;   //字符串转数字   默认第一页
  pageNumber = pageNumber * 1 || 8;  //默认每页8个'
  sql.find('qlb', 'users', {}).then(data => {
    const totalNumber = Math.ceil(data.length / pageNumber);
    data = data.splice((pageCode - 1) * pageNumber, pageNumber)
      sql.distinct('qlb', 'users', 'age').then(ageArr => {
        res.render('users', {
          activeIndex : 3,
          pageCode,
          totalNumber,
          pageNumber,
          data,     //  data <=> data:data
          ageArr
        })
      })
    })
})

router.get('/add', function(req, res, next) {
  res.render('users_add', {
    activeIndex : 3
  })
});

router.get('/remove', function(req, res, next) {
	const { phoneCard } = req.query;
  sql.remove('qlb', 'users', { phoneCard }).then(() => {
	  res.redirect('/users');
  }).catch((err) => {
	  res.redirect('/users');
  })
});

router.post('/addAction', function(req, res, next) {
  // const obj = req.body;
  let { phoneCard, username, password } = req.body
  sql.find('qlb', 'users', {phoneCard : phoneCard}).then(data => {
    if (data.length == 0) {
      //没有数据  库添加数据
      password = md5(password);
      sql.insert('qlb', 'users', {phoneCard, username, password}).then(() => {
        res.redirect('/users')
      }).catch((err) => {
        res.redirect('/users/add')
      })
    }else{
      //数据已存在
      res.redirect('/users/add')
    }
  })
  // console.log(obj);
  res.redirect('/users')
});

router.post('/updateAction', function(req, res, next) {
	let { phoneCard, username, pageCode } = req.body;
	phoneCard = phoneCard * 1;
  sql.update('qlb', 'users', 'updateOne', { phoneCard }, {$set: { username }})
  .then(() => {
	  res.redirect('/users?pageCode=' + pageCode);
  }).catch(err => {
	  res.redirect('/users');
  })
});

const usersxlsx = 'E:/1812文件/勋勋后台/myapp/stu.xlsx'
// function analysisdata () {
// 	return new Promise((resolve, reject) => {
// 		// 解析excel文件
// 		const obj = xlsx.parse(usersxlsx);
// 		resolve(obj); // obj为buffer类型
// 	})
// }
// function filterdata (data) {
// 	let arr = [];
// 	data.map((item, index) => {
// 		if(index !== 0) {
// 			arr.push({
//         phoneCard: item[0],
// 				username: item[1],
// 				password: item[2]
// 			})
// 		}
// 	})
// 	return arr;
// }

//导入
router.get('/importUsers', (req, res, next) => {
  filemd.analysisdata(usersxlsx).then(obj => {
    console.log(obj);
    const data = obj[0].data;
    const result = filemd.usersfilterdata(data)
    // res.send(result)  //查看数据
    sql.insert('qlb', 'users', result).then(() => {
      res.redirect('/users');
    }).catch((err) => {
      res.redirect('/users');
    })
  })
})


//导出
router.get('/exportUsers', (req, res, next) => {
	const _headers =  [
		{caption:'phoneCard',type:'string'},
    {caption:'nusername',type:'string'},
    {caption:'age',type:'string'},
		{caption:'password',type:'string'}];


	sql.find('qlb', 'users', {}).then(data => {
		let alldata = new Array();
    data.map((item, index) => {
      let arr = [];
      arr.push(item.phoneCard);
      arr.push(item.username);
      arr.push(item.password);
      arr.push(item.age);
      alldata.push(arr);
		})
		const result = filemd.exportdata(_headers, alldata);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");
		res.end(result, 'binary');
	})
})

router.get('/search', (req, res, next) => {
  const {username} = req.query;
  sql.find('qlb', 'users', {username: eval('/'+username+'/')}).then(data => {
    res.render('users_search', {
      activeIndex: 3,
      data
    })
  })
})

router.get('/ageSearch', (req, res, next) => {
  let {age} = req.query;
  if(typeof {age} == String ) {
    sql.find('qlb', 'users', {age}).then(data => {
      sql.distinct('qlb', 'users', 'age').then(ageArr => {
        res.render('users', {
          activeIndex: 2,
          totalNumber: 1,
          pageCode: 1,
          data,
          pageNumber: data.length,
          ageArr
        })
      })
    })
  } else {
    age *= 1;
    sql.find('qlb', 'users', {age}).then(data => {
      sql.distinct('qlb', 'users', 'age').then(ageArr => {
        res.render('users', {
          activeIndex: 2,
          totalNumber: 1,
          pageCode: 1,
          data,
          pageNumber: data.length,
          ageArr
        })
      })
    })
  }

  
})

router.get('/sort', (req, res, next) => {
	let { type, num } = req.query;
	let sortData = {};
	sortData[type] = num * 1;
	sql.sort('qlb', 'users', sortData).then(data => {
		// res.send(data)
		sql.distinct('qlb', 'users', 'age').then(ageArr => {
			res.render('users', {
				activeIndex: 2,
				totalNumber: 1,
				pageCode: 1,
				data,
				pageNumber: data.length,
				ageArr
			})
		})
		
	})
})

router.get('/distinct', (req, res, next) => {
  sql.distinct('qlb', 'users', 'age').then(ageArr => {
    res.send(ageArr)
  })
})
module.exports = router;
