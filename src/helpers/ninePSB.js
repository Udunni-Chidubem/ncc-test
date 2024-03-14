const { body } = require("express-validator");
const uniqid = require("uniqid");

const axios = require("axios").default;
require("dotenv").config();

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
  getCustomerAccount: async (data, token) => {
    // This service run-through the customer’s account details.
    let resp = await axios.post(
      `${process.env.psb_base_url}account/enquiry`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return resp;
  },

  psbCustomerAccountBalance: async (data, token) => {
    //console.log(token.code);
    let resp = await axios.post(
      `${process.env.psb_base_url}account/balanceenquiry`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return resp;
},

  validateOtherBank: async (data, token) => {
    let resp = await axios.post(
      `${process.env.psb_base_url}disbursement-api/api/v1/customer/validate`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return resp;
  },
  getAllBanks: async (token) => {
    // Fetch all available banks for fund transfer
    let resp = await axios.get(
      `${process.env.psb_base_url}transfer/getbanks`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return resp;
  },
  psbPayout: async (data, token) => {
    let resp = await axios.post(
      `${process.env.psb_base_url}disbursement-api/api/v1/account/payout`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return resp;
  },
  otherPayout: async (data, token) => {
    let resp = await axios.post(
      `${process.env.psb_base_url}disbursement-api/api/v1/account/payout`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return resp;
  },
  payoutStatus: async (reference, token) => {
    let resp = await axios.get(
      `${process.env.psb_base_url}disbursement-api/api/v1/payouts?reference=` +
        reference,

      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return resp;
  },

  // PAYMENT GATEWAY
  gatewayTokenGeneration: async () => {
    try {
      let tokenData = {
        key:
          process.env.psb_merchant_privateKey +
          "." +
          process.env.psb_merchant_publicKey,
      };
      let resp = await axios.post(
        `${process.env.psb_payment_gateway_base_url}encrypt/keys`,
        tokenData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // 'Authorization' : "Bearer "+"1234"
          },
        }
      );
      return resp.data.EncryptedSecKey.encryptedKey;
    } catch (e) {
      return e.message;
    }
  },

  initialize: async (email, amount, callback, token, req) => {
    try {
      let ref = uniqid();
      let resp = await axios.post(
        `${process.env.psb_payment_gateway_base_url}payments`,
        {
          publicKey: process.env.psb_merchant_publicKey,
          amount: amount,
          currency: "NGN",
          country: "NG",
          paymentReference: ref,
          email: email,
          callbackUrl: callback,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("resppp", resp);
      return resp;
    } catch (e) {
      console.log(e);
    }
  },
  verifyPayment: async (ref, token) => {
    try {
      let url = `${process.env.psb_payment_gateway_base_url}payments/query/${ref}`;

      let resp = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return resp;
    } catch (e) {
      return e.message;
    }
  },
};
