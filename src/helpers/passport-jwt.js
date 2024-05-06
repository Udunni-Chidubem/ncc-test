// auth.js

var passportJWT = require("passport-jwt");
const db = require("../models/index");
const { User } = db;
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
  secretOrKey: process.env.secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
};

module.exports = function (passport) {
  var strategy = new Strategy(params, function (payload, done) {
    if (payload.expire <= Date.now())
      return done(new Error("TokenExpired"), null);

    User.findOne({
      where: { id: payload.sub },
    }).then((user) => {
      if (user.status == 2) return done(new Error("AccountNotActive"), null);

      if (user.id) return done(null, user);

      return done(new Error("UserNotFound"), null);
    });
  });
  passport.use(strategy);
  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate("jwt", { session: false });
    },
  };
};
