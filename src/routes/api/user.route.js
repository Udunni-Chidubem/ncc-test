const userRouter = require('express').Router()
const siteController = require('../../controllers/site.controller')

userRouter.get('/home', (req, res)=>{
    let y= siteController.login(req, res)
    y.then(r=>{
        res.send(r);
    })
});
userRouter.post('/login',async (req, res)=>{
    let resp=await siteController.apiLogin(req);
    res.status(resp.statusCode).json(resp);
})

module.exports = userRouter