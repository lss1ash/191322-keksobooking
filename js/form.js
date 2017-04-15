'use strict';

(function (app) {

  var pin = app.factory.getPin;

  var OFFER_TYPE_MINCOST = {
    flat: 1000,
    house: 10000,
    bungalo: 0
  };
  var KEYCODE_ENTER = 13;

  // noticeForm
  var noticeForm = document.querySelector('.notice__form');
  var submitButton = noticeForm.querySelector('.form__submit');
  var selectTimeIn = noticeForm.querySelector('#time');
  var selectTimeOut = noticeForm.querySelector('#timeout');
  var selectBuildingType = noticeForm.querySelector('#type');
  var inputOfferPrice = noticeForm.querySelector('#price');
  var selectRoomNum = noticeForm.querySelector('#room_number');
  var selectCapacity = noticeForm.querySelector('#capacity');
  var inputAddress = noticeForm.querySelector('#address');

  var validateForm = function () {
    var result = true;
    [].forEach.call(noticeForm, function (item) {
      if (!item.validity.valid) {
        item.classList.add('field--invalid');
        result = false;
      } else {
        item.classList.remove('field--invalid');
      }
    });
    return result;
  };

  var submitFormHandler = function (e) {
    noticeForm.reset();
    e.preventDefault();
  };
  var submitClickHandler = function (e) {
    if (!validateForm()) {
      e.preventDefault();
    }
  };
  var submitKeydownHandler = function (e) {
    if (e.keyCode === KEYCODE_ENTER) {
      if (!validateForm()) {
        e.preventDefault();
      }
    }
  };

  var selectCapacityHandler = function () {
    if (selectCapacity.value === '0') {
      selectRoomNum.value = 1;
    } else if (selectCapacity.value === '3') {
      selectRoomNum.value = 2;
    }
  };

  var inputOfferPriceHandler = function (e) {
    var buildingType = 'flat';
    if (inputOfferPrice.value < OFFER_TYPE_MINCOST['flat']) {
      buildingType = 'bungalo';
    } else if (inputOfferPrice.value >= OFFER_TYPE_MINCOST['house']) {
      buildingType = 'house';
    }
    if (selectBuildingType.value !== buildingType) {
      selectBuildingType.value = buildingType;
      inputOfferPrice.setAttribute('min', OFFER_TYPE_MINCOST[buildingType]);
    }
  };

  var selectRoomNumHandler = function (e) {
    var capacityValue;
    switch (e.currentTarget.value) {
      case '1': capacityValue = 0; break;
      case '2':
      case '100': capacityValue = 3; break;
      default: capacityValue = 1;
    }
    selectCapacity.value = capacityValue;
  };

  var selectBuildingHandler = function (e) {
    var minPrice = OFFER_TYPE_MINCOST[selectBuildingType.value];
    inputOfferPrice.setAttribute('min', minPrice);
    inputOfferPrice.value = minPrice;
  };

  var selectSameTimeHandler = function (e) {
    var itemToChange = (e.currentTarget === selectTimeIn) ? selectTimeOut : selectTimeIn;
    itemToChange.children[e.currentTarget.selectedIndex].selected = true;
  };

  var inputAddressHandler = function () {
    pin().setMainPinCoords(inputAddress.value);
  };

  var addEventListeners = function () {
    noticeForm.addEventListener('submit', submitFormHandler);
    submitButton.addEventListener('click', submitClickHandler);
    submitButton.addEventListener('keydown', submitKeydownHandler);
    selectTimeIn.addEventListener('change', selectSameTimeHandler);
    selectTimeOut.addEventListener('change', selectSameTimeHandler);
    selectBuildingType.addEventListener('change', selectBuildingHandler);
    inputOfferPrice.addEventListener('input', inputOfferPriceHandler);
    selectRoomNum.addEventListener('change', selectRoomNumHandler);
    selectCapacity.addEventListener('change', selectCapacityHandler);
    inputAddress.addEventListener('input', inputAddressHandler);
  };

  app.form = {
    setAddress: function (coords) {
      inputAddress.value = 'x: ' + coords.x + ', y: ' + coords.y;
    }
  };

  addEventListeners();

}(window.app));
