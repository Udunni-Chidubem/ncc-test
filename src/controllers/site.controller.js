require('dotenv').config()
const db = require('../models');
const User = db.User
const Farmer = db.Farmer
module.exports = {
    home: async (req, res) => {
       // res.send('Hello Badmous');
        res.render('home');
    },

    login : async (req, res) => {
        let x={name:"Badmous", age:"33", lga:"Bida"};
        return x
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
          let names=rq.body.first_name.split(' ');
            let user = new User();
            user.username=rq.body.email
            user.password=rq.body.password
            user.status=0
            user.token=''
            user.save()
            
            let farmer = new Farmer();
            farmer.age=rq.body.age
            // Farmer.create({

            // }, { transaction })
            transaction.commit();
            return user;
    }catch(e){
        transaction.rollback()
    }
    },

    saveuser:  async (username, password, token, status)=>{
        let user = new User();
        return user;
    }


}