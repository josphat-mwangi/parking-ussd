const Parking = require('../model/parkingModel');
const mongoose = require('mongoose');



const park = async (plateNo) =>{
    try{
        console.log("plate: ", plateNo);
        const parking = await Parking.findOne({ plateNumber: plateNo }); // Change 'findone' to 'findOne'
        console.log("parking.isPayment: ", parking);
        if (!parking || !parking.isPayment) { 
          
            let saveParking = await Parking.create({
                plateNumber:plateNo
            })

            return {
                statusCode: 201,
                message: "Parked successfully",
                parking: saveParking
            }
        }
    
    }catch(err){
        console.log("err: ", err)
        return {
            statusCode: 400,
            message: err,
        };
    }
}

const getParking = async (plateNo) => {
    try {
        const parking = await Parking.findOne({plateNumber:plateNo})
        if (!parking) {
            return {
                status: false,
                statusCode: 400,
                message: 'Cannot find parking',
            };
        }

      
        return {
            status: true,
            statusCode: 201,
            message: parking,
        };
    } catch (err) {
        if (err instanceof mongoose.CastError) {
            return {
                status: false,
                statusCode: 400,
                msg: 'Invalid',
            };
        }
        return {
            status: false,
            statusCode: 400,
            msg: err,
        };
    }
};

const getAllParkings = async () => {
    try {
        const parkings = await Parking.find();
        return {
            status: true,
            statusCode: 200,
            data: parkings,
        };
    } catch (err) {
        return {
            status: false,
            statusCode: 400,
            message: err,
        };
    }
};

const updateParking = async (plateNo, isPayment) => {
    try {
        // Find the parking entry with the given plate number
        const parking = await Parking.findOne({ plateNumber: plateNo });

        if (!parking) {
            return {
                status: false,
                statusCode: 404,
                message: 'Parking entry not found',
            };
        }

        // Update the payment status
        parking.isPayment = isPayment;
        
        // Save the updated parking entry
        await parking.save();

        return {
            status: true,
            statusCode: 200,
            message: 'Parking entry updated successfully',
            data: parking,
        };
    } catch (err) {
        return {
            status: false,
            statusCode: 500,
            message: err.message,
        };
    }
};

module.exports = { park, getAllParkings, getParking, updateParking };

