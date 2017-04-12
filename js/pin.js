'use strict';

(function () {

  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;

  var pinMap = document.querySelector('.tokyo__pin-map');

  window.pin = {
    active: null,
    activate: function (pinItem) {
      if (pinItem.dataset.index && window.pin.active !== pinItem) {
        window.pin.deactivate();
        pinItem.classList.add('pin--active');
        window.offerDescriptionDialog.fill(window.offers[pinItem.dataset.index]);
        window.pin.active = pinItem;
        window.offerDescriptionDialog.open();
      }
    },
    deactivate: function () {
      if (window.pin.active !== null) {
        window.pin.active.classList.remove('pin--active');
        window.pin.active = null;
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
        pinItem.addEventListener('click', window.pin.clickHandler);
        pinItem.addEventListener('keydown', window.pin.keyDownHandler);
      });
    },
    clickHandler: function (e) {
      window.pin.activate(e.currentTarget);
    },
    keyDownHandler: function (e) {
      if (e.keyCode === 13) {
        window.pin.activate(e.currentTarget);
      }
    },
    appendToMap: function () {
      var pinsFragment = document.createDocumentFragment();
      window.offers.forEach(function (offer, index) {
        pinsFragment.appendChild(window.pin.create(offer, index));
      });
      pinMap.appendChild(pinsFragment);
      window.pin.addEventListeners();
    }
  };

}());
