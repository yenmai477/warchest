const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get((req, res) => res.send('Hello'))
  .post(productController.createProductInfo);

module.exports = router;
