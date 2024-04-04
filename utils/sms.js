const credentials = {
    apiKey: process.env.APIKEY,
    username: process.env.AT_USERNAME,
};

// Initialize the SDK
const AfricasTalking = require('africastalking')(credentials);

// Get the SMS service
const sms = AfricasTalking.SMS;



const SendSMS = async ({ to, msg}) => {
 
    const options = {
        to: [to],
        message: msg,
    };
    sms.send(options)
        .then((response) => {
            console.log("response: ", response)
            return response;
        })
        .catch((error) => {
            console.log("error: ", error)
            return {
                status: 404,
                message: error,
            };
        });
};



module.exports = { SendSMS };