var dropin;
var payBtn = document.getElementById('pay-btn');
var nonceGroup = document.querySelector('.nonce-group');
var nonceInput = document.querySelector('.nonce-group input');
var nonceSpan = document.querySelector('.nonce-group span');
var payGroup = document.querySelector('.pay-group');
var billingFields = [
  'email',
  'billing-phone',
  'billing-given-name',
  'billing-surname',
  'billing-street-address',
  'billing-extended-address',
  'billing-locality',
  'billing-region',
  'billing-postal-code',
  'billing-country-code'
].reduce(function (fields, fieldName) {
  var field = fields[fieldName] = {
    input: document.getElementById(fieldName),
    help: document.getElementById('help-' + fieldName)
  };
  
  field.input.addEventListener('focus', function() {
    clearFieldValidations(field);
  });

  return fields;
}, {});

function autofill(e) {
  e.preventDefault();

  billingFields.email.input.value = 'your.email@email.com';
  billingFields['billing-phone'].input.value = '123-456-7890';
  billingFields['billing-given-name'].input.value = 'Jane';
  billingFields['billing-surname'].input.value = 'Doe';
  billingFields['billing-street-address'].input.value = '123 XYZ Street';
  billingFields['billing-locality'].input.value = 'Anytown';
  billingFields['billing-region'].input.value = 'IL';
  billingFields['billing-postal-code'].input.value = '12345';
  billingFields['billing-country-code'].input.value = 'US';
  
  Object.keys(billingFields).forEach(function (field) {
    clearFieldValidations(billingFields[field]);
  });
}

document.getElementById('autofill').addEventListener('click', autofill);

function clearFieldValidations (field) {
  field.help.innerText = '';
  field.help.parentNode.classList.remove('has-error');
}

billingFields['billing-extended-address'].optional = true;

function validateBillingFields() {
  var isValid = true;

  Object.keys(billingFields).forEach(function (fieldName) {
    var fieldEmpty = false;
    var field = billingFields[fieldName];

    if (field.optional) {
      return;
    }

    fieldEmpty = field.input.value.trim() === '';

    if (fieldEmpty) {
      isValid = false;
      field.help.innerText = 'Field cannot be blank.';
      field.help.parentNode.classList.add('has-error');
    } else {
      clearFieldValidations(field);
    }
  });

  return isValid;
}

function start() {
  getClientToken();
}

function getClientToken() {
	
	fetch("/api/client-token")
    .then(response => response.text())
	.then(clientToken => onFetchClientToken(clientToken))
    .catch(error => console.log('error', error));

}

function setupDropin (clientToken) {
  return braintree.dropin.create({
    authorization: clientToken,
    container: '#drop-in',
    threeDSecure: true
  })
}

function onFetchClientToken(clientToken) {
  return setupDropin(clientToken).then(function(instance) { 
    dropin = instance;

    setupForm();
  }).catch(function (err) {
     console.log('component error:', err);
  });
}

function setupForm() {
  enablePayNow();
}

function enablePayNow() {
  payBtn.value = 'Pay Now';
  payBtn.removeAttribute('disabled');
}

function showNonce(payload, liabilityShift) {
  nonceSpan.textContent = "Liability shifted: " + liabilityShift;
  nonceInput.value = payload.nonce;
  payGroup.classList.add('hidden');
  payGroup.style.display = 'none';
  nonceGroup.classList.remove('hidden');
}

payBtn.addEventListener('click', function(event) {
  payBtn.setAttribute('disabled', 'disabled');
  payBtn.value = 'Processing...';
  
  var billingIsValid = validateBillingFields();
  
  if (!billingIsValid) {
    enablePayNow();
    
    return;
  }

  dropin.requestPaymentMethod({
    threeDSecure: {
      amount: '100.00',
      email: billingFields.email.input.value,
      billingAddress: {
        givenName: billingFields['billing-given-name'].input.value,
        surname: billingFields['billing-surname'].input.value,
        phoneNumber: billingFields['billing-phone'].input.value.replace(/[\(\)\s\-]/g, ''), // remove (), spaces, and - from phone number
        streetAddress: billingFields['billing-street-address'].input.value,
        extendedAddress: billingFields['billing-extended-address'].input.value,
        locality: billingFields['billing-locality'].input.value,
        region: billingFields['billing-region'].input.value,
        postalCode: billingFields['billing-postal-code'].input.value,
        countryCodeAlpha2: billingFields['billing-country-code'].input.value
      }
    }
  }, function(err, payload) {
    if (err) {
      console.log('tokenization error:');
      console.log(err);
      dropin.clearSelectedPaymentMethod();
      enablePayNow();
      
      return;
    }
      
    if (!payload.liabilityShifted) {
      console.log('Liability did not shift', payload);
      showNonce(payload, false);
      return;
    }

    //Sale request
    fetch('/api/checkout', {
      method: 'POST',
      body: {'paymentMethodNonce': payload.nonce}
    }).then(function(result) {
      if (result.ok) {
        console.log("Payment successfully sent")
      } else {
        console.log(result);
        console.log("Payment failed")
      }
    }).catch(function(err) {
    console.error(err);
  });
    console.log('verification success:', payload);
    showNonce(payload, true);
      // send nonce and verification data to your server
  })});

start();