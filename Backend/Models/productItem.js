const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productItemSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    stock: { 
        type: Number, 
      },
    buying_date: {
        type: Date,
        required: true
    },
    buying_price: {
        type: Number,
        required: true
    },
    selling_price: {
        type: Number
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProductItem', productItemSchema);