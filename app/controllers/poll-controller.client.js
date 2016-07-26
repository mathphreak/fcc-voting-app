/* global document:false, window:false, appUrl:false, ajaxFunctions:false, google:false */

'use strict';

(function () {
  var pollTitle = document.querySelector('#poll-title');
  var pollVote = document.querySelector('#poll-vote');
  var pollOptions = document.querySelector('#poll-options');
  var pollDelete = document.querySelector('#poll-delete');
  var pollAdd = document.querySelector('#poll-add');
  var apiUrl = appUrl + '/api/polls/' + /[0-9a-f]+$/.exec(window.location)[0];

  var chartsAPIReady = false;
  var pollData = false;

  function chartsLoaded() {
    chartsAPIReady = true;
    if (pollData) {
      drawChart();
    }
  }

  function buildLI(option) {
    return '<li><label><input type="radio" name="option" value="' + option._id + '">' + option.text + '</label></li>';
  }

  window.gotUserID = function (userID) {
    if (userID === pollData.owner) {
      pollDelete.addEventListener('click', function () {
        ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
          window.location.pathname = '/polls';
        });
      });
      pollDelete.hidden = false;
    }
  };

  function updatePoll(data) {
    var poll = JSON.parse(data);
    pollTitle.innerText = poll.title;
    document.title = document.title.replace('{{poll}}', poll.title);
    pollVote.action = apiUrl + '/vote';
    pollAdd.action = apiUrl;
    pollOptions.innerHTML = poll.options.map(buildLI).join('\n');
    pollData = poll;
    if (chartsAPIReady) {
      drawChart();
    }
  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePoll));

  // Google Charts
  // =============

  // Load the Visualization API and the corechart package.
  google.charts.load('current', {packages: ['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(chartsLoaded);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Option');
    data.addColumn('number', 'Votes');
    data.addRows(pollData.options.map(function (d) {
      return [d.text, d.count];
    }));

    // Set chart options
    var options = {
      title: 'Results',
      width: 400,
      height: 300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('poll-chart'));
    chart.draw(data, options);
  }
})();
