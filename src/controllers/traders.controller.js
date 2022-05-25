const db = require('../models');
const bcrypt = require('bcrypt');
const {
        User, 
        Farmer, 
        UserRole, 
        Role, 
        SeedTrader, 
        SeedCompany, 
        LGAs, 
        States, 
        DeliveryInformation, 
        Product, 
        Cart, 
        TransactionLog, 
        TransactionCarts, 
        Wallet,
        Orders
    }  = db
const utils = require('../helpers/utils');
const { getPagination, getPagingData } = require('../helpers/pagination');
const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');
const { now } = require('moment');


module.exports={
marketPlace: async (req, res) => {
    const user = await req.user
    // const seed_trader = await utils.getTraderProfile(user)
    const isVerified = await utils.isVerified(user)

    let response, product

    const {page, size,Search, sorting} = req.query
    const {limit, offset} = getPagination(page, size)

    if(Search != null & sorting == null){
        //fetch data based on Search ONLY
             
        /**
         * The conditions below can be refactored based on what
         * the business requirement is
         */
        product = await Product.findAndCountAll({
            include : [
                {
                    model: User,
                    attributes: ['username'],
                    include : [
                        {
                            model : SeedCompany,
                            attributes: ['id', 'name_of_company', 'state_id'],
                            include : [{model : States, attributes: ['id', 'name']}]
                        }
                    ]
                }
            ],
            where:{
                [Op.or]: [
                    {
                      product_name: {
                        [Op.like]: `%${Search}%`
                      }
                    },
                    // {
                    //   variant: {
                    //     [Op.like]: `%${Search}%`
                    //   }
                    // },
                    // {
                    //     description: {
                    //         [Op.like]: `%${Search}%`
                    //     }
                    // }
                ],
                [Op.and]: [
                  {
                    status: {
                      [Op.eq]: 1
                    }
                  }
                ]
            },
            order: [
                ['id', 'DESC'],
            ],
            attributes: ['id','product_name', 'variant', 'description', 'item', 'file_name'],
            raw: true, limit, offset 
        })
    }

    if(product){
        response = getPagingData(product, page, limit)
    }


    return { isVerified, response }
},



}