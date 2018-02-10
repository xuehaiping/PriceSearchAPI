/**
 *  @fileOverview Check if the query is valid or not.
 *
 *  @author       Haiping Xue
 *
 *  @requires     ./coinMaps
 */

function validation(){
    var coinMaps = require('./coinMaps');
    var myCoinMaps = new coinMaps();
    const coinPair = myCoinMaps.coinPair();
    const coinType = myCoinMaps.coinType();
    const reverseCoinPair = myCoinMaps.reverseCoinPair();

    /**
  	 * check if input data is valid
  	 * @type {String}
  	 */
    this.isValidData = function isValidData(body) {
      if(!body.hasOwnProperty('action') || !this.isString(body.action) || !this.isValidAction(body.action)) {
        return 'No action property or action is not a string or action is not a legal action!';
      }
      else if(!body.hasOwnProperty('base_currency') || !this.isString(body.base_currency) || !this.isValidCoin(body.base_currency)) {
        return 'No base_currency property or base_currency is not a string or base_currency is not a valid coin!';
      }
      else if(!body.hasOwnProperty('quote_currency') || !this.isString(body.quote_currency) || !this.isValidCoin(body.quote_currency)) {
        return 'No quote_currency property or quote_currency is not a string!';
      }
      else if(!body.hasOwnProperty('amount') || !this.isString(body.amount) || isNaN(filterFloat(body.amount))) {
        return 'No amount property or amount is not a string or amount can not be transferred to a number!';
      }
      else {
        return 'valid';
      }
    }

    /**
  	 * check if the instance is a string
  	 * @type {boolean}
  	 */
    this.isString = function isString(value) {
      return typeof value === 'string';
    }

    /**
  	 * check if the coin pair is valid
  	 * @type {boolean}
  	 */
    this.isValidCoinPair = function isValidCoinPair(c1, c2) {
      var pair = c1 + '-' + c2;
      if(pair in coinPair || pair in reverseCoinPair)
        return true;
      else
        return false;
    }

    /**
  	 * check if the action is valid
  	 * @type {boolean}
  	 */
    this.isValidAction = function isValidAction(action) {
      if(action === 'buy' || action === 'sell')
        return true;
      else
        return false;
    }

    /**
  	 * check if the coin is a valid type
  	 * @type {boolean}
  	 */
    this.isValidCoin = function isValidCoin(coin) {
      if(coinType[coin])
        return true;
      else
        return false;
    }

    /**
  	 * filter valid float number
  	 * @type {number}
  	 */
    var filterFloat = function(value) {
      if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value))
          return Number(value);
      return NaN;
    }
}

/**
 * Check if the query is valid or not.
 * @module validation
 */
module.exports = validation;
