const router = require('express').Router();
const orderController = require('../../Controllers/orderController');


// Order routes
router.post('/', orderController.createOrder);
router.patch('/status', orderController.updateOrderStatus);
router.get('/history/:customerId', orderController.getOrderHistory);
router.get('/history', orderController.getOrderAllHistory);
router.delete('/:orderId', orderController.deleteOrder);

// Payment routes
router.post('/payments', orderController.processPayment);

module.exports = router;
