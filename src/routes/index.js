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
        if (req.user.roleId === "admin") {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/dashboard');
        }
    } else {
        res.render('index')
    }
})

router.get('/out-profile/:slug', async (req, res, next) => {
    let user = await User.findOne({ userslug: req.params.slug });
    res.render('out-profile', {person : user});
})


router.get('/deactive-code', auth, async (req, res, next) => {
    let newQrcodelist = [];
    let user = await User.findOne({ _id: req.user.id });
    var qrs = user.qrcodes;
    var carIndex = qrs.indexOf(req.query.id);
    qrs.splice(carIndex, 1);
    newQrcodelist = qrs;
    await Qr.updateOne({ _id: req.query.id }, { link: "https://skanz.live" })
    User.updateOne({ _id: req.user.id }, { $set: { qrcodes: newQrcodelist } }).then(() => {
        req.flash('success_msg', 'Tattoo has been deactived!');
        res.redirect('dashboard');
    }).catch(err => {
        req.flash('error_msg', 'Tatto deactivate is failed');
        res.redirect('dashboard');
    });
})

router.post('/update-link', auth, async (req, res, next) => {
    Qr.updateOne({ _id: req.body.id }, { $set: { link: req.body.link } }).then(() => {
        req.flash('success_msg', 'Embeded link has been updated!');
        res.redirect('dashboard');
    }).catch(err => {
        req.flash('error_msg', 'Embeded link update is failed');
        res.redirect('dashboard');
    })
})

router.post('/update-tatto-type', auth, async (req, res, next) => {
    let single = 1;
    let link = "https://skanz.live/out-profile/" + req.user.userslug;;
    if (req.body.tattotype === "false") {
        single = 0;
        link = "https://skanz.live"
    }
    Qr.updateOne({ _id: req.body.tattooid }, { $set: { single: single, link: link } }).then(() => {
        req.flash('success_msg', 'Tattoo type is changed');
        res.redirect('back');
    }).catch(err => next(err));
})

// router.post('/dashboard', auth, async (req, res, next) => {
//     let qrcodelist = await Qr.findOne({ code: req.body.code });
//     if (!qrcodelist) {
//         req.flash('warning_msg', 'That promocode doesn`t exist');
//     }
//     res.redirect('/dashboard');
//     // res.render('dashboard', {
//     //     qr: qrfield
//     // });
// })

router.get('/dashboard', auth, async (req, res, next) => {

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

    let qrId;
    let qrfields = [];
    let result;
    if (req.user.qrcodes.length > 0) {
        qrId = req.user.qrcodes;
        for (var i = 0; i < qrId.length; i++) {
            let field = await Qr.findOne({ _id: qrId[i] });
            qrfields.push(field);
        }
    }
    res.render('dashboard', {
        qrs: qrfields
    });

})

router.get('/shop', auth, async (req, res, next) => {
    res.locals.page_name = "shop";
    res.render('shop');
})


router.post('/active-tattoo', auth, async (req, res, next) => {
    let code = "A" + req.body.code;
    let qr = await Qr.findOne({ code: code });
    if (code === "") {
        req.flash('warning_msg', 'please enter the code!');
        res.redirect('back');
    }
    if (!qr) {
        req.flash('error_msg', 'That promocode doesn`t exist');
        res.redirect('back');
    }

    let user = await User.findOne({ _id: req.user.id });
    await User.updateOne({ _id: req.user.id }, { $push: { qrcodes: qr.id } });
    req.flash('success_msg', "You've acivated one Tattoo!");
    res.redirect('back');
})

