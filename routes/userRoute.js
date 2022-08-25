const express = require('express');
const router = express.Router();

const isAuthorized = require('../middleware/isAuthorized');
const isLoggedIn = require('../middleware/isLoggedIn');

const createGetController = require('../controllers/user/create/get');
const deleteGetController = require('../controllers/user/delete/get');
const editGetController = require('../controllers/user/edit/get');
const indexGetController = require('../controllers/user/index/get');

const createPostController = require('../controllers/user/create/post');
const deletePostController = require('../controllers/user/delete/post');
const editPostController = require('../controllers/user/edit/post');
const restorePostController = require('../controllers/user/restore/post');

router.get(
  '/',
    isLoggedIn,
    isAuthorized,
    indexGetController
);
router.get(
  '/create',
    isLoggedIn,
    isAuthorized,
    createGetController
);
router.get(
  '/delete',
    isLoggedIn,
    isAuthorized,
    deleteGetController
);
router.get(
  '/edit',
    isLoggedIn,
    isAuthorized,
    editGetController
);

router.post(
  '/create',
    isLoggedIn,
    isAuthorized,
    createPostController
);
router.post(
  '/delete',
    isLoggedIn,
    isAuthorized,
    deletePostController
);
router.post(
  '/edit',
    isLoggedIn,
    isAuthorized,
    editPostController
);
router.post(
  '/restore',
    isLoggedIn,
    isAuthorized,
    restorePostController
);

module.exports = router;
