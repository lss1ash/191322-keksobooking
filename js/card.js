'use strict';

(function (app) {

  var OFFER_TYPE_DESCRIPTIONS = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  function setText(root, selector, text) {
    root.querySelector(selector).textContent = text;
  }

  function fillFeatures(lodgeClone, item) {
    var lodgeCloneFeatures = lodgeClone.querySelector('.lodge__features');
    item.offer.features.forEach(function (feature) {
      var newSpan = document.createElement('span');
      newSpan.classList.add('feature__image', 'feature__image--' + feature);
      lodgeCloneFeatures.appendChild(newSpan);
    });
  }

  var offerDialog = document.getElementById('offer-dialog');
  var currentDialog = offerDialog.querySelector('.dialog__panel');
  var dialogClose = offerDialog.querySelector('.dialog__close');
  var lodgeTemplate = document.getElementById('lodge-template');

  // Объект диалога с описанием предложения
  var offerDescriptionDialog = {
    open: function () {
      offerDialog.style.display = 'block';
      offerDescriptionDialog.addEventListeners();
    },
    close: function () {
      app.pin.deactivate();
      offerDialog.style.display = 'none';
      offerDescriptionDialog.removeEventListeners();
    },
    fill: function (item) {
      var lodgeClone = lodgeTemplate.content.cloneNode(true);
      setText(lodgeClone, '.lodge__title', item.offer.title);
      setText(lodgeClone, '.lodge__address', item.offer.address);
      lodgeClone.querySelector('.lodge__price').innerHTML = item.offer.price + '&#x20bd;/ночь';
      setText(lodgeClone, '.lodge__type', OFFER_TYPE_DESCRIPTIONS[item.offer.type]);
      setText(lodgeClone, '.lodge__rooms-and-guests', 'Для ' + item.offer.guests + ' гостей в ' + item.offer.rooms + ' комнатах');
      setText(lodgeClone, '.lodge__checkin-time', 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout);
      fillFeatures(lodgeClone, item);
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

  app.card = offerDescriptionDialog;
  app.card.init = function () {
    app.card.fill(app.offers[0]);
    app.card.addEventListeners();
  };
}(window.app));
