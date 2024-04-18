const { body } = require("express-validator");
const axios = require("axios").default;
const escrowAuth = require("../helpers/escrow.auth");
require('dotenv').config()
module.exports = {

  processTransferToOtherBank: async (payload) => {
    let tokenData = await escrowAuth.generateToken();
    console.log(payload);
    try{
      if(tokenData.code === "00"){
          let resp = await axios.post(
            `${process.env.psb_base_url}account/transfer`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + tokenData,
              },
            }
          );
        return resp;
      }else{
        console.log("Auth Error: ", tokenData);
      }
    }catch(error){
      console.error(error);
    }
  } 
          
}
