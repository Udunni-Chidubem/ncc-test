const companyRouter=require('express').Router()
const siteController = require('../../controllers/site.controller');
const utils = require('../../helpers/utils')
const { companyValidation, validate } = require('../../helpers/formValidator');
const companyController = require('../../controllers/company.controller');


companyRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
    let company = await utils.getCompanyProfile(user)

    let isVerified = await utils.isCompanyVerified(user)
    res.render('seed_company/dashboard', {
        layout : 'company-dashboard',
        title : 'Dashboard',
        company: company,
        isVerified
    })
});
companyRouter.get('/update-profile', async (req, res)=>{
    let states = await siteController.getStates();
    let user = await req.user
    let isVerified = await utils.isCompanyVerified(user)
    let company = await utils.getCompanyProfile(user)

    res.render('seed_company/update-profile', {
        layout : 'company-dashboard',
        title : 'Profile Update',
        states : states,
        company: company,
        isVerified
    })
})

companyRouter.post('/update-profile', companyValidation(), validate, async (req, res) => {
    let r =await companyController.updateProfile(req, res)

    if(r.company) {
        return res.json({ message: 'Your profile has been updated successfully.', statusCode: 200 }).status(200).send();
    } 
    return res.json({ message: r.errors, error: true, statusCode: 400 }).status(400).send()
})

module.exports=companyRouter