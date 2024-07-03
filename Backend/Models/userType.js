const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userTypeSchema = new Schema({
  name: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User_type', userTypeSchema);