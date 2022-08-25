const express = require('express');
const router = express.Router();

const isAuthorized = require('../middleware/isAuthorized');
const isLoggedIn = require('../middleware/isLoggedIn');

const createGetController = require('../controllers/university/create/get');
const editGetController = require('../controllers/university/edit/get');
const indexGetController = require('../controllers/university/index/get');

const createPostController = require('../controllers/university/create/post');
const editPostController = require('../controllers/university/edit/post');


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
