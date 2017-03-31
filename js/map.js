'use strict';

(function () {
  var OFFER_TYPES = ['flat', 'house', 'bungalo'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;

  var offerTitles = [
    'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
  ];

  // Создаём массив и случайным образом перемешиваем элементы
  var avatarsReordered = createArray(8).map(function (cur, i) {
    return i + 1;
  });

  avatarsReordered.forEach(reorderArray);
  offerTitles.forEach(reorderArray);

  var offers = createArray(8).map(function (cur, i) {
    return {
      'author': {
        'avatar': getAvatar(i)
      },
      'offer': {
        'title': offerTitles[i],
        'address': 'WHT?',
        'price': getRandomNumber(1000, 1000000),
        'type': getRandomItem(OFFER_TYPES),
        'rooms': getRandomNumber(1, 5),
        'guests': getRandomNumber(0, 50), // не указаны рамки в задании, сколько написать?
        'checkin': getRandomItem(OFFER_CHECKS),
        'checkout': getRandomItem(OFFER_CHECKS),
        'features': createArray(getRandomNumber(0, 6)).map(function () {
          return getRandomItem(OFFER_FEATURES);
        }),
        'description': '',
        'photos': []
      },
      'location': {
        'x': getRandomNumber(300, 900),
        'y': getRandomNumber(100, 500)
      }
    };
  });

  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    pinsFragment.appendChild(createOfferDiv(offers[i]));
  }
  var pinMap = document.querySelector('.tokyo__pin-map');
  pinMap.appendChild(pinsFragment);

  function createArray(len) {
    return Array.apply(null, {length: len});
  }

  function reorderArray(num, i, arr) {
    var random = getRandomNumber(0, arr.length - 1);
    var saved = arr[random];
    arr[random] = num;
    arr[i] = saved;
  }

  function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function getRandomItem(items) {
    return items[getRandomNumber(0, items.length - 1)];
  }

  function getAvatar(i) {
    return 'img/avatars/user0' + avatarsReordered[i] + '.png';
  }

  function createOfferDiv(offer) {
    var newDiv = document.createElement('div');
    newDiv.className = 'pin';
    newDiv.innerHTML = '<img src=\"' + offer.author.avatar + '\">';
    newDiv.style.left = (offer.location.x - PIN_WIDTH / 2) + 'px';
    newDiv.style.top = (offer.location.y - PIN_HEIGHT) + 'px';

    return newDiv;
  }
}());
