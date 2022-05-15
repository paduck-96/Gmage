//서버사이드 프로그램 코딩
import express from "express";
import { Server } from "socket.io";
import morgan from "morgan";

//server 연결시키기
const app = express();
const PORT = 5000;
const httpServer = app.listen(
  PORT,
  console.log(`Server...https://localhost:${PORT}`)
);

//pug 활용
app.set("view engine", "pug");
app.set("views", process.cwd() + "/views");

//express 설정
//미들웨어 설정
app.use(morgan("dev"));
app.use(express.static(process.cwd() + "/static"));
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/game", (req, res) => {
  res.render("game");
});

//nickname 설정 불필요
//회원가입 정보에서 가져오기
const io = new Server(httpServer);
io.on("connection", (socket) => {
  socket.on("newMsg", (msg) => {
    socket.nickname = "익명";
    socket.broadcast.emit("sendMsg", { msg, nickname: socket.nickname });
  });
});
