const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AirtimeSchema = new Schema(
    {   
        amount: { 
            type: String,
            required: true
        },
        phoneNumber: { 
            type: String,
            required: true
        },
        discount:{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Airtime', AirtimeSchema);