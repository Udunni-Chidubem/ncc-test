const { default: axios } = require("axios");
const uniqid = require("uniqid");
module.exports = {
  callback: async (req, res) => {
    let resp = await axios.get(
      process.env.paystack_verify + req.query.reference,
      {
        headers: {
          Authorization: "Bearer " + process.env.paystack_secret_key,
        },
      }
    );
    return resp;
  },
  initialize: async (email, amount, callback, req) => {
    try {
      let ref = uniqid();
      let resp = await axios.post(
        process.env.paystack_initialize,
        {
          email: email,
          amount: amount,
          callback_url: callback,
          key: process.env.paystack_secret_key,
          reference: ref,
          //   subaccount: process.env.paystack_subaccount,
        },
        {
          headers: {
            Authorization: "Bearer " + process.env.paystack_secret_key,
          },
        }
      );
      // console.log(resp.data.data.authorization_url)
      return resp;
    } catch (e) {
      console.log(e);
      return { status: false, message: e.message };
    }
  },
  initializeTrader: async (email, amount, req) => {
    try {
      let ref = uniqid();
      let resp = await axios.post(
        process.env.paystack_initialize,
        {
          email: email,
          amount: amount,
          callback_url: req.get("origin") + "/seed-trader/checkout/callback",
          key: process.env.paystack_secret_key,
          reference: ref,
          //  subaccount: process.env.paystack_subaccount,
        },
        {
          headers: {
            Authorization: "Bearer " + process.env.paystack_secret_key,
          },
        }
      );
      // console.log(resp.data.data.authorization_url)
      return resp;
    } catch (e) {
      console.log(e);
    }
  },
  callBackMob: async (ref) => {
    let resp = await axios.get(process.env.paystack_verify + ref, {
      headers: {
        Authorization: "Bearer " + process.env.paystack_secret_key,
      },
    });
    return resp;
  },
};
