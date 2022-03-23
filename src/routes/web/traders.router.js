const tradersRouter=require('express').Router()

tradersRouter.get('/dashboard', async (req, res)=>{

    //let farmer = await farmerController.dashboard(req, res);
    res.render('seed_trader/dashboard', {
        layout : 'traders-dashboard',
        title : 'Dashboard'
    })
})
module.exports=tradersRouter