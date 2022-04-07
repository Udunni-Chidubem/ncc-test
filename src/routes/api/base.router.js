const siteController = require('../../controllers/site.controller');

const baseRouter = require('express').Router();

baseRouter.get('/lgas/:state_id', siteController.lgaByStateId)
baseRouter.get('/default-lga/:state_id/:lga_id', siteController.lgas)
baseRouter.get('/get-droplist', siteController.getDropList)

module.exports = baseRouter