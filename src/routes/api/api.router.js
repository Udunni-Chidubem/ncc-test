const userRouter = require('./user.route');
const farmerRouter = require('./farmer.router')
const apiRouter = require('express').Router();
//all router on api will be use here for prefixing
apiRouter.use('/user', userRouter);
apiRouter.use('/farmer', farmerRouter);


module.exports=apiRouter;