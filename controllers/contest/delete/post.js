const Contest = require('../../../models/contest/Contest');

module.exports = (req, res) => {
  Contest.findContestByIdAndDelete(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
