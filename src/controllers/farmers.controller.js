const db = require('../models');
const {User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States, DeliveryInformation, Product }  = db
const utils = require('../helpers/utils');
const { getPagination, getPagingData } = require('../helpers/pagination');

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
        const farmer = await utils.getFarmerProfile(user.dataValues)
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
        try{

            await User.update({status: true}, {where: {id: user.id} })

            const { firstname, lastname, date_of_birth, gender, level_of_education, state_id, lg_id, nin, bvn, farm_produce, state_of_delivery, lga_of_delivery, address } = req.body
            const data = {
                firstname, 
                lastname, 
                date_of_birth, 
                gender, 
                level_of_education, 
                state_id, 
                lg_id, 
                nin, 
                bvn,
                product_farmed: farm_produce.toString()
            }

            const farmer = await Farmer.update( data , {
                where: { user_id: user.id }
            }, {transaction: transaction})

            
            const existingDelivery = await DeliveryInformation.findOne({ where: { user_id: user.id}, 
                attributes: ['user_id', 'state_id', 'lg_id', 'address'], raw: true })

            if(!existingDelivery){
                const deliveryInformation = await DeliveryInformation.create({
                    user_id : user.id,
                    state_id:state_of_delivery,
                    lg_id: lga_of_delivery,
                    address
                }, { transaction: transaction})
            }else{
                //Update existing information
                const deliveryInformation = await Farmer.update( {
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
            transaction.rollback();
            return e
        }
    },
    marketPlace: async (req, res) => {
        const user = await req.user
        const farmer = await utils.getFarmerProfile(user)
        const isVerified = await utils.isVerified(user)

        let response = null

        const {page, size} = req.query
        const {limit, offset} = getPagination(page, size)

        const product = await Product.findAndCountAll({ 
            where: { status: 1},
            order: [
                ['id', 'DESC'],
            ],
            attributes: ['id','product_name', 'variant', 'description', 'item', 'file_name'],
            raw: true, limit, offset 
        })

        if(product){
            response = getPagingData(product, page, limit)
        }

        return { farmer, isVerified, response }
    },

    product: async (req, res) => {
        const user = await req.user
        const farmer = await utils.getFarmerProfile(user.dataValues)
        const isVerified = await utils.isVerified(user.dataValues)


        res.render('farmers/product', {
            layout : 'farmers-dashboard',
            title: 'Product',
            fullname: farmer.firstname + ' ' + farmer.lastname,
            farmerData: farmer.dataValues,
            isVerified
        })
    },

    cart: async (req, res) => {
        res.render('farmers/cart', {
            layout : 'farmers-dashboard',
            title: 'cart',
        })
    },

    viewProduct: async (req, res) => {
        const user = await req.user
        const farmer = await utils.getFarmerProfile(user.dataValues)
        const isVerified = await utils.isVerified(user.dataValues)


        res.render('farmers/view-product', {
            layout : 'farmers-dashboard',
            title: 'Product',
            fullname: farmer.firstname + ' ' + farmer.lastname,
            farmerData: farmer.dataValues,
            isVerified
        })
    },
    paymentPage: async (req, res) => {
        const user = await req.user
        const farmer = await utils.getFarmerProfile(user.dataValues)
        const isVerified = await utils.isVerified(user.dataValues)


        res.render('farmers/payment_page_preview', {
            layout : 'farmers-dashboard',
            title: 'Product',
            fullname: farmer.firstname + ' ' + farmer.lastname,
            farmerData: farmer.dataValues,
            isVerified
        })
    }

}