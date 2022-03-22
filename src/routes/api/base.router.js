const siteController = require('../../controllers/site.controller');

const baseRouter = require('express').Router();



baseRouter.get('/lgas/:state_id', siteController.lgaByStateId)

module.exports = baseRouter