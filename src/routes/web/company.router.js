const companyRouter = require("express").Router();
const siteController = require("../../controllers/site.controller");
const utils = require("../../helpers/utils");
const {
  companyValidation,
  validate,
  productValidation,
  settingsValidation,
} = require("../../helpers/formValidator");
const companyController = require("../../controllers/company.controller");
const { now } = require("moment");
const db = require("../../models");
const escrowController = require("../../controllers/escrow.controller");
const { States } = db;

companyRouter.get("/dashboard", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let balance = await companyController.getWallet(req, res);
  let productCount = await companyController.getProductCount(req, res);
  let totalsales = await companyController.getTotalSales(company.id);
  let isVerified = await utils.isVerified(user);

  let fulfilled = null;
  let unfulfilled = null;
  totalsales.forEach((totalSale) => {
    if (totalSale.status <= 3) {
      unfulfilled = totalSale.count;
    } else if (totalSale.status == 4) {
      fulfilled = totalSale.count;
    }
  });

  let total = fulfilled + unfulfilled;

  res.render("seed_company/dashboard", {
    layout: "company-dashboard",
    title: "Dashboard",
    company: company,
    page_title: "",
    isVerified,
    balance,
    productCount,
    fulfilled,
    unfulfilled,
    total,
  });
});

companyRouter.get("/update-profile", async (req, res) => {
  let states = await siteController.getStates();
  let user = await req.user;
  let isVerified = await utils.isVerified(user, "company");
  let company = await utils.getCompanyProfile(user);
  res.render("seed_company/update-profile", {
    layout: "company-dashboard",
    title: "Profile Update",
    states: states,
    company: company,
    isVerified,
  });
});
companyRouter.get("/getchartamount", async (req, res) => {
  let states = await siteController.getStates();
  let user = await req.user;
  let isVerified = await utils.isVerified(user, "company");
  let company = await utils.getCompanyProfile(user);
  let getchartamount = await companyController.getchartamount(req, company.id);
  res.json({ message: getchartamount, statusCode: 200 }).status(200);
});

/*Update Profile*/
companyRouter.post(
  "/update-profile",
  companyValidation(),
  validate,
  async (req, res) => {
    let r = await companyController.updateProfile(req, res);
console.log(r)
    if (r.company) {
      res
        .json({
          message: "Your profile has been “updated” successfully ccc.",
          statusCode: 200,
        })
        .status(200);
    } else {
      res.json({ message: r.errors, error: true, statusCode: 400 }).status(400);
    }
  }
);

/*Product Routes Begins*/

/*Create Product GET request*/
companyRouter.get("/products/create", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  res.render("seed_company/create-products", {
    layout: "company-dashboard",
    title: "Create Product",
    company: company,
  });
});
// change password
companyRouter.post(
  "/settings",
  settingsValidation(),
  validate,
  async (req, res) => {
    let response = await companyController.updatePassword(req, res);
    if (response.message_) {
      return res
        .json({ message: response.message_, statusCode: 200 })
        .status(200);
    }
  }
);

// settings page
companyRouter.get("/settings", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let isVerified = await utils.isVerified(user, "company");

  res.render("seed_company/settings", {
    layout: "company-dashboard",
    title: "Settings",
    isVerified,
    company,
  });
});
companyRouter.get("/settings/deactivate/:id/:status", async (req, res) => {
  let data = { status: req.params.status, updated_at: now() };
  let id = req.params.id;
  companyController.userUpdate(data, id);
  req.logOut();
  res.redirect("/login");
});

/*Create Product POST request*/
companyRouter.post(
  "/products/create",
  productValidation(),
  validate,
  async (req, res) => {
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
  }
);

/*Update Product Logic*/
companyRouter.post("/products/update/:id", async (req, res) => {
  companyController.updateProduct(req, res);
  res
    .json({
      statusCode: 200,
      message: "Product updated successfully",
      body: "Product updated succeessfully",
    })
    .status(200)
    .send();
});

