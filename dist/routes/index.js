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
    if (req.user.roleId === "admin") {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.render('index');
  }
});
router.get('/out-profile/:slug', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return User.findOne({
              userslug: req.params.slug
            });

          case 2:
            user = _context.sent;
            res.render('out-profile', {
              person: user
            });

          case 4:
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
router.get('/deactive-code', auth, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var newQrcodelist, user, qrs, carIndex;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            newQrcodelist = [];
            _context2.next = 3;
            return User.findOne({
              _id: req.user.id
            });

          case 3:
            user = _context2.sent;
            qrs = user.qrcodes;
            carIndex = qrs.indexOf(req.query.id);
            qrs.splice(carIndex, 1);
            newQrcodelist = qrs;
            _context2.next = 10;
            return Qr.updateOne({
              _id: req.query.id
            }, {
              link: "https://skanz.live"
            });

          case 10:
            User.updateOne({
              _id: req.user.id
            }, {
              $set: {
                qrcodes: newQrcodelist
              }
            }).then(function () {
              req.flash('success_msg', 'Tattoo has been deactived!');
              res.redirect('dashboard');
            })["catch"](function (err) {
              req.flash('error_msg', 'Tatto deactivate is failed');
              res.redirect('dashboard');
            });

          case 11:
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
router.post('/update-link', auth, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            Qr.updateOne({
              _id: req.body.id
            }, {
              $set: {
                link: req.body.link
              }
            }).then(function () {
              req.flash('success_msg', 'Embeded link has been updated!');
              res.redirect('dashboard');
            })["catch"](function (err) {
              req.flash('error_msg', 'Embeded link update is failed');
              res.redirect('dashboard');
            });

          case 1:
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
router.post('/update-tatto-type', auth, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var single, link;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            single = 1;
            link = "https://skanz.live/out-profile/" + req.user.userslug;
            ;

            if (req.body.tattotype === "false") {
              single = 0;
              link = "https://skanz.live";
            }

            Qr.updateOne({
              _id: req.body.tattooid
            }, {
              $set: {
                single: single,
                link: link
              }
            }).then(function () {
              req.flash('success_msg', 'Tattoo type is changed');
              res.redirect('back');
            })["catch"](function (err) {
              return next(err);
            });

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()); // router.post('/dashboard', auth, async (req, res, next) => {
//     let qrcodelist = await Qr.findOne({ code: req.body.code });
//     if (!qrcodelist) {
//         req.flash('warning_msg', 'That promocode doesn`t exist');
//     }
//     res.redirect('/dashboard');
//     // res.render('dashboard', {
//     //     qr: qrfield
//     // });
// })

router.get('/dashboard', auth, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var qrId, qrfields, result, i, field;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // let payload = {
            //     image: "",
            //     code: "",
            //     link: "http://skanz.live"
            // }
            // for (var i = 1; i < 10; i++) {
            //     payload.code = "A" + String(i).padStart(6, '0');
            //     let promise = new Promise((resolve, reject) => {
            //         let segs = "http://c.skanz.live/" + payload.code;
            //         QRCode.toDataURL(segs, function (err, url) {
            //             resolve(url);
            //         })
            //     });
            //     let url = await promise;
            //     payload.image = url;
            //     let qrcode = await Qr.create(payload);
            // }
            // for (var i = 0; i < 999999; i++) {
            //     let payload = {
            //         content: String(i).padStart(6, '0') + ".png",
            //         promocode: "A" + String(i).padStart(6, '0'),
            //     }
            //     let qrcode = await Qr.create(payload);
            // }
            // await Qr.deleteMany();
            // let qrcode = await Qr.find();
            // console.log(qrcode.length);
            // let a = Math.random();
            // a = Math.floor(a * 1000000);
            // QRCode.toDataURL("https://c.skanz.live/A" + a, function (err, url) {
            //     res.render('dashboard', {
            //         qr: url
            //     });
            // })
            qrfields = [];

            if (!(req.user.qrcodes.length > 0)) {
              _context5.next = 12;
              break;
            }

            qrId = req.user.qrcodes;
            i = 0;

          case 4:
            if (!(i < qrId.length)) {
              _context5.next = 12;
              break;
            }

            _context5.next = 7;
            return Qr.findOne({
              _id: qrId[i]
            });

          case 7:
            field = _context5.sent;
            qrfields.push(field);

          case 9:
            i++;
            _context5.next = 4;
            break;

          case 12:
            res.render('dashboard', {
              qrs: qrfields
            });

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
router.get('/shop', auth, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            res.locals.page_name = "shop";
            res.render('shop');

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());
router.post('/active-tattoo', auth, /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var code, qr, user;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            code = "A" + req.body.code;
            _context7.next = 3;
            return Qr.findOne({
              code: code
            });

          case 3:
            qr = _context7.sent;

            if (code === "") {
              req.flash('warning_msg', 'please enter the code!');
              res.redirect('back');
            }

            if (!qr) {
              req.flash('error_msg', 'That promocode doesn`t exist');
              res.redirect('back');
            }

            _context7.next = 8;
            return User.findOne({
              _id: req.user.id
            });

          case 8:
            user = _context7.sent;
            _context7.next = 11;
            return User.updateOne({
              _id: req.user.id
            }, {
              $push: {
                qrcodes: qr.id
              }
            });

          case 11:
            req.flash('success_msg', "You've acivated one Tattoo!");
            res.redirect('back');

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}());
router.post('/choose-type', auth, /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var membertype, promocode, payload, qrcode;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            membertype = req.body.membertype;
            promocode = req.body.promocode;
            payload = {
              image: "",
              code: "",
              link: "https://skanz.live"
            };

            if (!(membertype === "0")) {
              _context8.next = 7;
              break;
            }

            res.redirect('/shop'); //Don't have qr code
            // let a = Math.random();
            // a = Math.floor(a * 1000000);
            // payload.code = "A" + a;
            // let qrList = await Qr.findOne({ code: payload.image });
            // if (!qrList) {
            //     let promise = new Promise((resolve, reject) => {
            //         let segs = "http://c.skanz.live/" + payload.code;
            //         QRCode.toDataURL(segs, function (err, url) {
            //             resolve(url);
            //         })
            //     });
            //     let url = await promise;
            //     payload.image = url;
            //     let qrcode = await Qr.create(payload);
            //     let user = await User.findOne({ _id: req.user.id });
            //     await User.updateOne({ _id: req.user.id }, { $push: { qrcodes: qrcode.id } });
            // }

            _context8.next = 16;
            break;

          case 7:
            _context8.next = 9;
            return Qr.findOne({
              code: promocode
            });

          case 9:
            qrcode = _context8.sent;

            if (!qrcode) {
              _context8.next = 15;
              break;
            }

            _context8.next = 13;
            return User.updateOne({
              _id: req.user.id
            }, {
              $push: {
                qrcodes: qrcode.id
              }
            });

          case 13:
            _context8.next = 16;
            break;

          case 15:
            req.flash('warning_msg', 'That promocode doesn`t exist');

          case 16:
            res.redirect('back');

          case 17:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}());
router.get('/delete-tattoo/:id', auth, /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, nect) {
    var qrId;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            qrId = req.params.id;
            Qr.deleteOne({
              _id: qrId
            }).then(function () {
              req.flash('success_msg', 'QR code has been deleted.');
              res.redirect('back');
            });

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}());
router.get('/delete-social-media/:type', auth, /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var type, link, update;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            type = req.params.type;
            link = "";

            if (type == "reset") {
              update = {
                facebook: "",
                linkedin: "",
                twitter: "",
                instagram: "",
                spotify: "",
                pinterest: "",
                skype: "",
                whatsapp: "",
                youtube: "",
                safari: "",
                doc: "",
                paypal: "",
                shop: "",
                mailbox: ""
              };
              User.updateOne({
                _id: req.user.id
              }, update).then(function () {
                req.flash('success_msg', 'All link reseted');
                res.redirect('back');
              });
            }

            if (type == "facebook") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  facebook: link
                }
              }).then(function () {
                req.flash('success_msg', 'Facebook link deleted');
                res.redirect('back');
              });
            }

            if (type == "linkedin") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  linkedin: link
                }
              }).then(function () {
                req.flash('success_msg', 'Lnkedin link deleted');
                res.redirect('back');
              });
            }

            if (type == "twitter") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  twitter: link
                }
              }).then(function () {
                req.flash('success_msg', 'Twitter link deleted');
                res.redirect('back');
              });
            }

            if (type == "instagram") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  instagram: link
                }
              }).then(function () {
                req.flash('success_msg', 'Instagram link deleted');
                res.redirect('back');
              });
            }

            if (type == "spotify") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  spotify: link
                }
              }).then(function () {
                req.flash('success_msg', 'Spotify link deleted');
                res.redirect('back');
              });
            }

            if (type == "pinterest") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  pinterest: link
                }
              }).then(function () {
                req.flash('success_msg', 'Pinterest link deleted');
                res.redirect('back');
              });
            }

            if (type == "skype") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  skype: link
                }
              }).then(function () {
                req.flash('success_msg', 'Skype link deleted');
                res.redirect('back');
              });
            }

            if (type == "whatsapp") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  whatsapp: link
                }
              }).then(function () {
                req.flash('success_msg', 'Whatsapp link deleted');
                res.redirect('back');
              });
            }

            if (type == "youtube") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  youtube: link
                }
              }).then(function () {
                req.flash('success_msg', 'Youtube link deleted');
                res.redirect('back');
              });
            }

            if (type == "safari") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  safari: link
                }
              }).then(function () {
                req.flash('success_msg', 'Safari link deleted');
                res.redirect('back');
              });
            }

            if (type == "google-docs") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  doc: link
                }
              }).then(function () {
                req.flash('success_msg', 'Doc link deleted');
                res.redirect('back');
              });
            }

            if (type == "paypal") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  paypal: link
                }
              }).then(function () {
                req.flash('success_msg', 'Paypal link deleted');
                res.redirect('back');
              });
            }

            if (type == "microsoft-store") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  shop: link
                }
              }).then(function () {
                req.flash('success_msg', 'Shop link deleted');
                res.redirect('back');
              });
            }

            if (type == "google-inbox") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  mailbox: link
                }
              }).then(function () {
                req.flash('success_msg', 'Mailbox link deleted');
                res.redirect('back');
              });
            }

          case 17:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}());
