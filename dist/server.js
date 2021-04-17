"use strict";

var express = require('express');

var cors = require('cors');

var dotenv = require('dotenv');

var mongoose = require('mongoose');

var logger = require('morgan');

var path = require('path');

var passport = require('./helpers/passport');

var bodyParser = require('body-parser');

require('dotenv').config();

var app = express();
var port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require("express-session")({
  secret: "Rusty is the worst and ugliest dog in the wolrd",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
var options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};
mongoose.connect(process.env.DATABASE, options).then(function (connected) {
  return console.log("Database connection established !");
})["catch"](function (err) {
  return console.error("There was an error connecting to database, the err is ".concat(err));
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express["static"](path.join(__dirname, "public")));
app.use(logger("dev"));

var index = require('./routes/index');

var auth = require('./routes/auth'); // const admin = require('./routes/admin')


app.use(index);
app.use(auth); // app.use(admin)

app.listen(port, function () {
  console.log("Example app listening at http://localhost:".concat(port));
});