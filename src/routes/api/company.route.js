const companyRoute = require("express").Router();
const reader = require("xlsx");
const companyController = require("../../controllers/company.controller");
const utils = require("../../helpers/utils");
const seedcompanyService = require("../../services/seedcompany.service");
const psbPayout = require("../../payments/9psb.payment");


companyRoute.get("/profile", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  res.status(200).json(company);
});
companyRoute.post("/profile", async (req, res) => {
  let r = await companyController.updateProfile(req, res);
  if (r.company) {
    res
      .json({
        message: "Your profile has been “updated” successfully.",
        statusCode: 200,
      })
      .status(200);
  } else {
    res.json({ message: r.errors, error: true, statusCode: 400 }).status(400);
  }
});
companyRoute.post("/products", async (req, res) => {
  let filename = "";
  if (req.files) {
    let upload = req.files.upload;
    filename = Date.now() + upload.name;
    upload.mv("./public/product_images/" + filename);
  }
  let r = await companyController.createProduct(req, res, filename);
  if (r.id) {
    res
      .json({
        statusCode: 200,
        message: "Your Product has been created successfully",
        body: r,
      })
      .status(200)
      .send();
  } else {
    res
      .json({ statusCode: 500, error: r, message: "something went wrong" })
      .status(500)
      .send();
  }
});
companyRoute.put("/products/:id", async (req, res) => {
  await companyController.updateProduct(req, res);
  res
    .json({
      statusCode: 200,
      message: "Product updated successfully",
      body: "Product updated succeessfully",
    })
    .status(200)
    .send();
});
companyRoute.get("/products", async (req, res) => {
  let product = await companyController.listProducts(req, res);
  // let paginate;
  // if (product) {
  //   paginate = { page: req.query.page || 1, pageCount: product.totalPages };
  // }
  if (product) {
    res
      .json({
        message: product,
        statusCode: 200,
      })
      .status(200);
  } else {
    res.json({ message: r.errors, error: true, statusCode: 400 }).status(400);
  }
});
companyRoute.get("/products/count", async (req, res) => {
  let user = await req.user;
  let productCount = await seedcompanyService.productCount(user.id);
  res
    .json({
      message: "record pulled successfully",
      statusCode: 200,
      data: productCount,
    })
    .status(200);
});
companyRoute.get("/products/:id", async (req, res) => {
  let product = await companyController.viewProduct(req, res);
  if (product) {
    res
      .json({
        message: "data pulled successfully",
        statusCode: 200,
        data: product,
      })
      .status(200);
  } else {
    res.json({ message: r.errors, error: true, statusCode: 400 }).status(400);
  }
});

companyRoute.get("/orders", async (req, res) => {
  let orders = null;
  product = null;
  if (req.query.product) {
    product = req.query.product;
    orders = await companyController.getProductOrders(req, product);
  } else {
    orders = await companyController.getOrders(req, res);
  }
  res
    .json({
      message: orders,
      statusCode: 200,
    })
    .status(200);
});
companyRoute.get("/orders/count", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let orders = await seedcompanyService.orderCount(company.id);
  res
    .json({
      message: "record pulled successfully",
      statusCode: 200,
      data: orders,
    })
    .status(200);
});
companyRoute.get("/orders/:transaction_id/", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user, "company");
  let company = await utils.getCompanyProfile(user);
  let resp = await companyController.getOrder(
    req.params.transaction_id,
    user.id,
    company.id
  );
  res
    .json({
      message: resp,
      statusCode: 200,
    })
    .status(200);
});
companyRoute.put("/orders/:transaction_id", async (req, res) => {
  let data = {};
  data.status = req.body.status;
  companyController.updadeOrders(req.body.order, data);
  res.status(200).json({
    message: "Order Status Updated successfully",
    statusCode: 200,
  });
});

companyRoute.get("/wallet", async (req, res) => {
  let wallet = await companyController.getWallet(req, res);
  res.status(200).json({
    message: "Successful",
    statusCode: 200,
    data: wallet,
  });
});

companyRoute.post("/offline", async (req, res) => {
  let file = reader.readFile(req.files.upload);
  const sheets = file.SheetNames;
  let msg;

  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    console.log(temp);
    j = 10000;
    for (let k = 0; k < temp.length; k = k + 200) {
      run(temp, k, j);
      j = j + 10000;
    }
  }
});



/*
  The below code handles payout endpoints
*/ 

companyRoute.post("/payment/otherPayout", async (req, res) => {
  const response = psbPayout.otherBankPayout(req, res);
  return res.status(200).json(response);
})
















module.exports = companyRoute;
