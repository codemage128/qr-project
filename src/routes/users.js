const express = require('express');
const Qr = require('../models/qrcode');
const User = require('../models/users');
const formidable = require('formidable');
const path = require('path');
var QRCode = require('qrcode')
const router = express.Router();
const fs = require('fs');

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

router.post('/user/uploadimage', auth, async (req, res, next) => {
   var form = new formidable.IncomingForm();
   form.parse(req);
   form.multiples = true;
   // store all uploads in the /uploads directory
   form.uploadDir = path.join(__dirname, '../public/uploads')
   let p = new Promise((resolve, reject) => {
      form.on('file', function (field, file) {
         let fileName = "";
         fs.rename(file.path, path.join(form.uploadDir, file.name), function (err) {
            if (err) throw err;
            const file_path = '/uploads/' + file.name;
            resolve(file_path);
         });
      });
   });

   p.then((fileName) => {
      User.updateOne({ _id: req.user.id }, { $set: { profilePicture: fileName } }).then(data => {
         return res.json(fileName)
      })

   });
})

router.post('/user/update-info', auth, async (req, res, next) => {
   User.updateOne({ _id: req.user.id }, req.body).then(data => {
      req.flash('success_msg', 'User information has been updated');
      res.redirect('back');
   }).catch(error => next(error));
})

router.post('/update-user-visible', auth, async (req, res, next) => {
   User.updateOne({ _id: req.user.id }, req.body).then(data => {
      req.flash('success_msg', 'Profile status has been updated.');
      res.redirect('back');
   }).catch(error => next(error));
})

router.post('/update-link-visible', auth, async(req, res, next) => {
   let data = JSON.parse(req.body.visibledata);
   User.updateOne({_id: req.user.id}, data).then(data => {
      req.flash('success_msg', 'Link status has been updated.');
      res.redirect('back');
   })
   
})

module.exports = router