const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/login', function(req, res, next) {
    let failMsg = "";
    if (req.query.authfail === "true") {
        failMsg = "Incorrect login or password";
    }
    res.render('login', {'login_error': failMsg});
});

router.post('/dologin', function(req, res, next) {
    db.query('SELECT `id` FROM `users` where `email` = "' + req.body.email + '" and `passhash` = MD5("' + req.body.pass + '");' , function(err, results, fields) {
        console.log("query done");
        if (err) {
            res.status(500);
            res.end();
            //res.close();
            console.log("err");
            console.log(err);
        } else {
            if (results.length > 0) {
                req.session.uid = results[0].id;
                res.redirect('/');
            } else {
                res.redirect('/auth/login?authfail=true');
            }
        }
    });
});

router.get('/register', function(req, res, next) {
    res.render('register');
});

router.post('/register', function(req, res, next) {
    db.query('INSERT INTO users (login, email, passhash) VALUES ("'+ req.body.login +'", "' + req.body.email + '", MD5("' + req.body.pass + '"));' , function(err, results, fields) {
        console.log("query done");
        if (err) {
            res.status(500);
            res.end();
            //res.close();
            console.log("err");
            console.log(err);
        } else {
            res.redirect('/auth/login')
        }
    });
});

module.exports = router;