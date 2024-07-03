const router = require('express').Router();
const {
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorById,
  getAllVendors,
} = require('../../Controllers/vendorController');

router.post('/', createVendor);

router.patch('/:id', updateVendor);

router.delete('/:id', deleteVendor);

router.get('/:id', getVendorById);

router.get('/', getAllVendors);

module.exports = router;
