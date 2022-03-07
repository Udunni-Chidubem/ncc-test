const userRouter = require('express').Router()
const siteController = require('../../controllers/site.controller')

userRouter.get('/home', (req, res)=>{
    let y= siteController.login(req, res)
    y.then(r=>{
        res.send(r);
    })
});

module.exports = userRouter