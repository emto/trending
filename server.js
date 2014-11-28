var express             = require('express');
var bodyParser          = require('body-parser');
var methodOverride      = require('method-override');
var app                 = express(); //create server


var fs = require('fs');

var bus = fs.readFileSync('./yelp_academic_dataset_business.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  // console.log(data);
});

var check = fs.readFileSync('./yelp_academic_dataset_checkin.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  // console.log(data);
});

var businesses = [];

var busString = bus.split("\n");
for (var i= 0; i < busString.length - 1; i++) {
    var hello = JSON.parse(busString[i]);
    businesses.push(hello);

}

var checkins = [];

var checkString = check.split("\n");
for (var i= 0; i < checkString.length - 1; i++) {
    var hi = JSON.parse(checkString[i]);
    checkins.push(hi);

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
        var x = businesses;
        var y = checkins;
        res.send([x,y]);

        


        // Swatch.find(function(err, swatches) {
        //     if (err) {
        //         res.send(err);
        //     } else {
        //         res.json(swatches);
        //     }
        // });
    });
//     .post(function(req, res) {
//         var swatch = new Swatch();
//         swatch.name = req.body.name;
//         swatch.blurb = req.body.blurb;
//         swatch.links = req.body.links;
//         swatch.color = req.body.color;
//         swatch._id = shortId.generate();

//         swatch.save(function(err) {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.json({ swatchID: swatch._id });
//             }
//         });
//     });

// router.route('/swatches/:swatchid')
//     .get(function(req,res) {
//         Swatch.findById(req.params.swatchid, function(err, swatch) {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.json(swatch);
//             }
//         });
//     });

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
