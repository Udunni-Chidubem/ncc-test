


function isValidPhoneNumber(phoneNumber) {
    const phonePattern = /^0[789]\d{9}$/;
    return phonePattern.test(phoneNumber);
}

module.exports = {
    isValidPhoneNumber
};



