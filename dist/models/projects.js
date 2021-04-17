"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var projectSchema = new Schema({
  title: String,
  description: String,
  technologies: Array,
  github: String,
  url: String,
  images: Array
});
module.exports = _mongoose["default"].model("Project", projectSchema);