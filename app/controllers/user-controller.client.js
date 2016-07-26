/* global document:false, appUrl:false, ajaxFunctions:false, window:false */

'use strict';

(function () {
  var displayName = document.querySelector('#display-name');
  var authLink = document.querySelector('#auth-link');
  var authUrl = appUrl + '/api/authenticated';
  var apiUrl = appUrl + '/api/users/me';

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', authUrl, function (authenticated) {
    if (authenticated === 'false') {
      displayName.innerHTML = 'Guest';
      authLink.innerHTML = 'Login';
      authLink.href = '/login';
      document.querySelectorAll('.auth-required').forEach(function (el) {
        el.hidden = true;
      });
      return;
    }
    ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);

      if (window.gotUserID) {
        window.gotUserID(userObject._id);
      }

      displayName.innerHTML = userObject.github.displayName || userObject.github.username;
    });
  }));
})();
