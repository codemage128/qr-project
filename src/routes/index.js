const express = require('express');
const Qr = require('../models/qrcode');
const User = require('../models/users');
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
        res.redirect('/dashboard');
    } else {
        res.render('index')
    }

})

router.get('/dashboard', auth, async (req, res, next) => {
    let qrId;
    let qrfield = "";
    if (req.user.qrcodes.length > 0) {
        qrId = req.user.qrcodes[0];
        qrfield = await Qr.findOne({ _id: qrId });
        qrfield = qrfield.content;
    }
    res.render('dashboard', {
        qr: qrfield
    });
})

router.post('/choose-type', auth, async (req, res, next) => {
    let membertype = req.body.membertype;
    let promocode = req.body.promocode;
    let payload = {
        content: "",
        promocode: "",
    }
    if (membertype === "0") {
        //Don't have qr code
        let a = Math.random();
        a = Math.floor(a * 1000000);
        payload.promocode = "A" + a;
        console.log(payload.promocode);
        let qrList = await Qr.findOne({ promocode: payload.promocode});
        if(!qrList){
            let promise = new Promise((resolve, reject) => {
                let segs = "Welcome To Skanz. This is your qr code on the Skanz, you can order and print your tattoo. https://skanz.link. Your code is " + payload.promocode;
                QRCode.toDataURL(segs, { version: 8 }, function (err, url) {
                    resolve(url);
                })
            });
            let url = await promise;
            payload.content = url;
            let qrcode = await Qr.create(payload);
            let user = await User.findOne({ _id: req.user.id });
            await User.updateOne({ _id: req.user.id }, { $push: { qrcodes: qrcode.id } });
        }
    } else {
        let qrcode = await Qr.findOne({ promocode: promocode });
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