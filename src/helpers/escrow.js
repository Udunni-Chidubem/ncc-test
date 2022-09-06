const { body } = require("express-validator");

const axios = require("axios").default;

module.exports = {
    
  generateToken: async(req, res) => {
    let tokenData = {
        "userIdentifyer": "INTERRANET",
        "userProtector": "C@PaC0u@mY2KDF"
    }
    let resp = await axios.post(
        `${process.env.escrow_base_url}authentication/getToken?`,
        tokenData, {
            headers: {
                "Content-Type":
                  "application/json",
                'Accept': 'application/json'
              },
        }
    );
    console.log(resp.data)
    return resp.data
  },

  transferZenith:async (data, token)=>{
    let resp = await axios.post(
      `${process.env.escrow_base_url}transaction/zenithTransfer`,
      data,
      {
          headers: {
              "Content-Type":
              "application/json",
              'Accept': 'application/json',
              'Authorization' : "Bearer "+token
            },
      }
    );
    return resp.data
  },

  transferOther:async (data, token)=>{
    let resp = await axios.post(
      `${process.env.escrow_base_url}transaction/otherBankTransfer`,
      data,
      {
          headers: {
              "Content-Type":
              "application/json",
              'Accept': 'application/json',
              'Authorization' : "Bearer "+token
            },
      }
    );
    return resp.data
  }
          
}
