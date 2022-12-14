module.exports = (req, res) => {
  return res.render('auth/login', {
    page: 'auth/login',
    title: 'Giriş Yap',
    includes: {
      external: {
        css: ['form', 'general', 'input', 'page', 'text'],
        js: ['page', 'serverRequest']
      }
    }
  });
}
