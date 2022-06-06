require('dotenv').config()
const weatherController =require('../controllers/weather.controller')
const router = require('express').Router()
const siteController = require('../controllers/site.controller')
const api = require('./api/api.router');
const web = require('./web/web.router');


router.use('/api', api);
router.get('/weather',async (req, res)=>{
    
    let y =await weatherController.getCities(req.query.state, req.query.local)
    console.log(y)
    res.send(y)
})
router.use('/', web)



module.exports = router