const Airtime = require('../model/Airtime');
const { SendSMS } = require('../utils/sms');
const { validatePhoneNumber } = require('../utils/validation');

const credentials = {
    apiKey: process.env.APIKEY,
    username: process.env.AT_USERNAME,
};

const AfricasTalking = require('africastalking')(credentials);
const AT_Airtime = AfricasTalking.AIRTIME;
const app = AfricasTalking.APPLICATION;

const airTime = async (phonenumber, _amount) => {
    try {
        let phoneNo = validatePhoneNumber(phonenumber)
        const options = {
            maxNumRetry: 3,
            recipients: [
                {
                    phoneNumber: phoneNo,
                    currencyCode: 'KES',
                    amount: _amount,
                },
            ],
        };


        return AT_Airtime.send(options)
            .then(async (response) => {
                console.log(response);
                if (response.numSent === 0) {
                    return {
                        status: false,
                        statusCode: 400,
                        message: response.errorMessage,
                    };
                } else {
                    const dataSaved = await Airtime.create({
                        amount: response.responses[0].amount,
                        discount: response.responses[0].discount,
                        phoneNumber: response.responses[0].phoneNumber,
                        status: response.responses[0].status,
                    });
                    await SendSMS({
                        to: phonenumber,
                        msg: `Airtime worth ${_amount} has been sent`
                    });
                    return {
                        status: true,
                        statusCode: 200,
                        message: dataSaved,
                    };
                }
            })
            .catch((err) => {
                console.log('catch err: ', err);
                return {
                    status: false,
                    statusCode: 400,
                    message: err,
                };
            });
        
    } catch (err) {
        return {
            status: false,
            statusCode: 400,
            message: err,
        };
    }
};

const getAirtimeData = async () => {
    try {
        const airtimeData = await Airtime.find();

        return {
            status: true,
            statusCode: 200,
            data: airtimeData,
        };
    } catch (err) {
        return {
            status: true,
            statusCode: 400,
            msg: err,
        };
    }
};

const getApplicationData = async (req, res) => {
    // Fetch the application data
    await app
        .fetchApplicationData()
        .then((data) => {
            let balance = data.UserData.balance;
            res.json({
                status: true,
                statusCode: 200,
                balance,
            });
        })
        .catch((err) => {
            res.json({
                status: false,
                statusCode: 400,
                message: err,
            });
        });
};

module.exports = { airTime, getAirtimeData, getApplicationData };