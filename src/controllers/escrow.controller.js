const { body } = require("express-validator");
const db = require("../models");
const uniqid = require("uniqid");
const escrow = require("../helpers/escrow");
const axios = require("axios").default;
require("dotenv").config();
const hashHelper = require("../helpers/helper.hash");
const bcrypt = require("bcrypt");
const utils = require("../helpers/utils");

const { SeedCompany, Wallet, User, WalletLog } = db;

module.exports = {
  /**
   * Process the withdrawal request from the user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<Object>} An object containing the success status, message, and status code.
   */
  processFoundWithdrawer: async (req, res) => {
    const user = await req.user;
    const data = req.body; // request body: { amount: amount, password: password }

    try {
      const loggedInUser = await User.findOne({
        where: { id: user.id },
      });
      if (!loggedInUser) {
        return {
          success: false,
          message: "They was an error verifying your account",
          status: 400,
        };
      }
      const verify_password = await bcrypt.compare(
        data.password,
        loggedInUser.password
      );

      if (verify_password === false) {
        return {
          success: false,
          message: "Invalid transaction password",
          status: 400,
        };
      }

      const company = await SeedCompany.findOne({
        where: { user_id: user.id },
        attributes: [
          "id",
          "name_of_company",
          "bank_account_name",
          "bank_account_no",
          "bank_code",
        ],
      });

      // console.log("account No.: ", company.bank_account_no)
      // console.log("account Name: ", company.bank_account_name)
      // console.log("Bank Name: ", company.bank_code)

      if (
        company.bank_account_no == null ||
        company.bank_account_name == null ||
        company.bank_code == null
      ) {
        return {
          success: false,
          message: "Oop! You're yet to update your account information",
          status: 400,
        };
      }
      const wallet = await Wallet.findOne({
        where: { user_id: user.id },
        attributes: ["amount"],
      });

      if (wallet.amount < data.amount) {
        return { success: false, message: "Insufient balance", status: 400 };
      }

      const transferRef = await hashHelper.generateRef(25);
      const amount = parseFloat(data.amount) + 0.01;

      // console.log("account No.: ", company.bank_account_no)
      // console.log("account Name: ", company.bank_account_name)
      // console.log("Bank Name: ", company.bank_code)

      let toHash =
        process.env.psb_privateKey +
        process.env.escrow_acct_number + // modify with dynamic float account number before go live
        company.bank_account_no + // modify with dynamic reciepient account number before go live
        company.bank_code + // modify with dynamic reciepient bank code before go live
        amount +
        transferRef;

      // let toHash = process.env.psb_publicKey+process.env.escrow_acct_number+'1100000103'+'120001'+company.amount+transferRef;
      const hashToken = await hashHelper.generateSHA512Hash(toHash);

      let transferData = {
        transaction: {
          reference: transferRef,
        },
        order: {
          amount: amount,
          description: "Virtual Settlement",
          currency: "NGN",
          country: "NGA",
        },
        customer: {
          account: {
            number: company.bank_account_no,
            bank: company.bank_code,
            name: company.name_of_company,
            senderaccountnumber: process.env.escrow_acct_number, // modify with dynamic float account number before go live
            sendername: process.env.escrow_acct_name, // modify with dynamic float account name before go live
          },
        },
        hash: hashToken,
      };
      // console.log(transferData);
      const response = await escrow.processTransferToOtherBank(transferData);
      if (response.code !== "00") {
        await utils.walletTransactionLog(user, response, company); // record wallet log
        return { success: false, message: response.message, status: 400 };
      }

      const updateWalletBalance = await Wallet.increment(
        { amount: -data.amount },
        { where: { user_id: user.id } }
      );

      if (updateWalletBalance.length === 1) {
        await utils.walletTransactionLog(user, response, company); // record wallet log
        return { success: true, message: "Withdrawal successful", status: 200 };
      }
      throw new Error("Failed to update wallet balance");
    } catch (error) {
      console.error("Error fetching account detail:", error);
    }
  },

  getWithdrawLog: async (req, res) => {
    try {
      const user = await req.user;

      // Retrieve page and pageSize from query parameters, default to page 1 and pageSize 10
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      // Calculate offset
      const offset = (page - 1) * pageSize;

      // Fetch records with limit and offset for pagination
      const response = await WalletLog.findAndCountAll({
        where: { user_id: user.id },
        attributes: ["transaction_ref", "amount", "status", "created_at"],
        order: [["created_at", "DESC"]],
        limit: pageSize,
        offset: offset,
      });

      // Prepare paginated response
      const paginatedResponse = {
        totalItems: response.count,
        totalPages: Math.ceil(response.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: response.rows,
      };

      return res.json(paginatedResponse);
    } catch (error) {
      console.error("Error fetching withdraw log:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
