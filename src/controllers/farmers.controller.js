const db = require('../models');
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
    dashboard : async (req, res)=>{
        let farmer =await Farmer.findOne({
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
        return farmer;
    },
    updateProfile: async (req, res) => {
        const user = await req.user
        const farmer = await utils.getFarmerProfile(user)
        const isVerified = await utils.isVerified(user.dataValues)

        let states = await States.findAll({
            attributes : ['id', 'name'],
            raw: true
        });

        let deliveryInfo = await DeliveryInformation.findOne({ 
            where: {user_id : user.id}, 
            attributes: ['state_id', 'lg_id', 'address'], raw: true
        })

        res.render('farmers/update-profile', {
            layout : 'farmers-dashboard',
            title: 'Update Profile',
            fullname: farmer.firstname + ' ' + farmer.lastname,
            farmerData: farmer,
            states : states,
            isVerified,
            deliveryInfo
        })
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
                date_of_birth, 
                gender, 
                level_of_education, 
                state_id, 
                lg_id,
                nin, 
                bvn, 
                farm_produce, 
                state_of_delivery, 
                lga_of_delivery, 
                address, 
                source_type,  
                address_of_farm,
                farm_size,
                village,
                ward } = req.body
            const data = {
                firstname, 
                lastname, 
                date_of_birth: date_of_birth ? date_of_birth : '1960-01-01', 
                gender, 
                level_of_education, 
                state_id, 
                lg_id, 
                nin, 
                bvn,
                source_type,
                address_of_farm,
                farm_size,
                product_farmed: farm_produce.toString(),
                village,
                ward,
                profile_pic:filename
            }

            const farmer = await Farmer.update( data , {
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
            return {farmer, deliveryInformation};
        }catch(e){
            console.log(e);
            transaction.rollback();
            return e
        }
    },
    marketPlace: async (req, res) => {
        const user = await req.user
        const farmer = await utils.getFarmerProfile(user)
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


        return { farmer, isVerified, response }
    },
    product: async (req, res) => {
        const user = await req.user
        const farmer = await utils.getFarmerProfile(user)
        const isVerified = await utils.isVerified(user)

        res.render('farmers/product', {
            layout : 'farmers-dashboard',
            title: 'Product',
            fullname: farmer.firstname + ' ' + farmer.lastname,
            farmerData: farmer,
            isVerified
        })

    },
    viewProduct: async (req, res) => {
        const user = await req.user
        const farmer = await utils.getFarmerProfile(user)
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


        return {farmer, isVerified, singleProduct}
    },
    paymentPage: async (req, res) => {
       // const user = await req.user
       // const farmer = await utils.getFarmerProfile(user)
       // const isVerified = await utils.isVerified(user)
       // const {getCartItems}=await this.cart(req.res)
        res.render('farmers/order_preview', {
            layout : 'farmers-dashboard',
            title: 'Market Place',
            sub_title : 'Checkout',
            prev_link: '/farmer/cart',
            fullname: farmer.firstname + ' ' + farmer.lastname,
            farmerData: farmer,
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
        const farmer = await utils.getFarmerProfile(user)
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
        return { farmer, isVerified, getCartItems }
    },
    getFarmerCartCount: async (req, res) => {
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
    initializeTransaction : async (req, res, ref, getCartItems, farmer)=>{
        //const {getCartItems, farmer}=await cart(req, res)
        
        let transaction =await db.rest.transaction()
        try{
            let log=await TransactionLog.create({
                farmer_id : farmer.id,
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
    getTransactions : async (farmer_id)=>{
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
                farmer_id : farmer_id
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
    getTransactionlogCount : async (farmer_id)=>{
        let transactionCount = await TransactionLog.count({
            where : {
                farmer_id : farmer_id
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
        const farmer = await utils.getFarmerProfile(user)
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
        return { farmer, isVerified, getCartItems }
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
                        model: Product
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
        const farmer = await utils.getFarmerProfile(user)
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
        return { farmer, isVerified, getCartItems }
    }

}