'use strict';

(function (app) {

  var HTTP_STATUS = {
    SUCCESS: '2',
    CLIENT_ERROR: '4',
    SERVER_ERROR: '5'
  };

  app.load = function (url, successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    var loadHandler = function () {
      switch (xhr.status.toString().slice(0, 1)) {
        case HTTP_STATUS.SUCCESS:
          successCallback(xhr.response);
          removeEventListeners();
          break;
        case HTTP_STATUS.CLIENT_ERROR:
          errorCallback('Ошибка!', 'При получении данных произошла ошибка клиента:<br>' + xhr.status + ' ' + xhr.statusText);
          break;
        case HTTP_STATUS.SERVER_ERROR:
          errorCallback('Ошибка!', 'При получении данных произошла ошибка сервера:<br>' + xhr.status + ' ' + xhr.statusText);
          break;
        default:
          errorCallback('Произошла ошибка при выполнении запроса', xhr.status + ' ' + xhr.statusText);
          break;
      }
    };

    var errorHandler = function () {
      errorCallback('Произошла ошибка соединения с сервером', 'Попробуйте позднее...');
    };

    var timeoutHandler = function () {
      errorCallback('Произошла ошибка соединения с сервером', 'Время ожидания ответа на запрос истекло...');
    };

    var addEventListeners = function () {
      xhr.addEventListener('load', loadHandler);
      xhr.addEventListener('error', errorHandler);
      xhr.addEventListener('timeout', timeoutHandler);
    };
    var removeEventListeners = function () {
      xhr.removeEventListener('load', loadHandler);
      xhr.removeEventListener('error', errorHandler);
      xhr.removeEventListener('timeout', timeoutHandler);
    };

    addEventListeners();

    xhr.open('GET', url);
    xhr.send();
  };

}(window.app));
