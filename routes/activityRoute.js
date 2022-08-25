const express = require('express');
const router = express.Router();

const isAuthorized = require('../middleware/isAuthorized');
const isLoggedIn = require('../middleware/isLoggedIn');

const createGetController = require('../controllers/activity/create/get');
const deleteGetController = require('../controllers/activity/delete/get');
const editGetController = require('../controllers/activity/edit/get');
const indexGetController = require('../controllers/activity/index/get');

const createPostController = require('../controllers/activity/create/post');
const deletePostController = require('../controllers/activity/delete/post');
const editPostController = require('../controllers/activity/edit/post');
const restorePostController = require('../controllers/activity/restore/post');

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
