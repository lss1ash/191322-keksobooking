'use strict';

(function (app) {

  var getRandomArrayFrom = function (arrayFrom, length) {
    var shuffled = arrayFrom.slice();
    shuffle(shuffled);
    return shuffled.slice(0, length);
  };

  var reorderItem = function (item, index, array) {
    var random = getRandomNumber(0, array.length - 1);
    var saved = array[random];
    array[random] = item;
    array[index] = saved;
  };

  var shuffle = function (array) {
    array.forEach(reorderItem);
  };

  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  app.utils = {
    getRandomArrayFrom: getRandomArrayFrom
  };

}(window.app));
