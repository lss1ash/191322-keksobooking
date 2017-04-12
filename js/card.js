'use strict';

(function () {

  var OFFER_TYPE_DESCRIPTIONS = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var offerDialog = document.getElementById('offer-dialog');
  var currentDialog = offerDialog.querySelector('.dialog__panel');
  var dialogClose = offerDialog.querySelector('.dialog__close');

  // Объект диалога с описанием предложения
  window.offerDescriptionDialog = {
    open: function () {
      offerDialog.style.display = 'block';
      window.offerDescriptionDialog.addEventListeners();
    },
    close: function () {
      window.pin.deactivate();
      offerDialog.style.display = 'none';
      window.offerDescriptionDialog.removeEventListeners();
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
      window.offerDescriptionDialog.close();
    },
    closeKeyDownHandler: function (e) {
      if (e.keyCode === 27) {
        e.preventDefault();
        window.offerDescriptionDialog.close();
      }
    }
  };
}());
