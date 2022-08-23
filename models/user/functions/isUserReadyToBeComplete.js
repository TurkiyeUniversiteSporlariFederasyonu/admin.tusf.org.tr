const User = require('../User');

module.exports = (id, callback) => {
  User.findUserById(id, (err, user) => {
    if (err)
      return callback(err);

    if (user.logo && user.short_name && user.city)
      return callback(null, true);
    
    return callback(null, false);
  });
}
