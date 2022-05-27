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
    let isVerified = await utils.isVerified(user, 'trader')
    
    res.render('seed_trader/orders', {
        layout : 'traders-dashboard',
        title : 'Orders',
        isVerified
    })
})
tradersRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
    let trader = await utils.getTraderPofile(user)
    let referal_id = trader.user_id
    let referal_code = trader.referal_code
    let isVerified = await utils.isVerified(user, 'trader')
    let traderRefres = await tradersController.traderRefres(req,referal_id)
    let traderRefres_len = traderRefres.length
    
    res.render('seed_trader/dashboard', {
        layout : 'traders-dashboard',
        title : 'Dashboard',
        isVerified,
        trader,
        traderRefres,
        traderRefres_len,
        referal_code
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

tradersRouter.get("/product/price", async (req, res)=>{
    let product = await tradersController.singleProduct(req.query.product_id)
    res.send(product)
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