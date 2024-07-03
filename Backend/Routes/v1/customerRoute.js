
const router = require('express').Router();

const { 
    createCustomerProfile, 
    getCustomers, 
    getCustomerById, 
    updateCustomerProfile, 
    deleteCustomerProfile 
  } = require('../../Controllers/customerController');

const { authorizationChecker } = require("../../Util/jwt");



// Customer routes
router.post('/', createCustomerProfile);
router.get('/', authorizationChecker('admin'), getCustomers);
router.get('/:customerId', getCustomerById);
router.patch('/:customerId', updateCustomerProfile);
router.delete('/:customerId', deleteCustomerProfile);

module.exports = router;
