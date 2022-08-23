const Manager = require('../../../../models/manager/Manager');

module.exports = (req, res) => {
  Manager.createManager(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  });
}
