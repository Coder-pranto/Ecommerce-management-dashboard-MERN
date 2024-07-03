const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory_image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
