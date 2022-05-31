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
const { json } = require('body-parser');

module.exports={
    dashboard : async (req, res)=>{
        let trader =await SeedTrader.findOne({
            include : [
                {
                    model : States,
                    attributes : ['id', 'name']
                },
                {
                    model : LGAs,
                    attributes : ['id', 'name']
                }
            ],
            where : {
                user_id : res.user.id, status: 1, 
            }
        });
        return trader;
    },
    updateProfile: async (req, res) => {
        const user = await req.user
        const trader = await utils.getTraderProfile(user)
        const isVerified = await utils.isVerified(user.dataValues)

        let states = await States.findAll({
            attributes : ['id', 'name'],
            raw: true
        });

        let deliveryInfo = await DeliveryInformation.findOne({ 
            where: {user_id : user.id}, 
            attributes: ['state_id', 'lg_id', 'address'], raw: true
        })

        res.render('seed_trader/update-profile', {
            layout : 'traders-dashboard',
            title: 'Update Profile',
            fullname: trader.firstname + ' ' + trader.lastname,
            tradersData: trader,
            states : states,
            isVerified,
            deliveryInfo
        })
    },
    settings: async (req, res) => {
        const user = await req.user
        const trader = await utils.getTraderProfile(user)
        const isVerified = await utils.isVerified(user.dataValues)

        res.render('seed_trader/settings', {
            layout : 'traders-dashboard',
            title: 'Settings',
            fullname: trader.firstname + ' ' + trader.lastname,
            traderData: trader,
            isVerified,
            trader
        })
        
    },
    userUpdate : async (data, id)=>{
        User.update(
        data,
        {
            where : {id : id}
        })
    },
    updatePassword: async (req, res) => {
        const user = await req.user
        const trader = await utils.getTraderProfile(user)
        const isVerified = await utils.isVerified(user.dataValues)
        let newpassword = await bcrypt.hash(req.body.newpassword, 10)
        let username = req.body.userphoneno
        let message_ = "Updated Successfully"
        try{
        let sql = "update user set password='"  + newpassword + "' where username = " +  username +";"
            let status = await db.rest.query(sql, { type: QueryTypes.UPDATE })
            return {status,trader,isVerified,message_}
            
           } 
           catch(e){
            console.log(e)       
            return e
           }
    },

    editProfileData: async (req, res) => {
        const transaction = await db.rest.transaction();
        const user = await req.user
        let deliveryInformation
        let filename
        try{
            if(req.files){
                let upload=req.files.upload
                name=upload.name.split(".")
                filename=user.id+"."+name[name.length-1]
                upload.mv('./public/profile_pics/'+filename)
            }
            const { 
                firstname, 
                lastname, 
                age, 
                gender, 
                level_of_education, 
                state_id, 
                lg_id,
                nin, 
                bvn, 
                state_of_delivery, 
                lga_of_delivery, 
                address,
                bank_account_no, bank_account_name, bank_code
                } = req.body
            const data = {
                firstname, 
                lastname, 
                age, 
                gender, 
                level_of_education, 
                state_id, 
                lg_id, 
                nin, 
                bvn,  
                state_of_delivery, 
                lga_of_delivery, 
                address,
                bank_account_no, 
                bank_account_name, 
                bank_code,
                profile_pic:filename
            }

            const trader = await SeedTrader.update( data , {
                where: { user_id: user.id }
            }, {transaction: transaction})

            await User.update({status: true}, {where: {id: user.id} }, {transaction: transaction})

            
            const existingDelivery = await DeliveryInformation.findOne({ where: { user_id: user.id}, 
                attributes: ['user_id', 'state_id', 'lg_id', 'address'], raw: true })

            if(!existingDelivery){
                deliveryInformation = await DeliveryInformation.create({
                    user_id : user.id,
                    state_id:state_of_delivery,
                    lg_id: lga_of_delivery,
                    address
                }, { transaction: transaction})
            }else{
                //Update existing information
                deliveryInformation = await DeliveryInformation.update( {
                    state_id: state_of_delivery,
                    lg_id: lga_of_delivery,
                    address: address
                } , {
                    where: { user_id: user.id }
                }, {transaction: transaction})
            }
            transaction.commit();
            return {trader, deliveryInformation};
        }catch(e){
            console.log(e);
            transaction.rollback();
            return e
        }
    },
    marketPlace: async (req, res) => {
        const user = await req.user
        const trader = await utils.getTraderProfile(user)
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


        return { trader, isVerified, response }
    },
    product: async (req, res) => {
        const user = await req.user
        const trader = await utils.getTraderProfile(user)
        const isVerified = await utils.isVerified(user)

        res.render('seed_trader/product', {
            layout : 'traders-dashboard',
            title: 'Product',
            fullname: trader.firstname + ' ' + trader.lastname,
            traderData: trader,
            isVerified
        })

    },
    viewProduct: async (req, res) => {
        const user = await req.user
        const trader = await utils.getTraderProfile(user)
        const isVerified = await utils.isVerified(user)

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
            where: {id: req.params.id, status: 1},
            attributes: ['id','product_name', 'variant', 'description', 'item', 'file_name'],
            raw: true
        })


        return {trader, isVerified, singleProduct}
    },
    paymentPage: async (req, res) => {
       // const user = await req.user
       // const trader = await utils.getTraderProfile(user)
       // const isVerified = await utils.isVerified(user)
       // const {getCartItems}=await this.cart(req.res)
        res.render('seed_trader/order_preview', {
            layout : 'traders-dashboard',
            title: 'Market Place',
            sub_title : 'Checkout',
            prev_link: '/seed_trader/cart',
            fullname: trader.firstname + ' ' + trader.lastname,
            traderData: trader,
            isVerified
        })
    },
    singleProduct:async (product_id)=>{
         const singleProduct = await Product.findOne({
            where: {id: product_id, status: 1},
            attributes: ['id','product_name', 'variant', 'description', 'item', 'file_name'],
            raw: true
        })
        return singleProduct;
    },
    cart: async (req, res) => {
        const user = await req.user
        const trader = await utils.getTraderProfile(user)
        const isVerified = await utils.isVerified(user)

        let getCartItems = await Cart.findAll({ 
            include : [
                {
                    model: Product,
                    attributes: ['user_id', 'product_name', 'variant', 'description', 'item', 'file_name', 'status'],
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
                    ]
                }
            ],
            where: {
            [Op.and]: [
                {
                    user_id: {
                      [Op.eq]: user.id
                    }
                },
                {
                  status: {
                    [Op.eq]: 0
                  }
                }
              ]
        }, 
        order: [
            ['id', 'DESC'],
        ],
        })
        getCartItems = JSON.parse(JSON.stringify(getCartItems))
        return { trader, isVerified, getCartItems }
    },
    getTraderCartCount: async (req, res) => {
        const user = await req.user
        const cartCount = await Cart.count({ where: {
            [Op.and]: [
                {
                    user_id: {
                      [Op.eq]: user.id
                    }
                },
                {
                  status: {
                    [Op.eq]: 0
                  }
                }
              ]
        }, raw: true})

        return cartCount
    },

    addToCart: async (req, res) => {
        const user = await req.user
        const {pid, price, size, quantity} = req.body

        let cartItems
        /**
         * First check if item has already been added to cart
         * and has not been paid
         */
        const isItemAlreadyAdded = await Cart.findOne({ where: {
            [Op.and]: [
                {
                    product_id: {
                      [Op.eq]: pid
                    }
                },
                {
                    user_id: {
                      [Op.eq]: user.id
                    }
                },
                {
                  status: {
                    [Op.eq]: 0
                  }
                },
                {
                   size : {
                       [Op.eq] : size
                   } 
                }
              ]
        }, raw: true})

        if(!isItemAlreadyAdded){
            cartItems = await Cart.create({
                user_id : user.id,
                product_id: pid,
                unit_price: price,
                size: size,
                qty: quantity,
                total_amount: parseInt(price * quantity)
            })
        }

        return {cartItems, isItemAlreadyAdded}
    },
    singleCartItem: async (req, res) => {
        const user = await req.user
        const {price, size, quantity} = req.body

        let cartItems, productCheck
        /**
         * 1. Check if the product exist
         * 2. check if item has already been added to cart
         * and has not been paid
         */
        const product = await Product.findOne({ where: { id: req.params.id, status: 1}, attributes: ['id'], raw: true})

        const isItemAlreadyAdded = await Cart.findOne({ where: {
            [Op.and]: [
                {
                    product_id: {
                      [Op.eq]: req.params.id
                    }
                },
                {
                    user_id: {
                      [Op.eq]: user.id
                    }
                },
                {
                    size: {
                      [Op.eq]: size
                    }
                },
                {
                    qty: {
                      [Op.eq]: quantity
                    }
                },
                {
                  status: {
                    [Op.eq]: 0 //o means items has not been paid for, 1 means item has been purchased
                  }
                }
              ]
        }, raw: true})

        if(!isItemAlreadyAdded){
            let newPrice = price.split('₦')[1]
            cartItems = await Cart.create({
                user_id : user.id,
                product_id: req.params.id,
                unit_price: newPrice,
                size: size,
                qty: quantity,
                total_amount: parseInt(newPrice * quantity)
            })
        }

        return {cartItems, isItemAlreadyAdded, product}
    },
    initializeTransaction : async (req, res, ref, getCartItems, trader)=>{
        
        let transaction =await db.rest.transaction()
        try{
            let log=await TransactionLog.create({
                seedtrader_id : trader.id,
                transaction_ref : ref,
                status : 'initiated',
                pickup_point:req.body.pickup,
                created_at : await now()
            }, {transaction : transaction})
            for(let i=0; i<getCartItems.length; i++){
              await  TransactionCarts.create({
                    transaction_log_id : log.id,
                    cart_id : getCartItems[i].id,
                    created_at :await now(),
                }, {transaction : transaction})
            }
            transaction.commit();
            return log
        }catch(e){
            console.log(e)
            transaction.rollback()
            return e
        }
    },
    checkTransaction: async (ref)=>{
        let t=await TransactionLog.findOne({
            include : [
                {
                    model : TransactionCarts,
                    attributes : ['cart_id']
                    
                }
            ],
            where : {
                transaction_ref : ref
            }
        })
        // if(t){
        //     return t
        // }
        return t
    },
    updateTransactionLog:async (data, ref)=>{
        let transaction=await db.rest.transaction()
        try{
            await TransactionLog.update(
            data,
            {
                where : {
                    transaction_ref : ref
                }
            },
            {
                transaction : transaction
            }
        )
        transaction.commit()
        return true
        }catch(e){
            transaction.rollback()
            console.log('update transaction error', e)
            return false
        }
        
    },
    updateCart:async (ids)=>{
         let transaction =await db.rest.transaction()
         try{
           // for(let i=0; i<items.length; i++){
                await  Cart.update({
                    status : 1,
                    updated_at: now()
                },{
                    where : {
                        id: {[Op.in] : ids}
                    }
                }, {transaction : transaction})
          //  }
            transaction.commit()
         }catch(e){
            console.log(e)
            transaction.rollback()
         }
        
    },
    deliveryInfo : async (user_id)=>{
        let d=await DeliveryInformation.findOne({
            where : { user_id : user_id},
            include :[{model : States}, {model : LGAs}],
            attributes : ['address']
        })
        return JSON.parse(JSON.stringify(d))                              
    },
    getTransactions : async (seedtrader_id)=>{
        let transactions= await TransactionLog.findAll({
            include  : [
                {
                    model : TransactionCarts,
                    include : [
                        {
                            model : Cart,
                            include : [
                               { 
                                   model : Product,
                                   attributes : ['product_name']
                               }
                            ]
                        }
                    ]
                }
            ],
            attributes : ['transaction_id','transaction_ref', 'status', 'created_at'],
            where : {
                seedtrader_id : seedtrader_id
            }
        });
        console.log(JSON.parse(JSON.stringify(transactions)))
        return JSON.parse(JSON.stringify(transactions))
    },
    productItemsUpdate:async (product_id, size, quantity)=>{
        let p = await Product.findOne({
            where : {id : product_id}
        })
        p.item=JSON.parse(p.item)
        for(let i=0; i<p.item.pkg.length; i++){
            if(p.item.pkg[i]==size){
                p.item.quantity[i]=p.item.quantity[i]-quantity
            }
        }
        p.item=JSON.stringify(p.item, null, 2)
        p.save()
    },
    deleteItem : async (req, res)=>{
        Cart.destroy({
            where : {id : req.params.id}
        })
    },
    getTransactionlogCount : async (seedtrader_id)=>{
        let transactionCount = await TransactionLog.count({
            where : {
                seedtrader_id : seedtrader_id
            }
        })

        return transactionCount
    },
    createOrder:async (ids, transaction_log_id)=>{
        let sql = "SELECT distinct s.id as company_id FROM cart c join product p on p.id = c.product_id join seedcompany s on s.user_id = p.user_id WHERE c.id IN (:ids)"
        let companys= await db.rest.query(sql, {
            replacements: { ids : ids },
            type : QueryTypes.SELECT}
            )
        let transaction = await db.rest.transaction()
        try{
            for(let i=0; i<companys.length; i++){
              await  Orders.create({
                    transaction_log_id : transaction_log_id,
                    company_id : companys[i].company_id,
                }, {transaction : transaction})
            }
            transaction.commit()
        }catch(e){
            console.log(e)
            transaction.rollback()
        }
    },

    getCartItemsByIds:async (req,ids)=>{
        const user = await req.user
        const trader = await utils.getTraderProfile(user)
        const isVerified = await utils.isVerified(user)
        let items=await Cart.findAll({
             include : [
                {
                    model: Product,
                    attributes: ['user_id', 'product_name', 'variant', 'description', 'item', 'file_name', 'status'],
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
                    ]
                }
            ],
            where : {
               id: {[Op.in] : ids}
            }
        })
        let getCartItems = JSON.parse(JSON.stringify(items))
        return { trader, isVerified, getCartItems }
    },

    getOrder: async (req,res) =>{
        let transaction_id = req.params.transaction_id
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
                        include: [{
                            model: User,
                            include: [{
                                model: SeedCompany
                            }]
                        }]
                    }]
                }
            ]
        })
        order = JSON.parse(JSON.stringify(order))
        return order
    },
    cartByProductId : async (req)=>{
       // let product_id = req.query.product
        const user = await req.user
        const trader = await utils.getTraderProfile(user)
        const isVerified = await utils.isVerified(user)
        let items=await Cart.findAll({
             include : [
                {
                    model: Product,
                    attributes: ['user_id', 'product_name', 'variant', 'description', 'item', 'file_name', 'status'],
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
                    ]
                }
            ],
            where : {
            [Op.and]: [
                {
                    product_id: {
                      [Op.eq]: req.query.product
                    }
                },
                {
                  status: {
                    [Op.eq]: 0 //o means items has not been paid for, 1 means item has been purchased
                  }
                },
                {
                  user_id: {
                    [Op.eq]: user.id //o means items has not been paid for, 1 means item has been purchased
                  }
                },
                  {
                    user_id: {
                      [Op.eq]: user.id
                    }
                },
                {
                    size: {
                      [Op.eq]: req.query.size
                    }
                },
                {
                    qty: {
                      [Op.eq]: req.query.qty
                    }
                },
            ]
        }
        })
        let getCartItems = JSON.parse(JSON.stringify(items))
        return { trader, isVerified, getCartItems }
    },
    orderStatus : async (req,res) =>{
        let transaction_id = req.params.transaction_id
            let sql = "select o.id as order_id ,p.description as description, p.product_name as product_name, p.file_name as" +
            " file_name, sc.name_of_company as name_of_company, c.size as size , c.product_id as p_id,tl.transaction_ref as transaction_ref, "
            + " c.qty as qty, c.unit_price as price, c.total_amount as total_amount, o.status as status, o.updated_at as updated_at, tl.currency "
            +" as currency , tl.pickup_point as pickup_point FROM (transaction_carts tc  JOIN  transaction_log tl on tc.transaction_log_id=tl.id  JOIN cart as c " +
               "  on c.id = tc.cart_id JOIN product as p on c.product_id = p.id JOIN seedcompany as sc on sc.user_id = p.user_id )  JOIN orders as o on o.transaction_log_id "
               + " = tl.id and o.company_id=sc.id WHERE tl.transaction_id = "+ transaction_id + ";"
            let status = await db.rest.query(sql, { type: QueryTypes.SELECT })
            return status
    },

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
        },
        farmer_info: async (req,res) => {
            let farmer_id = req.params.user_id
            try{
                let farmer_info = await Farmer.findOne({
                    where: {user_id: farmer_id},
                    include: [
                        {
                            model: States,
                        },
                        {
                            model: LGAs 
                        },
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
                farmer_info = JSON.parse(JSON.stringify(farmer_info))
                console.log(farmer_info)
                return farmer_info
            }
            catch(e){
                console.log(e)
                return e
            }
        }

}