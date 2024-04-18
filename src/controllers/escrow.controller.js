const { body } = require("express-validator");
const db = require("../models");
const uniqid=require('uniqid');
const escrow = require("../helpers/escrow");
const axios = require("axios").default;
require('dotenv').config();
const hashHelper = require('../helpers/helper.hash');

const { SeedCompany, Wallet } = db;

module.exports = {

    processFoundWithdrawer: async (req, res) => {
        const user = await req.user;
        const data = req.body; // request body: { amount: amount, password: password }

        try {
            const company = await SeedCompany.findOne({
                where: { user_id: user.id },
                attributes: ["name_of_company", "bank_account_name", "bank_account_no", "bank_code"]
            });
        
            // console.log("account No.: ", company.bank_account_no)
            // console.log("account Name: ", company.bank_account_name)
            // console.log("Bank Name: ", company.bank_code)

            if(company.bank_account_no == null || company.bank_account_name == null || company.bank_code == null){
                return { success: false, message: "Oop! You're yet to update your account information", status: 400 }
            }
            const wallet = await Wallet.findOne({
                where: { user_id: user.id },
                attributes: ["amount"]
            });

            if(wallet.amount < data.amount){
                return { success: false, message: "Insufient balance", status: 400 }
            }

            const date = new Date();
            // const formattedDate = date.toISOString();

            // const transferFee = 0.75;
            const transferRef = uniqid('VT')

            // Raw Data: privateKey + request.Customer.Account.SenderAccountNumber +
            // request.Customer.Account.Number + request.Customer.Account.Bank + request.order.Amount +
            // request.Transaction.Reference

            let toHash = process.env.psb_publicKey+process.env.escrow_acct_number+company.bank_account_no+company.bank_code+data.amount+'.00'+transferRef;
            console.log('Before hashed: ', toHash)
            // let toHash = process.env.psb_publicKey+process.env.escrow_acct_number+'1100000103'+'120001'+company.amount+transferRef;
            const hashToken = await hashHelper.generateSHA512Hash(toHash);

            let transferData = {
        
                publickey: process.env.psb_publicKey,
                    transaction: {
                        reference: transferRef,
                        // date: formattedDate
                    },
                    order: {
                        amount: data.amount+'.00',
                        description: "Virtual Settlement",
                        currency: "NGN",
                        country: "NGA"
                    },
                    customer: {
                        account: {
                            number: company.bank_account_no,
                            bank: company.bank_code,
                            name: company.name_of_company,
                            senderaccountnumber: process.env.escrow_acct_number,
                            sendername: process.env.escrow_acct_name,
                        }
                    },
                "hash": hashToken
            }

            const response = await escrow.processTransferToOtherBank(transferData);
            return response;

        } catch (error) {
            console.error("Error fetching account detail:", error);
        }
    },
}
