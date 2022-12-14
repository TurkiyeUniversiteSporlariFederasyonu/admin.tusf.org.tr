const Activity = require('../../../models/activity/Activity');

module.exports = (req, res) => {
  Activity.createActivity(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  });
}
