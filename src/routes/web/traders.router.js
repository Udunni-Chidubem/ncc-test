const tradersRouter=require('express').Router()
const utils = require('../../helpers/utils')
const tradersController = require('../../controllers/traders.controller')
const { profileUpdateValidation, cartValidation, cartSingleValidation, validate, settingsValidation } = require('../../helpers/formValidator')



tradersRouter.get('/referal', async (req, res)=>{
    let user = await req.user
    const trader = await utils.getTraderPofile(user)
    let referal_id = trader.user_id
    let referal_code = trader.referal_code
    let isVerified = await utils.isVerified(user, 'trader')
    let traderRefres = await tradersController.traderRefres(req,referal_id)
    let traderRefres_len = traderRefres.length
    
    res.render('seed_trader/referal', {
        layout : 'traders-dashboard',
        title : 'Referal',
        isVerified,
        trader,
        traderRefres,
        traderRefres_len,
        referal_code
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
<<<<<<< HEAD
tradersRouter.get('/settings', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user, 'trader')
    
    res.render('seed_trader/settings', {
        layout : 'traders-dashboard',
        title : 'Settings',
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
// tradersRouter.get('/settings', async (req, res)=>{
//     let user = await req.user
//     let isVerified = await utils.isVerified(user, 'trader')

//   res.render('seed_trader/settings', {
//     layout : 'traders-dashboard',
//     title : 'settings',
//     isVerified
//    })
   
// })

=======
>>>>>>> 0257610fbdf40fbcef5bace8ca18fd5c1849d7b9
tradersRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
    let trader = await utils.getTraderPofile(user)
    let isVerified = await utils.isVerified(user)
    
    res.render('seed_trader/dashboard', {
        layout : 'traders-dashboard',
        title : 'Dashboard',
        isVerified,
        trader
    })

    tradersRouter.get('/update-profile', tradersController.updateProfile)
    tradersRouter.get('/settings', tradersController.settings)
    tradersRouter.post('/update-profile', profileUpdateValidation(), validate, async (req, res) => {
        let r = await tradersController.updateProfile(req, res)
        if(r.trader) {
            res.json({ message: 'Your profile has been “updated” successfully.', statusCode: 200 }).status(200)
        }else{
            res.json({ message: r.errors, error: true, statusCode: 400 }).status(400)
        }    
    });

}),
    





module.exports=tradersRouter