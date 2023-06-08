const braintree = require('braintree')

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'zxwjpt2w8t8yfjcq',
  privateKey: 'bfca3e0fa72c23c24edf211f297f6974',
  publicKey: '7d9ykdgnwypq55qg',
})

// function anotherReturnValue() {
//   return 'Im string'
// }

function callbackFunction(bananas, apples) {
  console.log(bananas)
  console.log(apples.id)
}

gateway.customer.create(
  {
    firstName: 'John',
    lastName: 'Doe',
    company: 'BT test Subs',
    email: 'jdoe@bt.com',
    phone: '412.892.7838',
    fax: '906.995.9090',
    website: 'www.jdoe.com',
    paymentMethodNonce: 'fake-valid-nonce',
  },
  callbackFunction
)

// function returnValue() {}

console.log(returnValue().then(callbackFunction))
console.log(
  returnValue().then((bananas, apples) => {
    console.log(bananas)
    console.log(apples.id)
  })
)

// let clientToken = undefined

// // async function getClientToken() {
// //   try {
// //     const clientTokenResponse = await gateway.clientToken.generate()
// //   } catch {}
// //   clientToken = clientTokenResponse.clientToken
// //   const customerCreateResponse = await gateway.customer.create({
// //     firstName: 'M',
// //     lastName: 'C',
// //     company: clientToken,
// //   })

// //   console.log(customerCreateResponse.success)
// // }

// getClientToken()

// Fetch request?
// https://developer.mozilla.org/en-US/docs/Web/API/fetch

// fetch(`http://localhost:3000/api/test${clientToken}`, {
//   method: 'POST',
// })

// gateway.clientToken.generate({}, (err, response) => {
//   clientToken = response.clientToken
//   console.log('Callback, baby!')
// })

// gateway.clientToken
//   .generate({ customerId: 888888 })
//   .then((clientTokenResponse) => {
//     clientToken = clientTokenResponse.clientToken
//     console.log("But then I'm a promise!")

//     return clientToken
//   })
//   .then((clientToken) => {
//     return gateway.customer.create({
//       firstName: 'Mervin',
//       lastName: 'Choun',
//       company: clientToken,
//     })
//   })
//   .then((response) => {
//     console.log(response.success)
//   })
//   .catch((err) => console.log(err))

// fetch(`http://localhost:3000/api/test${clientToken}`, {
//   method: 'POST',
// })
