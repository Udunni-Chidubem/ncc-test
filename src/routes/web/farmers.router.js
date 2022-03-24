const farmersRouter=require('express').Router()
const farmerController = require('../../controllers/farmers.controller')
const utils = require('../../helpers/utils')

farmersRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user;
    let farmer = await utils.getFarmerProfile(user)
    const isVerified = await utils.isVerified(user.dataValues)
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
        state : State.name,
        isVerified
    })
})

farmersRouter.get('/update-profile', farmerController.updateProfile)
farmersRouter.post('update-profile', async(req, res) => {
    let resp = farmerController.editProfileData(req, res)

    resp.then(r=>{
        if(r.farmer){
           //Redirect user with notification
       }else{
           req.flash('errors', r.errors)
           res.redirect('back');
       }
    }, e=>{
        res.send(e)
    })
})





module.exports=farmersRouter