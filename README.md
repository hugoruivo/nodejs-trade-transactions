# Trade Transactions with NodeJs

Simple webapp which lists transactions inserted via the app or via given API.

The transactions list is updated via Socket IO.

#App Tabs Navigation explained

In the Frontend you will have diverse tabs to navigate through the site.

The first tab "About" is a small explanation of the app.

In the "Transactions" tab when the page is loaded it loads a list with the last 15 transactions.

Then each time a new transaction is inserted the list is automatically updated via socket io ( you can try inserting a new transaction in a different or incognito browser window or in a different computer to see the list updating by itself. ).

In the "Stats" tab you can find a basic statistic page where you can filter the stats for a given currency. For example you can list the stats for currency "from" or "to" of a given currency. We can improve / extend the functionalities in the backend to give stats about rates, most traded "from" or "to" currency, etc... The sky is the limit.

Then we have a final "Helper Insert Transaction" tab, which is basically a tab where you can insert transactions to test ut things.

Note: have in mind that transactions can be inserted via a POST call to an API implemented at <SITE_ROOT>/api/trades, where <SITE_ROOT> is replaced by the url of the site. A GET call to this API url will list all of the transactions inserted ( be carefull as if they are a lot, let's say millions ) of transactions, the browser may not be able to handle the returned data.

##Transaction insert POST Format
```html
	{
		"userId": "134256",
		"currencyFrom": "EUR",
		"currencyTo": "GBP",
		"amountSell": 1000,
		"amountBuy": 747.10,
		"rate": 0.7471,
		"timePlaced" : "24-JAN-15 10:27:44",
		"originatingCountry" : "UK"
	}
```

##Setup
You will need nodejs installed.

Put the downloaded files in a directory of your choice. Open a command prompt and navigate to your directory.

```html
npm install
```

Then in the server.js file on Line 16 you can setup your own MongoDB server:
```html
//Change it to your own server:
mongoose.connect('mongodb://localhost:27017/tradetest');
```
After that:
```html
node server.js
```

Then just point your browser to http://localhost:3000

You can change the app port in server.js file line 50:
```html
http.listen(3000, function(){
});
```

##Licence
This project is licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License) so feel free to hack away :)
