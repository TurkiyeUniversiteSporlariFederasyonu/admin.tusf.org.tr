module.exports = (req, res) => {
  return res.render('admin/index', {
    page: 'admin/index',
    title: 'Admin Sayfası',
    includes: {
      external: {
        css: ['header', 'general', 'page'],
        js: ['ancestorWithClassName', 'header']
      }
    },
    url: '/admin'
  });
}
