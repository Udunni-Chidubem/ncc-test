const tradersRouter=require('express').Router()
const utils = require('../../helpers/utils')
const paystack = require('../../helpers/paystack')
const companyController = require('../../controllers/company.controller')
const tradersController = require('../../controllers/traders.controller')
const { profileUpdateValidation, cartValidation, cartSingleValidation, validate, settingsValidation } = require('../../helpers/formValidator')



tradersRouter.get('/referral', async (req, res)=>{
    let user = await req.user
    const trader = await utils.getTraderPofile(user)
    let referal_id = trader.user_id
    let referal_code = trader.referal_code
    let isVerified = await utils.isVerified(user, 'trader')
    let traderRefres = await tradersController.traderRefres(req,referal_id)
    let traderRefres_len = traderRefres.length
    
    res.render('seed_trader/referral', {
        layout : 'traders-dashboard',
        title : 'Referral',
        isVerified,
        trader,
        traderRefres,
        traderRefres_len,
        referal_code
    })
})
tradersRouter.get('/help', async (req, res)=>{
    let user = await req.user
    const trader = await utils.getTraderPofile(user)
    let isVerified = await utils.isVerified(user, 'trader')
    let user_id = trader.user_id
    let getmessages = await tradersController.getmessages(req,user_id)
    let updateMessagestatus = await tradersController.updateMessagestatus(req, user_id)
    
    res.render('seed_trader/help', {
        layout : 'traders-dashboard',
        title : 'Referral',
        isVerified,
        trader,
        getmessages,
        user_id
    })
})
tradersRouter.post('/message', async (req, res)=>{

    let response = await tradersController.message(req,res)
    res.json({ message: response }).status(200)
})
tradersRouter.get('/view-farmer/:user_id', async (req, res)=>{
    let user = await req.user
    const trader = await utils.getTraderPofile(user)
    let isVerified = await utils.isVerified(user, 'trader')
    let farmer_info = await tradersController.farmer_info(req,res)
    
    res.render('seed_trader/view_farmer', {
        layout : 'traders-dashboard',
        title : 'Referal',
        isVerified,
        trader,
        farmer_info
    })
})
tradersRouter.get('/orders', async (req, res)=>{
    let user = await req.user
    const trader = await utils.getTraderPofile(user)
    let isVerified = await utils.isVerified(user, 'trader')
    let transactions=await tradersController.getTransactions(trader.id)

    res.render('seed_trader/orders', {
        layout : 'traders-dashboard',
        title : 'Orders',
        isVerified,
        transactions
    })
})
tradersRouter.get('/getmessagescount', async (req, res) => {
    let user = await req.user
    let trader = await utils.getTraderPofile(user)
    let getmessagescount = await tradersController.getmessagescount(req,trader.user_id)
    getmessagescount = getmessagescount.length
        res.json({ message: getmessagescount }).status(200)

})
tradersRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
    let trader = await utils.getTraderPofile(user)
    let referal_id = trader.user_id
    let referal_code = trader.referal_code
    let isVerified = await utils.isVerified(user, 'trader')
    let traderRefres = await tradersController.traderRefres(req,referal_id)
    let traderRefres_len = traderRefres.length
    let cartCount = await tradersController.getTraderCartCount(req, res)
    let transactionCount = await tradersController.getTransactionlogCount(trader.id)
    let transactions = await tradersController.getTransactions(trader.id)

    res.render('seed_trader/dashboard', {
        layout : 'traders-dashboard',
        title : 'Dashboard',
        isVerified,
        trader,
        traderRefres,
        traderRefres_len,
        referal_code,
        cartCount,
        transactionCount,
        transactions
    })
})
    tradersRouter.get('/construction', async (req, res)=>{
        let user = await req.user
        let trader = await utils.getTraderPofile(user)
        let isVerified = await utils.isVerified(user)
        
        res.render('seed_trader/under_construction', {
            layout : 'traders-dashboard',
            title : 'Under Construction',
            isVerified,
            trader
        })
    })

    tradersRouter.get('/update-profile', tradersController.updateProfile)
    tradersRouter.get('/settings', tradersController.settings)
    tradersRouter.post('/update-profile', profileUpdateValidation(), validate, async (req, res) => {
        let response = await tradersController.editProfileData(req,res)
        if(response.trader || response.deliveryInformation){
            res.json({ message: 'Your profile has been updated successfully and you will be redirected shortly.', statusCode: 200 }).status(200)
        }else{
            res.json({ message: response.errors, error: true, statusCode: 400 }).status(400)
        }       
    });

    tradersRouter.get('/market_place', async (req, res)=>{
        let user = await req.user
        let isVerified = await utils.isVerified(user, 'trader')
        let resp = await tradersController.marketPlace(req, res)
        let message = null;
        const products = resp.response
        if(req.query.Search && products.result.length <= 0){
            message = "No product found"
        }
    
        res.render('seed_trader/market_place', {
        layout : 'traders-dashboard',
        title : 'Market-Place',
        fullname: resp.trader.firstname + ' ' + resp.trader.lastname,
        traderData: resp.trader,
        products,
        message,
        isVerified: resp.isVerified
    });

})

    tradersRouter.get('/product', tradersController.product)
    tradersRouter.get('/products/:id', async (req, res) => {

    const resp = await tradersController.viewProduct(req, res)
    const seedCompany = resp.singleProduct['User.SeedCompany.name_of_company']
    const items = JSON.stringify(JSON.parse(resp.singleProduct.item))
    const data = Object.entries(items)
    
    res.render('seed_trader/view-product', {
        layout : 'traders-dashboard',
        title: 'Product',
        fullname: resp.trader.firstname + ' ' + resp.trader.lastname,
        traderData: resp.trader,
        product: resp.singleProduct,
        seedCompany,
        items: items.min,
        isVerified: resp.isVerified
    })
})

