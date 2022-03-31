require('dotenv').config()
const db = require('../models')
const {User,UserRole, Role, SeedCompany, LGAs, States, Product }  = db
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

    createProduct : async (req, res, filename)=>{
        
        const transaction =await db.rest.transaction();
        let item = null;
        item={
            min : req.body.min_order, 
            pkg: req.body.pkg_size, 
            price:req.body.price, 
            quantity : req.body.quantity
        }
       // item.push({pkg: req.body.pkg_size})
        //item.push({price:req.body.price})
        //item.push({quantity : req.body.quantity})
        item = await JSON.stringify(item, null, 2)
     //   return
        const user = await req.user
        try{
            let p = await Product.create({
                product_name : req.body.productName,
                description : req.body.productDescription,
                variant : req.body.productVariant,
                item : item,
                user_id : user.id,
                file_name : filename
            }, {transaction : transaction})
            transaction.commit()
            return p
        }catch(e){
            console.log(e)
            transaction.rollback()
            return e
        }
        
    }
}