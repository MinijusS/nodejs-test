var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  res.redirect('orders');
});

router.get('/orders', function(req, res, next){
    Order.find({})
    .exec(function(err, list_orders){
      if (err) {return next(err)};
      // Jeigu nera erroru turetu veikt
      res.render('../views/pages/index', {orders_list : list_orders});
    });
  });

router.get('/order/:id', function(req, res){
    Order.findById(req.params.id)
    .exec(function(err, details){
      if (err) {return next(err)};
      // Jeigu ner erroru
      res.render('../views/pages/order', {title: 'Daugiau info', detail : details});
    });  
  });

router.get('/orders/create', function(req, res){
   res.render('../views/pages/create');
 });

router.post('/orders/create', function(req, res){
  var orderData = new Order (
    {
    address : req.body.address,
    phone : req.body.phone,
    isDone : false,
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
  res.redirect('/');
});

router.post('/order/:id/done', function(req, res){
  Order.findOneAndUpdate({_id: (req.params.id)}, { $set: { isDone: true } }, { returnOriginal: false }, (err, result) => {
      if (err)
        console.log(err);
      else {
        res.redirect('/orders');
    };
  });
});

router.post('/order/:id/revert', function(req, res){
  Order.findOneAndUpdate({_id: (req.params.id)}, { $set: { isDone: false } }, { returnOriginal: false }, (err, result) => {
      if (err)
        console.log(err);
      else {
        res.redirect('/orders');
    };
  });
});

router.get('/order/:id/edit', function(req, res){
  Order.findById(req.params.id)
  .exec(function(err, detail){
    if(err) {return next(err)};
    res.render('../views/pages/edit', {order_details : detail});
  });
});

router.post('/order/:id/edit', function(req, res){
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

router.post('/order/:id/delete', function(req, res){
  Order.findOneAndDelete({_id: (req.params.id)}, (err, result) => {
      if (err)
        console.log(err);
      else {
        res.redirect('/orders');
    };
  });
});


module.exports = router;
