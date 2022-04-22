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
        const company = await SeedCompany.findOne({
             where : {
                 user_id : user.id
             },
             attributes: ['id','name_of_company', 'phone_no', 'tin', 'address', 'licensed_no', 'certification_number', 'email', 'state_id', 'lg_id'],
             raw :true
         });
         return company;
    },
    isVerified: async (user) => {
        let status = true

        const verify = await User.findOne({ where: { id: user.id, status: true}, attributes : ['id', 'username', 'status'], raw: true })

        if(verify != null){
            status = false 
        }
        return status    
    },
}