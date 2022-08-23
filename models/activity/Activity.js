const mongoose = require('mongoose');
const moment = require('moment-timezone');
const validator = require('validator');

const Branch = require('../branch/Branch');

const getActivity = require('./functions/getActivity');

const type_values = ['individual', 'team'];
const gender_values = ['male', 'female', 'mix'];

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  branch_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  season: {
    type: String,
    required: true
  },
  type: {

  }
});

ActivitySchema.statics.findActivityById = function (id, callback) {
  const Activity = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Activity.findById(mongoose.Types.ObjectId(id.toString()), (err, activity) => {
    if (err) return callback('database_error');
    if (!activity) return callback('document_not_found');

    return callback(null, activity);
  });
};

module.exports = mongoose.model('Activity', ActivitySchema);
