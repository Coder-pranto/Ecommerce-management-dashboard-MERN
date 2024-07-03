// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const orderSchema = new Schema({
//   customer: {
//     type: Schema.Types.ObjectId,
//     ref: 'Customer',
//     required: true
//   },
//   items: [{
//     product: {
//       type: Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true
//     },
//     quantity: {
//       type: Number,
//       required: true
//     },
//     price: {
//       type: Number,
//       required: true
//     }
//   }],
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['Pending', 'Paid', 'Failed'],
//     default: 'Pending'
//   },
//   orderStatus: {
//     type: String,
//     enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
//     default: 'Pending'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Order', orderSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customer: {
        type: Object,
        required: true,
        properties: {
          name: { type: String,  },
          email: { type: String, },
          address: { type: String,  },
          contactNumber:{type:String},
          paymentInfo: { type: String }, // Optional
        },
      },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    size: {
      type: String,
    },
    color:{
        type:String
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    // enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    // enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
