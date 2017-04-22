'use strict';

(function (app) {

  var data = app.factory.getData;
  var pin = app.factory.getPin;
  var utils = app.factory.getUtils;

  var KEYCODE_ENTER = 13;
  var DEBOUNCE_INTERVAL = 500;

  // filter form
  var filterForm = document.querySelector('.tokyo__filters');
  var housingType = filterForm.querySelector('#housing_type');
  var housingPrice = filterForm.querySelector('#housing_price');
  var roomsNumber = filterForm.querySelector('#housing_room-number');
  var guestsNumber = filterForm.querySelector('#housing_guests-number');
  var filterFeatures = filterForm.querySelectorAll('input[name=\"feature\"]');

  // main form
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
    var selectMap = {
      'housing_type': 'type',
      'housing_price': 'price',
      'housing_room-number': 'rooms',
      'housing_guests-number': 'guests'
    };
    var selectType = selectMap[e.target.name];

    if (selectType === 'type' || selectType === 'price' || e.target.value === 'any') {
      currentFilter[selectType] = e.target.value;
    } else {
      currentFilter[selectType] = +e.target.value;
    }
    filterAndRedraw();
  };

  var changeCheckboxFilterHandler = function (e) {
    currentFilter.features[e.target.value] = e.target.checked;
    filterAndRedraw();
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
    housingType.addEventListener('change', utils().debounce(changeSelectFilterHandler, DEBOUNCE_INTERVAL));
    housingPrice.addEventListener('change', utils().debounce(changeSelectFilterHandler, DEBOUNCE_INTERVAL));
    roomsNumber.addEventListener('change', utils().debounce(changeSelectFilterHandler, DEBOUNCE_INTERVAL));
    guestsNumber.addEventListener('change', utils().debounce(changeSelectFilterHandler, DEBOUNCE_INTERVAL));

    [].forEach.call(filterFeatures, function (checkbox) {
      checkbox.addEventListener('change', utils().debounce(changeCheckboxFilterHandler, DEBOUNCE_INTERVAL));
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
