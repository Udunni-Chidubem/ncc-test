const responses = require("../../helpers/responses");
const jasper = require("../../integrations/jasper");
const adminController = require("../../controllers/admin.controller");
const utils = require("../../helpers/utils");

const reportRouter = require("express").Router();

reportRouter.get("/transactions-jsp", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let states  = await adminController.getStates(req, res);
  let result = null;
  let Location = req.query.Location ?? "ALL";
  let Product = req.query.Product ?? "ALL";
  let Status = req.query.Status ?? "ALL";
  let from = req.query.from ?? new Date().toISOString().split('T')[0];
  let to = req.query.to ?? new Date().toISOString().split('T')[0];
  let resp = await jasper.onlineTransactions(Location,Product,Status, from, to);
  result = responses.success(resp);
  console.log(result)

  // res.status(result.code).send(result);

  res.render("admin/transactions-jsp", {
    layout: "admin-dashboard",
    title: "Transaction Jasper",
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
    states,
    result
  });
});

reportRouter.post("/transactions-jsp", async (req, res) => {
  let result = null;
  let Location = req.query.Location ?? "ALL";
  let Product = req.query.Product ?? "ALL";
  let Status = req.query.Status ?? "ALL";
  let from = req.query.from;
  let to = req.query.to;
  let resp = await jasper.onlineTransactions(Location,Product,Status, from, to);
  result = responses.success(resp);
  res.status(result.code).send(result);
  console.log(result)
  res.render("admin/transactions-jsp", {
    layout: "admin-dashboard",
    title: "Transaction Jasper",
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
    result
  });
});


reportRouter.get("/user-report-jsp", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let states  = await adminController.getStates(req, res);
  let result = null;
  let Location = req.query.Location ?? "ALL";
  let from = req.query.from ?? new Date().toISOString().split('T')[0];
  let to = req.query.to ?? new Date().toISOString().split('T')[0];
  let resp = await jasper.userReport(Location, from, to);
  result = responses.success(resp);
  console.log(result)

  // res.status(result.code).send(result);

  res.render("admin/user_report-jsp", {
    layout: "admin-dashboard",
    title: "User Jasper",
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
    states,
    result
  });
});


reportRouter.post("/user-report-jsp", async (req, res) => {
  let result = null;
  let Location = req.query.Location ?? "ALL";
  let from = req.query.from;
  let to = req.query.to;
  let resp = await jasper.userReport(Location, from, to);
  result = responses.success(resp);
  res.status(result.code).send(result);
  console.log(result)
  res.render("admin/user_report-jsp", {
    layout: "admin-dashboard",
    title: "User Jasper",
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
    result
  });
});

module.exports = reportRouter;
