const crypto = require("crypto");

module.exports = {
  generateSHA512Hash: async (input) => {
    // crypto.createHash('sha256').update(inputString).digest('hex').toUpperCase();
    const hash = crypto
      .createHash("sha512")
      .update(input)
      .digest("hex")
      .toUpperCase();
    return hash;
  },

  generateRef: async (length) => {
    const prefix = "VT";
    const characters = "0123456789";
    const charactersLength = characters.length;
    let randomString = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      randomString += characters.charAt(randomIndex);
    }

    return prefix + randomString;
  },
};
