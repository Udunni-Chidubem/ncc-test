const db = require('../models');
const {User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States, DeliveryInformation, Product }  = db
const utils = require('../helpers/utils');
const { getPagination, getPagingData } = require('../helpers/pagination');
const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize')

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
        try{

            const { firstname, lastname, date_of_birth, gender, level_of_education, state_id, lg_id, nin, bvn, farm_produce, state_of_delivery, lga_of_delivery, address } = req.body
            const data = {
                firstname, 
                lastname, 
                date_of_birth: date_of_birth ? date_of_birth : null, 
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
        const user = await req.user
        const farmer = await utils.getFarmerProfile(user)
        const isVerified = await utils.isVerified(user)

        res.render('farmers/order_preview', {
            layout : 'farmers-dashboard',
            title: 'Order Preview',
            fullname: farmer.firstname + ' ' + farmer.lastname,
            farmerData: farmer,
            isVerified
        })
    }

}