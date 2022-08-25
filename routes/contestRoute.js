const express = require('express');
const router = express.Router();

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
