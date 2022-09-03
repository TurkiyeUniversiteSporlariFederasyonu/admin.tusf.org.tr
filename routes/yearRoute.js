const express = require('express');
const router = express.Router();

const isAuthorized = require('../middleware/isAuthorized');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/year/index/get');
const editGetController = require('../controllers/year/edit/get');

const editPostController = require('../controllers/year/edit/post');

router.get(
  '/',
    isLoggedIn,
    isAuthorized,
    indexGetController
);
router.get(
  '/edit',
    isLoggedIn,
    isAuthorized,
    editGetController
);

router.post(
  '/edit',
    isLoggedIn,
    isAuthorized,
    editPostController
);

module.exports = router;
