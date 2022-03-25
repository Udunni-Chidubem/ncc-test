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
            },
            raw :true
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
             attributes: ['name_of_company', 'phone_no', 'tin', 'address', 'licensed_no', 'certification_number'],
             raw :true
         });
         return company;
    },
    isVerified: async (user) => {
        let farmerData = await Farmer.findOne({ where : {user_id : user.id}, raw: true })
        
        if(
            farmerData.level_of_education != null 
            && farmerData.state_id != null
            && farmerData.lg_id != null
        ){
            return false
        }

        return true
    },
    isCompanyVerified: async (user) => {
        let company = await SeedCompany.findOne({ where: {user_id: user.id}, 
            attributes: ['name_of_company', 'phone_no', 'tin', 'address', 'licensed_no', 'certification_number'], raw: true})

        if(company.licensed_no != null && company.certification_number != null){
            return false
        }
        return true
    }
}