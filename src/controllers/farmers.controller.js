const db = require('../models');
const {User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States, DeliveryInformation }  = db
const utils = require('../helpers/utils');

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
                user_id : res.user.id
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
            const data = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                date_of_birth: req.body.date_of_birth,
                gender: req.body.gender,
                level_of_education: req.body.level_of_education,
                state_id: req.body.state_id,
                lg_id: req.body.lg_id,
                nin: req.body.nin,
                bvn: req.body.bvn,
                farm_produce: req.body.farm_produce.toString()
            }

            const farmer = await Farmer.update( data , {
                where: { user_id: user.id }
            }, {transaction: transaction})

            
            const existingDelivery = await DeliveryInformation.findOne({ where: { user_id: user.id}, 
                attributes: ['user_id', 'state_id', 'lg_id', 'address'], raw: true })

            if(!existingDelivery){
                const deliveryInformation = await DeliveryInformation.create({
                    user_id : user.id,
                    state_id: req.body.state_of_delivery,
                    lg_id: req.body.lga_of_delivery,
                    address: req.body.address
                }, { transaction: transaction})
            }else{
                //Update existing information
                const deliveryInformation = await Farmer.update( {
                    state_id: req.body.state_of_delivery,
                    lg_id: req.body.lga_of_delivery,
                    address: req.body.address
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
        const farmer = await utils.getFarmerProfile(user.dataValues)
        const isVerified = await utils.isVerified(user.dataValues)


        res.render('farmers/market_place', {
            layout : 'farmers-dashboard',
            title: 'Market Place',
            fullname: farmer.dataValues.firstname + ' ' + farmer.dataValues.lastname,
            farmerData: farmer.dataValues,
            isVerified
        })
    }

}