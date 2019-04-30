var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var ordersRouter = require('./routes/orders');

//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://user1:bibis@cluster0-4cuy1.mongodb.net/uzsakymai?retryWrites=true';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', ordersRouter);
app.use('/orders', ordersRouter);
app.use('/order/:id', ordersRouter);
app.use('/orders/create', ordersRouter);



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
  res.render('../views/pages/error');
}); 

module.exports = app;
