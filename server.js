// const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http").Server(app);

//// ! MEETING CODE

///// MEETIN CODE
// const PORT = 4000;
const cookieParser = require("cookie-parser");
// app.listen("4000", () => {
//   console.log("server started");
// });
// app.use(cors());
app.use(express.static("public/build"));
app.use(cookieParser()); /// req ki body ke ander , cookies ko populate kr deta hai  , ek tarike se req ke object me cookie ki key bna deta hai

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use(
//   cors({
//     origin: "http://jobs-portal-get-hired.herokuapp.com/",
//     credentials: true,
//   })
// );
const cors = require("cors");
// app.use(cors());
const corsOptions = {
  origin: "http://localhost:3001.com/",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const jobsRouter = require("./routers/jobsRouter");
const createJob = require("./routers/createJobRouter");

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/jobs", jobsRouter);
app.use("/create-job", createJob);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// const cors = require("cors");
// app.use(
//   cors({
//     origin: "*",
//   })
// );

// app.get("/", (req, res) => {
//   res.send({ status: "running" });
// });

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
    socket.on("code change", function (data) {
      socket.broadcast.to(roomId).emit("receive code", data);
    });
    socket.on("input change", function (data) {
      socket.broadcast.to(roomId).emit("receive input", data);
    });
    socket.on("output change", function (data) {
      socket.broadcast.to(roomId).emit("receive output", data);
    });
    socket.on("data-for-new-user", function (data) {
      socket.broadcast.to(roomId).emit("receive-data-for-new-user", data);
    });
    socket.on("mode-change-send", function (data) {
      socket.broadcast.to(roomId).emit("mode-change-receive", data);
    });
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
