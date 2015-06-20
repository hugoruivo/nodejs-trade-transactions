// Load required packages
var Trade = require('../models/trade');

var getCurrencyTypeStats = function (currencyType, currency, callback) {

	var match = {
		$match: {
			currencyFrom: currency
		}
	};

	if (currencyType == "currencyTo") {
		match = {
			$match: {
				currencyTo: currency
			}
		};
	}

	Trade.aggregate([
			match,
			{ $group: {
				_id: '$' + currencyType,
				amountSellSum: { $sum: '$amountSell'},
				amountBuySum: { $sum: '$amountBuy'},
				amountSellAvg: { $avg: '$amountSell'},
				amountBuyAvg: { $avg: '$amountBuy'},
			}}
		], callback
	);
};

// Create endpoint /api/trades for POST
exports.postTrades = function(req, res, io) {
	// Create a new instance of the Trade model
	var trade = new Trade();

	// Set the trade properties that came from the POST data
	trade.userId = req.body.userId;
	trade.currencyFrom = req.body.currencyFrom;
	trade.currencyTo = req.body.currencyTo;
	trade.amountSell = req.body.amountSell;
	trade.amountBuy = req.body.amountBuy;
	trade.rate = req.body.rate;
	trade.timePlaced = req.body.timePlaced;
	trade.originatingCountry = req.body.originatingCountry;
	trade.timePlacedDate = new Date(req.body.timePlaced);

	// Save the trade and check for errors
	trade.save(function(err) {
		if (err)
			res.send(err);

		Trade.count({}, function(err, count){
			if (err)
				res.send(err);

			if (typeof io !== 'undefined') {
				var passData = {
					trademsg: trade,
					count: count
				};
				io.emit('newtrade', passData);
			}

			res.json({ success: true, message: 'Trade added successfully!', data: trade });
		});
	});
};

// Create endpoint /api/trades for GET
exports.getTrades = function(req, res) {
	// Use the Trade model to find all trades
	Trade.find(function(err, trade) {
		if (err)
			res.send(err);

		res.json(trade);
	});
};

// Create endpoint /api/helper/currencies for POST
exports.postGetCurrencies = function(req, res) {
	//Gets the currency we are looking for from the POST
	var currencyType = req.body.currencyType;

	if (currencyType && currencyType !== "undefined") {
		//Queries from unique values of that currency
		Trade.distinct(currencyType, { }, function (err, currencyType) {
			if (err)
				res.send(err);

			var retVal = {
				success: true,
				currencyType: currencyType
			};

			res.json(retVal);
		});
		return;
	}
	res.json({success: false});

};

// Create endpoint /api/helper/totalcurrency for POST
exports.postGetTotalCurrency = function(req, res) {
	//Gets the currency we are looking for from the POST
	//if we are looking for "from" or "to" currency
	var currencyType = req.body.currencyType;
	var currency = req.body.currency;

	if (currencyType && currencyType !== "undefined") {
		getCurrencyTypeStats(currencyType, currency, function (err, results) {
			res.json({success: true, results: results});
		});
		return;
	}
	res.json({success: false});

};
