var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Braintree Drop-in Example' });
});

router.get('/subscriptions', function(req, res, next) {
  res.render('subscriptions', { title: 'PayPal Subscription Button Example', layout: 'hflayout' });
});

module.exports = router;
