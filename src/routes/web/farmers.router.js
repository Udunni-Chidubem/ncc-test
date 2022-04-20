const farmersRouter=require('express').Router()
const farmerController = require('../../controllers/farmers.controller')
const utils = require('../../helpers/utils')
const paystack = require('../../helpers/paystack')
const { profileUpdateValidation, cartValidation, cartSingleValidation, validate } = require('../../helpers/formValidator')
const companyController = require('../../controllers/company.controller')
 
farmersRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user;
    let farmer = await utils.getFarmerProfile(user)
    const isVerified = await utils.isVerified(user, 'farmer')
    let {firstname, lastname, LGA, State }=farmer
    let cartCount = await farmerController.getFarmerCartCount(req, res)
    let transactionCount = await farmerController.getTransactionlogCount(farmer.id)

    res.render('farmers/dashboard', {
        layout : 'farmers-dashboard',
        title: 'Dashboard',
        fullname: firstname + ' ' + lastname, 
        lga : farmer['LGA.name'] ? farmer['LGA.name'] : null,
        state : farmer['State.name'] ? farmer['State.name'] : null,
        farmer,
        isVerified,
        cartCount,
        transactionCount
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
farmersRouter.get('/products/:id', async (req, res) => {

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
farmersRouter.get('/checkout/preview', async (req, res)=>{
    let {getCartItems, farmer, isVerified}=await farmerController.cart(req, res);
    let deliveryInfo = await farmerController.deliveryInfo(farmer.user_id)
   // console.log(deliveryInfo)
        res.render('farmers/order_preview', {
            layout : 'farmers-dashboard',
            title: 'Order Preview',
            fullname: farmer.firstname + ' ' + farmer.lastname,
            farmer: farmer,
            isVerified,
            getCartItems,
            deliveryInfo
        })
})
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

farmersRouter.post("/cart/checkout", async (req, res)=>{
   try{
        let paymentType = req.body.inlineRadioOptions
        let total_sum = req.body.total_sum
        if(paymentType=='card'){  
            
            let initial= await paystack.initialize('tipson664@gmail.com', total_sum*100, req)
            if(initial.status==true){
                let ref = initial.data.reference
                let {getCartItems, farmer}=await farmerController.cart(req, res)
                await farmerController.initializeTransaction(req, res, ref, getCartItems, farmer)
                res.redirect(initial.data.authorization_url);
            }
        }
   }catch(e){
        console.log(e)
        res.send(e)
   }
})

farmersRouter.get('/checkout/callback', async (req, res)=>{
    let ref=req.query.reference
    let check=await farmerController.checkTransaction(ref)
    if(check){
        let data={}
        data.status='pending'
        farmerController.updateTransactionLog(data, ref)
        let paystackPayload = await paystack.callback(req, res)
        if(paystackPayload.status==true){
            data.status='verified'
            data.currency=paystackPayload.data.currency,
            data.amount = paystackPayload.data.amount / 100
            data.transaction_id=paystackPayload.data.id
           // console.log(data.amount)
            data.description = paystackPayload.data.log.history[1].message
            farmerController.updateTransactionLog(data, ref)
            let {farmer, isVerified, getCartItems} = await farmerController.cart(req, res)
            farmerController.updateCart(farmer.user_id)
            getCartItems.forEach(item=>{
                farmerController.productItemsUpdate(item.product_id, item.size, item.qty)
            })
            companyController.creditWallet(getCartItems)
            res.render('farmers/payment-success', {
                layout : 'farmers-dashboard',
                title: 'Success Page',
                isVerified,
                paystackPayload,
                data
            })
            return
        }
    }
    res.send("this is not a valid transaction reference, pls contact admin if this is a error")

})

farmersRouter.get('/payment-success', async (req, res)=>{
    let user = await req.user;
    let farmer = await utils.getFarmerProfile(user)
    const isVerified = await utils.isVerified(user, 'farmer')

    res.render('farmers/payment-success', {
        layout : 'farmers-dashboard',
        title: 'Success Page',
        isVerified
    })
})

farmersRouter.get('/transactions', async (req, res)=>{
    let user = await req.user;
    let farmer = await utils.getFarmerProfile(user)
    const isVerified = await utils.isVerified(user, 'farmer')
    let transactions=await farmerController.getTransactions(farmer.id)
   // console.log('transactions', transactions)
    res.render('farmers/transaction-history', {
        layout : 'farmers-dashboard',
        title: 'Transaction History',
        isVerified,
        transactions
    })
})
farmersRouter.get("/cart/delete/:id", async (req, res)=>{
    farmerController.deleteItem(req, res)
    res.redirect("/farmer/cart")
})


module.exports=farmersRouter