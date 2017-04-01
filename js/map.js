'use strict';

(function () {
  var OFFER_TYPES = ['flat', 'house', 'bungalo'];
  var OFFER_TYPE_DESCRIPTIONS = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PIN_WIDTH = 56;
  // var PIN_HEIGHT = 75;

  var offerTitles = [
    'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
  ];

  var avatarsReordered = createArray(8).map(function (cur, i) {
    return i + 1;
  });

  avatarsReordered.forEach(reorderArray);
  offerTitles.forEach(reorderArray);

  var offers = fillOffersArray();

  appendPinsToMap();

  fillDialogTemplate(offers[0].offer);

  function createArray(len) {
    return Array.apply(null, {length: len});
  }

  function reorderArray(num, ind, arr) {
    var random = getRandomNumber(0, arr.length - 1);
    var saved = arr[random];
    arr[random] = num;
    arr[ind] = saved;
  }

  function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function getRandomItem(items) {
    return items[getRandomNumber(0, items.length - 1)];
  }

  function getAvatar(ind) {
    return 'img/avatars/user0' + avatarsReordered[ind] + '.png';
  }

  function createOfferDiv(offer) {
    var newDiv = document.createElement('div');
    newDiv.className = 'pin';
    newDiv.innerHTML = '<img src=\"' + offer.author.avatar + '\">';
    newDiv.style.left = (offer.location.x - PIN_WIDTH / 2) + 'px';
    // newDiv.style.top = (offer.location.y - PIN_HEIGHT) + 'px'; // Слишком высоко при таком сдвиге...
    newDiv.style.top = (offer.location.y) + 'px';

    return newDiv;
  }

  function fillOffersArray() {
    return createArray(8).map(function (cur, ind) {
      var loc = {
        'x': getRandomNumber(300, 900),
        'y': getRandomNumber(100, 500)
      };
      return {
        'author': {
          'avatar': getAvatar(ind)
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
          'features': createArray(getRandomNumber(0, 6)).map(function () {
            return getRandomItem(OFFER_FEATURES);
          }),
          'description': '',
          'photos': []
        },
        'location': loc
      };
    });
  }

  function appendPinsToMap() {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < offers.length; i++) {
      pinsFragment.appendChild(createOfferDiv(offers[i]));
    }
    var pinMap = document.querySelector('.tokyo__pin-map');
    pinMap.appendChild(pinsFragment);
  }

  function fillDialogTemplate(offer) {
    var lodgeClone = document.getElementById('lodge-template').content.cloneNode(true);
    lodgeClone.querySelector('.lodge__title').textContent = offer.title;
    lodgeClone.querySelector('.lodge__address').textContent = offer.address;
    lodgeClone.querySelector('.lodge__price').innerHTML = offer.price + '&#x20bd;/ночь';
    lodgeClone.querySelector('.lodge__type').textContent = OFFER_TYPE_DESCRIPTIONS[offer.type];
    lodgeClone.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + offer.guests + ' гостей в ' + offer.rooms + ' комнатах';
    lodgeClone.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
    var lodgeCloneFeatures = lodgeClone.querySelector('.lodge__features');
    offer.features.forEach(function (feature) {
      var newSpan = document.createElement('span');
      newSpan.classList.add('feature__image');
      newSpan.classList.add('feature__image--' + feature);
      lodgeCloneFeatures.appendChild(newSpan);
    });
    lodgeClone.querySelector('.lodge__description').textContent = offer.description;

    var offerDialog = document.getElementById('offer-dialog');
    var currentDialog = offerDialog.querySelector('.dialog__panel');

    offerDialog.replaceChild(lodgeClone, currentDialog);
  }
}());
