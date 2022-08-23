const Manager = require('../models/manager/Manager');

module.exports = (req, res, next) => {
  if (req.session && req.session.manager) {
    Manager.findManagerByIdAndFormat(req.session.manager._id, (err, manager) => {
      if (err) return res.status(401).redirect('/auth/login');;
      
      req.session.manager = manager;
      return next();
    });
  } else {
    if (req.file && req.file.filename) {
      fs.unlink('./public/res/uploads/' + req.file.filename, () => {
        req.session.redirect = req.originalUrl;
        return res.status(401).redirect('/auth/login');
      });
    } else {
      req.session.redirect = req.originalUrl;
      return res.status(401).redirect('/auth/login');
    }
  };
};
