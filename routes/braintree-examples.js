var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/hostedfields', function(req, res, next) {
  res.render('hostedfields', { title: 'Braintree Hosted Fields Example'});
});

router.get('/drop-in', function(req, res, next) {
  res.render('drop-in', { title: 'Braintree Drop in Example'});
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

router.get('/paypalcheckoutvault', function(req, res, next) {
  res.render('paypalcheckoutvault', { title: 'Braintree PayPal Checkout with Vault Example'});
});

router.get('/multipaymentmethods', function(req, res, next) {
  res.render('multipaymentmethods', { title: 'Braintree Multiple Payment Method Example'});
});

router.get('/googlepay', function(req, res, next) {
  res.render('googlepay', { title: 'Braintree Google Pay Example'});
});

router.get('/drop-in-with-paylater', function(req, res, next) {
  res.render('drop-in-with-paylater', { title: 'Braintree Drop in with Pay Later Standalone Example'});
});

router.get('/drop-in-with-hostedfields', function(req, res, next) {
  res.render('drop-in-with-hostedfields', { title: 'Braintree Drop in with Hosted Fields Example'});
});
module.exports = router;
