import express from "express";
//import { home } from "../controllers/gameControllers.js";

const gameRouter = express.Router();

gameRouter.get("/game", (req, res) => {
  res.render("game");
});

export default gameRouter;
