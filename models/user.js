var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var moment = require('moment');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: Boolean
}, 
{ timestamps: true});

UserSchema
.virtual('date')
.get(function(){
    return moment(this.createdAt).format("YYYY MMMM D");
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);