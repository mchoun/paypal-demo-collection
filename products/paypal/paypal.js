require('dotenv').config()
const base = 'https://api-m.sandbox.paypal.com'
const { CLIENT_ID, APP_SECRET } = process.env

const generateClientToken = async () => {
  const accessToken = await generateAccessToken()
  const response = await fetch(`${base}/v1/identity/generate-token`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  return data.client_token
}

const generateAccessToken = async () => {
  const auth = Buffer.from(CLIENT_ID + ':' + APP_SECRET).toString('base64')
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'post',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
  const data = await response.json()
  return data.access_token
}

const createOrder = async () => {
  const purchaseAmount = '1.00'
  const accessToken = await generateAccessToken()
  const url = `${base}/v2/checkout/orders`
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: purchaseAmount,
          },
        },
      ],
      payment_source: {
        card: {
          name: 'John Doe',
          billing_address: {
            country_code: 'US',
          },
          attributes: {
            vault: {
              store_in_vault: 'ON_SUCCESS',
            },
          },
        },
      },
    }),
  })
  const data = await response.json()
  return data
}

const capturePayment = async (orderId) => {
  const accessToken = await generateAccessToken()
  const url = `${base}/v2/checkout/orders/${orderId}/capture`

  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()
  return data
}

module.exports = {
  generateClientToken,
  generateAccessToken,
  createOrder,
  capturePayment,
}
