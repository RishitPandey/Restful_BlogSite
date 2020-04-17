var passportLocalStrategy = require('passport-local-mongoose');
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalStrategy);
module.exports = mongoose.model('User', UserSchema);