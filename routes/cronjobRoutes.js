const express = require('express');
const cronjobController = require('../controllers/jobController');

const router = express.Router();

router.route('/pullInfo').post(cronjobController.startPullInfoJob);
router.route('/pullProduct').post(cronjobController.startPullProductJob);

module.exports = router;
