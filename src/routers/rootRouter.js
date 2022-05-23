import express from "express";
import {
  login,
  kakaoLogout,
  startKakaoLogin,
  finishKakaoLogin,
} from "../controllers/userControllers.js";

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.render("home");
});
rootRouter.get("/login", login);
rootRouter.route("/login/start").get(startKakaoLogin);
rootRouter.route("/login/finish").get(finishKakaoLogin);
rootRouter.get("/logout", kakaoLogout);
/*
rootRouter.get("/game", (req, res) => {
  res.render("game");
});
*/
export default rootRouter;
