var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Braintree Drop-in Example' });
});

router.get('/hostedfields', function(req, res, next) {
  res.render('hostedfields', { title: 'Braintree Hosted Fields Example', layout: 'hflayout' });
});

router.get('/3dsecure', function(req, res, next) {
  res.render('3dsecure', { title: 'Braintree 3D Secure Example', layout: 'layout' });
});

router.get('/hfpaypal', function(req, res, next) {
  res.render('hfpaypal', { title: 'Braintree PayPal Example', layout: 'pplayout' });
});


module.exports = router;
