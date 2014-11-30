var express             = require('express');
var bodyParser          = require('body-parser');
var methodOverride      = require('method-override');
var app                 = express(); //create server


var fs = require('fs');

var busData = fs.readFileSync('./yelp_academic_dataset_business.json', 'utf8', function (err,data) {
    if (err) {
        // return console.log(err);
    }
    console.log(data);
});

var checkData = fs.readFileSync('./yelp_academic_dataset_checkin.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    // console.log(data);
});

var businesses = {};

var busString = busData.split("\n");
for (var i= 0; i < busString.length - 1; i++) {
    var bus = JSON.parse(busString[i]);
    var data = {};
    data["name"] = bus["name"];
    data["coords"] = [bus["latitude"], bus["longitude"]];
    data["stars"] = bus["stars"];
    data["tags"] = bus["categories"];
    data["addr"] = bus["full_address"];
    data["rvwCt"] = bus["review_count"];
    businesses[bus["business_id"]] = data
}

var busCheckData = [];

var checkString = checkData.split("\n");
for (var i= 0; i < checkString.length - 1; i++) {
    var check = JSON.parse(checkString[i]);
    var busID = check["business_id"];
    var chkCt = 0;
    for (var x in check["checkin_info"]) {
        chkCt += check["checkin_info"][x];
    }
    data = businesses[busID];
    data["chkCt"] = chkCt;
    busCheckData.push(data);
}



// console.log('Require:', parseBus);
// var parseCheck = require('./yelp_academic_dataset_checkin.json');



// Port
var port = 8888;


// Static files
app.use(express.static(__dirname + '/public'));
app.use(methodOverride());

// Bodyparser/Json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Router
// Backend routes
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Middleware');
    next();
});


function getCheckIn(busid) {
    return checkins.filter(
            function(checkins) {return checkins.business_id == busid}
            );
}

router.route('/checkin')
.get(function(req, res) {
    var x = busCheckData;
    res.send(x);
});


app.use('/api', router);

// Router
// Frontend Route
app.use(function(req, res) {
    res.sendfile(__dirname + '/index.html');
});
router.get('*', function(req, res) {
    res.sendfile('/index.html');
});

//start
app.listen(port);
console.log('Server Running');
