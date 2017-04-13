'use strict';

(function (app) {

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

  // Объект формы
  var form = {
    validate: function () {
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
    },
    submitFormHandler: function (e) {
      noticeForm.reset();
      e.preventDefault();
    },
    submitClickHandler: function (e) {
      if (!form.validate()) {
        e.preventDefault();
      }
    },
    submitKeydownHandler: function (e) {
      if (e.keyCode === KEYCODE_ENTER) {
        if (!form.validate()) {
          e.preventDefault();
        }
      }
    },
    selectCapacityHandler: function () {
      if (selectCapacity.value === '0') {
        selectRoomNum.value = 1;
      } else if (selectCapacity.value === '3') {
        selectRoomNum.value = 2;
      }
    },
    inputOfferPriceHandler: function (e) {
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
    },
    selectRoomNumHandler: function (e) {
      var capacityValue;
      switch (e.currentTarget.children[e.currentTarget.selectedIndex].value) {
        case '1': capacityValue = 0; break;
        case '2':
        case '100': capacityValue = 3; break;
        default: capacityValue = 1;
      }
      selectCapacity.value = capacityValue;
    },
    selectBuildingHandler: function (e) {
      var minPrice = OFFER_TYPE_MINCOST[selectBuildingType.children[selectBuildingType.selectedIndex].value];
      inputOfferPrice.setAttribute('min', minPrice);
      inputOfferPrice.value = minPrice;
    },
    selectSameTimeHandler: function (e) {
      var itemToChange = (e.currentTarget === selectTimeIn) ? selectTimeOut : selectTimeIn;
      itemToChange.children[e.currentTarget.selectedIndex].selected = true;
    },
    inputAddressHandler: function (e) {
      app.pin.setMainPinCoords(inputAddress.value);
    }
  };

  var formPublic = {
    init: function () {
      noticeForm.addEventListener('submit', form.submitFormHandler);
      submitButton.addEventListener('click', form.submitClickHandler);
      submitButton.addEventListener('keydown', form.submitKeydownHandler);
      selectTimeIn.addEventListener('change', form.selectSameTimeHandler);
      selectTimeOut.addEventListener('change', form.selectSameTimeHandler);
      selectBuildingType.addEventListener('change', form.selectBuildingHandler);
      inputOfferPrice.addEventListener('input', form.inputOfferPriceHandler);
      selectRoomNum.addEventListener('change', form.selectRoomNumHandler);
      selectCapacity.addEventListener('change', form.selectCapacityHandler);
      inputAddress.addEventListener('input', form.inputAddressHandler);
    },
    setAddress: function (coords) {
      inputAddress.value = 'x: ' + coords.x + ', y: ' + coords.y;
    }
  };

  // window.setMainPinAddress = setAddress;

  app.form = formPublic;

}(window.app));
