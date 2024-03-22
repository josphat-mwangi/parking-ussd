const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const main = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.urlencoded({ extended: false }));
   

    app.get('/', (req, res) => {
        res.send('Hello Its up and running');
    });

    
    app.listen(process.env.PORT || 4000, async () => {
        console.log(`Server Running ${process.env.PORT}`)
    });
};

main();