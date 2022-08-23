const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/login/get');
const logoutGetController = require('../controllers/admin/logout/get');

const managerCreateGetController = require('../controllers/admin/manager/create/get');
const managerDeleteGetController = require('../controllers/admin/manager/delete/get');
const managerEditGetController = require('../controllers/admin/manager/edit/get');
const managerIndexGetController = require('../controllers/admin/manager/index/get');

const loginPostController = require('../controllers/admin/login/post');

const managerCreatePostController = require('../controllers/admin/manager/create/post');
const managerDeletePostController = require('../controllers/admin/manager/delete/post');
const managerEditPostController = require('../controllers/admin/manager/edit/post');
const managerRestorePostController = require('../controllers/admin/manager/restore/post');


router.get(
  '/',
    isAdmin,
    indexGetController
);
router.get(
  '/login',
    loginGetController
);
router.get(
  '/logout',
    isAdmin,
    logoutGetController
);

router.get(
  '/manager',
    isAdmin,
    managerIndexGetController
);
router.get(
  '/manager/create',
    isAdmin,
    managerCreateGetController
);
router.get(
  '/manager/delete',
    isAdmin,
    managerDeleteGetController
);
router.get(
  '/manager/edit',
    isAdmin,
    managerEditGetController
);

router.post(
  '/login',
    loginPostController
);

router.post(
  '/manager/create',
    isAdmin,
    managerCreatePostController
);
router.post(
  '/manager/delete',
    isAdmin,
    managerDeletePostController
);
router.post(
  '/manager/edit',
    isAdmin,
    managerEditPostController
);
router.post(
  '/manager/restore',
    isAdmin,
    managerRestorePostController
);

module.exports = router;
