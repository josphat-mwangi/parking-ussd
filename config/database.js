const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = async () => {
    mongoose.set('strictQuery', false);
    const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    const mongodbUri = process.env.mongoDBUri;
    await mongoose.connect(mongodbUri, mongoOptions);
    const conn = mongoose.connection;
    conn.on('error', console.error.bind(console, 'connection error:'));
};