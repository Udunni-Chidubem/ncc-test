const farmersRouter=require('express').Router()
const farmerController = require('../../controllers/farmers.controller')

farmersRouter.get('/dashboard', async (req, res)=>{

    //let farmer = await farmerController.dashboard(req, res);
    res.render('farmers/dashboard', {
        layout : 'farmers-dashboard'
       // farmer : farmer
    })
})




module.exports=farmersRouter