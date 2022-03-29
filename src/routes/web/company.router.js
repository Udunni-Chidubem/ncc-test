const companyRouter=require('express').Router()
const siteController = require('../../controllers/site.controller');
const utils = require('../../helpers/utils')


companyRouter.get('/dashboard', async (req, res)=>{

    let user = await req.user
    let company = await utils.getCompanyProfile(user)
    res.render('seed_company/dashboard', {
        layout : 'company-dashboard',
        title : 'Dashboard',
        company: company
    })
});
companyRouter.get('/update-profile', async (req, res)=>{
    let states = await siteController.getStates();
    console.log(states)
    res.render('seed_company/update-profile', {
        layout : 'company-dashboard',
        title : 'Profile Update',
        states : states
    })
});
companyRouter.get('/create-product', async (req, res)=>{

    res.render('seed_company/inventory/create-product', {
        layout : 'company-dashboard',
        title : 'Create Product',
    })
});
companyRouter.get('/product-list', async (req, res)=>{

    res.render('seed_company/inventory/product-list', {
        layout : 'company-dashboard',
        title : 'Products',
    })
})

module.exports=companyRouter