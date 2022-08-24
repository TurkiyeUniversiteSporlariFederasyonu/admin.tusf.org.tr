const Branch = require('../../../models/branch/Branch');

module.exports = (req, res) => {
  const types = {
    individual: 'Bireysel',
    team: 'Takım'
  };
  const genders = {
    mix: 'Karma',
    female: 'Sadece Kadın',
    male: 'Sadece Erkek'
  };

  Branch.findBranchByIdAndFormat(req.query.id, (err, branch) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('branch/edit', {
      page: 'branch/edit',
      title: 'Spor Branşını Düzenle',
      includes: {
        external: {
          css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
          js: ['ancestorWithClassName', 'dragAndDrop', 'duplicateElement', 'header', 'input', 'page', 'serverRequest']
        }
      },
      url: '/branch/edit',
      manager: req.session.manager,
      branch,
      types,
      genders
    });
  });
}
