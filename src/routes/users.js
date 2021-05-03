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

router.get('/user/edit', auth, (req, res, next) => {
  res.render('user-edit')  ;
})

module.exports = router