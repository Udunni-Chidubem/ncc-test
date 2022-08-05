const accountRouter = require("express").Router();
const siteController = require("../../controllers/site.controller");

accountRouter.post("/login", async (req, res) => {
  let resp = await siteController.apiLogin(req);
  res.status(resp.statusCode).json(resp);
});

accountRouter.post("/farmer-signup", async (req, res) => {
  let y = await siteController.savefarmer(req, res);

  if (y.user) {
    res
      .status(200)
      .json({
        statusCode: 200,
        message: "Account created successfully",
        body: y.farmer,
      })
      .send();
  } else {
    res
      .status(400)
      .json({ statusCode: 400, message: "there was an error", body: y })
      .send();
  }
});
accountRouter.post("/company-signup", async (req, res) => {
  let y = await siteController.saveseedcompany(req, res);
  if (y.user) {
    res
      .status(200)
      .json({
        statusCode: 200,
        message: "Account created successfully",
        body: y.seed_company,
      })
      .send();
  } else {
    res
      .status(400)
      .json({ statusCode: 400, message: "there was an error", body: y })
      .send();
  }
});

accountRouter.post("/trader-signup", async (req, res) => {
  let y = await siteController.saveseedtrader(req, res);
  if (y.user) {
    res
      .status(200)
      .json({
        statusCode: 200,
        message: "Account created successfully",
        body: y.seed_company,
      })
      .send();
  } else {
    res
      .status(400)
      .json({ statusCode: 400, message: "there was an error", body: y })
      .send();
  }
});

module.exports = accountRouter;
