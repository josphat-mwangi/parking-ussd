const router = require('express').Router();
const UssdMenu = require('ussd-builder');

const {
    initilize,
    findData,
    deleteData,
    updateData,
} = require('../utils/picoDB');

let menu = new UssdMenu();
let dataAmount = {};

menu.startState({
    run: async () => {
        
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
    run: () => {
        //query db for amount to pay
        let amount = 20;
        menu.con(
            `Confirm Purchase of Airtime Ksh ${amount} \n Pay with: \n1. Mpesa \n2. Taka Points`
        );
    },
    next: {
        1: 'mpesa',
        2: 'points',
    },
});



menu.state('mpesa', {
    run: async () => {
        let data = await findData(menu.args.sessionId);
        let number = data[0].phoneNumber;
        let Amount = dataAmount.amount;
        await sendSTKPush({ phoneNumber: number.split('+')[1], Amount });
        await deleteData(menu.args.sessionId);
        menu.end(
            'Your Airtime Request has been Received.\n Kindly Enter Mpesa Pin when Prompted to complete the transaction.'
        );
    },
});



menu.state('utilitybills', {
    run: async () => {
        await deleteData(menu.args.sessionId);
        menu.end('Coming soon');
    },
});

menu.state('parkingpoints', {
    run: async () => {
        let doc = await findData(menu.args.sessionId);
        let resBalance = await getWallet(doc[0].phoneNumber);
        resBalance.data.map(async (data) => {
            let amount = await convertPointsOrAmount(
                data.points,
                'points',
                'amount'
            );
            await deleteData(menu.args.sessionId);
            menu.end(
                `Your Parking points balance is ${data.points} Parking points worth Kshs ${amount}. Parking is for you `
            );
        });
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