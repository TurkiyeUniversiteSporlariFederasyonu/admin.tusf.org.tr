const Medal = require('../../../models/medal/Medal');

module.exports = (req, res) => {
  req.query.season = '2021 - 2022';
  req.query.by = 'medal';

  Medal.createAndGetMedalOrderBy(req.query, (err, order) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('statistics/medal', {
      page: 'statistics/medal',
      title: '2021 - 2022 Medalya Sıralaması',
      includes: {
        external: {
          css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'table', 'page', 'text'],
          js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
        }
      },
      url: '/statistics/medal',
      manager: req.session.manager,
      order
    });
  });
}
