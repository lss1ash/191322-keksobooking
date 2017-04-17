'use strict';

(function (app) {

  // Константы
  var OFFER_TYPES = ['flat', 'house', 'bungalo'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var DATA_URL = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/keksobooking/data';
  var PINS_ON_MAP = 8;

  var offerFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var offerTitles = [
    'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
  ];
  var avatars = [];

  // Вспомогательные функции
  var createArray = function (len) {
    return Array.apply(null, {length: len});
  };

  var reorderItem = function (number, index, array) {
    var random = getRandomNumber(0, array.length - 1);
    var saved = array[random];
    array[random] = number;
    array[index] = saved;
  };

  var shuffle = function (array) {
    array.forEach(reorderItem);
  };

  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  var getRandomItem = function (items) {
    return items[getRandomNumber(0, items.length - 1)];
  };

  var fillOffersArray = function () {
    return createArray(PINS_ON_MAP).map(function (cur, ind) {
      var loc = {
        'x': getRandomNumber(300, 900),
        'y': getRandomNumber(100, 500)
      };
      return {
        'author': {
          'avatar': 'img/avatars/user0' + avatars[ind] + '.png'
        },
        'offer': {
          'title': offerTitles[ind],
          'address': loc.x + ', ' + loc.y,
          'price': getRandomNumber(1000, 1000000),
          'type': getRandomItem(OFFER_TYPES),
          'rooms': getRandomNumber(1, 5),
          'guests': getRandomNumber(0, 50),
          'checkin': getRandomItem(OFFER_CHECKS),
          'checkout': getRandomItem(OFFER_CHECKS),
          'features': createArray(getRandomNumber(0, offerFeatures.length)).map(function (curItem, i) {
            return offerFeatures[i];
          }),
          'description': '',
          'photos': []
        },
        'location': loc
      };
    });
  };

  var offersArray = [];
  var loadSuccess = function (response) {
    offersArray = response;
  };
  var loadError = function (msg) {
    console.log(msg);
  };

  app.load(DATA_URL, loadSuccess, loadError);
  // var offersArray = (function () {
  //   app.load(DATA_URL, loadSuccess, loadError);
  //   return fillOffersArray();
  // }());

  app.data = {
    offers: offersArray
  };

}(window.app));
