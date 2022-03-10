require('dotenv').config()

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
    }
}