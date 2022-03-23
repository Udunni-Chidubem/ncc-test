const farmersRouter=require('express').Router()
const farmerController = require('../../controllers/farmers.controller')
const utils = require('../../helpers/utils')

farmersRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user;
    let farmer = await utils.getFarmerProfile(user);
    let {firstname, lastname, account_no, account_name, phone_no, LGA, State }=farmer
    
    res.render('farmers/dashboard', {
        layout : 'farmers-dashboard',
        title: 'Dashboard',
        fullname: firstname + ' ' + lastname,
        firstname,
        lastname,
        phone_no,
        account_name,
        account_no,
        lga : LGA.name, 
        state : State.name
    })
})

farmersRouter.get('/update-profile', farmerController.updateProfile)





module.exports=farmersRouter