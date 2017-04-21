'use strict';

(function (app) {

  var data = app.factory.getData;
  var pin = app.factory.getPin;
  var utils = app.factory.getUtils;

  var KEYCODE_ENTER = 13;

  var noticeForm = document.querySelector('.notice__form');
  var submitButton = noticeForm.querySelector('.form__submit');
  var selectTimeIn = noticeForm.querySelector('#time');
  var selectTimeOut = noticeForm.querySelector('#timeout');
  var selectBuildingType = noticeForm.querySelector('#type');
  var inputOfferPrice = noticeForm.querySelector('#price');
  var selectRoomNum = noticeForm.querySelector('#room_number');
  var selectCapacity = noticeForm.querySelector('#capacity');
  var inputAddress = noticeForm.querySelector('#address');

  var currentFilter = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: {
      wifi: false,
      dishwasher: false,
      parking: false,
      washer: false,
      elevator: false,
      conditione: false
    }
  };

  var sync = {
    value: function (element, value) {
      element.value = value;
    },
    min: function (element, value) {
      element.min = value;
    }
  };

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
  var submitKeydownHandler = function (e) {
    if (e.keyCode === KEYCODE_ENTER) {
      validateForm();
    }
  };

  var selectCapacityHandler = function () {
    app.synchronizeFields(selectCapacity, selectRoomNum, ['0', '3', '3'], ['1', '2', '100'], sync.value);
  };

  var selectRoomNumHandler = function (e) {
    app.synchronizeFields(selectRoomNum, selectCapacity, ['1', '2', '100'], ['0', '3', '3'], sync.value);
  };

  var selectBuildingHandler = function (e) {
    app.synchronizeFields(selectBuildingType, inputOfferPrice, ['flat', 'bungalo', 'house'], [1000, 0, 10000], sync.min);
  };

  var selectSameTimeInHandler = function (e) {
    app.synchronizeFields(selectTimeIn, selectTimeOut, ['12', '13', '14'], ['12', '13', '14'], sync.value);
  };

  var selectSameTimeOutHandler = function (e) {
    app.synchronizeFields(selectTimeOut, selectTimeIn, ['12', '13', '14'], ['12', '13', '14'], sync.value);
  };

  var inputAddressHandler = function () {
    pin().setMainPinCoords(inputAddress.value);
  };

  var changeSelectFilterHandler = function (e) {
    var selectType;
    switch (e.currentTarget.name) {
      case 'housing_type':
        selectType = 'type';
        break;
      case 'housing_price':
        selectType = 'price';
        break;
      case 'housing_room-number':
        selectType = 'rooms';
        break;
      case 'housing_guests-number':
        selectType = 'guests';
        break;
    }
    if (selectType === 'type' || selectType === 'price' || e.currentTarget.value === 'any') {
      currentFilter[selectType] = e.currentTarget.value;
    } else {
      currentFilter[selectType] = +e.currentTarget.value;
    }
    utils().debounce(filterAndRedraw);
  };

  var changeCheckboxFilterHandler = function (e) {
    currentFilter.features[e.currentTarget.value] = e.currentTarget.checked;
    utils().debounce(filterAndRedraw);
  };

  var filterAndRedraw = function () {
    data().filterOffers();
    pin().append();
  };

  var addEventListeners = function () {
    noticeForm.addEventListener('submit', submitFormHandler);
    submitButton.addEventListener('click', validateForm);
    submitButton.addEventListener('keydown', submitKeydownHandler);
    selectTimeIn.addEventListener('change', selectSameTimeInHandler);
    selectTimeOut.addEventListener('change', selectSameTimeOutHandler);
    selectBuildingType.addEventListener('change', selectBuildingHandler);
    selectRoomNum.addEventListener('change', selectRoomNumHandler);
    selectCapacity.addEventListener('change', selectCapacityHandler);
    inputAddress.addEventListener('input', inputAddressHandler);
  };

  var addFilterEventListeners = function () {
    document.forms.tokyo__filters.elements['housing_type'].addEventListener('change', changeSelectFilterHandler);
    document.forms.tokyo__filters.elements['housing_price'].addEventListener('change', changeSelectFilterHandler);
    document.forms.tokyo__filters.elements['housing_room-number'].addEventListener('change', changeSelectFilterHandler);
    document.forms.tokyo__filters.elements['housing_guests-number'].addEventListener('change', changeSelectFilterHandler);

    [].forEach.call(document.forms.tokyo__filters.elements.feature, function (checkbox) {
      checkbox.addEventListener('change', changeCheckboxFilterHandler);
    });
  };

  app.form = {
    setAddress: function (coords) {
      inputAddress.value = 'x: ' + coords.x + ', y: ' + coords.y;
    },
    currentFilter: currentFilter,
    addFilterEventListeners: addFilterEventListeners
  };

  addEventListeners();

}(window.app));
