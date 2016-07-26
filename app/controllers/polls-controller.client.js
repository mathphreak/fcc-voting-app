/* global document:false, appUrl:false, ajaxFunctions:false, window:false */

'use strict';

(function () {
  var pollCount = document.querySelector('#poll-count');
  var pollList = document.querySelector('#poll-list');
  var apiUrl = appUrl + '/api' + window.location.pathname;

  function buildLI(poll) {
    return '<li><a href="/polls/' + poll._id + '">' + poll.title + '</a></li>';
  }

  function updatePolls(data) {
    var polls = JSON.parse(data);
    pollCount.innerText = polls.length;
    if (window.location.pathname.indexOf('my') > -1) {
      pollCount.innerText += ' of your';
    }
    pollList.innerHTML = polls.map(buildLI).join('\n');
  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePolls));
})();
