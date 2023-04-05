const braintree = require('braintree')
require('dotenv').config()

const { MERCHANT_ID, BT_PUBLIC_KEY, BT_PRIVATE_KEY } = process.env

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: MERCHANT_ID,
  publicKey: BT_PUBLIC_KEY,
  privateKey: BT_PRIVATE_KEY,
})

const generateClientToken = async (params) => {
  let response = await gateway.clientToken.generate(params)
  let clientToken = response.clientToken
  return clientToken
}
module.exports = { generateClientToken }
