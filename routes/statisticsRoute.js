const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const medalGetController = require('../controllers/statistics/medal/get');

router.get(
  '/medal',
    isLoggedIn,
    medalGetController
);

module.exports = router;
