'use strict';

(function (app) {

  var pin = app.factory.getPin;
  var utils = app.factory.getUtils;

  var DATA_URL = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/keksobooking/data';
  var INITIAL_PINS_COUNT = 3;
  var messageBoxTemplate = document.getElementById('message-box');

  var loadSuccess = function (response) {
    app.data = {
      offers: response
    };
    pin().append(utils().getRandomArrayFrom(response, INITIAL_PINS_COUNT));
  };
  var loadError = function (msgHeader, msgParagraph) {
    var message = messageBoxTemplate.content.cloneNode(true);
    var cloneRoot = message.firstElementChild;

    var html = cloneRoot.innerHTML;
    html = html.replace('{header}', msgHeader);
    html = html.replace('{message}', msgParagraph);
    cloneRoot.innerHTML = html;

    document.body.appendChild(message);
  };

  app.load(DATA_URL, loadSuccess, loadError);

}(window.app));
