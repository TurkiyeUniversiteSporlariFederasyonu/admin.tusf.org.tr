const express = require('express');
const router = express.Router();

const isAuthorized = require('../middleware/isAuthorized');
const isLoggedIn = require('../middleware/isLoggedIn');

const createGetController = require('../controllers/contest/create/get');
const deleteGetController = require('../controllers/contest/delete/get');
const editGetController = require('../controllers/contest/edit/get');
const indexGetController = require('../controllers/contest/index/get');

const createPostController = require('../controllers/contest/create/post');
const deletePostController = require('../controllers/contest/delete/post');
const editPostController = require('../controllers/contest/edit/post');
const restorePostController = require('../controllers/contest/restore/post');

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
