const Branch = require('../../../models/branch/Branch');

module.exports = (req, res) => {
  Branch.findBranchCountFilters(req.query, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    Branch.findBranchesByFilters(req.query, (err, branches) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('branch/index', {
        page: 'branch/index',
        title: 'Spor Branşları',
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'list', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/branch',
        manager: req.session.manager,
        branch_count: count,
        branches
      });
    });
  });
}
