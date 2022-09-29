const userRouter = require('./user.route');
const farmerRouter = require('./farmer.router')
const apiRouter = require('express').Router();
// const baseRouter = require('./base.router');
const passport = require('passport');
const passportjwt=require('../../helpers/passport-jwt')
const verityToken = require('../../helpers/middleware');
require('../../helpers/passport-jwt');
//passportjwt(passport);
const accountRouter = require("./account.route");
<<<<<<< HEAD
// const apiRouter = require("express").Router();
=======
const farmerRouter = require("./farmer.router");
const apiRouter = require("express").Router();
const baseRouter = require("./base.router");
const passport = require("passport");
const passportjwt = require("../../helpers/passport-jwt");
const verityToken = require("../../helpers/middleware");
const erpnext = require("../../helpers/erpnext");
>>>>>>> 56bec5fb1df421fe817a0041b38cbb94935522d1
require("../../helpers/passport-jwt");
passportjwt(passport);
//all router on api will be use here for prefixing
apiRouter.use("/account", accountRouter);
apiRouter.use("/farmer", verityToken, farmerRouter);
apiRouter.use("/base", baseRouter);
apiRouter.post("/erp/login", async (req, res) => {
  let result = await erpnext.login(req.body.username, req.body.password);
  res.send(result);
});

module.exports = apiRouter;
