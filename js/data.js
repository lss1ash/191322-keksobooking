'use strict';

(function (app) {

  var PRICE = {
    LOW: 10000,
    HIGH: 50000
  };

  var priceComparator = function (priceLevel, price) {
    switch (priceLevel) {
      case 'low':
        if (price < PRICE.LOW) {
          return true;
        }
        break;
      case 'middle':
        if (price >= PRICE.LOW && price <= PRICE.HIGH) {
          return true;
        }
        break;
      case 'high':
        if (price > PRICE.HIGH) {
          return true;
        }
        break;
      case 'any':
        return true;
    }
    return false;
  };

  var featuresComparator = function (features, current) {
    var keys = Object.keys(features);
    return keys.every(function (key) {
      return !(features[key] && current.indexOf(key) < 0);
    });
  };

  var filterOffers = function (currentFilter) {
    app.data.offers = app.data.loadedOffers.slice().filter(function (current) {
      return Object.keys(currentFilter).every(function (field) {
        switch (field) {
          case 'type':
          case 'rooms':
          case 'guests':
            return currentFilter[field] === 'any' || current.offer[field] === currentFilter[field];
          case 'price':
            return priceComparator(currentFilter[field], current.offer[field]);
          case 'features':
            return featuresComparator(currentFilter.features, current.offer.features);
        }
        return false;
      });
    });
  };

  app.data = {
    filterOffers: filterOffers,
    offers: null,
    loadedOffers: null
  };

}(window.app));
