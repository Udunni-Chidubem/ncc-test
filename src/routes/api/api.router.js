const accountRouter = require("./account.route");
const farmerRouter = require("./farmer.router");
const apiRouter = require("express").Router();
const baseRouter = require("./base.router");
const passport = require("passport");
const passportjwt = require("../../helpers/passport-jwt");
const verityToken = require("../../helpers/middleware");
const companyRoute = require("./company.route");
const traderRoute = require("./trader.route");
require("../../helpers/passport-jwt");
passportjwt(passport);
//all router on api will be use here for prefixing
apiRouter.use("/account", accountRouter);
apiRouter.use("/farmer", verityToken, farmerRouter);
apiRouter.use("/company", verityToken, companyRoute);
apiRouter.use("/trader", verityToken, traderRoute);
apiRouter.use("/base", baseRouter);

module.exports = apiRouter;
