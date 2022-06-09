require('dotenv').config()
const { Op, QueryTypes } = require("sequelize");
const db = require('../models')
const { User, Orders, SeedCompany, DeliveryInformation, LGAs, States, Product, Wallet, TransactionLog, TransactionCarts, Cart, Farmer, Banks } = db
const utils = require('../helpers/utils');
const { getPagingData, getPagination } = require('../helpers/pagination');
const bcrypt = require('bcrypt');



module.exports = {
    updateProfile: async (req, res) => {
        const transaction = await db.rest.transaction();
        const user = await req.user

        const { name_of_company, phone_no, tin, address, licensed_no, state_id, lg_id, certification_number, email, bank_account_no, bank_account_name, bank_code } = req.body

        try {
            const data = { name_of_company, phone_no, tin, address, licensed_no, state_id, lg_id, certification_number, email, bank_account_name, bank_account_no, bank_code }
            await User.update({ status: true }, { where: { id: user.id } })

            const company = await SeedCompany.update(data, {
                where: { user_id: user.id }
            }, { transaction: transaction })
            transaction.commit();
            return { company }
        } catch (e) {
            transaction.rollback();
            return e
        }
    },
    createProduct: async (req, res, filename) => {

        const transaction = await db.rest.transaction();
        let min = [], qty = [], size = [], price = [];
        if (!Array.isArray(req.body.min_order)) {
            min.push(req.body.min_order)
            size.push(req.body.pkg_size)
            qty.push(req.body.quantity)
            price.push(req.body.price)
        } else {
            min = req.body.min_order
            size = req.body.pkg_size
            qty = req.body.quantity
            price = req.body.price
        }
        let item = {
            min: min,
            pkg: size,
            price: price,
            quantity: qty
        }

        item = await JSON.stringify(item, null, 2)

        const user = await req.user
        try {
            let p = await Product.create({
                product_name: req.body.productName,
                description: req.body.productDescription,
                variant: req.body.productVariant,
                item: item,
                user_id: user.id,
                file_name: filename,
                local_name : req.body.productLocalName,
                status : 0
            }, { transaction: transaction })
            transaction.commit()
            return p
        } catch (e) {
            transaction.rollback()
            return e
        }

    },
    listProducts: async (req, res) => {
        const user = await req.user
        let response = null

        const { page, size } = req.query
        const { limit, offset } = getPagination(page, size)

        const product = await Product.findAndCountAll({
            where: { user_id: user.id },
            order: [
                ['id', 'DESC'],
            ],
            attributes: ['id', 'product_name', 'variant', 'description', 'item', 'file_name', 'status', 'local_name'],
            raw: true, limit, offset
        })

        if (product) {
            response = getPagingData(product, page, limit)
        }
        return response
    },
    updateProduct: async (req, res) => {
        const transaction = await db.rest.transaction();
        try {
            let min = [], qty = [], size = [], price = [];
            if (req.files) {
                let p = await Product.findOne({
                    attributes: ['file_name'],
                    where: { id: req.params.id }
                })
                let upload = req.files.upload
                filename = p.file_name
                upload.mv('./public/product_images/' + filename)
            }
            if (!Array.isArray(req.body.min_order)) {
                min.push(req.body.min_order)
                size.push(req.body.pkg_size)
                qty.push(req.body.quantity)
                price.push(req.body.price)
            } else {
                min = req.body.min_order
                size = req.body.pkg_size
                qty = req.body.quantity
                price = req.body.price
            }
            let item = {
                min: min,
                pkg: size,
                price: price,
                quantity: qty
            }
            item = await JSON.stringify(item, null, 2)
            Product.update(
                {
                    product_name: req.body.productName,
                    description: req.body.productDescription,
                    variant: req.body.productVariant,
                    item: item,
                    local_name : req.body.productLocalName
                },
                {
                    where: { id: req.params.id }
                },
                {
                    transaction: transaction
                }
            )
            transaction.commit()
        } catch (e) {
            console.log(e)
            transaction.rollback
        }

    },
    viewProduct: async (req, res) => {
        const user = await req.user
        let response = null

        const singleProduct = await Product.findOne({
            where: { user_id: user.id, id: req.params.id },
            attributes: ['id', 'product_name', 'variant', 'description', 'item', 'file_name', 'local_name'],
            raw: true
        })

        if (singleProduct) {
            response = singleProduct
        }

        return response
    },
    creditWallet: async (carts) => {
        let transaction = await db.rest.transaction()
        try {
            // let transaction = db.rest.transaction()
            carts.forEach(async cart => {
                await Wallet.increment({
                    amount: cart.total_amount
                }, {
                    where: { user_id: cart.Product.user_id }
                }, { transaction: transaction })
            })
            transaction.commit()
        } catch (e) {
            transaction.rollback()
            console.log(e)
        }

    },
    getWallet: async (req, res) => {
        const user = await req.user
        let balance
        const singleBalance = await Wallet.findOne({
            where: { user_id: user.id },
            attributes: ['amount'],
            raw: true
        });

        balance = singleBalance
        return balance;
    },
    getProductCount: async (req, res) => {
        const user = await req.user
        let productCount
        const countProducts = await Product.count({
            where: { user_id: user.id }
        });

        productCount = countProducts
        return productCount;
    },
    getOrders: async (req, res) => {
        const user = await req.user
        let sql = "SELECT distinct tl.id, SUM(c.total_amount) as amount, tl.transaction_id, tl.created_at,"
            + "tl.updated_at, tl.transaction_ref,f.firstname, f.lastname, c.status as order_status, o.status, "
            + "tl.status as payment_status from cart c join transaction_carts tc on c.id = tc.cart_id join transaction_log tl "
            + "on tl.id=tc.transaction_log_id join orders o on tl.id = o.transaction_log_id join product p on p.id = c.product_id join farmer f on f.user_id=c.user_id "
            + "where p.user_id = " + user.id + " and (tl.transaction_id is not null and transaction_id <> '') GROUP by p.user_id, tl.id order by tl.created_at desc";
        let order = await db.rest.query(sql, { type: QueryTypes.SELECT })

        let orderStatus = order.orders_status
        return order
    },
    getTotalSales: async (company_id) => {
        let sql = "SELECT COUNT(status) as count, status FROM `orders` WHERE company_id=" + company_id + " and status is not null GROUP BY status";

        let totalsales = await db.rest.query(sql, {type: QueryTypes.SELECT})
        // console.log(totalsales)
        // console.log(sql)
        // console.log(company_id)
        // console.log('company_id')
        return totalsales
        
    },
    getProductOrders : async (req, product)=>{
        const user = await req.user
        let sql = "SELECT distinct tl.id, SUM(c.total_amount) as amount, tl.transaction_id, tl.created_at,"
            + "tl.updated_at, tl.transaction_ref,f.firstname, f.lastname, c.status as order_status, "
            + "tl.status as payment_status from cart c join transaction_carts tc on c.id = tc.cart_id join transaction_log tl "
            + "on tl.id=tc.transaction_log_id join product p on p.id = c.product_id join farmer f on f.user_id=c.user_id "
            + "where p.user_id = " + user.id + " and c.product_id ="+product+" GROUP by p.user_id, tl.id order by tl.created_at desc";
        let order = await db.rest.query(sql, { type: QueryTypes.SELECT })
        return order
    },
    getchartamount : async (req, id)=>{
        let sql = "SELECT * FROM orders as o join transaction_log as t WHERE o.transaction_log_id = t.id  and o.status = 4 and o.company_id = "+id ;
        let chartamount = await db.rest.query(sql, { type: QueryTypes.SELECT })
        chartamount = JSON.parse(JSON.stringify(chartamount));
        return chartamount
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
                        where: { user_id: user_id }
                    }]
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
                                attributes:['address'],
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
        return { order, farmer, orderStatus };
    },
    getOrderCount : async (company_id)=>{
       let orderCount=await Orders.count({
            where :  {  
                [Op.and]: [
                {
                    company_id: {
                      [Op.eq]: company_id
                    }
                },
                {
                  status: {
                    [Op.eq]: null
                  }
                }
              ]
            }
        }, {raw : true})
        return orderCount
    },
    updadeOrders:async (order_id, data)=>{
        Orders.update(data, { where : {id : order_id}})
    },

    updatePassword: async (req, res) => {
        let user = await req.user
        const isVerified = await utils.isVerified(user.dataValues)
        let newpassword = await bcrypt.hash(req.body.newpassword, 10)
        let username = req.body.userphoneno
        let message_ = "Updated Successfully"
        try{
            let status = await User.update({password:newpassword}, { where : {username: username}})
            return {status,isVerified,message_}
            
           } 
           catch(e){
            console.log(e)       
            return e
           }
    },

    settings: async (req, res) => {
        const user = await req.user
        const company = await utils.getCompanyProfile(user)
        const isVerified = await utils.isVerified(user.dataValues)

        res.render('seed_company/settings', {
            layout : 'company-dashboard',
            title: 'Settings',
            fullname: company.name_of_company,
            companyData: company,
            isVerified,
            company
        })
        
    },
    userUpdate : async (data, id)=>{
        User.update(
        data,
        {
            where : {id : id}
        })
    },
}