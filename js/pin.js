'use strict';

(function (app) {

  var card = app.card;
  var data = app.data;
  var form = app.form;

  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;
  var PIN_MAIN_WIDTH = 76;
  var PIN_MAIN_HEIGHT = 94;

  var pinMap = document.querySelector('.tokyo__pin-map');
  var mainPin = pinMap.querySelector('.pin__main');

  var pin = {
    active: null,
    startCoords: {
      x: 0,
      y: 0
    },
    activate: function (pinItem) {
      if (pinItem.dataset.index && pin.active !== pinItem) {
        pinPublic.deactivate();
        pinItem.classList.add('pin--active');
        card.fill(data.offers[pinItem.dataset.index]);
        pin.active = pinItem;
        card.open();
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
      mainPin.addEventListener('mousedown', pin.clickMainPinHandler);
    },
    clickHandler: function (e) {
      pin.activate(e.currentTarget);
    },
    keyDownHandler: function (e) {
      if (e.keyCode === 13) {
        pin.activate(e.currentTarget);
      }
    },
    clickMainPinHandler: function (e) {
      e.preventDefault();

      pin.startCoords = {
        x: e.clientX,
        y: e.clientY
      };
      document.addEventListener('mousemove', pin.mouseMoveHandler);
      document.addEventListener('mouseup', pin.mouseUpHandler);
    },
    mouseMoveHandler: function (e) {
      e.preventDefault();

      var shift = {
        x: pin.startCoords.x - e.clientX,
        y: pin.startCoords.y - e.clientY
      };

      pin.startCoords = {
        x: e.clientX,
        y: e.clientY
      };

      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
    },
    mouseUpHandler: function (e) {
      e.preventDefault();

      document.removeEventListener('mousemove', pin.mouseMoveHandler);
      document.removeEventListener('mouseup', pin.mouseUpHandler);

      var resultCoords = {
        x: mainPin.offsetLeft + PIN_MAIN_WIDTH / 2,
        y: mainPin.offsetTop + PIN_MAIN_HEIGHT
      };

      form.setAddress(resultCoords);
    },
    appendToMap: function () {
      var pinsFragment = document.createDocumentFragment();
      data.offers.forEach(function (offer, index) {
        pinsFragment.appendChild(pin.create(offer, index));
      });
      pinMap.appendChild(pinsFragment);
      pin.addEventListeners();
    }
  };

  var pinPublic = {
    init: function () {
      pin.appendToMap();
      pin.addEventListeners();
      form.setAddress({
        x: mainPin.offsetLeft + PIN_MAIN_WIDTH / 2,
        y: mainPin.offsetTop + PIN_MAIN_HEIGHT
      });
    },
    deactivate: function () {
      if (pin.active !== null) {
        pin.active.classList.remove('pin--active');
        pin.active = null;
      }
    },
    setMainPinCoords: function (coordsStr) {
      var coords = coordsStr.replace(/\s/g, '').split(',');
      var rightFormat = coords.length === 2 && coords[0].slice(0, 2).toLowerCase() === 'x:' && coords[1].slice(0, 2).toLowerCase() === 'y:';
      if (rightFormat) {
        var x = +coords[0].slice(2) - PIN_MAIN_WIDTH / 2;
        var y = +coords[1].slice(2) - PIN_MAIN_HEIGHT;
        if (typeof (x) === 'number' && typeof (y) === 'number') {
          mainPin.style.left = x + 'px';
          mainPin.style.top = y + 'px';
        }
      }
    }
  };

  app.pin = pinPublic;

}(window.app));
