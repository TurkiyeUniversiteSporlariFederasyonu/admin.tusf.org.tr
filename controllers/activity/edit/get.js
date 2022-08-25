const Branch = require('../../../models/branch/branch');
const University = require('../../../models/university/University');

module.exports = (req, res) => {
  Branch.findBranchesByFilters({}, (err, branches) => {
    if (err) return res.redirect('/error?message=' + err);

    University.findUniversitiesByFilters({}, (err, universities) => {
      if (err) return res.redirect('/error?message=' + err);
  
      Activity.findActivityByIdAndFormat(req.query.id, (err, activity) => {
        if (err) return res.redirect('/error?message=' + err);
      
        return res.render('activity/edit', {
          page: 'activity/edit',
          title: 'Faaliyeti Düzenle',
          includes: {
            external: {
              css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
              js: ['ancestorWithClassName', 'dragAndDrop', 'duplicateElement', 'header', 'input', 'page', 'serverRequest']
            }
          },
          url: '/activity/edit',
          manager: req.session.manager,
          branches,
          universities,
          gender_names:  {
            male: 'Erkek',
            female: 'Kadın',
            mix: 'Karma'
          },
          type_values: ['1. Lig', '2. Lig', 'Grup Müsabakaları', 'Klasman Ligi', 'Playoff', 'Süper Lige Yükselme', 'Süperlig', 'Şenlik', 'Turnuva', 'Türkiye Kupası', 'Türkiye Şampiyonası', 'Kış Spor Oyunları Seçme Müsabakaları'],
          stage_values: ['1. Etap', '2. Etap', '3. Etap', '4. Etap', 'ÜNİLİG', 'ÜNİLİG Finalleri', 'Fetih Sporfest', 'GNÇ Sporfest']
        });
      });
    });
  });
}

