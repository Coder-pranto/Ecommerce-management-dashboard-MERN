const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
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
  address: {
    type: Object
  },
  date_of_birth: {
    type: Date,
    required: true

  },
  gender: {
    type: String,
    required: true
  },
  wishlist: {
    type: Array
  },
  status:{
    type:Boolean,
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

module.exports = mongoose.model('Customer', customerSchema);