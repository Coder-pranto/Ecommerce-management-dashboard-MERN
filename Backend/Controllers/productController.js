const Product = require('../Models/product');
const Vendor = require('../Models/vendor'); 
const mongoose = require("mongoose");


// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, rating, description, category, subcategory, brand, price, colors, discount, thumb_image, media, stock, vendor_id:vendor } = req.body;

    if (!req.files['thumb_image'] || !req.files['media']) {
      return res.status(400).json({ message: 'Thumb image and media files are required' });
    }
     console.log("the stock data is:", stock);
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
      media: req.files['media'].map(file => file.filename),
      stock,
      vendor
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, rating, description, category, subcategory, brand, price, colors, discount, stock, vendor } = req.body;

    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update only the properties that are provided in the request body, otherwise retain the existing values
    existingProduct.name = name !== undefined ? name : existingProduct.name;
    existingProduct.rating = rating !== undefined ? rating : existingProduct.rating;
    existingProduct.description = description !== undefined ? description : existingProduct.description;
    existingProduct.price = price !== undefined ? price : existingProduct.price;
    existingProduct.colors = colors !== undefined ? colors : existingProduct.colors;
    existingProduct.discount = discount !== undefined ? discount : existingProduct.discount;
    existingProduct.stock = stock !== undefined ? stock : existingProduct.stock;

    if (vendor && mongoose.Types.ObjectId.isValid(vendor)) {
      existingProduct.vendor = vendor;
    }

    // Update category if provided and is a valid ObjectId, otherwise retain the existing value or set it to null
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      existingProduct.category = category;
    } else {
      existingProduct.category = existingProduct.category;
    }

    // Update subcategory if provided and is a valid ObjectId, otherwise retain the existing value or set it to null
    if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
      existingProduct.subcategory = subcategory;
    } else {
      existingProduct.subcategory = existingProduct.subcategory;
    }

    // Update brand if provided and is a valid ObjectId, otherwise retain the existing value or set it to null
    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      existingProduct.brand = brand;
    } else {
      existingProduct.brand = existingProduct.brand;
    }

    // Check if there are any files for thumb_image and media fields and update them accordingly
    if (req.files['thumb_image']) {
      existingProduct.thumb_image = req.files['thumb_image'][0].filename;
    }

    if (req.files['media']) {
      existingProduct.media = req.files['media'].map(file => file.filename);
    }

    const updatedProduct = await existingProduct.save();

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category subcategory brand vendor');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product
    .findById(req.params.id)
    .populate('category subcategory brand vendor');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


