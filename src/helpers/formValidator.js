const { body, validationResult } = require("express-validator");
const db = require("../models");
const { SeedCompany, User, SeedTrader } = db;
const bcrypt = require("bcryptjs");
const utils = require("../helpers/utils");

const profileUpdateValidation = () => {
  return [
    body("firstname")
      .not()
      .isEmpty()
      .withMessage("Firstname field is required"),
    body("lastname").not().isEmpty().withMessage("Lastname field is required"),
    body("gender").not().isEmpty().withMessage("Gender field is required"),
    body("level_of_education")
      .not()
      .isEmpty()
      .withMessage("Education Level field is required"),
    body("state_id").not().isEmpty().withMessage("State field is required"),
    body("lg_id").not().isEmpty().withMessage("LGA field is required"),
    body("state_of_delivery")
      .not()
      .isEmpty()
      .withMessage("State of Delivery field is required"),
    body("lga_of_delivery")
      .not()
      .isEmpty()
      .withMessage("LGA of Delivery field is required"),
    body("address").not().isEmpty().withMessage("Address field is required"),
  ];
};
const settingsValidation = () => {
  return [
    body("newpassword")
      .not()
      .isEmpty()
      .withMessage("New Password field is required"),
    body("confirmpassword").custom((value, { req }) => {
      if (value !== req.body.newpassword) {
        throw new Error("Password confirmation does not match Password");
      }
      return true;
    }),
    body("currentpassword")
      .not()
      .isEmpty()
      .withMessage("Current Password field is required")
      .custom(async (value, { req }) => {
        let user = await User.findOne({
          where: { username: req.body.userphoneno.trim() },
        });
        if (user) {
          if (await bcrypt.compare(req.body.currentpassword, user.password)) {
          } else {
            throw new Error("Incorrect Password");
            return "Incorrect Password";
          }
        }
        return true;
      }),
  ];
};

const companyValidation = () => {
  return [
    body("name_of_company")
      .not()
      .isEmpty()
      .withMessage("Company Name field is required"),
    body("phone_no")
      .not()
      .isEmpty()
      .withMessage("Phone Number field is required"),
    body("tin").not().isEmpty().withMessage("TIN field is required"),
    body("address").not().isEmpty().withMessage("Address field is required"),
    // body("licensed_no")
    //   .not()
    //   .isEmpty()
    //   .withMessage("Licensed Number field required"),
    // body("certification_number")
    //   .not()
    //   .isEmpty()
    //   .withMessage("Certification Number field is required"),
    body("email").not().isEmpty().withMessage("Email field is required"),
    body("state_id").not().isEmpty().withMessage("State field is required"),
    body("lg_id").not().isEmpty().withMessage("LGA field is required"),
  ];
};

const signupValidation = () => {
  return [
    body("firstname")
      .not()
      .isEmpty()
      .withMessage("Firstname field is required"),
    body("lastname").not().isEmpty().withMessage("Lastname field is required"),
    body("phone")
      .not()
      .isEmpty()
      .withMessage("Phone Number field is required")
      .custom((value, { req }) => {
        return User.findOne({
          where: { username: req.body.phone },
        }).then((user) => {
          if (user) {
            return Promise.reject(
              "Phone Number is already in use. Please try another one!"
            );
          }
        });
      }),
    body("password").not().isEmpty().withMessage("Password field is required"),
    body("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match Password");
      }
      return true;
    }),
  ];
};

const signUpvalidate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

  //Send Values Back to form
  let formData = {
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    phone_number: req.body.phone,
  };

  res.render("site/farmer_signup", {
    form_banner: "Group.png",
    layout: "form",
    formData,
    extractedErrors,
    title: "Farmer's Registration",
  });
};

const registerSeedCompanyValidation = () => {
  return [
    body("company_name")
      .not()
      .isEmpty()
      .withMessage("Company's Name field is required"),
    body("phone")
      .not()
      .isEmpty()
      .withMessage("Phone Number field is required")
      .custom((value, { req }) => {
        return User.findOne({ where: { username: req.body.phone } }).then(
          (user) => {
            if (user) {
              return Promise.reject(
                "Phone Number is already in use. Please try another one!"
              );
            }
          }
        );
      }),
    body("password").not().isEmpty().withMessage("Password field is required"),
    body("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match Password");
      }
      return true;
    }),
  ];
};

const registerSeedCompanyValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

  //Send Values Back to form
  let formData = {
    company_name: req.body.company_name,
    phone: req.body.phone,
  };

  res.render("site/seed_company_signup", {
    form_banner: "seeds-02 1.png",
    layout: "form",
    title: "Seed's Company Registration",
    formData,
    extractedErrors,
  });
};

const seedTraderValidation = () => {
  return [
    body("firstname")
      .not()
      .isEmpty()
      .withMessage("Firstname field is required"),
    body("lastname").not().isEmpty().withMessage("Lastname field is required"),
    body("phone")
      .not()
      .isEmpty()
      .withMessage("Phone Number field is required")
      .custom((value, { req }) => {
        return User.findOne({ where: { username: req.body.phone } }).then(
          (user) => {
            if (user) {
              return Promise.reject(
                "Phone Number is already in use. Please try another one!"
              );
            }
          }
        );
      }),
    body("password").not().isEmpty().withMessage("Password field is required"),
    body("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match Password");
      }
      return true;
    }),
  ];
};

const seedTraderValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

  //Send Values Back to form
  let formData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
  };

  res.render("site/seed_trader_signup", {
    form_banner: "tradersignup.png",
    layout: "form",
    title: "Seed's Trader Registration",
    formData,
    extractedErrors,
  });
};

const productValidation = () => {
  return [
    body("productName")
      .not()
      .isEmpty()
      .withMessage("Product Name field is required"),
    body("productDescription")
      .not()
      .isEmpty()
      .withMessage("Product Description field is required"),
    body("productVariant")
      .not()
      .isEmpty()
      .withMessage("Product Variant field is required"),
  ];
};

//Cart with multiple items
const cartValidation = () => {
  return [
    body("pid").not().isEmpty().withMessage("Product Item is requried"),
    body("price")
      .not()
      .isEmpty()
      .withMessage("You have not selected a price for the product"),
    body("quantity").not().isEmpty().withMessage("Quantity field is required"),
    body("size").not().isEmpty().withMessage("Size field is required"),
  ];
};

//Single Cart for scenario where farmer is just interested in
const cartSingleValidation = () => {
  return [
    body("price")
      .not()
      .isEmpty()
      .withMessage("You have not selected a price for the product"),
    body("quantity").not().isEmpty().withMessage("Quantity field is required"),
    body("size").not().isEmpty().withMessage("Size field is required"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

  res.json({
    statusCode: 402,
    error: true,
    data: extractedErrors,
  });
};

module.exports = {
  profileUpdateValidation,
  companyValidation,
  validate,
  signupValidation,
  signUpvalidate,
  registerSeedCompanyValidation,
  registerSeedCompanyValidate,
  seedTraderValidation,
  seedTraderValidate,
  cartValidation,
  cartSingleValidation,
  productValidation,
  settingsValidation,
};
