let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) { 
    console.log("유저정보 화면입니다.");
    return res.render('selectUser.html'); 
});

module.exports = router;