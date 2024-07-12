require("dotenv").config();
const { QueryTypes } = require("sequelize");
const db = require("../models");
const utils = require("../helpers/utils");
const bcrypt = require("bcrypt");
const {
  User,
  UserRole,
  Role,
  Farmer,
  SeedCompany,
  TransactionCarts,
  Cart,
  States,
  LGAs,
  DeliveryInformation,
  SeedTrader,
  Product,
  Wallet,
  Orders,
  TransactionLog,
  Message,
  Salesheets,
  KnowledgeBase,
  SeedProducer,
  SeedProducerSeed,
} = db;
const { getPagingData, getPagination } = require("../helpers/pagination");
const { Op, UniqueConstraintError } = require("sequelize");
const { now } = require("moment");
const { query } = require("express");
const { isValidPhoneNumber } = require("../helpers/form.helper");

const path = require("path");
const csv = require("csv-parser");
const fs = require("fs");
const { Readable } = require("stream");

module.exports = {
  getNascAdminRoles: async (req, res) => {
    let roles = await Role.findAll({
      where: {
        [Op.or]: [
          { role_name: "admin" },
          { role_name: "nasc" },
          { role_name: "rra" },
          { role_name: "nigsims" },
        ],
      },
      raw: true,
    });
    return roles;
  },
  getFarmers: async (req, res) => {
    let farmers = await Farmer.findAll({
      // attributes : ['id', 'firstname', 'lastname', 'created_at'],
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
          model: User,
        },
      ],
      order: [["updated_at", "DESC"]],
    });
    farmers = JSON.stringify(farmers);

    return JSON.parse(farmers);
  },
  getCompanies: async (req, res) => {
    let companies = await SeedCompany.findAll({
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
          model: User,
        },
      ],
      order: [["updated_at", "DESC"]],
    });

    companies = JSON.stringify(companies);
    return JSON.parse(companies);
  },
  getTraders: async (req, res) => {
    let traders = await SeedTrader.findAll({
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
      order: [["updated_at", "DESC"]],
    });
    traders = JSON.stringify(traders);
    return JSON.parse(traders);
  },

  getProducts: async (req, res) => {
    let products = await Product.findAll({
      include: [
        {
          model: User,
          include: [
            {
              model: SeedCompany,
            },
          ],
        },
      ],
      order: [["updated_at", "DESC"]],
    });
    products = JSON.stringify(products);
    return JSON.parse(products);
  },

  getOneFarmer: async (req, res) => {
    let farmer;
    /* Find Farmer Begins*/
    const singleFarmer = await Farmer.findOne({
      where: { user_id: req.params.id },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "gender",
        "date_of_birth",
        "level_of_education",
        "nin",
        "bvn",
        "phone_no",
        "address_of_farm",
        "user_id",
        "created_at",
        "profile_pic",
        "farm_size",
        "farm_size_measurement",
      ],
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
          model: User,
          attributes: ["id", "status"],
          include: [
            {
              model: DeliveryInformation,
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
            },
          ],
        },
      ],
    });

    if (singleFarmer) {
      farmer = JSON.parse(JSON.stringify(singleFarmer));
    }
    /* Find Farmer - Ends */
    return farmer;
  },

  getOneCompany: async (req, res) => {
    let company;
    /* FInd Seed Company - Begins*/
    const singleCompany = await SeedCompany.findOne({
      where: { user_id: req.params.id },
      // attributes: ['id', 'name_of_company', 'email', 'phone_no', 'address', 'licensed_no', 'certification_number', 'tin'],
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
          model: User,
          attributes: ["id", "status"],
        },
      ],
    });

    if (singleCompany) {
      company = JSON.parse(JSON.stringify(singleCompany));
      // console.log(singleCompany.toJSON());
    }
    /* Find Seed Company - Ends */
    return company;
  },

  getOneTrader: async (req, res) => {
    let trader;
    /* Find Seed Trader - Begin */
    const singleTrader = await SeedTrader.findOne({
      where: { user_id: req.params.id },
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
          model: User,
          attributes: ["id", "status"],
          include: [
            {
              model: DeliveryInformation,
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
            },
          ],
        },
      ],
    });

    if (singleTrader) {
      trader = JSON.parse(JSON.stringify(singleTrader));
      // console.log(singleTrader.toJSON());
    }
    /*Find Seed Trader - Ends */

    return trader;
  },
  getProductsByUserID: async (req, res) => {
    let productsById = await Product.findAll({
      where: { user_id: req.params.id },
    });
    productsById = JSON.stringify(productsById);
    return JSON.parse(productsById);
  },
  getFarmerCount: async (req, res) => {
    let farmerCount = await Farmer.count({
      // where: {id: req.params.id}
    });

    farmerCount = farmerCount;
    return farmerCount;
  },
  getSeedTraderCount: async (req, res) => {
    let seedtraderCount = await SeedTrader.count({
      // where: {id: req.params.id}
    });

    seedtraderCount = seedtraderCount;
    return seedtraderCount;
  },
  getCompanyCount: async (req, res) => {
    // let companyCount = await SeedCompany.count({
    //     // where: {id: req.params.id},
    //     attributes:["user_"],
    //     include:[
    //         {
    //             model: User,
    //             attributes:["status"]
    //         }
    //     ],
    //     raw: true
    // });

    let sql =
      "SELECT count(u.id) as count from user u join seedcompany sc on u.id = sc.user_id where u.status != '2' ";

    let companyCount = await db.rest.query(sql, {
      type: QueryTypes.SELECT,
    });

    companyCount = companyCount;
    return companyCount;
  },
  getWallet: async (req, res) => {
    let balance = await Wallet.findOne({
      where: { user_id: req.params.id },
      attributes: ["amount"],
      raw: true,
    });

    balance = balance;
    // console.log(balance);
    return balance;
  },
  viewProduct: async (req, res) => {
    const singleProduct = await Product.findOne({
      include: [
        {
          model: User,
          attributes: ["username"],
          include: [
            {
              model: SeedCompany,
              attributes: ["id", "name_of_company", "state_id"],
              include: [{ model: States, attributes: ["id", "name"] }],
            },
          ],
        },
      ],
      where: { id: req.params.id },
      attributes: [
        "id",
        "product_name",
        "variant",
        "description",
        "item",
        "file_name",
        "status",
        "created_at",
      ],
    });
    return JSON.parse(JSON.stringify(singleProduct));
  },
  productUpdate: async (data, id) => {
    Product.update(data, {
      where: { id: id },
    });
  },
  userUpdate: async (data, id) => {
    User.update(data, {
      where: { id: id },
    });
  },
  getOrders: async (req, res) => {
    let orders = await Orders.findAll({
      include: [
        {
          model: SeedCompany,
          attributes: ["name_of_company", "id"],
        },
        {
          model: TransactionLog,
          include: [
            {
              model: Farmer,
              attributes: ["firstname", "lastname", "id"],
            },
          ],
        },
      ],
    });

    orders = JSON.stringify(orders);
    return JSON.parse(orders);
  },

  /**
   * Retrieves the order details, farmer information, and order status based on the transaction ID, user ID, and company ID.
   *
   * @param {type} transaction_id - Description of the transaction ID parameter
   * @param {type} user_id - Description of the user ID parameter
   * @param {type} company_id - Description of the company ID parameter
   * @return {type} An object containing the order details, farmer information, and order status
   */
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
            },
            {
              model: User,
              include: [{ model: Farmer }, { model: SeedTrader }],
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
    // console.log(order);
    return { order, farmer, orderStatus };
  },

  /**
   * Updates an order in the database based on the provided request and data.
   *
   * @param {Object} req - The request object containing the order ID.
   * @param {Object} data - The data object containing the updated order information.
   * @return {Promise<void>} - A promise that resolves when the order is successfully updated.
   */
  async updadeOrders(req, data) {
    try {
      const order_id = req.body.order;
      const order = await Orders.update(data, { where: { id: order_id } });
      if (order[0] > 0 && data.status === "4") {
        // data == 4 means order is cleared (4 = Fulfilled)
        const _order = await Orders.findOne({ where: { id: order_id } });
        const transactionCart = await TransactionCarts.findAll({
          include: [
            {
              model: TransactionLog,
              where: { id: _order.transaction_log_id },
            },
            {
              model: Cart,
              // include: [
              //   {
              //     model: Product,
              //   },
              // ],
            },
          ],
        });
        const response = JSON.parse(JSON.stringify(transactionCart));
        await this.updateClearedBalance(response, _order);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  },

  /**
   * Updates the cleared balance and uncleared balance for multiple items in a transaction.
   *
   * @param {Array} trans_log - An array of transaction logs.
   * @param {Object} order - The order object.
   * @return {Promise<void>} A promise that resolves when the update is complete.
   */
  async updateClearedBalance(trans_log, order) {
    let transaction = await db.rest.transaction();

    try {
      for (const item of trans_log) {
        const final_cleared_amount = item.Cart.total_amount * 0.89;

        const company = await SeedCompany.findOne({
          where: { id: order.company_id },
          attributes: ["user_id"],
        });

        await Wallet.increment(
          {
            uncleared_amount: -final_cleared_amount,
            amount: final_cleared_amount,
          },
          {
            where: { user_id: company.user_id },
            transaction: transaction,
          }
        );
        console.log("Updated cleared balance & uncleared balance");
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      console.log("Error updating cleared balance", e);
    }
  },

  getUserslist: async (req, res) => {
    try {
      let sql1 =
        "SELECT count(u.id) as count FROM user u JOIN farmer f ON u.id = f.user_id WHERE u.status = '1'";
      let farmeractivelist = await db.rest.query(sql1, {
        type: QueryTypes.SELECT,
      });

      let sql2 =
        "SELECT count(u.id) as count FROM user u JOIN farmer f ON u.id = f.user_id JOIN user_role ur ON u.id = ur.user_id WHERE u.status = '0' AND ur.role_id = '1'";
      let farmerinactivelist = await db.rest.query(sql2, {
        type: QueryTypes.SELECT,
      });

      let sql3 =
        "SELECT count(u.id) as count FROM user u JOIN seedcompany sc ON u.id = sc.user_id WHERE u.status = '1'";
      let seedcompanyactivelist = await db.rest.query(sql3, {
        type: QueryTypes.SELECT,
      });

      let sql4 =
        "SELECT count(u.id) as count FROM user u JOIN seedcompany sc ON u.id = sc.user_id WHERE u.status = '0'";
      let seedcompanyinactivelist = await db.rest.query(sql4, {
        type: QueryTypes.SELECT,
      });

      let sql5 =
        "SELECT count(u.id) as count FROM user u JOIN seedtrader st ON u.id = st.user_id WHERE u.status = '1'";
      let seedtraderactivelist = await db.rest.query(sql5, {
        type: QueryTypes.SELECT,
      });

      let sql6 =
        "SELECT count(u.id) as count FROM user u JOIN seedtrader st ON u.id = st.user_id WHERE u.status = '0'";
      let seedtraderinactivelist = await db.rest.query(sql6, {
        type: QueryTypes.SELECT,
      });

      return {
        farmeractivelist,
        farmerinactivelist,
        seedcompanyactivelist,
        seedcompanyinactivelist,
        seedtraderactivelist,
        seedtraderinactivelist,
      };
    } catch (error) {
      console.error("Error querying user lists:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMessages: async (req, res) => {
    try {
      let admin_messages = await Message.findAll({
        where: { to_user: "Admin" },
        group: "from_user",
        include: [
          {
            model: User,
            as: "Sender",
            include: [
              { model: SeedCompany },
              { model: SeedTrader },
              { model: Farmer },
              { model: UserRole, include: [{ model: Role }] },
            ],
            raw: true,
          },
        ],
      });
      admin_messages = JSON.parse(JSON.stringify(admin_messages));
      // console.log(admin_messages);
      return admin_messages;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  getNewmessages: async (req, res) => {
    // let sql = "SELECT status , from_user from messages WHERE status = 'new' GROUP by status,from_user";
    // let newmessages = await db.rest.query(sql, { type: QueryTypes.SELECT })
    // console.log(newmessages)
    // return newmessages

    try {
      let admin_messages = await Message.findAll({
        where: { to_user: "Admin", status: "new" },
        group: "from_user",
        include: [
          {
            model: User,
            as: "Sender",
            include: [
              {
                model: SeedCompany,
              },
              {
                model: SeedTrader,
              },
              {
                model: Farmer,
              },
              {
                model: UserRole,
                include: [{ model: Role }],
              },
            ],
            raw: true,
          },
        ],
      });
      admin_messages = JSON.parse(JSON.stringify(admin_messages));
      // console.log(admin_messages);
      return admin_messages;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
  updateMessagestatus: async (req, to_userid) => {
    // console.log(to_userid);
    try {
      let status = Message.update(
        { status: "0" },
        { where: { from_user: to_userid } }
      );
      return status;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  getProductStatus: async (req, res) => {
    let sql =
      "SELECT count(id) as count from product as p where p.status = '1' ";
    let activeProduct = await db.rest.query(sql, { type: QueryTypes.SELECT });

    let sql2 =
      "SELECT count(id) as count from product as p where p.status = '0' ";
    let inactiveProduct = await db.rest.query(sql2, {
      type: QueryTypes.SELECT,
    });

    return { activeProduct, inactiveProduct };
  },
  getUserStatus: async (req, res) => {
    let f_sql =
      "SELECT u.status, count(f.id) as f_count from farmer f join user u WHERE f.user_id = u.id group by u.status";
    let sc_sql =
      "SELECT u.status, count(sc.id) as sc_count from seedcompany sc join user u WHERE sc.user_id = u.id group by u.status";
    let st_sql =
      "SELECT u.status, count(st.id) as st_count from seedtrader st join user u WHERE st.user_id = u.id group by u.status";

    let f_count = await db.rest.query(f_sql, { type: QueryTypes.SELECT });
    let sc_count = await db.rest.query(sc_sql, { type: QueryTypes.SELECT });
    let st_count = await db.rest.query(st_sql, { type: QueryTypes.SELECT });

    f_count = JSON.parse(JSON.stringify(f_count));
    sc_count = JSON.parse(JSON.stringify(sc_count));
    st_count = JSON.parse(JSON.stringify(st_count));
    return { f_count, sc_count, st_count };
  },

  getmessages: async (req, res) => {
    let to_userid = req.params.user_id;

    let messages = await Message.findAll({
      where: {
        // [Op.or] :   [
        //     {from_user : to_userid },
        //     {to_user : to_userid  }
        // ]

        [Op.or]: [
          {
            from_user: {
              [Op.eq]: to_userid,
            },
          },
          {
            to_user: {
              [Op.eq]: to_userid,
            },
          },
        ],
      },
      include: [
        {
          model: User,
          as: "Sender",
          //    include: [
          //      { model: SeedTrader }
          //    ]
        },
      ],
      raw: true,
    });

    messages = JSON.parse(JSON.stringify(messages));
    return { messages, to_userid };

    // let sql = "SELECT * FROM messages where from_user ="+to_userid+" or to_user ="+ to_userid + ";"
    // let messages = await db.rest.query(sql, { type: QueryTypes.SELECT })
    // console.log(messages)
    // return {messages,to_userid}
  },
  getuserrole: async (req, to_userid) => {
    let messages = await User.findOne({
      where: { id: to_userid },
      include: [
        {
          model: UserRole,
          include: [{ model: Role }],
        },
      ],
    });

    messages = JSON.parse(JSON.stringify(messages));
    return { messages };
  },
  getuserdata: async (role_id, to_userid) => {
    let messages;
    if (role_id == "farmer") {
      messages = await User.findOne({
        where: { id: to_userid },
        include: [
          {
            model: Farmer,
          },
        ],
      });
    } else if (role_id == "seed_company") {
      messages = await User.findOne({
        where: { id: to_userid },
        include: [
          {
            model: SeedCompany,
          },
        ],
      });
    } else if (role_id == "seed_trader") {
      messages = await User.findOne({
        where: { id: to_userid },
        include: [
          {
            model: SeedTrader,
          },
        ],
      });
    }

    messages = JSON.parse(JSON.stringify(messages));
    return { messages };
  },
  message: async (req, user_id) => {
    const transaction = await db.rest.transaction();
    let success_message = "Sent";
    let messages = req.body.message;
    let from_user = user_id;
    let to_user = req.body.to_user;
    let status = "new";
    try {
      await Message.create(
        {
          message: messages,
          from_user: from_user,
          to_user: to_user,
          status: status,
          created_at: now(),
          updated_at: now(),
        },
        { transaction: transaction }
      );
      transaction.commit();
      return success_message;
    } catch (e) {
      console.log(e);
      transaction.rollback();
    }
  },
  getmessagescount: async (req, res) => {
    let sql =
      "SELECT * FROM messages where to_user = " +
      " 'Admin' " +
      " and status = 'new';";
    let messages = await db.rest.query(sql, { type: QueryTypes.SELECT });
    //console.log(messages)
    return messages;
  },

  getUserRole: async (req, res) => {
    const user = await req.user;
    let user_role = await UserRole.findOne({
      where: { user_id: user.id },
      include: [
        {
          model: Role,
        },
      ],
    });

    return user_role;
  },

  getAllUsers: async (req, res) => {
    let states = await States.findAll({
      attributes: ["id", "name"],
      raw: true,
    });

    let sql =
      "SELECT distinct u.username, u.created_at, u.updated_at, f.firstname as `Farmer.firstname`, f.lastname as `Farmer.lastname`, s.name as `Farmer.State.name`, l.name as `Farmer.LGA.name`, f.date_of_birth as `Farmer.date_of_birth`, f.gender as `Farmer.gender`, st.firstname as `SeedTrader.firstname`, st.lastname as `SeedTrader.lastname`,  s1.name as 'SeedTrader.State.name', l1.name as `SeedTrader.LGA.name`, st.age as `SeedTrader.age`, st.gender as 'SeedTrader.gender', sc.name_of_company as `SeedCompany.name_of_company`, s2.name as `SeedCompany.State.name`, l2.name as `SeedCompany.LGA.name` FROM user u left join farmer f on f.user_id=u.id left join lgas l on l.id =f.lg_id left join states s on s.id=f.state_id left join seedtrader st on st.user_id = u.id left join lgas l1 on l1.id =st.lg_id left join states s1 on s1.id=st.state_id left join seedcompany sc on sc.user_id = u.id left join lgas l2 on l2.id =sc.lg_id left join states s2 on s2.id=sc.state_id left join  user_role ur on ur.user_id=u.id left join role r on r.id = ur.role_id where r.role_name <> 'admin' AND r.role_name <> 'nasc' AND r.role_name <> 'rra' AND r.role_name <> 'nigsims'";

    if (req.query.startdate && req.query.startdate != "") {
      sql = sql + " AND u.created_at >= '" + req.query.startdate + "'";
    }

    if (req.query.enddate && req.query.enddate != "") {
      sql = sql + " AND u.created_at <= '" + req.query.enddate + "'";
    }

    if (req.query.genderselect && req.query.genderselect != "") {
      sql =
        sql +
        " AND (f.gender = '" +
        req.query.genderselect +
        "' or st.gender ='" +
        req.query.genderselect +
        "')";
    }
    if (req.query.locationselect && req.query.locationselect != "") {
      sql =
        sql +
        " AND (f.state_id = '" +
        req.query.locationselect +
        "' or st.state_id ='" +
        req.query.locationselect +
        "' or sc.state_id ='" +
        req.query.locationselect +
        "')";
    }
    if ((req, query.ageselect && req.query.ageselect != "")) {
      sql =
        sql +
        "AND (f.date_of_birth = '" +
        req.query.ageselect +
        "' or st.age ='" +
        req.query.ageselect +
        "')";
    }
    // console.log("the sql is", sql);

    let users = await db.rest.query(sql, {
      nest: true,
      type: QueryTypes.SELECT,
    });
    users = JSON.parse(JSON.stringify(users));
    states = JSON.parse(JSON.stringify(states));
    //ageRange = Json.parse(JSON.stringify(ageRange))
    // console.log(states)
    // console.log(users);
    return { users, states };
  },

  getAllTransaction: async (req, res) => {
    let sql =
      "SELECT distinct f.firstname as `Farmer.firstname`, f.lastname as `Farmer.lastname`, s.name as `Farmer.State.name`, l.name as `Farmer.LGA.name`, st.firstname as `SeedTrader.firstname`, st.lastname as `SeedTrader.lastname`,  s1.name as 'SeedTrader.State.name', l1.name as `SeedTrader.LGA.name`, p.product_name as `Product.product_name`, tl.created_at as `TransactionLog.created_at`, tl.amount as `TransactionLog.amount`, tl.status as `TransactionLog.status` FROM transaction_carts tc left join transaction_log tl on tl.id=tc.transaction_log_id left join farmer f on f.id=tl.farmer_id left join lgas l on l.id =f.lg_id left join seedtrader st on st.id=tl.seedtrader_id left join lgas l1 on l1.id =st.lg_id left join states s1 on s1.id=st.state_id left join states s on s.id=f.state_id left join cart c on c.id=tc.cart_id left join product p on p.id=c.product_id where 1";

    if (req.query.startdate && req.query.startdate != "") {
      sql = sql + " AND u.created_at <= '" + req.query.startdate + "'";
    }

    if (req.query.enddate && req.query.enddate != "") {
      sql = sql + " AND u.created_at >= '" + req.query.enddate + "'";
    }

    if (req.query.productselect && req.query.productselect != "") {
      sql = sql + " AND p.product_name = '" + req.query.productselect + "'";
    }
    if (req.query.locationselect && req.query.locationselect != "") {
      sql =
        sql +
        " AND (f.state_id = '" +
        req.query.locationselect +
        "' or st.state_id ='" +
        req.query.locationselect +
        "')";
    }

    if ((req, query.selectstatus && req.query.selectstatus != "")) {
      sql = sql + " AND tl.status = '" + req.query.selectstatus + "'";
    }

    let transaction = await db.rest.query(sql, {
      nest: true,
      type: QueryTypes.SELECT,
    });

    transaction = JSON.parse(JSON.stringify(transaction));

    // console.log(transaction);
    return transaction;
  },

  getOfflineTransactionCount: async (req, res) => {
    let sql = "SELECT count(id) as count from salesheets";
    let offlineCount = await db.rest.query(sql, { type: QueryTypes.SELECT });

    // console.log(offlineCount);
    return offlineCount;
  },

  getOnlineTransactionCount: async (req, res) => {
    let sql = "SELECT count(id) as count from transaction_log";
    let onlineCount = await db.rest.query(sql, { type: QueryTypes.SELECT });
    // console.log(onlineCount);
    return onlineCount;
  },

  getFarmerGender: async (req, res) => {
    let sql = "SELECT count(id) count from farmer f where f.gender = 'Male' ";
    let farmerMalelist = await db.rest.query(sql, {
      type: QueryTypes.SELECT,
    });

    let sql2 =
      "SELECT count(id) as count from farmer f  where f.gender = 'Female' ";
    let farmerFemalelist = await db.rest.query(sql2, {
      type: QueryTypes.SELECT,
    });

    return {
      farmerMalelist,
      farmerFemalelist,
    };
  },

  getMaleSeedTraderCount: async (req, res) => {
    let maleSeedtraderCount = await SeedTrader.count({
      where: { gender: "Male" },
    });

    maleSeedtraderCount = maleSeedtraderCount;
    return maleSeedtraderCount;
  },

  company_id: async (req, res) => {
    let company_id = await SeedCompany.findOne({
      where: { user_id: req.params.id },
    });
    company_id = JSON.parse(JSON.stringify(company_id));
    return company_id;
  },

  ledger_info: async (req, res, company_id) => {
    let ledger_info = await Orders.findAll({
      where: { company_id: company_id },
      include: [
        {
          model: TransactionLog,
        },
      ],
    });

    ledger_info = JSON.parse(JSON.stringify(ledger_info));
    return ledger_info;
  },

  getAllSaleSheets: async (res, req) => {
    let salesSheet = await Salesheets.findAll({
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
          model: User,
          include: [
            {
              model: SeedCompany,
            },
            {
              model: SeedTrader,
            },
          ],
        },
      ],
    });
    sales = JSON.parse(JSON.stringify(salesSheet));
    // console.log(sales);
    return sales;
  },

  createUser: async (req, res) => {
    const transaction = await db.rest.transaction();
    try {
      let usrExist = await User.count({
        where: { username: req.body.email },
      });
      if (!usrExist) {
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await User.create(
          {
            username: req.body.email,
            password: password,
            status: true,
            token: "",
          },
          { transaction: transaction }
        );

        await UserRole.create(
          {
            user_id: user.id,
            role_id: req.body.roles,
          },
          { transaction: transaction }
        );
        await transaction.commit();
        return user;
      } else {
        return { error: true, message: "Account already exist" };
      }
    } catch (e) {
      await transaction.rollback();

      return { error: true, message: e.message };
    }
  },

  createKnowledgeBase: async (req, res) => {
    try {
      // console.log(req.body);
      let knowledgeBase = await KnowledgeBase.create({
        name: req.body.fileName,
        description: req.body.description,
      });
      let displayImage = req.files.displayImage;
      let displayImageName = displayImage.name.split(".");
      // console.log(displayImageName);
      let displayImageFileName =
        req.body.fileName +
        knowledgeBase.id +
        "." +
        displayImageName[displayImageName.length - 1];
      displayImage.mv("./public/knowledge_base/images/" + displayImageFileName);
      let pdfFile = req.files.pdfFile;
      pdfFileName = pdfFile.name.split(".");
      // console.log(pdfFileName);
      let pdfFileFileName =
        req.body.fileName +
        knowledgeBase.id +
        "." +
        pdfFileName[pdfFileName.length - 1];
      pdfFile.mv("./public/knowledge_base/file/" + pdfFileFileName);
      knowledgeBase.image_path = displayImageFileName;
      knowledgeBase.file_path = pdfFileFileName;
      knowledgeBase.save();
      return knowledgeBase;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  getStates: async (req, res) => {
    let states = await States.findAll({
      attributes: ["id", "name"],
      raw: true,
    });
    return states;
  },

  listSeedProducers: async (req, res) => {
    const user = await req.user;
    // let response = null;

    const seedProducer = await SeedProducer.findAll({
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
          model: User,
          include: [
            {
              model: SeedCompany,
              attributes: ["name_of_company"],
            },
          ],
          raw: true,
        },
        {
          model: SeedProducerSeed,
          raw: true,
        },
      ],
      order: [["created_at", "DESC"]],
    });
    response = JSON.parse(JSON.stringify(seedProducer));
    return response;
  },

  viewSeedProducer: async (req, res) => {
    const user = await req.user;
    let response = null;

    const seedProducer = await SeedProducer.findOne({
      where: { id: req.params.id },
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
  getSeedProducerCount: async (req, res) => {
    let seedProducerCount = await SeedProducer.count({});

    // seedProducerCount = seedProducerCount;
    return seedProducerCount;
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
        },
        {
          where: { id: data.id, producer_id: data.producer_id },
          fields: [
            "name_of_seed",
            "variety_of_seed",
            "volume_of_seed",
            "year_produced",
            "unit",
          ],
        }
      );
      console.log(response[0]);
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

  listSeedCompanies: async (keyword) => {
    try {
      let sql = `SELECT user_id, name_of_company FROM seedcompany sc JOIN user u ON sc.user_id = u.id WHERE (name_of_company LIKE '%${keyword}%' OR phone_no LIKE '%${keyword}%' OR email LIKE '%${keyword}%' OR licensed_no LIKE '%${keyword}%') AND u.status = 1;`;
      let seedCompanyList = await db.rest.query(sql, {
        type: QueryTypes.SELECT,
      });
      return seedCompanyList;
    } catch (e) {
      console.error(e);
    }
  },

  uploadSeedProducerList: async (file, company_data) => {
    let seedProducersToInsert = [];
    let duplicateSeedProducer = [];
    let seedProducedToInsert = [];

    try {
      if (!file || !file.data) {
        throw new Error("File data is undefined");
      }

      const data = [];
      const bufferStream = new Readable();
      bufferStream.push(file.data);
      bufferStream.push(null);

      await new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on("data", (row) => data.push(row))
          .on("end", resolve)
          .on("error", reject);
      });

      for (const item of data) {
        const stateQuery = `SELECT id FROM states WHERE name = :state_name`;
        const [state] = await db.rest.query(stateQuery, {
          type: QueryTypes.SELECT,
          replacements: { state_name: item.state_name },
        });

        const lgaQuery = `SELECT id FROM lgas WHERE name = :lg_name AND state_id = :state_id`;
        const [lga] = await db.rest.query(lgaQuery, {
          type: QueryTypes.SELECT,
          replacements: { lg_name: item.lg_name, state_id: state.id },
        });

        if (state && lga) {
          const seedproducerQuery = `SELECT phone_no FROM seedProducer WHERE phone_no = :phone_no AND user_id = :user_id LIMIT 1`;
          const sseedProducer = await db.rest.query(seedproducerQuery, {
            type: QueryTypes.SELECT,
            replacements: {
              phone_no: item.phone_no,
              user_id: company_data.seed_company_id,
            },
          });

          if (sseedProducer.length > 0) {
            duplicateSeedProducer.push({ phone_number: item.phone_no });
          } else {
            seedProducersToInsert.push({
              user_id: company_data.seed_company_id,
              full_name: item.full_name,
              phone_no: item.phone_no,
              certified: item.certified,
              gender: item.gender,
              age_range: item.age_range,
              living_status: item.living_status,
              state_id: state.id,
              lg_id: lga.id,
            });
          }
        } else {
          console.warn(
            `Invalid state_id or lg_id for seed producer: ${item.full_name}`
          );
        }
      }

      if (duplicateSeedProducer.length > 0) {
        seedProducersToInsert = seedProducersToInsert.filter(
          (sp) =>
            !duplicateSeedProducer.some((dp) => dp.phone_number === sp.phone_no)
        );
      }

      if (seedProducersToInsert.length > 0) {
        const seedP = await db.SeedProducer.bulkCreate(seedProducersToInsert);
        seedP.forEach((seed, index) => {
          const item = data[index];
          seedProducedToInsert.push({
            producer_id: seed.id,
            name_of_seed: item.name_of_seed,
            variety_of_seed: item.variety_of_seed,
            volume_of_seed: item.volume_of_seed,
            year_produced: item.year_produced,
          });
        });

        await db.SeedProducerSeed.bulkCreate(seedProducedToInsert);

        return {
          success: true,
          msg: `Seed producers uploaded successfully. Uploaded data: ${seedProducersToInsert.length} and rejected data: ${duplicateSeedProducer.length}`,
        };
      } else {
        return {
          success: false,
          msg: `All provided seed producers already exist. Inserted data: ${seedProducersToInsert.length} and rejected: ${duplicateSeedProducer.length}`,
        };
      }
    } catch (e) {
      console.error(e);
      if (e instanceof UniqueConstraintError) {
        return {
          success: false,
          msg: `Unique constraint error. Total rejected data: ${duplicateSeedProducer.length}. Inserted data: ${seedProducersToInsert.length}`,
        };
      } else {
        return { success: false, msg: `Error processing file: ${e.message}` };
      }
    }
  },

  /* BINARY EOL */
};
