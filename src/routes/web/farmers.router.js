const farmersRouter=require('express').Router()
const farmerController = require('../../controllers/farmers.controller')
const utils = require('../../helpers/utils')
const { profileUpdateValidation, cartValidation, cartSingleValidation, validate } = require('../../helpers/formValidator')
 
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
        isVerified: resp.isVerified,
        cartItems: resp.getCartItems
    })
})

farmersRouter.post('/add-to-cart', cartValidation(), validate, async (req, res) => {
    let response = await farmerController.addToCart(req, res)

    //First check if item has not been added
    if(response.isItemAlreadyAdded){
        return res.json({ message: 'This item has been already been added to your cart.', statusCode: 200 }).status(200)
    }else if(response.cartItems){
        return res.json({ message: 'Item has been added to cart successfully', statusCode: 200 }).status(200)
    }else{
        return res.json({ message: 'Unable to add item to cart. Please try again', error: true, statusCode: 400 }).status(400)
    }
})

farmersRouter.post('/single-cart-item/:id', cartSingleValidation(), validate, async (req, res) => {
    let response = await farmerController.singleCartItem(req, res)

    if(response.product  == null){
        return res.json({ message: 'Sorry we are unable to process the item.', statusCode: 400 }).status(400)
    }else if(response.isItemAlreadyAdded){
        return res.json({ message: 'This item has been already been added to your cart.', statusCode: 200 }).status(200)
    }else if(response.cartItems){
        return res.json({ message: 'Item has been added to cart successfully', statusCode: 200 }).status(200)
    }else{
        return res.json({ message: 'Unable to add item to cart. Please try again', error: true, statusCode: 400 }).status(400)
    }
})

farmersRouter.get('/get-cart-count', async (req, res) => {
    let result = await farmerController.getFarmerCartCount(req, res)
    res.json({ message: result , statusCode: 200 }).status(200)
})


module.exports=farmersRouter