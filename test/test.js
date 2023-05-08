const braintree = require('braintree')
require('dotenv').config()

const { MERCHANT_ID, BT_PUBLIC_KEY, BT_PRIVATE_KEY } = process.env

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'zxwjpt2w8t8yfjcq',
  privateKey: 'bfca3e0fa72c23c24edf211f297f6974',
  publicKey: '7d9ykdgnwypq55qg',
})

gateway.transaction
  .sale({
    amount: '10.00',
    paymentMethodNonce: 'fake-valid-nonce',
    options: {
      submitForSettlement: true,
    },
  })
  .then((result) => console.log(result))

async function tranasctionSaleAsync() {
  const response = await gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: 'fake-valid-nonce',
    options: {
      submitForSettlement: true,
    },
  })

  console.log(response)
}

function tranasctionSale() {
  const response = gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: 'fake-valid-nonce',
    options: {
      submitForSettlement: true,
    },
  })

  console.log(response)
}
