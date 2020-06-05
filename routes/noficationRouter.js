const express = require('express');
const authController = require('../controllers/authController');
const noficationController = require('../controllers/noficationController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(noficationController.getAllNofication)
  .post(noficationController.createNofication);

module.exports = router;
