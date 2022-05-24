const tradersRouter=require('express').Router()
const utils = require('../../helpers/utils')

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

  res.render('seed_trader/market_place', {
    layout : 'traders-dashboard',
    title : 'Market-Place',
    isVerified
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