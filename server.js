/**
 *  @fileOverview Write what's going on in the file here.
 *
 *  @author       Haiping Xue
 *
 *  @requires     NPM:express
 *  @requires     NPM:axios
 *  @requires     NPM:body-parser
 *  @requires     ./coinMaps
 *  @requires     ./validation
 *  @requires     ./quotes
 */

var express = require('express');
var app = express();


/**
 * for http requests
 * @constant
 *
 * @type {Module}
 */
const axios = require("axios");

/**
 * to support URL-encoded bodies
 *
 * @type {Module}
 */
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/**
 * to import coin maps
 *
 * @type {Module}
 */
var coinMaps = require('./coinMaps');
var myCoinMaps = new coinMaps();
const coinPair = myCoinMaps.coinPair();
const coinType = myCoinMaps.coinType();
const reverseCoinPair = myCoinMaps.reverseCoinPair();

/**
 * validation methods
 *
 * @type {Module}
 */
var validation = require('./validation');
var myValidation = new validation();

/**
 * quote computation methods
 *
 * @type {Module}
 */
var quotes = require('./quotes');
var myQuote = new quotes();

//start service
var server = app.listen(8081, function () {
  var host = "localhost";
  var port = server.address().port;
  console.log("Coinbase PriceSearch API listening at http://%s:%s", host, port);
});

//handles client requests
app.post('/quote', function (req, res) {
  try {
    //check if all inout are valid. If not, send error message
    console.log("Get a new request. Request body:");
    var data = req.body;
    console.log(data);
    var isValid = myValidation.isValidData(data);
    if(!(isValid === 'valid')) {
    	throw JSON.stringify({ "Error" : isValid});
    }
    //check if the coin pair is valid. If not, send error message
    else if(!myValidation.isValidCoinPair(data.base_currency, data.quote_currency)) {
    	throw JSON.stringify({ "Error" : "Can not compute the quote since this two kind of coin is not exchangable!"});
    }
    else {
      //request option for get orderbook for a particular pair
      var option = createOptions(req.body);
      console.log("Option settup for gdax query: ");
      console.log(option);

      //query gdax order book for information
      axios(option)
        .then(response => {
        	console.log("response data from gadx orderbook: ");
	        console.log(response.data);
	        var result;
	        if(data.action === 'buy')
	        	result = myQuote.buyQuote(data.base_currency, data.quote_currency, myQuote.toNumber(data.amount), response.data);
	        else
	        	result = myQuote.sellQuote(data.base_currency, data.quote_currency, myQuote.toNumber(data.amount), response.data);

	        //if not enough info in orderBook, send error message
	        if(result.total==-1) {
	        	var message = "not enough quote currency in orderBook";
	        	console.log(message);
	        	res.send({"Error": message});
	        }
	        //send result
	        else{
	        	console.log("Result for quote is:");
	        	console.log(result);
	        	res.send(result);
        	}
        })
        .catch(error => {
        	console.log("Caught error from querying gdax:");
         	console.log(error.message);
         	//send error message
         	res.send({"Error": error.message});
        });
    }

  }
  catch(e) {
	console.log("Caught exception from reqeust: ");
	console.log(e);
	// send error message
	res.send(e);
  }
});

//create options for request
function createOptions(body) {
  var pair = body.base_currency + '-' + body.quote_currency;
  var path = pair in reverseCoinPair? reverseCoinPair[pair]: coinPair[pair];
  //request option for get orderbook for a particular pair
  return {
    url: 'https://api.gdax.com/products/' + path + '/book?level=2',
    method: 'GET',
    agent: false,
    headers: {
      'User-Agent': 'HaipingXue',
    },
  };
}
