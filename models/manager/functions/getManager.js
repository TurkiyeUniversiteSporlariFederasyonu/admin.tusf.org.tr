module.exports = (manager, callback) => {
  if (!manager || !manager._id)
    return callback('bad_request');

  return callback(null, {
    _id: manager._id.toString(),
    email: manager.email,
    name: manager.name,
    roles: manager.roles,
    is_deleted: manager.is_deleted
  });
}
