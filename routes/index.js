const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.uid) {
        res.redirect('/paperwork/my');
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = router;
