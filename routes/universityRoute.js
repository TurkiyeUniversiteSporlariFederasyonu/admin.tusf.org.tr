const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const createGetController = require('../controllers/university/create/get');
const editGetController = require('../controllers/university/edit/get');
const indexGetController = require('../controllers/university/index/get');

const createPostController = require('../controllers/university/create/post');
const editPostController = require('../controllers/university/edit/post');


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
