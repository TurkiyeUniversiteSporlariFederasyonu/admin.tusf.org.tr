const express = require('express');
const router = express.Router();

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
    indexGetController
);
router.get(
  '/create',
    isLoggedIn,
    createGetController
);
router.get(
  '/delete',
    isLoggedIn,
    deleteGetController
);
router.get(
  '/edit',
    isLoggedIn,
    editGetController
);

router.post(
  '/create',
    isLoggedIn,
    createPostController
);
router.post(
  '/delete',
    isLoggedIn,
    deletePostController
);
router.post(
  '/edit',
    isLoggedIn,
    editPostController
);
router.post(
  '/restore',
    isLoggedIn,
    restorePostController
);

module.exports = router;
