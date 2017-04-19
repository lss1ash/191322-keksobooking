'use strict';

(function (app) {

  var data = app.factory.getData;
  var form = app.factory.getForm;
  var card = app.factory.getCard;

  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;
  var PIN_MAIN_WIDTH = 76;
  var PIN_MAIN_HEIGHT = 94;

  var pinMap = document.querySelector('.tokyo__pin-map');
  var mainPin = pinMap.querySelector('.pin__main');

  var activePin = null;
  var startCoords = {
    x: 0,
    y: 0
  };

  var activatePin = function (pinItem) {
    if (pinItem.dataset.index && activePin !== pinItem) {
      deactivatePin();
      pinItem.classList.add('pin--active');
      card().fill(data().offers[pinItem.dataset.index]);
      activePin = pinItem;
      app.showCard();
    }
  };
  var deactivatePin = function () {
    if (activePin !== null) {
      activePin.classList.remove('pin--active');
      activePin = null;
    }
  };
  var createPin = function (offer, index) {
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
  };

  var addPinEventListeners = function () {
    var pins = pinMap.querySelectorAll('.pin');
    [].slice.call(pins).forEach(function (pinItem) {
      pinItem.addEventListener('click', clickPinHandler);
      pinItem.addEventListener('keydown', keyDownPinHandler);
    });
    mainPin.addEventListener('mousedown', clickMainPinHandler);
  };
  var clickPinHandler = function (e) {
    activatePin(e.currentTarget);
  };
  var keyDownPinHandler = function (e) {
    if (e.keyCode === 13) {
      activatePin(e.currentTarget);
    }
  };

  var clickMainPinHandler = function (e) {
    e.preventDefault();
    startCoords = {
      x: e.clientX,
      y: e.clientY
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
  var mouseMoveHandler = function (e) {
    e.preventDefault();

    var shift = {
      x: startCoords.x - e.clientX,
      y: startCoords.y - e.clientY
    };

    startCoords = {
      x: e.clientX,
      y: e.clientY
    };

    mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
  };
  var mouseUpHandler = function (e) {
    e.preventDefault();

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    var resultCoords = {
      x: mainPin.offsetLeft + PIN_MAIN_WIDTH / 2,
      y: mainPin.offsetTop + PIN_MAIN_HEIGHT
    };

    form().setAddress(resultCoords);
  };

  var appendPinsToMap = function (pinArray) {
    if (pinMap.children.length > 1) {
      removePinsFromMap();
    }
    var pinsFragment = document.createDocumentFragment();
    pinArray.forEach(function (offer, index) {
      var currentPin = createPin(offer, index);
      if (index === 0) {
        activatePin(currentPin);
      }
      pinsFragment.appendChild(currentPin);
    });
    pinMap.appendChild(pinsFragment);
  };
  var removePinsFromMap = function () {
    [].forEach.call(pinMap.children, function (current, index) {
      if (index !== 0) {
        pinMap.removeChild(current);
      }
    });
  };

  var initPin = function () {
    form().setAddress({
      x: mainPin.offsetLeft + PIN_MAIN_WIDTH / 2,
      y: mainPin.offsetTop + PIN_MAIN_HEIGHT
    });
  };

  app.pin = {
    deactivate: deactivatePin,
    append: function (arr) {
      appendPinsToMap(arr);
      addPinEventListeners();
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

  initPin();

}(window.app));
