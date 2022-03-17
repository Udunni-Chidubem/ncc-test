const siteController = require('../../controllers/site.controller');

const siteRouter = require('express').Router();

siteRouter.get('/home', (req, res)=>{
    let y = siteController.login(req, res);
    y.then(r=>{
        res.render('home', {r:r}); 
    }, e={

    })
})
siteRouter.get('/', siteController.home)
siteRouter.get('/presignup', siteController.presignup)
siteRouter.get('/about-us', siteController.aboutus)
siteRouter.get('/farmer_signup', siteController.farmer_signup)
siteRouter.post('/farmer_signup', (req, res)=>{
    let y = siteController.savefarmer(req, res)
    y.then(r=>{
        res.send(r)
    }, e=>{

    })
})
siteRouter.get('/test', siteController.test)
siteRouter.get('/login', siteController.login)
siteRouter.get('/seedcompanysignup', siteController.seedcompanysignup)
siteRouter.post('/seedcompanysignup', (req, res)=>{
    res.send(req);
})
siteRouter.get('/seedtradersignup', siteController.seedtradersignup)
siteRouter.post('/seedtradersignup', (req, res)=>{
    res.send(req);
})
module.exports=siteRouter; 