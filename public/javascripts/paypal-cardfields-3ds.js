let cardForm = document.querySelector('#card-form')
let cardholderName = document.querySelector('#card-holder-name')
let countryCodeAlpha2 = document.querySelector('#card-billing-address-country')
let vaultCheckbox = document.querySelector('#save')

paypal
  .Buttons({
    createOrder: (data, actions) => {
      return fetch('/api/orders', {
        method: 'post',
      })
        .then((response) => response.json())
        .then((order) => order.id)
    },
    onApprove: (data, actions) => {
      console.log('onApprove called')
      console.log(data)
    },
  })
  .render('#paypal-button-container')

const cardField = paypal.CardFields({
  createOrder: (data) => {
    return fetch('/api/orders', {
      method: 'post',
      body: {
        paymentSource: data.paymentSource,
      },
    })
      .then((res) => res.json())
      .then((orderData) => {
        orderId = orderData.id
        return orderData.id
      })
  },
  onApprove: (data) => {
    console.log('onApprove called')
    console.log(data)
  },
  onError: (error) => {
    console.error(error)
  },
})

const cardNumberContainer = document.getElementById('card-number')
const expirationContainer = document.getElementById('expiration-date')
const cvvContainer = document.getElementById('cvv')
const cardNameContainer = document.getElementById('card-holder-name')
const submitButton = document.getElementById('submit-button')

if (cardField.isEligible()) {
  const nameField = cardField.NameField()
  const numberField = cardField.NumberField()
  const cvvField = cardField.CVVField()
  const expiryField = cardField.ExpiryField()

  nameField.render(cardNameContainer)
  numberField.render(cardNumberContainer)
  cvvField.render(cvvContainer)
  expiryField.render(expirationContainer)

  submitButton.addEventListener('click', () => {
    cardField.submit().then(() => {
      console.log('Submitted')
    })
  })
}
