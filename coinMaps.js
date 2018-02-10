/**
 *  @fileOverview Check if the query is valid or not.
 *
 *  @author       Haiping Xue
 */

/**
 * @member coinMaps
 * @function
 */
function coinMaps(){

	/**
	 * The dictionary for valid reversed coin pair
	 * @constant
	 * @type {dictionary}
	 */
	const reverseCoinPair = {'BTC-USD':'BTC-USD', 'BTC-EUR':'BTC-EUR', 'BTC-GBP':'BTC-GBP', 'BCH-USD':'BCH-USD', 'ETH-USD':'ETH-USD', 'ETH-BTC':'ETH-BTC',
	                  'ETH-EUR':'ETH-EUR', 'LTC-USD':'LTC-USD', 'LTC-BTC':'LTC-BTC', 'LTC-EUR':'LTC-EUR'};

	/**
	 * The dictionary for valid non-reversed coin pair
	 * @constant
	 * @type {dictionary}
	 */
	const coinPair = {'USD-BTC':'BTC-USD', 'EUR-BTC':'BTC-EUR', 'GBP-BTC':'BTC-GBP', 'USD-BCH':'BCH-USD', 'USD-ETH':'ETH-USD', 'BTC-ETH':'ETH-BTC',
	                         'EUR-ETH':'ETH-EUR', 'USD-LTC':'LTC-USD', 'BTC-LTC':'LTC-BTC', 'EUR-LTC':'LTC-EUR'};

 	/**
	 * The type of coins
	 * @constant
	 * @type {dictionary}
	 */
	const coinType = {'USD':true, 'BTC':true, 'EUR':true, 'GBP':true, 'BCH': true, 'ETH':true, 'LTC':true};

	this.coinPair = function (){
		return coinPair;
	}
	this.reverseCoinPair = function (){
		return reverseCoinPair;
	}
	this.coinType = function (){
		return coinType;
	}
}

/**
 * Stored the three constant variables so that we can easily call and control the values of it
 * @module coinMaps
 */
module.exports = coinMaps;
