const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const paypal = require('./scripts/paypal-api');

const {MERCHANT_ID, BT_PUBLIC_KEY, BT_PRIVATE_KEY} = process.env

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: MERCHANT_ID,
  publicKey: BT_PUBLIC_KEY,
  privateKey: BT_PRIVATE_KEY,
  // publicKey: "yk5gd3b2m4x29c43",
  // privateKey: "3df1c791e53b9291093a6d17d0ff469e",
});

router.get('/client-token', (req, res, next) => {
  // Create client token
  gateway.clientToken
    .generate({})
    .then((response) => {
      res.send(response.clientToken);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/checkout', (req, res, next) => {
  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  gateway.transaction.sale(
    {
      amount: '1.00',
      paymentMethodNonce: nonceFromTheClient,
      options: {
        //This option request the funds from the transaction once it has been auhtorized successfully
        submitForSettlement: false,
        storeInVault: true,
      },
    },
    (error, result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(500).send(error);
      }
    }
  );
});

router.post('/capture', (req, res, next) => {

  const {transactionId} = req.body
  const options = {
    "orderId": 'MervinOrderId',
    // customFields: {
    //   customfieldone: 'Custom Word!'
    // }
  }

  gateway.transaction.submitForSettlement(transactionId,null,options)
    .then( result => {
      if (result.success){
        res.json(result)
      } else{
        res.status(500).send(result.errors)
      }
    })
    .catch( err => {
      console.log(err)
      res.status(500).send('Something went wrong')
    })

})

router.post('/customer-create', (req, res, next) => {
  const { paymentMethodNonce } = req.body;

  gateway.customer
    .create({
      firstName: 'First',
      lastName: 'Last',
      // paymentMethodNonce: paymentMethodNonce,
      creditCard: {
        options: {
          verifyCard: true,
        },
        cvv: '123',
        expirationDate: '01/25',
        number: '4111111111111111',
      },
    })
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err));
});

router.post('/payment-method', (req, res) => {
  const { customerId, paymentMethodNonce } = req.body
  gateway.paymentMethod.create({
    customerId: customerId,
    paymentMethodNonce: paymentMethodNonce
  })
  .then( result => {
    if (result.success) {
      res.send(result)
    } else {
      res.status(500).send(result)
    }
  })
  .catch(err => console.log(err))
})

router.get('/oauth', (req, res, next) => {
  const oauthGateway = new braintree.BraintreeGateway({
    clientId: 'client_id$sandbox$mdvf532bgwbjn4yf',
    clientSecret: 'client_secret$sandbox$c324dcd15504f0065b79f366e0086758',
  });

  const url = oauthGateway.oauth.connectUrl({
    redirectUri: 'https://www.example.com',
    scope: 'shared_vault_transactions',
    state: 'foo_state',
  });

  res.json(url);
});

router.post('/accessToken', (req, res, next) => {
  const oauthGateway = new braintree.BraintreeGateway({
    clientId: 'client_id$sandbox$mdvf532bgwbjn4yf',
    clientSecret: 'client_secret$sandbox$c324dcd15504f0065b79f366e0086758',
  });

  const url = oauthGateway.oauth.connectUrl({
    redirectUri: 'https://www.example.com',
    scope: 'shared_vault_transactions',
    state: 'foo_state',
  });

  res.json(url);
});



//PayPal

router.post('/orders', async (req, res) => {
  const order = await paypal.createOrder();
  res.json(order);
})

router.post('/orders/:orderID/capture', async (req, res) => {
  const { orderID } = req.params;
  const captureData = await paypal.capturePayment(orderID);
  res.json(captureData);
})

module.exports = router;
