const mongose = require("mongoose");
// let  db;
// if(require('../secrets').link){
//     db = require('../secrets').link;
// }else{
// db = process.env.link;
// }
const db = require("../secrets");
// const validator = require('email-validator');
// const bcrypt = require("bcrypt");

/// CONNNECT DATABASE
mongose
  .connect(db.link)
  .then(() => {
    console.log("db connect jobs");
  })
  .catch((err) => {
    console.log(err);
  });

// CREATION OF SCHEMA
const jobsSchema = new mongose.Schema({
  name: {
    type: String,
    required: true,
  },
  recruiter: {
    type: String,
  },
  postedAt: {
    type: String,
  },
  description: {
    type: String,
  },
  typej: {
    type: String,
    enum: ["Intern", "FTE"],
    default: "FTE",
  },
  location: {
    type: String,
  },
  skills: {
    type: String,
  },
  applied: {
    type: [Object],
  },
});

// / undefined confrimPassword after validation , so it can remove from databse
// jobsSchema.pre('save', async function(){

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password , salt);

//     this.confirmPassword = undefined;
// } )

//! CREATION OF MODEL
const jobsModel = mongose.model("jobsModel", jobsSchema);

module.exports = jobsModel;
