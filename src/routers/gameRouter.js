import express from "express";
import { home } from "../controllers/gameControllers.js";

const gameRouter = express.Router();

gameRouter.get("/", home);

export default gameRouter;
