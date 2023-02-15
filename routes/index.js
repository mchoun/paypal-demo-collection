var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Braintree and PayPal Demo Index' });
});

router.get(
  '/.well-known/apple-developer-merchantid-domain-association',
  (req, res) => {
    res.sendFile(resolve(__dirname, '../.well-known/domain-association-file-sandbox'))
  }
)

module.exports = router;
