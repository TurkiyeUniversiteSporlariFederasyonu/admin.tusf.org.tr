const Manager = require('../../../../models/manager/Manager');

module.exports = (req, res) => {
  Manager.findManagerByIdAndDelete(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
