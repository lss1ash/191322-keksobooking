'use strict';

(function (app) {

  app.factory = {
    getData: function () {
      return app.data;
    },
    getCard: function () {
      return app.card;
    },
    getForm: function () {
      return app.form;
    },
    getPin: function () {
      return app.pin;
    },
    getUtils: function () {
      return app.utils;
    }
  };

}(window.app));
