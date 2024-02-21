const siteController = require("../../controllers/site.controller");

const baseRouter = require("express").Router();

baseRouter.get("/lgas/:state_id", siteController.lgaByStateId);
baseRouter.get("/default-lga/:state_id/:lga_id", siteController.lgas);
baseRouter.get("/get-droplist", siteController.getDropList);
baseRouter.get("/state", async (req, res) => {
  let states = await siteController.getStates();
  res.send(states);
});

module.exports = baseRouter;
