var express = require('express');
// Create our Express application
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var ejs = require('ejs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var apiController = require('./controllers/api');
var homeController = require('./controllers/home');

// Connect to the testapp MongoDB
mongoose.connect('mongodb://localhost:27017/tradetest');

// Set view engine to ejs
app.set('view engine', 'ejs');

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static('assets'));

// Create endpoint handler for /
app.get('/', homeController.getHome);

// Create endpoint handlers for /api/trades
app.post('/api/trades', function(req, res) {
	apiController.postTrades(req, res, io);
});
app.get('/api/trades', apiController.getTrades);

// Create endpoint handlers for /api/helper/currencies
app.post('/api/helper/currencies', function(req, res) {
	apiController.postGetCurrencies(req, res);
});
// Create endpoint handlers for /api/helper/totalcurrency
app.post('/api/helper/totalcurrency', function(req, res) {
	apiController.postGetTotalCurrency(req, res);
});

io.on('connection', function(socket){
	io.emit('newconn', "New user connected");
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
