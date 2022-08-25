const Activity = require('../../../models/activity/Activity');

module.exports = (req, res) => {
  Activity.findActivityByIdAndRestore(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
