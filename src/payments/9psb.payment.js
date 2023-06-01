const { body } = require("express-validator");
const uniqid=require('uniqid');
const escrow = require("../helpers/escrow");
const psb = require("../helpers/9psb")
const axios = require("axios").default;
require('dotenv').config()

module.exports = {
    generateToken: async () => {
        let token = await psb.generateToken()
        // console.log(token.data)
        return token
    },
    psbCustomerValidate: async (req, res) => {
        let r = req.body
        let customerData = {
            publickey: process.env.psb_public_key,
            source: {
            operation: "account_enquiry",
            recipient: {
            accountnumber: r.account_number,
            bankcode: r.bank_code
            
            }
            },
            order: {    
            country: "NG"
            }
           }
        try {
        let token = await psb.generateToken()
        if(token.code="00"){
            // console.log('customer data', customerData)
            let validation = await psb.validateCustomer(customerData, token.access_token)
            console.log(validation)
                res.send(validation);
        }else{
            res.send(token)
        }
        } catch (e) {
            console.log(e)
        }

    },
    otherCustomerValidate: async (req, res) => {
        let r = req.body
        let customerData = {
            publickey: process.env.psb_public_key,
            source: {
            operation: "account_enquiry",
            recipient: {
            accountnumber: r.account_number,
            bankcode: r.bank_code
            
            }
            },
            order: {    
            country: "NG"
            }
           }
        try {
        let token = await psb.generateToken()
        if(token.code="00"){
            console.log(customerData)
            let validation = await psb.validateOtherBank(customerData, token.access_token)
            console.log(validation)
                res.send(validation);
        }else{
            res.send(token)
        }
        } catch (e) {
            console.log(e)
        }

    },  
    getBanks: async (req, res) => {

        try {
        let token = await psb.generateToken()
        if(token.code="00"){
            let banks = await psb.getAllBanks(token.access_token)
            // console.log(banks)
                res.send(banks);
        }else{
            res.send(token)
        }
        } catch (e) {
            console.log(e)
        }

    },
    psbAccountPayout: async (req, res) => {
        let r = req.body
        let data = {
            
                publickey: process.env.psb_public_key,
                 transaction: {
                 reference: uniqid()
                 },
                 order: {
                 amount: r.amount,
                 description: r.description,
                 reason: r.reason,
                 currency: "NGN",
                 country: "NG"
                 },
                 source: {
                 operation:"acct_payout",
                 sender: {
                 name: r.sender_name,
                 address: r.address,
                 mobile: r.phone_number,
                 country: "NG",
                 idtype: "PASSPORT",
                 idnumber: "P567839222",
                 idexpiry: "05-2019"
                 },
                 recipient: {
                 name: r.recipient_name,
                 address: r.recipient_address,
                 accountnumber: r.recipient_account,
                 bankcode: r.bank_code
                 }
                 }
                
        }    
        try {
            console.log("payload", data)
        let token = await psb.generateToken()
        //Get recipient bank code using their bank name 
        // let allBankCode = await psb.getAllBanks(token.access_token)
        // let b = allBankCode.banks
        // let bank = await b.filter(e => {
        //     return e.bankname==r.recipient_bank
        // })
        // console.log("recipient bank data", bank[0])

        // bank_code = bank[0].bankcode
        // console.log("recipient bank code", bank_code)
        // data.recipient.bankcode = bank_code
        if(token.code="00"){
            let payout = await psb.psbPayout(data, token.access_token)
            console.log(payout)
                res.send(payout);
        }else{
            res.send(token)
        }
        } catch (e) {
            console.log(e)
        }

    },
    otherBankPayout: async (req, res) => {
        let r = req.body
        let data = {
            
                publickey: process.env.psb_public_key,
                 transaction: {
                 reference: uniqid()
                 },
                 order: {
                 amount: r.amount,
                 description: r.description,
                 reason: r.reason,
                 currency: "NGN",
                 country: "NG"
                 },
                 source: {
                 operation:"acct_payout",
                 sender: {
                 name: r.sender_name,
                 address: r.address,
                 mobile: r.phone_number,
                 country: "NG",
                 idtype: "PASSPORT",
                 idnumber: "P567839222",
                 idexpiry: "05-2019"
                 },
                 recipient: {
                 name: r.recipient_name,
                 address: r.recipient_address,
                 accountnumber: r.recipient_account,
                 bankcode: r.bank_code
                 }
                 }
                
        }    
        try {
            console.log("payload", data)
        let token = await psb.generateToken()
        if(token.code="00"){
            let payout = await psb.otherPayout(data, token.access_token)
            console.log(payout)
                res.send(payout);
        }else{
            res.send(token)
        }
        } catch (e) {
            console.log(e)
        }

    },
    payoutStatus: async (req, res) => {
        let ref = req.params.ref
        try {
        let token = await psb.generateToken()
        if(token.code="00"){
            let status = await psb.payoutStatus(ref, token.access_token)
            console.log(status)
                res.send(status);
        }else{
            res.send(token)
        }
        } catch (e) {
            console.log(e)
        }

    },

    //PAYMENT GATEWAY 
    authentication: async (req, res) => {
        let token = await psb.gatewayTokenGeneration()
        res.send(token)
        return token
    },

    initializeTransaction: async(email, amount, callback, req) => {
        let token = await psb.gatewayTokenGeneration()
        let initial = psb.initialize(email, amount, callback, token, req)
    }
}