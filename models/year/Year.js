const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getCurrentSeason = require('../../utils/getCurrentSeason');

const getYear = require('./functions/getYear');

const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const YearSchema = new Schema({
  season: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  participation_update_start_date: {
    type: Date,
    default: null
  },
  participation_update_end_date: {
    type: Date,
    default: null
  }
});

YearSchema.statics.findYearById = function (id, callback) {
  const Year = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Year.findById(mongoose.Types.ObjectId(id.toString()), (err, year) => {
    if (err) return callback('database_error');
    if (!year) return callback('document_not_found');

    return callback(null, year);
  });
};

YearSchema.statics.findYearByIdAndFormat = function (id, callback) {
  const Year = this;

  Year.findYearById(id, (err, year) => {
    if (err)
      return callback(err);

    getYear(year, (err, year) => {
      if (err)
        return callback(err);

      return callback(null, year);
    });
  });
};

YearSchema.statics.findCurrentYear = function (callback) {
  const Year = this;

  Year.findOne({
    season: getCurrentSeason()
  }, (err, year) => {
    if (err) return callback('database_error');

    if (year) {
      Year.findYearByIdAndFormat(year._id, (err, year) => {
        if (err) return callback(err);
  
        return callback(null, year);
      });
    } else {
      const newYearData = {
        season: getCurrentSeason()
      };

      const newYear = new Year(newYearData);

      newYear.save((err, year) => {
        if (err) return callback('database_error');

        Year.findYearByIdAndFormat(year._id, (err, year) => {
          if (err) return callback(err);
    
          return callback(null, year);
        });
      });
    }
  });
};

YearSchema.statics.findYears = function (callback) {
  const Year = this;

  Year.findCurrentYear((err, _year) => {
    if (err) return callback(err);

    Year
      .find()
      .sort({ _id: -1 })
      .then(years => async.timesSeries(
        years.length,
        (time, next) => Year.findYearByIdAndFormat(years[time]._id, (err, year) => {
          if (err) return next(err);
    
          return next(null, year);
        }),
        (err, years) => {
          if (err) return callback(err);

          return callback(null, years);
        }
      ))
      .catch(err => callback('database_error'));
  });
};

YearSchema.statics.findYearByIdAndUpdate = function (id, data, callback) {
  const Year = this;

  Year.findYearById(id, (err, year) => {
    if (err) return callback(err);

    Year.findByIdAndUpdate(year._id, {$set: {
      participation_update_start_date: data.participation_update_start_date && !isNaN(new Date(data.participation_update_start_date.toString())) ? new Date(data.participation_update_start_date) : year.participation_update_start_date,
      participation_update_end_date: data.participation_update_end_date && !isNaN(new Date(data.participation_update_end_date.toString())) ? new Date(data.participation_update_end_date) : year.participation_update_end_date,
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

if (!mongoose.models.Year)
  mongoose.model('Year', YearSchema);

module.exports = mongoose.models.Year;
