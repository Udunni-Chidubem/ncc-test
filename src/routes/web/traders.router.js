const tradersRouter=require('express').Router()
const utils = require('../../helpers/utils')
const tradersController = require('../../controllers/traders.controller')

tradersRouter.get('/referal', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user, 'trader')
    
    res.render('seed_trader/referal', {
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

tradersRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user, 'trader')
    
    res.render('seed_trader/dashboard', {
        layout : 'traders-dashboard',
        title : 'Dashboard',
        isVerified
    })



}),
    





module.exports=tradersRouter