tradersRouter.get("/checkout/preview", async (req, res)=>{
    if(req.query.product){
        console.log(req.query.product)
        let {getCartItems, trader, isVerified}= await tradersController.cartByProductId(req)
        let deliveryInfo = await tradersController.deliveryInfo(trader.user_id)
        res.render('seed_trader/order_preview', {
            layout : 'traders-dashboard',
            title: 'Order Preview',
            fullname: trader.firstname + ' ' + trader.lastname,
            trader: trader,
            isVerified,
            getCartItems,
            deliveryInfo
        })
    }else{
        res.redirect('back')
    }
})

tradersRouter.post('/checkout/preview', async (req, res)=>{
    let items = []
    let data=[];
    
    if(!Array.isArray(req.body.items))
    {
        items.push(req.body.items)
    }else{
        items=req.body.items
    }
    console.log(items)
    //let cart=await tradersController.getCartItemsByIds(items)
    if(!req.body.items){
       data =await tradersController.cart(req, res)
    }else{
        data=await tradersController.getCartItemsByIds(req, items)
    }

    let {getCartItems, trader, isVerified}=data
    let deliveryInfo = await tradersController.deliveryInfo(trader.user_id)
   // console.log(deliveryInfo)
    res.render('seed_trader/order_preview', {
        layout : 'traders-dashboard',
        title: 'Order Preview',
        fullname: trader.firstname + ' ' + trader.lastname,
        trader: trader,
        isVerified,
        getCartItems,
        deliveryInfo
    })
})

tradersRouter.post("/cart/checkout", async (req, res)=>{
   
   try{
        let items=[]
        if(!Array.isArray(req.body.items))
        {
            items.push(req.body.items)
        }else{
            items=req.body.items
        }
        let paymentType = req.body.inlineRadioOptions
        let total_sum = req.body.total_sum
        if(paymentType=='card'){   
            let callback=req.get('origin')+'/seed-trader/checkout/callback'
            let initial= await paystack.initialize('tipson664@gmail.com', total_sum*100, callback, req)
            if(initial.status==true){
                let ref = initial.data.reference
                let {getCartItems, trader}=await tradersController.getCartItemsByIds(req,items)
                await tradersController.initializeTransaction(req, res, ref, getCartItems, trader)
                res.redirect(initial.data.authorization_url);
            }
        }
   }catch(e){
        console.log(e)
        res.send(e)
   }
})

