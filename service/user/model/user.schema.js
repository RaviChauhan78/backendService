const mongoose = require('mongoose');
const CC = require('../../../config/constant_collection');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

/**
 * User  Schema
 */
const UserSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  is_deleted: {
      type: Boolean,
      default: false
  },
});

// encrypt password before save
UserSchema.pre('save', function(next) {
  const user = this;
  var SALTING_ROUNDS = 10;
  if(!user.isModified || !user.isNew) {
    next();
  } else {
    bcrypt.hash(user.password, SALTING_ROUNDS, function(err, hash) {
      if (err) {
        console.log('Error hashing password for user', user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});

UserSchema.plugin(timestamp);
const UserModel = mongoose.model(CC.U001_USERS,UserSchema);
module.exports = UserModel;