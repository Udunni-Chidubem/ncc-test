const adminRouter = require("express").Router();
const siteController = require("../../controllers/site.controller");
const utils = require("../../helpers/utils");
const {
  adminValidation,
  validate,
  productValidation,
} = require("../../helpers/formValidator");
const adminController = require("../../controllers/admin.controller");
const { now } = require("moment");
const companyController = require("../../controllers/company.controller");
const {
  UserConversationList,
} = require("twilio/lib/rest/conversations/v1/user/userConversation");
const multer = require("multer");
const upload = multer({ dest: "files/" });

adminRouter.get("/dashboard", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let farmerCount = await adminController.getFarmerCount(req, res);
  let companyCount = await adminController.getCompanyCount(req, res);
  let seedProducerCount = await adminController.getSeedProducerCount(req, res);
  let { activeProduct, inactiveProduct } =
    await adminController.getProductStatus(req, res);
  let {
    farmerinactivelist,
    farmeractivelist,
    seedcompanyactivelist,
    seedcompanyinactivelist,
    seedtraderactivelist,
    seedtraderinactivelist,
  } = await adminController.getUserslist(req, res);
  let seedtraderCount = await adminController.getSeedTraderCount(req, res);
  let user_status = await adminController.getUserStatus(req, res);
  let user_role = await adminController.getUserRole(req, res);
  let { farmerMalelist, farmerFemalelist } =
    await adminController.getFarmerGender(req, res);
  let offlineCount = await adminController.getOfflineTransactionCount(req, res);
  let onlineCount = await adminController.getOnlineTransactionCount(req, res);

  res.render("admin/dashboard", {
    layout: "admin-dashboard",
    title: "Dashboard",
    username: user.username,
    isVerified,
    farmerCount,
    companyCount,
    seedtraderCount,
    seedProducerCount,
    farmerinactivelist,
    farmeractivelist,
    seedcompanyactivelist,
    seedcompanyinactivelist,
    seedtraderactivelist,
    seedtraderinactivelist,
    activeProduct,
    inactiveProduct,
    user_status: JSON.stringify(user_status),
    user_role: user_role.Role.role_name,
    farmerMalelist,
    farmerFemalelist,
    offlineCount,
    onlineCount,
    totalSales: onlineCount[0].count + offlineCount[0].count,
  });
});

