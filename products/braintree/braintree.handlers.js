const { getAllSubscriptionPlans, createPlan, findPlan } = require('./braintree')

const getAllSubscriptionPlansHandler = async (req, res) => {
  const allPlans = await getAllSubscriptionPlans()
  res.send(allPlans)
}

const createPlanHandler = async (req, res) => {
  const response = await createPlan()
  res.send(response)
}

const findPlanHandler = async (req, res) => {
  const { planId } = req.params
  const response = await findPlan({ planId })
  res.send(response)
}

const updatePlanHandler = async (req, res) => {
  const { planId } = req.body
  const response = await updatePlan({ planId })
  res.send(response)
}
module.exports = {
  getAllSubscriptionPlansHandler,
  createPlanHandler,
  findPlanHandler,
}
