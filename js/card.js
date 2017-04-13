'use strict';

(function (app) {

  // var pin = app.pin;
  // card смотрит на app.pin, однако app.pin еще не существует (и наоборот - pin )
  var data = app.data;

  var OFFER_TYPE_DESCRIPTIONS = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  function fillFeatures(lodgeCloneFeatures, features) {
    features.forEach(function (feature) {
      var newSpan = document.createElement('span');
      newSpan.classList.add('feature__image', 'feature__image--' + feature);
      lodgeCloneFeatures.appendChild(newSpan);
    });
  }

  var offerDialog = document.getElementById('offer-dialog');
  var offerAvatar = offerDialog.querySelector('.dialog__title').children[0];
  var currentDialog = offerDialog.querySelector('.dialog__panel');
  var dialogClose = offerDialog.querySelector('.dialog__close');
  var lodgeTemplate = document.getElementById('lodge-template');

  // Объект диалога с описанием предложения
  var offerDescriptionDialog = {
    close: function () {
      app.pin.deactivate();
      offerDialog.style.display = 'none';
      offerDescriptionDialog.removeEventListeners();
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

  var offerDescriptionDialogPublic = {
    open: function () {
      offerDialog.style.display = 'block';
      offerDescriptionDialog.addEventListeners();
    },
    fill: function (item) {
      var lodgeClone = lodgeTemplate.content.cloneNode(true);
      var cloneRoot = lodgeClone.children[0]; // dialog__panel
      cloneRoot.children[0].textContent = item.offer.title;
      cloneRoot.children[1].textContent = item.offer.address;
      cloneRoot.children[2].innerHTML = item.offer.price + '&#x20bd;/ночь';
      cloneRoot.children[3].textContent = OFFER_TYPE_DESCRIPTIONS[item.offer.type];
      cloneRoot.children[4].textContent = 'Для ' + item.offer.guests + ' гостей в ' + item.offer.rooms + ' комнатах';
      cloneRoot.children[5].textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
      fillFeatures(cloneRoot.children[6], item.offer.features);
      cloneRoot.children[7].textContent = item.offer.description;

      offerAvatar.setAttribute('src', item.author.avatar);
      offerDialog.replaceChild(lodgeClone, currentDialog);

      currentDialog = offerDialog.querySelector('.dialog__panel');
    },
    init: function () {
      offerDescriptionDialogPublic.fill(data.offers[0]);
      offerDescriptionDialog.addEventListeners();
    }
  };

  app.card = offerDescriptionDialogPublic;

}(window.app));
