'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/click-handler.server.js');

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

  var clickHandler = new ClickHandler();

  app.route('/')
    .get(forceAuth, sendFile('/public/index.html'));

  app.route('/polls')
    .get(sendFile('/public/polls.html'));

  app.route('/login')
    .get(sendFile('/public/login.html'));

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/profile')
    .get(forceAuth, sendFile('/public/profile.html'));

  app.route('/api/:id')
    .get(forceAuth, function (req, res) {
      res.json(req.user.github);
    });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/api/:id/clicks')
    .get(forceAuth, clickHandler.getClicks)
    .post(forceAuth, clickHandler.addClick)
    .delete(forceAuth, clickHandler.resetClicks);
};