/*Product List*/
companyRouter.get("/products", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let product = await companyController.listProducts(req, res);
  let paginate;
  if (product) {
    paginate = { page: parseInt(req.query.page) || 0, pageCount: product.totalPages,next:product.nextPage, previous:product.previousPage};
    console.log(paginate)
  }
  res.render("seed_company/product-list", {
    layout: "company-dashboard",
    product,
    pagination: paginate,
    title: "Products",
    company: company,
  });
});

/*Update Product Page*/
companyRouter.get("/products/update/:id", async (req, res) => {
  let product = await companyController.viewProduct(req, res);

  res.render("seed_company/update-product", {
    layout: "company-dashboard",
    product,
    title: "Products",
    sub_title: "Update Product",
  });
});

/*View Product*/
companyRouter.get("/products/:id", async (req, res) => {
  let product = await companyController.viewProduct(req, res);

  const data = JSON.stringify(JSON.parse(product.item));

  res.render("seed_company/view-product", {
    layout: "company-dashboard",
    data,
    product,
    title: "Products",
    sub_title: "View Product",
    prev_link: "/seed-company/products",
  });
});

//sales sheet begins

companyRouter.get("/sales-sheet", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let isVerified = await utils.isVerified(user);

  let states = await States.findAll({
    attributes: ["id", "name"],
    raw: true,
  });

  res.render("seed_company/sales-sheet", {
    layout: "company-dashboard",
    title: "Sales Sheet",
    isVerified,
    company,
    states: states,
  });
});
companyRouter.post("/sales-sheet", async (req, res) => {
  let user = await req.user;
  let user_id = user.id;
  let company = await utils.getCompanyProfile(user);
  let isVerified = await utils.isVerified(user);
  let sales_sheet_info = await companyController.sales_sheet_info(
    req,
    res,
    user_id
  );

  let states = await States.findAll({
    attributes: ["id", "name"],
    raw: true,
  });

  res.render("seed_company/sales-sheet", {
    layout: "company-dashboard",
    title: "Sales Sheet",
    isVerified,
    company,
    states: states,
  });
});

// sales sheet ends

//view sale sheet starts

companyRouter.get("/view-sheet", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let isVerified = await utils.isVerified(user);
  let saleSheets = await companyController.saleSheets(user.id);

  res.render("seed_company/view-sheet", {
    layout: "company-dashboard",
    title: "View Sheet",
    isVerified,
    company,
    saleSheets,
    // states: states
  });
});

//view sale sheet ends

/*Product Routes Ends*/

/*Order Routes Begins*/

/*Order List*/
companyRouter.get("/orders", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let orders = null;
  product = null;
  if (req.query.product) {
    product = req.query.product;
    orders = await companyController.getProductOrders(req, product);
  } else {
    orders = await companyController.getOrders(req, res);
  }
  res.render("seed_company/order-list", {
    layout: "company-dashboard",
    title: "Order List",
    orders,
    company: company,
  });
});

/*Order GET request*/
companyRouter.get("/orders/:transaction_id/", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user, "company");
  let company = await utils.getCompanyProfile(user);
  let { order, farmer, orderStatus } = await companyController.getOrder(
    req.params.transaction_id,
    user.id,
    company.id
  );
  let shipping_address = order[0].TransactionLog.pickup_point;
  res.render("seed_company/view-order", {
    layout: "company-dashboard",
    title: "Orders",
    sub_title: "View Order",
    order,
    farmer,
    orderStatus,
    shipping_address,
    prev_link: "/seed-company/orders",
    transaction_id: req.params.transaction_id,
  });
});

/*Order POST request*/
companyRouter.post("/orders/:transaction_id/", async (req, res) => {
  let user = await req.user;
  let data = {};
  data.status = req.body.status;
  companyController.updadeOrders(req.body.order, data);
  let isVerified = await utils.isVerified(user, "company");
  let company = await utils.getCompanyProfile(user);
  let { order, farmer, orderStatus } = await companyController.getOrder(
    req.params.transaction_id,
    user.id,
    company.id
  );

  res.redirect("/seed-company/orders");
});

