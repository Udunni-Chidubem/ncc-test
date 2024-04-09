const accountRouter = require("./account.route");
const farmerRouter = require("./farmer.router");
const apiRouter = require("express").Router();
const baseRouter = require("./base.router");
const passport = require("passport");
const passportjwt = require("../../helpers/passport-jwt");
const verityToken = require("../../helpers/middleware");
const companyRoute = require("./company.route");
const traderRoute = require("./trader.route");
const { helpers } = require("handlebars");
const authGuard = require("../../helpers/auth.guard");
const fileRoute = require("./file.routes");
require("../../helpers/passport-jwt");
passportjwt(passport);

//all router on api will be use here for prefixing
apiRouter.use("/account", accountRouter);

apiRouter.use(
  "/farmer",
  verityToken,
  authGuard.hasRole("farmer"),
  farmerRouter
);
apiRouter.use(
  "/company",
  verityToken,
  authGuard.hasRole("seed_company"),
  companyRoute
);
apiRouter.use(
  "/trader",
  verityToken,
  authGuard.hasRole("seed_trader"),
  traderRoute
);
apiRouter.use("/file", fileRoute);
apiRouter.use("/base", baseRouter);

module.exports = apiRouter;
