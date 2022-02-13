const mongose = require('mongoose');
// const db =process.env ||  require('../secrets') 
let  db;
// if(require('../secrets').link){
//     db = require('../secrets').link;
// }else{
    db = process.env.link;
// }
// if(process.env){
//     db = process.env;
//     // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
// }else{
//     db = require('../secrets').link;
//     // db = db.link;
// }
// const validator = require('email-validator');
// const bcrypt = require("bcrypt");

/// CONNNECT DATABASE 
console.log(db);
mongose.connect(db).then(()=>{
    console.log('db connect');
}).catch((err)=>{
    console.log(err);
})


// CREATION OF SCHEMA
const appliedJobsSchema = new mongose.Schema({

    job : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true
    },
    resume:{
        type : String,
        required : true
    }

})




/// undefined confrimPassword after validation , so it can remove from databse
// appliedJobsSchema.pre('save', async function(){

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password , salt);

//     this.confirmPassword = undefined;
// } )


//! CREATION OF MODEL
const appliedJobsModel = mongose.model('appliedJobsModel', appliedJobsSchema );

module.exports = appliedJobsModel;