const Manager = require('../../../models/manager/Manager');

module.exports = (req, res) => {
  Manager.findManagerByIdAndPasswordVerificationTokenAndUpdatePassword(req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
