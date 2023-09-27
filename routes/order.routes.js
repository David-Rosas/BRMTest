const express = require('express');
const router = express.Router();

const {createOrder, getInvoice, purchaseHistory, getAllCustomerPurchases} = require('../controllers/OrdersController');

const { middlewareAuth } = require("../middlewares/isAuth");

router.post('/api/orders',middlewareAuth, createOrder);
router.get('/api/orders/:orderId',middlewareAuth, getInvoice);
router.get('/api/users/purchase-history', middlewareAuth, purchaseHistory);
router.get('/api/all-purchases', middlewareAuth, getAllCustomerPurchases);

module.exports = router;
