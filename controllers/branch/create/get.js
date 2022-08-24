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

  return res.render('branch/create', {
    page: 'branch/create',
    title: 'Spor Branşı Yarat',
    includes: {
      external: {
        css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
        js: ['ancestorWithClassName', 'dragAndDrop', 'duplicateElement', 'header', 'input', 'page', 'serverRequest']
      }
    },
    url: '/branch/create',
    manager: req.session.manager,
    types,
    genders
  });
}
