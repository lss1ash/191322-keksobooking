'use strict';

(function (app) {

  var HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    NOT_FOUND: 404
  };

  app.load = function (url, successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    var loadHandler = function () {
      switch (xhr.status) {
        case HTTP_STATUS.OK:
          successCallback(xhr.response);
          removeEventListeners();
          break;
        case HTTP_STATUS.BAD_REQUEST:
          errorCallback('Ошибка получения данных с сервера', 'Запрос на получение информации сформирован неверно...');
          break;
        case HTTP_STATUS.NOT_FOUND:
          errorCallback('Ошибка получения данных с сервера', 'Не удалось найти информацию по указанному пути...');
          break;
        case HTTP_STATUS.FORBIDDEN:
          errorCallback('Ошибка получения данных с сервера', 'Доступ запрещён!');
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