adminRouter.get("/users/create", async (req, res) => {
  let user = await req.user;
  let roles = await adminController.getNascAdminRoles(req, res);
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/create-user", {
    layout: "admin-dashboard",
    title: "User Management",
    sub_title: "Create User",
    username: user.username,
    prev_link: "/admin/all-users",
    isVerified,
    roles: roles,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.post("/users/create", async (req, res) => {
  let resp = await adminController.createUser(req, res);
  if (!resp.error) {
    req.flash('success_msg', 'User created successfully !!');
    res.redirect("/admin/users");
  } else {
    req.flash('error_msg', 'Error creating a user. Try again !!');
    res.redirect("/admin/users/create");
  }
});

adminRouter.get("/messages", async (req, res) => {
  let user = JSON.parse(JSON.stringify(await req.user));
  let roles = await adminController.getNascAdminRoles(req, res);
  let isVerified = await utils.isVerified(user);
  // let user_role = await adminController.getUserRole(req, res)
  let user_role = user.UserRole;
  let getMessages = await adminController.getMessages(req, res);
  let getNewmessages = await adminController.getNewmessages(req, res);

  res.render("admin/messages", {
    layout: "admin-dashboard",
    title: "View Messages",
    username: user.username,
    isVerified,
    roles: roles,
    user_role: user_role.Role.role_name,
    getMessages,
    getNewmessages,
  });
});

adminRouter.get("/message_test", async (req, res) => {
  let user = await req.user;
  let roles = await adminController.getNascAdminRoles(req, res);
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let getMessages = await adminController.getMessages(req, res);
  let getNewmessages = await adminController.getNewmessages(req, res);
  // let {messages,to_userid} = await adminController.getmessages(req, res)

  res.render("admin/message_test", {
    layout: "admin-dashboard",
    title: "View Messages",
    username: user.username,
    isVerified,
    roles: roles,
    user_role: user_role.Role.role_name,
    getMessages,
    getNewmessages,
  });
});

adminRouter.get("/view_message/:user_id", async (req, res) => {
  let user = await req.user;
  let roles = await adminController.getNascAdminRoles(req, res);
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let { messages, to_userid } = await adminController.getmessages(req, res);
  let updateMessagestatus = await adminController.updateMessagestatus(
    req,
    to_userid
  );
  let getuserrole = await adminController.getuserrole(req, to_userid);
  let role_id = getuserrole.messages.UserRole.Role.role_name;
  let getuserdata = await adminController.getuserdata(role_id, to_userid);

  let user_id = user.id;

  res.render("admin/view-message", {
    layout: "admin-dashboard",
    title: "View Message",
    isVerified,
    user_role: user_role.Role.role_name,
    messages,
    user_id,
    to_userid,
    getuserdata,
    role_id,
  });
});

adminRouter.get("/view_messages/:user_id", async (req, res) => {
  let user = await req.user;
  let roles = await adminController.getNascAdminRoles(req, res);
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let { messages, to_userid } = await adminController.getmessages(req, res);
  //let updateMessagestatus = await adminController.updateMessagestatus(req, to_userid)
  let getuserrole = await adminController.getuserrole(req, to_userid);
  let role_id = getuserrole.messages.UserRole.Role.role_name;
  let getuserdata = await adminController.getuserdata(role_id, to_userid);
  let user_id = user.id;
  res
    .json({
      message: messages,
      role_id: role_id,
      getuserdata: getuserdata,
      to_userid: to_userid,
      user_id: user_id,
    })
    .status(200);
});

adminRouter.post("/message", async (req, res) => {
  let user = await req.user;
  let user_id = user.id;
  let response = await adminController.message(req, user_id);
  res.json({ message: response }).status(200);
});

adminRouter.get("/getmessagescount", async (req, res) => {
  let user = await req.user;
  let getmessagescount = await adminController.getmessagescount(req, res);
  getmessagescount = getmessagescount.length;
  res.json({ message: getmessagescount }).status(200);
});

adminRouter.get("/users", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/all-users", {
    layout: "admin-dashboard",
    title: "User Management",
    sub_title: "All Users",
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/farmers", async (req, res) => {
  let user = await req.user;
  let farmers = await adminController.getFarmers(req, res);
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/farmers", {
    layout: "admin-dashboard",
    title: "User Management",
    sub_title: "All Farmers",
    prev_link: "/admin/users",
    username: user.username,
    isVerified,
    farmers,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/companies", async (req, res) => {
  let user = await req.user;
  let companies = await adminController.getCompanies(req, res);
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/companies", {
    layout: "admin-dashboard",
    title: "User Management",
    sub_title: "All Companies",
    prev_link: "/admin/users",
    username: user.username,
    isVerified,
    companies,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/traders", async (req, res) => {
  let user = await req.user;
  let traders = await adminController.getTraders(req, res);
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/traders", {
    layout: "admin-dashboard",
    title: "User Management",
    sub_title: "All Traders",
    prev_link: "/admin/users",
    username: user.username,
    isVerified,
    traders,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/users/deactivated", async (req, res) => {
  let user = await req.user;
  let farmers = await adminController.getFarmers(req, res);
  let traders = await adminController.getTraders(req, res);
  let companies = await adminController.getDeactivatedCompanies(req, res);
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/deactivated-users", {
    layout: "admin-dashboard",
    title: "User Management",
    sub_title: "Deactivated Users",
    username: user.username,
    isVerified,
    farmers,
    companies,
    traders,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/products/:id", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let product = await adminController.viewProduct(req, res);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/view-product", {
    layout: "admin-dashboard",
    title: "Product Management",
    sub_title: "View Product",
    prev_link: "/admin/products",
    username: user.username,
    isVerified,
    product,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/products", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let products = await adminController.getProducts(req, res);
  let approvedProducts = await products.filter((e) => {
    return e.status == 1;
  });
  let rejectedProducts = await products.filter((e) => {
    return e.status == 0;
  });
  let revokedProducts = await products.filter((e) => {
    return e.status == 2;
  });
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/product-mgt", {
    layout: "admin-dashboard",
    title: "Product Management",
    username: user.username,
    isVerified,
    products,
    approvedProducts,
    rejectedProducts,
    revokedProducts,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/users/:id", async (req, res) => {
  let type = req.query.type;
  // console.log("Account Type:", type);
  const user = await req.user;
  let isVerified = await utils.isVerified(user);
  let farmer = null,
    company = null,
    trader = null,
    products = null,
    balance = null,
    ledger_info = null,
    product = null,
    company_id = null;
  if (type == "farmer") farmer = await adminController.getOneFarmer(req, res);
  if (type == "company") {
    company = await adminController.getOneCompany(req, res);
    products = await adminController.getProductsByUserID(req, res);
    product = await adminController.viewProduct(req, res);
    company_id = await adminController.company_id(req, res);
    ledger_info = await adminController.ledger_info(req, res, company_id.id);
  }
  if (type == "trader") trader = await adminController.getOneTrader(req, res);

  balance = await adminController.getWallet(req, res);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/view-user", {
    layout: "admin-dashboard",
    title: "All Users",
    sub_title: "View User",
    prev_link: "/admin/users",
    username: user.username,
    isVerified,
    farmer,
    company,
    trader,
    products,
    product,
    balance,
    ledger_info,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/products/approval/:id/:status", async (req, res) => {
  let data = { status: req.params.status, updated_at: now() };
  let id = req.params.id;
  adminController.productUpdate(data, id);
  res.redirect("/admin/products");
});

adminRouter.post("/products/approval", async (req, res) => {
  let data = {
    status: req.body.status,
    reason: req.body.rejectionReason,
    updated_at: now(),
  };
  let id = req.body.id;
  adminController.productUpdate(data, id);
  res.redirect("/admin/products");
});

adminRouter.get("/users/activate/:id/:status", async (req, res) => {
  let data = { status: req.params.status, updated_at: now() };
  let id = req.params.id;
  adminController.userUpdate(data, id);
  res.redirect("/admin/users");
});

/*Orders Route Begins*/
adminRouter.get("/orders", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let orders = await adminController.getOrders(res, req);

  let pendingOrders = await orders.filter((e) => {
    return e.status == 0;
  });

  let activeOrders = await orders.filter((e) => {
    return e.status == 1;
  });

  let shippedOrders = await orders.filter((e) => {
    return e.status == 2;
  });

  let hubOrders = await orders.filter((e) => {
    return e.status == 3;
  });

  let fulfilledOrders = await orders.filter((e) => {
    return e.status == 4;
  });
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/orders", {
    layout: "admin-dashboard",
    title: "Orders",
    username: user.username,
    isVerified,
    orders,
    pendingOrders,
    activeOrders,
    shippedOrders,
    fulfilledOrders,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/orders/:id/:transaction_id/:company_id", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  // company_name = req.params.company_name;
  // let company = await utils.getCompanyProfile(user)
  transaction_id = req.params.transaction_id;
  let user_role = await adminController.getUserRole(req, res);

  let { order, farmer, orderStatus } = await adminController.getOrder(
    req.params.transaction_id,
    req.params.id,
    req.params.company_id
  );
  res.render("admin/order-view", {
    layout: "admin-dashboard",
    title: "Order View",
    order,
    farmer,
    orderStatus,
    username: user.username,
    isVerified,
    transaction_id: transaction_id,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get(
  "/payment/:id/:transaction_id/:company_id",
  async (req, res) => {
    let user = await req.user;
    let isVerified = await utils.isVerified(user);
    // company_name = req.params.company_name;
    // let company = await utils.getCompanyProfile(user)
    transaction_id = req.params.transaction_id;
    let user_role = await adminController.getUserRole(req, res);

    let { order, farmer, orderStatus } = await adminController.getOrder(
      req.params.transaction_id,
      req.params.id,
      req.params.company_id
    );
    res.render("admin/payment-view", {
      layout: "admin-dashboard",
      title: "Payment View",
      order,
      farmer,
      orderStatus,
      username: user.username,
      isVerified,
      transaction_id: transaction_id,
      user_role: user_role.Role.role_name,
    });
  }
);

/*Order POST request*/
adminRouter.post(
  "/orders/:id/:transaction_id/:company_id",
  async (req, res) => {
    let user = await req.user;
    let data = {};
    data.status = req.body.status;
    adminController.updadeOrders(req, data);
    let { order, farmer, orderStatus } = await adminController.getOrder(
      req.params.transaction_id,
      req.params.id,
      req.params.company_id
    );

    res.redirect("/admin/orders");
  }
);

adminRouter.get("/user_report", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let { users, states } = await adminController.getAllUsers(req, res);

  res.render("admin/user_report", {
    layout: "admin-dashboard",
    title: "User-Report",
    isVerified,
    users,
    states,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/transactions", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let { states } = await adminController.getAllUsers(req, res);
  let transaction = await adminController.getAllTransaction(req, res);

  res.render("admin/transactions", {
    layout: "admin-dashboard",
    title: "Transaction-Report",
    username: user.username,
    isVerified,
    states,
    transaction,
    user_role: user_role.Role.role_name,
  });
});
adminRouter.get("/offline-transactions", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let { states } = await adminController.getAllUsers(req, res);
  let salesSheet = await adminController.getAllSaleSheets(req, res);

  res.render("admin/offline-transactions", {
    layout: "admin-dashboard",
    title: "Offline Transaction-Report",
    username: user.username,
    isVerified,
    states,
    salesSheet,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/analytics", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/analytics", {
    layout: "admin-dashboard",
    title: "Analytics",
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/knowledge-base", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let knowledgeBases = await siteController.allKnowledgeBase(req, res);

  res.render("admin/knowledge-base", {
    layout: "admin-dashboard",
    title: "Knowledge Base",
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
    knowledgeBases: knowledgeBases,
  });
});

adminRouter.get("/transaction-resolution", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);

  res.render("admin/transaction-resolution", {
    layout: "admin-dashboard",
    title: "Transaction Resolution",
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.post("/knowledge-base", async (req, res) => {
  adminController.createKnowledgeBase(req, res);
  res.redirect("back");
});

adminRouter.get("/seed-producers", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);

  let seedProducer = await adminController.listSeedProducers(req, res);

  res.render("admin/seed-producer-list", {
    layout: "admin-dashboard",
    seedProducer,
    title: "Seed Producers",
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
  });
});

adminRouter.get("/seed-producer/:id", async (req, res) => {
  let user = await req.user;
  let isVerified = await utils.isVerified(user);
  let user_role = await adminController.getUserRole(req, res);
  let seedProducer = await adminController.viewSeedProducer(req, res);
  let seedsProduced = await adminController.getSeedProduced(req, res);
  let states = await siteController.getStates();

  res.render("admin/view-seed-producer", {
    layout: "admin-dashboard",
    title: "Seed Producers",
    sub_title: "Seed Producer",
    prev_link: "/admin/seed-producer-list",
    seedProducer,
    states: states,
    seedsProduced,
    username: user.username,
    isVerified,
    user_role: user_role.Role.role_name,
  });
});

/**
 * Binary SOL
 */

adminRouter.patch("/seed-producer/update", async (req, res) => {
  const response = await adminController.updateSeedProducer(req, res);
  res.render("admin/view-seed-producer", {
    message: response,
  });
});

adminRouter.get("/fetch-single-seed/:seedId/:companyId", async (req, res) => {
  const seedId = req.params.seedId;
  const seedCompanyId = req.params.companyId;
  let seedsProduced = await adminController.getSeedProducerSeedById(
    seedId,
    seedCompanyId
  );
  return res.status(200).json({ data: seedsProduced });
});

adminRouter.patch("/seed-update", async (req, res) => {
  let response = await adminController.updateSeedProducerSeed(req, res);
  return response;
});

adminRouter.patch(
  "/update-seed-producer-staus/:user_id/:id",
  async (req, res) => {
    let response = await companyController.updateSeedProducerStatus(req, res);
    return response;
  }
);

adminRouter.get(
  "/get-seed-companies/seed-producer-upload/:keyword",
  async (req, res) => {
    let user = await req.user;
    const keyword = req.params.keyword;
    let isVerified = await utils.isVerified(user);
    let seedCompanyList = await adminController.listSeedCompanies(keyword);
    return res.status(200).json(seedCompanyList);
  }
);

adminRouter.post("/upload-seed-producer-list", async (req, res) => {
  try {
    let user = req.user;
    let file = req.files.file;
    let seed_company_id = req.body;

    if (!file || !seed_company_id) {
      return res
        .status(400)
        .json({ success: false, msg: "File or Seed Company ID missing" });
    }

    // await utils.isVerified(user);
    const resp = await adminController.uploadSeedProducerList(
      file,
      seed_company_id
    );
    return res.status(200).json(resp);
  } catch (e) {
    console.log(e.message);
  }
});

/**
 * Binary EOL
 */

module.exports = adminRouter;
