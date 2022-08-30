const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.findUserByIdAndFormat(req.query.id, (err, user) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('user/password', {
      page: 'user/password',
      title: 'Üniversite Kullanıcısının Şifresini Düzenle',
      includes: {
        external: {
          css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
          js: ['ancestorWithClassName', 'header', 'input', 'page', 'serverRequest']
        }
      },
      url: '/user/password',
      manager: req.session.manager,
      user
    });
  });
}
