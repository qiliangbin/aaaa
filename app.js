var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('cookie-session')


var indexRouter = require('./routes/index');
var projectRouter = require('./routes/project');
var usersRouter = require('./routes/users');
var cartRouter = require('./routes/cart');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  keys: ['key1', 'key2'],
  name: 'node-id',
  // maxAge: 1000 * 60 *60
}))

app.use(express.static(path.join(__dirname, 'public')));

// app.all('/project', (req, res, next) => {
//   if(req.cookieSession.isLogin === 1) {
//     next()
//   } else {
//     res.redirect('/login')
//   }
// })



// app.all('/cart', (req, res, next) => {
//   if(req.cookieSession.isLogin === 1) {
//     next()
//   } else {
//     res.redirect('/login')
//   }
// })

app.use('/', indexRouter);

// 响应式布局
// app.use('/login', require('./routes/login'));
app.use('/project', projectRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);


app.all('/*', require('./routes/islogin'))



// app.all('/*', (req, res, next) => {
//   // if(req.cookies.isLogin == 1) {
//   //   next()
//   // } else {
//   //   res.redirect('/login')
//   // }
//   if(req.session.isLogin == 1) {
//     next()
//   } else {
//     res.redirect('/login')
//   }
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
