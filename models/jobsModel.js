const mongose = require('mongoose');
const db =  require('../secrets')
// const validator = require('email-validator');
// const bcrypt = require("bcrypt");

/// CONNNECT DATABASE 
mongose.connect(db.link).then(()=>{
    console.log('db connect');
}).catch((err)=>{
    console.log(err);
})


// CREATION OF SCHEMA
const jobsSchema = new mongose.Schema({

    name :{
        type : String,
        required : true
    },
    
    postedAt : {
        type : String
    },
    description : {
        type : String,
    },

    applied : {
        type : [String]
    }

})




// / undefined confrimPassword after validation , so it can remove from databse
// jobsSchema.pre('save', async function(){

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password , salt);

//     this.confirmPassword = undefined;
// } )


//! CREATION OF MODEL
const jobsModel = mongose.model('jobsModel', jobsSchema );

module.exports = jobsModel;