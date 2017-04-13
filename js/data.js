'use strict';

(function (app) {

  // Константы
  var OFFER_TYPES = ['flat', 'house', 'bungalo'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];

  var offerFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var offerTitles = [
    'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
  ];
  var avatars = [];

  // Вспомогательные функции
  function createArray(len) {
    return Array.apply(null, {length: len});
  }

  function reorderItem(number, index, array) {
    var random = getRandomNumber(0, array.length - 1);
    var saved = array[random];
    array[random] = number;
    array[index] = saved;
  }

  function shuffle(array) {
    array.forEach(reorderItem);
  }

  function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function getRandomItem(items) {
    return items[getRandomNumber(0, items.length - 1)];
  }

  function fillOffersArray() {
    shuffle(offerFeatures);
    return createArray(8).map(function (cur, ind) {
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
  }

  var data = {
    get: function () {
      avatars = createArray(8).map(function (cur, i) {
        return i + 1;
      });
      shuffle(avatars);
      shuffle(offerTitles);
      data.offers = fillOffersArray();
    },
    offers: []
  };

  app.data = data;

}(window.app));
