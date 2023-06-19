const companyRouter = require('./company.router');
const farmersRouter = require('./farmers.router');
const siteRouter = require('./site.router');
const tradersRouter = require('./traders.router');
const adminRouter = require('./admin.router');
const helpers = require('../../helpers/auth.guard');
const wheatherRouter = require('./wheather.router');
const reportRouter = require('./reports.router');

const webRouter = require('express').Router();
//all router on web router will be use here for prefixing
webRouter.use('/farmer', helpers.auth, helpers.farmerPermission,  farmersRouter)
webRouter.use('/seed-company', helpers.auth, helpers.seedCompanyPermission, companyRouter)
webRouter.use('/seed-trader', helpers.auth, helpers.seedTraderPermission, tradersRouter)
webRouter.use('/admin', helpers.auth, helpers.adminPermission, adminRouter)
webRouter.use('/admin/report', helpers.auth, helpers.adminPermission, reportRouter)
webRouter.use('/wheather', helpers.auth, wheatherRouter)
webRouter.use('/', siteRouter)
 
module.exports=webRouter; 
