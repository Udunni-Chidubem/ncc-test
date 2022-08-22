const passport = require('passport');
const siteController = require('../../controllers/site.controller');
const helpers = require('../../helpers/auth.guard')
const passpportInitializer = require('../../helpers/passport-config')
passpportInitializer(passport)
const db = require('../../models/index')
const nodeMailer = require('nodemailer');

const { 
    signupValidation, 
    signUpvalidate, 
    registerSeedCompanyValidation, 
    registerSeedCompanyValidate,
    seedTraderValidation,
    seedTraderValidate
}  = require('../../helpers/formValidator');
const adminController = require('../../controllers/admin.controller');
const { saveContact } = require('../../controllers/site.controller');

const siteRouter = require('express').Router();

siteRouter.get('/home', async (req, res) => {})
siteRouter.get('/', siteController.home)
siteRouter.post('/', (req, res)=>{
    siteController.saveContact(req)
    siteController.home(req, res)

    let transporter = nodeMailer.createTransport({
        service: 'smtp.gmail.com',
        port: 587,
        secure: true,
        requireTLS: true,
        auth: {
          user: 'www.daniko15@gmail.com',
          pass: 'Fireflies@21'
        },
      });

         let email = req.body.Email;
         let message = req.body.message;

      let mailMessage = transporter.sendMail({
        from: '',
        to: email, 
        subject: 'CONTACT US -NIGSIMS',
        text: message

      })
    return (transporter)

})
siteRouter.get('/presignup', siteController.presignup)
siteRouter.get('/extension_worker', siteController.extension_worker)
siteRouter.get('/about-us', siteController.aboutus)
siteRouter.get('/farmer_signup', siteController.farmer_signup)
siteRouter.get('/test', siteController.success_page_test)
siteRouter.get('/faq', siteController.faq)

siteRouter.get('/new_password', siteController.NewPassword)
siteRouter.post('/farmer_signup', signupValidation(), signUpvalidate, (req, res)=>{
    console.log(req.body)
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
siteRouter.get('/test2', (req, res)=>{
    adminController.testquery();
    res.send("Hello world")
})
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
    title : 'Knowledge Base - Cowpie',
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
        layout: '',
        title : 'Knowledge Base - Recommendation'
    });
})

siteRouter.get('/forgot_password', async (req, res)=>{
    res.render('site/forgot_password',{
        form_banner:'Group.png',
        title: 'Forgot-Password',
        layout : 'form',
       // errors : req.flash('errors')
    });
})
siteRouter.post('/forgot_password', async (req, res)=>{
    let messages=[];
    if(req.body.username){
        let passw=await siteController.ForgotPassword(req, res)
        if(!passw){
            const response={"Status":"Failure","Details":"Account does not exist"}
            messages.error=response.Details
            res.render('site/forgot_password',{
                form_banner:'Group.png',
                title: 'Forgot-Password',
                layout : 'form',
                messages
            });
        }else{
            let otp_instance=await siteController.otp(passw.username)
           // req.flash('phone', passw.username)
            //req.flash('otp', otp_instance.otp_code)
            res.render('site/otp',{
                form_banner:'Group.png',
                title: 'OTP',
                layout : 'form',
                phone : passw.username
            // phone
            })
            
        }
    }

    if(req.body.otp){
        let otp = req.body.otp
        let phone = req.body.phone
       // res.send({'phone': phone, 'otp':otp})
       // return
        let otp_instance =await siteController.getOTPByCode(otp, phone)
        if(otp_instance.otp_code){
            siteController.deleteOTP(otp, phone);
             res.render('site/new_password',{
                form_banner:'Group.png',
                title: 'Forgot-Password',
                layout : 'form',
                phone : phone
            });
        }else{
            messages.error="invalid OTP"
            res.render('site/otp',{
                form_banner:'Group.png',
                title: 'Forgot-Password',
                layout : 'form',
                messages
            });
        }
       
    }

    if(req.body.newpassword){
        if(req.body.newpassword === req.body.confirmpassword){
            let rst = siteController.updatePassword(req.body.newpassword, req.body.phone)
            if(rst){
                res.redirect("/login")
            }
        }else{
            messages.error="Passwords do not match"
            res.render('site/new_password',{
                form_banner:'Group.png',
                title: 'Forgot-Password',
                layout : 'form',
                phone : req.body.phone,
                messages
            });
        }
    }
   
  

});

siteRouter.get('/otp', async(req, res)=>{
  //  let otp=req.flash('otp')
   
    res.render('site/otp',{
        form_banner:'Group.png',
        title: 'OTP',
        layout : 'form',
       // phone
    })
})

siteRouter.post('/otp', async(req, res)=>{
    let otp = req.body.otp
     let phone=req.flash('phone')
     let otp_instance = siteController.getOTPByCode(otp, phone)
    res.render('otp',{
        form_banner:'Group.png',
        title: 'OTP',
        layout : 'form',
        phone
    })
})
 


module.exports=siteRouter; 