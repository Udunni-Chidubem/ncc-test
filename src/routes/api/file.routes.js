const fileController = require("../../controllers/file.controller");

const fileRoute = require("express").Router();
fileRoute.post("/", fileController.uploadFile);

module.exports = fileRoute;
