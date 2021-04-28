const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path');
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

router.get('/admin/dashboard', auth, async(req, res, next) => {
    res.render('./admin/dashboard');
})

router.get('/dashboard/projects', auth, async(req, res, next) => {
    let projects = await Project.find();
    res.render('./admin/projects/projects', { projects: projects });
})

router.get('/dashboard/new-project', auth, async(req, res, next) => {
    res.render('./admin/projects/new-project');
})
router.get('/dashboard/delete-project/', auth, async(req, res, next) => {
    await Project.deleteOne({ _id: req.query.id });
    res.redirect('back');
})

router.get('/dashboard/edit-project/', auth, async(req, res, next) => {
    let project = await Project.findOne({ _id: req.query.id });
    let data = {
        id: project._id,
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(),
        github: project.github,
        url: project.url
    }
    res.render('./admin/projects/edit-project', { data: data });
})

router.post('/dashboard/create-project', auth, upload.any(), async(req, res, next) => {
    let title = req.body.title;
    let description = req.body.description;
    let technologies = req.body.technologies;
    let github = req.body.github;
    let url = req.body.url;
    let images = [];
    req.files.forEach(file => {
        images.push(file.originalname);
    })
    let skills = technologies[1].split(",");
    let payload = {
        title: title,
        description: description,
        technologies: skills,
        github: github,
        url: url,
        images: images
    }
    await Project.create(payload);
    res.redirect("/dashboard/projects");
})

router.post('/dashboard/update-project', auth, upload.any(), async(req, res, next) => {
    let id = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let technologies = req.body.technologies;
    let github = req.body.github;
    let url = req.body.url;
    let skills = technologies[1].split(",");
    let project = await Project.findOne({ _id: id });
    let images = project.images;
    if (req.files.length > 0) {
        images = [];
        req.files.forEach(file => {
            images.push(file.originalname);
        })
    }
    let payload = {
        title: title,
        description: description,
        technologies: skills,
        github: github,
        url: url,
        images: images
    }
    await Project.update({ _id: id }, payload);
    res.redirect("/dashboard/projects");
})



router.get('/dashboard/accounts', auth, async(req, res, next) => {
    let accounts = await Account.find();
    res.render('./admin/accounts/accounts', { accounts: accounts });
})

router.get('/dashboard/new-account', auth, async(req, res, next) => {
    res.render('./admin/accounts/new-account');
})

router.get('/dashboard/edit-account', auth, async(req, res, next) => {
    let account = await Account.findOne({ _id: req.query.id });
    res.render('./admin/accounts/edit-account', { account: account });
})

router.get('/dashboard/delete-account', auth, async(req, res, next) => {
    await Account.deleteOne({ _id: req.query.id });
    res.redirect('back');
})

router.post('/dashboard/create-account', auth, async(req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let contact = req.body.contact;
    let country = req.body.country;
    let address = req.body.address;
    let customInfo = req.body.customInfo;
    let payload = {
        username: username,
        email: email,
        contact: contact,
        country: country,
        address: address,
        customInfo: customInfo,
    }
    await Account.create(payload);
    res.redirect('/dashboard/accounts');
})

router.post('/dashboard/update-account', auth, async(req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let contact = req.body.contact;
    let country = req.body.country;
    let address = req.body.address;
    let customInfo = req.body.customInfo;
    let payload = {
        username: username,
        email: email,
        contact: contact,
        country: country,
        address: address,
        customInfo: customInfo,
    }
    await Account.update({ _id: req.body.id }, payload);
    res.redirect('/dashboard/accounts');
})


module.exports = router;