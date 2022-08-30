module.exports = (req, res, next) => {
  const manager = req.session.manager;

  const route = req.baseUrl.split('/').join('');
  let path = req.path.split('/').join('');

  if (!path || !path.length)
    path = 'view';
  if (path == 'restore')
    path = 'delete';
  if (path == 'password')
    path = 'edit';

  const role = route + '_' + path;

  if (manager.roles.includes(role))
    return next();

  return res.status(401).redirect('/');
}
