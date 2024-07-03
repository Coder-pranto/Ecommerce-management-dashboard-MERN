const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema({

    address: {
        type: String
    },
    city: {
        type: String
    },
    district: {
        type: String
    },
    state: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Address', addressSchema);
