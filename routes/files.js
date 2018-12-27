const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET users listing. */
router.get('/get', function (req, res, next) {
    console.log(Buffer.from(req.query.f, 'base64').toString('ascii'));
    let file = fs.createReadStream(Buffer.from(req.query.f, 'base64').toString('ascii'));
    let stat = fs.statSync(Buffer.from(req.query.f, 'base64').toString('ascii'));
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    file.pipe(res);
    // fs.read(Buffer.from(req.query.f, 'base64').toString('ascii'), (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         console.log(Buffer.from(req.query.f, 'base64').toString('ascii'));
    //     } else {
    //         res.write(data);
    //         res.end();
    //     }
    // });
});

module.exports = router;