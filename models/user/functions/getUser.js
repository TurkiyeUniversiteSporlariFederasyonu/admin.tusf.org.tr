module.exports = (user, callback) => {
  if (!user || !user._id)
    return callback('bad_request');

  return callback(null, {
    _id: user._id.toString(),
    email: user.email,
    is_deleted: user.is_deleted
  });
}
