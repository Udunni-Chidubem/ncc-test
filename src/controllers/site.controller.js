require('dotenv').config()
const db = require('../models/index');
const { sequelize } = require('../models');  
const {User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States }  = db
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
module.exports = {
    home: async (req, res) => {
        res.render('home');
    },

    authenticate : async (req, res) => {
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
        let states =await States.findAll({
            attributes : ['id', 'name']
        });
        res.render('farmer_signup',{
            form_banner:'Group.png',
            layout : 'form',
            states : states,
            errors : req.flash('errors')
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
                product_farmed:rq.body.farm,
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
            let user_role= new UserRole();
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