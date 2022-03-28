require('dotenv').config()
const db = require('../models')
const {User,UserRole, Role, SeedCompany, LGAs, States }  = db
const utils = require('../helpers/utils');

module.exports = {
    updateProfile: async (req, res) => {
        const transaction = await db.rest.transaction();
        const user = await req.user

        const { name_of_company, phone_no, tin, address, licensed_no, state_id, lg_id, certification_number, email} = req.body

        try{
            const data = { name_of_company, phone_no, tin, address, licensed_no, state_id, lg_id, certification_number, email }

            await User.update({status: true}, {where: {id: user.id} })

            const company = await SeedCompany.update( data , {
                where: { user_id: user.id }
            }, {transaction: transaction})

            transaction.commit();
            return {company};
        }catch(e){
            transaction.rollback();
            return e
        }
    },
}