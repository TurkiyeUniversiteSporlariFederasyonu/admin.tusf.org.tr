const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const sendMail = require('../../utils/sendMail');

const generateRandomHex = require('./functions/generateRandomHex');
const getManager = require('./functions/getManager');
const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const TEN_MINS_IN_MS = 10 * 60 * 1000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_ITEM_COUNT_PER_QUERY = 100;
const MIN_PASSWORD_LENGTH = 8;
const SECURE_STRING_LENGTH = 32;

const roles_values = [
  'activity_view', 'activity_create', 'activity_edit', 'activity_delete',
  'branch_view', 'branch_create', 'branch_edit', 'branch_delete',
  'contest_view', 'contest_create', 'contest_edit', 'contest_delete',
  'student_view', 'student_create', 'student_edit', 'student_delete',
  'university_view', 'university_create', 'university_edit', 'university_delete',
  'user_view', 'user_create', 'user_edit', 'user_delete',
  'year_view', 'year_edit'
];

const Schema = mongoose.Schema;

const ManagerSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  roles: {
    type: Array,
    default: [],
    maxlength: roles_values.length
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  password_update_verification_token: {
    type: String,
    default: null,
    length: SECURE_STRING_LENGTH
  },
  password_update_last_verification_time_in_unix: {
    type: Number,
    default: null
  }
});

ManagerSchema.pre('save', hashPassword);

ManagerSchema.statics.findManagerById = function (id, callback) {
  const Manager = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Manager.findById(mongoose.Types.ObjectId(id.toString()), (err, manager) => {
    if (err) return callback('database_error');
    if (!manager) return callback('document_not_found');

    return callback(null, manager);
  });
};

ManagerSchema.statics.findManagerByEmailAndVerifyPassword = function (data, callback) {
  const Manager = this;

  if (!data || !data.email || !validator.isEmail(data.email) || !data.password)
    return callback('bad_request');

  Manager.findOne({
    email: data.email.trim()
  }, (err, manager) => {
    if (err) return callback('database_error');
    if (!manager) return callback('document_not_found');

    if (manager.is_deleted)
      return callback('not_authenticated_request');

    verifyPassword(data.password.trim(), manager.password, res => {
      if (!res) return callback('password_verification');

      return callback(null, manager);
    });
  });
};

ManagerSchema.statics.createManager = function (data, callback) {
  const Manager = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.email || !validator.isEmail(data.email.toString()))
    return callback('bad_request');

  if (!data.name || typeof data.name != 'string' || !data.name.trim().length || data.name.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  const roles = [];

  if (data.roles && Array.isArray(data.roles))
    for (let i = 0; i < data.roles.length; i++)
      if (roles_values.includes(data.roles[i]) && !roles.includes(data.roles[i]))
        roles.push(data.roles[i]);

  const newManagerData = {
    email: data.email.trim(),
    name: data.name.trim(),
    password: generateRandomHex(MIN_PASSWORD_LENGTH),
    roles
  };

  const newManager = new Manager(newManagerData);

  newManager.save((err, manager) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    return callback(null, manager._id.toString());
  });
};

ManagerSchema.statics.findManagerByIdAndFormat = function (id, callback) {
  const Manager = this;

  Manager.findManagerById(id, (err, manager) => {
    if (err)
      return callback(err);

    getManager(manager, (err, manager) => {
      if (err)
        return callback(err);

      return callback(null, manager);
    });
  });
};

ManagerSchema.statics.findManagerByEmailAndGeneratePasswordVerificationToken = function (email, callback) {
  const Manager = this;

  if (!email || !validator.isEmail(email.toString()))
    return callback('bad_request');

  Manager.findOne({
    email: email.toString().trim()
  }, (err, manager) => {
    if (err)
      return callback('bad_request');
    if (!manager)
      return callback('document_not_found')

    Manager.findByIdAndUpdate(manager._id, {$set: {
      password_update_verification_token: generateRandomHex(SECURE_STRING_LENGTH),
      password_update_last_verification_time_in_unix: parseInt((new Date()).getTime()) + TEN_MINS_IN_MS
    }}, { new: true }, (err, manager) => {
      if (err)
        return callback('database_error');

      sendMail({
        to: manager.email,
        type: 'password_update_request',
        _id: manager._id.toString(),
        email: manager.email,
        token: manager.password_update_verification_token
      }, err => {
        if (err)
          return callback(err);

        return callback(null);
      });
    });
  });
};

