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

farmerRouter.get("/profile", async (req, res) => {
  let { farmer, isVerified, states, deliveryInfo } =
    await farmerController.updateProfile(req, res);
  res
    .json({
      farmer,
      isVerified,
      states,
      deliveryInfo,
    })
    .status(200);
});

farmerRouter.post(
  "/profile",
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
farmerRouter.get("/settings", async (req, res) => {
  let { farmer, isVerified } = await farmerController.settings(req, res);
  res.status(200).json({ farmer, isVerified });
});
farmerRouter.post(
  "/settings",
  settingsValidation(),
  validate,
  async (req, res) => {
    let response = await farmerController.updatePassword(req, res);
    //  {status,farmer,isVerified,message_}
    if (response.message_) {
      return res
        .json({ message: response.message_, statusCode: 200 })
        .status(200);
    }
    return res.json({ message: response });
  }
);
farmerRouter.get("/market", async (req, res) => {
  let { farmer, isVerified, response } = await farmerController.marketPlace(
    req,
    res
  );
  res.status(200).json({ farmer, isVerified, response });
});
farmerRouter.get("/cart", async (req, res) => {
  let { farmer, isVerified, getCartItems } = await farmerController.cart(
    req,
    res
  );
  res.status(200).json({ farmer, isVerified, getCartItems });
});

module.exports = farmerRouter;
