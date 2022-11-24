const tradersController = require("../../controllers/traders.controller");
const utils = require("../../helpers/utils");

const traderRoute = require("express").Router();
traderRoute.get("/profile", async (req, res) => {
  let user = await req.user;
  let trader = await utils.getTraderPofile(user);
  res.status(200).json({
    message: trader,
    statusCode: 200,
  });
});
traderRoute.post("/profile", async (req, res) => {
  let response = await tradersController.editProfileData(req, res);
  if (response.trader || response.deliveryInformation) {
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
});
traderRoute.get("/referals", async (req, res) => {
  let user = await req.user;
  const trader = await utils.getTraderPofile(user);
  let referal_id = trader.user_id;
  let traderRefres = await tradersController.traderRefres(req, referal_id);
  res.status(200).json({ message: traderRefres, statusCode: 200 });
});
traderRoute.get("/transactions", async (req, res) => {
  let user = await req.user;
  const trader = await utils.getTraderPofile(user);
  //   let isVerified = await utils.isVerified(user, "trader");
  let transactions = await tradersController.getTransactions(trader.id);
  res.status(200).json(transactions);
});
traderRoute.get("/transactions/:id", async (req, res) => {
  let transaction = await tradersController.getOrderById(req, res);
  res.status(200).json({ message: transaction, statusCode: 200 });
});
traderRoute.get("/market", async (req, res) => {
  let response = await tradersController.marketPlace(req, res);
  res.status(200).json({ message: response.response });
});
traderRoute.get("/cart", async (req, res) => {
  let { getCartItems } = await tradersController.cart(req, res);
  res.status(200).json({ message: getCartItems, statusCode: 200 });
});
traderRoute.post("/cart", async (req, res) => {
  let response = await tradersController.addToCart(req, res);
  res.status(200).json({ message: response, statusCode: 200 });
});
traderRoute.get("/product/:id", async (req, res) => {
  const resp = await tradersController.viewProduct(req, res);
  res.status(200).json({
    message: resp,
    statusCode: 200,
  });
});
traderRoute.get("/cart/count", async (req, res) => {
  let result = await tradersController.getTraderCartCount(req, res);
  res.json({ message: result, statusCode: 200 }).status(200);
});
module.exports = traderRoute;
