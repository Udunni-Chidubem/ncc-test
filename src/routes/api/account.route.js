const accountRouter = require("express").Router();
const siteController = require("../../controllers/site.controller");

accountRouter.post("/login", async (req, res) => {
  let resp = await siteController.apiLogin(req);
  res.status(resp.statusCode).json(resp);
});

accountRouter.post("/farmer-signup", async (req, res) => {
  let y = await siteController.savefarmer(req, res);
  console.log(req.body);
  if (y.user) {
    res
      .status(200)
      .json({
        statusCode: 200,
        message: "Account created successfully",
        body: y.farmer,
      })
      .send();
  } else {
    res
      .status(400)
      .json({ statusCode: 400, message: "there was an error", body: y })
      .send();
  }
});
accountRouter.post("/company-signup", async (req, res) => {
  let y = await siteController.saveseedcompany(req, res);
  if (y.user) {
    res
      .status(200)
      .json({
        statusCode: 200,
        message: "Account created successfully",
        body: y.seed_company,
      })
      .send();
  } else {
    res
      .status(400)
      .json({ statusCode: 400, message: "there was an error", body: y })
      .send();
  }
});

accountRouter.post("/trader-signup", async (req, res) => {
  let y = await siteController.saveseedtrader(req, res);
  if (y.user) {
    res
      .status(200)
      .json({
        statusCode: 200,
        message: "Account created successfully",
        body: y.seed_company,
      })
      .send();
  } else {
    res
      .status(400)
      .json({ statusCode: 400, message: "there was an error", body: y })
      .send();
  }
});

accountRouter.post("/request-password-reset", async (req, res) => {
  if (req.body.phone) {
    req.body.username = req.body.phone;
    let passw = await siteController.ForgotPassword(req, res);
    if (!passw) {
      const response = {
        status: "Failure",
        details: "Account does not exist",
      };
      res
        .status(400)
        .json({
          statusCode: 400,
          message: response.details,
          body: response,
        })
        .send();
    } else {
      siteController.otp(passw.username);
      const response = {
        status: "Success",
        details: "Otp sent successfully",
      };
      res
        .status(200)
        .json({
          statusCode: 200,
          message: response.details,
          body: response,
        })
        .send();
    }
  }
});
accountRouter.post("/reset-password", async (req, res) => {
  let otp = req.body.otp;
  let phone = req.body.phone;
  let otp_instance = await siteController.getOTPByCode(otp, phone);
  if (otp_instance != null) {
    if (req.body.newpassword) {
      if (req.body.newpassword === req.body.confirmpassword) {
        siteController.deleteOTP(otp, phone);
        let rst = siteController.updatePassword(
          req.body.newpassword,
          req.body.phone
        );
        if (rst) {
          const response = {
            status: "Success",
            details: "Password updated Successfully",
          };
          res
            .status(200)
            .json({
              statusCode: 200,
              message: response.details,
              body: response,
            })
            .send();
        } else {
          const response = {
            status: "Failure",
            details: "Something went wrong",
          };
          res
            .status(400)
            .json({
              statusCode: 400,
              message: response.details,
              body: rst,
            })
            .send();
        }
      } else {
        const response = {
          status: "Failure",
          details: "Passwords do not match",
        };
        res
          .status(400)
          .json({
            statusCode: 400,
            message: response.details,
            body: response,
          })
          .send();
      }
    } else {
      res
        .status(400)
        .json({
          statusCode: 400,
          message: "invalid Input",
          body: "New Password field can not be null",
        })
        .send();
    }
  } else {
    res
      .status(400)
      .json({
        statusCode: 400,
        message: "Otp validation failed",
        body: "invalid otp entered",
      })
      .send();
  }
});

accountRouter.post("/validate-otp", async (req, res) => {
  let otp = req.body.otp;
  let phone = req.body.phone;
  let otp_instance = await siteController.getOTPByCode(otp, phone);
  if (otp_instance != null) {
    siteController.deleteOTP(otp, phone);
    res
      .status(200)
      .json({
        statusCode: 200,
        message: "Otp validated successfully",
        body: "Otp Validated successfully",
      })
      .send();
  } else {
    res
      .status(400)
      .json({
        statusCode: 400,
        message: "Otp validation failed",
        body: "invalid otp entered",
      })
      .send();
  }
});

module.exports = accountRouter;
