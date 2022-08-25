const Contest = require('../../../models/contest/Contest');

module.exports = (req, res) => {
  Contest.findContestCountFilters(req.query, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    Contest.findContestsByFilters(req.query, (err, contests) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('contest/index', {
        page: 'contest/index',
        title: 'Üniversite Kullanıcıları',
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/contest',
        manager: req.session.manager,
        contest_count: count,
        contests
      });
    });
  });
}
