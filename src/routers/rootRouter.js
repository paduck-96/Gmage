import express from "express";
import {
  login,
  logout,
  startKakaoLogin,
  finishKakaoLogin,
  getSignup,
  postSignup,
  postLogin,
} from "../controllers/userControllers.js";

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.render("index");
});
rootRouter.route("/login").get(login).post(postLogin);
rootRouter.route("/login/start").get(startKakaoLogin);
rootRouter.route("/login/finish").get(finishKakaoLogin);
rootRouter.route("/logout").get(logout);
rootRouter.route("/signup").get(getSignup).post(postSignup);

export default rootRouter;
