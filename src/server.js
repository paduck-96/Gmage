//서버사이드 프로그램 코딩
import express from "express";
import morgan from "morgan";
import mongoConnect from "connect-mongo";
import session from "express-session";
import flash from "express-flash";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import gameRouter from "./routers/gameRouter.js";
import { localsMiddleware } from "./middlewares.js";

//server 연결시키기
const app = express();

//pug 활용
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoConnect.create({ mongoUrl: process.env.DB_URL }),
});
//express 설정
//미들웨어 설정
app.use(morgan("dev"));
app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(localsMiddleware);
app.use(express.static(process.cwd() + "/src/assets"));
app.use(express.static(process.cwd() + "/src/static"));
app.use(express.static(process.cwd() + "/src/models"));
app.use("/", rootRouter);
app.use("/game", gameRouter);
app.use("/users", userRouter);

export default app;
