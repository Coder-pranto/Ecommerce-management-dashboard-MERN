const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stateSchema = new Schema({
  name: {
    type: String,
  },
  districts: {
    type: Array
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('State', stateSchema);