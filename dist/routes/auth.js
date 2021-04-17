"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _passport = _interopRequireDefault(require("../helpers/passport"));

var _users = _interopRequireDefault(require("../models/users"));

var express = require('express');

var bodyParser = require('body-parser');

var router = express.Router();
router.get('/login', function (req, res, next) {
  console.log(req.isAuthenticated());
  res.render('login', {
    error: false
  });
});
router.post('/login', function (req, res, next) {
  _passport["default"].authenticate("local", function (err, user, info) {
    if (err) return next(err);

    if (!user) {
      return res.render('./admin/login', {
        error: true,
        data: info
      });
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
      req.flash("success_msg", "Du bist nun abgemeldet");
      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
});
router.get('/sign-up', function (req, res, next) {
  res.render('sign-up', {
    error: false
  });
});
router.post('/sign-up', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var check, Msg, payload, user;
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
              Msg = {
                message: "Email has been used!"
              };
              res.render('./admin/sign-up', {
                error: true,
                data: Msg
              });
            }

            payload = {
              username: req.body.name,
              password: req.body.password,
              email: req.body.email
            };
            _context.next = 7;
            return _users["default"].create(payload);

          case 7:
            user = _context.sent;
            Msg = {
              message: "User created"
            };
            res.render('./admin/sign-up', {
              error: true,
              data: Msg
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