
const mongoose = require('mongoose');


const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  banner_img: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: false
  },
  priority: {
    type: Number,
    required: true,
    default: 0 
  },
  active: {
    type: Boolean,
    required: true,
    default: true 
  }
});

module.exports = mongoose.model('Banner', bannerSchema);
