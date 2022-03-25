const userModel = require("../models/userModel");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secrets");
const authRouter = express.Router();
const emailSender = require("../helpers/emailSender");
const bcrypt = require("bcrypt");
authRouter.route("/signup").post(signUp, insertUser);

authRouter.route("/login").post(loginUser);

authRouter.route("/forgetPassword").post(forgetPassword);

authRouter.route("/verifyToken").post(verifyToken);

authRouter.route("/resetPassword").post(resetPassword);

///// ! FUNCTIONS

async function verifyToken(req, res) {
  try {
    let { token } = req.body;
    let user = await userModel.findOne({ token });
    if (user) {
      return req.status(202).json({ msg: "valid" });
    } else {
      return req.status(402).json({ msg: "invalid" });
    }
  } catch {}
}

async function resetPassword(req, res) {
  try {
    let { token, password, confirmPassword } = req.body;
    let user = await userModel.findOne({ token });
    if (user) {
      if (confirmPassword == password) {
        user.password = password;
        user.confirmPassword = confirmPassword;
        user.token = undefined;
        await user.save();
        let updatedUser = await userModel.findOne({ email: user.email });
        return res.status(202).json({
          message: "passsword reset successfully",
          updated: updatedUser,
        });
      } else {
        return res
          .status(200)
          .json({ message: "confirm password & password didnot match" });
      }
    } else {
      return res.status(200).json({ message: "invalid token" });
    }
  } catch (err) {
    return res.status(200).json({ message: err.message });
  }
}

async function forgetPassword(req, res) {
  try {
    let { email } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      let token = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      let updateDB = await userModel.updateOne({ email }, { token });
      let updatedUser = await userModel.findOne({ email });

      await emailSender(token, email);
      return res
        .status(202)
        .json({ message: "token send successfully", token: token });
    } else {
      return res.status(404).json({ message: "email not found" });
    }
  } catch (err) {
    return res.status(404).json({ message: "xx" + err.message });
  }
}

async function loginUser(req, res) {
  try {
    if (req.body.email) {
      let user = await userModel.findOne({ email: req.body.email });
      if (user) {
        let areEqual = await bcrypt.compare(req.body.password, user.password);
        if (areEqual) {
          let payload = user["_id"];
          let token = jwt.sign({ id: payload }, JWT_KEY);
          // res.cookie('login' , token , { httpOnly : true } );
          res.cookie("JWT", token);

          return res
            .status(201)
            .json({ email: user.email, id: user._id, type: user.roles });
        } else {
          return res.status(401).json({ message: "pass not matched" });
        }
      } else {
        return res.status(404).json({ message: "mail not found" });
      }
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

function signUp(req, res, next) {
  let obj = req.body;
  console.log("====================================");
  console.log(obj);
  console.log("====================================");
  let length = Object.keys(obj).length;
  if (length == 0) {
    return res.status(404).json({ message: " user not found " });
  }
  req.body.createdAt = new Date().toISOString();

  next();
}

async function insertUser(req, res) {
  try {
    let userObj = req.body;
    let user = await userModel.create(userObj);
    return res
      .status(201)
      .json({ email: user.email, id: user._id, type: user.roles });
    // res.status(201).json({
    //   message: "user signed up",
    //   userObj: user,
    // });
  } catch (err) {
    res.status(408).json({
      message: err.message,

      msg: "idhar ",
    });
  }
}

module.exports = authRouter;
