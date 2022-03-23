require('dotenv').config()
const db = require('../models/index');
const { sequelize } = require('../models');  
const {User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States }  = db
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
module.exports = {
    home: async (req, res) => {
        res.render('home', {
            title: 'Welcome'
        });
    },
    authenticate : async (req, res) => {
       res.send("even after transaction")
    },
    presignup: async (req,res) => {
        res.render('pre-signup', {
            title: 'Pre-Registration Page'
        });
    },

    aboutus: async (req,res) => {
        res.render('about-us', {
            layout: 'common',
            title : 'About Us'
        });
    },

    farmer_signup: async (req,res) => {
        let states =await States.findAll({
            attributes : ['id', 'name']
        });
        res.render('farmer_signup',{
            form_banner:'Group.png',
            layout : 'form',
            states : states,
            title : 'Farmer\'s Registration',
            errors : req.flash('errors')
        });
    },

    dashboard: async (req,res) => {
        // console.log(req.user)
        res.render('dashboard',{
            title: 'Dashboard',
            layout : 'dashboard'
        });
    },

    login: async (req,res) => {
        res.render('login',{
            form_banner:'Group.png',
            title: 'Login',
            layout : 'form',
            errors : req.flash('errors')
        });
    },

    seedcompanysignup: async (req,res) => {
        res.render('seed_company_signup',{
                form_banner:'seeds-02 1.png',
                layout : 'form',
                errors : req.flash('errors')
        });
    },
    seedtradersignup: async (req,res) => {
        let states =await States.findAll({
            attributes : ['id', 'name']
        });
        res.render('seed_trader_signup',{
            form_banner:'tradersignup.png',
            layout : 'form',
            states : states,
            errors : req.flash('errors')
        });
    },
    savefarmer : async (rq, rs)=>{
        const transaction = await db.rest.transaction();
        try{  
            const password = await bcrypt.hash(rq.body.password, 10)
            const user = await User.create({
                username: rq.body.phone_number,
                password : password,
                status : false,
                token : ''
            }, {transaction : transaction} )
             let r = await Role.findOne(
                {
                    where : { role_name : 'farmer' }
                }
            );
             UserRole.create({
                user_id : user.id,
                role_id : r.id
            }, {transaction : transaction})
            const farmer = await Farmer.create({
                firstname:rq.body.firstname,
                lastname:rq.body.lastname,
                gender:rq.body.gender,
                product_farmed:rq.body.farm.toString(),
                phone_no:rq.body.phone_number,
                account_no:rq.body.account_no,
                user_id:user.id,
                state_id:rq.body.state,
                lg_id : rq.body.lga
            }, {transaction : transaction} );
            await transaction.commit();
            return {user, farmer};
        }catch(e){
            await transaction.rollback();
            return e
        }
    },
    saveuser:  async (username, password, token, status)=>{
        let user = new User();
        return user;
    },

    saveseedcompany: async (req, res)=>{
        const transaction = await db.rest.transaction();
         try{  
            const password = await bcrypt.hash(req.body.password, 10)
             const user = await User.create({
                username: req.body.phone,
                password : password,
                status : false,
                token : ''
            }, {transaction : transaction} )
             let r = await Role.findOne(
                {
                    where : { role_name : 'seed_company' }
                }
            );
            UserRole.create({
                user_id : user.id,
                role_id : r.id
            }, {transaction : transaction})
            const seed_company = await SeedCompany.create({
                name_of_company:req.body.company_name,
                phone_no:req.body.phone,
                tin:req.body.tin,
                address:req.body.address,
                user_id:user.id
            },{transaction : transaction});
            transaction.commit();
            return {user, seed_company};
        }catch(e){
            transaction.rollback();
            return e
        }
    },

    saveseedtrader : async (req, res)=>{
        const transaction = await db.rest.transaction();
        try{  
            const password = await bcrypt.hash(req.body.password, 10)
             const user = await User.create({
                username: req.body.phone,
                password : password,
                status : false,
                token : ''
            }, {transaction : transaction} )
             let r = await Role.findOne(
                {
                    where : { role_name : 'seed_trader' }
                }
            );
            const user_role=await UserRole.create({
                user_id : user.id,
                role_id : r.id
            }, {transaction : transaction})
            let unique = uniqid();
            let seed_trader =await  SeedTrader.create({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                phone_no:req.body.phone,
                state_id:req.body.state,
                lg_id : req.body.lga,
                unique_no:unique,
                user_id : user.id
            }, {transaction :transaction});
            transaction.commit();
            return {user, seed_trader};
        }catch(e){
            transaction.rollback();
            return e
        }

    },

    states : async (req, res)=>{
        let states =await States.findAll({
            attributes : ['id', 'name']
        });
        res.send(states)
    }, 

    lgas : async (req, res)=>{

    },

    lgaByStateId: async (req, res)=>{
        let lgas = await LGAs.findAll({
            attributes : ['id', 'name'],
            where : {state_id : req.params.state_id}
        });
        res.send(lgas)
    }


}