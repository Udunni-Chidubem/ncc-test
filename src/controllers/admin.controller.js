require('dotenv').config()
const db = require('../models')
const utils = require('../helpers/utils');
const {User, UserRole, Role, Farmer, SeedCompany, States, LGAs, SeedTrader, Product }  = db
const { getPagingData, getPagination } = require('../helpers/pagination');
const { Op } = require("sequelize");


module.exports={
    getNascAdminRoles : async (req, res)=>{
        let roles = await Role.findAll({
            where : {
             [Op.or] :   [
                    {role_name : 'admin'},
                    {role_name : 'nasc'}
                ]
                    
            },
            raw:true
        })
        return roles
    }, 
    getFarmers: async (req, res) =>{
        let farmers = await Farmer.findAll({
            attributes : ['id', 'firstname', 'lastname', 'created_at'],
            include : [ 
                {
                    model : States,
                    attributes : ['name']
                },
                {
                    model : LGAs,
                    attributes : ['name']
                }
            ],
            order : [
            	['created_at', 'DESC']
            ]
         })
         farmers=JSON.stringify(farmers)

         console.log(farmers)

        return JSON.parse(farmers)
    },
    getCompanies : async (req, res)=>{
        let companies = await SeedCompany.findAll({
             include : [ 
                {
                    model : States,
                    attributes : ['name']
                },
                {
                    model : LGAs,
                    attributes : ['name']
                }
            ],
            order : [
            	['created_at', 'DESC']
            ]
        })

        companies = JSON.stringify(companies)
        return JSON.parse(companies)
    },
    getTraders:async (req, res)=>{
        let traders = await SeedTrader.findAll({
            include : [ 
                {
                    model : States,
                    attributes : ['name']
                },
                {
                    model : LGAs,
                    attributes : ['name']
                }
            ],
            order : [
            	['created_at', 'DESC']
            ]
        })
        traders = JSON.stringify(traders)
        return JSON.parse(traders)
    },

    getProducts:async (req, res)=>{
        let products=await Product.findAll({
             include : [ 
                {
                    model : User,
                    include : [
                        {
                            model : SeedCompany
                        }
                    ]
                }
            ]
        });
        products = JSON.stringify(products);
        return JSON.parse(products);
    },
    viewFarmer: async (req, res) => {
        const user = await req.user
        let response = null

        const singleFarmer = await Farmer.findOne({
            where: {id: req.params.id},
            attributes : ['id', 'firstname', 'lastname','gender', 'date_of_birth', 'level_of_education', 'nin', 'bvn', 'phone_no', 'state_id', 'created_at'],
            include : [ 
                {
                    model : States,
                    attributes : ['name']
                },
                {
                    model : LGAs,
                    attributes : ['name']
                }
            ]
        })

         if(singleFarmer){
            response = JSON.parse(JSON.stringify(singleFarmer))
            console.log(response)
        }
        return response
    }


}