const Result = require('../../../models/result/Result');

module.exports = (req, res) => {
  Result.createOrUpdateResult(req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
