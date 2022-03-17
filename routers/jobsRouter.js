const express = require("express");

const jobsModel = require("../models/jobsModel");
const userModel = require("../models/userModel");
const app = express();
const jobsRouter = express.Router();

const { protectRoute, bodyChecker, isAuthorized } = require("../helpers/help");
const {
  getElement,
  getElements,
  deleteElement,
  updateElement,
} = require("../helpers/factory");
// const { status } = require("express/lib/response");
// const res = require("express/lib/response");
// app.use(protectRoute)/

jobsRouter.route("/").get(getAllJobs);
jobsRouter.route("/posted/:id").get(getParticularJob);
jobsRouter.route("/applied/:id").get(getUserAppliedJobs);
jobsRouter.route("/:id").post(applyJob);

async function getAllJobs(req, res) {
  // return async function (req, res) {
  let model_name = jobsModel;
  try {
    let elementsPromise;
    // mongodb query
    if (req.query.myQuery) {
      elementsPromise = await model_name.find(req.query.myQuery);
    } else {
      elementsPromise = await model_name.find();
    }

    //sort products
    if (req.query.sort) {
      elementsPromise = await elementsPromise.sort(req.query.sort);
    }

    // selects
    if (req.query.select) {
      let params = await req.query.select.split("%").join(" ");
      elementsPromise = await elementsPromise.select(params);
    }

    // pagination
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 4;
    let toSkip = (page - 1) * limit;
    // elementsPromise = elementsPromise.skip(toSkip).limit(limit);
    let elements = await elementsPromise;

    return res.status(201).json({ element: elements });
  } catch (err) {
    return res.status(400).json({ message: err.message, msg: "here problem" });
  }
  // };
}

async function getParticularJob(req, res) {
  // return async function (req, res) {
  let model_name = jobsModel;
  let id = req.params.id;
  try {
    let users = await model_name.findById(id);
    return res.status(200).json({ users: users });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  // };
}

async function getUserAppliedJobs(model_name) {
  try {
    let all_jobs = await jobsModel.find();
    let user = await userModel.findById(req.params);
    let user_applied = user.applied;
    let user_applied_jobs = [];
    for (let i = 0; i < all_jobs.length; i++) {
      if (user_applied.includes(all_jobs[i]._id)) {
        user_applied_jobs.push(all_jobs[i]);
      }
    }
    return res.status(201).json({ jobs: user_applied_jobs });
  } catch {
    return res.status(404).json({ message: "not succesfull" });
  }
}

async function getAppliedJobs(req, res) {
  try {
    let user_id = req.params.id;
    let all_applied_jobs = await appliedJobsModel.find();
    let my_jobs = [];
    for (let index = 0; index < all_applied_jobs.length; index++) {
      if (all_applied_jobs[index].user_id == user_id) {
        my_jobs.push(await jobsModel.findById(all_applied_jobs[index].job));
      }
    }
    return res.status(200).json({ data: my_jobs });
  } catch {
    return res
      .status(500)
      .json({ err: err.message, message: "get applied jobs error" });
  }
}

async function getPostedJobs(req, res) {
  try {
    let recruiter_id = req.params.id;
    let all_jobs = await jobsModel.find();
    let my_posted_jobs = [];
    for (let index = 0; index < all_jobs.length; index++) {
      if (all_jobs[index].recruiter == recruiter_id) {
        my_posted_jobs.push(all_jobs[index]);
      }
    }
    return res.status(200).json({ data: my_posted_jobs });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message, msg: "get posted job error" });
  }
}

async function applyJob(req, res) {
  try {
    // {
    //   "email" : "snaay",
    //   "resume link ": "1223334",
    // }
    let data = req.body;
    console.log(data);
    let user_details = { email: data.email, resume: data.resume };
    let job_id = req.params.id;
    console.log(user_details);
    let job = await jobsModel.findById(job_id);

    let user = await userModel.findOne({ email: data.email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "NOT AUTHERIZED USER" });
    }
    user.applied.push(job._id);

    console.log(job);
    job.applied.push({ user_details });
    job.save();
    user.save();
    return res.status(201).json({ message: "JOB APPLIED" });
  } catch {}
}

module.exports = jobsRouter;
