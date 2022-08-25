const Activity = require('../../../models/activity/Activity');
const Contest = require('../../../models/contest/Contest');

module.exports = (req, res) => {
  Activity.findActivitiesByFilters({}, (err, activities) => {
    if (err) return res.redirect('/error?message=' + err);

    Contest.findContestByIdAndFormat(req.query.id, (err, contest) => {
      if (err) return res.redirect('/error?message=' + err);
  
      return res.render('contest/edit', {
        page: 'contest/edit',
        title: 'Olimpiyatı Düzenle',
        includes: {
          external: {
            css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
            js: ['ancestorWithClassName', 'dragAndDrop', 'duplicateElement', 'header', 'input', 'page', 'serverRequest']
          }
        },
        url: '/contest/edit',
        manager: req.session.manager,
        contest,
        activities
      });
    });
  });
}
