const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    price: {
      type: String
    },
    colors: {
      type: [String], 
    },
    discount: {
      type: Number,
    },
    thumb_image: {
      type: String,
      required: true,
    },
    media: {
      type: Array,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    stock:{
      type:Number
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
