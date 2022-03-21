require('dotenv').config()
const db = require('../models/index');
const { sequelize } = require('../models');  
const {User, Farmer, User_role, Role, SeedTrader, SeedCompany }  = db
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
module.exports = {
    home: async (req, res) => {
        res.render('home');
    },


    authenticate : async (req, res) => {
        let transaction =db.rest.transaction()
       res.send("even after transaction")
    },
    presignup: async (req,res) => {
        res.render('pre-signup');
    },

    aboutus: async (req,res) => {
        res.render('about-us', {
            layout: 'common',
            page_label : 'About Us'
        });
    },

    farmer_signup: async (req,res) => {
        res.render('farmer_signup',{
            form_banner:'Group.png',
        layout : 'form'
    });
    },

    test: async (req,res) => {
        console.log(req.user)
        res.render('test',{
            
        layout : 'dashboard'
    });
    },

    login: async (req,res) => {
        res.render('login',{
            form_banner:'Group.png',
            layout : 'form'
        });
    },

    seedcompanysignup: async (req,res) => {
        res.render('seed_company_signup',{
            form_banner:'seeds-02 1.png',
            layout : 'form'
    });
    },

    seedtradersignup: async (req,res) => {
        res.render('seed_trader_signup',{
            form_banner:'tradersignup.png',
            layout : 'form'
    });
    },

    savefarmer : async (rq, rs)=>{
        try{  
            const password = await bcrypt.hash(rq.body.password, 10)
            let user = new User();
            user.username=rq.body.phone_number
            user.password = password
            user.status=false
            user.token=''
            await user.save()
             let r = await Role.findOne(
                {
                    where : { role_name : 'farmer' }
                }
            );
            let user_role= new User_role();
            user_role.user_id = user.id;
            user_role.role_id = r.id
            user_role.save();
            let farmer = new Farmer();
            farmer.age=''
            farmer.firstname=rq.body.firstname
            farmer.lastname=rq.body.lastname
            farmer.gender=rq.body.gender
            farmer.product_farmed=rq.body.farm
            farmer.level_of_education=rq.body.education
            farmer.location_of_farm=rq.body.location
            farmer.phone_no=rq.body.phone_number
            farmer.account_name=''
            farmer.size_of_farm=''
            farmer.bvn=''
            farmer.nin=''
            farmer.user_id=user.id
            farmer.save()
            return {user, farmer};
        }catch(e){
            return e
        }
    },

    saveuser:  async (username, password, token, status)=>{
        let user = new User();
        return user;
    },

    saveseedcompany: async (req, res)=>{
         try{  
            const password = await bcrypt.hash(req.body.password, 10)
            let user = new User();
            user.username=req.body.phone
            user.password = password
            user.status=false
            user.token=''
            await user.save()
             let r = await Role.findOne(
                {
                    where : { role_name : 'seed_company' }
                }
            );
            let user_role= new User_role();
            user_role.user_id = user.id;
            user_role.role_id = r.id
            user_role.save();
            let seed_company = new SeedCompany();
            seed_company.name_of_company=req.body.company_name
            seed_company.phone_no=req.body.phone
            seed_company.tin=req.body.tin
            seed_company.address=req.body.address
            seed_company.certification_number=''
            seed_company.licensed_no=''
            seed_company.user_id=user.id
            seed_company.save()
            return {user, seed_company};
        }catch(e){
            return e
        }
    },

    saveseettrader : async (req, res)=>{
        try{  
            const password = await bcrypt.hash(req.body.password, 10)
            let user = new User();
            user.username=req.body.phone
            user.password = password
            user.status=false
            user.token=''
            await user.save()
             let r = await Role.findOne(
                {
                    where : { role_name : 'seed_trader' }
                }
            );
            let user_role= new User_role();
            user_role.user_id = user.id;
            user_role.role_id = r.id
            user_role.save();
            let seed_trader = new SeedTrader();
            seed_trader.firstname=req.body.firstname
            seed_trader.lastname=req.body.lastname
            seed_trader.othername=''
            seed_trader.phone_no=req.body.phone
            seed_trader.location_of_seed=req.body.location
            seed_trader.address=req.body.address
            seed_trader.unique_no=uniqid()
            seed_trader.bvn=''
            seed_trader.nin=''
            seed_trader.age=''
            seed_trader.user_id=user.id
            seed_trader.save()
            return {user, seed_trader};
        }catch(e){
            return e
        }

    }




}