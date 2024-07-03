const Product = require('../Models/product');
const Vendor = require('../Models/vendor');
const mongoose = require('mongoose');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      rating,
      description,
      category,
      subcategory,
      brand,
      price,
      colors,
      discount,
      thumb_image,
      media,
      stock,
      vendor_id: vendor,
    } = req.body;

    if (!req.files['thumb_image'] || !req.files['media']) {
      return res
        .status(400)
        .json({ message: 'Thumb image and media files are required' });
    }
    console.log('the stock data is:', stock);
    if (!vendor || !mongoose.Types.ObjectId.isValid(vendor)) {
      return res.status(400).json({ message: 'Valid vendor ID is required' });
    }

    // Check if the vendor exists
    const vendorExists = await Vendor.findById(vendor);
    if (!vendorExists) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const newProduct = new Product({
      name,
      rating,
      description,
      category,
      subcategory,
      brand,
      price,
      colors,
      discount,
      thumb_image: req.files['thumb_image'][0].filename,
      media: req.files['media'].map((file) => file.filename),
      stock,
      vendor,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
