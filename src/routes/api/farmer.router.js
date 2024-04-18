const farmerRouter = require("express").Router();
const companyController = require("../../controllers/company.controller");
const farmersController = require("../../controllers/farmers.controller");
const siteController = require("../../controllers/site.controller");
const {
  profileUpdateValidation,
  cartValidation,
  cartSingleValidation,
  validate,
  settingsValidation,
} = require("../../helpers/formValidator");
const paystack = require("../../helpers/paystack");
const utils = require("../../helpers/utils");

farmerRouter.get("/profile", async (req, res) => {
  let { farmer, isVerified, states, deliveryInfo } =
    await farmersController.updateProfile(req, res);
  res
    .json({
      body: {
        farmer,
        isVerified,
        deliveryInfo,
      },
      statusCode: 200,
      message: "pulled successfully",
    })
    .status(200);
});
farmerRouter.post("/profile", async (req, res) => {
  let response = await farmersController.editProfileData(req, res);
  if (response.farmer || response.deliveryInformation) {
    res
      .json({
        body: "Your profile has been updated successfully and you will be redirected shortly.",
        statusCode: 200,
      })
      .status(200);
  } else {
    res
      .json({ message: response.message, error: true, statusCode: 400 })
      .status(400);
  }
});
farmerRouter.get("/settings", async (req, res) => {
  let { farmer, isVerified } = await farmersController.settings(req, res);
  res.status(200).json({ body: { farmer, isVerified }, statusCode: 200 });
});
farmerRouter.post("/settings", async (req, res) => {
  let user = await req.user;
  req.body.userphoneno = user.username;
  let response = await farmersController.updatePassword(req, res);
  if (response.message_) {
    return res.json({ body: response.message_, statusCode: 200 }).status(200);
  }
  return res.json({ body: response });
});
farmerRouter.get("/market", async (req, res) => {
  let { response } = await farmersController.marketPlace(req, res);
  res.status(200).json({ body: response, statusCode: 200 });
});
farmerRouter.get("/cart", async (req, res) => {
  let { getCartItems } = await farmersController.cart(req, res);
  let items = getCartItems;
  res.status(200).json({ body: items, statusCode: 200 });
});
farmerRouter.post("/cart", async (req, res) => {
  let response = await farmersController.addToCart(req, res);
  if (response.isItemAlreadyAdded == null) {
    res
      .status(200)
      .json({ body: response, statusCode: 200, message: "Added succssfully" });
    return;
  }
  res.status(200).json({
    body: response,
    statusCode: 400,
    message: "item of this package and quantity already on the cart",
  });
  return;
});
farmerRouter.get("/transactions", async (req, res) => {
  const user = await req.user;
  let farmer = await utils.getFarmerProfile(user);
  let transactions = await farmersController.getTransactions(farmer.id);
  res.status(200).json({
    body: transactions,
    statusCode: 200,
    message: "pulled successfully",
  });
});
farmerRouter.get("/transactions/:id", async (req, res) => {
  let transaction = await farmersController.getOrderById(req, res);
  res.status(200).json({
    body: transaction,
    statusCode: 200,
    message: "pulled successfully",
  });
  return;
});
farmerRouter.get("/product/:id", async (req, res) => {
  const resp = await farmersController.viewProduct(req, res);
  res.status(200).json({
    body: resp.singleProduct,
    statusCode: 200,
    message: "pulled successfully",
  });
});
farmerRouter.delete("/cart/:id", async (req, res) => {
  let count = await farmersController.deleteCart(req, res);
  if (count > 0) {
    res.status(200).json({
      data: "product deleted from cart successfully",
      statusCode: 200,
    });
  } else {
    res.status(400).json({
      data: "failed to delete product",
      statusCode: 400,
    });
  }
});
farmerRouter.post("/transactions", async (req, res) => {
  try {
    let ref = req.body.reference;
    let ids = [];
    let paystackPayload = await paystack.callBackMob(ref);
    if (paystackPayload.status == true) {
      let carts = req.body.carts;
      carts.forEach((e) => {
        ids.push(e.id);
      });
      let { getCartItems, farmer } = await farmersController.getCartItemsByIds(
        req,
        ids
      );
      let log = await farmersController.initializeTransaction(
        req,
        res,
        ref,
        getCartItems,
        farmer
      );
      let check = await farmersController.checkTransaction(ref);
      data.status = "verified";
      (data.currency = paystackPayload.data.currency),
        (data.amount = paystackPayload.data.amount / 100);
      data.transaction_id = paystackPayload.data.id;
      data.description = "payment for a seed purchase via card";
      farmersController.updateTransactionLog(data, ref);
      // var { farmer, getCartItems } = await farmersController.getCartItemsByIds(
      //   req,
      //   ids
      // );
      farmersController.createOrder(ids, log.id);
      farmersController.updateCart(ids);
      getCartItems.forEach((item) => {
        farmersController.productItemsUpdate(
          item.product_id,
          item.size,
          item.qty
        );
      });
      companyController.creditWallet(getCartItems);
      res
        .status(200)
        .json({ data: "Order completed successfully", statusCode: 200 });
    } else {
      res.status(404).json({
        data: "invalid transaction reference",
        statusCode: 404,
      });
    }
  } catch (e) {
    res.status(500).json({
      data: e,
      statusCode: 500,
    });
  }
});
farmerRouter.post("/order/preview", async (req, res) => {
  let items = [];
  let data = [];
  let carts = req.body.carts;
  carts.forEach((e) => {
    items.push(e.id);
  });
  let user = req.user;
  //let cart=await farmerController.getCartItemsByIds(items)
  if (!req.body.carts) {
    data = await farmersController.cart(req, res);
  } else {
    data = await farmersController.getCartItemsByIds(req, items);
  }

  let { getCartItems, farmer } = data;
  let deliveryInfo = await farmersController.deliveryInfo(user.id);

  res.status(200).json({
    statusCode: 200,
    data: { deliveryInfo: deliveryInfo, items: getCartItems },
  });
});
module.exports = farmerRouter;
