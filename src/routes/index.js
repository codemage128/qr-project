const express = require('express');

const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('index')
})


router.get('/portfolio', async(req, res, next) => {
    res.render('projects');
})

module.exports = router;