const router = require('express').Router();
const { createUser, getAllUsers, getUser } = require('../controllers/userController');
const {
    airTime,
    getAirtimeData,
    getApplicationData,
} = require('../controllers/airtimeController');
const {
    accessToken,
    sendSTKPush,
    callBackURL,
} = require('../controllers/stkPush')
const get_access_token = require('../utils/accessToken');
const {
    park, getAllParkings, getParking, updateParking
} = require('../controllers/parkingController')


// user
router.post('/', async (req, res) => {
    res.json(await createUser(req.body.phoneNumber));
});

router.get('/', async (req, res) => {
    res.json(await getAllUsers());
});

router.get('/user', async (req, res) => {
    res.json(await getUser(req.body.phoneNumber));
});




//airtime
router.post('/airtime', async (req, res) => {
    res.json(
        await airTime(
            req.body.phoneNumber,
            req.body.amount
        )
    );
});

router.get('/allAirtime', async (req, res) => {
    res.json(await getAirtimeData());
});

router.get('/balance', getApplicationData);


//parking

router.post('/parking', async(req, res) =>{
    const { plateNo } = req.body
    console.log("plateNo: ", plateNo)
    res.json(await park(plateNo))
})

router.get('/parking', async(req, res) => {
    const { plateNo } = req.body
    res.json(await getParking(plateNo))
})

router.get('/parkings', async(req, res) => {
    const { plateNo } = req.body
    res.json(await getAllParkings(plateNo))
})

router.put('/parking', async(req, res) => {
    const { plateNo, isPayment } = req.body

    res.json(await updateParking(plateNo, isPayment))

})


//mpesa
router.get('/mpesa', get_access_token, accessToken);
router.post('/mpesa', get_access_token, sendSTKPush);
router.post('/mpesa/callbackurl', callBackURL);

module.exports = router;