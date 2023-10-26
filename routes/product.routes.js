const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/ProductsController');

const {
    createProductValidate,
    validate,
  } = require("../helpers/validator");

const { middlewareAuth } = require("../middlewares/isAuth");

router.post('/api/products', createProductValidate, middlewareAuth, validate, createProduct);
router.get('/api/products', middlewareAuth, validate, getAllProducts);
router.get('/api/products/:productId', middlewareAuth, validate, getProductById);
router.put('/api/products/:productId', middlewareAuth, validate, updateProduct);
router.delete('/api/products/:productId', middlewareAuth, validate, deleteProduct);

module.exports = router;