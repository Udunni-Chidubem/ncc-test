require('dotenv').config();
const axios = require("axios").default;

module.exports = {
    generateToken: async () => {
        let payload = {
          publickey: process.env.psb_publicKey,
          privatekey: process.env.psb_privateKey
        };
        let resp = await axios.post(
          `${process.env.psb_base_url}authenticate`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + "1234",
            },
          }
        );
        return resp;
      },
}



