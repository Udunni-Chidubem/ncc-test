const companyRouter = require('./company.router');
const farmersRouter = require('./farmers.router');
const siteRouter = require('./site.router');
const tradersRouter = require('./traders.router');
const adminRouter = require('./admin.router');
const helpers = require('../../helpers/auth.guard')

const webRouter = require('express').Router();
//all router on web router will be use here for prefixing
webRouter.use('/farmer', helpers.auth,  farmersRouter)
webRouter.use('/seed-company', helpers.auth, companyRouter)
webRouter.use('/seed-trader', helpers.auth, tradersRouter)
webRouter.use('/admin', helpers.auth, adminRouter)
webRouter.use('/', siteRouter)
 
module.exports=webRouter; 
