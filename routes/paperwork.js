const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const db = require('../db');
const fs = require('fs');

/* GET users listing. */
router.get('/my', function(req, res, next) {
    db.query('SELECT * FROM `submits` where `owner` = ' + req.session.uid + ';' , function(err, results, fields) {
        console.log("query done");
        if (err) {
            res.status(500);
            res.end();
            //res.close();
            console.log("err");
            console.log(err);
        } else {
            res.render('my_paperwork', {'paperwork': results});
        }
    });
});

router.get('/upload', function(req, res, next) {
   if (req.session.uid) {
       res.render('upload_paperwork');
   } else {
       res.redirect('/auth/login');
   }
});

router.post('/upload', function(req, res, next) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    // form.uploadDir = '~/WebstormProjects/internet_lab_2/public/upload';
    form.parse(req, function (err, fields, files) {
        console.log(files);
        console.log(fields);
        console.log(req.body);
        const path = files.paperwork.path;

        db.query('INSERT INTO submits (title, path, owner) VALUES ("'+ fields.title +'", "' + path + '", ' + req.session.uid + ');' , function(err, results, f) {
            console.log("query done");
            if (err) {
                res.status(500);
                res.end();
                //res.close();
                console.log("err");
                console.log(err);
            } else {
                res.redirect('/paperwork/my')
            }
        });

    });
});

router.get('/review', function(req, res, next) {
    if (req.session.uid) {
        db.query('SELECT s.id, s.title, count(m.id) as c FROM marks m LEFT JOIN submits s ON m.submitid = s.id WHERE s.owner <>' + req.session.uid + ' GROUP BY s.id ORDER BY c ASC;', function (err, results, f) {
            if (err) {
                console.log(err);
                res.send(500);
                res.end();
            } else {
                res.render('review', {'submits': results});
            }
        })
    }
});

router.get('/:id', function(req, res, next) {
    if (req.session.uid) {
        db.query('SELECT * FROM `submits` s  WHERE id = ' + req.params.id, function (err, submit, f) {
            db.query('SELECT * FROM `marks` WHERE submitid = ' + req.params.id, function (err, results, f) {
                if (err) {
                    res.status(500);
                    res.end();
                } else {
                    let canSubmit = true;
                    if (submit[0].owner === req.session.uid) {
                        canSubmit = false;
                    }
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].owner === req.session.uid) {
                            canSubmit = false;
                            break;
                        }
                    }
                    if (submit.length > 0) {
                        res.render('paperwork', {'id': req.params.id, 'canSubmit': canSubmit, 'comments': results[0], 'fileaddr': Buffer.from(submit[0].path).toString('base64')});
                    } else {
                        res.send(404);
                        res.end();
                    }
                }
            });
        });
    } else {
        res.redirect('/auth/login');
    }
});

router.post("/:id", function(req, res, next) {

});
module.exports = router;