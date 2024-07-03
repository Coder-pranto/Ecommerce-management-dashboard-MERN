const router = require('express').Router();
const bannerController = require('../../Controllers/bannerController'); // Import the banner controller
const upload = require('../../Middlewares/imageUpload');

// Create a new banner
router.post('/', upload, bannerController.createBanner);

// Update a banner by ID
router.patch('/:id', upload, bannerController.updateBannerById);

// Get all banners
router.get('/', bannerController.getAllBanners);

// Get a banner by ID
router.get('/:id', bannerController.getBannerById);

// Delete a banner by ID
router.delete('/:id', bannerController.deleteBannerById);

module.exports = router;
