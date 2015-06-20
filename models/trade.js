// Load required packages
var mongoose = require('mongoose');

// Define our trade schema
var TradeSchema   = new mongoose.Schema({
  userId: String,
  currencyFrom: String,
  currencyTo: String,
  amountSell: Number,
  amountBuy: Number,
  rate: Number,
  timePlaced: String,
  originatingCountry: String,
  timePlacedDate: Date,
});

// Export the Mongoose model
module.exports = mongoose.model('Trade', TradeSchema);
