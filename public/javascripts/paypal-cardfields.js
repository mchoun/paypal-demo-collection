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
      return fetch(`/api/orders/${data.orderID}/capture`, {
        method: 'post',
      })
        .then((response) => response.json())
        .then((orderData) => {
          console.log(
            'Capture result',
            orderData,
            JSON.stringify(orderData, null, 2)
          )
          var transaction = orderData.purchase_units[0].payments.captures[0]
          alert(`Transaction ${transaction.status}: ${transaction.id}

            See console for all available details
          `)
        })
    },
  })
  .render('#paypal-button-container')

const style = {
  input: { color: 'purple', border: 'solid purple', 'font-size': '14px' },
}

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
    const { orderID } = data
    return fetch(`/api/orders/${orderID}/capture`, {
      method: 'post',
    })
      .then((res) => {
        return res.json()
      })
      .then((orderData) => {
        console.log('Success:', orderData)
      })
  },
  onError: (error) => {
    console.error(error)
  },
  style: style,
})

const cardNumberContainer = document.getElementById('card-number')
const expirationContainer = document.getElementById('expiration-date')
const cvvContainer = document.getElementById('cvv')
const cardNameContainer = document.getElementById('card-holder-name')
const submitButton = document.getElementById('submit-button')
const clearNameButton = document.getElementById('clear-name')
const placeholderNameButton = document.getElementById('placeholder-name')
const clearNumberButton = document.getElementById('clear-number')
const clearCvvButton = document.getElementById('clear-cvv')
const clearExpiryButton = document.getElementById('clear-expiry')
const renderButton = document.getElementById('render-button')
const checkbox = document.getElementById('name-checkbox')

if (cardField.isEligible()) {
  const nameField = cardField.NameField({
    inputEvents: {
      onChange: (event) => {
        console.log('returns a stateObject', event)
      },
    },
  })
  const numberField = cardField.NumberField()
  const cvvField = cardField.CVVField()
  const expiryField = cardField.ExpiryField()

  renderButton.addEventListener('click', (e) => {
    e.preventDefault

    nameField.render(cardNameContainer)
    numberField.render(cardNumberContainer)
    cvvField.render(cvvContainer)
    expiryField.render(expirationContainer)
  })

  checkbox.addEventListener('')
  submitButton.addEventListener('click', () => {
    console.log('inside submit')
    cardField
      .submit({
        billingAddress: {
          countryCodeAlpha2: countryCodeAlpha2,
        },
      })
      .then(() => {
        console.log('Submitted')
      })
  })

  placeholderNameButton.addEventListener('click', (e) => {
    e.preventDefault
    nameField.setAttribute('placeholder', 'This is a new placeholder')
  })

  clearNameButton.addEventListener('click', (e) => {
    e.preventDefault
    nameField.clear()
  })

  clearNumberButton.addEventListener('click', (e) => {
    e.preventDefault
    numberField.clear()
  })

  clearCvvButton.addEventListener('click', (e) => {
    e.preventDefault
    cvvField.clear()
  })

  clearExpiryButton.addEventListener('click', (e) => {
    e.preventDefault
    expiryField.clear()
  })
}
