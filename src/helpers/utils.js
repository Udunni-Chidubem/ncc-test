require('dotenv').config()
const db = require('../models')
const {User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States }  = db

module.exports = {
    getFarmerProfile: async (user) => {
         let farmer =await Farmer.findOne({
           // attributes : ['firstname', 'lastname', 'phone_no', 'age', 'account_no', 'account_name'],
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
                user_id : user.id
            }
        });
        return farmer;
    },
    getTraderProfile: (user) => {
        
    },
    getCompanyProfile: async (user) => {
        let company =await SeedCompany.findOne({
             where : {
                 user_id : user.id
             },
             attributes: ['name_of_company', 'phone_no', 'tin', 'address', 'licensed_no', 'certification_number']
         });
         return company;
    },
    isVerified: async (user) => {
        let farmerData = await Farmer.findOne({ where : {user_id : user.id}, raw: true })
        
        if(farmerData.bvn != null && farmerData.nin != null && farmerData.level_of_education != null && farmerData.date_of_birth != null){
            return false
        }

        return true

    }
}