import "regenerator-runtime";
import "dotenv/config";
import "./db.js";
import "../models/User.js";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./server.js";
import socketEvents from "./socketEvents.js";

const PORT = 5000;
const httpServer = createServer(app);
httpServer.listen(PORT, console.log(`Server...http://localhost:${PORT}`));

const io = new Server(httpServer);
io.on(
  "connection", //(socket) => socketEvents(socket, io)
  console.log(socket)
);
