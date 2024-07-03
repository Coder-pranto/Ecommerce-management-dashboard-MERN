const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    name: {
      type: String,
    },
    brand_logo: {
      type: String,
    },
    contact_no: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", brandSchema);
