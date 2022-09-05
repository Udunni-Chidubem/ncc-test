const { body } = require("express-validator");

const axios = require("axios").default;

module.exports = {
    
    generateToken: async(tokenData) => {
        let tokenData = {
            "userIdentifyer": "INTERRANET",
            "userProtector": "C@PaC0u@mY2KDF"
        }
        let resp = await axios.post(
            "https://newwebservicetest.zenithbank.com:9443/directtransfer/api/transaction/zenithTransfer",
            tokenData,
            {
              headers: {
                "Content-Type":
                  "application/json",
              },
            }
        );
        return resp;    
    },
    
    transferToZenith: async (transferData) => {
        let transferData = {
            amount: body.amount, 
            bankName: body.bankName,
            crAccount: process.env.escrowacct,
            description: body, 
            drAccount: body.account,
            transactionRef:chjbksa
        }
        let resp = axios.post(
            "https://newwebservicetest.zenithbank.com:9443/directtransfer/api/transaction/zenithTransfer",
            transferData,
            {
              headers: {
                "Content-Type":
                  "application/json",
              },
              authorization: {
                  "Token": generateToken
              },
            }
        );   
        return resp; 
    },


    transferToOtherBank: async (transferData) => {
        let transferData = {
            amount: body.amount, 
            bankName: body.bankName,
            crAccount: body.account,
            description: body, 
            drAccount: process.env.escrowacct,
            transactionRef:chjbksa
        }
        let resp = axios.post(
            "https://newwebservicetest.zenithbank.com:9443/directtransfer/api/transaction/zenithTransfer",
            transferData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data; boundary=<calculated when request is sent>",
              },
              authorization: {
                  "Token": generateToken
              },
            }
        );
        return resp;    
    },

}
