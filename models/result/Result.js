const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Activity = require('../activity/Activity');
const Branch = require('../branch/Branch');
const Medal = require('../medal/Medal');
const University = require('../university/University');

const gender_values = ['male', 'female', 'mix'];

const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const ResultSchema = new Schema({
  activity_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  subbranch: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  category: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  gender: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  gold: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  },
  silver: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  },
  bronze: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  },
  order: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  }
});

ResultSchema.statics.findResultById = function (id, callback) {
  const Result = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Result.findById(mongoose.Types.ObjectId(id.toString()), (err, result) => {
    if (err) return callback('database_error');
    if (!result) return callback('document_not_found');

    return callback(null, result);
  });
};

ResultSchema.statics.createResult = function (data, callback) {
  const Result = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.subbranch || typeof data.subbranch != 'string' || !data.subbranch.trim().length || data.subbranch.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    data.subbranch = null;
  else
    data.subbranch = data.subbranch.trim();

  if (!data.category || typeof data.category != 'string' || !data.category.trim().length || data.category.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    data.category = null;
  else
    data.category = data.category.trim();

  if (!data.gender || !gender_values.includes(data.gender))
    return callback('bad_request');

  if (!data.order || !Array.isArray(data.order) || !data.order.length || data.order.find(each => !validator.isMongoId(each.toString())))
    return callback('bad_request');

  Activity.findActivityById(data.activity_id, (err, activity) => {
    if (err) return callback('bad_request');

    Branch.findBranchById(activity.branch_id, (err, branch) => {
      if (err) return callback(err);

      if (data.subbranch && !branch.subbranches.includes(data.subbranch))
        branch.subbranches.push(data.subbranch);

      if (data.category && !branch.categories.includes(data.category))
        branch.categories.push(data.category);

      Branch.findBranchByIdAndUpdate(branch._id, {
        subbranches: branch.subbranches,
        categories: branch.categories,
      }, err => {
        if (err) return callback(err);

        const gold = [], silver = [], bronze = [];

        async.timesSeries(
          data.order.length,
          (time, next) => University.findUniversityById(data.order[time], (err, university) => {
            if (err) return next(err);

            if (time < branch.gold_count)
              gold.push(university._id.toString());
            else if (time < branch.gold_count + branch.silver_count)
              silver.push(university._id.toString());
            else if (time < branch.gold_count + branch.silver_count + branch.bronze_count)
              bronze.push(university._id.toString());

            Medal.findOrCreateMedalAndIncreaseCount({
              season: activity.season,
              university_id: university._id,
              type: activity.type,
              stage: activity.stage,
              gold: gold.includes(university._id.toString()),
              silver: silver.includes(university._id.toString()),
              bronze: bronze.includes(university._id.toString())
            }, err => {
              if (err) return next(err);

              return next(null, university._id.toString());
            });
          }),
          (err, order) => {
            if (err) return callback(err);

            const newResultData = {
              activity_id: activity._id,
              subbranch: data.subbranch,
              category: data.category,
              gender: data.gender,
              gold,
              silver,
              bronze,
              order
            };

            const newResult = new Result(newResultData);

            newResult.save((err, result) => {
              if (err) return callback('database_error');

              return callback(null, result._id.toString());
            });
          }
        );
      });
    });
  });
};

module.exports = mongoose.model('Result', ResultSchema);
