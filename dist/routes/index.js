"use strict";

var express = require('express');

var router = express.Router();

var auth = function auth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('success_msg', 'Pls Login to continue');
  res.redirect("/login");
};

router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/dashboard', auth, function (req, res, next) {
  res.render('dashboard');
});
router.get('/contacts', auth, function (req, res, next) {
  res.render('contacts');
});
router.get('/profile', auth, function (req, res, next) {
  res.render('profile');
});
router.get('/settings', auth, function (req, res, next) {
  res.render('settings');
});
module.exports = router;