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
module.exports=siteRouter;