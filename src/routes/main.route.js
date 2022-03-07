require('dotenv').config()

const router = require('express').Router()
const siteController = require('../controllers/site.controller')
const api = require('./api/api.router');
const web = require('./web/web.router');


router.use('/api', api);
router.use('/', web)



module.exports = router