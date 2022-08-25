const mongoose = require('mongoose');
const validator = require('validator');

const Branch = require('../branch/Branch');
const University = require('../university/University');

const formatDate = require('./functions/formatDate');
const formatHour = require('./functions/formatHour');
const getActivity = require('./functions/getActivity');

const gender_values = ['male', 'female', 'mix'];
const type_values = ['1. Lig', '2. Lig', 'Grup Müsabakaları', 'Klasman Ligi', 'Playoff', 'Süper Lige Yükselme', 'Süperlig', 'Şenlik', 'Turnuva', 'Türkiye Kupası', 'Türkiye Şampiyonası', 'Kış Spor Oyunları Seçme Müsabakaları'];
const stage_value = ['1. Etap', '2. Etap', '3. Etap', '4. Etap', 'ÜNİLİG', 'ÜNİLİG Finalleri', 'Fetih Sporfest', 'GNÇ Sporfest'];

const DATE_FIELD_LENGTH = 10;
const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  branch_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  season: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  type: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  stage: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  university_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  other_details: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_on_calendar: {
    type: Boolean,
    default: true
  },
  is_without_age_control: {
    type: Boolean,
    default: false
  },
  athlete_count: {
    default: null,
    type: Number
  },
  foreign_athlete_count: {
    default: null,
    type: Number
  },
  start_date: {
    type: String,
    default: null,
    length: DATE_FIELD_LENGTH
  },
  end_date: {
    type: String,
    default: null,
    length: DATE_FIELD_LENGTH
  },
  last_application_date: {
    type: String,
    default: null,
    length: DATE_FIELD_LENGTH
  },
  federation_represantative: {
    type: Object,
    default: {
      name: null,
      phone_number: null
    }
  },
  technique_meeting: {
    type: Object,
    default: {
      date: null,
      hour: null,
      place: null
    }
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

ActivitySchema.statics.createActivity = function (data, callback) {
  const Activity = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  Branch.findBranchById(data.branch_id, (err, branch) => {
    if (err) return callback(err);

    University.findUniversityById(data.university_id, (err, university) => {
      if (err) return callback(err);

      // if (!data.name )
    });
  });
};

ActivitySchema.statics.findActivityByIdAndFormat = function (id, callback) {
  const Activity = this;

  Activity.findActivityById(id, (err, activity) => {
    if (err)
      return callback(err);

    getActivity(activity, (err, activity) => {
      if (err)
        return callback(err);

      return callback(null, activity);
    });
  });
};

module.exports = mongoose.model('Activity', ActivitySchema);
