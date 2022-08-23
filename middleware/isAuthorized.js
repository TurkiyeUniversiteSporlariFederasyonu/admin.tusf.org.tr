module.exports = (req, res, next) => {
  const manager = req.session.manager;

  const route = req.baseUrl.split('/').join('');
  const path = req.path.split('/').join('');

  const role = route + '_' + (path && path.length ? path : 'view');

  if (manager.roles.includes(role))
    return next();

  return res.status(401).redirect('/');
}
