const express = require("express");
const jwt = require('jsonwebtoken');
const { JWT_KEY }  =  require('../secrets');
const authRouter = express.Router();
const emailSender = require('../helpers/emailSender')
const bcrypt = require("bcrypt");
const { protectRoute , bodyChecker , isAuthorized } = require('../helpers/help')
const userModel = require('../models/userModel')

authRouter.route("/login").post(bodyChecker ,  login);
authRouter.route("/signup").post( bodyChecker ,  signup);
authRouter.route("/forgetPassword").post(forgetPassword);
authRouter.route("/resetPassword").post(  resetPassword);

async function signup(req, res){
    try{
        let user = req.body;
        user.createdAt =  new Date().toISOString();
        user = await userModel.create(user);
        return res.status(200).json({ message : "signup success" , user : user });
    }
    catch(err){
        return res.status(500).json({message : "signup router problem" , error : err.message });
    }
}
async function login(req , res){
    try{
        let user = await userModel.findOne({ email : req.body.email });
        if(user){
          let areEqual = await bcrypt.compare(req.body.password , user.password);
          if(areEqual){
            let payload = user['_id'];
            let token = jwt.sign( { id: payload } ,   JWT_KEY )
            // res.cookie('login' , token , { httpOnly : true } );
            res.cookie("JWT", token);
           return res.json({ message : "user logged in " })
          }else{
             return res.json({ message : "pass not matched" })
          }
        }else{
         return res.json({ message : "e-mail not found" })
        }
    }catch(err){
        return res.status(500).json({message : "login router problem" , error : err.message });
    }
}

async function resetPassword(req , res){
    try{
        let { token , password , confirmPassword } = req.body;
        let user = await userModel.findOne({ token });
        if(user){
            console.log("user - ", user);
            if(confirmPassword == password){
                user.password = password;
                user.confirmPassword = confirmPassword;
                user.token = undefined;
                await user.save();
                let updatedUser = await userModel.findOne({email : user.email});
               return  res.status(200).json({ message : "passsword reset successfully" , updated : updatedUser });
            }else{
              return res.status(200).json({ message : "confirm password & password didnot match"});
            }
  
        }else{
          return res.status(200).json({ message : "invalid token"});
        }
    }
    catch(err){
      return res.status(200).json({ message : err.message , msg : "reset password fails"});
    }
  }
  
  async function forgetPassword(req, res){
      try{
          let {email} = req.body;
          let user = await userModel.findOne({email});
          if(user){
              let token = (Math.floor(Math.random()*10000)+10000).toString().substring(1);
              let updateDB = await userModel.updateOne({email}, {token});
              console.log("updated db after token", updateDB);
              let updatedUser = await userModel.findOne({email});
  
              await emailSender(token , email);
              return res.status(200).json({ message  : "token send successfully" , token : token })
  
          }else{
            return res.status(500).json({ message : "email not found" })
          }
      }
      catch(err){
          return res.status(500).json({message  :   err.message , msg : "forget password fails"});
      }
  }
  

module.exports = authRouter;