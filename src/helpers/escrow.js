const { body } = require("express-validator");

const axios = require("axios").default;
require('dotenv').config()
module.exports = {

  generateToken: async () => {
    let tokenData = {
      publickey: process.env.psb_publicKey,
      privatekey: process.env.psb_privateKey
    };
    let resp = await axios.post(
      `${process.env.psb_base_url}authenticate`,
      tokenData,
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


  otherBankPayout: async (payload) => {    
    try {
        console.log("payload", data)
    let token = await psb.generateToken()
    if(token.code="00"){
        let payout = await psb.otherPayout(payload, token.access_token)
        console.log(payout)
            res.send(payout);
    }else{
        res.send(token)
    }
    } catch (e) {
        console.log(e)
    }

},









    
  // generateToken: async(req, res) => {
  //   let tokenData = {
  //       "userIdentifyer": "INTERRANET",
  //       "userProtector": "C@PaC0u@mY2KDF"
  //   }
  //   let resp = await axios.post(
  //       `${process.env.escrow_base_url}authentication/getToken?`,
  //       tokenData, {
  //           headers: {
  //               "Content-Type":
  //                 "application/json",
  //               'Accept': 'application/json'
  //             },
  //       }
  //   );
  //   console.log(resp.data)
  //   return resp.data
  // },

  // transferZenith:async (data, token)=>{
  //   let resp = await axios.post(
  //     `${process.env.escrow_base_url}transaction/zenithTransfer`,
  //     data,
  //     {
  //         headers: {
  //             "Content-Type":
  //             "application/json",
  //             'Accept': 'application/json',
  //             'Authorization' : "Bearer "+token
  //           },
  //     }
  //   );
  //   return resp.data
  // },

  // transferOther:async (data, token)=>{
  //   let resp = await axios.post(
  //     `${process.env.escrow_base_url}transaction/otherBankTransfer`,
  //     data,
  //     {
  //         headers: {
  //             "Content-Type":
  //             "application/json",
  //             'Accept': 'application/json',
  //             'Authorization' : "Bearer "+token
  //           },
  //     }
  //   );
  //   return resp.data
  // }
          
}
