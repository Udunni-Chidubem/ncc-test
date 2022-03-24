const db = require('../models');
const {User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States }  = db
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

        let states = await States.findAll({
            attributes : ['id', 'name']
        });

        res.render('farmers/update-profile', {
            layout : 'farmers-dashboard',
            title: 'Update Profile',
            fullname: farmer.dataValues.firstname + ' ' + farmer.dataValues.lastname,
            farmerData: farmer.dataValues,
            states : states
        })
    },
    editProfileData: async (req, res) => {
        
    }

}