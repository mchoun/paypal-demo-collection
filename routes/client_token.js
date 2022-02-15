const express = require('express');
const router = express.Router();
const braintree = require('braintree');

router.get('/', (req, res, next) => {
	const gateway = new braintree.BraintreeGateway({
		environment: braintree.Environment.Sandbox,
		merchantId: "zxwjpt2w8t8yfjcq",
		publicKey: "7d9ykdgnwypq55qg",
		privateKey: "bfca3e0fa72c23c24edf211f297f6974"
	});

	// Create client token
	gateway.clientToken.generate({
		// customerId: "mervin_test"
	}).then(response => {
		 res.send(response.clientToken);
	});

});

module.exports = router;