require('dotenv').config()
const { Op } = require("sequelize");
const db = require('../models')
const {User,UserRole, Role, SeedCompany, LGAs, States, Product, Wallet, TransactionLog, TransactionCarts, Cart, Farmer}  = db
const utils = require('../helpers/utils');
const { getPagingData, getPagination } = require('../helpers/pagination');



module.exports = {
    updateProfile: async (req, res) => {
        const transaction = await db.rest.transaction();
        const user = await req.user

        const { name_of_company, phone_no, tin, address, licensed_no, state_id, lg_id, certification_number, email} = req.body

        try{
            const data = { name_of_company, phone_no, tin, address, licensed_no, state_id, lg_id, certification_number, email }

            await User.update({status: true}, {where: {id: user.id} })

            const company = await SeedCompany.update( data , {
                where: { user_id: user.id }
            }, {transaction: transaction})

            transaction.commit();
            return {company}
        }catch(e){
            transaction.rollback();
            return e
        }
    },
    createProduct : async (req, res, filename)=>{
        
        const transaction =await db.rest.transaction();
        let min=[], qty=[], size=[], price=[];
        if(!Array.isArray(req.body.min_order)){
            min.push(req.body.min_order)
            size.push(req.body.pkg_size)
            qty.push(req.body.quantity)
            price.push(req.body.price)
        }else{
            min=req.body.min_order
            size=req.body.pkg_size
            qty=req.body.quantity
            price=req.body.price
        }
        let item = {
            min : min, 
            pkg: size, 
            price:price, 
            quantity : qty
        }

        item = await JSON.stringify(item, null, 2)

        const user = await req.user
        try{
            let p = await Product.create({
                product_name : req.body.productName,
                description : req.body.productDescription,
                variant : req.body.productVariant,
                item : item,
                user_id : user.id,
                file_name : filename
            }, {transaction : transaction})
            transaction.commit()
            return p
        }catch(e){
            transaction.rollback()
            return e
        }
        
    },
    listProducts: async (req, res) => {
        const user = await req.user
        let response = null

        const {page, size} = req.query
        const {limit, offset} = getPagination(page, size)

        const product = await Product.findAndCountAll({ 
            where: { user_id: user.id},
            order: [
                ['id', 'DESC'],
            ],
            attributes: ['id','product_name', 'variant', 'description', 'item', 'file_name', 'status'],
            raw: true, limit, offset 
        })

        if(product){
            response = getPagingData(product, page, limit)
        }
        return response
    },
    updateProduct : async (req, res)=>{
        const transaction =await db.rest.transaction();
        try{
             let min=[], qty=[], size=[], price=[];
            if(req.files){
                let p = await Product.findOne({
                    attributes : file_name,
                    where: {id : req.params.id}
                })
                let upload=req.files.upload
                filename=p.file_name
                upload.mv('./public/product_images/'+filename)
            }
            if(!Array.isArray(req.body.min_order)){
                min.push(req.body.min_order)
                size.push(req.body.pkg_size)
                qty.push(req.body.quantity)
                price.push(req.body.price)
            }else{
                min=req.body.min_order
                size=req.body.pkg_size
                qty=req.body.quantity
                price=req.body.price
            }
            let item = {
                min : min, 
                pkg: size, 
                price:price, 
                quantity : qty
            }
            item = await JSON.stringify(item, null, 2)
            Product.update(
                {
                    product_name : req.body.productName,
                    description : req.body.productDescription,
                    variant : req.body.productVariant,
                    item : item
                }, 
                {
                    where : {id : req.params.id}
                },
                {
                    transaction :transaction
                }
            )
            transaction.commit()
        }catch(e){
            console.log(e)
            transaction.rollback
        }
        
    },
    viewProduct: async (req, res) => {
        const user = await req.user
        let response = null

        const singleProduct = await Product.findOne({
            where: { user_id: user.id, id: req.params.id},
            attributes: ['id','product_name', 'variant', 'description', 'item', 'file_name'],
            raw: true
        })

         if(singleProduct){
            response = singleProduct
        }

        return response
    },
    creditWallet : async (carts)=>{
        let transaction = await db.rest.transaction()
        try{
           // let transaction = db.rest.transaction()
            carts.forEach(async cart=>{
            await Wallet.increment({
                    amount : cart.total_amount
                }, {
                    where : {user_id : cart.Product.user_id}
                }, {transaction : transaction})
            })
            transaction.commit()
        }catch(e){
            transaction.rollback()
            console.log(e)
        }
       
    },
    getWallet : async (req, res)=>{
    const user = await req.user
       let balance 
       const singleBalance = await Wallet.findOne({
            where: {user_id: user.id},
            attributes : ['amount'],
            raw: true
        });
        
        balance = singleBalance
        console.log(balance)
        return balance;
    },
    getProductCount : async (req, res)=>{
        const user = await req.user
        let productCount
         const countProducts = await Product.count({
            where: {user_id: user.id}
        });

        productCount = countProducts
        console.log(productCount)
        return productCount;
    },
    getOrders : async (req, res)=>{
        const user = await req.user
        let order = await Cart.findAll({
            include : [
                {
                    model : Product,
                    where : {
                            user_id : user.id      
                     }
                },
                 {
                    model : User,
                    include : [
                        {
                            model : Farmer
                        }
                    ]
                },
                {
                    model : TransactionCarts,
                    include : [
                        {
                            model : TransactionLog,
                        }
                    ]
                }
            ],
            where : {
                status :1        
            } 
        })
        order=JSON.parse(JSON.stringify(order))
        console.log(order);
        return order
    }
}