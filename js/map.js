'use strict';

(function () {
  // Константы
  var OFFER_TYPES = ['flat', 'house', 'bungalo'];
  var OFFER_TYPE_DESCRIPTIONS = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
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
  var offerDialog = document.getElementById('offer-dialog');
  var currentDialog = offerDialog.querySelector('.dialog__panel');
  var dialogClose = offerDialog.querySelector('.dialog__close');

  var offers = fillOffersArray();

  // Объект диалога с описанием предложения
  var offerDescriptionDialog = {
    open: function () {
      offerDialog.style.display = 'block';
      offerDescriptionDialog.addEventListeners();
    },
    close: function () {
      pin.deactivate();
      offerDialog.style.display = 'none';
      offerDescriptionDialog.removeEventListeners();
    },
    fill: function (item) {
      var setText = function (root, selector, text) {
        root.querySelector(selector).textContent = text;
      };
      var lodgeClone = document.getElementById('lodge-template').content.cloneNode(true);
      setText(lodgeClone, '.lodge__title', item.offer.title);
      setText(lodgeClone, '.lodge__address', item.offer.address);
      lodgeClone.querySelector('.lodge__price').innerHTML = item.offer.price + '&#x20bd;/ночь';
      setText(lodgeClone, '.lodge__type', OFFER_TYPE_DESCRIPTIONS[item.offer.type]);
      setText(lodgeClone, '.lodge__rooms-and-guests', 'Для ' + item.offer.guests + ' гостей в ' + item.offer.rooms + ' комнатах');
      setText(lodgeClone, '.lodge__checkin-time', 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout);

      var lodgeCloneFeatures = lodgeClone.querySelector('.lodge__features');
      item.offer.features.forEach(function (feature) {
        var newSpan = document.createElement('span');
        newSpan.classList.add('feature__image', 'feature__image--' + feature);
        lodgeCloneFeatures.appendChild(newSpan);
      });
      setText(lodgeClone, '.lodge__description', item.offer.description);

      offerDialog.replaceChild(lodgeClone, currentDialog);

      var offerAvatar = offerDialog.querySelector('.dialog__title').children[0];
      offerAvatar.setAttribute('src', item.author.avatar);
      currentDialog = offerDialog.querySelector('.dialog__panel');
    },
    addEventListeners: function () {
      dialogClose.addEventListener('click', this.closeClickHandler);
      document.addEventListener('keydown', this.closeKeyDownHandler);
    },
    removeEventListeners: function () {
      dialogClose.removeEventListener('click', this.closeClickHandler);
      document.removeEventListener('keydown', this.closeKeyDownHandler);
    },
    closeClickHandler: function (e) {
      e.preventDefault();
      offerDescriptionDialog.close();
    },
    closeKeyDownHandler: function (e) {
      if (e.keyCode === 27) {
        e.preventDefault();
        offerDescriptionDialog.close();
      }
    }
  };

  // Объект пина
  var pin = {
    active: null,
    activate: function (pinItem) {
      if (pinItem.dataset.index && pin.active !== pinItem) {
        pin.deactivate();
        pinItem.classList.add('pin--active');
        offerDescriptionDialog.fill(offers[pinItem.dataset.index]);
        pin.active = pinItem;
        offerDescriptionDialog.open();
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
      offers.forEach(function (offer, index) {
        pinsFragment.appendChild(pin.create(offer, index));
      });
      pinMap.appendChild(pinsFragment);
      pin.addEventListeners();
    }
  };

  pin.appendToMap();
  pin.addEventListeners();
  offerDescriptionDialog.fill(offers[0]);
  offerDescriptionDialog.addEventListeners();

}());