/*Order Count*/
companyRouter.get("/orders/count/company", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let count = await companyController.getOrderCount(company.id);
  res.json({ message: count, statusCode: 200 }).status(200);
});

/*Order Routes End*/

/* Wallet */
companyRouter.get("/wallet", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user, "company");
  let wallet = await companyController.getWallet(req, res);
  res.render("seed_company/wallet", {
    layout: "company-dashboard",
    title: "Wallet",
    wallet,
  });
});

// companyRouter.get('/knowledge-base', (req,res) => {
//     res.render('knowledge_base', {
//         layout: '',
//         title : 'Knowledge Base - Index'
//     });
// })

//seed producer begins

companyRouter.get("/seed-producers/create", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let isVerified = await utils.isVerified(user);

  let states = await States.findAll({
    attributes: ["id", "name"],
    raw: true,
  });

  res.render("seed_company/create-seed-producer", {
    layout: "company-dashboard",
    title: "Seed Producer",
    isVerified,
    company,
    states: states,
  });
});

companyRouter.post("/seed-producers/create", async (req, res) => {
  let phone = req.body.phone;
  let check = await companyController.findSeedProducer(phone);
  // console.log(check);
  if (check == null) {
    let seeds = [];
    if (Array.isArray(req.body.nameOfSeed)) {
      req.body.nameOfSeed.forEach((e, index) => {
        seeds.push({
          name_of_seed: e,
          variety_of_seed: req.body.varietyOfSeed[index],
          volume_of_seed: req.body.volumeOfSeed[index],
          unit: req.body.unit[index],
          year_produced: req.body.yearProduced[index],
          amount_of_seed: req.body.amount_of_seed[index],
          amount_of_seed_remitted: req.body.amount_of_seed_remitted[index],
          amount_of_seed_to_be_remitted: req.body.amount_of_seed_to_be_remitted[index],
          unit_for_total_amount_of_seed_given: req.body.unit_for_total_amount_of_seed_given[index],
          unit_for_total_amount_of_seed_remitted: req.body.unit_for_total_amount_of_seed_remitted[index],
          unit_for_total_amount_of_seed_to_be_remitted: req.body.unit_for_total_amount_of_seed_to_be_remitted[index],
        });
      });
    } else {
      seeds.push({
        name_of_seed: req.body.nameOfSeed,
        variety_of_seed: req.body.varietyOfSeed,
        volume_of_seed: req.body.volumeOfSeed,
        unit: req.body.unit,
        year_produced: req.body.yearProduced,
        amount_of_seed: req.body.amount_of_seed,
        amount_of_seed_remitted: req.body.amount_of_seed_remitted,
        amount_of_seed_to_be_remitted: req.body.amount_of_seed_to_be_remitted,
        unit_for_total_amount_of_seed_given: req.body.unit_for_total_amount_of_seed_given,
        unit_for_total_amount_of_seed_remitted: req.body.unit_for_total_amount_of_seed_remitted,
        unit_for_total_amount_of_seed_to_be_remitted: req.body.unit_for_total_amount_of_seed_to_be_remitted,
      });
    }
    req.body.seeds = seeds;
    let r = await companyController.createSeedProducer(req, res);
    if (r.id) {
      res
        .json({
          statusCode: 200,
          message: "Seed Producer has been created successfully",
          body: "Seed Producer has been created successfully",
        })
        .status(200)
        .send();
    } else {
      res
        .json({ statusCode: 500, error: r, message: "something went wrong" })
        .status(500)
        .send();
    }
  } else {
    res
      .json({
        statusCode: 400,
        message: "phone number already in use",
        error: true,
      })
      .status(400)
      .send();
  }
});

