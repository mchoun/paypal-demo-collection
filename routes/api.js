const express = require('express');
const router = express.Router();
const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId: "zxwjpt2w8t8yfjcq",
	publicKey: "7d9ykdgnwypq55qg",
	privateKey: "bfca3e0fa72c23c24edf211f297f6974"
});

router.get('/client_token', (req, res, next) => {

	// Create client token
	gateway.clientToken.generate({
		// customerId: "mervin_test"
	}).then(response => {
		 res.send(response.clientToken);
	});

});

router.post('/checkout', (req, res, next) => {


	// Use the payment method nonce here
	const nonceFromTheClient = req.body.paymentMethodNonce;
	// Create a new transaction for $10
	const newTransaction = gateway.transaction.sale({
		amount: '1.00',
		paymentMethodNonce: nonceFromTheClient,
		options: {
			//This option request the funds from the transaction once it has been auhtorized successfully
			submitForSettlement: true
		}
	}, (error, result) =>{
		if(result){
			res.send(result);
		} else {
			res.status(500).send(error);
		}
	});

});

module.exports = router;