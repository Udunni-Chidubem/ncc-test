const farmerRouter = require("express").Router();
const farmersController = require("../../controllers/farmers.controller");
const siteController = require("../../controllers/site.controller");
const {
  profileUpdateValidation,
  cartValidation,
  cartSingleValidation,
  validate,
  settingsValidation,
} = require("../../helpers/formValidator");
farmerRouter.post("/signup", async (req, res) => {
  let y = await siteController.savefarmer(req, res);
  res.send(y);
});
farmerRouter.get("/signup", (req, res) => {
  res.send("Hello you are welcome");
});

farmersRouter.post(
  "/update-profile",
  profileUpdateValidation(),
  validate,
  async (req, res) => {
    let response = await farmersController.editProfileData(req, res);
    if (response.farmer || response.deliveryInformation) {
      res
        .json({
          message:
            "Your profile has been updated successfully and you will be redirected shortly.",
          statusCode: 200,
        })
        .status(200);
    } else {
      res
        .json({ message: response.errors, error: true, statusCode: 400 })
        .status(400);
    }
  }
);

module.exports = farmerRouter;
