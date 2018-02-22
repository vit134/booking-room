var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json([
        {
            id: 1,
            username: "samsepi0l"
        },
        {
            id: 2,
            username: "D0loresH4ze"
        },
        {
            id: 3,
            username: "D0loreasdasdsH4ze"
        },
        {
            id: 4,
            username: "asdasd"
        },
        {
            id: 4,
            username: "asdasd"
        }
    ]);
});

module.exports = router;
