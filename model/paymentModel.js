const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    amount:{
        type: Number,
        required: true
    },

    phoneNumber:{
        type: Number,
        required: true
    },

    mpesaReceiptNumber:{
        type: String,
        required: true
    },
    
    transactionDate:{
        type: String,
        required: true
    },
    account:{
        type: String
    }
},
    {timestamps: true}
)

module.exports = mongoose.model('Payment', paymentSchema)