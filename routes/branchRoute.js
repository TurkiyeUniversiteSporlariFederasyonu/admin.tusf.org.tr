const express = require('express');
const router = express.Router();

const isAuthorized = require('../middleware/isAuthorized');
const isLoggedIn = require('../middleware/isLoggedIn');

const createGetController = require('../controllers/branch/create/get');
const editGetController = require('../controllers/branch/edit/get');
const indexGetController = require('../controllers/branch/index/get');

const createPostController = require('../controllers/branch/create/post');
const editPostController = require('../controllers/branch/edit/post');

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
  '/edit',
    isLoggedIn,
    isAuthorized,
    editPostController
);

module.exports = router;
