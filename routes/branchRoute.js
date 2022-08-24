const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const createGetController = require('../controllers/branch/create/get');
const editGetController = require('../controllers/branch/edit/get');
const indexGetController = require('../controllers/branch/index/get');

const createPostController = require('../controllers/branch/create/post');
const editPostController = require('../controllers/branch/edit/post');

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
  '/edit',
    isLoggedIn,
    editPostController
);

module.exports = router;
