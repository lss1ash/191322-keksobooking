'use strict';

(function (app) {

  var PRICE = {
    LOW: 10000,
    HIGH: 50000
  };

  var priceComparator = function (priceLevel, price) {
    switch (priceLevel) {
      case 'low':
        return price < PRICE.LOW;
      case 'middle':
        return price >= PRICE.LOW && price <= PRICE.HIGH;
      case 'high':
        return price > PRICE.HIGH;
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
