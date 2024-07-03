const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderPaymentTypeSchema = new Schema({
    name: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order_Payment_Type', orderPaymentTypeSchema);