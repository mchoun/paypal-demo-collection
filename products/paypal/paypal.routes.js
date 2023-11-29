const paypal = require('./paypal')
const express = require('express')
const router = express.Router()

const base = 'https://api-m.sandbox.paypal.com'
const { CLIENT_ID, APP_SECRET } = process.env

router.get('/checkout-advance', async function (req, res, next) {
  const clientId = CLIENT_ID
  const clientToken = await paypal.generateClientToken()
  res.render('checkoutadvance', { clientId, clientToken })
})

router.get('/checkout-advance-cardfields', async function (req, res, next) {
  const clientId = CLIENT_ID
  const clientToken = await paypal.generateClientToken()
  res.render('checkoutadvance-cardfields', { clientId, clientToken })
})

router.get('/checkout-standard', async function (req, res, next) {
  const clientId = CLIENT_ID
  const clientToken = await paypal.generateClientToken()
  res.render('checkoutstandard', { clientId, clientToken })
})

router.get('/subscriptions', function (req, res, next) {
  res.render('subscriptions', {
    title: 'PayPal Subscription Button Example',
    layout: 'hflayout',
  })
})

router.get('/standalone', async function (req, res, next) {
  const clientId = CLIENT_ID
  const clientToken = await paypal.generateAccessToken()
  res.render('pp-standalone', {
    title: 'Standalone button example',
    clientId,
    clientToken,
  })
})

router.get('/accelerated-checkout', async function (req, res, next) {
  const clientId = CLIENT_ID
  const clientToken = await paypal.generateAccessToken()
  res.render('accelerated-checkout', {
    title: 'Accelerated Checkout Example',
    clientId,
    clientToken,
  })
})

router.get('/venmo', async function (req, res, next) {
  const clientId = CLIENT_ID
  const clientToken = await paypal.generateAccessToken()
  res.render('venmo', {
    title: 'Venmo example with Vault',
    clientId,
    clientToken,
  })
})

router.get('/checkoutjs', async function (req, res, next) {
  const clientId = CLIENT_ID
  const clientToken = await paypal.generateAccessToken()
  res.render('checkoutjs', {
    title: 'Checkout.js example',
    clientId,
    clientToken,
  })
})

router.get('/apple-pay', async function (req, res, next) {
  const clientId = CLIENT_ID
  const clientToken = await paypal.generateAccessToken()
  res.render('apple-pay', { title: 'Apple Pay Example', clientId, clientToken })
})

module.exports = router
