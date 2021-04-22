"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _passport = _interopRequireDefault(require("../helpers/passport"));

var _crypto = _interopRequireDefault(require("crypto"));

var _users = _interopRequireDefault(require("../models/users"));

var express = require('express');

var _require = require('../helpers/utils'),
    removeSpaceFromText = _require.removeSpaceFromText;

var bodyParser = require('body-parser');

var router = express.Router();
router.get('/login', function (req, res, next) {
  console.log(req.isAuthenticated());

  if (req.isAuthenticated()) {
    res.redirect('dashboard');
  }

  res.render('login');
});
router.post('/login', function (req, res, next) {
  _passport["default"].authenticate("local", function (err, user, info) {
    if (err) return next(err);

    if (!user) {
      req.flash('error_msg', 'This user doesn`t exist');
      return res.redirect('login');
    }

    if (user.active === true) {
      req.flash("warning_msg", "Your account is not active, check your email to activate your account");
      return res.redirect("back");
    }

    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});
router.get('/log-out', function (req, res, next) {
  try {
    if (!req.user) res.redirect("/login");else {
      req.logout();
      req.flash("success_msg", "You are logged out!");
      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
});
router.get('/sign-up', function (req, res, next) {
  res.render('sign-up');
});
router.post('/sign-up', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var check, Msg, userslug, payload, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 2:
            check = _context.sent;

            if (check) {
              req.flash('warning_msg', 'Email has been used!');
              res.redirect('back');
            }

            userslug = removeSpaceFromText(req.body.firstName) + "-" + removeSpaceFromText(req.body.lastName);
            payload = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              userslug: userslug,
              password: req.body.password,
              email: req.body.email,
              profilePicture: "https://gravatar.com/avatar/" + _crypto["default"].createHash("md5").update(req.body.email).digest("hex").toString() + "?s=200" + "&d=retro"
            }; // User.create(payload).then(() => {
            //     req.flash('success_msg', 'Registration is successful');
            //     res.redirect('/login');
            // }).catch(e => next(e));

            _context.next = 8;
            return _users["default"].create(payload);

          case 8:
            user = _context.sent;
            req.logIn(user, function (err) {
              if (err) return next(err);

              if (user.roleId === "user") {
                return res.redirect('/dashboard');
              } else if (user.roleId === "admin") {
                return res.redirect('/admin/dashboard');
              }
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;