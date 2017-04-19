'use strict';

(function (app) {

  var getRandomArrayFrom = function (arrayFrom, length) {
    var newArr = [];
    while (newArr.length < length) {
      newArr.push(getRandomItem(arrayFrom));
    }
    return newArr;
  };

  function shuffle(array) {
    array.forEach(reorderItem);
  }

  var getRandomItem = function (items) {
    var min = 0;
    var max = items.length - 1;
    return items[getRandomNumber(min, max)];
  };

  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  app.utils = {
    getRandomArrayFrom: getRandomArrayFrom
  };

}(window.app));
