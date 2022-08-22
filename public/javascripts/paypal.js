let cardForm = document.querySelector('#card-form');
let cardholderName = document.querySelector('#card-holder-name');
let countryCodeAlpha2 = document.querySelector('#card-billing-address-country');
let vaultCheckbox = document.querySelector('#save');

paypal
  .Buttons({
    createOrder: (data, actions) => {
      return fetch('/api/orders', {
        method: 'post',
      })
        .then((response) => response.json())
        .then((order) => order.id);
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
          );
          var transaction = orderData.purchase_units[0].payments.captures[0];
          alert(`Transaction ${transaction.status}: ${transaction.id}

            See console for all available details
          `);
        });
    },
  })
  .render('#paypal-button-container');

if (paypal.HostedFields.isEligible()) {
  let orderId;

  paypal.HostedFields.render({
    createOrder: () => {
      return fetch('/api/orders', {
        method: 'post',
      })
        .then((res) => res.json())
        .then((orderData) => {
          orderId = orderData.id;
          return orderData.id;
        });
    },
    styles: {
      '.valid': {
        color: 'green',
      },
      '.invalid': {
        color: 'red',
      },
    },
    fields: {
      number: {
        selector: '#card-number',
        placeholder: '4111 1111 1111 1111',
        prefill: '4032039221136619'
      },
      cvv: {
        selector: '#cvv',
        prefill: '655'
      },
      expirationDate: {
        selector: '#expiration-date',
        prefill: '12/2024'
      },
    },
  }).then((cardFields) => {
    cardForm.addEventListener('submit', (event) => {
      event.preventDefault();
      cardFields
        .submit({
          cardholderName: cardholderName.value,
          billingAddress: {
            countryCodeAlpha2: countryCodeAlpha2.value,
          },
          vault: vaultCheckbox.checked,
        })
        .then(() => {
          fetch(`/api/orders/${orderId}/capture`, {
            method: 'post',
          })
            .then((res) => res.json())
            .then((orderData) => {
              var errorDetail =
                Array.isArray(orderData.details) && orderData.details[0];
              if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                return actions.restart(); // Recoverable state, per:
                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
              }
              if (errorDetail) {
                var msg = 'Sorry, your transaction could not be processed.';
                if (errorDetail.description)
                  msg += '\n\n' + errorDetail.description;
                if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
                return alert(msg); // Show a failure message
              }
              // Show a success message or redirect
              alert('Transaction completed!');
              console.log(orderData)
            });
        })
        .catch(err => alert("Payment could not be capture! " + JSON.stringify(err)))
    });
  });
} else {
  document.querySelector('#card-form').style = 'display: none';
}
