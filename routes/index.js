var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql')

/* GET users listing. */
router.get('/', function(req, res, next) {

// if (!req.cookies.isLogin || req.cookies.isLogin == 0) {

//   res.redirect('/login')
//   return;
// }

  console.log(res.user_session)
  let data = {
    ...res.user_session
  }
  res.render('/', data)
  if (req.session.isLogin != 1) { // 表示未登录
    res.redirect('/login'); // 跳转到登录页面
    return; // 代码将不再继续往下执行
  }
  res.render('index', {
    activeIndex: 1
  })
});

router.get('/login', function(req, res, next) {
  res.render('login')
});

router.post('/submit', (req, res, next) => {
  let {username, password} = req.body;
  sql.find('qlb', 'admin', {username, password}).then(result => {
    console.log(result);
    if (result.length === 0) {   //没有管理员信息
      req.session.isLogin = 0; //未登录
      // res.cookie('isLogin', 0);   //登录状态设为0
      res.redirect('/error')
    } else {
      req.session.isLogin = 1; //一登陆
      // res.cookie('isLogin', 1)
      res.redirect('/')
    }

    // if (!err && result.length > 0) {
    //   // 存cookie  留session
    //   req.session['username'] = result[0].username;
    //   req.session['password'] = result[0].password;
    //   req.session['nickname'] = result[0].nickname;

    //   res.redirect('/project');
    // } else {
    //   console.log('error')
    // }
  })
})

router.get('/logout', (req, res, next) => {
  req.session.isLogin = null;
  // res.clearCookie('isLogin') // 删除cookie
  res.redirect('/login')
})

module.exports = router;
