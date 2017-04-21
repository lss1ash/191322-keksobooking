'use strict';

(function (app) {

  var data = app.factory.getData;

  var DEBOUNCE_INTERVAL = 300;

  var lastTimeout;

  var getRandomArray = function (length) {
    shuffle(data().offers);
    data().offers = data().offers.slice(0, length);
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

  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  app.utils = {
    getRandomArray: getRandomArray,
    debounce: debounce
  };

}(window.app));
