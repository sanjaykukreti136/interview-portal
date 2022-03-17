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

// app.use(isAuthorized["admin", "re"]);
jobsRouter.route("/").post(createJob);

jobsRouter.route("/:id").delete(deleteJob);

async function createJob(req, res) {
  try {
    let data = req.body;
    data.postedAt = new Date().toISOString();
    let job = await jobsModel.create(data);
    return res
      .status(200)
      .json({ message: "job created successfully", job: job });
  } catch (err) {
    return res
      .status(500)
      .json({ err: err.message, message: "job apply error " });
  }
}

async function deleteJob(req, res) {
  try {
    let job_id = req.params.id;

    let jobs = await appliedJobsModel.findOneAndDelete({ job: job_id });
    jobs = await appliedJobsModel.find();

    await jobsModel.findByIdAndDelete(job_id);

    console.log("deleted job ", jobs);
    return res.status(200).json({ message: "done", jobs: jobs });
  } catch (err) {
    return res
      .status(500)
      .json({ err: err.message, message: "delete job error " });
  }
}

module.exports = jobsRouter;
