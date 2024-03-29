const express = require('express')
const router = express.Router()
const paypal = require('../paypal/paypal')
const braintreeApi = require('../braintree/braintree')
const stripe = require('../stripe/stripe')
const braintree = require('braintree')

const {
  getAllSubscriptionPlansHandler,
  createPlanHandler,
  findPlanHandler,
  createCreditCardHandler,
  createCardVerificationHandler,
} = require('../braintree/braintree.handlers')

const { MERCHANT_ID, BT_PUBLIC_KEY, BT_PRIVATE_KEY } = process.env

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: MERCHANT_ID,
  publicKey: BT_PUBLIC_KEY,
  privateKey: BT_PRIVATE_KEY,
})

router.get('/client-token', async (req, res, next) => {
  const { merchantAccountId = undefined, customerId = undefined } = req.body

  try {
    const clientToken = await braintreeApi.generateClientToken({
      merchantAccountId,
      customerId,
    })
    res.send(clientToken)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

router.get('/client-token-customer', async (req, res, next) => {
  // Create client token

  try {
    let response = await gateway.clientToken.generate({
      customerId: '841764890',
    })
    res.send(response.clientToken)
  } catch (error) {
    console.log(err)
    res.status(500).send(err)
  }
})

router.post('/checkout', async (req, res, next) => {
  //TODO: Create logic for the client side integration to pass default parameters if only a nonce is sent to this endpoint
  // const nonceFromTheClient = req.body.paymentMethodNonce;
  // let { amount, paymentMethodNonce, paymentMethodToken, ...restOfBody } =
  //   req.body

  // let request = {
  //   amount: amount ? amount : '50.00',
  //   paymentMethodNonce:
  //     paymentMethodNonce || paymentMethodToken
  //       ? paymentMethodNonce
  //       : 'fake-valid-nonce',
  //   paymentMethodToken: paymentMethodToken,
  //   ...restOfBody,
  // }

  try {
    const response = await gateway.transaction.sale(req.body)
    res.json(response)
  } catch (err) {
    res.json(err)
  }
})

router.post('/capture', (req, res, next) => {
  const { transactionId, amount = null } = req.body
  const options = {
    // orderId: 'MervinOrderId',
    // customFields: {
    //   customfieldone: 'Custom Word!'
    // }
  }

  gateway.transaction
    .submitForSettlement(transactionId, amount, options)
    .then((result) => {
      if (result.success) {
        res.json(result)
      } else {
        res.status(500).send(result.errors)
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Something went wrong')
    })
})

router.post('/transaction-find', (req, res) => {
  const { transactionId } = req.body

  gateway.transaction
    .find(transactionId)
    .then((result) => res.json(result))
    .catch((err) => {
      console.log(err)
      res.status(500).send('Something went wrong')
    })
})

router.post('/refund', (req, res) => {
  const { transactionId, amount } = req.body

  gateway.transaction
    .refund(transactionId, amount)
    .then((result) => res.json(result))
    .catch((err) => {
      console.log(err)
      res.status(500).send('Something went wrong')
    })
})

router.post('/customer-update', (req, res, next) => {
  const { id, ...restOfBody } = req.body

  gateway.customer
    .update(id, restOfBody)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err))
})

router.post('/customer-create', (req, res, next) => {
  const { id, paymentMethodNonce } = req.body

  gateway.customer
    .create(req.body)
    .then((result) => res.json(result))
    .catch((err) => {
      console.log(err.type)
      console.log(err.name)
      console.log(err.message)
      res.send(err.message)
    })
})

router.post('/customer-find', (req, res, next) => {
  const { id } = req.body

  gateway.customer
    .find(id)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err))
})

router.post('/payment-method', (req, res) => {
  const { customerId, paymentMethodNonce } = req.body
  gateway.paymentMethod
    .create({
      customerId: customerId,
      paymentMethodNonce: paymentMethodNonce,
    })
    .then((result) => {
      if (result.success) {
        res.send(result)
      } else {
        res.status(500).send(result)
      }
    })
    .catch((err) => console.log(err))
})

router.get('/oauth', (req, res, next) => {
  const oauthGateway = new braintree.BraintreeGateway({
    clientId: 'client_id$sandbox$mdvf532bgwbjn4yf',
    clientSecret: 'client_secret$sandbox$c324dcd15504f0065b79f366e0086758',
  })

  const url = oauthGateway.oauth.connectUrl({
    redirectUri: 'https://www.example.com',
    scope: 'shared_vault_transactions',
    state: 'foo_state',
  })

  res.json(url)
})

router.post('/accessToken', (req, res, next) => {
  const oauthGateway = new braintree.BraintreeGateway({
    clientId: 'client_id$sandbox$mdvf532bgwbjn4yf',
    clientSecret: 'client_secret$sandbox$c324dcd15504f0065b79f366e0086758',
  })

  const url = oauthGateway.oauth.connectUrl({
    redirectUri: 'https://www.example.com',
    scope: 'shared_vault_transactions',
    state: 'foo_state',
  })

  res.json(url)
})

router.post('/webhook-parse', (req, res, next) => {
  const sampleNotification = gateway.webhookTesting.sampleNotification(
    braintree.WebhookNotification.Kind.Check,
    'myId'
  )
  console.log(sampleNotification.bt_payload, sampleNotification.bt_signature)
  gateway.webhookNotification
    .parse(sampleNotification.bt_signature, sampleNotification.bt_payload)
    .then((webhookNotification) => {
      res.json(webhookNotification)
    })
    .catch((err) => res.send(err))
})

router.post('/auth-adjustment', (req, res) => {
  const { transactionId, amount = null } = req.body

  gateway.transaction
    .adjustAuthorization(transactionId, {
      amount,
    })
    .then((result) => {
      if (result.success) {
        res.json(result)
      } else {
        res.status(500).send(result.errors)
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Something went wrong')
    })
})

router.post('/create-payment-method-nonce', async (req, res) => {
  const { token } = req.body
  const response = await gateway.paymentMethodNonce.create(token)
  res.json(response)
})

router.get('/plans', getAllSubscriptionPlansHandler)
router.get('/plans/:planId', findPlanHandler)
router.post('/plans', createPlanHandler)

router.post('/createCreditCard', createCreditCardHandler)
router.post('/createCardVerification', createCardVerificationHandler)

//PayPal

router.post('/orders', async (req, res) => {
  const order = await paypal.createOrder()
  res.json(order)
})

router.post('/orders/:orderID/capture', async (req, res) => {
  const { orderID } = req.params
  const captureData = await paypal.capturePayment(orderID)
  res.json(captureData)
})

router.post('/clone', async (req, res) => {
  const { transactionId } = req.body
  let response = await gateway.transaction.cloneTransaction(transactionId, {
    amount: '20.00',
    options: {
      submitForSettlement: true,
    },
  })

  res.send(response)
})

router.post('/test/:string', (req, res) => {
  const { string } = req.params
  const response = string.charAt(string.length - 1)
  res.send(response)
})

//Stripe

router.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1400,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  })

  res.send({
    clientSecret: paymentIntent.client_secret,
  })
})

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1LQxe7BWuWaIG4nS5SsGCTj0',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  })

  res.redirect(303, session.url)
})

module.exports = router
