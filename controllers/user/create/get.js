const University = require('../../../models/university/University');

module.exports = (req, res) => {
  University.findUniversitiesByFilters({}, (err, universities) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('user/create', {
      page: 'user/create',
      title: 'Üniversite Kullanıcısı Yarat',
      includes: {
        external: {
          css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
          js: ['ancestorWithClassName', 'header', 'input', 'page', 'serverRequest']
        }
      },
      url: '/user/create',
      manager: req.session.manager,
      universities
    });
  });
}
