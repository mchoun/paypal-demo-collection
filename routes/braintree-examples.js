var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Braintree Drop-in Example' });
});

router.get('/hostedfields', function(req, res, next) {
  res.render('hostedfields', { title: 'Braintree Hosted Fields Example'});
});

router.get('/3dsecure', function(req, res, next) {
  res.render('3dsecure', { title: 'Braintree 3D Secure Example'});
});

router.get('/paypalvault', function(req, res, next) {
  res.render('paypalvault', { title: 'Braintree PayPal Vault Example'});
});

router.get('/paypalcheckout', function(req, res, next) {
  res.render('paypalcheckout', { title: 'Braintree PayPal Checkout Example'});
});

router.get('/multipaymentmethods', function(req, res, next) {
  res.render('multipaymentmethods', { title: 'Braintree Multiple Payment Method Example'});
});

router.get('/googlepay', function(req, res, next) {
  res.render('googlepay', { title: 'Braintree Google Pay Example'});
});

module.exports = router;
