import express from "express";
import User from "../models/User.js";
import {
  getEdit,
  postEdit,
  getPassword,
  postPassword,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).redirect("/");
  }
  res.render("profile", { pageTitle: `${user.nickname}의 프로필`, user });
});
userRouter.route("/:id/edit").get(getEdit).post(postEdit);
userRouter.route("/:id/password").get(getPassword).post(postPassword);

export default userRouter;
