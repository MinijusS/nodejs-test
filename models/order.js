var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var items = new Schema(
  {
    name : String,
    sauce : String,
    quantity : Number
  });

var OrderSchema = new Schema(
  {
    isDone: {type: Boolean},
    items : [items], 
    phone: {type: Number},
    address: {type: String}
  });

  OrderSchema
  .virtual('url')
  .get(function(){
      return '/order/' + this._id;
    });

module.exports = mongoose.model ('Order', OrderSchema);
