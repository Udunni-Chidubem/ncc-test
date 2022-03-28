const farmersRouter=require('express').Router()
const farmerController = require('../../controllers/farmers.controller')
const utils = require('../../helpers/utils')
const { profileUpdateValidation, validate } = require('../../helpers/formValidator')
 
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
        lga : LGA ? LGA.name : null, 
        state : State ? State.name : null,
        isVerified
    })
})

farmersRouter.get('/update-profile', farmerController.updateProfile)
farmersRouter.post('/update-profile', profileUpdateValidation(), validate, async(req, res) => {

    let response = await farmerController.editProfileData(req, res)
    if(response.farmer || response.deliveryInformation){
         res.json({ message: 'Your profile has been updated successfully.', statusCode: 200 }).status(200).send();
   }else{
         res.json({ message: response.errors, error: true, statusCode: 400 }).status(400).send()
   }

})

farmersRouter.get('/market_place', farmerController.marketPlace)
farmersRouter.get('/product', farmerController.product)
farmersRouter.get('/view-product', farmerController.viewProduct)


module.exports=farmersRouter