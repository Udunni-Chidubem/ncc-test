const companyRouter=require('express').Router()
companyRouter.get('/dashboard', async (req, res)=>{

    //let farmer = await farmerController.dashboard(req, res);
    res.render('seed_company/dashboard', {
        layout : 'traders-dashboard',
        title : 'Dashboard'
    })
})

module.exports=companyRouter