ManagerSchema.statics.findManagerByIdAndPasswordVerificationTokenAndUpdatePassword = function (data, callback) {
  const Manager = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.password || typeof data.password != 'string' || data.password.trim().length < MIN_PASSWORD_LENGTH)
    return callback('bad_request');

  Manager.findManagerById(data._id, (err, manager) => {
    if (err)
      return callback(err);

    if (manager.password_update_last_verification_time_in_unix < parseInt((new Date()).getTime()))
      return callback('request_timeout');

    if (!data.password_update_verification_token || data.password_update_verification_token.toString() != manager.password_update_verification_token)
      return callback('not_authenticated_request');

    manager.password = data.password.trim();

    manager.save(err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

ManagerSchema.statics.findManagerByIdAndUpdate = function (id, data, callback) {
  const Manager = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  Manager.findManagerById(id, (err, manager) => {
    if (err)
      return callback(err);

    const roles = [];

    if (data.roles && Array.isArray(data.roles))
      for (let i = 0; i < data.roles.length; i++)
        if (roles_values.includes(data.roles[i]) && !roles.includes(data.roles[i]))
          roles.push(data.roles[i]);

    Manager.findByIdAndUpdate(manager._id, {$set: {
      name: data.name && typeof data.name == 'string' && data.name.trim().length && data.name.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.name.trim() : manager.name,
      roles
    }}, err => {
      if (err)
        return callback('database_error');

      return callback(null);
    });
  });
};

ManagerSchema.statics.findManagerCountFilters = function (data, callback) {
  const Manager = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {};

  if (data.is_deleted)
    filters.is_deleted = true;
  else
    filters.is_deleted = { $ne: true };

  if (data.email && typeof data.email == 'string')
    filters.email = data.email.trim();

  Manager
    .find(filters)
    .countDocuments()
    .then(number => callback(null, number))
    .catch(err => callback('database_error'));
};

ManagerSchema.statics.findManagersByFilters = function (data, callback) {
  const Manager = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {};
  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) > 0 && parseInt(data.limit) < MAX_ITEM_COUNT_PER_QUERY ? parseInt(data.limit) : MAX_ITEM_COUNT_PER_QUERY;
  const skip = data.page && !isNaN(parseInt(data.page)) ? parseInt(data.page) * limit : 0;

  if (data.is_deleted)
    filters.is_deleted = true;
  else
    filters.is_deleted = { $ne: true };

  if (data.email && typeof data.email == 'string')
    filters.email = data.email.trim();

  Manager
    .find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ name: 1 })
    .then(managers => async.timesSeries(
      managers.length,
      (time, next) => Manager.findManagerByIdAndFormat(managers[time]._id, (err, manager) => next(err, manager)),
      (err, managers) => {
        if (err) return callback(err);

        return callback(null, managers);
      }
    ))
    .catch(err =>  callback('database_error'));
};

ManagerSchema.statics.findManagerByIdAndDelete = function (id, callback) {
  const Manager = this;

  Manager.findManagerById(id, (err, manager) => {
    if (err) return callback(err);

    if (manager.is_deleted)
      return callback(null);

    Manager.findByIdAndUpdate(manager._id, {$set: {
      email: manager.email + '_' + manager._id.toString(),
      is_deleted: true
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

ManagerSchema.statics.findManagerByIdAndRestore = function (id, callback) {
  const Manager = this;

  Manager.findManagerById(id, (err, manager) => {
    if (err) return callback(err);

    if (!manager.is_deleted)
      return callback(null);

    Manager.findByIdAndUpdate(manager._id, {$set: {
      email: manager.email.replace('_' + manager._id.toString(), ''),
      is_deleted: false
    }}, err => {
      if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE) return callback('duplicated_unique_field');
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

module.exports = mongoose.model('Manager', ManagerSchema);
