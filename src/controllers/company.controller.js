require("dotenv").config();
const { Op, QueryTypes } = require("sequelize");
const db = require("../models");
const {
  User,
  Orders,
  SeedCompany,
  DeliveryInformation,
  LGAs,
  States,
  Product,
  Wallet,
  TransactionLog,
  TransactionCarts,
  Cart,
  Farmer,
  SeedProducerSeed,
  Salesheets,
  SeedProducer,
} = db;
const utils = require("../helpers/utils");
const { getPagingData, getPagination } = require("../helpers/pagination");
const bcrypt = require("bcrypt");
const { isValidPhoneNumber } = require("../helpers/form.helper");

module.exports = {
  updateProfile: async (req, res) => {
    const transaction = await db.rest.transaction();
    const user = await req.user;

    const {
      name_of_company,
      phone_no,
      tin,
      address,
      licensed_no,
      state_id,
      lg_id,
      certification_number,
      email,
      bank_account_no,
      bank_account_name,
      bank_code,
    } = req.body;

    try {
      const data = {
        name_of_company,
        phone_no,
        tin,
        address,
        licensed_no,
        state_id,
        lg_id,
        certification_number,
        email,
        bank_account_name,
        bank_account_no,
        bank_code,
      };
      await User.update({ status: true }, { where: { id: user.id } });

      const company = await SeedCompany.update(
        data,
        {
          where: { user_id: user.id },
        },
        { transaction: transaction }
      );
      transaction.commit();
      return { company };
    } catch (e) {
      transaction.rollback();
      return e;
    }
  },
  createProduct: async (req, res, filename) => {
    const transaction = await db.rest.transaction();
    let min = [],
      qty = [],
      size = [],
      price = [];
    if (!Array.isArray(req.body.min_order)) {
      min.push(req.body.min_order);
      size.push(req.body.pkg_size);
      qty.push(req.body.quantity);
      price.push(req.body.price);
    } else {
      min = req.body.min_order;
      size = req.body.pkg_size;
      qty = req.body.quantity;
      price = req.body.price;
    }
    let item = {
      min: min,
      pkg: size,
      price: price,
      quantity: qty,
    };

    item = await JSON.stringify(item, null, 2);

    const user = await req.user;
    try {
      let p = await Product.create(
        {
          product_name: req.body.productName,
          description: req.body.productDescription,
          variant: req.body.productVariant,
          item: item,
          user_id: user.id,
          file_name: filename,
          local_name: req.body.productLocalName,
          status: 0,
        },
        { transaction: transaction }
      );
      transaction.commit();
      return p;
    } catch (e) {
      transaction.rollback();
      return e;
    }
  },
  listProducts: async (req, res) => {
    const user = await req.user;
    let response = null;

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const product = await Product.findAndCountAll({
      where: { user_id: user.id },
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "product_name",
        "variant",
        "description",
        "item",
        "file_name",
        "status",
        "local_name",
      ],
      raw: true,
      limit,
      offset,
    });

    if (product) {
      response = getPagingData(product, page, limit);
    }
    return response;
  },
  updateProduct: async (req, res) => {
    const transaction = await db.rest.transaction();
    try {
      let min = [],
        qty = [],
        size = [],
        price = [];
      if (req.files) {
        let p = await Product.findOne({
          attributes: ["file_name"],
          where: { id: req.params.id },
        });
        let upload = req.files.upload;
        filename = p.file_name;
        upload.mv("./public/product_images/" + filename);
      }
      if (!Array.isArray(req.body.min_order)) {
        min.push(req.body.min_order);
        size.push(req.body.pkg_size);
        qty.push(req.body.quantity);
        price.push(req.body.price);
      } else {
        min = req.body.min_order;
        size = req.body.pkg_size;
        qty = req.body.quantity;
        price = req.body.price;
      }
      let item = {
        min: min,
        pkg: size,
        price: price,
        quantity: qty,
      };
      item = await JSON.stringify(item, null, 2);
      Product.update(
        {
          product_name: req.body.productName,
          description: req.body.productDescription,
          variant: req.body.productVariant,
          item: item,
          local_name: req.body.productLocalName,
        },
        {
          where: { id: req.params.id },
        },
        {
          transaction: transaction,
        }
      );
      transaction.commit();
    } catch (e) {
      console.log(e);
      transaction.rollback;
    }
  },
  viewProduct: async (req, res) => {
    const user = await req.user;
    let response = null;

    const singleProduct = await Product.findOne({
      where: { user_id: user.id, id: req.params.id },
      attributes: [
        "id",
        "product_name",
        "variant",
        "description",
        "item",
        "file_name",
        "local_name",
      ],
      raw: true,
    });

    if (singleProduct) {
      response = singleProduct;
    }

    return response;
  },
  creditWallet: async (carts) => {
    let transaction = await db.rest.transaction();
    try {
      // let transaction = db.rest.transaction()
      carts.forEach(async (cart) => {
        let final_cost = cart.total_amount * 0.89;
        await Wallet.increment(
          {
            amount: final_cost,
          },
          {
            where: { user_id: cart.Product.user_id },
          },
          { transaction: transaction }
        );
      });
      transaction.commit();
    } catch (e) {
      transaction.rollback();
      console.log(e);
    }
  },
  getWallet: async (req, res) => {
    const user = await req.user;
    let balance;
    const singleBalance = await Wallet.findOne({
      where: { user_id: user.id },
      attributes: ["amount"],
      raw: true,
    });

    balance = singleBalance;
    return balance;
  },
  getProductCount: async (req, res) => {
    const user = await req.user;
    let productCount;
    const countProducts = await Product.count({
      where: { user_id: user.id },
    });

    productCount = countProducts;
    return productCount;
  },
  getOrders: async (req, res) => {
    const user = await req.user;
    let sql =
      "SELECT distinct tl.id, SUM(c.total_amount) as amount, tl.transaction_id, tl.created_at," +
      "tl.updated_at, tl.transaction_ref,f.firstname, f.lastname, c.status as order_status, o.status, " +
      "tl.status as payment_status from cart c join transaction_carts tc on c.id = tc.cart_id join transaction_log tl " +
      "on tl.id=tc.transaction_log_id join orders o on tl.id = o.transaction_log_id join product p on p.id = c.product_id join farmer f on f.user_id=c.user_id " +
      "where p.user_id = " +
      user.id +
      " and (tl.transaction_id is not null and transaction_id <> '') GROUP by p.user_id, tl.id order by tl.created_at desc";
    let order = await db.rest.query(sql, { type: QueryTypes.SELECT });

    let orderStatus = order.orders_status;
    return order;
  },
  getTotalSales: async (company_id) => {
    let sql =
      "SELECT COUNT(status) as count, status FROM `orders` WHERE company_id=" +
      company_id +
      " and status is not null GROUP BY status";

    let totalsales = await db.rest.query(sql, { type: QueryTypes.SELECT });
    return totalsales;
  },
  getProductOrders: async (req, product) => {
    const user = await req.user;
    let sql =
      "SELECT distinct tl.id, SUM(c.total_amount) as amount, tl.transaction_id, tl.created_at," +
      "tl.updated_at, tl.transaction_ref,f.firstname, f.lastname, c.status as order_status, " +
      "tl.status as payment_status from cart c join transaction_carts tc on c.id = tc.cart_id join transaction_log tl " +
      "on tl.id=tc.transaction_log_id join product p on p.id = c.product_id join farmer f on f.user_id=c.user_id " +
      "where p.user_id = " +
      user.id +
      " and c.product_id =" +
      product +
      " GROUP by p.user_id, tl.id order by tl.created_at desc";
    let order = await db.rest.query(sql, { type: QueryTypes.SELECT });
    return order;
  },
  getchartamount: async (req, id) => {
    let sql =
      "SELECT t.amount as amount, o.updated_at as updated_at FROM orders as o join transaction_log as t WHERE o.transaction_log_id = t.id  and o.status = 4 and o.company_id = " +
      id;
    let chartamount = await db.rest.query(sql, { type: QueryTypes.SELECT });
    chartamount = JSON.parse(JSON.stringify(chartamount));
    return chartamount;
  },
  getOrder: async (transaction_id, user_id, company_id) => {
    // const user = await req.user
    let farmer = null,
      orderStatus = null;
    let order = await TransactionCarts.findAll({
      include: [
        {
          model: TransactionLog,
          where: { transaction_id: transaction_id },
        },
        {
          model: Cart,
          include: [
            {
              model: Product,
              where: { user_id: user_id },
            },
          ],
        },
      ],
    });

    order = JSON.parse(JSON.stringify(order));
    if (order.length) {
      farmer = await Farmer.findOne({
        where: { id: order[0].TransactionLog.farmer_id },
        include: [
          {
            model: User,
            include: [
              {
                model: DeliveryInformation,
                attributes: ["address"],
                include: [{ model: States }, { model: LGAs }],
              },
            ],
          },
        ],
      });

      orderStatus = await Orders.findOne({
        where: {
          [Op.and]: [
            {
              company_id: {
                [Op.eq]: company_id,
              },
            },
            {
              transaction_log_id: {
                [Op.eq]: order[0].transaction_log_id,
              },
            },
          ],
        },
      });
    }

    farmer = JSON.parse(JSON.stringify(farmer));
    orderStatus = JSON.parse(JSON.stringify(orderStatus));
    return { order, farmer, orderStatus };
  },
  getOrderCount: async (company_id) => {
    let orderCount = await Orders.count(
      {
        where: {
          [Op.and]: [
            {
              company_id: {
                [Op.eq]: company_id,
              },
            },
            {
              status: {
                [Op.eq]: null,
              },
            },
          ],
        },
      },
      { raw: true }
    );
    return orderCount;
  },
  updadeOrders: async (order_id, data) => {
    Orders.update(data, { where: { id: order_id } });
  },

  updatePassword: async (req, res) => {
    let user = await req.user;
    const isVerified = await utils.isVerified(user);
    let newpassword = await bcrypt.hash(req.body.newpassword, 10);
    let username = req.body.userphoneno;
    let message_ = "Updated Successfully";
    try {
      let status = await User.update(
        { password: newpassword },
        { where: { username: username } }
      );
      return { status, isVerified, message_ };
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  settings: async (req, res) => {
    const user = await req.user;
    const company = await utils.getCompanyProfile(user);
    const isVerified = await utils.isVerified(user);

    res.render("seed_company/settings", {
      layout: "company-dashboard",
      title: "Settings",
      fullname: company.name_of_company,
      companyData: company,
      isVerified,
      company,
    });
  },
  userUpdate: async (data, id) => {
    User.update(data, {
      where: { id: id },
    });
  },

  sales_sheet_info: async (req, res, user_id) => {
    let transaction = await db.rest.transaction();
    let qty = [],
      p_cost = [],
      size = [],
      p_name = [],
      p_variant = [];
    try {
      if (!Array.isArray(req.body.product_cost)) {
        p_cost.push(req.body.product_cost);
        size.push(req.body.size);
        qty.push(req.body.quantity);
        p_variant.push(req.body.product_variant);
        p_name.push(req.body.product_name);
      } else {
        p_cost = req.body.product_cost;
        size = req.body.size;
        qty = req.body.quantity;
        p_variant = req.body.product_variant;
        p_name = req.body.product_name;
      }
      await Salesheets.create(
        {
          community: req.body.community,
          lg_id: req.body.lg_id,
          state_id: req.body.state_id,
          sale_date: req.body.sale_date,
          customer_name: req.body.customer_name,
          customer_number: req.body.customer_number,
          product_name: p_name,
          product_variant: p_variant,
          size: size,
          product_cost: p_cost,
          quantity: qty,
          // date_sold: req.body.date_sold,
          user_id: user_id,
        },
        { transaction: transaction }
      );
      await transaction.commit();
    } catch (e) {
      console.log(e);
      transaction.rollback();
      return e;
    }
  },

  saleSheets: async (user_id) => {
    let printSheet = await Salesheets.findAll({
      include: [
        {
          model: States,
          attributes: ["name"],
        },
        {
          model: LGAs,
          attributes: ["name"],
        },
      ],
      where: {
        user_id: user_id,
      },
    });
    return JSON.parse(JSON.stringify(printSheet));
  },

  createSeedProducer: async (req, res) => {
    const transaction = await db.rest.transaction();
    const user = await req.user;
    try {
      let seedProducer = await SeedProducer.create(
        {
          full_name: req.body.fullName,
          phone_no: req.body.phone,
          certified: req.body.certified,
          // name_of_seed: req.body.nameOfSeed,
          // variety_of_seed: req.body.varietyOfSeed,
          // volume_of_seed: req.body.volumeOfSeed,
          gender: req.body.gender,
          age_range: req.body.age_range,
          living_status: req.body.living_status,
          amount_of_seed: req.body.amount_of_seed,
          amount_of_seed_remmitted: req.body.amount_of_seed_remitted,
          amount_of_seed_to_be_remmitted:
            req.body.amount_of_seed_to_be_remitted,
          user_id: user.id,
          state_id: req.body.state_id,
          lg_id: req.body.lg_id,
          status: 1,
        },
        { transaction: transaction }
      );

      await Promise.all(
        req.body.seeds.map((e) => {
          return SeedProducerSeed.create(
            { ...e, producer_id: seedProducer.id },
            { transaction: transaction }
          );
        })
      );
      // await SeedProducerSeed.bulkCreate(req.body.seeds);
      transaction.commit();
      return seedProducer;
    } catch (e) {
      transaction.rollback();
      console.log(e);
      return e;
    }
  },

  listSeedProducers: async (req, res) => {
    const user = await req.user;
    // let response = null;

    // const { page, size } = req.query;
    // const { limit, offset } = getPagination(page, size);

    const seedProducer = await SeedProducer.findAll({
      where: { user_id: user.id },
      order: [["id", "DESC"]],
      include: [
        {
          model: States,
          attributes: ["name"],
        },
        {
          model: LGAs,
          attributes: ["name"],
        },
        {
          model: SeedProducerSeed,
        },
      ],
      // raw: true,
      order: [["created_at", "DESC"]],
    });

    response = JSON.parse(JSON.stringify(seedProducer));
    return response;
  },
  viewSeedProducer: async (req, res) => {
    const user = await req.user;
    let response = null;

    const seedProducer = await SeedProducer.findOne({
      where: { user_id: user.id, id: req.params.id },
      raw: true,
    });

    if (seedProducer) {
      response = seedProducer;
    }

    return response;
  },

  getSeedProduced: async (req, res) => {
    const user = await req.user;
    let response = null;

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const seeds = await SeedProducerSeed.findAndCountAll({
      where: { producer_id: req.params.id },
      order: [["id", "DESC"]],
      // raw: true,
      limit,
      offset,
    });

    if (seeds) {
      response = getPagingData(seeds, page, limit);
    }
    response = JSON.parse(JSON.stringify(seeds));
    return response;
  },

  createSeedProducerSeed: async (data) => {
    try {
      console.log("seeds", data);
      let seed = await SeedProducerSeed.create({
        producer_id: data.producer_id,
        name_of_seed: data.name_of_seed,
        variety_of_seed: data.variety_of_seed,
        volume_of_seed: data.volume_of_seed,
        unit: data.unit,
      });
      return JSON.parse(JSON.stringify(seed));
    } catch (e) {
      console.log(e);
    }
  },

  /* BINARY SOL */

  getSeedProducerSeedById: async (seedId, seedCompanyId) => {
    try {
      const response = await SeedProducerSeed.findOne({
        where: { id: seedId, producer_id: seedCompanyId },
      });
      return response;
    } catch (e) {
      console.error(e.message);
    }
  },

  findSeedProducer: async (phone) => {
    const seedProducer = await SeedProducer.findOne({
      where: { phone_no: phone },
    });
    const res = JSON.parse(JSON.stringify(seedProducer));
    if (res == null) {
      return null;
    }
    return false;
  },

  updateSeedProducer: async (req, res) => {
    const data = req.body;
    try {
      const isValid = isValidPhoneNumber(data.phone_no);
      if (!isValid) {
        return res
          .status(200)
          .json({ success: false, msg: `Invalid phone number`, status: 200 });
      }
      const response = await SeedProducer.update(
        {
          full_name: data.full_name,
          phone_no: data.phone_no,
          certified: data.certified,
          state_id: data.sate_id,
          lg_id: data.lg_id,
          gender: data.gender,
          age_range: data.age_range,
          living_status: data.living_status,
        },
        {
          where: { id: data.id },
          fields: [
            "full_name",
            "phone_no",
            "certified",
            "state_id",
            "lg_id",
            "gender",
            "age_range",
            "living_status",
          ],
        }
      );
      if (response[0] < 1) {
        return res.status(200).json({
          success: false,
          msg: `No changes was made to ${data.full_name}'s data`,
          status: 200,
        });
      }
      return res.status(200).json({
        success: true,
        msg: `${data.full_name}'s data was updated successfully`,
        status: 200,
      });
    } catch (err) {
      console.error(err.message);
    }
  },

  updateSeedProducerSeed: async (req, res) => {
    try {
      const data = req.body;
      const response = await SeedProducerSeed.update(
        {
          name_of_seed: data.name_of_seed,
          variety_of_seed: data.variety_of_seed,
          volume_of_seed: data.volume_of_seed,
          year_produced: data.year_produced,
          unit: data.unit,
          amount_of_seed: data.amount_of_seed,
          amount_of_seed_remitted: data.amount_of_seed_remitted,
          amount_of_seed_to_be_remitted: data.amount_of_seed_to_be_remitted,
        },
        {
          where: { id: data.id, producer_id: data.producer_id },
          fields: [
            "name_of_seed",
            "variety_of_seed",
            "volume_of_seed",
            "year_produced",
            "unit",
            "amount_of_seed",
            "amount_of_seed_remitted",
            "amount_of_seed_to_be_remitted",
          ],
        }
      );
      // console.log(response[0]);
      if (response[0] < 1) {
        return res.status(200).json({
          success: false,
          msg: `No changes were made to the seed data`,
          status: 200,
        });
      }
      return res.status(200).json({
        success: true,
        msg: `Seed data was updated successfully`,
        status: 200,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        msg: `An error occurred while updating seed data`,
        status: 500,
      });
    }
  },

  updateSeedProducerStatus: async (req, res) => {
    const producerId = req.params.id;
    const user_id = req.params.user_id;
    try {
      let current = await SeedProducer.findOne({
        where: { id: producerId, user_id: user_id },
        attributes: ["status", "full_name"],
      });
      const status = current.status == 1 ? 2 : 1; // Toggle status
      const humanize = status === 1 ? "Activated" : "Deactivated"; // Corrected assignment

      const response = await SeedProducer.update(
        { status: status },
        {
          where: { id: producerId, user_id: user_id },
          fields: ["status"],
        }
      );

      if (response[0] < 1) {
        return res.status(200).json({
          success: false,
          msg: `There was an error changing ${current.full_name} status`,
          status: 200,
          state: status,
        });
      }
      return res.status(200).json({
        success: true,
        msg: `You have successfully ${humanize} ${current.full_name}`,
        status: 200,
        state: status,
      });
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ success: false, msg: "An error occurred", status: 500 }); // Error response
    }
  },

  /* BINARY EOL */
};
