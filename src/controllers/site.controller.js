require('dotenv').config()
const db = require('../models/index');
const { sequelize } = require('../models');  
const {User, Farmer, UserRole, Role, SeedTrader, SeedCompany, LGAs, States, Wallet, Contact, Otp }  = db
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const directoryPath = './src/data/'
const path = require('path')
const fs = require('fs')
var otpGenerator = require('otp-generator');
const otp = require('../models/otp');
// const AddMinutesToDate = require('../public/js/script')


module.exports = {
    home: async (req, res) => {
        res.render('site/home', {
            title: 'Welcome'
        });
    },
    authenticate : async (req, res) => {
       res.send("even after transaction")
    },
    presignup: async (req,res) => {
        res.render('site/pre-signup', {
            title: 'Pre-Registration Page'
        });
    }, 
    extension_worker: async (req,res) => {
        let state = await States.findAll({
            attributes : ['id','name'],
            raw : true
        });
        
        res.render('site/extension-worker', {
            title: 'Find and extension worker',
            layout: 'header',
            state : state
        });
    },
    success_page_test: async (req,res) => {
        res.render('site/success-bk',{
            form_banner:'Group.png',
            title: 'Successful Page',
            layout : 'success-header',
            errors : req.flash('errors')
         })
    },
    aboutus: async (req,res) => {
        res.render('site/about-us', {
            layout: 'main',
            title : 'About Us'
        });
    },
    faq: async (req,res) => {
        res.render('site/faq', {
            layout: 'common',
            title : 'FAQ'
        });
    },

    farmer_signup: async (req,res) => {

        res.render('site/farmer_signup',{
            form_banner:'Group.png',
            layout : 'form',
            // states : states,
            title : 'Farmer\'s Registration',
            errors : req.flash('errors')
        });
    },
    dashboard: async (req,res) => {
        res.render('dashboard',{
            title: 'Dashboard',
            layout : 'dashboard'
        });
    },
    login: async (req,res) => {
        res.render('site/login',{
            form_banner:'Group.png',
            title: 'Login',
            layout : 'form',
            errors : req.flash('errors')
        });
    },
    Forgot_Password: async (req,res) => {
        res.render('site/forgot_password',{
            form_banner:'Group.png',
            title: 'Forgot-Password',
            layout : 'form',
            errors : req.flash('errors')
        });
    },
    OTP: async (req,res) => {
        res.render('site/otp',{
            form_banner:'Group.png',
            title: 'OTP',
            layout : 'form',
            errors : req.flash('errors')
        });
    },
    NewPassword: async (req,res) => {
        res.render('site/new_password',{
            form_banner:'Group.png',
            title: 'New-Password',
            layout : 'form',
            errors : req.flash('errors')
        });
    },
    seedcompanysignup: async (req,res) => {
        res.render('site/seed_company_signup',{
            form_banner:'seeds-02 1.png',
            title : 'Seed Company\'s Registration',
            sub: 'Investment in agriculture yields profit',
            layout : 'form',
            errors : req.flash('errors')
        });
    },
    seedtradersignup: async (req,res) => {
        res.render('site/seed_trader_signup',{
            form_banner:'tradersignup.png',
            title : 'Seed Trader\'s Registration',
            sub: 'Become an entrepreneur in seed trading',
            layout : 'form',
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
                phone_no:rq.body.phone_number,
                user_id:user.id
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
            Wallet.create({
                user_id:user.id,
                amount : 0.0
            }, {transaction : transaction})
            const seed_company = await SeedCompany.create({
                name_of_company:req.body.company_name,
                phone_no:req.body.phone,
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
                unique_no: unique,
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
            attributes : ['id', 'name'],
            raw : true
        });
        res.send(states)
    }, 
    getStates : async ()=>{
        let states =await States.findAll({
            attributes : ['id', 'name'],
            raw : true
        });
        return states
    },
    lgas : async (req, res)=>{
        let lgas = await LGAs.findAll({
            attributes : ['id', 'name'],
            where : {state_id : req.params.state_id, id: req.params.lga_id},
            raw : true
        });
        res.json(lgas)
    },
    lgaByStateId: async (req, res)=>{
        let lgas = await LGAs.findAll({
            include : [
                {
                    model : States,
                    attributes : ['id', 'name']
                },
            ],
            attributes : ['id', 'name'],
            where : {state_id : req.params.state_id},
            raw : true
        });
        res.json(lgas)
    },
    getDropList:  (req, res) => {
        const data = require('../data/dropDownList.json')

        fs.stat(directoryPath +'dropDownList.json', (err, stats) => {
            if (err) {
                return res.json({statusCode: 404, error: true, data: err})
            }
        
            const genders = []
            const farmProduce = []
            const levelEdu = []
            const banks = []

            let gender = data.gender
            let farm_Produce = data.farmProduce
            let level = data.levelEducation
            let bank = data.banks

            gender.forEach((value, index, self) => {
                genders.push(value)
            })

            farm_Produce.forEach((value, index, self) => {
                farmProduce.push(value)
            })

            level.forEach((value, index, self) => {
                levelEdu.push(value)
            })

            bank.forEach((value, index, self) => {
                banks.push(value)
            })

            res.json({statusCode: 200, error: false,  data: {
                gender: genders, 
                farm_produce: farmProduce,
                eduLevel: levelEdu,
                bank: banks
            } })

        })
    },
   services: async (req,res) => {
        res.render('site/services', {
            layout: 'common',
            title : 'Services'
        });
    },

    saveContact:async (req, res)=>{
        Contact.create(req.body)
    },

    ForgotPassword: async (req, res) =>{
        console.log(pass)
        let pass =await User.findOne({
            attributes :  ['id', 'username'],
             where : {
                username : req.body.username
             }
         });
         if(!pass){
             console.log('Wrong Number')
         } else{
            return pass;
         }
    },

    OTP: async (req, res)=>{

        //Generate OTP 
    const otp_code = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false, length:6,  });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now,10);

    // console.log(otp_gen);


     // SAVING GENERATED OTP in DB
     const otp_instance = await Otp.create({
        otp_code: otp_code,
        expiration_time: expiration_time
     });
     

    // FINDING OTP in DB AND THEN VERIFYING
    console.log(otp_print);
     let otp_print = await Otp.findOne({
         attributes: ['id', 'otp_code'],
          where:{
              otp_code: req.OTP
          }

    //    otp_instance : otp_code,
    //   expiration_time: expiration_time
     });


     function AddMinutesToDate(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
      };
   
    },



   

}