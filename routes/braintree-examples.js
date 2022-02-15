var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hosted-fields', function(req, res, next) {
  res.render('hostedfields', { title: 'Express', layout: 'hflayout' });
});

router.get('/3dsecure', function(req, res, next) {
  res.render('3dsecure', { title: '3D Secure Example', layout: 'layout' });
});


module.exports = router;
