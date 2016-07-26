'use strict';

var Polls = require('../models/polls.js');

function PollHandler() {
  this.getPolls = function (req, res) {
    Polls
      .find({}, {_id: true, title: true})
      .exec(function (err, result) {
        if (err) {
          throw err;
        }

        res.json(result);
      });
  };

  this.getMyPolls = function (req, res) {
    Polls
      .find({owner: req.user._id}, {_id: true, title: true})
      .exec(function (err, result) {
        if (err) {
          throw err;
        }

        res.json(result);
      });
  };

  this.addPoll = function (req, res) {
    Polls
      .create({owner: req.user._id, title: req.body.title}, function (err, result) {
        if (err) {
          throw err;
        }

        res.redirect('/polls/' + result._id);
      });
  };

  this.getPoll = function (req, res) {
    Polls
      .findOne({_id: req.params.id})
      .exec(function (err, result) {
        if (err) {
          throw err;
        }

        if (!result) {
          res.status(404).end();
          return;
        }

        res.json(result);
      });
  };

  this.deletePoll = function (req, res) {
    Polls
      .findOneAndRemove({_id: req.params.id, owner: req.user._id})
      .exec(function (err) {
        if (err) {
          throw err;
        }

        res.status(200).end();
      });
  };

  this.vote = function (req, res) {
    Polls
      .findOne({_id: req.params.id})
      .exec(function (err, poll) {
        if (err) {
          throw err;
        }

        if (!poll) {
          res.status(404).end();
          return;
        }

        var option = poll.options.id(req.body.option);
        if (!option) {
          res.status(404).end();
          return;
        }

        option.count++;
        poll.save(function (err) {
          if (err) {
            throw err;
          }

          res.redirect('/polls/' + req.params.id);
        });
      });
  };

  this.add = function (req, res) {
    Polls
      .findOne({_id: req.params.id})
      .exec(function (err, poll) {
        if (err) {
          throw err;
        }

        if (!poll) {
          res.status(404).end();
          return;
        }

        var option = poll.options.create({text: req.body.new_option});
        poll.options.push(option);
        poll.save(function (err) {
          if (err) {
            throw err;
          }

          res.redirect('/polls/' + req.params.id);
        });
      });
  };
}

module.exports = PollHandler;
