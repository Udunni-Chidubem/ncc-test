require('dotenv').config()
const db = require('../models')
const {User,UserRole, Role, SeedCompany, LGAs, States }  = db
const utils = require('../helpers/utils');

module.exports = {
    updateProfile: async (req, res) => {
        const transaction = await db.rest.transaction();
        const user = await req.user

        try{
            const data = {
                name_of_company: req.body.name_of_company,
                phone_no: req.body.phone_no,
                tin: req.body.tin,
                address: req.body.address,
                licensed_no: req.body.licensed_no,
                state_id: req.body.state_id,
                lg_id: req.body.lg_id,
                certification_number: req.body.certification_number,
                email: req.body.email
            }

            const company = await SeedCompany.update( data , {
                where: { user_id: user.id }
            }, {transaction: transaction})

            transaction.commit();
            return company;
        }catch(e){
            transaction.rollback();
            return e
        }
    },
}