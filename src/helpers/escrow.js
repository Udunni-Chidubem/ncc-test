const { body } = require("express-validator");

const axios = require("axios").default;

module.exports = {
    

    transferToZenith: async (transferData) => {
        let transferData = {
            amount: body.amount, 
            bankName: body.bankName,
            crAccount: process.env.escrowacct,
            description: body, 
            drAccount: body.account,
            transactionRef:chjbksa
        }
    },

     
    transferToOtherBank: async (xgcbx)
}
