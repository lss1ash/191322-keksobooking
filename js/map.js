'use strict';

(function () {
  var OFFER_TYPES = ['flat', 'house', 'bungalo'];
  var OFFER_TYPE_DESCRIPTIONS = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var OFFER_TYPE_MINCOST = {
    flat: 1000,
    house: 10000,
    bungalo: 0
  };
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;

  var offerFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var offerTitles = [
    'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
  ];

  var pinMap = document.querySelector('.tokyo__pin-map');

  var avatarsReordered = createArray(8).map(function (cur, i) {
    return i + 1;
  });

  var offerDialog = document.getElementById('offer-dialog');
  var currentDialog = offerDialog.querySelector('.dialog__panel');

  shuffle(avatarsReordered);
  shuffle(offerTitles);

  var offers = fillOffersArray();

  appendPinsToMap();

  fillDialogTemplate(offers[0]);

  var pins = pinMap.querySelectorAll('.pin');
  pins.forEach(function (pin) {
    pin.addEventListener('click', pinClickHandler);
    pin.addEventListener('keydown', pinKeyDownHandler);
  });
  var dialogClose = offerDialog.querySelector('.dialog__close');
  dialogClose.addEventListener('click', closeDlgHandler);
  document.addEventListener('keydown', closeDlgKeyDownHandler);

  // Module4-task2
  var noticeForm = document.querySelector('.notice__form');
  // Время въезда-выезда синхронизируем
  var selectTimeIn = noticeForm.querySelector('#time');
  var selectTimeOut = noticeForm.querySelector('#timeout');
  selectTimeIn.addEventListener('change', selectSameTimeHandler);
  selectTimeOut.addEventListener('change', selectSameTimeHandler);
  // Тип жилья синхронизируем
  var selectBuildingType = noticeForm.querySelector('#type');
  var inputOfferPrice = noticeForm.querySelector('#price');
  selectBuildingType.addEventListener('change', selectBuildingHandler);
  inputOfferPrice.addEventListener('input', inputOfferPriceHandler);
  // Количество комнат синхронизируем
  var selectRoomNum = noticeForm.querySelector('#room_number');
  var selectCapacity = noticeForm.querySelector('#capacity');
  selectRoomNum.addEventListener('change', selectRoomNumHandler);
  selectCapacity.addEventListener('change', selectCapacityHandler);

  function selectCapacityHandler() {
    if (selectCapacity.value === '0') {
      selectRoomNum.value = 1;
    } else if (selectCapacity.value === '3') {
      selectRoomNum.value = 2;
    }
  }

  function inputOfferPriceHandler(e) {
    var buildingType = 'flat';
    if (inputOfferPrice.value < OFFER_TYPE_MINCOST['flat']) {
      buildingType = 'bungalo';
    } else if (inputOfferPrice.value >= OFFER_TYPE_MINCOST['house']) {
      buildingType = 'house';
    }
    selectBuildingType.value = buildingType;
  }

  function selectRoomNumHandler(e) {
    var capacityValue = 1;
    switch (e.currentTarget.children[e.currentTarget.selectedIndex].value) {
      case '1': capacityValue = 0; break;
      case '2':
      case '100': capacityValue = 3; break;
    }
    selectCapacity.value = capacityValue;
  }

  function selectBuildingHandler(e) {
    var minPrice = OFFER_TYPE_MINCOST[e.currentTarget.children[e.currentTarget.selectedIndex].value];
    minPrice = minPrice || OFFER_TYPE_MINCOST['flat'];
    inputOfferPrice.setAttribute('min', minPrice);
    if (inputOfferPrice.value === '' || +inputOfferPrice.value < minPrice) {
      inputOfferPrice.value = minPrice;
    }
  }

  function selectSameTimeHandler(e) {
    var itemToChange = e.currentTarget === selectTimeIn ? selectTimeOut : selectTimeIn;
    itemToChange.children[e.currentTarget.selectedIndex].selected = true;
  }

  function pinClickHandler(e) {
    activatePin(e.currentTarget);
  }

  function pinKeyDownHandler(e) {
    if (e.keyCode === 13) {
      activatePin(e.currentTarget);
    }
  }

  function closeDlg() {
    deactivatePin();
    offerDialog.style.display = 'none';
    dialogClose.removeEventListener('click', closeDlgHandler);
    document.removeEventListener('keydown', closeDlgKeyDownHandler);
  }

  function closeDlgHandler(e) {
    e.preventDefault();
    closeDlg();
  }

  function closeDlgKeyDownHandler(e) {
    if (e.keyCode === 27) {
      e.preventDefault();
      closeDlg();
    }
  }

  function activatePin(pin) {
    deactivatePin();
    pin.classList.add('pin--active');
    fillDialogTemplate(offers[pin.getAttribute('data-index')]);
    offerDialog.style.display = 'block';
    dialogClose.addEventListener('click', closeDlgHandler);
    document.addEventListener('keydown', closeDlgKeyDownHandler);
  }

  function deactivatePin() {
    var activePin = pinMap.querySelector('.pin--active');
    if (activePin) {
      activePin.classList.remove('pin--active');
    }
  }

  function createArray(len) {
    return Array.apply(null, {length: len});
  }

  function reorderArray(num, ind, arr) {
    var random = getRandomNumber(0, arr.length - 1);
    var saved = arr[random];
    arr[random] = num;
    arr[ind] = saved;
  }

  function shuffle(array) {
    array.forEach(reorderArray);
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

  function createOfferDiv(offer, indx) {
    var newDiv = document.createElement('div');
    newDiv.className = 'pin';
    var newImage = new Image(40, 40);
    newImage.classList.add('rounded');
    newImage.setAttribute('src', offer.author.avatar);
    newDiv.setAttribute('tabindex', 0);
    newDiv.setAttribute('data-index', indx);
    newDiv.appendChild(newImage);
    newDiv.style.left = (offer.location.x - PIN_WIDTH / 2) + 'px';
    newDiv.style.top = (offer.location.y - PIN_HEIGHT) + 'px';

    return newDiv;
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

  function appendPinsToMap() {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < offers.length; i++) {
      pinsFragment.appendChild(createOfferDiv(offers[i], i));
    }
    pinMap.appendChild(pinsFragment);
  }

  function setText(root, selector, text) {
    root.querySelector(selector).textContent = text;
  }

  function fillDialogTemplate(item) {
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

    var offerAvatar = offerDialog.querySelector('.dialog__title').querySelector('img');
    offerAvatar.setAttribute('src', item.author.avatar);
    currentDialog = offerDialog.querySelector('.dialog__panel');
  }
}());
