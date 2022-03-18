require('dotenv').config()
const db = require('../models');
const { sequelize } = require('../models');  
const {User, Farmer }  = db
const bcrypt = require('bcrypt');
module.exports = {
    home: async (req, res) => {
       // res.send('Hello Badmous');
        res.render('home');
    },

    authenticate : async (req, res) => {
        let user = await User.findOne({ where: { username: req.body.username } });
        if(user != null ){
            if(await bcrypt.compare(req.body.password, user.password) == true){
                 return user
            }
        }
        return null
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
    }




}