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

router.post('/register', function(req, res){
  var newUser = new User({username : req.body.username, isAdmin : false});
  User.register(newUser, req.body.password, function (err, user){
    if(err){
      console.log(err);
      return res.render("../views/pages/register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect('/orders');
    });
  });
});

router.get('/login', isLoggedin, function(req, res){
  res.render('../views/pages/login', {message: req.flash("login")});
});

router.post('/login', passport.authenticate("local",
  {
    successRedirect: "/orders",
    failureRedirect: "/login"
  }), function(req ,res){
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/orders');
});

router.get('/user/:id',function(req, res, next){
  User.find({})
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

module.exports = router;
