const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const districtSchema = new Schema({
  name: {
    type: String,
  },
  state: {
    type: String,
  },
  cities: {
    type: Array
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('District', districtSchema);