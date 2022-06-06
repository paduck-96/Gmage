import express from "express";
import {
  login,
  kakaoLogout,
  startKakaoLogin,
  finishKakaoLogin,
  getSignup,
  postSignup,
  postLogin,
} from "../controllers/userControllers.js";

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.render("home");
});
rootRouter.route("/login").get(login).post(postLogin);
rootRouter.route("/login/start").get(startKakaoLogin);
rootRouter.route("/login/finish").get(finishKakaoLogin);
rootRouter.get("/logout", kakaoLogout);
rootRouter.route("/signup").get(getSignup).post(postSignup);

export default rootRouter;
