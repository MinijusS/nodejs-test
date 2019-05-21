var express = require('express');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var router = express.Router({mergeParams: true});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* GET users listing. */
router.get('/register', function(req, res, next){
    res.render('../views/pages/register');
  });

router.post('/register', flashMessage, function(req, res){
  var newUser = new User({username : req.body.username, isAdmin : false, role : req.body.role});
  User.register(newUser, req.body.password, function (err, user){
    if(err){
      console.log(err);
      return res.render("../views/pages/register");
    }
    res.redirect('/login');
  });
});

router.get('/login', isLoggedin, function(req, res){
  res.render('../views/pages/login');
});

router.post('/login', flashMessage,
  passport.authenticate("local",
  {
    successRedirect: "/orders",
    failureRedirect: "/login",
    failureFlash: true
  }), function(req ,res){
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/orders');
});

router.get('/user/:id',function(req, res, next){
  User.find({})
  .populate('orders')
  .exec(function(err, allUsers){
    if(err) {
      return next(err);
    }
    res.render('../views/pages/user', {allUsers:allUsers});
  });
});

function isLoggedin(req, res, next) {
  if(req.isAuthenticated()){
    res.redirect('/orders');
  } else {
      return next();
  }
}

function flashMessage(req, res, next) {
    req.flash("badLogin", "Netinkami duomenys!");
    req.flash("success", "Sekmingai uzsiregistravote!");
    return next();
  };

module.exports = router;
