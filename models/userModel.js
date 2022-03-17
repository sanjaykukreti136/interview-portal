const mongose = require("mongoose");
const db = require("../secrets");
// let  db;
// if(require('../secrets').link){
//     db = require('../secrets').link;
// }else{
// db = process.env.link;
// }
const validator = require("email-validator");
const bcrypt = require("bcrypt");

/// CONNNECT DATABASE
mongose
  .connect(db.link)
  .then(() => {
    console.log("db connect user");
  })
  .catch((err) => {
    console.log(err);
  });

// CREATION OF SCHEMA
const userSchema = new mongose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return validator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
  },
  confirmPassword: {
    type: String,
    validate: function () {
      return this.password == this.confirmPassword;
    },
  },
  applied: {
    type: [String],
  },
  token: String,
  roles: {
    type: String,
    enum: ["admin", "Recruiter", "Student"],
    default: "Student",
  },
});

/// undefined confrimPassword after validation , so it can remove from databse
userSchema.pre("save", async function () {
  if (this.confirmPassword) {
    // cout << "insedie this ";
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    this.confirmPassword = undefined;
  }
});

//! CREATION OF MODEL
const userModel = mongose.model("userModel", userSchema);

module.exports = userModel;
