import "regenerator-runtime";
import "dotenv/config";
import "./db.js";
import "./models/User.js";
import { createServer } from "http";
import { Server } from "socket.io";
import app, { sessionMiddleware } from "./server.js";
import socketEvents from "./socketEvents.js";

const PORT = 5000;
const httpServer = createServer(app);
const io = new Server(httpServer);

//socket 미들웨어
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

io.on("connection", (socket) => {
  socketEvents(socket, io);
});

httpServer.listen(PORT, console.log(`Server...http://localhost:${PORT}`));

export default io;
