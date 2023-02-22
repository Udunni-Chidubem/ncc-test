const { body } = require("express-validator");

const axios = require("axios").default;
require('dotenv').config()

module.exports = {
    generateToken: async() => {
        let tokenData = {    
            publickey: "pubkey2",
            userinfo: {
            username: "admin@mail.com",
            password: "password"
            }
           }
        let resp = await axios.post(
            `${process.env.psb_base_url}disbursement-api/api/portal/merchant/account/authenticate`,
            tokenData, {
                headers: {
                    "Content-Type":
                      "application/json",
                    'Accept': 'application/json',
                    'Authorization' : "Bearer "+"1234"
                  },
            }
        );
        console.log(resp)
        return resp
      },
      validateCustomer: async (data, token) => {
        let resp = await axios.post(
            `${process.env.psb_base_url}disbursement-api/api/v1/customer/validate`,
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
          return resp
      },
      validateOtherBank: async (data, token) => {
        let resp = await axios.post(
            `${process.env.psb_base_url}disbursement-api/api/v1/customer/validate`,
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
          return resp
      },
      getAllBanks: async (token) => {
        let resp = await axios.get(
            `${process.env.psb_base_url}disbursement-api/api/v1/payout/banks`,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    'Authorization' : "Bearer "+token
                  },
            }
          );
          return resp
      },
      psbPayout: async (data, token) => {
        let resp = await axios.post(
            `${process.env.psb_base_url}disbursement-api/api/v1/account/payout`, 
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    'Authorization' : "Bearer "+token
                  },
            }
          );
          return resp
      },
      otherPayout: async (data, token) => {
        let resp = await axios.post(
            `${process.env.psb_base_url}disbursement-api/api/v1/account/payout`, 
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    'Authorization' : "Bearer "+token
                  },
            }
          );
          return resp
      },
      payoutStatus: async (reference, token) => {
        let resp = await axios.get(
            `${process.env.psb_base_url}disbursement-api/api/v1/payouts?reference=`+reference, 
            
            {
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    'Authorization' : "Bearer "+token
                  },
            }
          );
          return resp
      }
}