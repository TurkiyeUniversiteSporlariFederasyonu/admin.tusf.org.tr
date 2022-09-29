const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const isSeasonValid = require('../../utils/isSeasonValid');

const Activity = require('../activity/Activity');
const Branch = require('../branch/Branch');
const Medal = require('../medal/Medal');
const University = require('../university/University');

const gender_values = ['male', 'female', 'mix'];
const type_values = ['1. Lig', '2. Lig', 'Grup Müsabakaları', 'Klasman Ligi', 'Playoff', 'Süperlige Yükselme', 'Süperlig', 'Şenlik', 'Turnuva', 'Türkiye Kupası', 'Türkiye Şampiyonası', 'Kış Spor Oyunları Seçme Müsabakaları'];
const stage_values = ['1. Etap', '2. Etap', '3. Etap', '4. Etap', 'ÜNİLİG', 'ÜNİLİG Finalleri', 'Fetih Sporfest', 'GNÇ Sporfest'];

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

ResultSchema.statics.findResultsByActivityId = function (activity_id, callback) {
  const Result = this;

  if (!activity_id || !validator.isMongoId(activity_id.toString()))
    return callback('bad_request');

  Result.find({
    activity_id: mongoose.Types.ObjectId(activity_id.toString())
  }, (err, results) => {
    if (err) return callback('database_error');

    return callback(null, results);
  });
}

ResultSchema.statics.createOrUpdateResult = function (data, callback) {
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
        categories: branch.categories
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

            return next(null);
          }),
          (err, order) => {
            if (err) return callback(err);

            const data = {
              activity_id: activity._id,
              subbranch: data.subbranch,
              category: data.category,
              gender: data.gender,
              gold,
              silver,
              bronze,
              order
            };

            Result.findOne({
              activity_id: activity._id,
              subbranch: data.subbranch,
              category: data.category,
              gender: data.gender
            }, (err, result) => {
              if (err) return callback('database_error');

              if (result) {
                console.log(result);

                Result.findByIdAndUpdate(result._id, {$set: {
                  gold,
                  silver,
                  bronze,
                  order
                }}, err => {
                  if (err) return callback('database_error');

                  return callback(null, result._id.toString());
                });
              } else {
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
            });
          }
        );
      });
    });
  });
};

ResultSchema.statics.createAndGetMedalOrderBy = function (data, callback) {
  const Result = this;

  if (!data || !isSeasonValid(data.season))
    return callback('bad_request');

  const filters = {
    season: data.season.trim(),
    type: { $ne: 'Süperlige Yükselme' }
  };

  if (data.branch_id && validator.isMongoId(data.branch_id.toString()))
    filters.branch_id = data.branch_id;

  if (data.type && typeof data.type == 'string' && type_values.includes(data.type))
    filters.type = data.type;

   if (data.type && Array.isArray(data.type) && !data.type.find(each => !type_values.includes(each)))
    filters.type = { $in: data.type };

  if (data.stage && typeof data.stage == 'string' && stage_values.includes(data.stage))
    filters.stage = data.stage;

   if (data.stage && Array.isArray(data.stage) && !data.stage.find(each => !stage_values.includes(each)))
    filters.stage = { $in: data.stage };

  Activity.find(filters, (err, activities) => {
    if (err) return callback('database_error');

    University.findUniversitiesByFilters({}, (err, universities) => {
      if (err) return callback(err);
  
      const order_data = {};
  
      async.timesSeries(
        universities.length,
        (time, next) => {
          order_data[universities[time]._id.toString()] = {
            _id: universities[time]._id.toString(),
            name: universities[time].name,
            gold: 0,
            silver: 0,
            bronze: 0,
            total_participation: 0
          };
  
          return next(null);
        },
        err => {
          if (err) return callback(err);

          const result_filters = {
            activity_id: { $in: activities.map(each => each._id.toString()) }
          };

          if (data.subbranch && typeof data.subbranch == 'string' && data.subbranch.trim().length && data.subbranch.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH)
            result_filters.subbranch = data.subbranch;

          if (data.category && typeof data.category == 'string' && data.category.trim().length && data.category.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH)
            result_filters.category = data.category;
  
          if (data.gender && gender_values.includes(data.gender))
            result_filters.gender = data.gender;
  
          Result.find(result_filters, (err, results) => {
            if (err) return callback(err);
  
            async.timesSeries(
              results.length,
              (time, next) => {
                const result = results[time];

                result.gold.forEach(uni => {
                  order_data[uni].gold += 1;
                });
                result.silver.forEach(uni => {
                  order_data[uni].silver += 1;
                });
                result.bronze.forEach(uni => {
                  order_data[uni].bronze += 1;
                });
  
                return next(null);
              },
              err => {
                if (err) return callback(err);
  
                const order = Object.values(order_data);
  
                if (data.by == 'medal') {
                  order.sort((a, b) => {
                    if (a.gold > b.gold)
                      return -1;
                    else if (b.gold > a.gold)
                      return 1;
                    else {
                      if (a.silver > b.silver)
                        return -1;
                      else if (b.silver > a.silver)
                        return 1;
                      else {
                        if (a.bronze > b.bronze)
                          return -1;
                        else if (b.bronze > a.bronze)
                          return 1;
                        else {
                          return 0; 
                        }
                      }
                    }
                  });
                } else if (data.by == 'participation') {
                  order.sort((a, b) => {
                    if (a.total_participation > b.total_participation)
                      return -1;
                    else if (b.total_participation > a.total_participation)
                      return 1;
                    else
                      return 0;
                  });
                } else {
                  return callback('bad_request');
                }
  
                return callback(null, order);
              }
            );
          });
        }
      );
    });
  });
};

module.exports = mongoose.model('Result', ResultSchema);
