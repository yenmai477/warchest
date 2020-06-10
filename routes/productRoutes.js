const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(productController.aliasSearchProduct, productController.getAllProducts)
  .post(productController.createProduct);

router.route('/test').post(productController.createTest);
router.route('/testprice').post(productController.createTestPrice);

router.route('/:id').get(productController.getProduct);

module.exports = router;
