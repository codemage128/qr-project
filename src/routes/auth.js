const express = require('express');
import passport from "../helpers/passport";
const bodyParser = require('body-parser')
import User from "../models/users";
const router = express.Router();

router.get('/login', (req, res, next) => {
    console.log(req.isAuthenticated());
    res.render('login', { error: false });
})
router.post('/login', (req, res, next) => {
    passport.authenticate("local", function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.render('./admin/login', { error: true, data: info });
        }
        req.logIn(user, function(err) {
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
            req.flash("success_msg", "Du bist nun abgemeldet");
            res.redirect("/login");
        }
    } catch (error) {
        next(error);
    }
})

router.get('/sign-up', (req, res, next) => {
    res.render('sign-up', { error: false });
})

router.post('/sign-up', async(req, res, next) => {
    let check = await User.findOne({ email: req.body.email });
    var Msg;
    if (check) {
        Msg = { message: "Email has been used!" };
        res.render('./admin/sign-up', { error: true, data: Msg });
    }
    var payload = {
        username: req.body.name,
        password: req.body.password,
        email: req.body.email
    }
    let user = await User.create(payload);
    Msg = { message: "User created" }
    res.render('./admin/sign-up', { error: true, data: Msg });
})

module.exports = router;