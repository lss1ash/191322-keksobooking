'use strict';

(function () {
  var OFFER_TYPES = ['flat', 'house', 'bungalo'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

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

  var ads = createArray(8).map(function (cur, i) {
    return {
      'author': {
        'avatar': getAvatar(i)
      },
      'offer': {
        'title': offerTitles[i]
      }
    };
  });

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

  // function getRandomItem(items) {
  //   removeItem = removeItem || false;
  //   var index = getRandomNumber(0, items.length - 1);
  //   return items[];
  // }

  function getAvatar(i) {
    return 'img/avatars/user0' + avatarsReordered[i] + '.png';
  }
}());
