const express = require('express')
const router = express.Router()

const braintreeRoutes = require('../products/braintree')
const paypalRoutes = require('../products/paypal')
const apiRoutes = require('../products/api')
const graphqlRoutes = require('../products/graphql')
const stripeRoutes = require('../products/stripe')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Braintree and PayPal Demo Index' })
})

router.get(
  '/.well-known/apple-developer-merchantid-domain-association',
  (req, res) => {
    res.sendFile(
      resolve(__dirname, '../.well-known/domain-association-file-sandbox')
    )
  }
)

router.use('/braintree-examples', braintreeRoutes)
router.use('/paypal-examples', paypalRoutes)
router.use('/api', apiRoutes)
router.use('/graphql', graphqlRoutes)
router.use('/stripe', stripeRoutes)

module.exports = router
