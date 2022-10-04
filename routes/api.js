const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const paypal = require('./scripts/paypal-api');

const { MERCHANT_ID, BT_PUBLIC_KEY, BT_PRIVATE_KEY } = process.env;

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: MERCHANT_ID,
  publicKey: BT_PUBLIC_KEY,
  privateKey: BT_PRIVATE_KEY,
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

router.get('/client-token-customer', (req, res, next) => {
  // Create client token
  gateway.clientToken
    .generate({
      customerId: "153080992"
    })
    .then((response) => {
      res.send(response.clientToken);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/checkout', (req, res, next) => {
  //TODO: Create logic for the client side integration to pass default parameters if only a nonce is sent to this endpoint
  // const nonceFromTheClient = req.body.paymentMethodNonce;
  
  gateway.transaction.sale(
    req.body
  )
  .then(response => 
    res.json(response));
});

router.post('/capture', (req, res, next) => {
  const { transactionId } = req.body;
  const options = {
    orderId: 'MervinOrderId',
    // customFields: {
    //   customfieldone: 'Custom Word!'
    // }
  };

  gateway.transaction
    .submitForSettlement(transactionId, null, options)
    .then((result) => {
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).send(result.errors);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Something went wrong');
    });
});

router.post('/transaction-find', (req, res) => {
  const { transactionId } = req.body;
  
  gateway.transaction.find(transactionId)
    .then( (result) => res.json(result))
    .catch( (err) => {
      console.log(err);
      res.status(500).send('Something went wrong');
    })
})

router.post('/refund', (req, res) => {
  const { transactionId, amount } = req.body;
  
  gateway.transaction.refund(transactionId, amount)
    .then( (result) => res.json(result))
    .catch( (err) => {
      console.log(err);
      res.status(500).send('Something went wrong');
    })
})

router.post('/customer-update', (req, res, next) => {
  const { id, ...restOfBody } = req.body;

  gateway.customer
    .update(id, restOfBody )
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err));
});

router.post('/customer-create', (req, res, next) => {
  const { id, paymentMethodNonce } = req.body;

  gateway.customer
    .create(req.body)
    .then((result) => res.json(result))
    .catch( err => {
      console.log(err.type);
      console.log(err.name);
      console.log(err.message);
      res.send(err.message)
    });
});

router.post('/customer-find', (req, res, next) => {
  const { id } = req.body;

  gateway.customer
    .find(id)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err));
});


router.post('/payment-method', (req, res) => {
  const { customerId, paymentMethodNonce } = req.body;
  gateway.paymentMethod
    .create({
      customerId: customerId,
      paymentMethodNonce: paymentMethodNonce,
    })
    .then((result) => {
      if (result.success) {
        res.send(result);
      } else {
        res.status(500).send(result);
      }
    })
    .catch((err) => console.log(err));
});

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


router.post('/webhook-parse', (req, res, next) => {
  const sampleNotification = gateway.webhookTesting.sampleNotification(
    braintree.WebhookNotification.Kind.Check,
    "myId"
  )
  console.log(sampleNotification.bt_payload, sampleNotification.bt_signature);
  gateway.webhookNotification.parse(
    sampleNotification.bt_signature,
    sampleNotification.bt_payload,
  ).then(webhookNotification => {
    res.json(webhookNotification)
  }).catch( err => res.send(err))

})

//PayPal

router.post('/orders', async (req, res) => {
  const order = await paypal.createOrder();
  res.json(order);
});

router.post('/orders/:orderID/capture', async (req, res) => {
  const { orderID } = req.params;
  const captureData = await paypal.capturePayment(orderID);
  res.json(captureData);
});


router.post('/clone', async (req, res) => {
  const { transactionId } = req.body;
  let response = await gateway.transaction.cloneTransaction(transactionId, {
    amount: '10.00',
    options: {
      submitForSettlement: true
    }
  })

  res.send(response)
})


module.exports = router;
