const crypto = require('crypto');


module.exports = {
    generateSHA512Hash: async (input) => {
        // crypto.createHash('sha256').update(inputString).digest('hex').toUpperCase();
        const hash = crypto.createHash('sha512').update(input).digest('hex').toUpperCase();
        return hash;
    }
};
