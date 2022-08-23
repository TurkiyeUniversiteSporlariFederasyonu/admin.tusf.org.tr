const mongoose = require('mongoose');
const moment = require('moment-timezone');
const validator = require('validator');

const getBranch = require('./functions/getBranch');

const type_values = ['individual', 'team'];
const gender_values = ['man', 'woman', 'mix'];

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const BranchSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  type: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  subbranches: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  },
  categories: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  },
  gender_categories: {
    type: Array,
    default: [],
    maxlength: gender_values.length
  },
  gold_count: {
    type: Number,
    default: 1,
    min: 1
  },
  silver_count: {
    type: Number,
    default: 1,
    min: 1
  },
  bronze_count: {
    type: Number,
    default: 1,
    min: 1
  },
  team_min_size: {
    type: Number,
    default: null,
    min: 1
  },
  team_max_size: {
    type: Number,
    default: null,
    min: 1
  }
});

BranchSchema.statics.findBranchById = function (id, callback) {
  const Branch = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Branch.findById(mongoose.Types.ObjectId(id.toString()), (err, branch) => {
    if (err) return callback('database_error');
    if (!branch) return callback('document_not_found');

    return callback(null, branch);
  });
};

module.exports = mongoose.model('Branch', BranchSchema);
