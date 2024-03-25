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

baseRouter.get("/knowledge-base/all", async (req, res) => {
    let knowledge_base = await siteController.allKnowledgeBase(req, res);
    return res.status(200).json(knowledge_base);
});

baseRouter.get("/knowledge-base/:id", async (req, res) => {
  let knowledgeBase = await siteController.KnowledgeBase(req, res);
  return res.status(200).json(knowledgeBase);
});

baseRouter.get("/cowpie", (req, res) => {
  res.render("knowledge_base/cowpie", {
    layout: "knowledge_dashboard",
    title: "Knowledge Base - Cowpie",
    crop: "Cowpea",
  });
});

baseRouter.get("/groundnut", (req, res) => {
  res.render("knowledge_base/groundnut", {
    layout: "knowledge_dashboard",
    title: "Knowledge Base - GroundNut",
    crop: "Groundnut",
  });
});

baseRouter.get("/maize", (req, res) => {
  res.render("knowledge_base/maize", {
    layout: "knowledge_dashboard",
    crop: "Maize",
    title: "Knowledge Base - Maize",
  });
});

baseRouter.get("/rice", (req, res) => {
  res.render("knowledge_base/rice", {
    layout: "knowledge_dashboard",
    crop: "Rice",
    title: "Knowledge Base - Rice",
  });
});

baseRouter.get("/recommendation", (req, res) => {
  res.render("knowledge_base/recommendation", {
    layout: "",
    title: "Knowledge Base - Recommendation",
  });
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
