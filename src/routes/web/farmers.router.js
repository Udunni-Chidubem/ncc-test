const farmersRouter=require('express').Router()
const farmerController = require('../../controllers/farmers.controller')

farmersRouter.get('/dashboard', async (req, res)=>{
   console.log(res.user)
   res.send(req.user)
    // let farmer = await farmerController.dashboard(req, res);
    // res.render('farmers/dashboard', {
    //     layout : 'farmer-dashboard',
    //     farmer : farmer
    // })
})




module.exports=farmersRouter