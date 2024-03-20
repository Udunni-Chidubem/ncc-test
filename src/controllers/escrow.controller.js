const { body } = require("express-validator");
const uniqid=require('uniqid');
const escrow = require("../helpers/escrow");
const axios = require("axios").default;
require('dotenv').config()

module.exports = {

    getSeedCompanyPayoutDetail: async (req, res) => {
        const user = req.user;
        console.log(user)
        
    },

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
            crAccount: req.body.crAccount,
            description: req.body.description, 
            drAccount: process.env.escrow_acct,
            transactionReference: uniqid()
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
            bankCode: req.body.bankCode, 
            bankName: req.body.bankName,
            crAccount: req.body.crAccount,
            description: req.body.description, 
            drAccount: process.env.escrow_acct,
            transactionReference: uniqid()
        }
        try {
            let token=await escrow.generateToken();
            if(token.responseCode=='00'){
                let transfer= await escrow.transferOther(transferData, token.tokenDetail.token)
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
