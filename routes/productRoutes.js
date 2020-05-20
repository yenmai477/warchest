const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get((req, res) => res.send('Hello'))
  .post(productController.createProduct);

module.exports = router;
