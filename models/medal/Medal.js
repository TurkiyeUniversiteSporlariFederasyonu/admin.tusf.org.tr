const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const isSeasonValid = require('../../utils/isSeasonValid');

const University = require('../university/University');

const type_values = ['1. Lig', '2. Lig', 'Grup Müsabakaları', 'Klasman Ligi', 'Playoff', 'Süperlige Yükselme', 'Süperlig', 'Şenlik', 'Turnuva', 'Türkiye Kupası', 'Türkiye Şampiyonası', 'Kış Spor Oyunları Seçme Müsabakaları'];
const stage_values = ['1. Etap', '2. Etap', '3. Etap', '4. Etap', 'ÜNİLİG', 'ÜNİLİG Finalleri', 'Fetih Sporfest', 'GNÇ Sporfest'];

const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const MedalSchema = new Schema({
  season: {
    type: String,
    required: true,
    index: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  university_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  stage: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  gold: {
    type: Number,
    default: 0
  },
  silver: {
    type: Number,
    default: 0
  },
  bronze: {
    type: Number,
    default: 0
  },
  total_participation: {
    type: Number,
    default: 0
  }
});

MedalSchema.statics.findMedalById = function (id, callback) {
  const Medal = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Medal.findById(mongoose.Types.ObjectId(id.toString()), (err, result) => {
    if (err) return callback('database_error');
    if (!result) return callback('document_not_found');

    return callback(null, result);
  });
};

MedalSchema.statics.findOrCreateMedalAndIncreaseCount = function (data, callback) {
  const Medal = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!isSeasonValid(data.season))
    return callback('bad_request');

  if (!data.type || !type_values.includes(data.type))
    data.type = null;

  if (!data.stage || !stage_values.includes(data.stage))
    data.stage = null;

  University.findUniversityById(data.university_id, (err, university) => {
    if (err) return callback('err');

    Medal.findOne({
      season: data.season.trim(),
      university_id: university._id,
      type: data.type,
      stage: data.stage
    }, (err, medal) => {
      if (err) return callback('database_error');

      if (medal) {
        Medal.findByIdAndUpdate(medal._id, {$inc: {
          total_participation: 1,
          gold: data.gold && !isNaN(parseInt(data.gold)) ? 1 : 0,
          silver: data.silver && !isNaN(parseInt(data.silver)) ? 1 : 0,
          bronze: data.bronze && !isNaN(parseInt(data.bronze)) ? 1 : 0
        }}, err => {
          if (err) return callback('database_error');

          return callback(null)
        });
      } else {
        const newMedalData = {
          season: data.season.trim(),
          university_id: university._id,
          type: data.type,
          stage: data.stage,
          total_participation: 1,
          gold: data.gold ? 1 : 0,
          silver: data.silver ? 1 : 0,
          bronze: data.bronze ? 1 : 0,
        };

        const newMedal = new Medal(newMedalData);

        newMedal.save(err => {
          if (err) return callback('database_error');

          return callback(null);
        })
      }
    })
  })
};

MedalSchema.statics.createAndGetMedalOrderBy = function (data, callback) {
  const Medal = this;

  if (!data || !isSeasonValid(data.season))
    return callback('bad_request');

  const filters = {
    season: data.season.trim()
  };

  if (data.type && typeof data.type == 'string' && type_values.includes(data.type))
    filters.type = data.type;

   if (data.type && Array.isArray(data.type) && !data.type.find(each => !type_values.includes(each)))
    filters.type = { $in: data.type };

  if (data.stage && typeof data.stage == 'string' && stage_values.includes(data.stage))
    filters.stage = data.stage;

   if (data.stage && Array.isArray(data.stage) && !data.stage.find(each => !stage_values.includes(each)))
    filters.stage = { $in: data.stage };

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


        Medal.find(filters, (err, medals) => {
          if (err) return callback(err);

          async.timesSeries(
            medals.length,
            (time, next) => {
              const medal = medals[time];

              order_data[medal.university_id.toString()].gold += medal.gold;
              order_data[medal.university_id.toString()].silver += medal.silver;
              order_data[medal.university_id.toString()].bronze += medal.bronze;
              order_data[medal.university_id.toString()].total_participation += medal.total_participation;

              return next(null);
            },
            err => {
              if (err) return callback(err);

              const order = Object.values(order_data);

              if (data.by == 'medal') {
                order.sort((a, b) => {
                  if (a.gold > b.gold)
                    return 1;
                  else if (b.gold > a.gold)
                    return -1;
                  else {
                    if (a.silver > b.silver)
                      return 1;
                    else if (b.silver > a.silver)
                      return -1;
                    else {
                      if (a.bronze > b.bronze)
                        return 1;
                      else if (b.bronze > a.bronze)
                        return -1;
                      else {
                        return 0; 
                      }
                    }
                  }
                });
              } else if (data.by == 'participation') {
                order.sort((a, b) => {
                  if (a.total_participation > b.total_participation)
                    return 1;
                  else if (b.total_participation > a.total_participation)
                    return -1;
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
};

module.exports = mongoose.model('Medal', MedalSchema);
