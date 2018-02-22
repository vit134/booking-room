var express = require('express');
var router = express.Router();
var query = require('../graphql/resolvers/query.js');
var getFloors = require('../modules/getfloors.js');


var Moment = require('moment');
var MomentRange = require('moment-range');
var moment = MomentRange.extendMoment(Moment);

/* GET rooms listing. */

router.get('/', function (req, res) {
    query.rooms().then(data => {
        //res.json(data);
        //console.log(data);
        data = JSON.parse(JSON.stringify(data));

        var floors = getFloors.getData(data, moment().format('YYYY-MM-DD') + 'z');
        

        res.json(floors);
    })
});

module.exports = router;
