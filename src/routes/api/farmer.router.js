const farmerRouter = require('express').Router()
const siteController = require('../../controllers/site.controller')

farmerRouter.post('/signup', (req, res)=>{
    let y= siteController.savefarmer(req, res)
    y.then(r=>{
        res.send(r);
    })
});

module.exports = farmerRouter