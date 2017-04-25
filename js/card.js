'use strict';

(function (app) {

  var pin = app.factory.getPin;

  var OFFER_TYPE_DESCRIPTIONS = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var offerDialog = document.getElementById('offer-dialog');
  var offerAvatar = offerDialog.querySelector('.dialog__title').firstElementChild;
  var currentDialog = offerDialog.querySelector('.dialog__panel');
  var dialogClose = offerDialog.querySelector('.dialog__close');
  var lodgeTemplate = document.getElementById('lodge-template');

  var openCard = function () {
    offerDialog.style.display = 'block';
    addEventListeners();
  };
  var fillCard = function (item) {
    var lodgeClone = lodgeTemplate.content.cloneNode(true);
    var cloneRoot = lodgeClone.querySelector('.dialog__panel');
    cloneRoot.querySelector('.lodge__title').textContent = item.offer.title;
    cloneRoot.querySelector('.lodge__address').textContent = item.offer.address;
    cloneRoot.querySelector('.lodge__price').innerHTML = item.offer.price + '&#x20bd;/ночь';
    cloneRoot.querySelector('.lodge__type').textContent = OFFER_TYPE_DESCRIPTIONS[item.offer.type];
    cloneRoot.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + item.offer.guests + ' гостей в ' + item.offer.rooms + ' комнатах';
    cloneRoot.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
    fillCardFeatures(cloneRoot.querySelector('.lodge__features'), item.offer.features);
    cloneRoot.querySelector('.lodge__description').textContent = item.offer.description;
    fillCardPhotos(cloneRoot.querySelector('.lodge__photos'), item.offer.photos);

    offerAvatar.setAttribute('src', item.author.avatar);
    offerDialog.replaceChild(lodgeClone, currentDialog);

    currentDialog = offerDialog.querySelector('.dialog__panel');
  };
  var fillCardFeatures = function (lodgeCloneFeatures, features) {
    features.forEach(function (feature) {
      var newSpan = document.createElement('span');
      newSpan.classList.add('feature__image', 'feature__image--' + feature);
      lodgeCloneFeatures.appendChild(newSpan);
    });
  };
  var fillCardPhotos = function (lodgeClonePhotos, photos) {
    photos.forEach(function (curPhoto) {
      var imgNode = new Image(52, 42);
      imgNode.setAttribute('src', curPhoto);
      imgNode.setAttribute('alt', 'Lodge photo');
      lodgeClonePhotos.appendChild(imgNode);
    });
  };
  var closeCard = function () {
    pin().deactivate();
    offerDialog.style.display = 'none';
    removeEventListeners();
  };

  var addEventListeners = function () {
    dialogClose.addEventListener('click', closeClickHandler);
    document.addEventListener('keydown', closeKeyDownHandler);
  };
  var removeEventListeners = function () {
    dialogClose.removeEventListener('click', closeClickHandler);
    document.removeEventListener('keydown', closeKeyDownHandler);
  };

  var closeClickHandler = function (e) {
    e.preventDefault();
    closeCard();
  };
  var closeKeyDownHandler = function (e) {
    if (e.keyCode === 27) {
      e.preventDefault();
      closeCard();
    }
  };

  app.card = {
    open: openCard,
    fill: fillCard,
    close: closeCard,
    addEventListeners: addEventListeners
  };

}(window.app));
