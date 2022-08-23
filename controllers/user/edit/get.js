const University = require('../../../models/university/University');
const User = require('../../../models/user/User');

module.exports = (req, res) => {
  University.findUniversitiesByFilters({}, (err, universities) => {
    if (err) return res.redirect('/error?message=' + err);

    User.findUserByIdAndFormat(req.query.id, (err, user) => {
      if (err) return res.redirect('/error?message=' + err);
  
      return res.render('user/edit', {
        page: 'user/edit',
        title: 'Üniversite Kullanıcısını Düzenle',
        includes: {
          external: {
            css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
            js: ['ancestorWithClassName', 'header', 'input', 'page', 'serverRequest']
          }
        },
        url: '/user/edit',
        manager: req.session.manager,
        user,
        universities
      });
    });
  });
}
