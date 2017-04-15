'use strict';

(function (app) {

  var card = app.factory.getCard;

  var offerDialog = document.getElementById('offer-dialog');

  app.showCard = function () {
    offerDialog.style.display = 'block';
    card().addEventListeners();
  };

}(window.app));
