const accountRouter = require("express").Router();
const siteController = require("../../controllers/site.controller");

accountRouter.post("/login", async (req, res) => {
  let resp = await siteController.apiLogin(req);
  res.status(resp.statusCode).json(resp);
});

accountRouter.post("/farmer-signup", async (req, res) => {
  let y = await siteController.savefarmer(req, res);
  if (r.user) {
    res
      .json({
        statusCode: 200,
        message: "Account created successfully",
        body: r.farmer,
      })
      .send();
  } else {
    res
      .json({ statusCode: 400, message: "there was an error", body: r.e })
      .send();
  }
});
accountRouter.post("/company-signup", async (req, res) => {
  let y = await siteController.saveseedcompany(req, res);
  if (r.user) {
    res
      .json({
        statusCode: 200,
        message: "Account created successfully",
        body: r.seed_company,
      })
      .send();
  } else {
    res
      .json({ statusCode: 400, message: "there was an error", body: r.e })
      .send();
  }
});

accountRouter.post("/trader-signup", async (req, res) => {
  let y = await siteController.saveseedtrader(req, res);
  if (r.user) {
    res
      .json({
        statusCode: 200,
        message: "Account created successfully",
        body: r.seed_company,
      })
      .send();
  } else {
    res
      .json({ statusCode: 400, message: "there was an error", body: r.e })
      .send();
  }
});

module.exports = accountRouter;
