"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

var _crypto = _interopRequireDefault(require("crypto"));

var Schema = _mongoose["default"].Schema;
var userSchema = new Schema({
  firstName: String,
  lastName: String,
  userslug: String,
  roleId: {
    type: String,
    "enum": ["admin", "user"],
    "default": "user"
  },
  email: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    "default": false
  },
  token: String,
  profilePicture: {
    type: String,
    "default": "https://gravatar.com/avatar/?s=200&d=retro"
  },
  password: String
}, {
  timestamps: true
});
userSchema.pre("save", function (next) {
  var user = this;
  var SALT_FACTOR = 12;
  if (!user.isModified("password")) return next();

  _bcryptNodejs["default"].genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    _bcryptNodejs["default"].hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  _bcryptNodejs["default"].compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = _mongoose["default"].model("User", userSchema);