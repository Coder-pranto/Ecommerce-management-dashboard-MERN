const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    contact_no: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);