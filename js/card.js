'use strict';

(function (app) {

  var data = app.factory.getData();
  var pin = app.factory.getPin();

  var OFFER_TYPE_DESCRIPTIONS = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var offerDialog = document.getElementById('offer-dialog');
  var offerAvatar = offerDialog.querySelector('.dialog__title').children[0];
  var currentDialog = offerDialog.querySelector('.dialog__panel');
  var dialogClose = offerDialog.querySelector('.dialog__close');
  var lodgeTemplate = document.getElementById('lodge-template');

  var openCard = function () {
    offerDialog.style.display = 'block';
    addEventListeners();
  };
  var fillCard = function (item) {
    var lodgeClone = lodgeTemplate.content.cloneNode(true);
    var cloneRoot = lodgeClone.children[0]; // dialog__panel
    cloneRoot.children[0].textContent = item.offer.title;
    cloneRoot.children[1].textContent = item.offer.address;
    cloneRoot.children[2].innerHTML = item.offer.price + '&#x20bd;/ночь';
    cloneRoot.children[3].textContent = OFFER_TYPE_DESCRIPTIONS[item.offer.type];
    cloneRoot.children[4].textContent = 'Для ' + item.offer.guests + ' гостей в ' + item.offer.rooms + ' комнатах';
    cloneRoot.children[5].textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
    fillCardFeatures(cloneRoot.children[6], item.offer.features);
    cloneRoot.children[7].textContent = item.offer.description;

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
  var closeCard = function () {
    pin.deactivate();
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

  var initCard = function () {
    fillCard(data.offers[0]);
    addEventListeners();
  };

  app.card = {
    open: openCard,
    fill: fillCard
  };

  initCard();

}(window.app));
