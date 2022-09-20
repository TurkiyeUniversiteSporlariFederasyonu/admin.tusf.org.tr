const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const csvGetController = require('../controllers/statistics/csv/get');
const medalGetController = require('../controllers/statistics/medal/get');

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

module.exports = router;
