const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

//Braintree endpoint constants
//TODO: Replace with env variables
const publicKey = process.env.BT_PUBLIC_KEY;
const privateKey = process.env.BT_PRIVATE_KEY;
const btVersion = '2022-03-11';
const endpoint = 'https://payments.sandbox.braintree-api.com/graphql';

const headers = {
  Authorization: `Basic ${Buffer.from(publicKey + ':' + privateKey).toString(
    'base64'
  )}`,
  'Braintree-Version': btVersion,
  'Content-Type': 'application/json',
};

router.get('/client-token', async (req, res, next) => {
  const mutation = `
    mutation {
      clientToken: createClientToken {
        clientToken
      }
    }
  `;

  let response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ query: mutation }),
    headers: headers,
  })
    .then((res) => res.json())
    .catch((e) => res.error(e));

  res.send(response.data.clientToken.clientToken);
});

router.post('/checkout', async (req, res) => {
  const paymentMethodNonce = req.body.paymentMethodNonce;
  const mutation = `
    mutation Charge($input: ChargePaymentMethodInput!) {
      chargePaymentMethod(input: $input) {
        transaction {
          id
          status
        }
      }
    }
  `;

  const variables = {
    input: {
      paymentMethodId: paymentMethodNonce,
      transaction: {
        amount: '1.00',
      },
    },
  };

  let response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ query: mutation, variables: variables }),
    headers: headers,
  }).then((res) => res.json());

  console.log(response);
  res.send(response.data.chargePaymentMethod.transaction);
});

module.exports = router;
