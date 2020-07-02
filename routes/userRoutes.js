const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const noficationController = require('../controllers/noficationController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.get('/me', userController.getMe, userController.getUser);
router.get(
  '/me/nofications',
  userController.getMe,
  noficationController.getAllNofication
);

module.exports = router;
