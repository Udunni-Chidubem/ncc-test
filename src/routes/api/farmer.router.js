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
      data: {
        farmer,
        isVerified,
        states,
        deliveryInfo,
      },
      statusCode: 200,
    })
    .status(200);
});
farmerRouter.post("/profile", async (req, res) => {
  let response = await farmersController.editProfileData(req, res);
  if (response.farmer || response.deliveryInformation) {
    res
      .json({
        data: "Your profile has been updated successfully and you will be redirected shortly.",
        statusCode: 200,
      })
      .status(200);
  } else {
    res
      .json({ data: response.errors, error: true, statusCode: 400 })
      .status(400);
  }
});
farmerRouter.get("/settings", async (req, res) => {
  let { farmer, isVerified } = await farmersController.settings(req, res);
  res.status(200).json({ data: { farmer, isVerified }, statusCode: 200 });
});
farmerRouter.post("/settings", async (req, res) => {
  req.body.userphoneno = user.username;
  let response = await farmersController.updatePassword(req, res);
  //  {status,farmer,isVerified,message_}
  if (response.message_) {
    return res.json({ data: response.message_, statusCode: 200 }).status(200);
  }
  return res.json({ data: response });
});
farmerRouter.get("/market", async (req, res) => {
  let { response } = await farmersController.marketPlace(req, res);
  res.status(200).json({ data: response, statusCode: 200 });
});
farmerRouter.get("/cart", async (req, res) => {
  let { getCartItems } = await farmersController.cart(req, res);
  let items = getCartItems;
  res.status(200).json({ data: items, statusCode: 200 });
});
farmerRouter.post("/cart", async (req, res) => {
  let response = await farmersController.addToCart(req, res);
  res.status(200).json({ data: response, statusCode: 200 });
});
farmerRouter.get("/transactions", async (req, res) => {
  const user = await req.user;
  let farmer = await utils.getFarmerProfile(user);
  let transactions = await farmersController.getTransactions(farmer.id);
  res.status(200).json({ data: transactions, statusCode: 200 });
});
farmerRouter.get("/transactions/:id", async (req, res) => {
  let transaction = await farmersController.getOrderById(req, res);
  res.status(200).json({ data: transaction, statusCode: 200 });
  return;
});
farmerRouter.get("/product/:id", async (req, res) => {
  const resp = await farmersController.viewProduct(req, res);
  res.status(200).json({
    data: resp.singleProduct,
    statusCode: 200,
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
    let carts = req.body.carts;
    carts.forEach((e) => {
      ids.push(e.id);
    });
    let { getCartItems, farmer } = await farmerController.getCartItemsByIds(
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
    let paystackPayload = await paystack.callBackMob(ref);
    if (paystackPayload.status == true) {
      let check = await farmerController.checkTransaction(ref);
      data.status = "verified";
      (data.currency = paystackPayload.data.currency),
        (data.amount = paystackPayload.data.amount / 100);
      data.transaction_id = paystackPayload.data.id;
      data.description = "payment for a seed purchase via card";
      farmersController.updateTransactionLog(data, ref);
      let { farmer, isVerified, getCartItems } =
        await farmerController.getCartItemsByIds(req, ids);
      farmersController.createOrder(ids, log.id);
      farmersController.updateCart(ids);
      getCartItems.forEach((item) => {
        farmerController.productItemsUpdate(
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
      data: e.message,
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
  //let cart=await farmerController.getCartItemsByIds(items)
  if (!req.body.carts) {
    data = await farmersController.cart(req, res);
  } else {
    data = await farmersController.getCartItemsByIds(req, items);
  }

  let { getCartItems, farmer, isVerified } = data;
  let deliveryInfo = await farmersController.deliveryInfo(farmer.user_id);

  res.status(200).json({
    statusCode: 200,
    data: { deliveryInfo: deliveryInfo, farmer: farmer, items: getCartItems },
  });
});
module.exports = farmerRouter;
