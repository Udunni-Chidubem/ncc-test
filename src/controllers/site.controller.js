require("dotenv").config();
const db = require("../models/index");
const { sequelize } = require("../models");
const {
  User,
  Farmer,
  UserRole,
  Role,
  SeedTrader,
  SeedCompany,
  LGAs,
  States,
  Wallet,
  Contact,
  Otp,
} = db;
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");
const directoryPath = "./src/data/";
const path = require("path");
const fs = require("fs");
const Random = require("random-js").Random;
const otp = require("../models/otp");
const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");

global.pass = 0;

module.exports = {
  home: async (req, res) => {
    res.render("site/home", {
      title: "Welcome",
    });
  },
  authenticate: async (req, res) => {
    res.send("even after transaction");
  },
  presignup: async (req, res) => {
    res.render("site/pre-signup", {
      title: "Pre-Registration Page",
    });
  },
  extension_worker: async (req, res) => {
    let state = await States.findAll({
      attributes: ["id", "name"],
      raw: true,
    });

    res.render("site/extension-worker", {
      title: "Find and extension worker",
      layout: "header",
      state: state,
    });
  },
  success_page_test: async (req, res) => {
    res.render("site/success-bk", {
      form_banner: "Group.png",
      title: "Successful Page",
      layout: "success-header",
      errors: req.flash("errors"),
    });
  },
  aboutus: async (req, res) => {
    res.render("site/about-us", {
      layout: "main",
      title: "About Us",
    });
  },
  faq: async (req, res) => {
    res.render("site/faq", {
      layout: "common",
      title: "FAQ",
    });
  },

  farmer_signup: async (req, res) => {
    res.render("site/farmer_signup", {
      form_banner: "Group.png",
      layout: "form",
      // states : states,
      title: "Farmer's Registration",
      errors: req.flash("errors"),
    });
  },
  dashboard: async (req, res) => {
    res.render("dashboard", {
      title: "Dashboard",
      layout: "dashboard",
    });
  },
  login: async (req, res) => {
    res.render("site/login", {
      form_banner: "Group.png",
      title: "Login",
      layout: "form",
      errors: req.flash("errors"),
    });
  },
  // Forgot_Password: async (req,res) => {
  //     res.render('site/forgot_password',{
  //         form_banner:'Group.png',
  //         title: 'Forgot-Password',
  //         layout : 'form',
  //         errors : req.flash('errors')
  //     });
  // },
  // OTP: async (req,res) => {
  //     res.render('site/otp',{
  //         form_banner:'Group.png',
  //         title: 'OTP',
  //         layout : 'form',
  //         errors : req.flash('errors')
  //     });
  // },
  NewPassword: async (req, res) => {
    res.render("site/new_password", {
      form_banner: "Group.png",
      title: "New-Password",
      layout: "form",
      errors: req.flash("errors"),
    });
  },
  seedcompanysignup: async (req, res) => {
    res.render("site/seed_company_signup", {
      form_banner: "seeds-02 1.png",
      title: "Seed Company's Registration",
      sub: "Investment in agriculture yields profit",
      layout: "form",
      errors: req.flash("errors"),
    });
  },
  seedtradersignup: async (req, res) => {
    res.render("site/seed_trader_signup", {
      form_banner: "tradersignup.png",
      title: "Seed Trader's Registration",
      sub: "Become an entrepreneur in seed trading",
      layout: "form",
      errors: req.flash("errors"),
    });
  },
  savefarmer: async (rq, rs) => {
    const transaction = await db.rest.transaction();
    try {
      let usrExist = await User.count({
        where: { username: rq.body.phone },
      });
      if (!usrExist) {
        const password = await bcrypt.hash(rq.body.password, 10);
        const user = await User.create(
          {
            username: rq.body.phone,
            password: password,
            status: false,
            token: "",
          },
          { transaction: transaction }
        );
        let r = await Role.findOne({
          where: { role_name: "farmer" },
        });
        UserRole.create(
          {
            user_id: user.id,
            role_id: r.id,
          },
          { transaction: transaction }
        );
        let referee = null;
        if (rq.body.referral) {
          let s = await SeedTrader.findOne({
            where: { referal_code: rq.body.referral },
          });
          referee = s.user_id;
        }
        const farmer = await Farmer.create(
          {
            firstname: rq.body.firstname,
            lastname: rq.body.lastname,
            phone_no: rq.body.phone,
            user_id: user.id,
            referee: referee,
          },
          { transaction: transaction }
        );
        await transaction.commit();
        return { user, farmer };
      } else {
        return { error: true, message: "Account already exist" };
      }
    } catch (e) {
      console.log(e);
      await transaction.rollback();

      return e;
    }
  },
  saveuser: async (username, password, token, status) => {
    let user = new User();
    return user;
  },
  saveseedcompany: async (req, res) => {
    const transaction = await db.rest.transaction();
    try {
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create(
        {
          username: req.body.phone,
          password: password,
          status: false,
          token: "",
        },
        { transaction: transaction }
      );
      let r = await Role.findOne({
        where: { role_name: "seed_company" },
      });
      UserRole.create(
        {
          user_id: user.id,
          role_id: r.id,
        },
        { transaction: transaction }
      );
      Wallet.create(
        {
          user_id: user.id,
          amount: 0.0,
        },
        { transaction: transaction }
      );
      const seed_company = await SeedCompany.create(
        {
          name_of_company: req.body.company_name,
          phone_no: req.body.phone,
          user_id: user.id,
        },
        { transaction: transaction }
      );
      transaction.commit();

      return { user, seed_company };
    } catch (e) {
      transaction.rollback();
      return e;
    }
  },
  saveseedtrader: async (req, res) => {
    const transaction = await db.rest.transaction();
    try {
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create(
        {
          username: req.body.phone,
          password: password,
          status: false,
          token: "",
        },
        { transaction: transaction }
      );

      let r = await Role.findOne({
        where: { role_name: "seed_trader" },
      });

      const user_role = await UserRole.create(
        {
          user_id: user.id,
          role_id: r.id,
        },
        { transaction: transaction }
      );

      let unique = uniqid();
      let seed_trader = await SeedTrader.create(
        {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phone_no: req.body.phone,
          unique_no: unique,
          user_id: user.id,
          referal_code:
            Date.now().toString(36) +
            req.body.firstname.substr(0, 1) +
            req.body.lastname.substr(0, 1),
        },
        { transaction: transaction }
      );

      transaction.commit();
      return { user, seed_trader };
    } catch (e) {
      transaction.rollback();
      return e;
    }
  },
  states: async (req, res) => {
    let states = await States.findAll({
      attributes: ["id", "name"],
      raw: true,
    });
    res.send(states);
  },
  getStates: async () => {
    let states = await States.findAll({
      attributes: ["id", "name"],
      raw: true,
    });
    return states;
  },
  lgas: async (req, res) => {
    let lgas = await LGAs.findAll({
      attributes: ["id", "name"],
      where: { state_id: req.params.state_id, id: req.params.lga_id },
      raw: true,
    });
    res.json(lgas);
  },
  lgaByStateId: async (req, res) => {
    let lgas = await LGAs.findAll({
      include: [
        {
          model: States,
          attributes: ["id", "name"],
        },
      ],
      attributes: ["id", "name"],
      where: { state_id: req.params.state_id },
      raw: true,
    });
    res.json(lgas);
  },
  getDropList: (req, res) => {
    const data = require("../data/dropDownList.json");

    fs.stat(directoryPath + "dropDownList.json", (err, stats) => {
      if (err) {
        return res.json({ statusCode: 404, error: true, data: err });
      }

      const genders = [];
      const farmProduce = [];
      const levelEdu = [];
      const banks = [];

      let gender = data.gender;
      let farm_Produce = data.farmProduce;
      let level = data.levelEducation;
      let bank = data.banks;

      gender.forEach((value, index, self) => {
        genders.push(value);
      });

      farm_Produce.forEach((value, index, self) => {
        farmProduce.push(value);
      });

      level.forEach((value, index, self) => {
        levelEdu.push(value);
      });

      bank.forEach((value, index, self) => {
        banks.push(value);
      });

      res.json({
        statusCode: 200,
        error: false,
        data: {
          gender: genders,
          farm_produce: farmProduce,
          eduLevel: levelEdu,
          bank: banks,
        },
      });
    });
  },
  services: async (req, res) => {
    res.render("site/services", {
      layout: "common",
      title: "Services",
    });
  },

  saveContact: async (req, res) => {
    Contact.create(req.body);
  },

  ForgotPassword: async (req, res) => {
    pass = await User.findOne({
      attributes: ["id", "username"],
      where: {
        username: req.body.username,
      },
    });
    if (!pass) {
      console.log("Wrong Number");
    } else {
      return pass;
    }
  },

  otp: async (phone) => {
    let transaction = await db.rest.transaction();
    //Generate OTP
    try {
      const random = new Random();
      const otp_code = random.integer(1, 1000000);
      const now = new Date();
      const expiration_time = new Date(now.getTime() + 10 * 60000);

      // console.log(otp_gen);
      const otp_instance = await Otp.create(
        {
          otp_code: otp_code,
          expiration_time: expiration_time,
          phone: phone,
          verified: false,
        },
        { transaction: transaction }
      );

      let r = await axios.get(
        `${process.env.sms_api}?token=${process.env.token_number}&sender=NIGSIMS&to=${phone}&message=${otp_code}&type=0&routing=3`
      );
      console.log(r.data);

      // let p = {
      //     method: 'post',
      //     url: 'https://app.smartsmssolutions.com/io/api/client/v1/senderid/create/',
      //     headers: {
      //       ...data.getHeaders()
      //     },
      //     data : data
      //   };

      transaction.commit();
      return otp_instance;
    } catch (e) {
      transaction.rollback();
      console.log(e);
      return e;
    }
  },

  getOTPByCode: async (otp_code, phone) => {
    let otp = await Otp.findOne({
      where: { otp_code: otp_code, phone: phone },
    });
    otp = JSON.parse(JSON.stringify(otp));
    console.log(otp);
    return otp;
  },
  deleteOTP: async (otp, phone) => {
    Otp.destroy({
      where: { otp_code: otp, phone: phone },
    });
  },

  updatePassword: async (password, phone) => {
    let transaction = await db.rest.transaction();
    try {
      let user = await User.update(
        {
          password: await bcrypt.hash(password, 10),
        },
        { where: { username: phone } },
        { transaction: transaction }
      );
      transaction.commit();
      return true;
    } catch (e) {
      transaction.rollback();
      console.log(e);
      return false;
    }
  },

  apiLogin: async (req) => {
    try {
      const user = await User.findOne({
        include: [
          {
            model: UserRole,
            include: [{ model: Role }],
          },
        ],
        where: {
          username: req.body.username,
        },
      });
      if (user != null) {
        if ((await bcrypt.compare(req.body.password, user.password)) == true) {
          if (user.status != 2) {
            let payload = {
              sub: user.id,
              role: user.UserRole.Role.role_name,
              username: user.username,
            };
            let token = jwt.sign(payload, "secret123", { expiresIn: "60m" });
            return {
              status: true,
              statusCode: 200,
              body: { access_token: token, type: "Bearer", expiresIn: "60m" },
            };
          } else {
            return {
              status: false,
              statusCode: 401,
              body: { message: "Account is not activated" },
            };
          }
        }
      }
      return {
        status: false,
        statusCode: 401,
        body: {
          message: "You have entered Invalid credentials. Please try again!!!",
        },
      };
    } catch (e) {
      // console.log(e.message())
      return { status: false, statusCode: 500, body: { message: e } };
    }
  },
};
