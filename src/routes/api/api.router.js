<<<<<<< HEAD
const userRouter = require('./user.route');
const farmerRouter = require('./farmer.router')
const apiRouter = require('express').Router();
const baseRouter = require('./base.router');
const passport = require('passport');
const passportjwt=require('../../helpers/passport-jwt')
const verityToken = require('../../helpers/middleware');
require('../../helpers/passport-jwt');
//passportjwt(passport);
=======
const accountRouter = require("./account.route");
const farmerRouter = require("./farmer.router");
const apiRouter = require("express").Router();
const baseRouter = require("./base.router");
const passport = require("passport");
const passportjwt = require("../../helpers/passport-jwt");
const verityToken = require("../../helpers/middleware");
require("../../helpers/passport-jwt");
passportjwt(passport);
>>>>>>> d5c67fc2c558775767509df5d1f922e5d6f60225
//all router on api will be use here for prefixing
apiRouter.use("/account", accountRouter);
apiRouter.use("/farmer", verityToken, farmerRouter);
apiRouter.use("/base", baseRouter);

module.exports = apiRouter;
