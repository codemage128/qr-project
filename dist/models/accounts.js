"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var accountSchema = new Schema({
  username: String,
  email: String,
  contact: String,
  country: String,
  address: String,
  customInfo: String
});
module.exports = _mongoose["default"].model("Account", accountSchema);