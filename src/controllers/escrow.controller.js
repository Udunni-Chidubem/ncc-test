const { body } = require("express-validator");
const db = require("../models");
const uniqid=require('uniqid');
const escrow = require("../helpers/escrow");
const axios = require("axios").default;
require('dotenv').config()

const { SeedCompany, Wallet } = db;

module.exports = {

    getSeedCompanyPayoutDetail: async (req, res) => {
        const user = await req.user;
        const data = req.body; // request body: { amount: amount, password: password }

        try {
            const company = await SeedCompany.findOne({
                where: { user_id: user.id },
                attributes: ["name_of_company", "bank_account_name", "bank_account_no", "bank_code"]
            });
        
            console.log("account No.: ", company.bank_account_no)
            console.log("account Name: ", company.bank_account_name)
            console.log("Bank Name: ", company.bank_code)

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

            // let transferData = {
            //     amount: data.amount,
            //     bankCode: company.bank_code, 
            //     bankName: company.bank_account_name,
            //     crAccount: company.bank_account_no,
            //     description: "Seed company withdrawer", 
            //     drAccount: process.env.escrow_acct,
            //     transactionReference: uniqid()
            // }

            const date = new Date();
            const formattedDate = date.toISOString();

            let transferData = {
        
                publickey: process.env.psb_publicKey,
                    transaction: {
                        reference: uniqid('VT'),
                        linkingreference: null,
                        externalreference: null,
                        date: formattedDate
                    },
                    order: {
                        amount: company.amount,
                        description: "Virtual Settlement",
                        currency: "NGN",
                        country: "NGA"
                    },
                    customer: {
                    account: {
                        number: company.bank_account_no,
                        bank: company.bank_code,
                        name: company.name_of_company,
                        bvn: "22222222222",
                        senderaccountnumber: "1100015371",
                        sendername: "9PSB Agent/Oyenike Adeola",
                        kyc: null
                    }
                    },
                    transferfee: {
                    fee: 0.75,
                    feedetail: [
                        {
                            AccountName: null,
                            AccountNumber: "00960011010001178",
                            Amount: 0.49
                        },
                    ]
                },
                "hash":"C53B53F7A8024E7283B14006E24F9E14927FCC7DA6E66491A447FE6224ECF6F49DB79BD6746AB7898E31105AAA20C36E2B4241083874786C4078B02F73FCDFDC"
                 
            }

            let token=await escrow.generateToken();
            if(token.responseCode=='00'){
                let transfer= await escrow.transferOther(transferData, token.tokenDetail.token)
                console.log(transfer)
                return { transferRes: transfer };
            }else{
                return {tokenRes: token }
            }


        } catch (error) {
            console.error("Error fetching account detail:", error);
        }
        
        
    },
}
