const express = require('express');
const router = express.Router();
const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'zxwjpt2w8t8yfjcq',
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY,
});

router.get('/client-token', (req, res, next) => {
  // Create client token
  gateway.clientToken
    .generate({
      customerId: '470435677',
      merchantAccountId: 'paypal',
    })
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
  const newTransaction = gateway.transaction.sale(
    {
      amount: '1.00',
      paymentMethodNonce: nonceFromTheClient,
      options: {
        //This option request the funds from the transaction once it has been auhtorized successfully
        submitForSettlement: true,
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

router.post('/customer-create', (req, res, next) => {
  const { paymentMethodNonce } = req.body;

  gateway.customer
    .create({
      firstName: 'First',
      lastname: 'Last',
      paymentMethodNonce: paymentMethodNonce,
    })
    .then((result) => {});
});

router.get('/oauth', (req, res, next) => {
  
  const oauthGateway = new braintree.BraintreeGateway({
    clientId: "client_id$sandbox$mdvf532bgwbjn4yf",
    clientSecret: "client_secret$sandbox$c324dcd15504f0065b79f366e0086758"
  })

  const url = oauthGateway.oauth
    .connectUrl({
      redirectUri: 'https://www.example.com',
      scope: 'shared_vault_transactions',
      state: 'foo_state',
    })

    res.json(url);
});

module.exports = router;
