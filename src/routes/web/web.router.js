const siteRouter = require('./site.router');

const webRouter = require('express').Router();
//all router on web router will be use here for prefixing
webRouter.use('/', siteRouter)
webRouter.use('/presignup', siteRouter)
webRouter.use('/aboutus', siteRouter)
webRouter.use('/farmer_signup', siteRouter)
module.exports=webRouter; 