var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('hostedfields', { title: 'Express', layout: 'hflayout' });
});

module.exports = router;
