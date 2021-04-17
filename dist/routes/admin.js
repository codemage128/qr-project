"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express');

var router = express.Router();

var multer = require('multer');

var path = require('path');

var Project = require('../models/projects');

var Account = require('../models/accounts');

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

var _require = require('.'),
    route = _require.route;

router.get('/dashboard', auth, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.render('./admin/index');

          case 1:
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
router.get('/dashboard/projects', auth, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var projects;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Project.find();

          case 2:
            projects = _context2.sent;
            res.render('./admin/projects/projects', {
              projects: projects
            });

          case 4:
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
router.get('/dashboard/new-project', auth, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            res.render('./admin/projects/new-project');

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
router.get('/dashboard/delete-project/', auth, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return Project.deleteOne({
              _id: req.query.id
            });

          case 2:
            res.redirect('back');

          case 3:
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
router.get('/dashboard/edit-project/', auth, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var project, data;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Project.findOne({
              _id: req.query.id
            });

          case 2:
            project = _context5.sent;
            data = {
              id: project._id,
              title: project.title,
              description: project.description,
              technologies: project.technologies.join(),
              github: project.github,
              url: project.url
            };
            res.render('./admin/projects/edit-project', {
              data: data
            });

          case 5:
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
router.post('/dashboard/create-project', auth, upload.any(), /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var title, description, technologies, github, url, images, skills, payload;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            title = req.body.title;
            description = req.body.description;
            technologies = req.body.technologies;
            github = req.body.github;
            url = req.body.url;
            images = [];
            req.files.forEach(function (file) {
              images.push(file.originalname);
            });
            skills = technologies[1].split(",");
            payload = {
              title: title,
              description: description,
              technologies: skills,
              github: github,
              url: url,
              images: images
            };
            _context6.next = 11;
            return Project.create(payload);

          case 11:
            res.redirect("/dashboard/projects");

          case 12:
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
router.post('/dashboard/update-project', auth, upload.any(), /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var id, title, description, technologies, github, url, skills, project, images, payload;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.body.id;
            title = req.body.title;
            description = req.body.description;
            technologies = req.body.technologies;
            github = req.body.github;
            url = req.body.url;
            skills = technologies[1].split(",");
            _context7.next = 9;
            return Project.findOne({
              _id: id
            });

          case 9:
            project = _context7.sent;
            images = project.images;

            if (req.files.length > 0) {
              images = [];
              req.files.forEach(function (file) {
                images.push(file.originalname);
              });
            }

            payload = {
              title: title,
              description: description,
              technologies: skills,
              github: github,
              url: url,
              images: images
            };
            _context7.next = 15;
            return Project.update({
              _id: id
            }, payload);

          case 15:
            res.redirect("/dashboard/projects");

          case 16:
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
router.get('/dashboard/accounts', auth, /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var accounts;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return Account.find();

          case 2:
            accounts = _context8.sent;
            res.render('./admin/accounts/accounts', {
              accounts: accounts
            });

          case 4:
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
router.get('/dashboard/new-account', auth, /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            res.render('./admin/accounts/new-account');

          case 1:
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
router.get('/dashboard/edit-account', auth, /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var account;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return Account.findOne({
              _id: req.query.id
            });

          case 2:
            account = _context10.sent;
            res.render('./admin/accounts/edit-account', {
              account: account
            });

          case 4:
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
router.get('/dashboard/delete-account', auth, /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return Account.deleteOne({
              _id: req.query.id
            });

          case 2:
            res.redirect('back');

          case 3:
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
router.post('/dashboard/create-account', auth, /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var username, email, contact, country, address, customInfo, payload;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            username = req.body.username;
            email = req.body.email;
            contact = req.body.contact;
            country = req.body.country;
            address = req.body.address;
            customInfo = req.body.customInfo;
            payload = {
              username: username,
              email: email,
              contact: contact,
              country: country,
              address: address,
              customInfo: customInfo
            };
            _context12.next = 9;
            return Account.create(payload);

          case 9:
            res.redirect('/dashboard/accounts');

          case 10:
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
router.post('/dashboard/update-account', auth, /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var username, email, contact, country, address, customInfo, payload;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            username = req.body.username;
            email = req.body.email;
            contact = req.body.contact;
            country = req.body.country;
            address = req.body.address;
            customInfo = req.body.customInfo;
            payload = {
              username: username,
              email: email,
              contact: contact,
              country: country,
              address: address,
              customInfo: customInfo
            };
            _context13.next = 9;
            return Account.update({
              _id: req.body.id
            }, payload);

          case 9:
            res.redirect('/dashboard/accounts');

          case 10:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}());
module.exports = router;