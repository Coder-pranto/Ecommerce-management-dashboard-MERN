const router = require('express').Router();
const productController = require('../../Controllers/productController');
const upload = require('../../Middlewares/imageUpload');

// Create a new product
router.post('/', upload, productController.createProduct);

// Update a product by ID
router.patch('/:id', upload, productController.updateProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get a product by ID
router.get('/:id', productController.getProductById);

// Delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;




