const express = require('express')
const router = express.Router()

router.get('/checkout', function (req, res, next) {
  res.render('stripe-checkout', { title: 'Stripe Checkout Example' })
})

router.get('/checkout-session', function (req, res, next) {
  res.render('stripe-checkout-session', { title: 'Stripe Checkout Example' })
})

module.exports = router
