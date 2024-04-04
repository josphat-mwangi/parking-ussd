let regex1 = /^\+[1-9]{1,3}\d{4,}$/;
let regex2 = /^(\+[1-9]{1,3})?\d{4,}$/;

const validatePhoneNumber = (phoneNumber) => {
    let number;
    if (isValidNumber(phoneNumber)) {
        if (phoneNumber.startsWith('07')) {
            number = phoneNumber.replace('07', '+2547');
            return number;
        } else if (phoneNumber.startsWith('01')) {
            number = phoneNumber.replace('01', '+2541');
            return number;
        } else if (phoneNumber.startsWith('2541')) {
            number = phoneNumber.replace('2541', '+2541');
            return number;
        } else if (phoneNumber.startsWith('2547')) {
            number = phoneNumber.replace('2547', '+2547');
            return number;
        } else if (phoneNumber.startsWith('+254')) {
            number = phoneNumber;
            return number;
        } else {
            console.log('Invalid phonenumber format');
        }
    } else {
        console.log('Invalid phoneNumber');
    }
};

const isValidNumber = (phoneNumber, intlFormat = false) => {
    return intlFormat ? regex1.test(phoneNumber) : regex2.test(phoneNumber);
};

module.exports = { validatePhoneNumber };