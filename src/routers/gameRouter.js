import express from "express";

const gameRouter = express.Router();

gameRouter.get("/", (req, res) => {
  res.render("game");
});

export default gameRouter;
