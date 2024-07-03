const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  contact_no: {
    type: String
  },
  national_id: {
    type: String
  },
  gender: {
    type: String
  },
  business_name: {
    type: String,
    required: true
  },
  business_address: {
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
    status:{
      type: Boolean,
      default: true
    },
  
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);