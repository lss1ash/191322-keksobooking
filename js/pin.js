'use strict';

(function (app) {

  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;

  var pinMap = document.querySelector('.tokyo__pin-map');

  var pin = {
    active: null,
    activate: function (pinItem) {
      if (pinItem.dataset.index && pin.active !== pinItem) {
        pin.deactivate();
        pinItem.classList.add('pin--active');
        app.card.fill(app.offers[pinItem.dataset.index]);
        pin.active = pinItem;
        app.card.open();
      }
    },
    deactivate: function () {
      if (pin.active !== null) {
        pin.active.classList.remove('pin--active');
        pin.active = null;
      }
    },
    create: function (offer, index) {
      var newDiv = document.createElement('div');
      newDiv.className = 'pin';
      newDiv.setAttribute('tabindex', 0);
      newDiv.dataset.index = index;
      newDiv.style.left = (offer.location.x - PIN_WIDTH / 2) + 'px';
      newDiv.style.top = (offer.location.y - PIN_HEIGHT) + 'px';

      var newImage = new Image(40, 40);
      newImage.classList.add('rounded');
      newImage.setAttribute('src', offer.author.avatar);
      newDiv.appendChild(newImage);

      return newDiv;
    },
    addEventListeners: function () {
      var pins = pinMap.querySelectorAll('.pin');
      [].slice.call(pins).forEach(function (pinItem) {
        pinItem.addEventListener('click', pin.clickHandler);
        pinItem.addEventListener('keydown', pin.keyDownHandler);
      });
    },
    clickHandler: function (e) {
      pin.activate(e.currentTarget);
    },
    keyDownHandler: function (e) {
      if (e.keyCode === 13) {
        pin.activate(e.currentTarget);
      }
    },
    appendToMap: function () {
      var pinsFragment = document.createDocumentFragment();
      app.offers.forEach(function (offer, index) {
        pinsFragment.appendChild(pin.create(offer, index));
      });
      pinMap.appendChild(pinsFragment);
      pin.addEventListeners();
    }
  };

  app.pin = pin;
  app.pin.init = function () {
    app.pin.appendToMap();
    app.pin.addEventListeners();
  };

}(window.app));
