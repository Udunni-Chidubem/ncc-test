require('dotenv').config()

const router = require('express').Router()
const siteController = require('../controllers/site.controller')

router.get('/', siteController.home)

module.exports = router