'use strict';

var bodyParser = require('body-parser');

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/poll-handler.server.js');

function sendFile(p) {
  return (req, res) => res.sendFile(path + p);
}

module.exports = function (app, passport) {
  function forceAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  var pollHandler = new PollHandler();

  var formParser = bodyParser.urlencoded({extended: false});

  app.route('/')
    .get((req, res) => res.redirect('/polls'));

  app.route('/polls')
    .get(sendFile('/public/polls.html'));

  app.route('/polls/:id')
    .get(sendFile('/public/poll.html'));

  app.route('/login')
    .get(sendFile('/public/login.html'));

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/polls');
    });

  app.route('/my-polls')
    .get(forceAuth, sendFile('/public/polls.html'));

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/polls',
      failureRedirect: '/login'
    }));

  app.route('/api/authenticated')
    .get((req, res) => res.json(req.isAuthenticated()));

  app.route('/api/users/:id')
    .get(forceAuth, function (req, res) {
      res.json(req.user);
    });

  app.route('/api/polls')
    .get(pollHandler.getPolls)
    .post(formParser, forceAuth, pollHandler.addPoll);

  app.route('/api/my-polls')
    .get(pollHandler.getMyPolls);

  app.route('/api/polls/:id')
    .get(pollHandler.getPoll)
    .post(formParser, forceAuth, pollHandler.add)
    .delete(forceAuth, pollHandler.deletePoll);

  app.route('/api/polls/:id/vote')
    .post(formParser, pollHandler.vote);
};
