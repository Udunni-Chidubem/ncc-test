require("dotenv").config();
const db = require("../models");
const { User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States, WalletLog } =
  db;

module.exports = {
  getFarmerProfile: async (user) => {
    let farmer = await Farmer.findOne({
      // attributes : ['firstname', 'lastname', 'phone_no', 'age', 'account_no', 'account_name'],
      include: [
        {
          model: States,
          attributes: ["id", "name"],
        },
        {
          model: LGAs,
          attributes: ["id", "name"],
        },
      ],
      where: {
        user_id: user.id,
      },
      raw: true,
    });

    return farmer;
  },
  getTraderProfile: async (user) => {
    const trader = await SeedTrader.findOne({
      where: {
        user_id: user.id,
      },
      raw: true,
    });
    return trader;
  },
  getCompanyProfile: async (user) => {
    const company = await SeedCompany.findOne({
      where: {
        user_id: user.id,
      },
      attributes: [
        "id",
        "name_of_company",
        "phone_no",
        "tin",
        "address",
        "licensed_no",
        "certification_number",
        "email",
        "state_id",
        "lg_id",
        "bank_account_name",
        "bank_account_no",
        "bank_code",
        "user_id",
      ],
      raw: true,
    });
    return company;
  },
  getTraderPofile: async (user) => {
    const trader = await SeedTrader.findOne({
      where: {
        user_id: user.id,
      },
      attributes: [
        "id",
        "user_id",
        "firstname",
        "lastname",
        "phone_no",
        "state_id",
        "lg_id",
        "referal_code",
      ],
      raw: true,
    });
    return trader;
  },
  isVerified: async (user) => {
    let status = true;

    const verify = await User.findOne({
      where: { id: user.id, status: true },
      attributes: ["id", "username", "status"],
      raw: true,
    });

    if (verify != null) {
      status = false;
    }
    return status;
  },

  walletTransactionLog: async (user, responseData, company) => {

    /* save wallet transaction to wallet_logs table */

    let status;
    let state;

    try{
      if(responseData != null){
        responseData.code === '00'?status = "success": status = "failed";
        responseData.code === '00'?state = 1: state = 0;

        return await WalletLog.create({
          user_id: user.id,
          transaction_ref: responseData.transaction.reference,
          linkingreference: responseData.transaction.linkingreference,
          externalreference: responseData.transaction.externalreference,
          amount: responseData.order.amount,
          description: responseData.order.description,
          status: status,
          external_message: responseData.message,
          account_no: responseData.customer.account.number,
          currency: responseData.order.currency,
          company_id: company.id,
          external_date: responseData.transaction.date,
          state: state
        });
      }
    }catch(e){
      console.error("Error saving wallet transaction record:", e);
    }
  },

};
