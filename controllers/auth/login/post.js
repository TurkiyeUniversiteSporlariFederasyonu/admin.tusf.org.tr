const Manager = require('../../../models/manager/Manager');

module.exports = (req, res) => {
  Manager.findManagerByEmailAndVerifyPassword(req.body, (err, manager) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    Manager.findManagerByIdAndFormat(manager._id, (err, manager) => {
      if (err) {
        res.write(JSON.stringify({ error: err, success: false }));
        return res.end();
      }

      req.session.manager = manager;

      res.write(JSON.stringify({ redirect: req.session.redirect, success: true }));
      return res.end();
    });
  });
}
