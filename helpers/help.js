const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secrets");
const userModel = require("../models/userModel");
module.exports.protectRoute = function protectRoute(req, res, next) {
  console.log("aa gya ");
  try {
    let data = localStorage.getItem("user");
    console.log(data + " is data");
    // console.log("reached body checker");
    // // cookie-parser
    // let cok =  req.cookies;
    // console.log("cok = ", cok);
    // console.log("61", req.cookies)
    // // jwt
    // console.log(JWT_KEY + "--");
    // // -> verify everytime that if
    // // you are bringing the token to get your response
    // console.log(req.cookies.JWT);
    // // console.log(req.cookies.login);
    // let decryptedToken =  jwt.verify(req.cookies.JWT, JWT_KEY);
    // console.log("66", decryptedToken)
    // console.log("68", decryptedToken)
    // if (decryptedToken) {
    // let userId = decryptedToken.id;
    // req.userId = userId
    // console.log("id ...", userId);
    next();
    // } else {
    //    return  res.send("kindly login to access this resource ");
    // }
  } catch (err) {
    return res.status(200).json({
      message: err.message,
      msg: "login problem",
    });
  }
};
module.exports.bodyChecker = function bodyChecker(req, res, next) {
  console.log("reached body checker");
  let isPresent = Object.keys(req.body).length;
  console.log("ispresent", isPresent);
  if (isPresent) {
    next();
  } else {
    return res.send("kind send details in body ");
  }
};

module.exports.isAuthorized = function (roles) {
  console.log("I will run when the server is started");
  // function call
  console.log();
  return async function (req, res, next) {
    console.log("Inner function");
    let { userId } = req;
    // id -> user get ,user role,
    console.log("id = ", userId);
    try {
      let user = await userModel.findById(userId);
      console.log("user ---", user);
      // console.log("roles", user.roles);
      // console.log("real roles", roles);
      let userisAuthorized = roles.includes(user.roles);
      if (userisAuthorized) {
        req.user = user;
        next();
      } else {
        return res.status(200).json({
          message: "user not authorized",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
};
