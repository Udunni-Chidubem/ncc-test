const userRouter = require('./user.route');
const farmerRouter = require('./farmer.router')
const apiRouter = require('express').Router();
const baseRouter = require('./base.router');
const passport = require('passport');
const verityToken = require('../../helpers/middleware');
require('../../helpers/passport-jwt');
//all router on api will be use here for prefixing
apiRouter.use('/user', userRouter);
apiRouter.use('/farmer', verityToken, farmerRouter);
apiRouter.use('/base', baseRouter)



module.exports=apiRouter;