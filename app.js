var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

var ordersRouter = require('./routes/orders');
var usersRouter = require('./routes/users');

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

app.use(flash());
app.use(require("express-session")({
  secret: "Rinkimine knygele",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("badLogin");
  res.locals.login = req.flash("login");
  next();
});

app.use('/', ordersRouter);
app.use('/', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
}); 

 // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('../views/pages/error');
}); 

module.exports = app;
