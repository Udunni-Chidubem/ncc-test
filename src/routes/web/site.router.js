const passport = require('passport');
const siteController = require('../../controllers/site.controller');
const helpers = require('../../helpers/auth.guard')
const passpportInitializer = require('../../helpers/passport-config')
passpportInitializer(passport)
const db = require('../../models/index')

const { 
    signupValidation, 
    signUpvalidate, 
    registerSeedCompanyValidation, 
    registerSeedCompanyValidate,
    seedTraderValidation,
    seedTraderValidate
}  = require('../../helpers/formValidator')

const siteRouter = require('express').Router();

siteRouter.get('/home', async (req, res) => {})
siteRouter.get('/', siteController.home)
siteRouter.get('/presignup', siteController.presignup)
siteRouter.get('/about-us', siteController.aboutus)
siteRouter.get('/farmer_signup', siteController.farmer_signup)
siteRouter.get('/test', siteController.success_page_test)
siteRouter.post('/farmer_signup', signupValidation(), signUpvalidate, (req, res)=>{
    let y = siteController.savefarmer(req, res)
    y.then(r=>{
        
        if(r.user){
            res.render('site/success-bk',{
                form_banner:'Group.png',
                title: 'Successful Page',
                layout : 'success-header',
                errors : req.flash('errors')
             })
        }else{
            //res.send(r.errors)
            req.flash('errors', r.errors)
            res.redirect('back');
        }
    }, e=>{

    })
})
siteRouter.get('/dashboard', helpers.auth, siteController.dashboard)
siteRouter.get('/login', helpers.loggedIn, siteController.login)

siteRouter.post('/login', passport.authenticate('local', {
    failureRedirect : "/login",
    failureFlash : true
}),  (req, res)=>{
    helpers.redirect(req, res, req.user.UserRole.Role.role_name)
});

siteRouter.get('/seed-company-signup', siteController.seedcompanysignup)
siteRouter.post('/seed-company-signup', registerSeedCompanyValidation(), registerSeedCompanyValidate, (req, res)=>{
    let y = siteController.saveseedcompany(req, res);
    y.then(r=>{
         if(r.user){
            res.render('site/success',{
                form_banner:'Group.png',
                title: 'Notification',
                layout : 'form'
             })
        }else{
             req.flash('errors', r.errors)
            res.redirect('back');
        }
    }, e=>{

    })
})
siteRouter.get('/seed-trader-signup', siteController.seedtradersignup)
siteRouter.post('/seed-trader-signup', seedTraderValidation(), seedTraderValidate, (req, res)=>{
     let y = siteController.saveseedtrader(req, res);
     y.then(r=>{
         if(r.user){
            res.render('site/success',{
                form_banner:'Group.png',
                layout : 'form',
                title: 'Notification'
             })
        }else{
            req.flash('errors', r.errors)
            res.redirect('back');
        }
     }, e=>{
         res.send(e)
      //  req.flash('errors', e)
        //res.redirect('back');
     })
}), 
siteRouter.get('/test2', siteController.authenticate)
siteRouter.delete('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/login')
})
module.exports=siteRouter; 