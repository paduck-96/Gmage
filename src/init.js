import "regenerator-runtime";
import "dotenv/config";
import "./db.js";
import "../models/User.js";
import { Server } from "socket.io";
import app from "./server.js";

const PORT = 5000;
const httpServer = app.listen(
  PORT,
  console.log(`Server...http://localhost:${PORT}`)
);

const io = new Server(httpServer);
io.on("connection", (socket) => socketController(socket));