tradersRouter.get('/checkout/callback', async (req, res)=>{
    let ref=req.query.reference
    let check=await tradersController.checkTransaction(ref)
    if(check){
        let data={}
        let items=[]
        data.status='pending'
        tradersController.updateTransactionLog(data, ref)
        let paystackPayload = await paystack.callback(req, res)
        if(paystackPayload.status==true){
            data.status='verified'
            data.currency=paystackPayload.data.currency,
            data.amount = paystackPayload.data.amount / 100
            data.transaction_id=paystackPayload.data.id
            data.description = "Payment for a seed purchase via Card"
            tradersController.updateTransactionLog(data, ref)
            check.TransactionCarts.forEach(t=>{
                items.push(t.cart_id)
            })
            let {trader, isVerified, getCartItems} = await tradersController.getCartItemsByIds(req, items)
            tradersController.createOrder(items, check.id)
            tradersController.updateCart(items)
            getCartItems.forEach(item=>{
                tradersController.productItemsUpdate(item.product_id, item.size, item.qty)
            })
            companyController.creditWallet(getCartItems)
            res.render('seed_trader/payment-success', {
                layout : 'traders-dashboard',
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

tradersRouter.get("/product/price", async (req, res)=>{
    let product = await tradersController.singleProduct(req.query.product_id)
    res.send(product)
})

// Cart Route
tradersRouter.get('/cart', async (req, res) => {
    let resp = await tradersController.cart(req, res)
    res.render('seed_trader/cart', {
        layout : 'traders-dashboard',
        title: 'Cart',
        fullname: resp.trader.firstname + ' ' + resp.trader.lastname,
        tradersData: resp.trader,
        isVerified: resp.isVerified,
        cartItems: resp.getCartItems
    })
})

tradersRouter.post('/add-to-cart', cartValidation(), validate, async (req, res) => {
    let response = await tradersController.addToCart(req, res)

    //First check if item has not been added
    if(response.isItemAlreadyAdded){
        return res.json({ message: 'This item has been already been added to your cart.', statusCode: 200 }).status(200)
    }else if(response.cartItems){
        return res.json({ message: 'Item has been added to cart successfully', statusCode: 200 }).status(200)
    }else{
        return res.json({ message: 'Unable to add item to cart. Please try again', error: true, statusCode: 400 }).status(400)
    }
})

tradersRouter.post('/single-cart-item/:id', cartSingleValidation(), validate, async (req, res) => {
    let response = await tradersController.singleCartItem(req, res)

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

tradersRouter.get('/get-cart-count', async (req, res) => {
    let result = await tradersController.getTraderCartCount(req, res)
    res.json({ message: result , statusCode: 200 }).status(200)
})





tradersRouter.get('/payment-success', async (req, res)=>{
    let user = await req.user;
    let trader = await utils.getTraderPofile(user)
    const isVerified = await utils.isVerified(user, 'trader')

    res.render('seed_trader/payment-success', {
        layout : 'traders-dashboard',
        title: 'Success Page',
        isVerified
    })
})

tradersRouter.get('/transactions', async (req, res)=>{
    let user = await req.user;
    let trader = await utils.getTraderPofile(user)
    const isVerified = await utils.isVerified(user, 'trader')
    let transactions=await tradersController.getTransactions(trader.id)
    res.render('seed_trader/transaction-history', {
        layout : 'traders-dashboard',
        title: 'Transaction History',
        isVerified,
        transactions
    })
})
tradersRouter.get('/order/:transaction_id', async (req, res)=>{
    let user = await req.user;
    let trader = await utils.getTraderPofile(user)
    const isVerified = await utils.isVerified(user, 'trader')
    let transaction_id = req.params.transaction_id
    let transactions=await tradersController.getOrder(req,res)
    let orderStatus=await tradersController.orderStatus(req,res)
    let currency_ = transactions[0].TransactionLog.currency
    let total_amount = transactions[0].TransactionLog.amount
    let pick_up = transactions[0].TransactionLog.pickup_point
    res.render('seed_trader/view-order', {
        layout : 'traders-dashboard',
        title: 'Order View',
        isVerified,
        transactions,
        transaction_id,
        currency_,
        total_amount,
        pick_up,
        orderStatus 
    })
})
tradersRouter.get("/cart/delete/:id", async (req, res)=>{
    tradersController.deleteItem(req, res)
    res.redirect("/seed-trader/cart")
})

tradersRouter.get("/checkout/preview", async (req, res)=>{
    if(req.query.product){
        console.log(req.query.product)
        let {getCartItems, farmer, isVerified}= await tradersController.cartByProductId(req)
        let deliveryInfo = await tradersController.deliveryInfo(farmer.user_id)
        res.render('seed_trader/order_preview', {
            layout : 'traders-dashboard',
            title: 'Order Preview',
            fullname: trader.firstname + ' ' + trader.lastname,
            farmer: farmer,
            isVerified,
            getCartItems,
            deliveryInfo
        })
    }else{
        res.redirect('back')
    }
})


   

module.exports=tradersRouter