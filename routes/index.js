const express = require('express')
const router = express.Router()

const braintreeRoutes = require('../products/braintree')

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

app.use('/braintree-examples', braintreeRoutes)
app.use('/paypal-examples', paypalExamples)
app.use('/api', apiRouter)
app.use('/graqhql', graphql)

module.exports = router
