const db = require('../models');
const {User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States }  = db
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
        
    }

}