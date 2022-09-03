const Year = require('../../../models/year/Year');

module.exports = (req, res) => {
  Year.findYearByIdAndFormat(req.query.id, (err, year) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('year/edit', {
      page: 'year/edit',
      title: 'Sezon Ayarlarını Güncelle',
      includes: {
        external: {
          css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
          js: ['ancestorWithClassName', 'header', 'input', 'page', 'serverRequest']
        }
      },
      url: '/year/edit',
      manager: req.session.manager,
      year
    });
  });
}
