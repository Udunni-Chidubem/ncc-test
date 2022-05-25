const tradersRouter=require('express').Router()
const tradersController = require('../../controllers/traders.controller')
const utils = require('../../helpers/utils')
const { profileUpdateValidation, cartValidation, cartSingleValidation, validate, settingsValidation } = require('../../helpers/formValidator')


tradersRouter.get('/referal', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user, 'trader')
    
    res.render('seed_trader/referral', {
        layout : 'traders-dashboard',
        title : 'Referal',
        isVerified
    })
})

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
    products,
    message,
    isVerified: resp.isVerified
   })
   
})

tradersRouter.get('/orders', async (req, res)=>{
    let user = await req.user
    console.log(user)
    let isVerified = await utils.isVerified(user, 'trader')
    
    res.render('seed_trader/orders', {
        layout : 'traders-dashboard',
        title : 'Orders',
        isVerified
    })
})

tradersRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
    console.log(user)
    let isVerified = await utils.isVerified(user)
    
    res.render('seed_trader/dashboard', {
        layout : 'traders-dashboard',
        title : 'Dashboard',
        isVerified
    })

tradersRouter.get('/update-profile', tradersController.updateProfile)
tradersRouter.get('/settings', tradersController.settings)
tradersRouter.post('/update-profile', profileUpdateValidation(), validate, async (req, res) => {
    let r = await tradersController.updateProfile(req, res)

    if(r.company) {
        res.json({ message: 'Your profile has been “updated” successfully.', statusCode: 200 }).status(200)
    }else{
        res.json({ message: r.errors, error: true, statusCode: 400 }).status(400)
    }
    
});
}),

module.exports=tradersRouter