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
        //res.send(r)
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
siteRouter.get('/test', siteController.test)
siteRouter.get('/login', siteController.login)
siteRouter.post('/login', async (req, res)=>{
    let user = await siteController.authenticate(req, res);
    if(user == null){
         res.render('login',{
            form_banner:'Group.png',
            layout : 'form'
        });
    }
    res.send('logged in successfully')
        
})
siteRouter.get('/seedcompanysignup', siteController.seedcompanysignup)
siteRouter.post('/seedcompanysignup', (req, res)=>{
    res.send(req);
})
siteRouter.get('/seedtradersignup', siteController.seedtradersignup)
siteRouter.post('/seedtradersignup', (req, res)=>{
    res.send(req);
})
module.exports=siteRouter; 