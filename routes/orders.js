var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var User = require('../models/user');


router.get('/', function(req, res, next) {
  res.redirect('orders');
});

router.get('/orders', isLoggedIn, function(req, res, next){
  Order.find({})
  .populate('user')
  .exec(function(err, list_orders){
    if (err) {return next(err)};
    // Jeigu nera erroru turetu veikt
    res.render('../views/pages/index', {orders_list : list_orders, message: req.flash("delete")});
  });
});

router.get('/order/:id', isLoggedIn, function(req, res){
  Order.findById(req.params.id)
  .exec(function(err, details){
    if (err) {return next(err)};
    // Jeigu ner erroru
    res.render('../views/pages/order', {title: 'Daugiau info', detail : details, delete: req.flash("delete")});
  });  
});

router.get('/orders/create', isLoggedIn, function(req, res){
  res.render('../views/pages/create');
});

router.get('/orders/create/guest', function(req, res){
  res.render('../views/pages/createGuest');
});

router.post('/orders/create/guest', isLoggedIn, function(req, res){
  var orderData = new Order (
    {
      user : req.user.id,
      address : req.body.address,
      phone : req.body.phone,
      total: req.body.total,
      isConfirmed: false,
      endIn: req.body.endIn,
      isDone: undefined
    }
    );
    var itemData = {
      name: req.body.name,
      sauce: req.body.sauce,
      quantity: req.body.quantity
    }
    orderData.items.push(itemData);
    console.log(orderData.id);
    orderData.save();
    User.findById(req.user.id, (err, user) => {
      if (err) {return next(err)};
      user.orders.push(orderData);
      user.save((err) =>{
        res.redirect('/');
      });
    });
  });
  
  router.post('/orders/create', isLoggedIn, function(req, res){
    var orderData = new Order (
      {
        user : req.user.id,
        address : req.body.address,
        phone : req.body.phone,
        total: req.body.total,
        isConfirmed: true,
        isDone: false,
        endIn: req.body.endIn
      }
      );
      var itemData = {
        name: req.body.name,
        sauce: req.body.sauce,
        quantity: req.body.quantity
      }
      orderData.items.push(itemData);
      orderData.save();
      
      User.findById(req.user.id, (err, user) => {
        if (err) {return next(err)};
        user.orders.push(orderData);
        user.save((err) =>{
          res.redirect('/');
        });
      });
    });
    
    router.post('/order/:id/done', isLoggedIn, Pardavejas, function(req, res){
      Order.findOneAndUpdate({_id: (req.params.id)}, { $set: { isDone: true } }, { returnOriginal: false }, (err, result) => {
        if (err)
        console.log(err);
        else {
          res.redirect('/orders');
        };
      });
    });
    
    router.post('/order/:id/confirm', isLoggedIn, function(req, res){
      Order.findOneAndUpdate({_id: (req.params.id)}, { $set: { isConfirmed: true, isDone: false } }, { returnOriginal: false }, (err, result) => {
        if (err)
        console.log(err);
        else {
          res.redirect('/orders');
        };
      });
    });
    
    router.post('/order/:id/revert', isLoggedIn, Pardavejas, function(req, res){
      Order.findOneAndUpdate({_id: (req.params.id)}, { $set: { isDone: false } }, { returnOriginal: false }, (err, result) => {
        if (err)
        console.log(err);
        else {
          res.redirect('/orders');
        };
      });
    });
    
    router.get('/order/:id/edit', isLoggedIn, Pardavejas, function(req, res){
      Order.findById(req.params.id)
      .exec(function(err, detail){
        if(err) {return next(err)};
        res.render('../views/pages/edit', {order_details : detail});
      });
    });
    
    router.get('/order/:id/guest/edit', isLoggedIn, function(req, res){
      Order.findById(req.params.id)
      .exec(function(err, detail){
        if(err) {return next(err)};
        res.render('../views/pages/edit', {order_details : detail});
      });
    });
    
    router.post('/order/:id/guest/edit',isLoggedIn, function(req, res){
      var itemData = {
        name: req.body.name,
        sauce: req.body.sauce,
        quantity: req.body.quantity,
        isConfirmed: false
      };
      Order.findByIdAndUpdate({_id : (req.params.id)}, 
      { $set: 
        { 
          items: itemData,
          address: req.body.address,
          phone: req.body.phone,
          endIn: req.body.endIn
        } 
      }, {multi:true}, (err, result) => {
        res.redirect('/');
      });
    });
    
    router.post('/order/:id/edit',isLoggedIn, Pardavejas, function(req, res){
      var itemData = {
        name: req.body.name,
        sauce: req.body.sauce,
        quantity: req.body.quantity
      };
      Order.findByIdAndUpdate({_id : (req.params.id)}, 
      { $set: 
        { 
          items: itemData,
          address: req.body.address,
          phone: req.body.phone,
          endIn: req.body.endIn
        } 
      }, {multi:true}, (err, result) => {
        res.redirect('/');
      });
    });
    
    router.post('/order/:id/delete', isLoggedIn, function(req, res){
      Order.findOneAndDelete({_id: (req.params.id)}, (err, result) => {
        if (err)
        console.log(err);
        else {
          res.redirect('/orders');
        };
      });
    });
    
    router.post('/order/:id/guest/delete', isLoggedIn, function(req, res){
      Order.findOneAndDelete({_id: (req.params.id)}, (err, result) => {
        if (err)
        console.log(err);
        else {
          res.redirect('/orders');
        };
      });
    });
    
    function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
        return next();
      }
      req.flash("login", "Norint atlikti si veiksma, reikia prisijungti!");
      res.redirect('/login');
    };
    
    function Pardavejas(req, res, next){
      if(req.user.role === "Pardavejas"){
        return next();
      }
      req.flash("delete", "Deja, jus neturite leidimo redaguoti uzsakymus!");
      res.redirect('/orders');
    };
    module.exports = router;
    