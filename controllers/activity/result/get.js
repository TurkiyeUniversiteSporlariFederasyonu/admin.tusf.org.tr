const Branch = require('../../../models/branch/Branch');
const University = require('../../../models/university/University');

module.exports = (req, res) => {
  Branch.findBranchesByFilters({}, (err, branches) => {
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
        branches,
        universities,
        gender_names:  {
          male: 'Erkek',
          female: 'Kadın',
          mix: 'Karma'
        },
      });
    });
  });
}
