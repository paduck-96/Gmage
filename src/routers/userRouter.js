import express from "express";
import User from "../models/User.js";

const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).redirect("/");
  }
  res.render("profile", { pageTitle: `${user.nickname}의 프로필`, user });
});

export default userRouter;
