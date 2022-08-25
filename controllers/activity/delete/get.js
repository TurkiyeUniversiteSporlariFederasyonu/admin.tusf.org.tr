const Activity = require('../../../models/activity/Activity');

module.exports = (req, res) => {
  req.query.is_deleted = true;

  Activity.findActivityCountFilters(req.query, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    Activity.findActivitiesByFilters(req.query, (err, activities) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('activity/delete', {
        page: 'activity/delete',
        title: 'Silinmiş Faaliyetler',
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/activity/delete',
        manager: req.session.manager,
        activity_count: count,
        activities
      });
    });
  });
}
