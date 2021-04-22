const express = require('express');
import passport from "../helpers/passport";
import crypto from "crypto";
const { removeSpaceFromText } = require('../helpers/utils');
const bodyParser = require('body-parser')
import User from "../models/users";
const router = express.Router();


router.get('/login', (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        res.redirect('dashboard');
    }
    res.render('login');
})
router.post('/login', (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            req.flash('error_msg', 'This user doesn`t exist');
            return res.redirect('login');
        }
        if (user.active === true) {
            req.flash(
                "warning_msg",
                "Your account is not active, check your email to activate your account"
            );
            return res.redirect("back");
        }
        req.logIn(user, function (err) {
            if (err) return next(err);
            return res.redirect('/dashboard');
        });
    })(req, res, next);
})

router.get('/log-out', (req, res, next) => {
    try {
        if (!req.user) res.redirect("/login");
        else {
            req.logout();
            req.flash("success_msg", "You are logged out!");
            res.redirect("/login");
        }
    } catch (error) {
        next(error);
    }
})

router.get('/sign-up', (req, res, next) => {
    res.render('sign-up');
})

router.post('/sign-up', async (req, res, next) => {
    let check = await User.findOne({ email: req.body.email });
    var Msg;
    if (check) {
        req.flash('warning_msg', 'Email has been used!');
        res.redirect('back');
    }
    let userslug = removeSpaceFromText(req.body.firstName) + "-" + removeSpaceFromText(req.body.lastName)

    var payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userslug: userslug,
        password: req.body.password,
        email: req.body.email,
        profilePicture: "https://gravatar.com/avatar/" +
            crypto
                .createHash("md5")
                .update(req.body.email)
                .digest("hex")
                .toString() +
            "?s=200" +
            "&d=retro",
    }
    // User.create(payload).then(() => {
    //     req.flash('success_msg', 'Registration is successful');
    //     res.redirect('/login');
    // }).catch(e => next(e));
    let user = await User.create(payload);
    req.logIn(user, function(err) {
        if (err) return next(err);
        if (user.roleId === "user") {
            return res.redirect('/dashboard');
        } else if (user.roleId === "admin") {
            return res.redirect('/admin/dashboard');
        }
    });
})

module.exports = router;