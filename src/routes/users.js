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
  res.locals.page_name = "Edit";
  res.render('user-edit');
})

router.post('/user/update-info', auth, async(req, res, next) => {
  User.updateOne({_id: req.user.id}, req.body).then(data => {
    req.flash('success_msg', 'Tattoo has been deactived!');
    res.redirect('back');
  }).catch(error => next(error));
})

module.exports = router