'use strict';

(function (app) {

  var sliceRandomArray = function (array, length) {
    shuffle(array);
    return array.slice(0, length);
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

  var debounce = function (func, wait) {
    var timeout;
    return function () {
      var args = arguments;
      var later = function () {
        timeout = null;
        func.apply(null, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  var synchronizeFields = function (fieldOne, fieldTwo, dataOne, dataTwo, cb) {
    var value = dataTwo[dataOne.indexOf(fieldOne.value)];
    cb(fieldTwo, value);
  };

  app.utils = {
    sliceRandomArray: sliceRandomArray,
    debounce: debounce,
    synchronizeFields: synchronizeFields
  };

}(window.app));
