const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const csvGetController = require('../controllers/statistics/csv/get');
const indexGetController = require('../controllers/statistics/index/get');
const medalGetController = require('../controllers/statistics/medal/get');
const resultGetController = require('../controllers/statistics/result/get');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);
router.get(
  '/csv',
    isLoggedIn,
    csvGetController
);
router.get(
  '/medal',
    isLoggedIn,
    medalGetController
);
router.get(
  '/result',
    isLoggedIn,
    resultGetController
);

module.exports = router;
