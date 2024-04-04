const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const ParkingSchema = new Schema(
    {
        plateNumber: {
            type: String,
            required: true,
        },
        userNo: {
            type: String,
        },
        isPayment: {
            type: Boolean,
            default: false
        },
        
      
    },
    { timestamps: true }
);

module.exports = Mongoose.model('Parking', ParkingSchema);