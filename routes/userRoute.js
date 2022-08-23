const express = require('express');
const router = express.Router();

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
