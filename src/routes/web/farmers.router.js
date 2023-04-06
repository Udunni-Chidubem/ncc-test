const farmersRouter = require("express").Router();
const farmerController = require("../../controllers/farmers.controller");
const utils = require("../../helpers/utils");
const paystack = require("../../helpers/paystack");
const {
  profileUpdateValidation,
  cartValidation,
  cartSingleValidation,
  validate,
  settingsValidation,
} = require("../../helpers/formValidator");
const companyController = require("../../controllers/company.controller");
const { isVerified } = require("../../helpers/utils");
const { now } = require("moment");
const weatherController = require("../../controllers/weather.controller");
const { default: axios } = require("axios");

farmersRouter.get("/dashboard", async (req, res) => {
  let user = await req.user;
  let farmer = await utils.getFarmerProfile(user);
  const isVerified = await utils.isVerified(user, "farmer");
  let { firstname, lastname, LGA, State } = farmer;
  let cartCount = await farmerController.getFarmerCartCount(req, res);
  let transactionCount = await farmerController.getTransactionlogCount(
    farmer.id
  );
  let transactions = await farmerController.getTransactions(farmer.id);

  res.render("farmers/dashboard", {
    layout: "farmers-dashboard",
    title: "Dashboard",
    fullname: firstname + " " + lastname,
    lga: farmer["LGA.name"] ? farmer["LGA.name"] : null,
    state: farmer["State.name"] ? farmer["State.name"] : null,
    farmer,
    isVerified,
    cartCount,
    transactionCount,
    transactions,
  });
});

