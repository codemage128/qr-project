"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express');

var router = express.Router();

var multer = require('multer');

var path = require('path');

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './src/public/uploads');
  },
  filename: function filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

var auth = require('../helpers/auth');

var Qr = require('../models/qrcode');

var User = require('../models/users');

var QRCode = require('qrcode');

var admin = function admin(req, res, next) {
  if (req.user.roleId === "admin") return next();
  req.flash('success_msg', 'You are not admin');
  res.redirect("/");
};

router.get('/admin/dashboard', auth, admin, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var payload, i, promise, url, qrcode;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = {
              image: "",
              code: "",
              link: "http://skanz.live"
            };
            i = 1;

          case 2:
            if (!(i < 50)) {
              _context.next = 15;
              break;
            }

            payload.code = "A" + String(i).padStart(6, '0');
            promise = new Promise(function (resolve, reject) {
              var segs = "http://c.skanz.live/" + payload.code;
              QRCode.toDataURL(segs, function (err, url) {
                resolve(url);
              });
            });
            _context.next = 7;
            return promise;

          case 7:
            url = _context.sent;
            payload.image = url;
            _context.next = 11;
            return Qr.create(payload);

          case 11:
            qrcode = _context.sent;

          case 12:
            i++;
            _context.next = 2;
            break;

          case 15:
            res.locals.page_name = "admin/dashboard";
            res.render('./admin/dashboard');

          case 17:
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
router.get('/admin/users', auth, admin, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var users;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return User.find({});

          case 2:
            users = _context2.sent;
            res.locals.page_name = "admin/users";
            res.render('./admin/users', {
              users: users
            });

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/admin/tattoos', auth, admin, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var qrs;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Qr.find({});

          case 2:
            qrs = _context3.sent;
            res.locals.page_name = "admin/tattoos";
            res.render('./admin/tattoos', {
              qrs: qrs
            });

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('/user/create-account', auth, admin, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var payload, check, Msg;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            payload = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              roleId: req.body.type,
              profilePicture: "/assets/img/newUser.png"
            };
            _context4.next = 3;
            return User.findOne({
              email: req.body.email
            });

          case 3:
            check = _context4.sent;

            if (check) {
              req.flash('warning_msg', 'Email has been used!');
              res.redirect('back');
            }

            User.create(payload).then(function (user) {
              req.flash('success_msg', user.email + ' user created.');
              res.redirect('back');
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
module.exports = router;