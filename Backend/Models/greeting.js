const mongoose = require('mongoose');

const greetingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    buttonText: {
      type: String,
    },
    buttonLink: {
      type: String,
    },
    greet_img: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Greeting', greetingSchema);