farmersRouter.get("/update-profile", async (req, res) => {
  let { farmer, isVerified, states, deliveryInfo } =
    await farmerController.updateProfile(req, res);
  res.render("farmers/update-profile", {
    layout: "farmers-dashboard",
    title: "Update Profile",
    fullname: farmer.firstname + " " + farmer.lastname,
    farmerData: farmer,
    states: states,
    isVerified,
    deliveryInfo,
  });
});
farmersRouter.get("/settings", async (req, res) => {
  let { farmer, isVerified } = await farmerController.settings(req, res);
  res.render("farmers/settings", {
    layout: "farmers-dashboard",
    title: "Settings",
    fullname: farmer.firstname + " " + farmer.lastname,
    farmerData: farmer,
    isVerified,
    farmer,
  });
});
farmersRouter.post(
  "/update-profile",
  profileUpdateValidation(),
  validate,
  async (req, res) => {
    let response = await farmerController.editProfileData(req, res);
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
farmersRouter.post(
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

farmersRouter.get("/market_place", async (req, res) => {
  let resp = await farmerController.marketPlace(req, res);
  let message = null;
  const products = resp.response;

  if (req.query.Search && products.result.length <= 0) {
    message = "No product found";
  }
  res.render("farmers/market_place", {
    layout: "farmers-dashboard",
    title: "Market Place",
    fullname: resp.farmer.firstname + " " + resp.farmer.lastname,
    farmerData: resp.farmer,
    products,
    message,
    isVerified: resp.isVerified,
  });
});

farmersRouter.get("/product", farmerController.product);

farmersRouter.get("/products/:id", async (req, res) => {
  const resp = await farmerController.viewProduct(req, res);
  const seedCompany = resp.singleProduct["User.SeedCompany.name_of_company"];
  const items = JSON.stringify(JSON.parse(resp.singleProduct.item));
  const data = Object.entries(items);

  res.render("farmers/view-product", {
    layout: "farmers-dashboard",
    title: "Product",
    fullname: resp.farmer.firstname + " " + resp.farmer.lastname,
    farmerData: resp.farmer,
    product: resp.singleProduct,
    seedCompany,
    items: items.min,
    isVerified: resp.isVerified,
  });
});

farmersRouter.get("/checkout/preview", async (req, res) => {
  if (req.query.product) {
    console.log(req.query.product);
    let { getCartItems, farmer, isVerified } =
      await farmerController.cartByProductId(req);
    let deliveryInfo = await farmerController.deliveryInfo(farmer.user_id);
    res.render("farmers/order_preview", {
      layout: "farmers-dashboard",
      title: "Order Preview",
      fullname: farmer.firstname + " " + farmer.lastname,
      farmer: farmer,
      isVerified,
      getCartItems,
      deliveryInfo,
    });
  } else {
    res.redirect("back");
  }
});

farmersRouter.post("/checkout/preview", async (req, res) => {
  let items = [];
  let data = [];

  if (!Array.isArray(req.body.items)) {
    items.push(req.body.items);
  } else {
    items = req.body.items;
  }
  console.log(items);
  //let cart=await farmerController.getCartItemsByIds(items)
  if (!req.body.items) {
    data = await farmerController.cart(req, res);
  } else {
    data = await farmerController.getCartItemsByIds(req, items);
  }

  let { getCartItems, farmer, isVerified } = data;
  let deliveryInfo = await farmerController.deliveryInfo(farmer.user_id);
  // console.log(deliveryInfo)
  res.render("farmers/order_preview", {
    layout: "farmers-dashboard",
    title: "Order Preview",
    fullname: farmer.firstname + " " + farmer.lastname,
    farmer: farmer,
    isVerified,
    getCartItems,
    deliveryInfo,
  });
});

farmersRouter.post("/cart/checkout", async (req, res) => {
  try {
    let items = [];
    if (!Array.isArray(req.body.items)) {
      items.push(req.body.items);
    } else {
      items = req.body.items;
    }
    let paymentType = req.body.inlineRadioOptions;
    let total_sum = req.body.total_sum;
    let callback = req.get("origin") + "/farmer/checkout/callback";
    if (paymentType == "card") {
      let initial = await paystack.initialize(
        "tipson664@gmail.com",
        total_sum * 100,
        callback,
        req
      );
      console.log(initial);
      if (initial.status == true) {
        let ref = initial.data.reference;
        let { getCartItems, farmer } = await farmerController.getCartItemsByIds(
          req,
          items
        );
        await farmerController.initializeTransaction(
          req,
          res,
          ref,
          getCartItems,
          farmer
        );
        res.redirect(initial.data.authorization_url);
      }
    }
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

farmersRouter.get("/checkout/callback", async (req, res) => {
  let ref = req.query.reference;
  let check = await farmerController.checkTransaction(ref);
  if (check) {
    let data = {};
    let items = [];
    data.status = "pending";
    farmerController.updateTransactionLog(data, ref);
    let paystackPayload = await paystack.callback(req, res);
    if (paystackPayload.status == true) {
      data.status = "verified";
      (data.currency = paystackPayload.data.currency),
        (data.amount = paystackPayload.data.amount / 100);
      data.transaction_id = paystackPayload.data.id;
      data.description = "payment for a seed purchase via card";
      farmerController.updateTransactionLog(data, ref);
      check.TransactionCarts.forEach((t) => {
        items.push(t.cart_id);
      });
      let { farmer, isVerified, getCartItems } =
        await farmerController.getCartItemsByIds(req, items);
      farmerController.createOrder(items, check.id);
      farmerController.updateCart(items);
      getCartItems.forEach((item) => {
        farmerController.productItemsUpdate(
          item.product_id,
          item.size,
          item.qty
        );
      });
      companyController.creditWallet(getCartItems);

      res.render("farmers/payment-success", {
        layout: "farmers-dashboard",
        title: "Success Page",
        isVerified,
        paystackPayload,
        data,
      });
      $msg = `Your order is confirmed and your no is ${data.transaction_id}. Thank you for shopping on NIGSIMS!`;
      let r = await axios.get(
        `${process.env.sms_api}?token=${process.env.token_number}&sender=NIGSIMS&to=${farmer.phone_no}&message=${$msg}&type=0&routing=3`
      );
      return;
    }
  }
  res.send(
    "this is not a valid transaction reference, pls contact admin if this is a error"
  );
});

farmersRouter.get("/product/price", async (req, res) => {
  let product = await farmerController.singleProduct(req.query.product_id);
  res.send(product);
});

// Cart Route
farmersRouter.get("/cart", async (req, res) => {
  let resp = await farmerController.cart(req, res);
  res.render("farmers/cart", {
    layout: "farmers-dashboard",
    title: "Cart",
    fullname: resp.farmer.firstname + " " + resp.farmer.lastname,
    farmerData: resp.farmer,
    isVerified: resp.isVerified,
    cartItems: resp.getCartItems,
  });
});

farmersRouter.post(
  "/add-to-cart",
  cartValidation(),
  validate,
  async (req, res) => {
    let response = await farmerController.addToCart(req, res);

    //First check if item has not been added
    if (response.isItemAlreadyAdded) {
      return res
        .json({
          message: "This item has been already been added to your cart.",
          statusCode: 200,
        })
        .status(200);
    } else if (response.cartItems) {
      return res
        .json({
          message: "Item has been added to cart successfully",
          statusCode: 200,
        })
        .status(200);
    } else {
      return res
        .json({
          message: "Unable to add item to cart. Please try again",
          error: true,
          statusCode: 400,
        })
        .status(400);
    }
  }
);

farmersRouter.post(
  "/single-cart-item/:id",
  cartSingleValidation(),
  validate,
  async (req, res) => {
    let response = await farmerController.singleCartItem(req, res);

    if (response.product == null) {
      return res
        .json({
          message: "Sorry we are unable to process the item.",
          statusCode: 400,
        })
        .status(400);
    } else if (response.isItemAlreadyAdded) {
      return res
        .json({
          message: "This item has been already been added to your cart.",
          statusCode: 200,
        })
        .status(200);
    } else if (response.cartItems) {
      return res
        .json({
          message: "Item has been added to cart successfully",
          statusCode: 200,
        })
        .status(200);
    } else {
      return res
        .json({
          message: "Unable to add item to cart. Please try again",
          error: true,
          statusCode: 400,
        })
        .status(400);
    }
  }
);

farmersRouter.get("/get-cart-count", async (req, res) => {
  let result = await farmerController.getFarmerCartCount(req, res);
  res.json({ message: result, statusCode: 200 }).status(200);
});

farmersRouter.get("/payment-success", async (req, res) => {
  let user = await req.user;
  let farmer = await utils.getFarmerProfile(user);
  const isVerified = await utils.isVerified(user, "farmer");

  res.render("farmers/payment-success", {
    layout: "farmers-dashboard",
    title: "Success Page",
    isVerified,
  });
});

farmersRouter.get("/transactions", async (req, res) => {
  let user = await req.user;
  let farmer = await utils.getFarmerProfile(user);
  const isVerified = await utils.isVerified(user, "farmer");
  let transactions = await farmerController.getTransactions(farmer.id);
  res.render("farmers/transaction-history", {
    layout: "farmers-dashboard",
    title: "Transaction History",
    isVerified,
    transactions,
    fullname: farmer.firstname + " " + farmer.lastname,
  });
});
farmersRouter.get("/order/:transaction_id", async (req, res) => {
  let user = await req.user;
  let farmer = await utils.getFarmerProfile(user);
  const isVerified = await utils.isVerified(user, "farmer");
  let transaction_id = req.params.transaction_id;
  let transactions = await farmerController.getOrder(req, res);
  let orderStatus = await farmerController.orderStatus(req, res);
  let currency_ = transactions[0].TransactionLog.currency;
  let total_amount = transactions[0].TransactionLog.amount;
  let pick_up = transactions[0].TransactionLog.pickup_point;
  res.render("farmers/view-order", {
    layout: "farmers-dashboard",
    title: "Order View",
    isVerified,
    transactions,
    transaction_id,
    currency_,
    total_amount,
    pick_up,
    orderStatus,
    fullname: farmer.firstname + " " + farmer.lastname,
  });
});
farmersRouter.get("/cart/delete/:id", async (req, res) => {
  farmerController.deleteItem(req, res);
  res.redirect("/farmer/cart");
});

farmersRouter.get("/settings/deactivate/:id/:status", async (req, res) => {
  let data = { status: req.params.status, updated_at: now() };
  let id = req.params.id;
  console.log(id);
  farmerController.userUpdate(data, id);
  req.logOut();
  res.redirect("/login");
});

// farmersRouter.get('/knowledge-base', (req,res) => {
//     res.render('/index', {
//         layout: 'farmers-dashboard',
//         title : 'Knowledge Base - Index'
//     });
// })
farmersRouter.get("/forecast", async (req, res) => {
  let user = await req.user;
  let farmer = await utils.getFarmerProfile(user);
  console.log(farmer);
  let forecast = await weatherController.forecast(
    farmer["State.name"],
    farmer["LGA.name"]
  );
  if (forecast.Headline) {
    res.send({ statusCode: 200, body: forecast });
    return;
  }
  res.send({ statusCode: 404, body: forecast });
});

module.exports = farmersRouter;
