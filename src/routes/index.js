const express = require('express');

const router = express.Router();

const auth = (req, res, next) => {
    if (req.isAuthenticated())
        return next()
    req.flash('success_msg', 'Pls Login to continue');
    res.redirect(`/login`)
};

router.get('/', (req, res, next) => {
    res.render('index')
})

router.get('/dashboard', auth, (req, res, next) => {
    res.render('dashboard');
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