const Manager = require('../../../../models/manager/Manager');

module.exports = (req, res) => {
  req.query.is_deleted = true;

  Manager.findManagerCountFilters(req.query, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    Manager.findManagersByFilters(req.query, (err, managers) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('admin/manager/delete', {
        page: 'admin/manager/delete',
        title: 'Silinmiş Yöneticiler',
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/admin/manager/delete',
        manager_count: count,
        managers
      });
    });
  });
}