companyRouter.post("/seed-producer-seed/create", async (req, res) => {
  // console.log("entry:", req.body);

  let seeds = {
    producer_id: req.body.prod_id,
    name_of_seed: req.body.seed,
    variety_of_seed: req.body.variety,
    volume_of_seed: req.body.volumn,
    unit: req.body.unit,
    year_produced: req.body.yearProduced,
    amount_of_seed: req.body.amount_of_seed,
    amount_of_seed_remitted: req.body.amount_of_seed_remitted,
    amount_of_seed_to_be_remitted: req.body.amount_of_seed_to_be_remitted,
    unit_for_total_amount_of_seed_given: req.body.unit_for_total_amount_of_seed_given,
    unit_for_total_amount_of_seed_remitted: req.body.unit_for_total_amount_of_seed_remitted,
    unit_for_total_amount_of_seed_to_be_remitted: req.body.unit_for_total_amount_of_seed_to_be_remitted,
  };

  let r = await companyController.createSeedProducerSeed(seeds);
  if (r.id) {
    res
      .json({
        statusCode: 200,
        message: "Seed has been created successfully",
        body: "Seed has been created successfully",
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

companyRouter.get("/seed-producers", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let user_id = user.id
  console.log("sd ",user_id);
  let seedProducer = await companyController.listSeedProducers(user_id, res);
  
  res.render("seed_company/seed-producer-list", {
    layout: "company-dashboard",
    seedProducer,
    title: "Seed Producers",
    company: company,
  });
});

companyRouter.get("/seed-producer/:id", async (req, res) => {
  let seedProducer = await companyController.viewSeedProducer(req, res);
  let seedsProduced = await companyController.getSeedProduced(req, res);
  let states = await siteController.getStates();
  let prod_id = await req.params.id;
  
  res.render("seed_company/view-seed-producer", {
    layout: "company-dashboard",
    title: "Seed Producers",
    sub_title: "Seed Producer",
    prev_link: "/seed-company/seed-producers",
    seedProducer,
    states: states,
    seedsProduced,
    prod_id,
  });
});

/*
  Binary SOL
*/

companyRouter.get(
  "/seed-producer/deactivated-seed-producer",
  async (req, res) => {
    let user = await req.user;
    let company = await utils.getCompanyProfile(user);
    let seedProducer = await companyController.listSeedProducers(req, res);

    res.render("seed_company/deactivated-seed-producer", {
      layout: "company-dashboard",
      seedProducer,
      title: "Seed Producers",
      company: company,
    });
  }
);

companyRouter.patch("/seed-producer/:id", async (req, res) => {
  const id = req.params.id;
  let response = await companyController.updateSeedProducer(req, res);
  return res.render(`seed-company/seed-producer/${id}`, {
    message: response,
  });
});

companyRouter.post("/found-withdraw", async (req, res) => {
  let response = await escrowController.processFoundWithdrawer(req, res);
  // console.log("Response: ", response);
  return res.status(200).json(response);
});

companyRouter.get("/withdraw-log", async (req, res) => {
  let walletLog = await escrowController.getWithdrawLog(req, res);
  // console.log("Response: ", response);
  // return res.status(200).json(response);
  res.render("seed_company/wallet", {
    layout: "company-dashboard",
    title: "Wallet",
    walletLog,
  });
});

companyRouter.get("/fetch-single-seed/:seedId/:companyId", async (req, res) => {
  const seedId = req.params.seedId;
  const seedCompanyId = req.params.companyId;

  let seedsProduced = await companyController.getSeedProducerSeedById(
    seedId,
    seedCompanyId
  );
  return res.status(200).json({ data: seedsProduced });
});

companyRouter.patch("/seed-update", async (req, res) => {
  let response = await companyController.updateSeedProducerSeed(req, res);
  return response;
});

companyRouter.patch(
  "/update-seed-producer-staus/:user_id/:id",
  async (req, res) => {
    let response = await companyController.updateSeedProducerStatus(req, res);
    return response;
  }
);

companyRouter.get("/deactivated-seed-producers", async (req, res) => {
  let user = await req.user;
  let company = await utils.getCompanyProfile(user);
  let seedProducer = await companyController.listSeedProducers(req, res);

  res.render("seed_company/deactivated-seed-producers", {
    layout: "company-dashboard",
    seedProducer,
    title: "Deactivated Seed Producer",
    company: company,
  });
});

/*
  Binary EOL
*/

module.exports = companyRouter;
