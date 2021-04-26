const express = require('express');
const Qr = require('../models/qrcode');
const User = require('../models/users'); ``
var QRCode = require('qrcode')
const router = express.Router();

const auth = (req, res, next) => {
    if (req.isAuthenticated())
        return next()
    req.flash('success_msg', 'Pls Login to continue');
    res.redirect(`/login`)
};

router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.roleId === "admin") {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/dashboard');
        }
    } else {
        res.render('index')
    }

})

router.post('/update-link', auth, async (req, res, next) => {
    console.log(req.body.code);
    let qrcode = await Qr.findOne({ code: req.body.code });
    Qr.updateOne({ _id: qrcode.id }, { $set: { link: req.body.link } }).then(() => {
        req.flash('success_msg', 'Embeded link has been updated!');
        res.redirect('dashboard');
    }).catch(err => {
        req.flash('error_msg', 'Embeded link update failed');
        res.redirect('dashboard');
    })
    
})

router.post('/dashboard', auth, async (req, res, next) => {
    let qrcodelist = await Qr.findOne({ code: req.body.code });
    if (!qrcodelist) {
        req.flash('warning_msg', 'That promocode doesn`t exist');
    }
    res.redirect('/dashboard');
    // res.render('dashboard', {
    //     qr: qrfield
    // });
})

router.get('/dashboard', auth, async (req, res, next) => {

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

    let qrId;
    let qrfield = "";
    if (req.user.qrcodes.length > 0) {
        qrId = req.user.qrcodes[0];
        qrfield = await Qr.findOne({ _id: qrId });

    }
    res.render('dashboard', {
        qr: qrfield
    });
})

router.get("/code/:promocode", async (req, res, next) => {
    let promocode = req.params.promocode;
    let qr = await Qr.findOne({ promocode: promocode });
    res.render('qrcode', { data: qr.content });
})

router.post('/choose-type', auth, async (req, res, next) => {
    let membertype = req.body.membertype;
    let promocode = req.body.promocode;
    let payload = {
        image: "",
        code: "",
        link: "http://skanz.live"
    }
    if (membertype === "0") {
        //Don't have qr code
        let a = Math.random();
        a = Math.floor(a * 1000000);
        payload.code = "A" + a;
        let qrList = await Qr.findOne({ code: payload.image });
        if (!qrList) {
            let promise = new Promise((resolve, reject) => {
                let segs = "http://c.skanz.live/" + payload.code;
                QRCode.toDataURL(segs, function (err, url) {
                    resolve(url);
                })
            });
            let url = await promise;
            payload.image = url;
            let qrcode = await Qr.create(payload);
            let user = await User.findOne({ _id: req.user.id });
            await User.updateOne({ _id: req.user.id }, { $push: { qrcodes: qrcode.id } });
        }
    } else {
        let qrcode = await Qr.findOne({ code: promocode });
        if (qrcode) {
            await User.updateOne({ _id: req.user.id }, { $push: { qrcodes: qrcode.id } });
        } else {
            req.flash('warning_msg', 'That promocode doesn`t exist');
        }
    }


    res.redirect('back');
})

router.get('/contacts', auth, (req, res, next) => {
    res.render('contacts');
})
router.get('/profile', auth, (req, res, next) => {
    res.render('profile');
})
router.get('/settings', auth, (req, res, next) => {
    res.render('settings');
})

module.exports = router;