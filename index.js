import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();
import { Server } from "socket.io";

import  http  from "http";

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static("public"));

import adminRouter from "./routes/admin.js";
import userRouter from "./routes/users.js";
import ownerRouter from "./routes/owner.js";

app.use("/owner", ownerRouter);
app.use("/admin", adminRouter);
app.use("/", userRouter);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "https://main.d3tsvzyxdn3mmt.amplifyapp.com/",
      methods: ["GET", "POST"],
    },
  });
  

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });

/* MONGOOSE SETUP */
const PORT = process.env.PORT;
mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        server.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect`));
