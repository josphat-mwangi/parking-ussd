const User = require('../model/userModel');
const { validatePhoneNumber } = require('../utils/validation');

const createUser = async (phoneNumber) => {
    try {
        let phonenumber = validatePhoneNumber(phoneNumber);
        const userExists = await User.findOne({ phoneNumber: phonenumber });
        if (!userExists) {
            const result = await User.create({
                phoneNumber: phonenumber,
            });
          
            

            return {
                status: true,
                statusCode: 200,
                user: result,
                message: 'User  created successfully',
            };
        } else {
            return {
                status: true,
                statusCode: 400,
                message: 'User  already exist',
            };
        }
    } catch (err) {
        return {
            status: false,
            statusCode: 500,
            message: err,
        };
    }
};

const getAllUsers = async () => {
    try {
        const users = await User.find();
        return {
            status: true,
            statusCode: 200,
            data: users,
        };
    } catch (err) {
        return {
            status: false,
            statusCode: 400,
            message: err,
        };
    }
};

const getUser = async (phoneNumber) => {
    try {
        console.log("phoneNumber: ", phoneNumber)
        let phonenumber = validatePhoneNumber(phoneNumber);
        console.log("Validate phoneNumber: ", phoneNumber)
        const user = await User.findOne({ phoneNumber: phonenumber });
        console.log("user: ", user)
        if (!user) {
            return {
                status: false,
                statusCode: 400,
                message: 'user does not exist',
            };
        }

        return {
            status: true,
            statusCode: 200,
            data: user,
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

module.exports = { createUser, getAllUsers, getUser };