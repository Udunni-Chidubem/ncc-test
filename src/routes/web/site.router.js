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
siteRouter.post('/', (req, res)=>{
    siteController.saveContact(req)
    siteController.home(req, res)
})
siteRouter.get('/presignup', siteController.presignup)
siteRouter.get('/extension_worker', siteController.extension_worker)
siteRouter.get('/about-us', siteController.aboutus)
siteRouter.get('/farmer_signup', siteController.farmer_signup)
siteRouter.get('/test', siteController.success_page_test)
siteRouter.get('/faq', siteController.faq)
siteRouter.get('/forgot_password', siteController.Forgot_Password)
siteRouter.post('/farmer_signup', signupValidation(), signUpvalidate, (req, res)=>{
    let y = siteController.savefarmer(req, res)
    y.then(r=>{
        
        if(r.user){
            res.render('site/success',{
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
                layout : 'success-header'
                // layout : 'form'
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
                title: 'Notification',
                layout : 'success-header'
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
}),
siteRouter.get('/services', siteController.services)

siteRouter.get('/knowledge-base', (req,res) => {
    res.render('knowledge_base', {
        layout: '',
        title : 'Knowledge Base - Index'
    });
    
    
})
   
siteRouter.get('/cowpie', (req,res) => {
res.render('knowledge_base/cowpie', {
    layout: 'knowledge_dashboard',
    title : 'Knowledge Base - Cowpea',
    crop : "Cowpea"
     });

})

siteRouter.get('/groundnut', (req,res) => {
 res.render('knowledge_base/groundnut', {
     layout: 'knowledge_dashboard',
     title : 'Knowledge Base - GroundNut',
    crop : "Groundnut"
    });

})

siteRouter.get('/maize', (req,res) => {
 res.render('knowledge_base/maize', {
     layout: 'knowledge_dashboard',
     crop : "Maize",
     title : 'Knowledge Base - Maize'
   
    });

})

siteRouter.get('/rice', (req,res) => {
 res.render('knowledge_base/rice', {
     layout: 'knowledge_dashboard',
     crop : "Rice",
     title : 'Knowledge Base - Rice'
    });

})

siteRouter.get('/recommendation', (req,res) => {
    res.render('knowledge_base/recommendation', {
        layout: 'knowledge_dashboard',
        title : 'Knowledge Base - Recommendation'
       });
   
   })


siteRouter.post('/forgot_password', async (req, res)=>{
    let pass=await siteController.ForgotPassword(req, res)
    res.json({data : pass}).send().status(200)
 })

 siteRouter.post('/otp', async (req, res)=>{
    res.render('/otp', {
       form_banner:'Group.png',
       title: 'OTP',
       layout : 'form',
    });
 })

   


 


module.exports=siteRouter; 