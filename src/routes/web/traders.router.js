const tradersRouter=require('express').Router()

tradersRouter.get('/dashboard', async (req, res)=>{

    res.render('seed_trader/dashboard', {
        layout : 'traders-dashboard',
        title : 'Dashboard'
    })
})

module.exports=tradersRouter