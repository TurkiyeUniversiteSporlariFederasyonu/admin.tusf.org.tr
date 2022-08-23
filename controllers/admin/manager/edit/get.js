const Manager = require('../../../../models/manager/Manager');

module.exports = (req, res) => {
  const roles_values = {
    'activity_view': 'Faaliyetleri Görme',
    'activity_create': 'Faaliyet Yaratma',
    'activity_edit': 'Faaliyet Düzenleme',
    'activity_delete': 'Faaliyet Silme',
    'branch_view': 'Branşları Görme',
    'branch_create': 'Branş Yaratma',
    'branch_edit': 'Branş Düzenleme',
    'branch_delete': 'Branş Silme',
    'contest_view': 'Olimpiyatları Görme', 
    'contest_create': 'Olimpiyat Yaratma',
    'contest_edit': 'Olimpiyat Düzenleme',
    'contest_delete': 'Olimpiyat Silme',
    'student_view': 'Öğrencileri Görme',
    'university_view': 'Üniversiteleri Görme',
    'university_create': 'Üniversite Yaratma',
    'university_edit': 'Üniversite Düzenleme',
    'university_delete': 'Üniversite Silme',
    'user_view': 'Üniversite Kullanıcılarını Görme',
    'user_create': 'Üniversite Kullanıcısı Ekleme',
    'user_edit': 'Üniversite Kullanıcısı Düzenleme',
    'user_delete': 'Üniversite Kullanıcısı Silme',
  };

  Manager.findManagerByIdAndFormat(req.query.id, (err, manager) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/manager/edit', {
      page: 'admin/manager/edit',
      title: 'Federasyon Kullanıcısını Düzenle',
      includes: {
        external: {
          css: ['bread-cramp', 'form', 'header', 'fontawesome', 'general', 'input', 'page', 'text'],
          js: ['ancestorWithClassName', 'header', 'input', 'page', 'serverRequest']
        }
      },
      url: '/admin/manager/edit',
      manager,
      roles_values
    });
  });
}
