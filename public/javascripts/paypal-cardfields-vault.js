let cardForm = document.querySelector('#card-form')
let cardholderName = document.querySelector('#card-holder-name')
let countryCodeAlpha2 = document.querySelector('#card-billing-address-country')
let vaultCheckbox = document.querySelector('#save')

const cardField = paypal.CardFields({
  createVaultSetupToken: (data, actions) => {
    return '1LG33167LV680410B'
  },
  onApprove: (vaultSetupToken) => {
    console.log(vaultSetupToken)
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
