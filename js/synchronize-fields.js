'use strict';

(function (app) {

  app.synchronizeFields = function (fieldOne, fieldTwo, dataOne, dataTwo, cb) {
    var value = dataTwo[dataOne.indexOf(fieldOne.value)];
    cb(fieldTwo, value);
  };

}(window.app));
