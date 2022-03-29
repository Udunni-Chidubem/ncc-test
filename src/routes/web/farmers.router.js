const farmersRouter=require('express').Router()
const farmerController = require('../../controllers/farmers.controller')
const utils = require('../../helpers/utils')
const { profileUpdateValidation, validate } = require('../../helpers/formValidator')
 
farmersRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user;
    let farmer = await utils.getFarmerProfile(user)
    const isVerified = await utils.isVerified(user, 'farmer')
    let {firstname, lastname, LGA, State }=farmer

    res.render('farmers/dashboard', {
        layout : 'farmers-dashboard',
        title: 'Dashboard',
        fullname: firstname + ' ' + lastname, 
        lga : farmer['LGA.name'] ? farmer['LGA.name'] : null,
        state : farmer['State.name'] ? farmer['State.name'] : null,
        isVerified
    })
})

farmersRouter.get('/update-profile', farmerController.updateProfile)
farmersRouter.post('/update-profile', profileUpdateValidation(), validate, async(req, res) => {;

    let response = await farmerController.editProfileData(req, res)
    if(response.farmer || response.deliveryInformation){
        res.json({ message: 'Your profile has been updated successfully and you will be redirected shortly.', statusCode: 200 }).status(200)
    }else{
        res.json({ message: response.errors, error: true, statusCode: 400 }).status(400)
    }

})

farmersRouter.get('/market_place', farmerController.marketPlace)
farmersRouter.get('/product', farmerController.product)
farmersRouter.get('/view-product', farmerController.viewProduct)
farmersRouter.get('/payment_page_preview', farmerController.paymentPage)


module.exports=farmersRouter