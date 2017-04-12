'use strict';

(function () {

  // Константы
  var OFFER_TYPES = ['flat', 'house', 'bungalo'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;

  var offerFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var offerTitles = [
    'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
  ];

  // Вспомогательные функции
  function createArray(len) {
    return Array.apply(null, {length: len});
  }

  function reorderItem(number, index, array) {
    var random = getRandomNumber(0, array.length - 1);
    var saved = array[random];
    array[random] = number;
    array[index] = saved;
  }

  function shuffle(array) {
    array.forEach(reorderItem);
  }

  function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function getRandomItem(items) {
    return items[getRandomNumber(0, items.length - 1)];
  }

  function fillOffersArray() {
    shuffle(offerFeatures);
    return createArray(8).map(function (cur, ind) {
      var loc = {
        'x': getRandomNumber(300, 900),
        'y': getRandomNumber(100, 500)
      };
      return {
        'author': {
          'avatar': 'img/avatars/user0' + avatars[ind] + '.png'
        },
        'offer': {
          'title': offerTitles[ind],
          'address': loc.x + ', ' + loc.y,
          'price': getRandomNumber(1000, 1000000),
          'type': getRandomItem(OFFER_TYPES),
          'rooms': getRandomNumber(1, 5),
          'guests': getRandomNumber(0, 50),
          'checkin': getRandomItem(OFFER_CHECKS),
          'checkout': getRandomItem(OFFER_CHECKS),
          'features': createArray(getRandomNumber(0, offerFeatures.length)).map(function (curItem, i) {
            return offerFeatures[i];
          }),
          'description': '',
          'photos': []
        },
        'location': loc
      };
    });
  }

  // Заполним случайные данные
  var avatars = createArray(8).map(function (cur, i) {
    return i + 1;
  });
  shuffle(avatars);
  shuffle(offerTitles);

  // pinMap
  var pinMap = document.querySelector('.tokyo__pin-map');

  var offers = fillOffersArray();

  // Объект пина
  window.pin = {
    active: null,
    activate: function (pinItem) {
      if (pinItem.dataset.index && window.pin.active !== pinItem) {
        window.pin.deactivate();
        pinItem.classList.add('pin--active');
        window.offerDescriptionDialog.fill(offers[pinItem.dataset.index]);
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
      offers.forEach(function (offer, index) {
        pinsFragment.appendChild(window.pin.create(offer, index));
      });
      pinMap.appendChild(pinsFragment);
      window.pin.addEventListeners();
    }
  };

  window.pin.appendToMap();
  window.pin.addEventListeners();
  window.offerDescriptionDialog.fill(offers[0]);
  window.offerDescriptionDialog.addEventListeners();
}());
