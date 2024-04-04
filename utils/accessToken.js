const request = require('request');
const authBase64 = require('../helpers/authbasesixfour');

const get_access_token = () => {
    return new Promise((resolve, reject) => {
        let endpoint_auth_credentials = process.env.AUTHURL;
        let auth = authBase64(
            process.env.CONSUMER_KEY,
            process.env.CONSUMER_SECRET
        );

        request(
            {
                uri: endpoint_auth_credentials,

                headers: {
                    Authorization: `Basic ${auth}`,
                },
            },
            (err, response, body) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("access token: ", JSON.parse(body).access_token)
                    const access_token = JSON.parse(body).access_token;
                    resolve(access_token);
                }
            }
        );
    });
};

module.exports = get_access_token;