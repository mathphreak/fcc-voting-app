'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Option = new Schema({
  text: String,
  count: {type: Number, default: 0}
});

var Poll = new Schema({
  owner: Schema.Types.ObjectId,
  title: String,
  options: [Option]
});

module.exports = mongoose.model('Poll', Poll);
