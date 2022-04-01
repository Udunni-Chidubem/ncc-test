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

farmersRouter.get('/market_place', async (req, res) => {
    let resp = await farmerController.marketPlace(req, res)
    const products = resp.response
    res.render('farmers/market_place', {
        layout : 'farmers-dashboard',
        title: 'Market Place',
        fullname: resp.farmer.firstname + ' ' + resp.farmer.lastname,
        farmerData: resp.farmer,
        products,
        isVerified: resp.isVerified
    })
})

farmersRouter.get('/product', farmerController.product)
farmersRouter.get('/view-product/:id', async (req, res) => {

    const resp = await farmerController.viewProduct(req, res)
    const seedCompany = resp.singleProduct['User.SeedCompany.name_of_company']
    const items = JSON.stringify(JSON.parse(resp.singleProduct.item))
    const data = Object.entries(items)
    
    // data.forEach((value, index, self) => {
    //     console.log(value);
    // })

    res.render('farmers/view-product', {
        layout : 'farmers-dashboard',
        title: 'Product',
        fullname: resp.farmer.firstname + ' ' + resp.farmer.lastname,
        farmerData: resp.farmer,
        product: resp.singleProduct,
        seedCompany,
        items: items.min,
        isVerified: resp.isVerified
    })
})
farmersRouter.get('/payment_page_preview', farmerController.paymentPage)
farmersRouter.get("/product/price", async (req, res)=>{
    let product = await farmerController.singleProduct(req.query.product_id)
    res.send(product)
})

// Cart Route
farmersRouter.get('/cart', async (req, res) => {
    let resp = await farmerController.cart(req, res)

    res.render('farmers/cart', {
        layout : 'farmers-dashboard',
        title: 'Cart',
        fullname: resp.farmer.firstname + ' ' + resp.farmer.lastname,
        farmerData: resp.farmer,
        isVerified: resp.isVerified
    })
})


module.exports=farmersRouter