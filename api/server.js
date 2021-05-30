// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var contractAPI = require("../commons/contractAPI");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:<port>/api)
router.get('/d', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
}).post('/d', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

var API=new contractAPI(router,"/contracts",{
    web3_url:"http://127.0.0.1:8118"
});
API.register("HeritageFactory");

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
