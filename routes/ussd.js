const router = require('express').Router();
const UssdMenu = require('ussd-builder');
const { sendSTKPush } = require('../controllers/stkPush');
const { getUser } = require('../controllers/userController')
const { convertPointsOrAmount } = require('../utils/points');
const User = require('../model/userModel');
const { createUser } = require('../controllers/userController');


const {
    initilize,
    findData,
    deleteData,
    updateData,
} = require('../utils/picoDB');
const { getParking } = require('../controllers/parkingController');
const { parkingFee } = require('../utils/parkingPrice');
const { SendSMS } = require('../utils/sms');
const { airTime } = require('../controllers/airtimeController');

let menu = new UssdMenu();
let dataAmount = {};

menu.startState({
    run: async () => {
        let data = await findData(menu.args.sessionId);
        let user = await User.findOne({
            phoneNumber: data[0].phoneNumber,
        });

        if (!user) {
            await createUser(data[0].phoneNumber);
        }
        menu.con(
            'Welcome to Parking Solutions: ' +
                '\n1. Pay Parking' +
                '\n2. Pay utility bills'  +
                '\n3. Parking Points'
        );
    },
    next: {
        1: 'payparking',
        2: 'utilitybills',
        3: 'parkingpoints',
        4: 'quit',
    },
});

menu.state('payparking', {
    run: async () => {
        menu.con('Enter plate number');
    },
    next: {
        '*\\w+': 'payparking.pay'
    },
});



menu.state('payparking.pay', {
    run: async () => {
        let plateNumber = menu.val;

        if (/[a-z\s]/.test(plateNumber)) {
            plateNumber = plateNumber.replace(/\s/g, '').toUpperCase();
        } 

        let parking = await getParking(plateNumber)
        let data = await findData(menu.args.sessionId);
        let number = data[0].phoneNumber;

        if(parking){
            if (parking.status && parking.message.isPayment === false) {
                let amount = await parkingFee(parking.message.createdAt);
                menu.con(
                    `The parking fee for ${menu.val} is ${amount}. Pay with: \n1. Mpesa`
                );

                await updateData(menu.args.sessionId, { amount: amount }); 
            
                SendSMS({
                    to: number,
                    msg: `The parking fee for ${menu.val} is ${amount}. You can also pay via paybill 110010 and account number is ${menu.val}. Thank you for choosing us.`
                });
            } else {
                await deleteData(menu.args.sessionId);
                menu.end('The car parking is already paid');
            }
        }
            
    },
    next: {
        1: 'mpesa',
    },
});



menu.state('mpesa', {
    run: async () => {
        let data = await findData(menu.args.sessionId);
        let number = data[0].phoneNumber;
        let Amount = data[0].amount;
        await sendSTKPush({ phoneNumber: number.split('+')[1], Amount });
        await deleteData(menu.args.sessionId);
        menu.end(
            'STK push will be sent to complete payment. Thank you'
        );
    },
});




menu.state('utilitybills', {
    run: async () => {
        menu.con(
            'Choose utility bill:  ' +
                '\n1. Airtime'
        );
    },
    next: {
        1: 'utilitybills.airtime',
    },
});



menu.state('utilitybills.airtime', {
    run: () => {
        menu.con('Enter Amount: (min: 5 ');
    },
    next: {
        '*\\d+': 'payment',
    },
});

menu.state('payment', {
    run: () => {
        let amount = menu.val;
        dataAmount.amount = amount;
        menu.con(
            `Confirm Purchase of Airtime Ksh ${amount} \n Pay with: \n1. Mpesa`
        );
    },
    next: {
        1: 'payment.mpesa',
    },
});

menu.state('payment.mpesa',{
    run: async () => {
        let data = await findData(menu.args.sessionId);
        let phonenumber = data[0].phoneNumber;
        let Amount = dataAmount.amount
        await sendSTKPush({ phoneNumber: phonenumber.split('+')[1], Amount });
        let airphone = await airTime(phonenumber, Amount)
        console.log("airphone: ", airphone)
        menu.end(
            'STK push will be sent to complete payment. Thank you'
        );
    }

})


menu.state('parkingpoints', {
    run: async () => {
        let doc = await findData(menu.args.sessionId);
        let balance = await getUser(doc[0].phoneNumber);

        if (balance.status) { // Check if status is true
            let amount = await convertPointsOrAmount(
                balance.data.points,
                'points',
                'amount'
            );
            await deleteData(menu.args.sessionId);
            menu.end(
                `Your Parking points balance is ${balance.data.points} Parking points worth Kshs ${amount}. Parking is for you `
            );
        } 
        
    },
});


menu.state('quit', {
    run: async () => {
        await deleteData(menu.args.sessionId);
        menu.end('Goodbye, Thank you for your time');
    },
});

router.post('/', async (req, res) => {
    let data = {
        phoneNumber: req.body.phoneNumber,
        sessionId: req.body.sessionId,
        serviceCode: req.body.serviceCode,
        Operator: req.body.networkCode || req.body.Operator,
    };
    await initilize(data);
    menu.run(req.body, (ussdResult) => {
        res.send(ussdResult);
    });
});

module.exports = router;