const paypal =  require('./scripts/paypal-api.js')
const express = require('express');
const router = express.Router();

const base = 'https://api-m.sandbox.paypal.com';
const { CLIENT_ID, APP_SECRET } = process.env;


router.get('/checkout-advance', async function(req, res, next) {
  const clientId = CLIENT_ID;
  const clientToken = await paypal.generateClientToken();
  res.render('checkoutadvance', { clientId, clientToken });
});

router.get('/subscriptions', function(req, res, next) {
  res.render('subscriptions', { title: 'PayPal Subscription Button Example', layout: 'hflayout' });
});

router.get('/standalone', async function(req, res, next) {
  const clientId = CLIENT_ID;
  const clientToken = await paypal.generateAccessToken();
  res.render('pp-standalone', { title: 'Standalone button example', clientId, clientToken});
});

module.exports = router;
