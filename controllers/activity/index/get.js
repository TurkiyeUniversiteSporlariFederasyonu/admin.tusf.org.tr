const isSeasonValid = require('../../../utils/isSeasonValid');
const getCurrentSeason = require('../../../utils/getCurrentSeason');

const Activity = require('../../../models/activity/Activity');

module.exports = (req, res) => {
  if (!isSeasonValid(req.query.season))
    req.query.season = getCurrentSeason();

  Activity.findActivityCountFilters(req.query, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    Activity.findActivitiesByFilters(req.query, (err, activities) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('activity/index', {
        page: 'activity/index',
        title: 'Faaliyetler ' + req.query.season,
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/activity',
        manager: req.session.manager,
        activity_count: count,
        season: req.query.season,
        activities
      });
    });
  });
}
