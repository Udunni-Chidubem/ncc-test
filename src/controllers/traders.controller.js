require('dotenv').config()
const { Op, QueryTypes } = require("sequelize");
const db = require('../models')
const { User, Orders, SeedCompany, DeliveryInformation, LGAs, States, Product, Wallet, TransactionLog, TransactionCarts, Cart, Farmer, Banks } = db
const utils = require('../helpers/utils');
const { getPagingData, getPagination } = require('../helpers/pagination');
const bcrypt = require('bcrypt');



module.exports = {

    traderRefres: async (req,referal_id) => {
    try{
        let Referes = await Farmer.findAll({
            where: {referee: referal_id},
            attributes: ['created_at','firstname','lastname','id','user_id'],
            raw: true
        }) 
        Referes = JSON.parse(JSON.stringify(Referes))
        return Referes
    }
        catch(e){
            console.log(e)       
            return e
           }
    }
}