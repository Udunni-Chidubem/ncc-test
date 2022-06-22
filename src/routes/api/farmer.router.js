const farmerRouter = require('express').Router()
const siteController = require('../../controllers/site.controller')

farmerRouter.post('/signup', async (req, res)=>{
    let y= await siteController.savefarmer(req, res)
    res.send(y)
});
farmerRouter.get('/signup', (req, res)=>{
    res.send("Hello you are welcome")
})

module.exports = farmerRouter