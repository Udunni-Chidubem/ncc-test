const companyRouter = require('./company.router');
const farmersRouter = require('./farmers.router');
const siteRouter = require('./site.router');
const tradersRouter = require('./traders.router');
const helpers = require('../../helpers/auth.guard')

const webRouter = require('express').Router();
//all router on web router will be use here for prefixing
webRouter.use('/farmer', helpers.auth,  farmersRouter)
webRouter.use('/company', companyRouter)
webRouter.use('/trader', tradersRouter)
webRouter.use('/', siteRouter)
 
module.exports=webRouter; 
