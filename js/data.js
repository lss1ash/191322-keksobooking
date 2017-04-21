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
    utils().getRandomArray(INITIAL_PINS_COUNT);
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
    for (var i = 0; i < keys.length; i++) {
      if (features[keys[i]] && current.indexOf(keys[i]) < 0) {
        return false;
      }
    }
    return true;
  };

  var filterAlg = function (current) {
    var addItem = true;
    var filter = form().currentFilter;
    Object.keys(filter).forEach(function (field) {
      switch (field) {
        case 'type':
        case 'rooms':
        case 'guests':
          addItem = addItem && (filter[field] === 'any' || current.offer[field] === filter[field]);
          break;
        case 'price':
          addItem = addItem && priceComparator(filter[field], current.offer[field]);
          break;
        case 'features':
          addItem = addItem && featuresComparator(filter.features, current.offer.features);
          break;
      }
    });
    return addItem;
  };

  var filterOffers = function () {
    app.data.offers = app.data.loadedOffers.slice().filter(filterAlg);
  };

  app.load(DATA_URL, loadSuccess, loadError);
  app.data = {
    filterOffers: filterOffers,
    offers: null,
    loadedOffers: null
  };

}(window.app));
