require('dotenv').config()
const db = require('../models')
const utils = require('../helpers/utils');
const {User, UserRole, Role, Farmer, SeedCompany, States, LGAs, DeliveryInformation, SeedTrader, Product }  = db
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
        // let traders = await adminController.getTraders(req, res)
        // let companies= await adminController.getCompanies(req, res)
        let isVerified = await utils.isVerified(user)
        let response = null

        const singleFarmer = await Farmer.findOne({
            where: {id: req.params.id},
            attributes : ['id', 'firstname', 'lastname','gender', 'date_of_birth', 'level_of_education', 'nin', 'bvn', 'phone_no', 'address_of_farm', 'user_id', 'created_at'],
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
        });

        let deliveryInfo = await DeliveryInformation.findOne({ 
            where: {user_id : JSON.parse(JSON.stringify(singleFarmer)).user_id}, 
            attributes: ['state_id', 'lg_id', 'address'],
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

        const delInfo = JSON.parse(JSON.stringify(deliveryInfo))

         if(singleFarmer){
            response = JSON.parse(JSON.stringify(singleFarmer))
            // console.log(response)
        }
        
    
    
        res.render('admin/view-user', {
            layout : 'admin-dashboard',
            title : 'View User',
            sub_title : 'View User',
            prev_link : '/admin/all-users',
            username : user.username,
            isVerified,
            response,
            delInfo
            // companies,
            // traders
        })
    }


}