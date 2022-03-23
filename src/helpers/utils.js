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
    getCompanyProfile: (user) => {
        
    }
}