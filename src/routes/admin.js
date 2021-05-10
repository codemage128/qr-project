const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });
const auth = require('../helpers/auth');
const Qr = require('../models/qrcode');
const User = require('../models/users');
var QRCode = require('qrcode')

const admin = function (req, res, next) {
    if (req.user.roleId === "admin")
        return next()
    req.flash('success_msg', 'You are not admin');
    res.redirect(`/`)
}
router.get('/admin/dashboard', auth, admin, async (req, res, next) => {

    let payload = {
        image: "",
        code: "",
        link: "https://skanz.live"
    }
    // for (var i = 1; i < 50; i++) {
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
    res.locals.page_name = "admin/dashboard"
    res.render('./admin/dashboard');
})
router.get('/admin/users', auth, admin, async (req, res, next) => {
    let users = await User.find({});
    res.locals.page_name = "admin/users"
    res.render('./admin/users', {
        users: users
    });
})

router.get('/admin/user/user', auth, admin, async (req, res, next) => {
    let users = await User.find({ roleId: "user" });
    res.locals.page_name = "admin/user/user"
    res.render('./admin/users', {
        users: users
    });
})
router.get('/admin/user/admin', auth, admin, async (req, res, next) => {
    let users = await User.find({ roleId: "admin" });
    res.locals.page_name = "admin/user/admin"
    res.render('./admin/users', {
        users: users
    });
})


router.get('/admin/tattoos', auth, admin, async (req, res, next) => {
    let code = req.query.code;
    let qrs = await Qr.find({});
    if(code){
        qrs = await Qr.find({code:{ $regex: code, $options: '$i' }});
    }
    res.locals.page_name = "admin/tattoos"
    res.render('./admin/tattoos', {
        qrs: qrs,
        code: code,
    });
})

router.get('/admin/tattoo/active', auth, admin, async (req, res, next) => {
    let qrs = await Qr.find({});
    let array = [];
    for (var i = 0; i < qrs.length; i++) {
        if (qrs[i].link !== "https://skanz.live") {
            array.push(qrs[i]);
        }
    }
    res.locals.page_name = "admin/tattoo/active"
    res.render('./admin/tattoos', {
        qrs: array
    });
})

router.get('/admin/tattoo/printed', auth, admin, async (req, res, next) => {
    let qrs = await Qr.find({});
    let array = [];
    for (var i = 0; i < qrs.length; i++) {
        if (qrs[i].printed === true) {
            array.push(qrs[i]);
        }
    }
    res.locals.page_name = "admin/tattoo/printed"
    res.render('./admin/tattoos', {
        qrs: array
    });
})

router.post('/user/create-account', auth, admin, async (req, res, next) => {
    let payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        roleId: req.body.type,
        profilePicture: "/assets/img/newUser.png",
    }
    let check = await User.findOne({ email: req.body.email });
    var Msg;
    if (check) {
        req.flash('warning_msg', 'Email has been used!');
        res.redirect('back');
    }
    User.create(payload).then(user => {
        req.flash('success_msg', user.email + ' user created.');
        res.redirect('back');
    })
})

router.get('/user/delete-account/:id', auth, admin, async (req, res, next) => {
    await User.deleteOne({ _id: req.params.id });
    req.flash('success_msg', 'User deleted.');
    res.redirect('back');
});

router.get('/tattoo-download/:id', auth, admin, async (req, res, next) => {
    let qr = await Qr.findOne({ _id: req.params.id });
    let fileName = './tattoos/' + qr.code + '.png';

    let image = qr.image.replace(/^data:image\/\w+;base64,/, "");
    image = image.replace(/ /g, '+');
    fs.writeFile(fileName, image, 'base64', function (err) {
        res.download(fileName, async (err) => {
            if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                });
            }
            await Qr.updateOne({ _id: qr.id }, { $set: { printed: true } });
            req.flash('success_msg', qr.code + 'Downloaded');
        });
        // res.redirect('back');
    });
})

module.exports = router;