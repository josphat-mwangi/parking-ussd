const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const ussd = require('./routes/ussd');
const parking = require('./routes/route')
const db = require('./config/database');


const main = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.urlencoded({ extended: false }));
   

    app.get('/', (req, res) => {
        res.send('Hello Its up and running');
    });

    app.use('/ussd', ussd);
    app.use('/api', parking);
    app.use('*', (req, res) => res.status(404).send('404 Not Found'));

    
    app.listen(process.env.PORT || 4000, async () => {
        console.log(`Server Running ${process.env.PORT}`), await db.connect();
    });
};

main();