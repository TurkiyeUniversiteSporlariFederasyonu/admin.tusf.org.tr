const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const isSeasonValid = require('../../utils/isSeasonValid');

const University = require('../university/University');

const type_values = ['1. Lig', '2. Lig', 'Grup Müsabakaları', 'Klasman Ligi', 'Playoff', 'Süperlige Yükselme', 'Süperlig', 'Şenlik', 'Turnuva', 'Türkiye Kupası', 'Türkiye Şampiyonası', 'Kış Spor Oyunları Seçme Müsabakaları'];
const stage_values = ['1. Etap', '2. Etap', '3. Etap', '4. Etap', 'ÜNİLİG', 'ÜNİLİG Finalleri', 'Fetih Sporfest', 'GNÇ Sporfest'];

const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;
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
          participation: 1,
          gold: data.gold && !isNaN(parseInt(data.gold)) ? parseInt(data.gold) : 0,
          silver: data.silver && !isNaN(parseInt(data.silver)) ? parseInt(data.silver) : 0,
          bronze: data.bronze && !isNaN(parseInt(data.bronze)) ? parseInt(data.bronze) : 0
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
          participation: 1,
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
}
