const User = require('../../../models/user/User');

module.exports = (req, res) => {
  req.query.is_deleted = true;

  User.findUserCountFilters(req.query, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    User.findUsersByFilters(req.query, (err, users) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('user/delete', {
        page: 'user/delete',
        title: 'Silinmiş Üniversite Kullanıcıları',
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/user/delete',
        manager: req.session.manager,
        user_count: count,
        users
      });
    });
  });
}
