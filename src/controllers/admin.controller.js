require("dotenv").config();
const { QueryTypes } = require("sequelize");
const db = require("../models");
const utils = require("../helpers/utils");
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
} = db;
const { getPagingData, getPagination } = require("../helpers/pagination");
const { Op } = require("sequelize");
const { now } = require("moment");
const { query } = require("express");

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

<<<<<<< HEAD
          let transaction = await db.rest.query(sql, {
            nest: true,
            type: QueryTypes.SELECT,
        }); 

        transaction = JSON.parse(JSON.stringify(transaction));

        console.log(transaction);
        return transaction;
    },

    getOfflineTransactionCount: async (req, res) =>{

        let sql =
        "SELECT count(id) as count from salesheets";
    let offlineCount = await db.rest.query(sql, { type: QueryTypes.SELECT });

        console.log(offlineCount);
        return offlineCount;
    },
    
    getOnlineTransactionCount: async (req, res) =>{
        let sql =
        "SELECT count(id) as count from transaction_log";
    let onlineCount = await db.rest.query(sql, { type: QueryTypes.SELECT });
        console.log(onlineCount);
        return onlineCount;
    },

    getFarmerGender: async (req, res) => {
        let sql =
            "SELECT count(id) count from farmer f where f.gender = 'Male' ";
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
            farmerFemalelist
        };
    },
    getMaleSeedTraderCount: async (req, res) => {
        let maleSeedtraderCount = await SeedTrader.count({
            where: {gender: "Male"}
        });

        maleSeedtraderCount = maleSeedtraderCount;
        return maleSeedtraderCount;
    },

    company_id: async (req,res) => {
        let company_id = await SeedCompany.findOne({
            where: {user_id: req.params.id}
        })
        company_id = JSON.parse(JSON.stringify(company_id))
        return company_id;
    },

    ledger_info: async (req, res, company_id) => {
        let ledger_info = await Orders.findAll({
            where: {company_id: company_id},
            include: [
                {
                    model: TransactionLog
                }
            ]
        })

        ledger_info = JSON.parse(JSON.stringify(ledger_info))
        return ledger_info;
    },
    getAllSaleSheets: async (res, req) => {
        let salesSheet = await Salesheets.findAll({
=======
  getProducts: async (req, res) => {
    let products = await Product.findAll({
      include: [
        {
          model: User,
>>>>>>> 1baef6205490cdd48a67f94cbc632be7468a20b7
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
      console.log(singleCompany.toJSON());
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
      console.log(singleTrader.toJSON());
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
    console.log(balance);
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
    console.log(order);
    return { order, farmer, orderStatus };
  },
  updadeOrders: async (order_id, data) => {
    Orders.update(data, { where: { id: order_id } });
  },

  getUserslist: async (req, res) => {
    let sql =
      "SELECT count(u.id) as count from user u join farmer f on u.id = f.user_id where u.status = '1' ";
    let farmeractivelist = await db.rest.query(sql, {
      type: QueryTypes.SELECT,
    });

    let sql2 =
      "SELECT count(u.id) as count from user u join farmer f on u.id = f.user_id where u.status = '0' ";
    let farmerinactivelist = await db.rest.query(sql2, {
      type: QueryTypes.SELECT,
    });

    let sql3 =
      "SELECT count(u.id) as count from user u join seedcompany sc on u.id = sc.user_id where u.status = '1' ";
    let seedcompanyactivelist = await db.rest.query(sql3, {
      type: QueryTypes.SELECT,
    });

    let sql4 =
      "SELECT count(u.id) as count from user u join seedcompany sc on u.id = sc.user_id where u.status = '0' ";
    let seedcompanyinactivelist = await db.rest.query(sql4, {
      type: QueryTypes.SELECT,
    });

    let SQL5 =
      "SELECT count(u.id) as count from user u join seedtrader st on u.id = st.user_id where u.status = '1' ";
    let seedtraderactivelist = await db.rest.query(SQL5, {
      type: QueryTypes.SELECT,
    });

    let sql6 =
      "SELECT count(u.id) as count from user u join seedtrader st on u.id = st.user_id where u.status = '0' ";
    let seedtraderinactivelist = await db.rest.query(sql6, {
      type: QueryTypes.SELECT,
    });

    return {
      farmerinactivelist,
      farmeractivelist,
      seedcompanyactivelist,
      seedcompanyinactivelist,
      seedtraderactivelist,
      seedtraderinactivelist,
    };
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
      console.log(admin_messages);
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
      console.log(admin_messages);
      return admin_messages;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
  updateMessagestatus: async (req, to_userid) => {
    console.log(to_userid);
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
    console.log("the sql is", sql);

    let users = await db.rest.query(sql, {
      nest: true,
      type: QueryTypes.SELECT,
    });
    users = JSON.parse(JSON.stringify(users));
    states = JSON.parse(JSON.stringify(states));
    //ageRange = Json.parse(JSON.stringify(ageRange))
    // console.log(states)
    console.log(users);
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

    console.log(transaction);
    return transaction;
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
          ],
        },
      ],
    });
    sales = JSON.parse(JSON.stringify(salesSheet));
    console.log(sales);
    return sales;
  },
};
