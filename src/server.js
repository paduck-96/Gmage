//서버사이드 프로그램 코딩
import express from "express";
import morgan from "morgan";
import mongoConnect from "connect-mongo";
import session from "express-session";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import gameRouter from "./routers/gameRouter.js";
import socketController from "./socketControllers.js";
import { localsMiddleware } from "./middlewares.js";

//server 연결시키기
const app = express();

//pug 활용
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//express 설정
//미들웨어 설정
app.use(morgan("dev"));
app.use(express.static(process.cwd() + "/src/static"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoConnect.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/game", gameRouter);

export default app;

app.get("/game", (req, res) => {
  res.render("game");
});
