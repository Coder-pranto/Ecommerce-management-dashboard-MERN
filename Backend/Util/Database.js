const mongoose = require("mongoose");
require("dotenv").config();

const mongoConnect = (listen) => 
{
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster01.8onemqp.mongodb.net/deshitbd_ecommerce_systemn_db?retryWrites=true&w=majority`)
        .then(listen)
        .catch(err => 
        {
            console.log(err);
        });
};

exports.mongoConnect = mongoConnect; 

