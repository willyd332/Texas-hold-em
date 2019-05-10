const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  money: {type: Number, required: true},
  profileImage: {type: String}

});

module.exports = mongoose.model('User', UserSchema);
