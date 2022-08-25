const Contest = require('../../../models/contest/Contest');

module.exports = (req, res) => {
  req.query.is_deleted = true;

  Contest.findContestCountFilters(req.query, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    Contest.findContestsByFilters(req.query, (err, contests) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('contest/delete', {
        page: 'contest/delete',
        title: 'Silinmiş Olimpiyatlar',
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/contest/delete',
        manager: req.session.manager,
        contest_count: count,
        contests
      });
    });
  });
}
