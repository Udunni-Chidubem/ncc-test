require('dotenv').config()
const db = require('../models')
const utils = require('../helpers/utils');
const {User, UserRole, Role, Farmer, SeedCompany,TransactionCarts, Cart,States, LGAs, DeliveryInformation, SeedTrader, Product, Wallet, Orders, TransactionLog}  = db
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
            // attributes : ['id', 'firstname', 'lastname', 'created_at'],
            include : [ 
                {
                    model : States,
                    attributes : ['name']
                },
                {
                    model : LGAs,
                    attributes : ['name']
                },
                {
                    model : User,
                }
            ],
            order : [
            	['updated_at', 'DESC']
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
                },
                 {
                    model : User,
                }
            ],
            order : [
            	['updated_at', 'DESC']
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
                },
                
            ],
            order : [
            	['updated_at', 'DESC']
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
            ],
            order: [
                ['updated_at', 'DESC'],
            ],
        });
        products = JSON.stringify(products);
        return JSON.parse(products);
    },


    getOneFarmer: async (req, res)=>{
        let farmer
        /* Find Farmer Begins*/
        const singleFarmer = await Farmer.findOne({
            where: {user_id: req.params.id},
            attributes : ['id', 'firstname', 'lastname','gender', 'date_of_birth', 'level_of_education', 'nin', 'bvn', 'phone_no', 'address_of_farm', 'user_id', 'created_at'],
            include : [ 
                {
                    model : States,
                    attributes : ['name']
                },
                {
                    model : LGAs,
                    attributes : ['name']
                },
                {
                    model: User,
                    attributes: ['id', 'status'],
                    include : [
                        {
                            model: DeliveryInformation,
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
                        }
                    ]
                }
            ]
        });

        
        if(singleFarmer){
            farmer = JSON.parse(JSON.stringify(singleFarmer))    
        };
        /* Find Farmer - Ends */
        return farmer
    },

    getOneCompany : async (req, res) => {
        let company
        /* FInd Seed Company - Begins*/
        const singleCompany = await SeedCompany.findOne({
            where: {user_id: req.params.id},
            attributes: ['id', 'name_of_company', 'email', 'phone_no', 'address', 'licensed_no', 'certification_number', 'tin'],
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

        if (singleCompany) {
            company = JSON.parse(JSON.stringify(singleCompany))
            console.log(singleCompany.toJSON())
        };
        /* Find Seed Company - Ends */
        return company
    },

    getOneTrader : async (req, res) => {
        let trader
        /* Find Seed Trader - Begin */
        const singleTrader = await SeedTrader.findOne({
            where: {user_id: req.params.id},
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

        if (singleTrader) {
            trader = JSON.parse(JSON.stringify(singleTrader))
            console.log(singleTrader.toJSON())
        };
        /*Find Seed Trader - Ends */

        return trader
    },
    getProductsByUserID:async (req, res)=>{
        let productsById =await Product.findAll({
            where: {user_id: req.params.id}
        });
        productsById = JSON.stringify(productsById);
        return JSON.parse(productsById);
    },
    getFarmerCount : async (req, res)=>{
        let farmerCount =await Farmer.count({
            // where: {id: req.params.id}
        });

        farmerCount = farmerCount;
        return farmerCount;
    },
    getCompanyCount : async (req, res)=>{
        let companyCount =await SeedCompany.count({
            // where: {id: req.params.id}
        });

        companyCount = companyCount;
        return companyCount;
    },
    getWallet : async (req, res)=>{
       let balance = await Wallet.findOne({
            where: {user_id: req.params.id},
            attributes : ['amount'],
            raw: true
        });
        
        balance = balance
        console.log(balance)
        return balance;
    },
    viewProduct: async (req, res) => {
        const singleProduct = await Product.findOne({
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
            where: {id: req.params.id},
            attributes: ['id','product_name', 'variant', 'description', 'item', 'file_name', 'status', 'created_at'],
            raw: true
        })

        console.log(req.params.singleProduct)
        return singleProduct;
    },
    productUpdate:async (data, id)=>{
        Product.update(
            data,
            {
                where : {id : id}
            }
        )
    },
    userUpdate : async (data, id)=>{
        User.update(
        data,
        {
            where : {id : id}
        })
    },
    getOrders : async (req, res) => {
        let orders = await Orders.findAll({
            include : [
                {
                    model : SeedCompany,
                    attributes : ['name_of_company','id']
                },
                {
                    model : TransactionLog,
                    include : [
                            {
                                model : Farmer,
                                attributes : ['firstname', 'lastname', 'id']
                            }
                    ]
                }
            ]
        });


        orders = JSON.stringify(orders);
        console.log(orders)
        return JSON.parse(orders);
    },

    getOrder: async (transaction_id, user_id, company_id) => {
        // const user = await req.user
        let farmer=null, orderStatus=null
        let order = await TransactionCarts.findAll({
            include: [
                {
                    model: TransactionLog,
                    where: { transaction_id: transaction_id }
                },
                {
                    model: Cart,
                    include: [{
                        model: Product,
                    },
                    {
                        model : User,
                        include : [{model : Farmer}]
                    }
                ]
                }
            ]
        })
        
        order = JSON.parse(JSON.stringify(order))
        if(order.length){
            farmer = await Farmer.findOne({
                where: { id: order[0].TransactionLog.farmer_id },
                include: [
                    {
                        model: User,
                        include: [
                            {
                                model: DeliveryInformation,
                                include: [{ model: States }, { model: LGAs }]
                            }
                        ]
                    }
                ]
            })

            orderStatus=await Orders.findOne({
                where :  {  
                    [Op.and]: [
                    {
                        company_id: {
                        [Op.eq]: company_id
                        }
                    },
                    {
                    transaction_log_id: {
                        [Op.eq]: order[0].transaction_log_id
                    }
                    }
                ]
                }
            })
        }
     
        farmer = JSON.parse(JSON.stringify(farmer))
        orderStatus = JSON.parse(JSON.stringify(orderStatus))
        console.log(order)
        return { order, farmer, orderStatus };
    },
}