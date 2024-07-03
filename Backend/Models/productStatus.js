const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productStatusSchema = new Schema({
    name: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProductStatus', productStatusSchema);