const cors = require("cors");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.listen("4000", () => {
  console.log("server started");
});
// app.use(cors());
app.use(cookieParser()); /// req ki body ke ander , cookies ko populate kr deta hai  , ek tarike se req ke object me cookie ki key bna deta hai

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const jobsRouter = require("./routers/jobsRouter");
const createJob = require("./routers/createJobRouter");

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/job", jobsRouter);
app.use("/create-job", createJob);