router.post('/update-social-medial', auth, /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var link, type;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            link = req.body.link;
            type = req.body.type;

            if (type == "facebook") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  facebook: link
                }
              }).then(function () {
                req.flash('success_msg', 'Facebook link added');
                res.redirect('back');
              });
            }

            if (type == "linkedin") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  linkedin: link
                }
              }).then(function () {
                req.flash('success_msg', 'Lnkedin link added');
                res.redirect('back');
              });
            }

            if (type == "twitter") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  twitter: link
                }
              }).then(function () {
                req.flash('success_msg', 'Twitter link added');
                res.redirect('back');
              });
            }

            if (type == "instagram") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  instagram: link
                }
              }).then(function () {
                req.flash('success_msg', 'Lnkedin link added');
                res.redirect('back');
              });
            }

            if (type == "spotify") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  spotify: link
                }
              }).then(function () {
                req.flash('success_msg', 'Spotify link added');
                res.redirect('back');
              });
            }

            if (type == "pinterest") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  pinterest: link
                }
              }).then(function () {
                req.flash('success_msg', 'Pinterest link added');
                res.redirect('back');
              });
            }

            if (type == "skype") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  skype: link
                }
              }).then(function () {
                req.flash('success_msg', 'Skype link added');
                res.redirect('back');
              });
            }

            if (type == "whatsapp") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  whatsapp: link
                }
              }).then(function () {
                req.flash('success_msg', 'Whatsapp link added');
                res.redirect('back');
              });
            }

            if (type == "youtube") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  youtube: link
                }
              }).then(function () {
                req.flash('success_msg', 'Youtube link added');
                res.redirect('back');
              });
            }

            if (type == "safari") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  safari: link
                }
              }).then(function () {
                req.flash('success_msg', 'Safari link added');
                res.redirect('back');
              });
            }

            if (type == "google-docs") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  doc: link
                }
              }).then(function () {
                req.flash('success_msg', 'Doc link added');
                res.redirect('back');
              });
            }

            if (type == "paypal") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  paypal: link
                }
              }).then(function () {
                req.flash('success_msg', 'Paypal link added');
                res.redirect('back');
              });
            }

            if (type == "microsoft-store") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  shop: link
                }
              }).then(function () {
                req.flash('success_msg', 'Shop link added');
                res.redirect('back');
              });
            }

            if (type == "google-inbox") {
              User.updateOne({
                _id: req.user.id
              }, {
                $set: {
                  mailbox: link
                }
              }).then(function () {
                req.flash('success_msg', 'Mailbox link added');
                res.redirect('back');
              });
            }

          case 16:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}());
router.get('/contact', function (req, res, next) {
  res.render('contact');
});
router.get('/profile', auth, /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            res.locals.page_name = "profile";
            res.render('profile');

          case 2:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}());
router.get('/settings', auth, function (req, res, next) {
  res.locals.page_name = "settings";
  res.render('settings');
});
router.get('/notification', auth, function (req, res, next) {
  res.locals.page_name = "notification";
  res.render('notification');
});
router.get('/security', auth, function (req, res, next) {
  res.locals.page_name = "security";
  res.render('security');
});
module.exports = router;