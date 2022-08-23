const University = require('../../../models/university/University');

module.exports = (req, res) => {
  University.findUniversityCountFilters(req.query, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    University.findUniversitiesByFilters(req.query, (err, universities) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('university/index', {
        page: 'university/index',
        title: 'Üniversiteler',
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/university',
        manager: req.session.manager,
        university_count: count,
        universities
      });
    });
  });
}
