const siteController = require("../../controllers/site.controller");
const psbPayout = require("../../payments/9psb.payment");

const baseRouter = require("express").Router();

baseRouter.get("/lgas/:state_id", siteController.lgaByStateId);
baseRouter.get("/default-lga/:state_id/:lga_id", siteController.lgas);
baseRouter.get("/get-droplist", siteController.getDropList);
baseRouter.get("/state", async (req, res) => {
  let states = await siteController.getStates();
  res.send(states);
});

/* Binary SOL */

baseRouter.get("/knowledge-base", async (req, res) => {
    let knowledge_base = await siteController.allKnowledgeBase(req, res);
    res.send(knowledge_base);
});


/*
  The below code handles payout endpoints
*/ 

// baseRouter.post("/payment/otherPayout", async (req, res) => {
//   const response = psbPayout.otherBankPayout(req, res);
//   return res.status(200).json(response);
// })


/* Binary EOL */

module.exports = baseRouter;
