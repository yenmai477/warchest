const express = require('express');
const authController = require('../controllers/authController');
const cronjobController = require('../controllers/jobController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.use(authController.restrictTo('admin'));

router.route('/pullInfo').post(cronjobController.startPullInfoJob);
router.route('/pullProduct').post(cronjobController.startPullProductJob);

module.exports = router;
