const mongoose = require('mongoose');
const moment = require('moment-timezone');
const validator = require('validator');

const Activity = require('../activity/Activity');

const getContest = require('./functions/getContest');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const ContestSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  university_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  activity_id_list: {
    type: Array,
    default: []
  }
});

ContestSchema.statics.findContestById = function (id, callback) {
  const Contest = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Contest.findById(mongoose.Types.ObjectId(id.toString()), (err, contest) => {
    if (err) return callback('database_error');
    if (!contest) return callback('document_not_found');

    return callback(null, contest);
  });
};

module.exports = mongoose.model('Contest', ContestSchema);
