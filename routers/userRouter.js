const express = require("express");
const app = express();
const userModel = require("../models/userModel");
const cookieParser = require("cookie-parser");
const userRouter = express.Router();
const { protectRoute, bodyChecker, isAuthorized } = require("../helpers/help");

const {
  createElement,
  getElement,
  getElements,
  deleteElement,
  updateElement,
} = require("../helpers/factory");
const res = require("express/lib/response");

app.use(protectRoute);

userRouter
  .route("/")
  .get(isAuthorized(["admin", "ce"]), getElements(userModel))
  .post(isAuthorized(["admin"]), createElement(userModel));

userRouter
  .route("/:id")
  .get(getUser)
  .patch(isAuthorized(["admin", "ce"]), updateElement(userModel))
  .delete(isAuthorized(["admin"]), deleteElement(userModel));

async function getUser(req, res) {
  let id = req.params.id;
  //   var _id = mongoose.Types.ObjectId.fromString(id);
  let data = await userModel.findById(id);
  return res.send(data);
}

module.exports = userRouter;
