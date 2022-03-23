const farmersRouter=require('express').Router()
const farmerController = require('../../controllers/farmers.controller')
const utils = require('../../helpers/utils')

farmersRouter.get('/dashboard', async (req, res)=>{
    //console.log(req.flash('user')[0]);
    let user = await req.user;
    let farmer = await utils.getFarmerProfile(user);
   // console.log(farmer)
    let {firstname, lastname, account_no, account_name, phone_no, LGA, State }=farmer
    
   // let farmer = await farmerController.dashboard(user)
    res.render('farmers/dashboard', {
        layout : 'farmers-dashboard',
        firstname ,
        lastname,
        phone_no,
        account_name,
        account_no,
        lga : LGA.name, 
        state : State.name
    })
})



module.exports=farmersRouter