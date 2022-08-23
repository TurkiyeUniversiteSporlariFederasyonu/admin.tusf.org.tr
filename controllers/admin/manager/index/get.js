const Manager = require('../../../../models/manager/Manager');

module.exports = (req, res) => {
  Manager.findManagerCountFilters(req.query, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    Manager.findManagersByFilters(req.query, (err, managers) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('admin/manager/index', {
        page: 'admin/manager/index',
        title: 'Yöneticiler',
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/admin/manager',
        manager_count: count,
        managers
      });
    });
  });
}
