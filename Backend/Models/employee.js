const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact_no: {
    type: String
  },
  photo_path: {
    type: String,
    required: true
  },
  address: {
    type: {
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      district: {
        type: String,
      },
      state: {
        type: String,
      }
    },
    required: true
  },
  user_type: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);