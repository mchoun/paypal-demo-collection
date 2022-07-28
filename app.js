require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const braintreeExamples = require('./routes/braintree-examples');
const paypalExamples = require('./routes/paypal-examples');
const apiRouter = require('./routes/api.js');
const graphql = require("./routes/graphql.js")

const viewsPath = path.join(__dirname, 'views')
const viewsPathArray = [
  `${viewsPath}/braintree`,
  `${viewsPath}/paypal`,
]

var app = express();

// view engine setup
app.set('views', viewsPathArray);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routers
app.use('/', indexRouter);
app.use('/braintree-examples', braintreeExamples);
app.use('/paypal-examples', paypalExamples);
app.use('/api', apiRouter);
app.use('/graqhql', graphql);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






module.exports = app;
