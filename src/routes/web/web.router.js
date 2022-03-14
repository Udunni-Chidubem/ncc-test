const siteRouter = require('./site.router');

const webRouter = require('express').Router();
//all router on web router will be use here for prefixing
webRouter.use('/', siteRouter)
webRouter.use('/test', siteRouter)
module.exports=webRouter; 
