const Branch = require('../../../models/branch/Branch');
const Result = require('../../../models/result/Result');

module.exports = (req, res) => {
  req.query.season = '2021 - 2022';
  req.query.by = 'medal';

  Branch.findBranchByIdAndFormat(req.query.branch_id, (err, branch) => {
    if (err) 
      return res.redirect('/error?message=' + err);

    req.query.branch_id = branch._id.toString();

    Result.createAndGetMedalOrderBy(req.query, (err, order) => {
      if (err)
        return res.redirect('/error?message=' + err);
  
      return res.render('statistics/result', {
        page: 'statistics/result',
        title: '2021 - 2022 Madalya Sıralaması',
        includes: {
          external: {
            css: ['confirm', 'bread-cramp', 'header', 'fontawesome', 'general', 'table', 'page', 'text'],
            js: ['confirm', 'ancestorWithClassName', 'header', 'page', 'serverRequest', 'throwError']
          }
        },
        url: '/statistics/result',
        manager: req.session.manager,
        branch,
        order
      });
    });
  });
}
