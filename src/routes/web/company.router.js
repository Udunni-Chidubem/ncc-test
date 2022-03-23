const companyRouter=require('express').Router()
const utils = require('../../helpers/utils')


companyRouter.get('/dashboard', async (req, res)=>{

    let user = await req.user
    let company = await utils.getCompanyProfile(user)

    res.render('seed_company/dashboard', {
        layout : 'company-dashboard',
        title : 'Dashboard',
        company: company.dataValues
    })
})

module.exports=companyRouter