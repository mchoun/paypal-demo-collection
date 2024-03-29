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

const getAllSubscriptionPlans = async () => {
  return await gateway.plan.all()
}

const findPlan = async ({ planId }) => {
  return await gateway.plan.find(planId)
}
const createPlan = async (params) => {
  return await gateway.plan.create({
    name: 'Test name',
    price: 10.0,
  })
}

const updatePlan = async ({ planId }) => {
  return await gateway.plan.update(planId, {
    description: 'This is a new description',
  })
}

const createCreditCard = async (creditCardParams) => {
  return await gateway.creditCard.create(creditCardParams)
}

const creditCardVerificationCreate = async (creditCardParams) => {
  try {
    return await gateway.creditCardVerification.create(creditCardParams)
  } catch (e) {
    console.log(e)
    return e
  }
}

module.exports = {
  generateClientToken,
  getAllSubscriptionPlans,
  createPlan,
  findPlan,
  updatePlan,
  createCreditCard,
  creditCardVerificationCreate,
}
