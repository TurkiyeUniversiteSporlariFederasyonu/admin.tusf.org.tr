const Activity = require('../../../models/activity/Activity');

module.exports = (req, res) => {
  Activity.findActivitiesByFilters({}, (err, activities) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('contest/create', {
      page: 'contest/create',
      title: 'Olimpiyat Yarat',
      includes: {
        external: {
          css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
          js: ['ancestorWithClassName', 'dragAndDrop', 'duplicateElement', 'header', 'input', 'page', 'serverRequest']
        }
      },
      url: '/contest/create',
      manager: req.session.manager,
      activities
    });
  });
}
