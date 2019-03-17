var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('cart', {
    activeIndex : 4
  })
});

module.exports = router;