router.post('/choose-type', auth, async (req, res, next) => {
    let membertype = req.body.membertype;
    let promocode = req.body.promocode;
    let payload = {
        image: "",
        code: "",
        link: "https://skanz.live"
    }
    if (membertype === "0") {
        res.redirect('/shop');
        //Don't have qr code
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
router.get('/delete-tattoo/:id', auth, async (req, res, nect) => {
    let qrId = req.params.id;
    Qr.deleteOne({_id: qrId}).then(() => {
        req.flash('success_msg', 'QR code has been deleted.');
        res.redirect('back');
    });
});

router.get('/delete-social-media/:type', auth, async(req, res, next) => {
    let type = req.params.type;
    let link = "";
    if(type == "reset") {
        let update = {
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
        }
        User.updateOne({ _id: req.user.id }, update).then(() => {
            req.flash('success_msg', 'all link reseted');
            res.redirect('back');
        })
    }
    if (type == "facebook") {
        User.updateOne({ _id: req.user.id }, { $set: { facebook: link } }).then(() => {
            req.flash('success_msg', 'facebook link deleted');
            res.redirect('back');
        })
    }
    if (type == "linkedin") {
        User.updateOne({ _id: req.user.id }, { $set: { linkedin: link } }).then(() => {
            req.flash('success_msg', 'lnkedin link deleted');
            res.redirect('back');
        })
    }
    if (type == "twitter") {
        User.updateOne({ _id: req.user.id }, { $set: { twitter: link } }).then(() => {
            req.flash('success_msg', 'twitter link deleted');
            res.redirect('back');
        })
    }
    if (type == "instagram") {
        User.updateOne({ _id: req.user.id }, { $set: { instagram: link } }).then(() => {
            req.flash('success_msg', 'lnkedin link deleted');
            res.redirect('back');
        })
    }
    if (type == "spotify") {
        User.updateOne({ _id: req.user.id }, { $set: { spotify: link } }).then(() => {
            req.flash('success_msg', 'spotify link deleted');
            res.redirect('back');
        })
    }
    if (type == "pinterest") {
        User.updateOne({ _id: req.user.id }, { $set: { pinterest: link } }).then(() => {
            req.flash('success_msg', 'pinterest link deleted');
            res.redirect('back');
        })
    }
    if (type == "skype") {
        User.updateOne({ _id: req.user.id }, { $set: { skype: link } }).then(() => {
            req.flash('success_msg', 'skype link deleted');
            res.redirect('back');
        })
    }
    if (type == "whatsapp") {
        User.updateOne({ _id: req.user.id }, { $set: { whatsapp: link } }).then(() => {
            req.flash('success_msg', 'whatsapp link deleted');
            res.redirect('back');
        })
    }
    if (type == "youtube") {
        User.updateOne({ _id: req.user.id }, { $set: { youtube: link } }).then(() => {
            req.flash('success_msg', 'youtube link deleted');
            res.redirect('back');
        })
    }
    if (type == "safari") {
        User.updateOne({ _id: req.user.id }, { $set: { safari: link } }).then(() => {
            req.flash('success_msg', 'safari link deleted');
            res.redirect('back');
        })
    }
    if (type == "google-docs") {
        User.updateOne({ _id: req.user.id }, { $set: { doc: link } }).then(() => {
            req.flash('success_msg', 'doc link deleted');
            res.redirect('back');
        })
    }
    if (type == "paypal") {
        User.updateOne({ _id: req.user.id }, { $set: { paypal: link } }).then(() => {
            req.flash('success_msg', 'paypal link deleted');
            res.redirect('back');
        })
    }
    if (type == "microsoft-store") {
        User.updateOne({ _id: req.user.id }, { $set: { shop: link } }).then(() => {
            req.flash('success_msg', 'shop link deleted');
            res.redirect('back');
        })
    }
    if (type == "google-inbox") {
        User.updateOne({ _id: req.user.id }, { $set: { mailbox: link } }).then(() => {
            req.flash('success_msg', 'mailbox link deleted');
            res.redirect('back');
        })
    }
})

router.post('/update-social-medial', auth, async (req, res, next) => {
    let link = req.body.link;
    let type = req.body.type;
    if (type == "facebook") {
        User.updateOne({ _id: req.user.id }, { $set: { facebook: link } }).then(() => {
            req.flash('success_msg', 'facebook link added');
            res.redirect('back');
        })
    }
    if (type == "linkedin") {
        User.updateOne({ _id: req.user.id }, { $set: { linkedin: link } }).then(() => {
            req.flash('success_msg', 'lnkedin link added');
            res.redirect('back');
        })
    }
    if (type == "twitter") {
        User.updateOne({ _id: req.user.id }, { $set: { twitter: link } }).then(() => {
            req.flash('success_msg', 'twitter link added');
            res.redirect('back');
        })
    }
    if (type == "instagram") {
        User.updateOne({ _id: req.user.id }, { $set: { instagram: link } }).then(() => {
            req.flash('success_msg', 'lnkedin link added');
            res.redirect('back');
        })
    }
    if (type == "spotify") {
        User.updateOne({ _id: req.user.id }, { $set: { spotify: link } }).then(() => {
            req.flash('success_msg', 'spotify link added');
            res.redirect('back');
        })
    }
    if (type == "pinterest") {
        User.updateOne({ _id: req.user.id }, { $set: { pinterest: link } }).then(() => {
            req.flash('success_msg', 'pinterest link added');
            res.redirect('back');
        })
    }
    if (type == "skype") {
        User.updateOne({ _id: req.user.id }, { $set: { skype: link } }).then(() => {
            req.flash('success_msg', 'skype link added');
            res.redirect('back');
        })
    }
    if (type == "whatsapp") {
        User.updateOne({ _id: req.user.id }, { $set: { whatsapp: link } }).then(() => {
            req.flash('success_msg', 'whatsapp link added');
            res.redirect('back');
        })
    }
    if (type == "youtube") {
        User.updateOne({ _id: req.user.id }, { $set: { youtube: link } }).then(() => {
            req.flash('success_msg', 'youtube link added');
            res.redirect('back');
        })
    }
    if (type == "safari") {
        User.updateOne({ _id: req.user.id }, { $set: { safari: link } }).then(() => {
            req.flash('success_msg', 'safari link added');
            res.redirect('back');
        })
    }
    if (type == "google-docs") {
        User.updateOne({ _id: req.user.id }, { $set: { doc: link } }).then(() => {
            req.flash('success_msg', 'doc link added');
            res.redirect('back');
        })
    }
    if (type == "paypal") {
        User.updateOne({ _id: req.user.id }, { $set: { paypal: link } }).then(() => {
            req.flash('success_msg', 'paypal link added');
            res.redirect('back');
        })
    }
    if (type == "microsoft-store") {
        User.updateOne({ _id: req.user.id }, { $set: { shop: link } }).then(() => {
            req.flash('success_msg', 'shop link added');
            res.redirect('back');
        })
    }
    if (type == "google-inbox") {
        User.updateOne({ _id: req.user.id }, { $set: { mailbox: link } }).then(() => {
            req.flash('success_msg', 'mailbox link added');
            res.redirect('back');
        })
    }
})


router.get('/contact', (req, res, next) => {
    res.render('contact');
})
router.get('/profile', auth, async (req, res, next) => {
    res.locals.page_name = "profile";
    res.render('profile');
})
router.get('/settings', auth, (req, res, next) => {
    res.locals.page_name = "settings";
    res.render('settings');
})

router.get('/notification', auth, (req, res, next) => {
    res.locals.page_name = "notification";
    res.render('notification');
})

router.get('/security', auth, (req, res, next) => {
    res.locals.page_name = "security";
    res.render('security');
})

module.exports = router;