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
router.get('/api/products', middlewareAuth, getAllProducts);
router.get('/api/products/:productId', middlewareAuth, getProductById);
router.put('/api/products/:productId', middlewareAuth, updateProduct);
router.delete('/api/products/:productId', middlewareAuth, deleteProduct);

module.exports = router;