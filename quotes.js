/**
 *  @fileOverview Check if the query is valid or not.
 *
 *  @author       Haiping Xue
 *
 *  @requires     ./coinMaps
 */

function quotes(){
    var coinMaps = require('./coinMaps');
    var myCoinMaps = new coinMaps();
    const coinPair = myCoinMaps.coinPair();
    const coinType = myCoinMaps.coinType();
    const reverseCoinPair = myCoinMaps.reverseCoinPair();

  /**
   * @typedef {Object} JSON
   * @property {number} total: the total amount of quote currency can get in the end
   * @property {number} price: the unit price of quote currency in the end
   * @property {String} currency: quote currency in the buy quote
   */

  /**
   * Takes baseCurrency, quoteCurrency, amount, and orders and returns total amount, unit price and quote currency in JSON form.
   * @param   {String} baseCurrency base currency of the buy quote
   * @param   {String} quoteCurrency quote currency of the buy quote
   * @param   {number} amount the total amount of base currency in the buy quote
   * @param   {list} orders orderbook at that moment
   *
   * @returns {JSON} the result in JSON form
   * @public
   */
    this.buyQuote = function buyQuote(baseCurrency, quoteCurrency, amount, orders) {
      console.log("Excute buy quote.");
      var isReversed = (baseCurrency + '-' + quoteCurrency) in reverseCoinPair;
      var asks = isReversed? this.createPriceList(orders.bids, isReversed): this.createPriceList(orders.asks, isReversed);
      console.log("ask in buyquote");
      console.log(asks);
      var total = this.computeQuote(asks, amount);
      var price = total*1.0/amount;
      return {"total":total, "price":price, "currency":quoteCurrency};
    }

  /**
   * Takes baseCurrency, quoteCurrency, amount, and orders and returns total amount, unit price and quote currency in JSON form.
   * @param   {String} baseCurrency base currency of the sell quote
   * @param   {String} quoteCurrency quote currency of the sell quote
   * @param   {number} amount the total amount of base currency in the sell quote
   * @param   {list} orders orderbook at that moment
   *
   * @returns {JSON} the result in JSON form
   * @public
   */
    this.sellQuote = function sellQuote(baseCurrency, quoteCurrency, amount, orders) {
      console.log("Excute sell quote.");
      var isReversed = (baseCurrency + '-' + quoteCurrency) in reverseCoinPair;
      var bids = isReversed? this.createPriceList(orders.asks, isReversed): this.createPriceList(orders.bids, isReversed);
      console.log("bid in sellquote");
      console.log(bids);
      var total = this.computeQuote(bids, amount);

      // if the total is -1, it means not enough amount of quote currency,return error message
      if(total == -1)
        return {"Error": "Not enough quote currency in order book!"};

      var price = total*1.0/amount;
      return {"total": total, "price": price, "currency": quoteCurrency};
    }

  /**
   * Takes orderbook, and amount and returns total amount of quote currency.
   * @param   {list} list orderbook at that moment
   * @param   {number} amount the total amount of base currency in the buy quote
   *
   * @returns {number} curQuote the total amount of quote currency can get in the end
   * @public
   */
    this.computeQuote = function computeQuote(list, amount) {
      //compute quote
      var result = 0;
      var curAmount = amount;
      var curQuote = 0;
      for(var i=0; i<list.length; i++) {
        //if the data is not valid skip it
        if(list[i][0]==-1 || list[i][1]==-1 || list[i][2]==-1)
          continue;
        //else compute
        var askPrice = list[i][0], askSize = list[i][1];
        var requiredSize = (1.0*curAmount)/askPrice;

        //if we have enough amount of quoteCurrency for the remaining amount of baseCurrency break the loop
        if(requiredSize <= askSize) {
          curQuote = curQuote + requiredSize;
          curAmount = 0;
          break;
        }
        //if not satisfy the requirement, go to next ask
        else {
          curQuote = curQuote + askSize;
          curAmount = curAmount - 1.0 * askSize * askPrice;
        }
      }
      //return -1 if there is remaining amount
      return curAmount==0? curQuote: -1;
    }

  /**
   * Takes orderbook, and the condition if or not should be reversed and returns final orderbook.
   * @param   {boolean} isReversed the condition if or not the orderbook should be reversed
   * @param   {list} list orderbook at that moment
   *
   * @returns {list} res final orderbook
   * @public
   */
    this.createPriceList = function createPriceList(list, isReversed) {
      var res = new Array(list.length);
      if(!isReversed) {
        for(var i=0; i<res.length; i++) {
          if(list[i].length != 3)
            res[i] = [-1, -1, -1];
          else
            res[i] = [this.toNumber(list[i][0]), this.toNumber(list[i][1]), list[i][2]];
        }
      }
      else {
        for(var i=0; i<res.length; i++) {
          if(list[i].length != 3)
            res[i] = [-1, -1, -1];
          else
            res[i] = [1.0/this.toNumber(list[i][0]), this.toNumber(list[i][0]) * this.toNumber(list[i][1]), list[i][2]];
        }
      }
      return res;
    }

    /**
     * filter valid float number
     * @param   {String} value the string input
     *
     * @returns {number} valid float number or NaN
     * @public
     */
    var filterFloat = function(value) {
      if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value))
          return Number(value);
      return NaN;
    }

    /**
     * convert a string to Number
     * @param   {String} number the string input
     *
     * @returns {number} valid float number or NaN
     * @public
     */
    this.toNumber = function toNumber(number) {
      return isNaN(filterFloat(number))? -1: filterFloat(number);
    }
}

/**
 * Processed the input query, checked and updated the orderbook list so that we can get the final amount of quote currency by the corresponding calculation function.
 * @module quotes
 */
module.exports = quotes;
