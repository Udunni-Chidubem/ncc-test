const { body } = require("express-validator");

const escrow = require("../helpers/escrow");
const axios = require("axios").default;

module.exports = {

    // generateToken: async(req, res) => {
    //     let tokenData = {
    //         "userIdentifyer": "INTERRANET",
    //         "userProtector": "C@PaC0u@mY2KDF"
    //     }
    //         let resp = await axios.post(
    //             `${process.env.escrow_base_url}authentication/getToken?`,
    //             tokenData, {
    //                 headers: {
    //                     "Content-Type":
    //                       "application/json",
    //                     'Accept': 'application/json'
    //                   },
    //             }
    //         );
    //        console.log(resp.data.tokenDetail.token)
    //        res.send(resp.data)
    //       },

    transferToZenith: async (req, res) => {
        let transferData = {
            amount: req.body.amount, 
            bankName: req.body.bankName,
            crAccount: process.env.escrow_acct,
            description: req.body, 
            drAccount: req.body.account,
            transactionRef: req.body.transactionReference
        }
        try {
            let token=await escrow.generateToken();
            if(token.responseCode=='00'){
                let transfer= await escrow.transferZenith(transferData, token.tokenDetail.token)
                console.log(transfer)
                res.send(transfer);
            }else{
                res.send(token)
            }
           
          } catch (e) {
              console.log(e)
            res.send(e);
          }
    },


    transferToOtherBank: async (req, res) => {
        let transferData = {
            amount: req.body.amount, 
            bankName: req.body.bankName,
            crAccount: req.body.account,
            description: req.body.description, 
            drAccount: process.env.escrow_acct,
            transactionRef: req.body.transactionReference
        }
        try {
            let token=await escrow.generateToken();
            if(token.responseCode=='00'){
                let transfer= await escrow.transferZenith(transferData, token.tokenDetail.token)
                console.log(transfer)
                res.send(transfer);
            }else{
                res.send(token)
            }
           
          } catch (e) {
              console.log(e)
            res.send(e);
          }
    },

}
