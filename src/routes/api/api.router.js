const userRouter = require('./user.route');
const apiRouter = require('express').Router();
//all router on api will be use here for prefixing
apiRouter.use('/user', userRouter);

module.exports=apiRouter;