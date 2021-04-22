"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express');

var Qr = require('../models/qrcode');

var User = require('../models/users');

var QRCode = require('qrcode');

var router = express.Router();

var auth = function auth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('success_msg', 'Pls Login to continue');
  res.redirect("/login");
};

router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.render('index');
  }
});
router.get('/dashboard', auth, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var qrId, qrfield;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            qrfield = "";

            if (!(req.user.qrcodes.length > 0)) {
              _context.next = 6;
              break;
            }

            qrId = req.user.qrcodes[0];
            _context.next = 5;
            return Qr.findOne({
              _id: qrId
            });

          case 5:
            qrfield = _context.sent;

          case 6:
            res.render('dashboard', {
              qr: qrfield
            });

          case 7:
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
router.get("/code/:promocode", /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var promocode, qr;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            promocode = req.params.promocode;
            _context2.next = 3;
            return Qr.findOne({
              promocode: promocode
            });

          case 3:
            qr = _context2.sent;
            res.render('qrcode', {
              data: qr.content
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
router.post('/choose-type', auth, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var membertype, promocode, payload, a, qrList, promise, url, qrcode, user, _qrcode;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            membertype = req.body.membertype;
            promocode = req.body.promocode;
            payload = {
              content: "",
              promocode: ""
            };

            if (!(membertype === "0")) {
              _context3.next = 27;
              break;
            }

            //Don't have qr code
            a = Math.random();
            a = Math.floor(a * 1000000);
            payload.promocode = "A" + a;
            console.log(payload.promocode);
            _context3.next = 10;
            return Qr.findOne({
              promocode: payload.promocode
            });

          case 10:
            qrList = _context3.sent;

            if (qrList) {
              _context3.next = 25;
              break;
            }

            promise = new Promise(function (resolve, reject) {
              var segs = "Welcome To Skanz. This is your qr code on the Skanz, you can order and print your tattoo. https://skanz.link. Your code is " + payload.promocode;
              QRCode.toDataURL(segs, {
                version: 8
              }, function (err, url) {
                resolve(url);
              });
            });
            _context3.next = 15;
            return promise;

          case 15:
            url = _context3.sent;
            payload.content = url;
            _context3.next = 19;
            return Qr.create(payload);

          case 19:
            qrcode = _context3.sent;
            _context3.next = 22;
            return User.findOne({
              _id: req.user.id
            });

          case 22:
            user = _context3.sent;
            _context3.next = 25;
            return User.updateOne({
              _id: req.user.id
            }, {
              $push: {
                qrcodes: qrcode.id
              }
            });

          case 25:
            _context3.next = 36;
            break;

          case 27:
            _context3.next = 29;
            return Qr.findOne({
              promocode: promocode
            });

          case 29:
            _qrcode = _context3.sent;

            if (!_qrcode) {
              _context3.next = 35;
              break;
            }

            _context3.next = 33;
            return User.updateOne({
              _id: req.user.id
            }, {
              $push: {
                qrcodes: _qrcode.id
              }
            });

          case 33:
            _context3.next = 36;
            break;

          case 35:
            req.flash('warning_msg', 'That promocode doesn`t exist');

          case 36:
            res.redirect('back');

          case 37:
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