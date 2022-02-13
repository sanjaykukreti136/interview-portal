const express = require("express");
const appliedJobsModel = require('../models/appliedJobModel');
const jobsModel = require('../models/jobsModel')
const userModel = require('../models/userModel');
const app = express();
const jobsRouter = express.Router();

const {protectRoute , bodyChecker ,isAuthorized} = require('../helpers/help');
const { getElement, getElements , deleteElement , updateElement } = require('../helpers/factory');
// app.use(protectRoute)/

jobsRouter.route("/").get(  getElements(jobsModel))

jobsRouter.route("/:id").get(getElement(jobsModel)).post( protectRoute ,  isAuthorized(["student"]) , bodyChecker ,   applyJob);

async function applyJob(req , res){
    try{
        let data  = req.body;
        let job_id = req.params.id;
        job_id = (job_id)
        let user_email = data.email;
        console.log(user_email);
        let user = await userModel.findOne({email : user_email});
        // user["_id"] = user["_id"].toString();
        // console.log("userid" , user["_id"]);
        let uid = user["_id"].toString();

        if(user){
            data.email = uid;
            data.job = job_id;
            console.log("data-email" , data);
            let applied_job = await appliedJobsModel.create(data);
            let arr = user.applied;
            arr.push(applied_job["_id"].toString());
            // user = await userModel.findByIdAndUpdate( user._id , { applied : arr  });
            user.applied.push(applied_job["_id"].toString());
            // console.log("applied" , applied_job);
            await user.save();
            let job = await jobsModel.findById(job_id);
            job.applied.push(applied_job["_id"].toString());
            await job.save();
            return res.status(200).json({ data : data })
        }else{
            return res.status(500).json({err : err.message , message : "mail  not found"});
        }

    }
    catch(err){
        return res.status(500).json({err : err.message , message : "job apply error "});
    }
}


module.exports  = jobsRouter;