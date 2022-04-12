require('dotenv').config()
const db = require('../models')
const utils = require('../helpers/utils');
const {User, UserRole, Role, Farmer, SeedCompany, States, LGAs }  = db
const { getPagingData, getPagination } = require('../helpers/pagination');
const { Op } = require("sequelize");


module.exports={
    getNascAdminRoles : async (req, res)=>{
        let roles = await Role.findAll({
            where : {
             [Op.or] :   [
                    {role_name : 'admin'},
                    {role_name : 'nasc'}
                ]
                    
            },
            raw:true
        })
        return roles
    }, 
    getFarmers: async (req, res) =>{
        let farmers = await Farmer.findAll({
            attributes : ['firstname', 'lastname', 'created_at'],
            include : [ 
                {
                    model : States,
                    attributes : ['name']
                },
                {
                    model : LGAs,
                    attributes : ['name']
                }
            ],
         })
         farmers=JSON.stringify(farmers)
        return JSON.parse(farmers)
    }


}