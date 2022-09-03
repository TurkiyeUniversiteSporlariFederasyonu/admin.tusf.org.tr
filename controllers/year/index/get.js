const Year = require('../../../models/year/Year');

module.exports = (req, res) => {
  Year.findYears((err, years) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('year/index', {
      page: 'year/index',
      title: 'Sezon Ayarları',
      includes: {
        external: {
          css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
          js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
        }
      },
      url: '/year',
      manager: req.session.manager,
      years
    });
  })
};
