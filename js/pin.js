'use strict';

(function () {

  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;
  var PIN_MAIN_WIDTH = 76;
  var PIN_MAIN_HEIGHT = 94;

  var pinMap = document.querySelector('.tokyo__pin-map');
  var mainPin = pinMap.querySelector('.pin__main');

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
        mainPin.addEventListener('mousedown', window.pin.clickMainPinHandler);
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
    clickMainPinHandler: function (e) {
      e.preventDefault();

      var startCoords = {
        x: e.clientX,
        y: e.clientY
      };

      var mouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      };

      var mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        var resultCoords = {
          x: mainPin.offsetLeft + PIN_MAIN_WIDTH / 2,
          y: mainPin.offsetTop + PIN_MAIN_HEIGHT
        };

        window.setMainPinAddress(resultCoords);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    setMainPinCoords: function (coordsStr) {
      var coords = coordsStr.split('').filter(function (letter) {
        return letter !== ' ';
      }).join('').split(',');
      var x = +coords[0].substring(2) - PIN_MAIN_WIDTH / 2;
      var y = +coords[1].substring(2) - PIN_MAIN_HEIGHT;
      mainPin.style.left = x + 'px';
      mainPin.style.top = y + 'px';
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
