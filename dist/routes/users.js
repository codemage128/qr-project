"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express');

var Qr = require('../models/qrcode');

var User = require('../models/users');

var formidable = require('formidable');

var path = require('path');

var QRCode = require('qrcode');

var router = express.Router();

var fs = require('fs');

var auth = function auth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('success_msg', 'Pls Login to continue');
  res.redirect("/login");
};

router.get('/user/edit', auth, function (req, res, next) {
  res.locals.page_name = "Edit";
  res.render('user-edit');
});
router.post('/user/uploadimage', auth, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var form, p;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            form = new formidable.IncomingForm();
            form.parse(req);
            form.multiples = true; // store all uploads in the /uploads directory

            form.uploadDir = path.join(__dirname, '../public/uploads');
            p = new Promise(function (resolve, reject) {
              form.on('file', function (field, file) {
                var fileName = "";
                fs.rename(file.path, path.join(form.uploadDir, file.name), function (err) {
                  if (err) throw err;
                  var file_path = '/uploads/' + file.name;
                  resolve(file_path);
                });
              });
            });
            p.then(function (fileName) {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  profilePicture: fileName
                }
              }).then(function (data) {
                return res.json(fileName);
              });
            });

          case 6:
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
router.post('/user/update-info', auth, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            User.updateOne({
              _id: req.user.id
            }, req.body).then(function (data) {
              req.flash('success_msg', 'Tattoo has been deactived!');
              res.redirect('back');
            })["catch"](function (error) {
              return next(error);
            });

          case 1:
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
module.exports = router;