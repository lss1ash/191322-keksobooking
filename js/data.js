'use strict';

(function (app) {

  var pin = app.factory.getPin;
  var utils = app.factory.getUtils;
  var form = app.factory.getForm;

  var DATA_URL = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/keksobooking/data';
  var INITIAL_PINS_COUNT = 3;
  var PRICE = {
    LOW: 10000,
    HIGH: 50000
  };

  var messageBoxTemplate = document.getElementById('message-box');

  var loadSuccess = function (response) {
    app.data.offers = response;
    app.data.loadedOffers = response.slice();

    form().addFilterEventListeners();
    app.data.offers = utils().sliceRandomArray(app.data.offers, INITIAL_PINS_COUNT);
    pin().append();
  };
  var loadError = function (msgHeader, msgParagraph) {
    var message = messageBoxTemplate.content.cloneNode(true);
    var cloneRoot = message.firstElementChild;

    var html = cloneRoot.innerHTML;
    html = html.replace('{header}', msgHeader);
    html = html.replace('{message}', msgParagraph);
    cloneRoot.innerHTML = html;

    document.body.appendChild(message);
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

  app.load(DATA_URL, loadSuccess, loadError);
  app.data = {
    filterOffers: filterOffers,
    offers: null,
    loadedOffers: null
  };

}(window.app));
