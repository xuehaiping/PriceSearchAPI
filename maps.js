function maps(){
	//dictionary for valid reversed coin pair
	const reverseCoinPair = {'BTC-USD':'BTC-USD', 'BTC-EUR':'BTC-EUR', 'BTC-GBP':'BTC-GBP', 'BCH-USD':'BCH-USD', 'ETH-USD':'ETH-USD', 'ETH-BTC':'ETH-BTC',
	                  'ETH-EUR':'ETH-EUR', 'LTC-USD':'LTC-USD', 'LTC-BTC':'LTC-BTC', 'LTC-EUR':'LTC-EUR'};
	//dictionary for valid non-reversed coin pair
	const coinPair = {'USD-BTC':'BTC-USD', 'EUR-BTC':'BTC-EUR', 'GBP-BTC':'BTC-GBP', 'USD-BCH':'BCH-USD', 'USD-ETH':'ETH-USD', 'BTC-ETH':'ETH-BTC',
	                         'EUR-ETH':'ETH-EUR', 'USD-LTC':'LTC-USD', 'BTC-LTC':'LTC-BTC', 'EUR-LTC':'LTC-EUR'};
	//type of coins
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

module.exports = maps;


