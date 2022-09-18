const Activity = require('../../../models/activity/Activity');
const Result = require('../../../models/result/Result');

module.exports = (req, res) => {
  Activity.findActivityByOldId(req.body.old_id, (err, activity) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    req.body.activity_id = activity._id;

    Result.createResult(req.body, err => {
      console.log(err)
      if (err) {
        res.write(JSON.stringify({ error: err, success: false }));
        return res.end();
      }

      res.write(JSON.stringify({ success: true }));
      return res.end();
    });
  });
}
