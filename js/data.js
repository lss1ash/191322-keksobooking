'use strict';

(function (app) {

  var pin = app.factory.getPin;

  var DATA_URL = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/keksobooking/data';
  var messageBoxTemplate = document.getElementById('message-box');

  var loadSuccess = function (response) {
    app.data = {
      offers: response
    };
    pin().append();
  };
  var loadError = function (msgHeader, msgParagraph) {
    var message = messageBoxTemplate.content.cloneNode(true);
    var cloneRoot = message.children[0];

    cloneRoot.children[0].textContent = msgHeader;
    cloneRoot.children[1].textContent = msgParagraph;

    document.body.appendChild(message);
  };

  app.load(DATA_URL, loadSuccess, loadError);

}(window.app));
