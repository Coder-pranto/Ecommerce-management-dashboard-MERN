const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: {
    type: String
  },
  district: {
    type: String
  },
  state: {
    type: String
  },
  area: {
    type: Array
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('City', citySchema);