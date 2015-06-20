// Load required packages
var Trade = require('../models/trade');

// Create endpoint / for GET
exports.getHome = function(req, res) {
	// Use the Trade model to find all trades
	Trade.find({
		// Search Filters
	},
	null, // Columns to Return
	{
		skip: 0, // Starting Row
		limit: 15, // Ending Row
		sort: {
			timePlacedDate: -1 //Sort by Date DESC
		}
	}, function(err, trade) {
		if (err) {
			res.send(err);
			return;
		}

		Trade.count({}, function(err, count){
			if (err){
				res.send(err);
				return;
			}

			res.render('home/index', {
				trades: trade,
				count: count
			});
		});
	});
};
