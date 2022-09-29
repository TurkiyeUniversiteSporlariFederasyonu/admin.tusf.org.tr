const Activity = require('../../../models/activity/Activity');
const University = require('../../../models/university/University');
const Result = require('../../../models/result/Result');

module.exports = (req, res) => {
  Activity.findActivityByIdAndFormat(req.query.id, (err, activity) => {
    if (err) return res.redirect('/error?message=' + err);

    Result.findResultsByActivityId(activity._id, (err, results) => {
      if (err) return res.redirect('/error?message=' + err);

      University.findUniversitiesByFilters({}, (err, universities) => {
        if (err) return res.redirect('/error?message=' + err);
  
        return res.render('activity/result', {
          page: 'activity/result',
          title: 'Sonuç Gir',
          includes: {
            external: {
              css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
              js: ['ancestorWithClassName', 'header', 'input', 'page', 'serverRequest']
            }
          },
          url: '/activity/result',
          manager: req.session.manager,
          activity,
          results,
          universities,
          gender_names:  {
            male: 'Erkek',
            female: 'Kadın',
            mix: 'Karma'
          }
        });
      });
    });
  });
};
