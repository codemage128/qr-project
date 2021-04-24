"use strict";

var express = require('express');

var cors = require('cors');

var dotenv = require('dotenv');

var mongoose = require('mongoose');

var logger = require('morgan');

var flash = require('connect-flash');

var path = require('path');

var passport = require('./helpers/passport');

var bodyParser = require('body-parser');

var session = require("express-session");

var MongoStore = require("connect-mongo");

require('dotenv').config();

var app = express();
var port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: "Skanz",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1209600000
  },
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE
  })
}));
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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  // res.header("X-powered-by", "Skanz");
  // res.header("server", "Skanz");
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.user = req.user || null;
  next();
});

var index = require('./routes/index');

var auth = require('./routes/auth');

var admin = require('./routes/admin');

app.use(index);
app.use(auth);
app.use(admin);
app.get('*', function (req, res, next) {
  res.status(404).render('404');
  next();
});
app.listen(port, function () {
  console.log("Example app listening at :".concat(port));
});