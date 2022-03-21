const passport = require('passport');
const siteController = require('../../controllers/site.controller');
const helpers = require('../../helpers/auth.guard')
const passpportInitializer = require('../../helpers/passport-config')
passpportInitializer(passport)
const db = require('../../models/index')

const siteRouter = require('express').Router();

siteRouter.get('/home', async (req, res)=>{
   // let y = siteController.login(req, res);
    //y.then(r=>{
      //  const t = await db.transaction();
       // res.send(t)
       // res.render('farmers/index'); 
    // }, e={

    // })
})
siteRouter.get('/', siteController.home)
siteRouter.get('/presignup', siteController.presignup)
siteRouter.get('/about-us', siteController.aboutus)
siteRouter.get('/farmer_signup', siteController.farmer_signup)
siteRouter.post('/farmer_signup', (req, res)=>{
    let y = siteController.savefarmer(req, res)
    y.then(r=>{
        res.send(r)
        if(r.user){
            res.render('success',{
                form_banner:'Group.png',
                layout : 'form'
             })
        }else{
            res.redirect('back');
        }
    }, e=>{

    })
})
siteRouter.get('/test', helpers.auth, siteController.test)
siteRouter.get('/login', helpers.loggedIn, siteController.login)

siteRouter.post('/login', passport.authenticate('local', {
    failureRedirect : "/login",
    failureFlash : true
}), (req, res)=>{helpers.redirect(res, req.user.User_role.Role.role_name)});

siteRouter.get('/seedcompanysignup', siteController.seedcompanysignup)
siteRouter.post('/seedcompanysignup', (req, res)=>{
    let y = siteController.saveseedcompany(req, res);
    y.then(r=>{
         if(r.user){
            res.render('success',{
                form_banner:'Group.png',
                layout : 'form'
             })
        }else{
            res.redirect('back');
        }
    }, e=>{

    })
})
siteRouter.get('/seedtradersignup', siteController.seedtradersignup)
siteRouter.post('/seedtradersignup', (req, res)=>{
     let y = siteController.saveseettrader(req, res);
     y.then(r=>{
         if(r.user){
            res.render('success',{
                form_banner:'Group.png',
                layout : 'form'
             })
        }else{
            res.send(r)
            // req.flash('errors', r.errors)
            // res.redirect('back');
        }
     }, e=>{
        req.flash('errors', e)
        res.redirect('back');
     })
}), 
siteRouter.get('/test2', siteController.authenticate)
siteRouter.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/login')
})
module.exports=siteRouter; 