const Branch = require('../../../models/branch/Branch');

module.exports = (req, res) => {
  Branch.findBranchesByFilters({}, (err, branches) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('statistics/index', {
      page: 'statistics/index',
      title: '2021 - 2022 Medalya Sıralaması Branş Seçimi',
      includes: {
        external: {
          css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
          js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
        }
      },
      url: '/statistics',
      manager: req.session.manager,
      branches
    });
  })
}
