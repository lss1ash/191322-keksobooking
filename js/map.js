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
  var avatarsRandomlyOrdered = Array.apply(null, {length: 8}).map(function (cur, i) {
    return i;
  }).forEach(function (num, i, arr) {
    var random = getRandomNumber(1, 8);
    var saved = arr[random];
    arr[random] = num;
    arr[i] = saved;
  });

  function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
}());
